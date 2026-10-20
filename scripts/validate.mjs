import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { root, readProjectJson, buildFiles } from '../lib/build.mjs';
const scope = await readProjectJson('knowledge/exam/scope.json');
const rules = await readProjectJson('knowledge/rules/stairs.json');
const registry = await readProjectJson('knowledge/sources/registry.json');
const ids = new Set(scope.topics.map(t => t.id));
assert.equal(ids.size, scope.topics.length, '主題ID不能重複');
for (const topic of scope.topics) assert(topic.title && topic.search_terms && Array.isArray(topic.gaps));
for (const item of scope.outline_items) for (const id of item.topics) assert(ids.has(id), '考綱映射不存在的主題：' + id);
const sourceIds = new Set(registry.sources.map(s => s.id));
assert.equal(sourceIds.size, registry.sources.length, '來源ID不能重複');
assert(sourceIds.has(rules.source_check_id), '規則缺少查證來源');
for (const id of scope.source_check_ids) assert(sourceIds.has(id), '覆蓋表引用不存在的查證紀錄');
for (const source of registry.sources) {
  assert(new URL(source.url).protocol === 'https:');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(source.accessed_on));
  assert(source.scope && source.actor && source.professional_review);
  assert(['source_checked','unverified'].includes(source.status));
}
for (const c of rules.categories) {
  assert(['width_min','riser_max','tread_min'].every(k => Number.isFinite(c[k]) && c[k] > 0));
}
assert.equal(scope.full_outline_verified, false, '完整考綱尚未核對，不能解除旗標');
assert.equal(registry.outline.status, 'indexed_excerpt_checked', '原始附件尚未讀取，不能宣稱核對原檔');
const files = await buildFiles();
const html = files.get('index.html');
for (const match of html.matchAll(/href="([^"#]+)"/g)) {
  const link = match[1];
  if (/^(https?:|data:)/.test(link)) continue;
  assert(files.has(link), '建置輸出缺少內部連結目標：' + link);
}
async function walk(dir) {
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    if (['.git','node_modules','dist','local-data','artifacts','.local'].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (/\.(md|json|mjs|html|sql|yml|yaml)$/.test(entry.name)) {
      const content = await readFile(path, 'utf8');
      assert(!/(?:file:\/\/\/|[A-Z]:[\\/](?:Users|Program Files)[\\/])/.test(content), '檔案包含電腦專屬絕對路徑：' + entry.name);
      assert(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(content), '不得提交私鑰');
    }
  }
}
await walk(root);
console.log('知識引用、考綱關聯、內部連結及可攜路徑檢查通過。');
