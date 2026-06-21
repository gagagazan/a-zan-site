import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';

export async function GET(_context: { site: URL | string }) {
  const posts = await getCollection('blog', (entry) => !entry.data.draft);
  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: `${SITE.title} 的技术博客`,
    description: SITE.description,
    site: SITE.blogUrl,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>${SITE.language}</language>`,
  });
}
