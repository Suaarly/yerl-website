import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

execFileSync(process.execPath, ['scripts/build.mjs'], { stdio: 'inherit' });
const root = resolve('dist');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.json':'application/json', '.xml':'application/xml', '.pdf':'application/pdf', '.txt':'text/plain; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon' };
createServer((req,res)=>{
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  let file = resolve(root, '.' + pathname);
  if (!(file === root || file.startsWith(root + sep))) { res.writeHead(403);res.end('Forbidden');return; }
  if (pathname.endsWith('/')) file=resolve(file,'index.html');
  if (!existsSync(file) && !extname(file)) file=resolve(file,'index.html');
  if (!existsSync(file)) { res.writeHead(404); res.end('Not found'); return; }
  const data=readFileSync(file);
  res.writeHead(200, {'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache'});
  res.end(data);
}).listen(4173, '127.0.0.1',()=>console.log('YERL preview: http://127.0.0.1:4173/en/'));
