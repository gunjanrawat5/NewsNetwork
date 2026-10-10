// Simplified geographic coordinates, longitude/latitude. North remains up.
window.drawSFMap=function(ctx,W,H,zoom,pan){
const mobile=W<800,left=mobile?18:24,right=mobile?W-18:W-350,top=mobile?183:175,bottom=mobile?H*.52:H-70;
const scale=Math.min((right-left)/(.185*.79),(bottom-top)/.135)*zoom;
const center=[(left+right)/2+pan.x,(top+bottom)/2+pan.y];
const point=([lon,lat])=>[center[0]+(lon+122.44)*.79*scale,center[1]-(lat-37.768)*scale];
function path(coords,close=false){ctx.beginPath();coords.forEach((p,i)=>{let q=point(p);i?ctx.lineTo(...q):ctx.moveTo(...q)});if(close)ctx.closePath()}
function area(coords,color,edge){path(coords,true);ctx.fillStyle=color;ctx.fill();if(edge){ctx.strokeStyle=edge;ctx.lineWidth=1;ctx.stroke()}}
function road(coords,color='#65716d',width=1){path(coords);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
function label(name,lon,lat,color='#bdcbb8',size=9){let p=point([lon,lat]);ctx.font=`500 ${size}px DM Sans, sans-serif`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#192725';ctx.strokeText(name,...p);ctx.fillStyle=color;ctx.fillText(name,...p)}
ctx.fillStyle='#112329';ctx.fillRect(0,0,W,H);
const land=[[-122.508,37.708],[-122.511,37.733],[-122.510,37.762],[-122.514,37.778],[-122.506,37.789],[-122.494,37.787],[-122.483,37.795],[-122.477,37.810],[-122.478,37.812],[-122.470,37.809],[-122.462,37.805],[-122.449,37.807],[-122.443,37.805],[-122.432,37.807],[-122.420,37.809],[-122.410,37.809],[-122.402,37.806],[-122.398,37.800],[-122.390,37.794],[-122.388,37.787],[-122.389,37.782],[-122.386,37.777],[-122.387,37.771],[-122.383,37.765],[-122.382,37.754],[-122.376,37.750],[-122.372,37.740],[-122.358,37.730],[-122.361,37.724],[-122.375,37.722],[-122.386,37.708]];
area(land,'#34433e','#9bad8c');
ctx.save();path(land,true);ctx.clip();
// West-side avenues and the northern/eastern street grids.
ctx.beginPath();for(let lon=-122.507;lon< -122.455;lon+=.0022){let a=point([lon,37.708]),b=point([lon,37.791]);ctx.moveTo(...a);ctx.lineTo(...b)}
for(let lat=37.709;lat<37.793;lat+=.00165){let a=point([-122.514,lat]),b=point([-122.454,lat]);ctx.moveTo(...a);ctx.lineTo(...b)}
for(let lon=-122.454;lon< -122.391;lon+=.0025){let a=point([lon,37.746]),b=point([lon+.006,37.810]);ctx.moveTo(...a);ctx.lineTo(...b)}
for(let lat=37.749;lat<37.811;lat+=.0017){let a=point([-122.458,lat]),b=point([-122.385,lat-.004]);ctx.moveTo(...a);ctx.lineTo(...b)}
ctx.strokeStyle='#52635a';ctx.lineWidth=.55;ctx.stroke();
// Complete the southern neighborhoods rather than ending the grid at Noe Valley.
// Each district has its own alignment; the outer city clip keeps roads off the bay.
function district(bounds,spacing,slant=0,curved=false){
const [west,south,east,north]=bounds;
ctx.save();path([[west,south],[east,south],[east,north],[west,north]],true);ctx.clip();
ctx.beginPath();
for(let lon=west-.03;lon<east+.03;lon+=spacing){
for(let k=0;k<=24;k++){
let lat=south+(north-south)*k/24;
let x=lon+(lat-south)*slant+(curved?Math.sin((lat-south)*310+lon*210)*.0018:0);
let q=point([x,lat]);k?ctx.lineTo(...q):ctx.moveTo(...q);
}}
for(let lat=south-.02;lat<north+.02;lat+=spacing*.72){
for(let k=0;k<=24;k++){
let lon=west+(east-west)*k/24;
let y=lat-(lon-west)*slant*.6+(curved?Math.sin((lon-west)*280+lat*140)*.0014:0);
let q=point([lon,y]);k?ctx.lineTo(...q):ctx.moveTo(...q);
}}
ctx.strokeStyle='#58695e';ctx.lineWidth=.55;ctx.stroke();ctx.restore();
}
district([-122.455,37.708,-122.414,37.748],.0024,.35,true);
district([-122.414,37.708,-122.350,37.748],.0026,-.32);
district([-122.455,37.748,-122.435,37.765],.0024,.1,true);
district([-122.391,37.748,-122.375,37.779],.0024,.05);
// SoMa's diagonal blocks, clipped to its approximate extent.
ctx.save();path([[-122.421,37.773],[-122.396,37.793],[-122.383,37.775],[-122.400,37.765]],true);ctx.clip();
ctx.fillStyle='#34433e';ctx.fill();for(let k=0;k<18;k++){let d=k*.0025;road([[-122.430+d,37.765],[-122.400+d,37.792]],'#617062',.6);road([[-122.432+d,37.795],[-122.397+d,37.765]],'#617062',.6)}ctx.restore();
area([[-122.510,37.772],[-122.455,37.774],[-122.454,37.766],[-122.509,37.764]],'#426847');
area([[-122.455,37.773],[-122.440,37.773],[-122.440,37.771],[-122.455,37.771]],'#426847');
area([[-122.477,37.810],[-122.482,37.795],[-122.474,37.786],[-122.456,37.788],[-122.446,37.798],[-122.460,37.804]],'#406044');
area([[-122.505,37.788],[-122.493,37.789],[-122.490,37.781],[-122.503,37.780]],'#486149');
area([[-122.426,37.727],[-122.413,37.728],[-122.405,37.718],[-122.421,37.714]],'#426449');
area([[-122.501,37.731],[-122.482,37.735],[-122.477,37.712],[-122.495,37.708]],'#405c42');
area([[-122.496,37.728],[-122.489,37.730],[-122.486,37.721],[-122.492,37.715]],'#284c57');
area([[-122.451,37.758],[-122.443,37.757],[-122.443,37.750],[-122.451,37.750]],'#46634a');
area([[-122.430,37.762],[-122.424,37.762],[-122.424,37.758],[-122.430,37.758]],'#527749');
const roads=[['OCEAN AVE',[[-122.485,37.727],[-122.460,37.724],[-122.436,37.722]]],['GENEVA AVE',[[-122.454,37.718],[-122.438,37.716],[-122.425,37.710],[-122.403,37.708]]],['MONTEREY BLVD',[[-122.463,37.732],[-122.443,37.732],[-122.434,37.733]]],['SAN JOSE AVE',[[-122.454,37.708],[-122.440,37.727],[-122.430,37.736],[-122.423,37.745]]],['SAN BRUNO AVE',[[-122.403,37.708],[-122.404,37.729],[-122.405,37.750]]],['THIRD ST',[[-122.395,37.710],[-122.391,37.728],[-122.388,37.746],[-122.389,37.769]]],['CESAR CHAVEZ',[[-122.440,37.749],[-122.415,37.748],[-122.388,37.750]]],['I-280',[[-122.450,37.708],[-122.435,37.732],[-122.420,37.734],[-122.401,37.750],[-122.392,37.767]]],['MARKET ST',[[-122.444,37.758],[-122.418,37.776],[-122.394,37.794]]],['GEARY BLVD',[[-122.508,37.780],[-122.454,37.781],[-122.407,37.787]]],['VAN NESS',[[-122.425,37.775],[-122.424,37.790],[-122.422,37.806]]],['19TH AVE',[[-122.475,37.708],[-122.476,37.765],[-122.478,37.773]]],['SUNSET BLVD',[[-122.495,37.708],[-122.496,37.763]]],['MISSION ST',[[-122.452,37.708],[-122.436,37.724],[-122.419,37.748],[-122.418,37.769],[-122.394,37.791]]],['US 101',[[-122.405,37.708],[-122.407,37.734],[-122.405,37.750],[-122.407,37.767],[-122.420,37.770]]]];
for(let [name,coords]of roads){road(coords,'#1c302b',3);road(coords,name==='MARKET ST'?'#cee88b':'#9da886',1.2)}
ctx.restore();
// Bridge alignments and islands are outside the city clipping path.
road([[-122.478,37.810],[-122.479,37.833]],'#c58d65',3);
road([[-122.391,37.788],[-122.373,37.802],[-122.357,37.813]],'#a2b2a0',2);
area([[-122.371,37.807],[-122.367,37.818],[-122.360,37.825],[-122.354,37.815],[-122.362,37.808]],'#4c6550','#869b7c');
area([[-122.426,37.826],[-122.424,37.828],[-122.420,37.827],[-122.421,37.825]],'#657b5b');
for(let lat=37.786;lat<37.807;lat+=.003)road([[-122.392-(lat-37.786)*.6,lat],[-122.388-(lat-37.786)*.6,lat+.001]],'#839180',2);
const labels=[['RICHMOND',-122.483,37.782],['SUNSET',-122.486,37.750],['PRESIDIO',-122.464,37.797],['GOLDEN GATE PARK',-122.482,37.769],['MARINA',-122.438,37.802],['PACIFIC HEIGHTS',-122.438,37.790],['NORTH BEACH',-122.410,37.802],['DOWNTOWN',-122.406,37.788],['SOMA',-122.402,37.777],['HAIGHT',-122.445,37.768],['CASTRO',-122.436,37.760],['MISSION',-122.418,37.755],['NOE VALLEY',-122.433,37.746],['TWIN PEAKS',-122.449,37.752],['POTRERO HILL',-122.400,37.758],['BAYVIEW',-122.388,37.735],['EXCELSIOR',-122.429,37.723],['GLEN PARK',-122.434,37.734],['BERNAL HEIGHTS',-122.416,37.740],['PORTOLA',-122.408,37.729],['INGLESIDE',-122.458,37.720],['WEST PORTAL',-122.465,37.739],['VISITACION VALLEY',-122.407,37.713],['LAKE MERCED',-122.490,37.721],['McLAREN PARK',-122.419,37.720]];
for(let l of labels)label(...l,l[0].includes('PARK')||l[0]==='PRESIDIO'?'#bedb9e':'#c8d1bd',W<800?7:9);
label('GOLDEN GATE',-122.478,37.821,'#d9ac84',8);label('BAY BRIDGE',-122.369,37.797,'#9bb4b5',8);label('ALCATRAZ',-122.424,37.832,'#93aca9',8);label('TREASURE ISLAND',-122.360,37.827,'#93aca9',8);
label('PACIFIC OCEAN',-122.526,37.750,'#6b929a',10);label('SAN FRANCISCO BAY',-122.353,37.756,'#6b929a',10);
label('N ↑',-122.526,37.807,'#c5ed91',12);
// Scale in geographic degrees: one latitude degree is approximately 111 km.
const length=scale/111;ctx.strokeStyle='#b9cba9';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(left+16,bottom-8);ctx.lineTo(left+16+length,bottom-8);ctx.stroke();ctx.font='9px DM Sans, sans-serif';ctx.textAlign='left';ctx.fillStyle='#9eb197';ctx.fillText('1 km',left+16,bottom-16);
return point;
};
