// Apply the blog's content width and image quality to local Markdown images.
// Astro handles conversion, dimensions and responsive variants at build time.
export default function remarkBlogImages() {
  return (tree) => {
    let firstImage = true;

    function visit(node) {
      if (node.type === 'image' && node.url.startsWith('../../assets/images/')) {
        node.data ??= {};
        node.data.hProperties = {
          ...node.data.hProperties,
          sizes: '(max-width: 639px) calc(96vw - 30.72px), (max-width: 719px) calc(92vw - 44.16px), 618px',
          quality: node.url.endsWith('.png') ? 90 : 80,
          loading: firstImage ? 'eager' : 'lazy',
          decoding: 'async',
        };
        firstImage = false;
      }
      for (const child of node.children ?? []) visit(child);
    }

    visit(tree);
  };
}
