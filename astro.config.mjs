import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkBlogImages from './src/plugins/remark-blog-images.mjs';

export default defineConfig({
  site: 'https://a-zan.xyz',
  output: 'static',
  integrations: [sitemap()],
  image: {
    layout: 'constrained',
    breakpoints: [384, 672, 1344],
  },
  markdown: {
    processor: unified({ remarkPlugins: [remarkBlogImages] }),
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
