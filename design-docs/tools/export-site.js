/* Reference tool, copied from the design workspace. Run with Node. Needs the packages `three` (r128), `gl` and `pngjs`.
   Paths were made relative; create ./out before running. Treat as a starting point, not a finished tool. */
const THREE=require('three');const createWorld=require('./core-ws.js');
const T=createWorld(THREE,{spacing:2.4,objStep:1,pointSize:170,pixelRatio:1,alwaysDark:true,order:[2,0,1,3,4,5,6]});
let pts=null;T.scene.traverse(o=>{if(o.isPoints)pts=o;});const g=pts.geometry,P=g.attributes.position.array,M=g.attributes.aMeta.array;
const counts={};for(let i=0;i<M.length/2;i++){const s=M[i*2];if(s>0)counts[s]=(counts[s]||0)+1;}
console.log('points per site (1=tech..7=fnb):',JSON.stringify(counts));
const site=+process.argv[2]||1, S=T.sites[site-1];
const out=[];for(let i=0;i<M.length/2;i++){if(M[i*2]!==site)continue;const f=M[i*2+1];if(f===3)continue;out.push(Math.round((P[i*3]-S.x)*10),Math.round((P[i*3+1]-8)*10),Math.round((P[i*3+2]-S.z)*10),f===1?1:0);}
const a=new Int16Array(out);require('fs').writeFileSync('./out/site'+site+'.b64',Buffer.from(a.buffer).toString('base64'));
let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];for(let i=0;i<out.length;i+=4){for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],out[i+k]/10);mx[k]=Math.max(mx[k],out[i+k]/10);}}
console.log('site',site,S.code,'points',out.length/4,'b64 bytes',Buffer.from(a.buffer).toString('base64').length,'min',mn,'max',mx);
