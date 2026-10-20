import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { calculateClearWidth } from '../lib/geometry.mjs';
import { buildFiles, readProjectJson } from '../lib/build.mjs';
test('扶手淨寬邊界保留精確值，避免邊界誤判', () => {
  assert.equal(calculateClearWidth(95, 10, 10), 75);
  assert.equal(calculateClearWidth(90, 10, 10), 70);
  assert.equal(calculateClearWidth(100, 0, 0), 100);
});
test('拒絕負尺寸、非數值與突出量超過寬度', () => {
  for (const args of [[0,0,0],[100,-1,0],[100,0,NaN],[10,6,5],[Infinity,0,0]]) assert.throws(() => calculateClearWidth(...args));
});
test('建置可重現，且沒有尚未取代的來源標記', async () => {
  const a = await buildFiles(), b = await buildFiles();
  assert.deepEqual([...a], [...b]);
  assert(!/__[A-Z_]+__/.test(a.get('index.html')));
});
test('輸出JavaScript可解析，單一規則來源被正確注入', async () => {
  const files = await buildFiles();
  const html = files.get('index.html');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  new vm.Script(script);
  const rules = await readProjectJson('knowledge/rules/stairs.json');
  const embedded = JSON.parse(script.match(/const categoryRules=(\[[\s\S]*?\]);/)[1]);
  assert.deepEqual(embedded, rules.categories);
});
test('所有考綱映射指向存在的主題', async () => {
  const scope = await readProjectJson('knowledge/exam/scope.json');
  const ids = new Set(scope.topics.map(t => t.id));
  for (const item of scope.outline_items) for (const id of item.topics) assert(ids.has(id));
});
test('原始附件與專業審核的待辦狀態未在遷移時被抹除', async () => {
  const registry = await readProjectJson('knowledge/sources/registry.json');
  assert.equal(registry.outline.original_file_status, 'unavailable');
  for (const source of registry.sources) assert.equal(source.professional_review, 'pending');
});
