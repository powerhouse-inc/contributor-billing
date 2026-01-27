import { useEffect, useMemo, useRef, useState } from "react";
import { useDrives } from "@powerhousedao/reactor-browser";
import { setOperatorTeam } from "../../../document-models/operational-hub-profile/gen/configuration/creators.js";

type BuilderProfileOption = {
  id: string;
  name: string;
  driveId: string;
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

  const selectedProfile = useMemo(
    () => builderProfiles.find((profile) => profile.id === operatorTeam),
    [builderProfiles, operatorTeam],
  );

  const showPicker = !operatorTeam || isPickerOpen;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProfiles = normalizedQuery
    ? builderProfiles.filter((profile) =>
        profile.name.toLowerCase().includes(normalizedQuery),
      )
    : builderProfiles.slice(0, 5);
  const shouldShowOptions = isPickerOpen;

  const handleSelect = (profile: BuilderProfileOption) => {
    dispatch(setOperatorTeam({ operatorTeam: profile.id }));
    setQuery("");
    setIsPickerOpen(false);
  };

  const handleManualSelect = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    dispatch(setOperatorTeam({ operatorTeam: trimmed }));
    setQuery("");
    setIsPickerOpen(false);
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
    <div className="w-full">
      {showPicker ? (
        <div className="relative" ref={pickerRef}>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setIsPickerOpen(true)}
            placeholder="Search builder name"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-400 dark:focus:ring-gray-800"
          />
          {shouldShowOptions ? (
            filteredProfiles.length > 0 ? (
              <div className="absolute z-10 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                {filteredProfiles.map((profile) => (
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
                ))}
              </div>
            ) : (
              <div className="absolute z-10 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No matching builders
                </div>
                {normalizedQuery ? (
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
                ) : null}
              </div>
            )
          ) : null}
        </div>
      ) : (
        <div className="rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {selectedProfile?.name || "Unknown builder"}
          </div>
          <div className="mt-1 text-xs font-mono text-gray-500 dark:text-gray-400 truncate">
            {operatorTeam}
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Change operator team
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
