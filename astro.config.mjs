import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkBlogImages from './src/plugins/remark-blog-images.mjs';
import remarkSongLanguages from './src/plugins/remark-song-languages.mjs';

export default defineConfig({
  site: 'https://a-zan.xyz',
  output: 'static',
  integrations: [sitemap()],
  image: {
    layout: 'constrained',
    breakpoints: [384, 672, 768, 1080, 1344],
  },
  markdown: {
    processor: unified({ remarkPlugins: [remarkBlogImages, remarkSongLanguages] }),
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
