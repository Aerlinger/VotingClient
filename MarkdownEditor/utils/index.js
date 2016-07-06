function findNode(root, id) {
  if (root && root.id == id) {
    return root;
  } else {
    for (node of root.children) {
      findNode(node, id)
    }
  }

  return null;
}
