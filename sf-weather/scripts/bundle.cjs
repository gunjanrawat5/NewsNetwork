// Keep dependent view/rendering scripts in one versioned browser resource.
const fs=require('node:fs'),crypto=require('node:crypto');
const sources=['map.js','company-data.js','company-layer.js','app.js'];
const content=sources.map(file=>'/* '+file+' */\n'+fs.readFileSync('dist/'+file,'utf8')).join('\n;\n');
const hash=crypto.createHash('sha256').update(content).digest('hex').slice(0,12);
const file='app.'+hash+'.js';fs.writeFileSync('dist/'+file,content);
let html=fs.readFileSync('dist/index.html','utf8');
html=html.replace(/<script src="(?:map|company-data|company-layer|app)\.js"><\/script>/g,'').replace(/<script src="app\.[a-f0-9]{12}\.js"><\/script>/g,'');
html=html.replace('</body>','<script src="'+file+'"></script></body>');
const cssHash=crypto.createHash('sha256').update(fs.readFileSync('dist/style.css')).digest('hex').slice(0,12);
html=html.replace(/href="style\.css(?:\?v=[a-f0-9]+)?"/,'href="style.css?v='+cssHash+'"');
fs.writeFileSync('dist/index.html',html);console.log('Browser bundle: '+file);
