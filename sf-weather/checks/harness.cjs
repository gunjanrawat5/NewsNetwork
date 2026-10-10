const fs=require('node:fs'),vm=require('node:vm');
module.exports=function(){
let strokes=0,copies=0,clips=0,moneyCopies=0,id=0;const queue=new Map(),elements={},listeners={},all=[];
class Element{
constructor(tag='div'){this.tagName=tag;this.children=[];this.dataset={};this.style={setProperty(){}};this.classList={add(){},toggle(){}};this.attrs={};this.clientHeight=800;all.push(this)}
append(...children){this.children.push(...children)}replaceChildren(...children){this.children=children}setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return this.attrs[k]}addEventListener(k,v){this[k]=v}setPointerCapture(){}getContext(){return context()}}
function context(){return new Proxy({createRadialGradient:()=>({addColorStop(){}}),stroke(){strokes++},drawImage(image){copies++;if(image.width===36&&image.height===20)moneyCopies++},clip(){clips++}},{get:(o,k)=>k in o?o[k]:()=>{}})}
const canvas=new Element('canvas');
const document={hidden:false,createElement:t=>new Element(t),querySelector:s=>s==='canvas'?canvas:(elements[s]??=new Element()),querySelectorAll:s=>s==='[data-company-id]'?all.filter(e=>e.dataset.companyId):[],addEventListener:(k,v)=>listeners[k]=v};
const sandbox={document,innerWidth:1400,devicePixelRatio:2,addEventListener(){},requestAnimationFrame:f=>{queue.set(++id,f);return id},cancelAnimationFrame:id=>queue.delete(id),Math,window:{}};vm.createContext(sandbox);
for(const f of ['map.js','company-data.js','company-layer.js','app.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),sandbox);
let now=0;function tick(){const tasks=[...queue.values()];queue.clear();now+=16.67;tasks.forEach(f=>f(now))}
return {run:s=>vm.runInContext(s,sandbox),tick,queue,canvas,document,elements,listeners,stats:()=>({strokes,copies,clips,moneyCopies}),resetStats:()=>{strokes=copies=clips=moneyCopies=0}};
};
