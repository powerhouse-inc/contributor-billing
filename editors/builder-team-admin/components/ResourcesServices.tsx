import { FileItem } from "@powerhousedao/design-system/connect";
import { FolderItem } from "@powerhousedao/design-system/connect";
import {
  isFolderNodeKind,
  isFileNodeKind,
  setSelectedNode,
  useSelectedNodePath,
  useNodesInSelectedDriveOrFolder,
  useUserPermissions,
  showCreateDocumentModal,
} from "@powerhousedao/reactor-browser";
import { useEffect, useRef, useState } from "react";
import type { FolderNode } from "document-drive";
import { Plus, FileText, Package } from "lucide-react";
import { useResourcesServicesAutoPlacement } from "../hooks/useResourcesServicesAutoPlacement.js";

const RESOURCE_TEMPLATES_FOLDER_NAME = "Resource Templates";
const SERVICE_OFFERINGS_FOLDER_NAME = "Service Offerings";

/**
 * Component for the Resources & Services custom view.
 * Shows two auto-generated folders: Resource Templates and Service Offerings.
 * Users can create powerhouse/resource-template docs in Resource Templates
 * and powerhouse/service-offering docs in Service Offerings.
 */
export function ResourcesServices() {
  const hasNavigatedToFolder = useRef(false);
  const selectedNodePath = useSelectedNodePath();
  const nodesInCurrentFolder = useNodesInSelectedDriveOrFolder();
  const { isAllowedToCreateDocuments } = useUserPermissions();

  // Use the shared auto-placement hook - this handles:
  // 1. Creating the "Resource Templates" folder if it doesn't exist
  // 2. Creating the "Service Offerings" folder if it doesn't exist
  const {
    resourceTemplatesFolder,
    serviceOfferingsFolder,
    resourceTemplateDocuments,
    serviceOfferingDocuments,
  } = useResourcesServicesAutoPlacement();

  // Determine which folder we're currently in (if any)
  const currentFolderId = selectedNodePath.at(-1)?.id;
  const isInResourceTemplates = currentFolderId === resourceTemplatesFolder?.id;
  const isInServiceOfferings = currentFolderId === serviceOfferingsFolder?.id;
  const isInRootView = !isInResourceTemplates && !isInServiceOfferings;

  // Navigate to root view initially (deselect any node)
  useEffect(() => {
    if (
      resourceTemplatesFolder &&
      serviceOfferingsFolder &&
      !hasNavigatedToFolder.current
    ) {
      hasNavigatedToFolder.current = true;
      // Don't select any node so we show the root view with both folders
      setSelectedNode("");
    }
  }, [resourceTemplatesFolder, serviceOfferingsFolder]);

  // Show loading state while folders are being created
  if (!resourceTemplatesFolder || !serviceOfferingsFolder) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">
          Setting up Resources & Services folders...
        </div>
      </div>
    );
  }

  // Handler for creating new documents
  const handleCreateDocument = (documentType: string, folderId: string) => {
    setSelectedNode(folderId);
    // Small delay to ensure the folder is selected before showing modal
    setTimeout(() => {
      showCreateDocumentModal(documentType);
    }, 100);
  };

  // Get folder and file nodes from current selection
  const folderNodes = nodesInCurrentFolder.filter((n) => isFolderNodeKind(n));
  const fileNodes = nodesInCurrentFolder.filter((n) => isFileNodeKind(n));

  // Render the root view with both folder cards
  if (isInRootView) {
    return (
      <div>
        <div className="text-2xl font-bold text-center mb-6">
          Resources & Services
        </div>
        <div className="space-y-6 px-6">
          <p className="text-gray-600 text-center mb-8">
            Manage your resource templates and service offerings. Click on a
            folder to view or create documents.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resource Templates Card */}
            <div
              className="border border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedNode(resourceTemplatesFolder.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  {RESOURCE_TEMPLATES_FOLDER_NAME}
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Define resource templates that can be used across service
                offerings.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {resourceTemplateDocuments.length} template
                  {resourceTemplateDocuments.length !== 1 ? "s" : ""}
                </span>
                {isAllowedToCreateDocuments && (
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateDocument(
                        "powerhouse/resource-template",
                        resourceTemplatesFolder.id,
                      );
                    }}
                  >
                    <Plus size={14} />
                    Add new
                  </button>
                )}
              </div>
            </div>

            {/* Service Offerings Card */}
            <div
              className="border border-gray-200 rounded-lg p-6 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedNode(serviceOfferingsFolder.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Package className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  {SERVICE_OFFERINGS_FOLDER_NAME}
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Create and manage service offerings with pricing tiers and
                options.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {serviceOfferingDocuments.length} offering
                  {serviceOfferingDocuments.length !== 1 ? "s" : ""}
                </span>
                {isAllowedToCreateDocuments && (
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateDocument(
                        "powerhouse/service-offering",
                        serviceOfferingsFolder.id,
                      );
                    }}
                  >
                    <Plus size={14} />
                    Add new
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render folder contents view (Resource Templates or Service Offerings)
  const currentFolderName = isInResourceTemplates
    ? RESOURCE_TEMPLATES_FOLDER_NAME
    : SERVICE_OFFERINGS_FOLDER_NAME;
  const documentType = isInResourceTemplates
    ? "powerhouse/resource-template"
    : "powerhouse/service-offering";

  const hasFolders = folderNodes.length > 0;
  const hasFiles = fileNodes.length > 0;
  const isEmpty = !hasFolders && !hasFiles;

  return (
    <div>
      <div className="text-2xl font-bold text-center mb-4">
        {currentFolderName}
      </div>
      <div className="space-y-6 px-6">
        {/* Breadcrumbs */}
        <div className="flex h-9 flex-row items-center gap-2 text-gray-500 border-b border-gray-200 pb-3">
          <div
            className="transition-colors hover:text-gray-800 cursor-pointer"
            onClick={() => setSelectedNode("")}
            role="button"
          >
            Resources & Services
          </div>
          <span>/</span>
          <div className="text-gray-800">{currentFolderName}</div>
          <span>/</span>
          {isAllowedToCreateDocuments && (
            <button
              type="button"
              className="ml-1 flex items-center justify-center gap-2 rounded-md bg-gray-50 px-2 py-1.5 transition-colors hover:bg-gray-200 hover:text-gray-800"
              onClick={() => showCreateDocumentModal(documentType)}
            >
              <Plus size={14} />
              Add new
            </button>
          )}
        </div>

        {hasFolders && (
          <div>
            <h3 className="mb-2 text-sm font-bold text-gray-600">Folders</h3>
            <div className="flex flex-wrap gap-4">
              {folderNodes.map((folderNode) => (
                <FolderItem
                  key={folderNode.id}
                  folderNode={folderNode as FolderNode}
                />
              ))}
            </div>
          </div>
        )}

        {hasFiles && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-600">
              Documents
            </h3>
            <div className="flex flex-wrap gap-4">
              {fileNodes.map((fileNode) => (
                <FileItem key={fileNode.id} fileNode={fileNode} />
              ))}
            </div>
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-400 mb-2">
              {isInResourceTemplates ? (
                <FileText className="w-16 h-16 mx-auto" />
              ) : (
                <Package className="w-16 h-16 mx-auto" />
              )}
            </div>
            <p className="text-gray-500 text-sm">
              No {currentFolderName.toLowerCase()} yet.
              {isAllowedToCreateDocuments && (
                <>
                  {" "}
                  Click "Add new" to create your first{" "}
                  {isInResourceTemplates ? "resource template" : "service offering"}.
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
