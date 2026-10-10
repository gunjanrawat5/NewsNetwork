/* Company signals use workbook snapshots; coordinates are reproducible demo placements. */
window.createCompanyLayer=function({requestRender,getBuildings}){
const data=window.COMPANY_DATA, container=document.querySelector('#company-markers'), list=document.querySelector('#company-list');
let companies=data.companies.map((c,i)=>({...c,index:i})),selected=companies[0].id,filter='all',source='workbook',layoutSeed=7421;
container.replaceChildren();
const buttonMap=new Map();
const impactMax={};
for(const c of companies)for(const [effect,impact]of Object.entries(c.impacts||{}))impactMax[effect]=Math.max(impactMax[effect]||0,impact.value);
function impactStrength(c,effect){
const impact=c.impacts?.[effect];
if(!impact||!impactMax[effect])return .3;
return .25+.75*Math.sqrt(Math.max(0,impact.value)/impactMax[effect]);
}

// Draw a banknote once and reuse its sprite for all falling money particles.
const banknote=document.createElement('canvas');banknote.width=36;banknote.height=20;
const noteCtx=banknote.getContext('2d');noteCtx.fillStyle='#bfe985';noteCtx.fillRect(0,0,36,20);
noteCtx.strokeStyle='#3c713d';noteCtx.lineWidth=1;noteCtx.strokeRect(1.5,1.5,33,17);
noteCtx.beginPath();noteCtx.ellipse(18,10,6,7,0,0,Math.PI*2);noteCtx.stroke();
noteCtx.fillStyle='#285332';noteCtx.font='bold 13px sans-serif';noteCtx.textAlign='center';noteCtx.textBaseline='middle';noteCtx.fillText('$',18,10.5);
noteCtx.fillRect(4,5,3,2);noteCtx.fillRect(29,13,3,2);
const palette={funding:'#c5ef68',mixed:'#e6db8b',quake:'#ff8f7d',gain:'#ffc864',loss:'#88c7f4',storm:'#d4b0fa'};
function visible(c){return filter==='all'||(filter==='funding'&&c.effects.includes('money'))||(filter==='quake'&&c.effects.includes('quake'))||(filter==='market'&&c.effects.some(e=>e==='heat'||e==='cold'))||(filter==='storm'&&c.effects.includes('storm'))}
function amount(c){return c.metric||c.summary}
function assign(){
let state=layoutSeed;function random(){state=(state*1664525+1013904223)>>>0;return state/4294967296}
const buildings=getBuildings().filter(o=>o.h>.15&&o.w>.25&&o.x>-6.2&&o.x<3.9&&o.y>-6.3&&o.y<6.7);
// Maximize separation of the visible rooftop markers, not just ground coordinates.
const angle=-.55,cos=Math.cos(angle),sin=Math.sin(angle);
function screen(o){let x=o.x+o.w/2,y=o.y+o.d/2;return [x*cos-y*sin,(x*sin+y*cos)*.48-(o.z+o.h+.2)*.93]}
const projected=new Map(buildings.map(o=>[o,screen(o)]));
function distance(a,b){let p=projected.get(a),q=projected.get(b);return Math.hypot(p[0]-q[0],p[1]-q[1])}
let best=[],bestScore=-1;
for(let trial=0;trial<48;trial++){
let chosen=[buildings[Math.floor(random()*buildings.length)]];
while(chosen.length<companies.length){
let winner=null,score=-1;
for(const o of buildings){if(chosen.includes(o))continue;
let groundDistance=Math.min(...chosen.map(a=>Math.hypot(a.x-o.x,a.y-o.y)));
let separation=Math.min(...chosen.map(a=>distance(a,o)));
let value=separation*Math.min(1,groundDistance/2.8);
if(value>score){score=value;winner=o}}
chosen.push(winner);
}
const score=Math.min(...chosen.flatMap((o,i)=>chosen.slice(i+1).map(a=>distance(a,o))));
if(score>bestScore){bestScore=score;best=chosen}
}
// Seeded shuffle keeps the layout stable until the user asks for new locations.
for(let i=best.length-1;i>0;i--){let j=Math.floor(random()*(i+1));[best[i],best[j]]=[best[j],best[i]]}
companies.forEach((c,i)=>{const o=best[i];c.site={...o,x:o.x+o.w/2,y:o.y+o.d/2}});
// Geographic demo locations are independent of the 3D building coordinates.
const mapSites=[[-122.491,37.779],[-122.464,37.798],[-122.439,37.798],[-122.411,37.800],[-122.402,37.780],[-122.418,37.760],[-122.445,37.759],[-122.488,37.748],[-122.459,37.738],[-122.431,37.725],[-122.390,37.735],[-122.415,37.742]];
for(let i=mapSites.length-1;i>0;i--){let j=Math.floor(random()*(i+1));[mapSites[i],mapSites[j]]=[mapSites[j],mapSites[i]]}
companies.forEach((c,i)=>c.mapSite=mapSites[i]);

requestRender(true);
}
function addLogo(parent,c){const img=document.createElement('img');img.src=c.logo;img.alt=c.name+' logo';img.width=26;img.height=26;img.onerror=()=>{img.hidden=true;parent.classList.add('logo-missing')};parent.append(img)}
function choose(id){selected=id;renderDetails();for(const [key,b]of buttonMap)b.classList.toggle('active',key===id);document.querySelectorAll('[data-company-id]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.companyId===id));requestRender()}
function renderDetails(){
const c=companies.find(c=>c.id===selected),detail=document.querySelector('#company-detail');detail.replaceChildren();
const title=document.createElement('strong');title.textContent=c.name;detail.append(title);
const city=document.createElement('small');city.textContent=c.city+' · Random demo block';detail.append(city);
const strengthNote=document.createElement('small');strengthNote.textContent='Relative effect strength: '+c.effects.map(effect=>effect+' '+Math.round(impactStrength(c,effect)*100)+'%'+(!c.impacts?.[effect]?' (unquantified)':'')).join(' · ');detail.append(strengthNote);
for(const e of c.events){const p=document.createElement('p');
if(e.headline){
const meta=document.createElement('small');meta.className='event-meta';meta.textContent=`${e.date} · ${e.category} · ${e.status} (CSV)`;p.append(meta);
const headline=document.createElement('span');headline.textContent=e.headline;p.append(headline);
if(e.details){const details=document.createElement('span');details.className='event-details';details.textContent=e.details;p.append(details)}
const weather=document.createElement('small');weather.textContent='Source weather: '+e.weather;p.append(weather);
if(e.amountM||e.valuationM){const values=document.createElement('small');values.textContent=(e.amountM?`Amount: $${(e.amountM/1000).toLocaleString('en-US',{maximumFractionDigits:3})}B · `:'')+(e.valuationM?`Valuation: $${(e.valuationM/1000).toLocaleString('en-US',{maximumFractionDigits:2})}B · `:'')+e.amountMeaning;p.append(values)}
}else p.textContent=e.summary||'';
const ref=document.createElement('small');ref.textContent=e.source;p.append(ref);detail.append(p)}
if(c.effects.includes('heat')){const note=document.createElement('small');note.textContent='Warm updraft represents the higher tender valuation (CSV: Evaporation), not revenue or a stock gain.';detail.append(note)}
}
function renderList(){list.replaceChildren();for(const c of companies.filter(visible)){
const b=document.createElement('button');b.type='button';b.dataset.companyId=c.id;b.setAttribute('aria-pressed',c.id===selected);b.style.setProperty('--signal',palette[c.kind]);addLogo(b,c);
const text=document.createElement('span'),name=document.createElement('strong'),metric=document.createElement('small');name.textContent=c.name;metric.textContent=amount(c);text.append(name,metric);b.append(text);b.onclick=()=>choose(c.id);list.append(b)}
if(!companies.some(c=>visible(c)&&c.id===selected)){selected=companies.find(visible)?.id||companies[0].id;renderDetails()}
requestRender(true);}
for(const c of companies){const b=document.createElement('button');b.type='button';b.className='company-marker';b.style.setProperty('--signal',palette[c.kind]);b.setAttribute('aria-label',`${c.name}: ${amount(c)}. Show workbook details.`);b.title=c.name+' · '+amount(c);addLogo(b,c);const name=document.createElement('span');name.textContent=c.name;b.append(name);b.onclick=()=>choose(c.id);container.append(b);buttonMap.set(c.id,b)}
document.querySelector('#company-filter').onchange=e=>{filter=e.target.value;renderList()};
document.querySelector('#company-effects').onchange=e=>{source=e.target.value;document.querySelector('#sandbox-modes').hidden=source!=='preview';requestRender()};
document.querySelector('#shuffle-companies').onclick=()=>{layoutSeed+=137;assign()};
function groundTiles({ctx,project,ground}){for(const c of companies.filter(visible)){let {x,y}=c.site,z=ground(x,y)+.075;let corners=[[-.65,-.65],[.65,-.65],[.65,.65],[-.65,.65]].map(([dx,dy])=>project(x+dx,y+dy,z));ctx.beginPath();corners.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=palette[c.kind]+'22';ctx.fill();ctx.strokeStyle=palette[c.kind];ctx.lineWidth=1;ctx.stroke()}}
function mapTiles({ctx,mapProject}){
for(const c of companies.filter(visible)){
const [lon,lat]=c.mapSite,points=[[-.004,-.003],[.004,-.003],[.004,.003],[-.004,.003]].map(([dx,dy])=>mapProject([lon+dx,lat+dy]));
ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=palette[c.kind]+'22';ctx.fill();ctx.strokeStyle=palette[c.kind];ctx.lineWidth=1;ctx.stroke();
}}
function draw({ctx,project,mapProject,viewMode="3d",ground,W,H,zoom,t,intensity:overallIntensity,mode,cityCanvas,dpr}){
for(const c of companies){const b=buttonMap.get(c.id);b.hidden=!visible(c);if(b.hidden)continue;
const {x,y,z,h}=c.site,floor=viewMode==='2d'?mapProject(c.mapSite):project(x,y,ground(x,y)),anchor=viewMode==='2d'?floor:project(x,y,z+h+.2);
b.dataset.view=viewMode;
b.style.transform=`translate(${anchor[0]}px,${anchor[1]-12}px) translate(-50%,-100%)`;b.classList.toggle('active',c.id===selected);
const funding=c.events.some(e=>e.type==='funding'),quake=c.events.find(e=>e.type==='quake');
const effects=source==='preview'?[mode]:c.effects.filter(effect=>filter==='all'||(filter==='funding'?effect==='money':filter==='quake'?effect==='quake':filter==='storm'?effect==='storm':effect==='heat'||effect==='cold'));b.dataset.effects=effects.join(' ');
const radius=Math.max(22,Math.min(58,38*zoom)),top=Math.min(anchor[1]-35,floor[1]-70*zoom),height=Math.max(60,floor[1]-top+8);
ctx.save();
// Clip every weather operation to this company's bounded local volume.
ctx.beginPath();ctx.rect(floor[0]-radius,top,radius*2,height);ctx.clip();
for(const effect of effects){
const weight=source==='preview'?Math.max(...c.effects.map(e=>impactStrength(c,e))):impactStrength(c,effect);
const intensity=overallIntensity*weight;
if(effect==='quake'){
const strength=quake?.people?Math.min(4,1+Math.log10(quake.people)):2,shake=Math.sin(t*39+c.index)*intensity*strength;
const left=Math.max(0,floor[0]-radius),upper=Math.max(0,top),width=Math.max(0,Math.min(W-left,radius*2)),hh=Math.max(0,Math.min(H-upper,height));
if(width&&hh)ctx.drawImage(cityCanvas,left*dpr,upper*dpr,width*dpr,hh*dpr,left+shake,upper,width,hh);
ctx.strokeStyle='#ff8f7dcc';ctx.lineWidth=1.2;
for(let ring=0;ring<3;ring++){const r=((t*(6+intensity*20)+ring*17)%(20+intensity*45))*zoom;ctx.beginPath();ctx.ellipse(floor[0],floor[1],r,r*.42,0,0,Math.PI*2);ctx.stroke()}
 }else if(effect==='money'){
const count=Math.round(3+intensity*32),speed=20+intensity*65,phase=c.index*11.7;
for(let i=0;i<count;i++){
const yy=top+((i*29.3+phase+t*speed)%height);
const xx=floor[0]-radius+8+((i*23.7+phase)%(radius*2-16))+Math.sin(t*1.7+i)*5;
const size=Math.max(.65,Math.min(1.1,zoom*.8));
ctx.save();ctx.translate(xx,yy);ctx.rotate(Math.sin(t*2+i*1.3)*.45);
ctx.globalAlpha=.88;ctx.drawImage(banknote,-10*size,-5.5*size,20*size,11*size);ctx.restore();
}
}else if(effect==='rain'||effect==='storm'){
const speed=50+intensity*150,count=source==='workbook'&&funding?0:Math.round(4+intensity*48),phase=c.index*7.3;
ctx.strokeStyle=source==='workbook'?'#c5ef68ad':'#a5dce6ba';ctx.lineWidth=1;ctx.beginPath();
for(let i=0;i<count;i++){const xx=floor[0]-radius+((i*19.7+phase+t*7)%(radius*2)),yy=top+((i*31.3+phase+t*speed)%height);ctx.moveTo(xx,yy);ctx.lineTo(xx-2,Math.min(top+height,yy+7))}ctx.stroke();
ctx.fillStyle=effect==='storm'?'#70879bbb':'#97b39866';for(let cloud=0;cloud<3;cloud++){ctx.beginPath();ctx.ellipse(floor[0]+(cloud-1)*radius*.32,top+12-(cloud===1?5:0),radius*.38,cloud===1?11:8,0,0,Math.PI*2);ctx.fill()}
if(effect==='storm'&&Math.sin(t*(.7+intensity*2.5)+c.index)>1-(.035+intensity*.15)){ctx.fillStyle=`rgba(231,228,255,${.04+intensity*.16})`;ctx.fillRect(floor[0]-radius,top,radius*2,height);ctx.strokeStyle='#f8e7ac';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(floor[0]+7,top+12);ctx.lineTo(floor[0]-5,top+35);ctx.lineTo(floor[0]+3,top+31);ctx.lineTo(floor[0]-9,top+58);ctx.stroke()}
}else if(effect==='heat'||effect==='cold'||effect==='fog'){
const color=effect==='heat'?'255,187,84':effect==='cold'?'126,197,246':'208,231,219';
const g=ctx.createRadialGradient(floor[0],floor[1]-height*.35,0,floor[0],floor[1]-height*.35,radius);g.addColorStop(0,`rgba(${color},${.04+intensity*.5})`);g.addColorStop(1,`rgba(${color},0)`);ctx.fillStyle=g;ctx.fillRect(floor[0]-radius,top,radius*2,height);
ctx.strokeStyle=`rgba(${color},.65)`;ctx.lineWidth=1;
for(let i=0;i<Math.round(2+intensity*12);i++){let yy=top+((t*(effect==='cold'?26:-20)+i*23)%height+height)%height,xx=floor[0]+Math.sin(t+i)*radius*.6;ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx+4,yy+(effect==='cold'?4:-6));ctx.stroke()}
}
}
ctx.restore();
}
}
assign();renderList();renderDetails();
return {draw,groundTiles,mapTiles,companies,impactStrength,isAnimated:mode=>source==='workbook'||mode!=='clear',setVisible:visible=>{container.hidden=!visible;document.querySelector('#signal-legend').hidden=!visible;document.querySelector('#company-controls').hidden=!visible;document.querySelector('#weather-controls').hidden=visible;document.querySelector('#sandbox-modes').hidden=visible&&source!=='preview';},getState:()=>({filter,source,selected})};
};
