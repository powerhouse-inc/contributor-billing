import { useEffect, useMemo, useRef, useState } from "react";
import { useDrives } from "@powerhousedao/reactor-browser";
import {
  addSubteam,
  removeSubteam,
} from "../../../document-models/operational-hub-profile/gen/configuration/creators.js";

type BuilderProfileOption = {
  id: string;
  name: string;
  driveId: string;
};

type SubteamsPickerProps = {
  subteams: string[];
  dispatch: (
    action: ReturnType<typeof addSubteam> | ReturnType<typeof removeSubteam>,
  ) => void;
};

export function SubteamsPicker({ subteams, dispatch }: SubteamsPickerProps) {
  const drives = useDrives();
  const [query, setQuery] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const builderProfiles = useMemo<BuilderProfileOption[]>(() => {
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
            name: node.name || "Untitled builder",
            driveId: drive.header.id,
          })),
      );
  }, [drives]);

  // Filter out already selected subteams from the picker
  const subteamIdSet = new Set(subteams);
  const availableProfiles = builderProfiles.filter(
    (profile) => !subteamIdSet.has(profile.id),
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filteredProfiles = normalizedQuery
    ? availableProfiles.filter((profile) =>
        profile.name.toLowerCase().includes(normalizedQuery),
      )
    : availableProfiles.slice(0, 5);

  const handleSelect = (profile: BuilderProfileOption) => {
    dispatch(addSubteam({ subteam: profile.id }));
    setQuery("");
    setIsPickerOpen(false);
  };

  const handleManualSelect = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || subteamIdSet.has(trimmed)) return;
    dispatch(addSubteam({ subteam: trimmed }));
    setQuery("");
    setIsPickerOpen(false);
  };

  const handleRemoveSubteam = (subteamId: string) => {
    dispatch(removeSubteam({ subteam: subteamId }));
  };

  useEffect(() => {
    if (!isPickerOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        event.target instanceof Node &&
        !pickerRef.current.contains(event.target)
      ) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPickerOpen]);

  return (
    <div className="space-y-3">
      {/* List of current subteams */}
      {subteams.length > 0 && (
        <div className="space-y-2">
          {subteams.map((subteamId) => (
            <SubteamCard
              key={subteamId}
              subteamId={subteamId}
              builderProfiles={builderProfiles}
              onRemove={() => handleRemoveSubteam(subteamId)}
            />
          ))}
        </div>
      )}

      {/* Add subteam picker */}
      <div className="relative" ref={pickerRef}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setIsPickerOpen(true)}
            placeholder={
              subteams.length === 0
                ? "Search builder name to add subteam..."
                : "Add another subteam..."
            }
            className="flex-1 min-w-[280px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-400 dark:focus:ring-gray-800"
          />
        </div>
        {isPickerOpen && (
          <div className="absolute z-10 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <button
                  key={`${profile.driveId}-${profile.id}`}
                  type="button"
                  onClick={() => handleSelect(profile)}
                  className="flex w-full flex-col px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="font-medium">{profile.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {profile.id}
                  </span>
                </button>
              ))
            ) : (
              <>
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  {normalizedQuery
                    ? "No matching teams"
                    : "No more teams available"}
                </div>
                {normalizedQuery && !subteamIdSet.has(normalizedQuery) && (
                  <button
                    type="button"
                    onClick={() => handleManualSelect(query)}
                    className="flex w-full flex-col px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="font-medium">Use this ID</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {query}
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

type SubteamCardProps = {
  subteamId: string;
  builderProfiles: BuilderProfileOption[];
  onRemove: () => void;
};

function SubteamCard({
  subteamId,
  builderProfiles,
  onRemove,
}: SubteamCardProps) {
  const profile = builderProfiles.find((p) => p.id === subteamId);

  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {profile?.name || "Unknown team"}
          </div>
          <div className="mt-1 text-xs font-mono text-gray-500 dark:text-gray-400 truncate">
            {subteamId}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
          title="Remove subteam"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
