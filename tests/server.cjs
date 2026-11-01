const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
http.createServer((req,res)=>{
  const museumFiles = ['index.html','audio.js','interludes.js','game.js','exploration.js','snake.js','cutscenes.js','styles.css'];
  const files = Object.fromEntries(museumFiles.map(file=>['/games/midnight-museum/'+file,'games/midnight-museum/'+file]));
  files['/games/midnight-museum/']='games/midnight-museum/index.html';
  files['/']=files['/index.html']='index.html';
  const pathname=req.url?.split('?')[0];
  const file = files[pathname];
  if(!file || !fs.existsSync(path.join(root,file))) {res.writeHead(404);return res.end();}
  const types={'.js':'text/javascript','.css':'text/css','.html':'text/html'};
  res.setHeader('Content-Type',types[path.extname(file)]);
  const data=fs.readFileSync(path.join(root,file));
  res.setHeader('Accept-Ranges','bytes');
  const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),data.length-1):data.length-1;if(start>end){res.writeHead(416);return res.end();}res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});return res.end(data.subarray(start,end+1));}
  res.setHeader('Content-Length',data.length);res.end(data);
}).listen(4173,'127.0.0.1');
