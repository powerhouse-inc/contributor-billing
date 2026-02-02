import { useCallback, useMemo } from "react";
import { useDrives } from "@powerhousedao/reactor-browser";
import { PHIDInput } from "@powerhousedao/document-engineering";
import { setOperatorTeam } from "../../../document-models/operational-hub-profile/gen/configuration/creators.js";

type ProfileOption = {
  id: string;
  label: string;
  value: string;
  title: string;
};

type SetOperatorTeamProps = {
  operatorTeam: string | null | undefined;
  dispatch: (action: ReturnType<typeof setOperatorTeam>) => void;
};

export function SetOperatorTeam({
  operatorTeam,
  dispatch,
}: SetOperatorTeamProps) {
  const drives = useDrives();

  // Build options from builder profiles in connected drives
  const builderProfileOptions = useMemo<ProfileOption[]>(() => {
    if (!drives) return [];
    return drives
      .filter(
        (drive) =>
          drive.header.documentType === "powerhouse/document-drive" &&
          drive.header.meta?.preferredEditor === "builder-team-admin",
      )
      .flatMap((drive) =>
        (drive.state.global.nodes ?? [])
          .filter(
            (node) =>
              node.kind === "file" &&
              "documentType" in node &&
              node.documentType === "powerhouse/builder-profile",
          )
          .map((node) => ({
            id: node.id,
            label: node.name || "Untitled builder",
            value: node.id,
            title: node.name || "Untitled builder",
          })),
      );
  }, [drives]);

  // Check if a value is a known PHID from options
  const isKnownPhid = useCallback(
    (phid: string) => builderProfileOptions.some((opt) => opt.value === phid),
    [builderProfileOptions],
  );

  const handleSave = useCallback(
    (phid: string) => {
      if (phid !== operatorTeam) {
        dispatch(setOperatorTeam({ operatorTeam: phid || null }));
      }
    },
    [dispatch, operatorTeam],
  );

  // Fetch options callback for search
  const fetchOptionsCallback = useCallback(
    (input: string): Promise<ProfileOption[]> => {
      const normalizedInput = input.toLowerCase().trim();
      if (!normalizedInput)
        return Promise.resolve(builderProfileOptions.slice(0, 10));
      return Promise.resolve(
        builderProfileOptions.filter(
          (opt) =>
            opt.label.toLowerCase().includes(normalizedInput) ||
            opt.value.toLowerCase().includes(normalizedInput),
        ),
      );
    },
    [builderProfileOptions],
  );

  return (
    <PHIDInput
      value={operatorTeam || ""}
      onChange={(newValue) => {
        // onChange is called when user selects from dropdown
        if (isKnownPhid(newValue)) {
          handleSave(newValue);
        }
      }}
      onBlur={() => {
        // Handle manual entry on blur - not directly available, handled via onChange
      }}
      placeholder="Search builder name or enter PHID"
      className="w-full"
      variant="withValueAndTitle"
      initialOptions={builderProfileOptions}
      fetchOptionsCallback={fetchOptionsCallback}
    />
  );
}
