// These columns contain original song/artist names, not translated descriptions.
export default function remarkSongLanguages() {
  return (tree) => {
    function text(node) {
      return node.value ?? (node.children ?? []).map(text).join('');
    }

    function visit(node) {
      if (node.type === 'table') {
        const headers = node.children[0]?.children.map(text);
        if (headers?.join('|') !== '#|定位|歌名|年份|原唱|出处|翻唱|调号|原唱链接|翻唱链接') return;

        for (const row of node.children.slice(1)) {
          for (const index of [2, 4]) {
            const cell = row.children[index];
            const value = text(cell);
            if (value === '画面未标注' || !/[\u3040-\u30ff\u3400-\u9fff]/u.test(value)) continue;
            cell.data ??= {};
            cell.data.hProperties = { ...cell.data.hProperties, lang: 'ja' };
          }

          // Keep the Chinese collaboration label outside the Japanese band name.
          const band = row.children[6];
          band.children = band.children.flatMap((child) => {
            if (child.type !== 'text' || !child.value.startsWith('ハロー、ハッピーワールド！')) return [child];
            const name = 'ハロー、ハッピーワールド！';
            return [
              { type: 'html', value: `<span lang="ja">${name}</span>` },
              { type: 'text', value: child.value.slice(name.length) },
            ];
          });
        }
        return;
      }
      for (const child of node.children ?? []) visit(child);
    }

    visit(tree);
  };
}
