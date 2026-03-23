#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# upload.sh — Create a drive from downloaded data on a target switchboard
#
# Uses only switchboard CLI commands (no model-specific GraphQL).
#
# Usage:
#   bash upload.sh <data-dir> [drive-name]
#
# Environment:
#   SB_PROFILE    Switchboard profile to use (optional)
#   ID_MAP_FILE   Path to write the ID mapping JSON (old→new). Default: <data-dir>/id-map.json
#   PREFERRED_EDITOR  Drive editor override (default: builder-team-admin)
#
# Example:
#   SB_PROFILE=local bash upload.sh data/powerhouse-operator-team-admin
###############################################################################

DATA_DIR="${1:?Usage: $0 <data-dir> [drive-name]}"
DRIVE_NAME="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ID_MAP_FILE="${ID_MAP_FILE:-$DATA_DIR/id-map.json}"
PREFERRED_EDITOR="${PREFERRED_EDITOR:-}"

[ -f "$DATA_DIR/manifest.json" ] || { echo "Error: $DATA_DIR/manifest.json not found" >&2; exit 1; }

# Use profile if set
if [ -n "${SB_PROFILE:-}" ]; then
  switchboard config use "$SB_PROFILE" >/dev/null 2>&1
fi

source "$SCRIPT_DIR/lib/common.sh"

# ── Preflight ────────────────────────────────────────────────────────────────

step "Preflight"
preflight
log "Data dir: $DATA_DIR"

# ── Safety check ─────────────────────────────────────────────────────────────

confirm_target "upload drives/documents to"

# ── Compat check ─────────────────────────────────────────────────────────────

step "Compatibility check"

REQUIRED_TYPES=$(python3 -c "
import json
with open('$DATA_DIR/manifest.json') as f:
    m = json.load(f)
types = sorted(set(d['type'] for d in m['documents']))
for t in types:
    print(t)
")

# shellcheck disable=SC2086
compat_check $REQUIRED_TYPES || true

# ── Upload ───────────────────────────────────────────────────────────────────

step "Creating drive from downloaded data"

export DATA_DIR DRIVE_NAME ID_MAP_FILE PREFERRED_EDITOR

python3 << 'PYEOF'
import subprocess, json, sys, os, tempfile, uuid, datetime, time

data_dir = os.environ["DATA_DIR"]
drive_name_override = os.environ.get("DRIVE_NAME", "").strip()
id_map_file = os.environ["ID_MAP_FILE"]
preferred_editor = os.environ.get("PREFERRED_EDITOR", "")

G = "\033[0;32m"
Y = "\033[1;33m"
R = "\033[0;31m"
C = "\033[0;36m"
NC = "\033[0m"

def log(msg):  print(f"  {G}✓{NC} {msg}", flush=True)
def warn(msg): print(f"  {Y}!{NC} {msg}", flush=True)
def errf(msg): print(f"  {R}✗{NC} {msg}", flush=True)
def step(msg): print(f"\n{C}━━━ {msg} ━━━{NC}", flush=True)

# ── Read manifest ────────────────────────────────────────────────────────────

with open(os.path.join(data_dir, "manifest.json")) as f:
    manifest = json.load(f)

drive_name = drive_name_override or manifest["source"]["name"]

# Read preferred editor from drive-info.json if available
source_preferred_editor = None
try:
    with open(os.path.join(data_dir, "drive-info.json")) as f:
        drive_info = json.load(f)
        source_preferred_editor = drive_info.get("preferredEditor")
except Exception:
    pass
# Use: env override > source drive info > nothing
if not preferred_editor and source_preferred_editor:
    preferred_editor = source_preferred_editor

log(f"Source: {manifest['source']['slug']} ({manifest['source']['downloadedAt']})")
log(f"Drive name: {drive_name}")
log(f"Documents: {len(manifest['documents'])}, Folders: {len(manifest['folders'])}")

# ── Helpers ──────────────────────────────────────────────────────────────────

def sb_run(*args, check=True):
    """Run switchboard CLI command, return stdout."""
    cmd = ["switchboard"] + list(args) + ["--format", "json"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if check and result.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(cmd)}\n{result.stderr[:500]}")
    return result.stdout

def sb_run_raw(*args, check=True):
    """Run switchboard CLI command without appending --format json."""
    cmd = ["switchboard"] + list(args)
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if check and result.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(cmd)}\n{result.stderr[:500]}")
    return result.stdout

def wait_for_doc(doc_id, timeout=15):
    """Poll until a document is accessible via docs get, or timeout."""
    for i in range(timeout):
        result = subprocess.run(
            ["switchboard", "docs", "get", doc_id, "--format", "json"],
            capture_output=True, text=True, timeout=10,
        )
        if result.returncode == 0:
            return True
        time.sleep(1)
    return False

def apply_actions(doc_id, actions, retries=3):
    """Apply actions to a document using docs apply --wait.
    This blocks until the reactor has fully processed the job — no race conditions.
    Works for single actions or batches."""
    if not actions:
        return
    if isinstance(actions, dict):
        actions = [actions]
    # Inject timestampUtcMs as ISO-8601 string — the reactor's operation store
    # does new Date(timestampUtcMs) which works with ISO strings but NOT with
    # numeric strings. GraphQL JSONObject serialization may coerce numbers to strings.
    now_iso = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + \
        f"{datetime.datetime.now(datetime.timezone.utc).microsecond // 1000:03d}Z"
    for action in actions:
        if "timestampUtcMs" not in action:
            action["timestampUtcMs"] = now_iso
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        json.dump(actions, f)
        tmppath = f.name
    try:
        for attempt in range(retries):
            result = subprocess.run(
                ["switchboard", "docs", "apply", doc_id,
                 "--file", tmppath, "--wait", "--format", "json"],
                capture_output=True, text=True, timeout=120,
            )
            if result.returncode == 0:
                return
            if attempt < retries - 1:
                wait = (attempt + 1) * 3
                warn(f"  apply failed (attempt {attempt+1}): {result.stderr[:100]}... retrying in {wait}s")
                time.sleep(wait)
        raise RuntimeError(f"apply on {doc_id} failed after {retries} attempts: {result.stderr[:300]}")
    finally:
        os.unlink(tmppath)

def mutate(doc_id, op, input_data, retries=3):
    """Mutate a single document using docs mutate --op (handles operation name casing).
    For batch operations on the same document, prefer apply_actions()."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        json.dump(input_data, f)
        tmppath = f.name
    try:
        for attempt in range(retries):
            result = subprocess.run(
                ["switchboard", "docs", "mutate", doc_id, "--op", op,
                 "--input-file", tmppath, "--format", "json", "--quiet"],
                capture_output=True, text=True, timeout=30,
            )
            if result.returncode == 0:
                return
            if attempt < retries - 1:
                wait = (attempt + 1) * 2
                warn(f"  mutate {op} failed (attempt {attempt+1}): {result.stderr[:100]}... retrying in {wait}s")
                time.sleep(wait)
        raise RuntimeError(f"mutate {doc_id} --op {op} failed after {retries} attempts: {result.stderr[:200]}")
    finally:
        os.unlink(tmppath)

def load_state(doc_id):
    """Load downloaded state for a document."""
    path = os.path.join(data_dir, "states", f"{doc_id}.json")
    if not os.path.exists(path):
        return None
    with open(path) as f:
        return json.load(f)

# ── Verification helpers ──────────────────────────────────────────────────────

def get_drive_tree(drive_slug_or_id):
    """Fetch the drive tree and return parsed nodes list."""
    try:
        stdout = sb_run("docs", "tree", drive_slug_or_id)
        tree = json.loads(stdout)
        return tree["document"]["state"]["global"]["nodes"]
    except Exception:
        return []

def verify_drive(drive_slug_or_id):
    """Verify a drive exists and is accessible."""
    try:
        stdout = sb_run("drives", "get", drive_slug_or_id)
        data = json.loads(stdout)
        return data.get("id") is not None
    except Exception:
        return False

def verify_folders(drive_slug_or_id, expected_count):
    """Verify folder count in drive matches expected."""
    nodes = get_drive_tree(drive_slug_or_id)
    folders = [n for n in nodes if n.get("kind") == "folder"]
    if len(folders) == expected_count:
        log(f"Verified: {len(folders)} folders")
        return True
    else:
        errf(f"Folder count mismatch: expected {expected_count}, got {len(folders)}")
        return False

def verify_documents(drive_slug_or_id, expected_count):
    """Verify file count in drive matches expected."""
    nodes = get_drive_tree(drive_slug_or_id)
    files = [n for n in nodes if n.get("kind") == "file"]
    if len(files) == expected_count:
        log(f"Verified: {len(files)} documents")
        return True
    else:
        errf(f"Document count mismatch: expected {expected_count}, got {len(files)}")
        return False

def verify_placements(drive_slug_or_id, expected_placements):
    """Verify documents are in the correct folders.
    expected_placements: dict of {new_doc_id: new_folder_id}"""
    nodes = get_drive_tree(drive_slug_or_id)
    node_map = {n["id"]: n for n in nodes}
    misplaced = []
    for doc_id, expected_folder in expected_placements.items():
        node = node_map.get(doc_id)
        if not node:
            misplaced.append(f"  {doc_id}: not found in tree")
        elif node.get("parentFolder") != expected_folder:
            misplaced.append(f"  {doc_id}: expected folder {expected_folder}, got {node.get('parentFolder')}")
    if not misplaced:
        log(f"Verified: all {len(expected_placements)} documents in correct folders")
        return True
    else:
        errf(f"{len(misplaced)} document(s) misplaced:")
        for m in misplaced[:5]:
            errf(m)
        return False

def verify_doc_state(doc_id, checks):
    """Verify specific fields in a document's global state.
    checks: dict of {field_path: expected_value} or {field_path: callable}.
    Field paths use dots: 'isOperator', 'operatorId', etc."""
    try:
        stdout = sb_run("docs", "get", doc_id, "--state")
        data = json.loads(stdout)
        state = data.get("state", {}).get("global", {})
    except Exception as e:
        errf(f"Failed to fetch state for {doc_id}: {e}")
        return False

    all_ok = True
    for field, expected in checks.items():
        actual = state.get(field)
        if callable(expected):
            if not expected(actual):
                errf(f"  {field}: check failed (got {repr(actual)[:80]})")
                all_ok = False
        elif actual != expected:
            errf(f"  {field}: expected {repr(expected)[:50]}, got {repr(actual)[:50]}")
            all_ok = False
    return all_ok

# ID mapping: old staging ID → new local ID
id_map = {}

def map_id(old_id):
    """Resolve an old ID to its new counterpart, or return as-is."""
    if not old_id:
        return old_id
    return id_map.get(old_id, old_id)

timestamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

# ── Step 1: Create drive ─────────────────────────────────────────────────────

step("Step 1: Create drive")

create_args = ["drives", "create", "--name", drive_name]
if preferred_editor:
    create_args += ["--preferred-editor", preferred_editor]
result = json.loads(sb_run(*create_args))
drive_id = result["id"]
drive_slug = result["slug"]
log(f"Drive: {drive_name} (ID: {drive_id}, Slug: {drive_slug})")

# Wait for drive to be fully committed before proceeding
for attempt in range(5):
    time.sleep(1)
    if verify_drive(drive_slug):
        log("Drive verified")
        break
    if attempt < 4:
        warn(f"Drive not ready yet, waiting... (attempt {attempt+1})")
else:
    errf("Drive verification failed after 5 attempts — aborting")
    sys.exit(1)

# ── Step 2: Create folders ───────────────────────────────────────────────────

step("Step 2: Create folders")

def sort_folders(folders):
    """Topological sort: parents before children."""
    by_id = {f["id"]: f for f in folders}
    result = []
    visited = set()
    def visit(folder):
        if folder["id"] in visited:
            return
        parent = folder.get("parentFolder")
        if parent and parent in by_id:
            visit(by_id[parent])
        visited.add(folder["id"])
        result.append(folder)
    for f in folders:
        visit(f)
    return result

folder_actions = []
for folder in sort_folders(manifest["folders"]):
    new_id = str(uuid.uuid4())
    id_map[folder["id"]] = new_id
    inp = {"id": new_id, "name": folder["name"]}
    parent = folder.get("parentFolder")
    if parent:
        inp["parentFolder"] = id_map.get(parent, parent)
    folder_actions.append({"type": "ADD_FOLDER", "input": inp, "scope": "global"})
    log(f"Folder: {folder['name']}")

apply_actions(drive_id, folder_actions)

# Verify folders
verify_folders(drive_slug, len(manifest["folders"]))

# ── Step 3: Create documents ─────────────────────────────────────────────────

step("Step 3: Create documents")

# Order: builder-profiles first, then RTs, then SOs, then others
type_order = {
    "powerhouse/builder-profile": 0,
    "powerhouse/resource-template": 1,
    "powerhouse/service-offering": 2,
}
docs_sorted = sorted(manifest["documents"], key=lambda d: type_order.get(d["type"], 99))

def create_document(doc_type, doc_name, drive_slug_or_id, retries=3):
    """Create a document with retry. Uses CLI docs create."""
    last_err = None
    for attempt in range(retries):
        try:
            result = subprocess.run(
                ["switchboard", "docs", "create", "--type", doc_type,
                 "--name", doc_name, "--drive", drive_slug_or_id, "--format", "json"],
                capture_output=True, text=True, timeout=30,
            )
            if result.returncode == 0:
                data = json.loads(result.stdout)
                new_id = None
                # Parse response — handles multiple formats:
                # {"Prefix_createDocument": {"id": "..."}}
                # {"Prefix": {"createDocument": {"id": "..."}}}
                # {"id": "..."}
                # [{"id": "..."}]
                if isinstance(data, dict):
                    # Recursively find first "id" value in nested dicts
                    def find_id(obj):
                        if isinstance(obj, dict):
                            if "id" in obj and isinstance(obj["id"], str):
                                return obj["id"]
                            for v in obj.values():
                                r = find_id(v)
                                if r:
                                    return r
                        return None
                    new_id = find_id(data)
                elif isinstance(data, list) and data and isinstance(data[0], dict):
                    new_id = data[0].get("id")
                if not new_id:
                    raise RuntimeError(f"Could not parse ID from: {json.dumps(data)[:200]}")
                # Wait for doc to be fully committed before returning
                if not wait_for_doc(new_id):
                    warn(f"  Doc {new_id} created but not yet accessible — proceeding anyway")
                return new_id
            else:
                last_err = result.stderr[:300]
        except subprocess.TimeoutExpired:
            last_err = "timeout"
        except Exception as e:
            last_err = str(e)

        if attempt < retries - 1:
            wait = (attempt + 1) * 3
            warn(f"  create {doc_name} failed (attempt {attempt+1}): {last_err[:100]}... retrying in {wait}s")
            time.sleep(wait)

    raise RuntimeError(f"Failed after {retries} attempts: {last_err}")

for doc in docs_sorted:
    doc_type = doc["type"]

    try:
        new_id = create_document(doc_type, doc["name"], drive_id)
        id_map[doc["id"]] = new_id
        log(f"{doc['name']} ({doc_type}) → {new_id}")
    except Exception as e:
        errf(f"Failed to create {doc['name']}: {e}")

# Verify document count
created_count = sum(1 for d in manifest["documents"] if d["id"] in id_map)
verify_documents(drive_slug, created_count)

# ── Step 4: Move documents to folders ─────────────────────────────────────────

step("Step 4: Move documents to folders")

move_actions = []
for doc in manifest["documents"]:
    new_doc_id = id_map.get(doc["id"])
    parent = doc.get("parentFolder")
    if not new_doc_id or not parent:
        continue
    new_parent = id_map.get(parent)
    if not new_parent:
        continue
    move_actions.append({
        "type": "MOVE_NODE",
        "input": {"srcFolder": new_doc_id, "targetParentFolder": new_parent},
        "scope": "global",
    })

if move_actions:
    apply_actions(drive_id, move_actions)

log(f"Moved {len(move_actions)} documents to folders")

# Verify placements
expected_placements = {}
for doc in manifest["documents"]:
    new_doc_id = id_map.get(doc["id"])
    parent = doc.get("parentFolder")
    if new_doc_id and parent:
        new_parent = id_map.get(parent)
        if new_parent:
            expected_placements[new_doc_id] = new_parent
if expected_placements:
    time.sleep(1)
    verify_placements(drive_slug, expected_placements)

# ── Step 5: Apply document states ─────────────────────────────────────────────

step("Step 5: Apply document states")

# ── Builder Profile handler ──

def apply_builder_profile(old_id, new_id, state):
    if not state:
        return
    ops = 0

    # isOperator
    if state.get("isOperator"):
        mutate(new_id, "setOperator", {"isOperator": True})
        ops += 1

    # Profile fields
    profile = {}
    for key in ("name", "slug", "code", "icon", "description", "about", "status"):
        if state.get(key) is not None:
            profile[key] = state[key]
    if state.get("id"):
        profile["id"] = state["id"]
    if profile:
        mutate(new_id, "updateProfile", profile)
        ops += 1

    # Links
    for link in state.get("links") or []:
        mutate(new_id, "addLink", {
            "id": link["id"],
            "label": link.get("label"),
            "url": link.get("url"),
        })
        ops += 1

    # Skills
    for skill in state.get("skills") or []:
        if isinstance(skill, str):
            mutate(new_id, "addSkill", {"skill": skill})
        elif isinstance(skill, dict):
            mutate(new_id, "addSkill", skill)
        ops += 1

    # Scopes
    for scope in state.get("scopes") or []:
        if isinstance(scope, str):
            mutate(new_id, "addScope", {"scope": scope})
        elif isinstance(scope, dict):
            mutate(new_id, "addScope", scope)
        ops += 1

    # Contributors (remap IDs)
    for contrib_id in state.get("contributors") or []:
        mapped = map_id(contrib_id)
        mutate(new_id, "addContributor", {"contributorPHID": mapped})
        ops += 1

    # Op hub member
    ohm = state.get("operationalHubMember")
    if ohm and (ohm.get("name") or ohm.get("phid")):
        mutate(new_id, "setOpHubMember", {
            "name": ohm.get("name"),
            "phid": map_id(ohm.get("phid")),
        })
        ops += 1

    log(f"Builder profile state applied ({ops} ops)")


# ── Resource Template handler ──

def apply_resource_template(old_id, new_id, state):
    if not state:
        return
    ops = 0

    # Template info
    info = {"lastModified": timestamp}
    for key in ("title", "summary", "description", "thumbnailUrl", "infoLink"):
        if state.get(key) is not None:
            info[key] = state[key]
    mutate(new_id, "updateTemplateInfo", info)
    ops += 1

    # Status
    if state.get("status"):
        mutate(new_id, "updateTemplateStatus", {"status": state["status"], "lastModified": timestamp})
        ops += 1

    # Operator
    if state.get("operatorId"):
        mutate(new_id, "setOperator", {"operatorId": map_id(state["operatorId"]), "lastModified": timestamp})
        ops += 1

    # Target audiences
    for aud in state.get("targetAudiences") or []:
        mutate(new_id, "addTargetAudience", {
            "id": aud["id"], "label": aud["label"],
            "color": aud.get("color"), "lastModified": timestamp,
        })
        ops += 1

    # Facet targets
    for ft in state.get("facetTargets") or []:
        mutate(new_id, "setFacetTarget", {
            "id": ft["id"], "categoryKey": ft["categoryKey"],
            "categoryLabel": ft["categoryLabel"],
            "selectedOptions": ft["selectedOptions"],
            "lastModified": timestamp,
        })
        ops += 1

    # Setup / recurring services
    if state.get("setupServices"):
        mutate(new_id, "setSetupServices", {"services": state["setupServices"], "lastModified": timestamp})
        ops += 1
    if state.get("recurringServices"):
        mutate(new_id, "setRecurringServices", {"services": state["recurringServices"], "lastModified": timestamp})
        ops += 1

    # Option groups
    for og in state.get("optionGroups") or []:
        og_input = {"id": og["id"], "name": og["name"], "lastModified": timestamp}
        for key in ("description", "isAddOn", "defaultSelected"):
            if og.get(key) is not None:
                og_input[key] = og[key]
        mutate(new_id, "addOptionGroup", og_input)
        ops += 1

    # Services
    for svc in state.get("services") or []:
        svc_input = {
            "id": svc["id"], "title": svc["title"],
            "isSetupFormation": svc.get("isSetupFormation", False),
            "lastModified": timestamp,
        }
        for key in ("description", "displayOrder", "optionGroupId", "parentServiceId"):
            if svc.get(key) is not None:
                svc_input[key] = svc[key]
        # Facet bindings
        if svc.get("facetBindings"):
            svc_input["facetBindings"] = svc["facetBindings"]
        mutate(new_id, "addService", svc_input)
        ops += 1

    # FAQs
    for faq in state.get("faqFields") or []:
        mutate(new_id, "addFaq", {
            "id": faq["id"],
            "question": faq.get("question"),
            "answer": faq.get("answer"),
            "displayOrder": faq.get("displayOrder", 0),
        })
        ops += 1

    # Content sections
    for cs in state.get("contentSections") or []:
        mutate(new_id, "addContentSection", {
            "id": cs["id"], "title": cs["title"],
            "content": cs["content"],
            "displayOrder": cs.get("displayOrder", 0),
            "lastModified": timestamp,
        })
        ops += 1

    log(f"Resource template state applied ({ops} ops)")


# ── Service Offering handler ──

def apply_service_offering(old_id, new_id, state):
    if not state:
        return
    ops = 0

    # Offering info
    info = {"lastModified": timestamp}
    for key in ("title", "summary", "description", "thumbnailUrl", "infoLink"):
        if state.get(key) is not None:
            info[key] = state[key]
    mutate(new_id, "updateOfferingInfo", info)
    ops += 1

    # Status
    if state.get("status"):
        mutate(new_id, "updateOfferingStatus", {"status": state["status"], "lastModified": timestamp})
        ops += 1

    # Operator
    if state.get("operatorId"):
        mutate(new_id, "setOperator", {"operatorId": map_id(state["operatorId"]), "lastModified": timestamp})
        ops += 1

    # Resource template link
    if state.get("resourceTemplateId"):
        mutate(new_id, "selectResourceTemplate", {
            "resourceTemplateId": map_id(state["resourceTemplateId"]),
            "lastModified": timestamp,
        })
        ops += 1

    # Billing cycles
    if state.get("availableBillingCycles"):
        mutate(new_id, "setAvailableBillingCycles", {
            "billingCycles": state["availableBillingCycles"],
            "lastModified": timestamp,
        })
        ops += 1

    # Facet targets
    for ft in state.get("facetTargets") or []:
        mutate(new_id, "setFacetTarget", {
            "id": ft["id"], "categoryKey": ft["categoryKey"],
            "categoryLabel": ft["categoryLabel"],
            "selectedOptions": ft["selectedOptions"],
            "lastModified": timestamp,
        })
        ops += 1

    # Option groups (before services that reference them)
    for og in state.get("optionGroups") or []:
        og_input = {
            "id": og["id"], "name": og["name"],
            "isAddOn": og.get("isAddOn", False),
            "defaultSelected": og.get("defaultSelected", False),
            "lastModified": timestamp,
        }
        for key in ("description", "costType", "currency", "price", "availableBillingCycles"):
            if og.get(key) is not None:
                og_input[key] = og[key]
        mutate(new_id, "addOptionGroup", og_input)
        ops += 1

        # Billing cycle discounts
        for bcd in og.get("billingCycleDiscounts") or []:
            mutate(new_id, "setOptionGroupBillingCycleDiscount", {
                "optionGroupId": og["id"],
                "billingCycle": bcd["billingCycle"],
                "discountRule": bcd["discountRule"],
                "lastModified": timestamp,
            })
            ops += 1

        # Standalone pricing
        sp = og.get("standalonePricing")
        if sp:
            sp_input = {"optionGroupId": og["id"], "lastModified": timestamp}
            if sp.get("setupCost"):
                sp_input["setupCost"] = sp["setupCost"]
            sp_input["recurringPricing"] = sp.get("recurringPricing") or []
            mutate(new_id, "setOptionGroupStandalonePricing", sp_input)
            ops += 1

    # Services
    for svc in state.get("services") or []:
        svc_input = {
            "id": svc["id"], "title": svc["title"],
            "isSetupFormation": svc.get("isSetupFormation", False),
            "lastModified": timestamp,
        }
        for key in ("description", "displayOrder", "optionGroupId"):
            if svc.get(key) is not None:
                svc_input[key] = svc[key]
        mutate(new_id, "addService", svc_input)
        ops += 1

    # Tiers
    for tier in state.get("tiers") or []:
        tier_input = {
            "id": tier["id"], "name": tier["name"],
            "isCustomPricing": tier.get("isCustomPricing", False),
            "lastModified": timestamp,
        }
        if tier.get("description") is not None:
            tier_input["description"] = tier["description"]
        pricing = tier.get("pricing") or {}
        tier_input["currency"] = pricing.get("currency", "USD")
        if pricing.get("amount") is not None:
            tier_input["amount"] = pricing["amount"]
        mutate(new_id, "addTier", tier_input)
        ops += 1

        # Tier base pricing
        if pricing.get("amount") is not None and pricing["amount"] > 0:
            mutate(new_id, "updateTierPricing", {
                "tierId": tier["id"],
                "amount": pricing["amount"],
                "currency": pricing.get("currency", "USD"),
                "lastModified": timestamp,
            })
            ops += 1

        # Default billing cycle
        if tier.get("defaultBillingCycle"):
            mutate(new_id, "setTierDefaultBillingCycle", {
                "tierId": tier["id"],
                "defaultBillingCycle": tier["defaultBillingCycle"],
                "lastModified": timestamp,
            })
            ops += 1

        # Billing cycle discounts
        for bcd in tier.get("billingCycleDiscounts") or []:
            mutate(new_id, "setTierBillingCycleDiscount", {
                "tierId": tier["id"],
                "billingCycle": bcd["billingCycle"],
                "discountRule": bcd["discountRule"],
                "lastModified": timestamp,
            })
            ops += 1

        # Service levels
        for sl in tier.get("serviceLevels") or []:
            sl_input = {
                "tierId": tier["id"],
                "serviceLevelId": sl["id"],
                "serviceId": sl["serviceId"],
                "level": sl["level"],
                "lastModified": timestamp,
            }
            for key in ("optionGroupId", "customValue"):
                if sl.get(key) is not None:
                    sl_input[key] = sl[key]
            mutate(new_id, "addServiceLevel", sl_input)
            ops += 1

        # Usage limits
        for ul in tier.get("usageLimits") or []:
            ul_input = {
                "tierId": tier["id"],
                "limitId": ul["id"],
                "serviceId": ul["serviceId"],
                "metric": ul["metric"],
                "lastModified": timestamp,
            }
            for key in ("unitName", "freeLimit", "paidLimit", "resetCycle",
                        "unitPrice", "unitPriceCurrency", "notes"):
                if ul.get(key) is not None:
                    ul_input[key] = ul[key]
            mutate(new_id, "addUsageLimit", ul_input)
            ops += 1

    # Tier-dependent pricing (after tiers exist)
    for og in state.get("optionGroups") or []:
        for tp in og.get("tierDependentPricing") or []:
            tp_input = {
                "optionGroupId": og["id"],
                "tierPricingId": tp["id"],
                "tierId": tp["tierId"],
                "recurringPricing": tp.get("recurringPricing") or [],
                "lastModified": timestamp,
            }
            if tp.get("setupCost"):
                tp_input["setupCost"] = tp["setupCost"]
            if tp.get("setupCostDiscounts"):
                tp_input["setupCostDiscounts"] = tp["setupCostDiscounts"]
            mutate(new_id, "addOptionGroupTierPricing", tp_input)
            ops += 1

    log(f"Service offering state applied ({ops} ops)")


# ── Generic handler via mutation introspection ──

_input_type_cache = {}

def sb_query(query):
    stdout = sb_run_raw("query", query, "--format", "json")
    return json.loads(stdout) if stdout.strip() else None

def unwrap_gql_type(t):
    while t and t.get("kind") in ("NON_NULL", "LIST"):
        t = t.get("ofType") or {}
    return t or {"kind": "SCALAR", "name": "String"}

def get_input_fields(input_type_name):
    if input_type_name in _input_type_cache:
        return _input_type_cache[input_type_name]
    try:
        data = sb_query(
            '{ __type(name: "' + input_type_name + '") { name inputFields { name type { name kind ofType { name kind ofType { name kind } } } } } }'
        )
    except Exception:
        _input_type_cache[input_type_name] = []
        return []
    fields = (data or {}).get("__type", {}).get("inputFields") or []
    _input_type_cache[input_type_name] = fields
    return fields

def type_to_prefix(doc_type):
    name = doc_type.split("/")[-1]
    return "".join(word.capitalize() for word in name.split("-"))

def discover_operations(doc_type):
    """Discover available mutations for a type using switchboard models get."""
    try:
        stdout = sb_run("models", "get", doc_type)
        data = json.loads(stdout)
        return data.get("operations", [])
    except Exception:
        return []

def apply_generic_state(old_id, new_id, state, doc_type):
    """Apply state for any document type by discovering its operations."""
    prefix = type_to_prefix(doc_type)
    operations = discover_operations(doc_type)

    if not operations:
        warn(f"No operations discovered for {doc_type} — left empty")
        return

    ops_done = 0

    # Phase 1: set/update mutations → match to scalar state fields
    for op_info in operations:
        op_name = op_info["operation"]
        if op_name == "createDocument":
            continue
        if not (op_name.startswith("set") or op_name.startswith("update")):
            continue

        # Find the 'input' argument type
        input_type_name = None
        for arg in op_info.get("args", []):
            if arg["name"] == "input":
                input_type_name = arg["type_name"]
                break
        if not input_type_name:
            continue

        input_fields = get_input_fields(input_type_name)
        if not input_fields:
            continue

        input_data = {}
        for field in input_fields:
            fname = field["name"]
            if fname == "lastModified":
                input_data[fname] = timestamp
            elif fname in state and state[fname] is not None:
                input_data[fname] = state[fname]

        real_fields = {k for k in input_data if k != "lastModified"}
        if not real_fields:
            continue

        try:
            mutate(new_id, op_name, input_data)
            ops_done += 1
        except Exception:
            pass

    # Phase 2: add mutations → match to state arrays
    consumed_arrays = set()
    for op_info in operations:
        op_name = op_info["operation"]
        if not op_name.startswith("add"):
            continue

        input_type_name = None
        for arg in op_info.get("args", []):
            if arg["name"] == "input":
                input_type_name = arg["type_name"]
                break
        if not input_type_name:
            continue

        input_fields = get_input_fields(input_type_name)
        if not input_fields:
            continue

        field_names = {f["name"] for f in input_fields} - {"lastModified"}

        # Find best matching array in state
        best_key = None
        best_score = 0
        for state_key, state_val in state.items():
            if not isinstance(state_val, list) or not state_val:
                continue
            if state_key in consumed_arrays:
                continue
            sample = state_val[0]
            if not isinstance(sample, dict):
                continue
            overlap = len(field_names & set(sample.keys()))
            if overlap > best_score and overlap >= max(1, len(field_names) * 0.4):
                best_score = overlap
                best_key = state_key

        if not best_key:
            continue

        consumed_arrays.add(best_key)
        for item in state[best_key]:
            item_input = {}
            for f in input_fields:
                fname = f["name"]
                if fname == "lastModified":
                    item_input[fname] = timestamp
                elif fname in item and item[fname] is not None:
                    item_input[fname] = item[fname]
            try:
                mutate(new_id, op_name, item_input)
                ops_done += 1
            except Exception as e:
                warn(f"  {op_name} failed: {e}")
                break

    log(f"Generic state applied for {doc_type} ({ops_done} ops)")


# ── Apply states to all documents ─────────────────────────────────────────────

HANDLERS = {
    "powerhouse/builder-profile": apply_builder_profile,
    "powerhouse/resource-template": apply_resource_template,
    "powerhouse/service-offering": apply_service_offering,
}

for doc in docs_sorted:
    new_id = id_map.get(doc["id"])
    if not new_id:
        continue
    state = load_state(doc["id"])
    if state is None:
        continue

    handler = HANDLERS.get(doc["type"])
    if handler:
        try:
            handler(doc["id"], new_id, state)
        except Exception as e:
            errf(f"Error applying state for '{doc['name']}': {e}")
    else:
        try:
            apply_generic_state(doc["id"], new_id, state, doc["type"])
        except Exception as e:
            errf(f"Error applying generic state for '{doc['name']}': {e}")

# ── Step 6: Verify applied states ─────────────────────────────────────────────

step("Step 6: Verify applied states")

verified = 0
verify_failed = 0

for doc in docs_sorted:
    new_id = id_map.get(doc["id"])
    if not new_id:
        continue
    state = load_state(doc["id"])
    if not state:
        continue

    doc_type = doc["type"]
    checks = {}

    if doc_type == "powerhouse/builder-profile":
        if state.get("isOperator"):
            checks["isOperator"] = True
        if state.get("name"):
            checks["name"] = state["name"]
        if state.get("slug"):
            checks["slug"] = state["slug"]
    elif doc_type == "powerhouse/resource-template":
        if state.get("operatorId"):
            checks["operatorId"] = map_id(state["operatorId"])
        if state.get("title"):
            checks["title"] = state["title"]
        if state.get("status"):
            checks["status"] = state["status"]
    elif doc_type == "powerhouse/service-offering":
        if state.get("operatorId"):
            checks["operatorId"] = map_id(state["operatorId"])
        if state.get("title"):
            checks["title"] = state["title"]
        if state.get("resourceTemplateId"):
            checks["resourceTemplateId"] = map_id(state["resourceTemplateId"])

    if not checks:
        continue

    ok = verify_doc_state(new_id, checks)
    if ok:
        verified += 1
        log(f"Verified: {doc['name']} ({len(checks)} checks)")
    else:
        verify_failed += 1
        errf(f"Verification failed: {doc['name']}")

if verified > 0 or verify_failed > 0:
    log(f"State verification: {verified} passed, {verify_failed} failed")

# ── Save ID map ──────────────────────────────────────────────────────────────

with open(id_map_file, "w") as f:
    json.dump(id_map, f, indent=2)
log(f"ID map saved to {id_map_file}")

# ── Final summary ─────────────────────────────────────────────────────────────

step("Summary")
log(f"Drive: {drive_name} (ID: {drive_id}, Slug: {drive_slug})")

type_counts = {}
for doc in manifest["documents"]:
    t = doc["type"]
    if doc["id"] in id_map:
        type_counts[t] = type_counts.get(t, 0) + 1
for t, count in sorted(type_counts.items()):
    mode = "dedicated handler" if t in HANDLERS else "generic introspection"
    log(f"  {t}: {count} ({mode})")

print()
log(f"Open in Connect:")
print(f"  {C}http://localhost:3001/?driveUrl=http://localhost:4001/d/{drive_id}{NC}")
print()
log("Done!")
PYEOF
