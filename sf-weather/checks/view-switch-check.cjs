const assert=require('node:assert/strict');
const h=require('./harness.cjs')(),{run,tick,elements,canvas,queue}=h;
tick();
const markers=elements['#company-markers'];assert.equal(markers.children.length,12);
const originalMarkers=[...markers.children],sites3d=run('JSON.stringify(companyLayer.companies.map(c=>c.site))');
run('let mapRenderCount=0;const originalMap=window.drawSFMap;window.drawSFMap=(...args)=>{mapRenderCount++;return originalMap(...args)}');
elements['#view2d'].onclick();tick();
assert.equal(run('viewMode'),'2d');assert.equal(run('mapRenderCount'),1);assert.equal(elements['#view2d'].getAttribute('aria-pressed'),true);assert.equal(elements['#view3d'].getAttribute('aria-pressed'),false);
assert.equal(markers.children.length,12);assert(markers.children.every((m,i)=>m===originalMarkers[i]));assert(markers.children.every(m=>m.dataset.view==='2d'));
assert.equal(elements['#company-controls'].hidden,false);assert.equal(elements['#signal-legend'].hidden,false);
const expected=run(`(()=>{const p=mapProjection(companyLayer.companies[0].mapSite);return 'translate('+p[0]+'px,'+(p[1]-12)+'px) translate(-50%,-100%)'})()`);assert.equal(markers.children[0].style.transform,expected);
h.resetStats();tick();assert.equal(run('mapRenderCount'),1,'Animation must reuse cached 2D map');assert.equal(h.stats().clips,12);assert(h.stats().moneyCopies>0);assert(h.stats().strokes<200);
canvas.onpointerdown({clientX:100,clientY:100,pointerId:1});canvas.onpointermove({clientX:140,clientY:120});tick();canvas.onpointerup();assert.equal(run('pan.x'),40);assert.equal(run('pan.y'),20);
const moved=run(`(()=>{const p=mapProjection(companyLayer.companies[0].mapSite);return 'translate('+p[0]+'px,'+(p[1]-12)+'px) translate(-50%,-100%)'})()`);assert.equal(markers.children[0].style.transform,moved);assert.notEqual(moved,expected);
canvas.wheel({preventDefault(){},deltaY:-200,deltaMode:0});tick();assert.equal(run('zoom'),1.2);assert.notEqual(markers.children[0].style.transform,moved);
for(const [filter,count]of [['quake',3],['storm',6],['funding',3],['market',3],['all',12]]){elements['#company-filter'].onchange({target:{value:filter}});tick();h.resetStats();tick();assert.equal(h.stats().clips,count)}
const mapSites=run('JSON.stringify(companyLayer.companies.map(c=>c.mapSite))');
for(let i=0;i<8;i++){elements['#view3d'].onclick();tick();assert.equal(run('viewMode'),'3d');elements['#view2d'].onclick();tick();assert.equal(run('viewMode'),'2d');assert.equal(markers.children.length,12);assert(markers.children.every((m,j)=>m===originalMarkers[j]))}
assert.equal(run('JSON.stringify(companyLayer.companies.map(c=>c.site))'),sites3d);assert.equal(run('JSON.stringify(companyLayer.companies.map(c=>c.mapSite))'),mapSites);
elements['#pause'].onclick({target:{}});tick();assert.equal(queue.size,0);elements['#view3d'].onclick();tick();assert.equal(queue.size,0);assert.equal(markers.children.length,12);
console.log('PASS: actual view buttons, no duplicated marker nodes, geographic 2D placement, pan/zoom alignment, cached local effects, filters, stable sites across repeated switches, and paused switching.');
