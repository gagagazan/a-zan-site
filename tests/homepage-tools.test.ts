import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const homepageSource = readFileSync(
  resolve(process.cwd(), 'src/pages/index.astro'),
  'utf8',
);

describe('首页工具 / 作品', () => {
  it.each([
    {
      name: 'PJSK 大门升级材料管理器',
      site: 'https://pjsk-gate-level.a-zan.xyz/',
      github: 'https://github.com/gagagazan/pjsk_gate_level_materials',
    },
    {
      name: 'Job Kanban',
      site: 'https://job-kanban.a-zan.xyz/',
      github: 'https://github.com/gagagazan/job_kanban',
    },
  ])('展示 $name 的站点与源码入口', ({ name, site, github }) => {
    expect(homepageSource).toContain(name);
    expect(homepageSource).toContain(site);
    expect(homepageSource).toContain(github);
  });

  it('不再展示整理中的占位文案', () => {
    expect(homepageSource).not.toContain('陆续整理中，敬请期待。');
  });
});
