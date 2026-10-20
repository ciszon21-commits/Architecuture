import { createServer } from 'node:http';
import { build, buildFiles } from '../lib/build.mjs';
const rawPort = process.env.PORT || '4173';
if (!/^\d+$/.test(rawPort)) throw new Error('PORT須為整數');
const port = Number(rawPort);
if (port < 1 || port > 65535) throw new Error('PORT須介於1與65535');
await build();
const server = createServer(async (req, res) => {
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405, {'Allow':'GET, HEAD'});res.end();return;}
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname).slice(1) || 'index.html';
    const files = await buildFiles();
    if (!files.has(name)) {res.writeHead(404);res.end('Not found');return;}
    const type = name.endsWith('.html') ? 'text/html; charset=utf-8' : name.endsWith('.json') ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8';
    res.writeHead(200, {'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method === 'HEAD' ? undefined : files.get(name));
  } catch {
    res.writeHead(500);res.end('建置失敗，請查看終端機。');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log('本機開發：http://127.0.0.1:' + port + '；修改來源後重新整理。'));
for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => server.close());
