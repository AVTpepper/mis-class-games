const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
http.createServer((req,res)=>{
  // Serve the deployment prefix too, so tests exercise real GitHub Pages paths.
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/mis-class-games(?=\/)/,'');}
  catch{res.writeHead(400);return res.end();}
  const file=path.resolve(root,'.'+pathname,pathname.endsWith('/')?'index.html':'');
  const relative=path.relative(root,file).split(path.sep).join('/');
  const allowed=['index.html','styles.css','catalogue.js','hub.js'].includes(relative)||/^(games|assets)\//.test(relative);
  if(!allowed || !fs.existsSync(file) || !fs.statSync(file).isFile()) {res.writeHead(404);return res.end();}
  const types={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  const data=fs.readFileSync(file);
  res.setHeader('Accept-Ranges','bytes');
  const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),data.length-1):data.length-1;if(start>end){res.writeHead(416);return res.end();}res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});return res.end(data.subarray(start,end+1));}
  res.setHeader('Content-Length',data.length);res.end(data);
}).listen(4173,'127.0.0.1');
