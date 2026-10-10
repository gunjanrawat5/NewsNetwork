const canvas=document.querySelector('canvas');let ctx=canvas.getContext('2d');
const displayCtx=ctx, cityCanvas=document.createElement('canvas');
const cityCtx=cityCanvas.getContext('2d');
let companyLayer,mapProjection;
let viewMode="3d",pan={x:0,y:0};
let cityDirty=true, needsFrame=true, raf=0, viewSin=0, viewCos=1, viewScale=1;
function requestRender(city=false){cityDirty ||= city;needsFrame=true;if(!raf&&!document.hidden)raf=requestAnimationFrame(frame)}
let W,H,dpr,angle=-.55,zoom=1,mode='clear',intensity=.6,paused=false,t=0,last=0,drag=null;const objects=[];let seed=29;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}const coast=[[-7,-6],[-4,-7.5],[0,-7.3],[3,-6.2],[4.2,-3.5],[4.4,0],[3.6,3.4],[2.8,6.5],[0,8],[-4,7],[-6.3,3],[-7,0]];function inside(x,y){let c=false;for(let i=0,j=coast.length-1;i<coast.length;j=i++){let a=coast[i],b=coast[j];if((a[1]>y)!=(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c}function ground(x,y){return .2+1.05*Math.exp(-((x+3)**2+(y+.5)**2)/8)+.6*Math.exp(-((x+2)**2+(y-4)**2)/5)}function box(x,y,z,w,d,h,color){objects.push({x,y,z,w,d,h,color})}for(let x=-6.4;x<4;x+=.58)for(let y=-6.5;y<7;y+=.6){if(!inside(x,y)||!inside(x+.4,y+.4))continue;let park=(x<-4&&y<0&&y>-4)||(y>3&&x<-3);let z=ground(x,y);box(x,y,z,.46,.48,.045,park?'#384536':'#505957');if(park){if(rand()>.45)box(x+.14,y+.12,z+.06,.15,.17,.2+rand()*.22,'#728153');continue}let downtown=Math.exp(-((x-2)**2+(y+2.7)**2)/6);let h=.22+rand()*.55+downtown*rand()*2.7;box(x+.055,y+.05,z+.05,.31+rand()*.06,.32,h,['#707c7c','#5a666a','#83908b','#637172'][Math.floor(rand()*4)])}box(2,-3,.35,.42,.42,3.7,'#85918b');box(1.1,-4,.3,.34,.34,2.8,'#788580');box(-6,-6.5,.5,.2,.25,2.1,'#ae6050');box(-6,-10.5,.5,.2,.25,2.1,'#ae6050');
function resize(){W=innerWidth;H=canvas.clientHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);cityCanvas.width=canvas.width;cityCanvas.height=canvas.height;displayCtx.setTransform(dpr,0,0,dpr,0,0);cityCtx.setTransform(dpr,0,0,dpr,0,0);requestRender(true)}addEventListener('resize',resize);resize();function project(x,y,z=0){let a=x*viewCos-y*viewSin,b=x*viewSin+y*viewCos,s=viewScale;return [W*(W<800?.48:.425)+a*s,H*(W<800?.32:.52)+b*s*.48-z*s*.93]}function poly(points,color,stroke){ctx.beginPath();points.forEach((p,i)=>{let q=project(...p);i?ctx.lineTo(...q):ctx.moveTo(...q)});ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.5;ctx.stroke()}}const shades=new Map();function shade(c,n){const key=c+n;if(shades.has(key))return shades.get(key);let a=c.slice(1).match(/../g).map(x=>Math.max(0,Math.min(255,parseInt(x,16)+n)));let value='#'+a.map(x=>x.toString(16).padStart(2,'0')).join('');shades.set(key,value);return value}function drawbox(o){
let{x,y,z,w,d,h,color}=o;
const active=h>.1 && x>-3.6 && x<2.8 && y>-2.2 && y<3.8;
const glow='#c5ef68';
const roof=active?'#909c73':color;
const frontY=viewCos>=0?y+d:y, frontX=viewSin>=0?x+w:x;
poly([[x,frontY,z],[x+w,frontY,z],[x+w,frontY,z+h],[x,frontY,z+h]],shade(color,-15));
poly([[frontX,y,z],[frontX,y+d,z],[frontX,y+d,z+h],[frontX,y,z+h]],shade(color,-42));
poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],roof);
if(h>.12 && w>.2){
// Window mullions and horizontal floor bands follow each visible facade.
for(let floor=z+.12;floor<z+h-.04;floor+=.16){
line([x,frontY,floor],[x+w,frontY,floor],active?'#a7b86b':'#6d7d7c',.55);
line([frontX,y,floor],[frontX,y+d,floor],active?'#829552':'#465553',.55);
}
for(let k=1;k<4;k++){
line([x+w*k/4,frontY,z],[x+w*k/4,frontY,z+h],active?'#849858':'#425150',.5);
line([frontX,y+d*k/4,z],[frontX,y+d*k/4,z+h],active?'#6f854e':'#3d4b4b',.5);
}
// Raised roof rim and small mechanical units.
let rim=[[x,y,z+h+.025],[x+w,y,z+h+.025],[x+w,y+d,z+h+.025],[x,y+d,z+h+.025]];
for(let k=0;k<4;k++)line(rim[k],rim[(k+1)%4],active?glow:'#a0aca4',.85);
let ux=x+w*.2,uy=y+d*.2,uz=z+h+.015;
poly([[ux,uy,uz],[ux+w*.3,uy,uz],[ux+w*.3,uy,uz+.07],[ux,uy,uz+.07]],'#465451');
poly([[ux,uy,uz+.07],[ux+w*.3,uy,uz+.07],[ux+w*.3,uy+d*.25,uz+.07],[ux,uy+d*.25,uz+.07]],'#a0aaa0');
if(h>.8)line([x+w*.73,y+d*.35,z+h],[x+w*.73,y+d*.35,z+h+.17],'#bbc4b6',1);
}
if(active){ctx.save();ctx.shadowColor=glow;ctx.shadowBlur=0;
line([x,frontY,z],[x,frontY,z+h],glow,.85);
line([x+w,frontY,z],[x+w,frontY,z+h],glow,.85);
line([x,frontY,z+h],[x+w,frontY,z+h],glow,1);
ctx.restore();}
if(h<.06){const edge=active?'#b8d957':'#67746a';line([x,y+d,z+h],[x+w,y+d,z+h],edge,.7);line([x+w,y,z+h],[x+w,y+d,z+h],edge,.7)}
}
function line(a,b,c,width=1){ctx.beginPath();ctx.moveTo(...project(...a));ctx.lineTo(...project(...b));ctx.strokeStyle=c;ctx.lineWidth=width;ctx.stroke()}const particles=Array.from({length:500},()=>({x:rand(),y:rand(),v:.6+rand(),r:rand()}));const settings={clear:[18,12,'Sunlight on the skyline. A rare, clear day by the bay.','01 / CLEAR SKIES'],rain:[14,24,'Rain sweeps across the peninsula, softening the city in silver.','02 / RAINFALL'],storm:[12,58,'Dark skies, driving rain, and lightning over the bay.','03 / THUNDERSTORM'],heat:[35,6,'The city shimmers beneath a warm, amber sky.','04 / HEATWAVE'],fog:[13,16,'A blanket of Pacific fog rolls over the coastal hills.','05 / COASTAL FOG']};function update(){let s=settings[mode];document.querySelector('#temp').innerHTML=Math.round(s[0]+(intensity-.6)*(mode==='heat'?20:4))+'<span>°C</span>';document.querySelector('#wind').innerHTML=Math.round(s[1]*(.5+intensity*.83))+'<span>km/h</span>';document.querySelector('#description').textContent=s[2];document.querySelector('#modecaption').textContent=s[3];requestRender(true)}document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(a=>a.classList.toggle('selected',a===b));update()});document.querySelector('#intensity').oninput=e=>{intensity=e.target.value/100;document.querySelector('#level').textContent=e.target.value+'%';update()};document.querySelector('#pause').onclick=e=>{paused=!paused;e.target.textContent=paused?'▶ Resume simulation':'Ⅱ Pause simulation';last=0;requestRender()};document.querySelector('#reset').onclick=()=>{angle=-.55;zoom=viewMode==="2d"?1:1.12;pan={x:0,y:0};requestRender(true)};canvas.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY,a:angle,px:pan.x,py:pan.y};canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(drag){if(viewMode==="2d"){pan.x=drag.px+e.clientX-drag.x;pan.y=drag.py+e.clientY-drag.y}else angle=drag.a+(e.clientX-drag.x)*.006;requestRender(true)}};canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=()=>drag=null;canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.min(1.65,Math.max(.55,zoom-e.deltaY*(e.deltaMode===1?.016:e.deltaMode===2?.5:.001)));requestRender(true)},{passive:false});
function renderCity(){
if(viewMode==="2d"){mapProjection=window.drawSFMap(ctx,W,H,zoom,pan);companyLayer?.mapTiles({ctx,mapProject:mapProjection});return}

viewSin=Math.sin(angle);viewCos=Math.cos(angle);viewScale=Math.min(W*.044,H*.065)*(W<800?.78:1)*zoom;
ctx.clearRect(0,0,W,H);let bg='#182326';ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);ctx.save();ctx.globalAlpha=.035;for(let i=0;i<28;i++){let y=-18+i*1.3;line([-24,y,0],[24,y,0],'#fff',.7)}ctx.restore();poly(coast.map(([x,y])=>[x,y,-.5]),'#101c20');for(let i=0;i<coast.length;i++){let a=coast[i],b=coast[(i+1)%coast.length];poly([[...a,-.5],[...b,-.5],[...b,.12],[...a,.12]],'#293834')}poly(coast.map(([x,y])=>[x,y,.12]),'#35433f');
// Narrow waterfront piers and an island in the bay.
for(let y=-5;y<2;y+=.7)drawbox({x:4,y,z:.12,w:.8,d:.14,h:.08,color:'#61716b'});poly([[7,-6,.1],[8,-6.3,.1],[8.5,-5.6,.1],[7.6,-5.2,.1]],'#475c48');drawbox({x:7.6,y:-5.9,z:.1,w:.4,d:.3,h:.3,color:'#788379'});
ctx.save();ctx.shadowColor='#c6f56b';ctx.shadowBlur=0;
for(let x=-3.5;x<2.5;x+=.58)for(let y=-2;y<3.5;y+=.6){
let z=ground(x,y)+.055;
line([x,y,z],[x+.46,y,z],'#96b354',.7);
line([x,y,z],[x,y+.48,z],'#96b354',.7);
}
ctx.restore();
companyLayer?.groundTiles({ctx,project,ground});
objects.sort((a,b)=>{let f=o=>(o.x+o.w/2)*viewSin+(o.y+o.d/2)*viewCos;return f(a)-f(b)}).forEach(drawbox);
// Golden Gate deck, towers, and suspended cables.
poly([[-6.2,-5.8,1.1],[-5.8,-5.8,1.1],[-5.8,-12,1.1],[-6.2,-12,1.1]],'#bb6b54');for(let y of [-7,-10.4]){for(let x of [-6.23,-5.77])drawbox({x,y,z:.1,w:.09,d:.12,h:2.9,color:'#b45d48'});for(let z of [1.6,2.45])line([-6.23,y,z],[-5.68,y,z],'#a85644',3)}for(let x of [-6.21,-5.79]){let prev=null;for(let y=-12;y<=-5.8;y+=.14){let z=y<-10.4?1.2+1.8*(y+12)/1.6:y>-7?3-1.8*(y+7)/1.2:1.55+1.45*((y+8.7)/1.7)**2;let p=[x,y,z];if(prev)line(prev,p,'#a75946',1.4);if(Math.round((y+12)*100)%28===0)line(p,[x,y,1.1],'#b26a55',.6);prev=p}}
let labels=[['GOLDEN GATE',-6.2,-9,3.2],['DOWNTOWN',3,-2,4.5],['GOLDEN GATE PARK',-5,-1,.6]];ctx.font='8px DM Sans, sans-serif';ctx.textAlign='center';ctx.fillStyle='#aac3ad';for(let [name,x,y,z]of labels){let p=project(x,y,z);ctx.fillText(name,p[0],p[1]-8)}
}
function frame(now){
raf=0;if(document.hidden)return;
const dt=last?Math.min((now-last)/1000,.05):0;last=now;
if(!paused)t+=dt;
const animated=!paused&&companyLayer?.isAnimated(mode);
if(cityDirty){ctx=cityCtx;try{renderCity();cityDirty=false;}finally{ctx=displayCtx}needsFrame=true}
if(needsFrame||animated){
ctx.clearRect(0,0,W,H);ctx.drawImage(cityCanvas,0,0,W,H);
companyLayer?.draw({ctx,project,mapProject:mapProjection,viewMode,ground,W,H,zoom,t,intensity,mode,cityCanvas,dpr});needsFrame=false;}
if(animated)requestRender();else last=0;
}
document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0}else requestRender()});
requestRender(true);


function setView(view){viewMode=view;companyLayer?.setVisible(true);document.querySelector('#panel-title').textContent='Company weather';drag=null;pan={x:0,y:0};zoom=view==='2d'?1:1.12;
document.querySelector('#view2d').setAttribute('aria-pressed',view==='2d');
document.querySelector('#view3d').setAttribute('aria-pressed',view==='3d');
document.querySelector('.viewhint').innerHTML=(view==='2d'?'↔ Drag to pan':'↔ Drag to orbit')+' <b>·</b> Scroll to zoom';
canvas.setAttribute('aria-label',view==='2d'?'San Francisco map. Drag to pan and scroll to zoom.':'San Francisco 3D city. Drag to orbit and scroll to zoom.');
document.querySelectorAll('.maplabel,.baylabel,.compass').forEach(el=>el.hidden=view==='2d');requestRender(true)}
document.querySelector('#view2d').onclick=()=>setView('2d');
document.querySelector('#view3d').onclick=()=>setView('3d');
companyLayer=window.createCompanyLayer({requestRender,getBuildings:()=>objects});
setView('3d');
