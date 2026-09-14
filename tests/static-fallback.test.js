const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

test('missing Gantt and assets return 404; SPA routes still get the main page',()=>{
  const source=fs.readFileSync(path.join(__dirname,'../server.js'),'utf8');
  const start=source.indexOf('  fs.readFile(filePath, (error, content) => {');
  const end=source.indexOf('\n});',start);
  const serve=new Function('fs','path','PUBLIC_DIR','filePath','extname','sanitizeUrl','mimeTypes','res',
    'let contentType="text/html";'+source.slice(start,end));
  for(const url of ['/modules/Gantt/gantt.html','/modules/Gantt/missing','/assets/missing.js','/gantt']) {
    const reads=[];let status,body;
    const fakeFs={readFile(file,callback){reads.push(file);if(reads.length===1)callback({code:'ENOENT'});else callback(null,'SPA HOME');}};
    serve(fakeFs,path,'frontend/dist','requested-file',path.extname(url),url,{},
      {writeHead(code){status=code;},end(value){body=value;}});
    if(url==='/gantt'){assert.equal(status,200);assert.equal(body,'SPA HOME');}
    else{assert.equal(status,404);assert.equal(reads.length,1);assert.ok(body.includes(url));}
  }
});
