import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('.',import.meta.url)),port=3003;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp'};
createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url??'/',`http://${req.headers.host}`).pathname);
    const relative=normalize(pathname==='/'?'index.html':pathname.replace(/^\/+/,''));
    const file=join(root,relative);if(!file.startsWith(root))throw new Error('outside');
    const info=await stat(file),target=info.isDirectory()?join(file,'index.html'):file;
    const data=await readFile(target);res.writeHead(200,{'Content-Type':types[extname(target).toLowerCase()]??'application/octet-stream','Cache-Control':'no-cache'});res.end(data);
  }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`墨游已开启：http://localhost:${port}/`));
