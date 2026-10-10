const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const W=1400,H=800,scale=Math.min((W-350-24)/(.185*.79),(H-70-175)/.135),cx=(24+W-350)/2,cy=(175+H-70)/2;
let points=[],coverage={southwest:0,southeast:0};
const ctx=new Proxy({beginPath(){points=[]},moveTo(x,y){points.push([x,y])},lineTo(x,y){points.push([x,y])},stroke(){if(this.strokeStyle!=='#58695e')return;for(const [x,y]of points){const lon=(x-cx)/(.79*scale)-122.44,lat=37.768-(y-cy)/scale;if(lat<37.74&&lat>37.708){if(lon< -122.414&&lon> -122.455)coverage.southwest++;if(lon> -122.414&&lon< -122.358)coverage.southeast++}}}},{get:(o,k)=>k in o?o[k]:()=>{}});
const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/map.js','utf8'),sandbox);sandbox.window.drawSFMap(ctx,W,H,1,{x:0,y:0});
assert(coverage.southwest>200,'Southwestern neighborhoods need local streets');assert(coverage.southeast>200,'Southeastern neighborhoods need local streets');console.log('PASS: local street geometry covers both southern districts.',coverage);
