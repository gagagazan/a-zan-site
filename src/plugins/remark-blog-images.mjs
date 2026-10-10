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
          sizes: '(min-width: 720px) 672px, calc(100vw - 32px)',
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
