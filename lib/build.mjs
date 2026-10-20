import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
export const root = fileURLToPath(new URL('../', import.meta.url));
export async function readProjectJson(path) {
  return JSON.parse(await readFile(join(root, path), 'utf8'));
}
function scriptJson(value) { return JSON.stringify(value).replaceAll('<', '\\u003c'); }
export async function buildFiles() {
  const scope = await readProjectJson('knowledge/exam/scope.json');
  const rules = await readProjectJson('knowledge/rules/stairs.json');
  let html = await readFile(join(root, 'src/index.template.html'), 'utf8');
  const replacements = {
    '__TOPICS_JSON__': scriptJson(scope.topics.map(t => ({id:t.id,title:t.title,hint:t.search_terms,gaps:t.gaps}))),
    '__STAIR_CATEGORIES_JSON__': scriptJson(rules.categories),
    '__GEOMETRY_JS__': (await readFile(join(root, 'lib/geometry.mjs'), 'utf8')).replace(/^export /gm, '')
  };
  for (const [token, value] of Object.entries(replacements)) {
    if (html.split(token).length !== 2) throw new Error('建置標記須出現一次：' + token);
    html = html.replace(token, () => value);
  }
  if (/__[A-Z_]+__/.test(html)) throw new Error('仍有未取代的建置標記');
  return new Map([
    ['index.html', html],
    ['scope.json', JSON.stringify(scope, null, 2) + '\n'],
    ['stair-rules.json', JSON.stringify(rules, null, 2) + '\n'],
    ['sources.json', await readFile(join(root, 'knowledge/sources/registry.json'), 'utf8')],
    ['specification.md', await readFile(join(root, 'docs/specification.md'), 'utf8')],
    ['model.sql', await readFile(join(root, 'database/model.sql'), 'utf8')]
  ]);
}
export async function build() {
  const files = await buildFiles();
  await mkdir(join(root, 'dist'), {recursive:true});
  for (const [name, content] of files) await writeFile(join(root, 'dist', name), content, 'utf8');
  return files;
}
