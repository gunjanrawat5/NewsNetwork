/* map.js */
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

;
/* company-data.js */
window.COMPANY_DATA = {"sourceFile": "daily_log.csv", "asOf": "2026-10-10", "selection": "12 unique companies balancing CA relevance, financial scale, operational damage and all requested effect families: money, quake, heat/cold, thunderstorm. Larger non-CA stories are included for impact; map positions are random demos. Only selected CSV rows are used; no claims are independently verified.", "effectMapping": {"money": "Funding round → falling banknotes (not profit)", "quake": "Layoffs / halted pipeline → localized shaking (not a physical earthquake)", "storm": "Lightning, Storm forming, Hurricane, Hurricane watch, Storms merging → localized thunderstorm; forming/watch remain reported or proposed as labeled", "cold": "Cold front / negative market or revenue signal → cold overlay", "heat": "Clay tender offer rising from $1.5B to $5B → warm valuation updraft (CSV weather: Evaporation), not a stock return or realized revenue"}, "companies": [{"id": "openai", "name": "OpenAI", "domain": "openai.com", "logo": "logos/openai.png", "kind": "mixed", "metric": "Reported ~$20B revenue run-rate gap", "effects": ["storm", "cold"], "city": "San Francisco", "summary": "OpenAI rolls out GPT-6 in ChatGPT with Intelligent UI", "events": [{"type": "storm", "date": "Wed Oct 7", "category": "Product launch", "classification": "Product launch", "weather": "Lightning", "status": "Confirmed", "headline": "OpenAI rolls out GPT-6 in ChatGPT with Intelligent UI", "details": "GPT-6 Sol for Plus, Pro, Business and Enterprise. Intelligent UI builds charts, buttons, forms, calculators and games inside the chat. GPT-6 can start answering while still thinking; GPT-6 Instant is 44% faster than GPT-5.6 Instant on web search", "companiesMentioned": "OpenAI", "region": "North America", "location": "", "source": "daily_log.csv · row 24", "amountM": null, "valuationM": null, "amountMeaning": "No funding proceeds assigned"}, {"type": "cold", "date": "Thu Oct 8", "category": "Rates and bonds", "classification": "Rates and bonds", "weather": "Cold front", "status": "Reported", "headline": "FT reports OpenAI's revenue run rate is ~$20B below what it signaled; chip stocks drop 3.4%", "details": "Nvidia -2.9% to $230.48, erasing ~$169B. Broadcom, Intel, Micron down 2.9% or more. Nasdaq -1.3% to ~27,193, S&P -0.5%", "companiesMentioned": "OpenAI, Nvidia, Broadcom, Intel, Micron", "region": "North America", "location": "", "source": "daily_log.csv · row 41", "amountM": null, "valuationM": null, "amountMeaning": "No funding proceeds assigned"}, {"type": "storm", "date": "Thu Oct 8", "category": "Product launch", "classification": "Product launch", "weather": "Lightning", "status": "Confirmed", "headline": "GPT-6 Luna starts rolling out to ChatGPT Free and Go users", "details": "", "companiesMentioned": "OpenAI", "region": "North America", "location": "", "source": "daily_log.csv · row 51", "amountM": null, "valuationM": null, "amountMeaning": "No funding proceeds assigned"}, {"type": "storm", "date": "This week, day not given", "category": "Round in talks", "classification": "Round in talks", "weather": "Storm forming", "status": "Reported", "headline": "OpenAI reportedly raising at a valuation over $1.2T", "details": "", "companiesMentioned": "OpenAI", "region": "North America", "location": "", "source": "daily_log.csv · row 70", "amountM": null, "valuationM": 1200000.0, "amountMeaning": "Reported target / proposal; not completed proceeds"}], "impacts": {"cold": {"value": 20000, "unit": "USD millions", "basis": "Reported revenue run-rate gap"}}}, {"id": "nvidia", "name": "NVIDIA", "domain": "nvidia.com", "logo": "logos/nvidia.png", "kind": "loss", "metric": "~$169B market value erased (CSV)", "effects": ["cold", "storm"], "city": "San Francisco", "summary": "Microsoft and Nvidia unveil the Surface Laptop Ultra on Nvidia's new RTX Spark chip", "events": [{"type": "storm", "date": "Wed Oct 7", "category": "Product launch", "classification": "Product launch", "weather": "Lightning", "status": "Confirmed", "headline": "Microsoft and Nvidia unveil the Surface Laptop Ultra on Nvidia's new RTX Spark chip", "details": "ARM chip with a Blackwell GPU, up to 1 petaflop of AI compute, runs 120B+ parameter models locally, up to 128GB memory. From $2,599, ships Oct 16. Surface RTX Spark Dev Box at $5,999 ships in November. Lenovo, Asus, Dell, MSI and HP laptops on Oct 16", "companiesMentioned": "Microsoft, Nvidia", "region": "North America", "location": "", "source": "daily_log.csv · row 35", "amountM": null, "valuationM": null, "amountMeaning": "No funding proceeds assigned"}, {"type": "storm", "date": "Wed Oct 7", "category": "Product launch", "classification": "Product launch", "weather": "Lightning", "status": "Confirmed", "headline": "Windows 11 gets agent features: sandboxing, agent attribution, IT controls", "details": "HydraFusion (local plus cloud agents) launches Oct 15 for GitHub Copilot, CLI and VS Code. On-device models: MAI Code 1.1 Flash and Nvidia Nemotron. Meta's Muse agent comes to Windows", "companiesMentioned": "Microsoft, Meta, Nvidia", "region": "North America", "location": "", "source": "daily_log.csv · row 36", "amountM": null, "valuationM": null, "amountMeaning": "No funding proceeds assigned"}, {"type": "cold", "date": "Thu Oct 8", "category": "Rates and bonds", "classification": "Rates and bonds", "weather": "Cold front", "status": "Reported", "headline": "FT reports OpenAI's revenue run rate is ~$20B below what it signaled; chip stocks drop 3.4%", "details": "Nvidia -2.9% to $230.48, erasing ~$169B. Broadcom, Intel, Micron down 2.9% or more. Nasdaq -1.3% to ~27,193, S&P -0.5%", "companiesMentioned": "OpenAI, Nvidia, Broadcom, Intel, Micron", "region": "North America", "location": "", "source": "daily_log.csv · row 41", "amountM": null, "valuationM": null, "amountMeaning": "No funding proceeds assigned"}, {"type": "cold", "date": "Fri Oct 9", "category": "Rates and bonds", "classification": "Rates and bonds", "weather": "Sunshine returns", "status": "Confirmed", "headline": "Markets bounce: Nasdaq +0.6% to 27,366, now up 17.7% this year", "details": "Nvidia still -0.5%. Cala ties the rebound to a US pledge not to strike Iran", "companiesMentioned": "Nasdaq, Nvidia", "region": "North America", "location": "", "source": "daily_log.csv · row 64", "amountM": null, "valuationM": null, "amountMeaning": "No funding proceeds assigned"}], "impacts": {"cold": {"value": 169000, "unit": "USD millions", "basis": "Reported market value erased"}}}, {"id": "anthropic", "name": "Anthropic", "domain": "anthropic.com", "logo": "logos/anthropic.png", "kind": "storm", "metric": "Reported IPO: up to ~$100B", "effects": ["storm"], "city": "San Francisco, CA", "summary": "Anthropic releases Claude Haiku 5.5", "events": [{"type": "storm", "date": "Wed Oct 7", "category": "Product launch", "classification": "Product launch", "weather": "Lightning", "status": "Confirmed", "headline": "Anthropic releases Claude Haiku 5.5", "details": "", "companiesMentioned": "Anthropic", "region": "North America", "location": "", "source": "daily_log.csv · row 37", "amountM": null, "valuationM": null, "amountMeaning": "No funding proceeds assigned"}, {"type": "storm", "date": "Thu Oct 8", "category": "Product launch", "classification": "Product launch", "weather": "Lightning", "status": "Confirmed", "headline": "Google launches Gemini Agent, one AI agent for all work, at Gemini at Work 2026", "details": "Plans tasks, writes and runs code, returns finished work in Workspace, Microsoft 365 and Slack. Picks the best model per task, Gemini or Claude. Gets its own Workspace account. Private preview", "companiesMentioned": "Google, Anthropic", "region": "North America", "location": "", "source": "daily_log.csv · row 50", "amountM": null, "valuationM": null, "amountMeaning": "No funding proceeds assigned"}, {"type": "storm", "date": "Fri Oct 9", "category": "IPO prep", "classification": "IPO prep", "weather": "Hurricane watch", "status": "Reported", "headline": "Anthropic reportedly preparing an IPO of up to ~$100B at ~$2T", "details": "Expected in the coming weeks per reports; not confirmed", "companiesMentioned": "Anthropic", "region": "North America", "location": "San Francisco, CA", "source": "daily_log.csv · row 55", "amountM": 100000.0, "valuationM": 2000000.0, "amountMeaning": "Reported target / proposal; not completed proceeds"}], "impacts": {"storm": {"value": 100000, "unit": "USD millions", "basis": "Reported IPO proceeds target, not completed funding"}}}, {"id": "spacex", "name": "SpaceX", "domain": "spacex.com", "logo": "logos/spacex.png", "kind": "storm", "metric": "Reported ~$40B financing talks", "effects": ["storm"], "city": "San Francisco", "summary": "SpaceX reportedly seeking $40B in financing to buy Nvidia chips", "events": [{"type": "storm", "date": "Wed Oct 7", "category": "Round in talks", "classification": "Round in talks", "weather": "Storm forming", "status": "Reported", "headline": "SpaceX reportedly seeking $40B in financing to buy Nvidia chips", "details": "Added to chip stock swings; Micron -3.1% premarket", "companiesMentioned": "SpaceX, Nvidia", "region": "North America", "location": "", "source": "daily_log.csv · row 25", "amountM": 40000.0, "valuationM": null, "amountMeaning": "Reported target / proposal; not completed proceeds"}], "impacts": {"storm": {"value": 40000, "unit": "USD millions", "basis": "Reported financing target, not completed funding"}}}, {"id": "blue-origin", "name": "Blue Origin", "domain": "blueorigin.com", "logo": "logos/blue-origin.png", "kind": "funding", "metric": "$10B funding round", "effects": ["money", "storm"], "city": "Kent, WA", "summary": "Blue Origin closes a $10B round, its first from outside investors", "events": [{"type": "funding", "date": "Wed Oct 7", "category": "Funding round", "classification": "Funding round", "weather": "Hurricane", "status": "Confirmed", "headline": "Blue Origin closes a $10B round, its first from outside investors", "details": "Web reports put it at ~$130B. Cala dates it Oct 7 to 8. HQ Kent, WA", "companiesMentioned": "Blue Origin", "region": "North America", "location": "Kent, WA", "source": "daily_log.csv · row 26", "amountM": 10000.0, "valuationM": 130000.0, "amountMeaning": "Disclosed funding round in supplied CSV; not revenue or profit"}], "amountM": 10000.0, "impacts": {"money": {"value": 10000, "unit": "USD millions", "basis": "Funding round"}, "storm": {"value": 10000, "unit": "USD millions", "basis": "Hurricane-sized funding round"}}}, {"id": "vinci", "name": "Vinci", "domain": "getvinci.ai", "logo": "logos/vinci.png", "kind": "funding", "metric": "$250M Series B", "effects": ["money"], "city": "Palo Alto, CA", "summary": "Vinci raises a $250M Series B at a $1.5B valuation", "events": [{"type": "funding", "date": "Tue Oct 6", "category": "Funding round", "classification": "Funding round", "weather": "Downpour", "status": "Confirmed", "headline": "Vinci raises a $250M Series B at a $1.5B valuation", "details": "Led by Advent International, Temasek and Xora; AMD Ventures, Eclipse, Khosla Ventures, Madrona joined", "companiesMentioned": "Vinci", "region": "North America", "location": "Palo Alto, CA", "source": "daily_log.csv · row 19", "amountM": 250.0, "valuationM": 1500.0, "amountMeaning": "Disclosed funding round in supplied CSV; not revenue or profit"}], "amountM": 250.0, "impacts": {"money": {"value": 250, "unit": "USD millions", "basis": "Funding round"}}}, {"id": "arena", "name": "Arena", "domain": "arena.ai", "logo": "logos/arena.png", "kind": "funding", "metric": "$200M Series B · $3.1B value", "effects": ["money"], "city": "San Francisco, CA", "summary": "Arena raises a $200M Series B and becomes a $3.1B unicorn", "events": [{"type": "funding", "date": "Fri Oct 9", "category": "Funding round", "classification": "Funding round", "weather": "Downpour", "status": "Confirmed", "headline": "Arena raises a $200M Series B and becomes a $3.1B unicorn", "details": "Lightspeed and Khosla Ventures co-lead; Salesforce Ventures, Dell Technologies Capital", "companiesMentioned": "Arena", "region": "North America", "location": "San Francisco, CA", "source": "daily_log.csv · row 54", "amountM": 200.0, "valuationM": 3100.0, "amountMeaning": "Disclosed funding round in supplied CSV; not revenue or profit"}], "amountM": 200.0, "impacts": {"money": {"value": 200, "unit": "USD millions", "basis": "Funding round"}}}, {"id": "fico", "name": "FICO", "domain": "fico.com", "logo": "logos/fico.png", "kind": "quake", "metric": "~570 roles · ~15% of staff", "effects": ["quake"], "city": "San Jose, CA", "summary": "FICO cuts about 15% of staff, ~570 people, in an AI-driven restructuring", "events": [{"type": "quake", "date": "Tue Oct 6", "category": "Layoffs", "classification": "Layoffs", "weather": "Earthquake", "status": "Confirmed", "headline": "FICO cuts about 15% of staff, ~570 people, in an AI-driven restructuring", "details": "$27M in severance charges", "companiesMentioned": "FICO", "region": "North America", "location": "San Jose, CA", "source": "daily_log.csv · row 22", "amountM": null, "valuationM": null, "people": 570, "staffShare": 0.15, "amountMeaning": "No funding proceeds assigned"}], "impacts": {"quake": {"value": 570, "unit": "roles", "basis": "Approximate affected roles"}}}, {"id": "netflix", "name": "Netflix", "domain": "netflix.com", "logo": "logos/netflix.png", "kind": "quake", "metric": "Reported ~800 roles · ~5%", "effects": ["quake"], "city": "Los Gatos, CA", "summary": "Netflix reportedly planning to cut ~5% of staff, about 800 people", "events": [{"type": "quake", "date": "Fri Oct 9", "category": "Layoffs", "classification": "Layoffs", "weather": "Earthquake", "status": "Reported", "headline": "Netflix reportedly planning to cut ~5% of staff, about 800 people", "details": "Announcement expected mid-October", "companiesMentioned": "Netflix", "region": "North America", "location": "Los Gatos, CA", "source": "daily_log.csv · row 66", "amountM": null, "valuationM": null, "people": 800, "staffShare": 0.05, "amountMeaning": "No funding proceeds assigned"}], "impacts": {"quake": {"value": 800, "unit": "roles", "basis": "Reported approximate affected roles"}}}, {"id": "caribou-biosciences", "name": "Caribou Biosciences", "domain": "cariboubio.com", "logo": "logos/caribou-biosciences.png", "kind": "quake", "metric": "Pipeline halted · layoffs", "effects": ["quake"], "city": "Berkeley, CA", "summary": "Caribou Biosciences halts pipeline work, lays off staff, explores options", "events": [{"type": "quake", "date": "Tue Oct 6", "category": "Layoffs", "classification": "Layoffs", "weather": "Earthquake", "status": "Confirmed", "headline": "Caribou Biosciences halts pipeline work, lays off staff, explores options", "details": "", "companiesMentioned": "Caribou Biosciences", "region": "North America", "location": "Berkeley, CA", "source": "daily_log.csv · row 23", "amountM": null, "valuationM": null, "people": null, "staffShare": null, "amountMeaning": "No funding proceeds assigned"}], "impacts": {}}, {"id": "clay", "name": "Clay", "domain": "clay.com", "logo": "logos/clay.png", "kind": "gain", "metric": "$5B tender value, from $1.5B", "effects": ["heat"], "city": "San Francisco", "summary": "Clay's second tender at $5B, up from $1.5B in May", "events": [{"type": "heat", "date": "This week, day not given", "category": "Tender offer", "classification": "Tender offer", "weather": "Evaporation", "status": "Confirmed", "headline": "Clay's second tender at $5B, up from $1.5B in May", "details": "", "companiesMentioned": "Clay", "region": "North America", "location": "", "source": "daily_log.csv · row 86", "amountM": null, "valuationM": 5000.0, "amountMeaning": "No funding proceeds assigned"}], "impacts": {"heat": {"value": 3500, "unit": "USD millions", "basis": "Tender valuation increase from $1.5B to $5B"}}}, {"id": "schneider-electric", "name": "Schneider Electric", "domain": "se.com", "logo": "logos/schneider-electric.png", "kind": "storm", "metric": "~$22.6B PTC acquisition agreement", "effects": ["storm"], "city": "Boston, MA", "summary": "Schneider Electric agrees to buy PTC for ~$22.6B in cash", "events": [{"type": "storm", "date": "Mon Oct 5", "category": "Acquisition", "classification": "Acquisition", "weather": "Storms merging", "status": "Confirmed", "headline": "Schneider Electric agrees to buy PTC for ~$22.6B in cash", "details": "$205 a share, ~$23.7B enterprise value. PTC is Boston-based industrial software", "companiesMentioned": "Schneider Electric, PTC", "region": "North America", "location": "Boston, MA", "source": "daily_log.csv · row 7", "amountM": 22600.0, "valuationM": null, "amountMeaning": "Agreed acquisition consideration; not revenue"}], "impacts": {"storm": {"value": 22600, "unit": "USD millions", "basis": "Acquisition agreement consideration"}}}]};

;
/* company-layer.js */
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
function choose(id,showNews=false){selected=id;document.querySelector('#company-detail').hidden=!showNews;document.querySelector('#company-detail-hint').hidden=showNews;if(showNews)renderDetails();for(const [key,b]of buttonMap)b.classList.toggle('active',key===id);document.querySelectorAll('[data-company-id]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.companyId===id));requestRender()}
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
const text=document.createElement('span'),name=document.createElement('strong');name.textContent=c.name;text.append(name);b.append(text);b.onclick=()=>choose(c.id);list.append(b)}
if(!companies.some(c=>visible(c)&&c.id===selected)){selected=companies.find(visible)?.id||companies[0].id;document.querySelector('#company-detail').hidden=true;document.querySelector('#company-detail-hint').hidden=false}
requestRender(true);}
for(const c of companies){const b=document.createElement('button');b.type='button';b.className='company-marker';b.style.setProperty('--signal',palette[c.kind]);b.setAttribute('aria-label',`${c.name}: ${amount(c)}. Show news details.`);b.title=c.name+' · '+amount(c);addLogo(b,c);const name=document.createElement('span');name.textContent=c.name;b.append(name);b.onclick=()=>choose(c.id,true);container.append(b);buttonMap.set(c.id,b)}
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
assign();renderList();
return {draw,groundTiles,mapTiles,companies,impactStrength,isAnimated:mode=>source==='workbook'||mode!=='clear',setVisible:visible=>{container.hidden=!visible;document.querySelector('#signal-legend').hidden=!visible;document.querySelector('#company-controls').hidden=!visible;document.querySelector('#weather-controls').hidden=visible;document.querySelector('#sandbox-modes').hidden=visible&&source!=='preview';},getState:()=>({filter,source,selected})};
};

;
/* app.js */
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
