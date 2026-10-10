const assert=require('node:assert/strict'),fs=require('node:fs');
const data=JSON.parse(fs.readFileSync('dist/companies.json','utf8'));
assert.equal(data.sourceFile,'daily_log.csv');assert.equal(data.companies.length,12);assert.equal(new Set(data.companies.map(c=>c.id)).size,12);
assert.deepEqual(data.companies.filter(c=>c.amountM).map(c=>[c.name,c.amountM]),[['Blue Origin',10000],['Vinci',250],['Arena',200]]);
const spacex=data.companies.find(c=>c.name==='SpaceX');assert.equal(spacex.amountM,undefined);assert.equal(spacex.events[0].status,'Reported');assert.equal(spacex.events[0].amountM,40000);
const anthropic=data.companies.find(c=>c.name==='Anthropic');assert.equal(anthropic.amountM,undefined);assert.equal(anthropic.events.find(e=>e.category==='IPO prep').amountM,100000);assert.equal(anthropic.events.find(e=>e.category==='IPO prep').status,'Reported');
assert.equal(data.companies.find(c=>c.name==='Netflix').events[0].status,'Reported');assert.equal(data.companies.find(c=>c.name==='Caribou Biosciences').events[0].people,null);
assert.equal(data.companies.find(c=>c.name==='Clay').events[0].weather,'Evaporation');assert.equal(data.companies.find(c=>c.name==='Clay').events[0].valuationM,5000);
for(const effect of ['money','quake','heat','cold','storm'])assert(data.companies.some(c=>c.effects.includes(effect)),effect+' needs a representative');
for(const c of data.companies){const logo=fs.readFileSync('dist/'+c.logo);assert(logo.length>100);assert(logo.subarray(1,4).toString()==='PNG'||logo.readUInt16BE(0)===0xffd8);assert(c.events.every(e=>e.source.startsWith('daily_log.csv · row ')));if(c.effects.includes('storm'))assert(c.events.some(e=>/Lightning|Storm|Hurricane/.test(e.weather)),c.name+' needs a source storm signal')}
const h=require('./harness.cjs')(),{run,tick,queue,elements}=h;tick();
const sites=JSON.parse(run('JSON.stringify(companyLayer.companies.map(c=>c.site))'));assert.equal(new Set(sites.map(o=>o.x+','+o.y)).size,12);assert(run('companyLayer.companies.every(c=>inside(c.site.x,c.site.y))'));
h.resetStats();tick();const maxMoney=Math.max(...data.companies.filter(c=>c.impacts.money).map(c=>c.impacts.money.value));const expectedMoney=data.companies.filter(c=>c.effects.includes('money')).reduce((sum,c)=>sum+Math.round(3+.6*(.25+.75*Math.sqrt(c.impacts.money.value/maxMoney))*32),0);
assert.equal(h.stats().moneyCopies,expectedMoney,'Only completed funding rounds get banknotes');assert.equal(h.stats().clips,12,'All effects must be clipped locally');assert(h.stats().strokes<200,'Animated effects must not redraw buildings');
const strength=(name,effect)=>run(`companyLayer.impactStrength(companyLayer.companies.find(c=>c.name===${JSON.stringify(name)}),${JSON.stringify(effect)})`);
assert.equal(strength('Blue Origin','money'),1);assert(strength('Blue Origin','money')>strength('Vinci','money'));assert(strength('Vinci','money')>strength('Arena','money'));
assert(strength('Netflix','quake')>strength('FICO','quake'));assert(strength('FICO','quake')>strength('Caribou Biosciences','quake'));assert.equal(strength('Caribou Biosciences','quake'),.3);
assert(strength('NVIDIA','cold')>strength('OpenAI','cold'));assert(strength('Anthropic','storm')>strength('SpaceX','storm'));assert(strength('SpaceX','storm')>strength('Schneider Electric','storm'));
elements['#intensity'].oninput({target:{value:20}});tick();h.resetStats();tick();assert(h.stats().moneyCopies<expectedMoney,'Overall slider must reduce particle count');elements['#intensity'].oninput({target:{value:60}});tick();
const separation=run(`(()=>{const sites=companyLayer.companies.map(c=>c.site);let min=Infinity;for(let i=0;i<sites.length;i++)for(let j=i+1;j<sites.length;j++){const a=sites[i],b=sites[j],p=project(a.x,a.y,a.z+a.h+.2),q=project(b.x,b.y,b.z+b.h+.2);min=Math.min(min,Math.hypot(p[0]-q[0],p[1]-q[1]))}return min})()`);assert(separation>100);
const initial=JSON.stringify(sites);elements['#shuffle-companies'].onclick();tick();assert.notEqual(run('JSON.stringify(companyLayer.companies.map(c=>c.site))'),initial);
for(const [filter,count]of [['quake',3],['market',3],['storm',6],['funding',3]]){elements['#company-filter'].onchange({target:{value:filter}});tick();h.resetStats();tick();assert.equal(h.stats().clips,count,filter+' filter coverage');if(filter!=='funding')assert.equal(h.stats().moneyCopies,0)}
elements['#pause'].onclick({target:{}});tick();assert.equal(queue.size,0);
console.log('PASS: 12 CSV companies, all effect categories, funding vs targets, reported status, source rows, bundled logos, localized simultaneous storms, filters, spacing, shuffle, caching and pause.');
