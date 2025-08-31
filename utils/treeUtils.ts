import type { SovereignKey } from '../types';

/**
 * Recursively finds a key by its ID within a tree structure.
 * @param node The current SovereignKey node to search within.
 * @param keyId The ID of the key to find.
 * @returns The found SovereignKey node or null if not found.
 */
export function findKeyInTree(node: SovereignKey, keyId: string): SovereignKey | null {
  if (node.id === keyId) {
    return node;
  }
  for (const child of node.children) {
    const found = findKeyInTree(child, keyId);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * Recursively updates a key within a tree structure.
 * Returns a new tree with the updated key.
 * @param node The current SovereignKey node.
 * @param keyId The ID of the key to update.
 * @param updates The partial updates to apply to the found key.
 * @returns A new SovereignKey node representing the updated tree.
 */
export function updateKeyInTree(node: SovereignKey, keyId: string, updates: Partial<SovereignKey>): SovereignKey {
  if (node.id === keyId) {
    return { ...node, ...updates };
  }

  return {
    ...node,
    children: node.children.map(child => updateKeyInTree(child, keyId, updates)),
  };
}

/**
 * Recursively adds a new key as a child to a specified parent within a tree structure.
 * Returns a new tree with the added key.
 * @param node The current SovereignKey node.
 * @param parentId The ID of the parent key.
 * @param newKey The new SovereignKey to add.
 * @returns A new SovereignKey node representing the updated tree.
 */
export function addKeyToTree(node: SovereignKey, parentId: string, newKey: SovereignKey): SovereignKey {
  if (node.id === parentId) {
    return {
      ...node,
      children: [...node.children, newKey],
    };
  }

  return {
    ...node,
    children: node.children.map(child => addKeyToTree(child, parentId, newKey)),
  };
}
