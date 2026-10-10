const assert=require('node:assert/strict'),{performance}=require('node:perf_hooks');
const h=require('./harness.cjs')(),{run,tick,queue,canvas,elements,document,listeners}=h;
run("document.querySelector('#company-effects').onchange({target:{value:'preview'}});setView('3d')");tick();assert.equal(queue.size,0,'Clear preview must become idle');assert(h.stats().strokes>1000);
run("mode='rain';update()");tick();h.resetStats();let start=performance.now();for(let i=0;i<120;i++)tick();let elapsed=performance.now()-start;
assert.equal(h.stats().strokes,12*120,'One particle stroke per company, with no building strokes');
elements['#pause'].onclick({target:{}});tick();assert.equal(queue.size,0,'Paused simulation must become idle');
canvas.onpointerdown({clientX:100,clientY:100,pointerId:1});canvas.onpointermove({clientX:170,clientY:100});h.resetStats();tick();assert(h.stats().strokes>1000,'Orbit rebuilds cached city');assert.equal(queue.size,0);
canvas.onlostpointercapture();let angle=run('angle');canvas.onpointermove({clientX:200,clientY:100});assert.equal(run('angle'),angle);
for(const mode of ['clear','rain','storm','heat','fog']){run(`mode='${mode}';paused=false;update()`);tick()}
document.hidden=true;listeners.visibilitychange();assert.equal(queue.size,0);document.hidden=false;listeners.visibilitychange();tick();assert.equal(queue.size,1);
canvas.wheel({preventDefault(){},deltaY:100000,deltaMode:0});tick();assert.equal(run('zoom'),.55);canvas.wheel({preventDefault(){},deltaY:-100000,deltaMode:0});tick();assert.equal(run('zoom'),1.65);
run("setView('2d')");tick();canvas.onpointerdown({clientX:100,clientY:100,pointerId:2});canvas.onpointermove({clientX:150,clientY:125});tick();assert.equal(run('pan.x'),50);assert.equal(run('pan.y'),25);canvas.onpointerup();
for(const mode of ['clear','rain','storm','heat','fog']){run(`mode='${mode}';paused=false;update()`);tick()}
elements['#reset'].onclick();assert.equal(run('pan.x'),0);assert.equal(run('zoom'),1);tick();run("setView('3d')");tick();assert.equal(run('zoom'),1.12);
console.log(`PASS: 2D/3D rendering, localized preview, caching, pause, orbit, capture cleanup, five weather modes, visibility, zoom. 120 mocked frames: ${elapsed.toFixed(1)}ms.`);
