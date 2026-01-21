import { useEffect, useMemo, useRef } from "react";
import {
  isFolderNodeKind,
  isFileNodeKind,
  addFolder,
  useSelectedDrive,
  useDocumentsInSelectedDrive,
} from "@powerhousedao/reactor-browser";
import type { FolderNode, FileNode, Node } from "document-drive";

const RESOURCE_TEMPLATES_FOLDER_NAME = "Resource Templates";
const SERVICE_OFFERINGS_FOLDER_NAME = "Service Offerings";

interface UseResourcesServicesAutoPlacementResult {
  /** The Resource Templates folder node, or null if it doesn't exist yet */
  resourceTemplatesFolder: FolderNode | null;
  /** The Service Offerings folder node, or null if it doesn't exist yet */
  serviceOfferingsFolder: FolderNode | null;
  /** Set of all node IDs within the Resource Templates folder tree */
  resourceTemplatesNodeIds: Set<string>;
  /** Set of all node IDs within the Service Offerings folder tree */
  serviceOfferingsNodeIds: Set<string>;
  /** All resource template documents within the Resource Templates folder */
  resourceTemplateDocuments: FileNode[];
  /** All service offering documents within the Service Offerings folder */
  serviceOfferingDocuments: FileNode[];
}

/**
 * Hook that handles automatic creation of "Resource Templates" and "Service Offerings" folders
 * for the Resources & Services section.
 *
 * This hook:
 * 1. Creates the "Resource Templates" folder if it doesn't exist
 * 2. Creates the "Service Offerings" folder if it doesn't exist
 * 3. Provides access to documents within each folder
 */
export function useResourcesServicesAutoPlacement(): UseResourcesServicesAutoPlacementResult {
  const [driveDocument] = useSelectedDrive();
  const documentsInDrive = useDocumentsInSelectedDrive();

  // Track folder creation to prevent duplicates
  const hasCreatedResourceTemplatesFolder = useRef(false);
  const hasCreatedServiceOfferingsFolder = useRef(false);

  // Find the "Resource Templates" folder in the drive
  const resourceTemplatesFolder = useMemo(() => {
    if (!driveDocument) return null;
    const nodes = driveDocument.state.global.nodes;
    return (
      nodes.find(
        (node: Node): node is FolderNode =>
          isFolderNodeKind(node) &&
          node.name === RESOURCE_TEMPLATES_FOLDER_NAME,
      ) ?? null
    );
  }, [driveDocument]);

  // Find the "Service Offerings" folder in the drive
  const serviceOfferingsFolder = useMemo(() => {
    if (!driveDocument) return null;
    const nodes = driveDocument.state.global.nodes;
    return (
      nodes.find(
        (node: Node): node is FolderNode =>
          isFolderNodeKind(node) && node.name === SERVICE_OFFERINGS_FOLDER_NAME,
      ) ?? null
    );
  }, [driveDocument]);

  // Build a set of all node IDs within the Resource Templates folder tree
  const resourceTemplatesNodeIds = useMemo(() => {
    const nodeIds = new Set<string>();
    if (!resourceTemplatesFolder || !driveDocument) return nodeIds;

    const allNodes = driveDocument.state.global.nodes;

    const collectNodeIds = (parentId: string) => {
      nodeIds.add(parentId);
      for (const node of allNodes) {
        if (isFolderNodeKind(node) && node.parentFolder === parentId) {
          collectNodeIds(node.id);
        } else if (
          isFileNodeKind(node) &&
          node.parentFolder === parentId &&
          node.documentType === "powerhouse/resource-template"
        ) {
          nodeIds.add(node.id);
        }
      }
    };

    collectNodeIds(resourceTemplatesFolder.id);
    return nodeIds;
  }, [resourceTemplatesFolder, driveDocument]);

  // Build a set of all node IDs within the Service Offerings folder tree
  const serviceOfferingsNodeIds = useMemo(() => {
    const nodeIds = new Set<string>();
    if (!serviceOfferingsFolder || !driveDocument) return nodeIds;

    const allNodes = driveDocument.state.global.nodes;

    const collectNodeIds = (parentId: string) => {
      nodeIds.add(parentId);
      for (const node of allNodes) {
        if (isFolderNodeKind(node) && node.parentFolder === parentId) {
          collectNodeIds(node.id);
        } else if (
          isFileNodeKind(node) &&
          node.parentFolder === parentId &&
          node.documentType === "powerhouse/service-offering"
        ) {
          nodeIds.add(node.id);
        }
      }
    };

    collectNodeIds(serviceOfferingsFolder.id);
    return nodeIds;
  }, [serviceOfferingsFolder, driveDocument]);

  // Get resource template documents within the Resource Templates folder
  const resourceTemplateDocuments = useMemo(() => {
    if (!driveDocument) return [];

    return driveDocument.state.global.nodes.filter(
      (node): node is FileNode =>
        isFileNodeKind(node) &&
        node.documentType === "powerhouse/resource-template" &&
        resourceTemplatesNodeIds.has(node.id),
    );
  }, [driveDocument, resourceTemplatesNodeIds]);

  // Get service offering documents within the Service Offerings folder
  const serviceOfferingDocuments = useMemo(() => {
    if (!driveDocument) return [];

    return driveDocument.state.global.nodes.filter(
      (node): node is FileNode =>
        isFileNodeKind(node) &&
        node.documentType === "powerhouse/service-offering" &&
        serviceOfferingsNodeIds.has(node.id),
    );
  }, [driveDocument, serviceOfferingsNodeIds]);

  // Create Resource Templates folder if it doesn't exist
  useEffect(() => {
    if (
      !driveDocument ||
      resourceTemplatesFolder ||
      hasCreatedResourceTemplatesFolder.current
    )
      return;

    hasCreatedResourceTemplatesFolder.current = true;
    const driveId = driveDocument.header.id;
    void addFolder(driveId, RESOURCE_TEMPLATES_FOLDER_NAME);
  }, [driveDocument, resourceTemplatesFolder]);

  // Create Service Offerings folder if it doesn't exist
  useEffect(() => {
    if (
      !driveDocument ||
      serviceOfferingsFolder ||
      hasCreatedServiceOfferingsFolder.current
    )
      return;

    hasCreatedServiceOfferingsFolder.current = true;
    const driveId = driveDocument.header.id;
    void addFolder(driveId, SERVICE_OFFERINGS_FOLDER_NAME);
  }, [driveDocument, serviceOfferingsFolder]);

  return {
    resourceTemplatesFolder,
    serviceOfferingsFolder,
    resourceTemplatesNodeIds,
    serviceOfferingsNodeIds,
    resourceTemplateDocuments,
    serviceOfferingDocuments,
  };
}
