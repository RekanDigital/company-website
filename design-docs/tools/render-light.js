/* Reference tool, copied from the design workspace. Run with Node. Needs the packages `three` (r128), `gl` and `pngjs`.
   Paths were made relative; create ./out before running. Treat as a starting point, not a finished tool. */
/* Light-palette stills for the inner-page mocks. Uses the working world engine unchanged; only uniforms and camera are overridden at render time. */
const THREE=require('three');const createGL=require('gl');const {PNG}=require('pngjs');const fs=require('fs');
const createWorld=require('./core-ws.js');
const T=createWorld(THREE,{spacing:2.4,objStep:1,pointSize:170,pixelRatio:1,alwaysDark:true,order:[2,0,1,3,4,5,6]});
function setLight(u){u.uBg.value.setRGB(246/255,248/255,250/255);u.uInk.value.setRGB(14/255,17/255,22/255);u.uTer.value.setRGB(112/255,121/255,133/255);u.uTerB.value.setRGB(112/255,121/255,133/255);u.uRaw.value.setRGB(150/255,158/255,168/255);}
function shot(name,W,H,cam,cfg){
  const gl=createGL(W,H,{preserveDrawingBuffer:true,antialias:false});
  const canvas={width:W,height:H,style:{},addEventListener(){},removeEventListener(){},getContext(){return gl}};gl.canvas=canvas;
  const renderer=new THREE.WebGLRenderer({canvas,context:gl,alpha:true});renderer.setSize(W,H,false);
  T.camera.aspect=W/H;T.update(0.9,3.0,0,0,false,W,H);const u=T.uniforms;setLight(u);
  u.uQuiet.value.set(0,0);u.uFog.value.set(cfg.fog?cfg.fog[0]:90000,cfg.fog?cfg.fog[1]:99000);u.uIso.value=0;u.uIsoG.value=0;u.uAgri.value=0;
  u.uLinks.value=cfg.links===undefined?0:cfg.links;u.uScan.value=cfg.scan===undefined?9:cfg.scan;u.uBandK.value=cfg.band||0;
  for(let i=0;i<8;i++){u.uFocus.value[i]=cfg.focus===undefined?1:cfg.focus;u.uShow.value[i]=cfg.show===undefined?1:cfg.show;}
  if(cfg.hideAgri){u.uShow.value[6]=0;}
  if(cfg.only!==undefined){for(let i=0;i<8;i++){u.uShow.value[i]=(i===cfg.only+1)?1:0;}}
  u.uSize.value=cfg.size||170;u.uPix.value=cfg.pix||1;
  T.scene.traverse(o=>{if(o.type==='Group')o.visible=false;});
  renderer.setClearColor(new THREE.Color(246/255,248/255,250/255),1);renderer.render(T.scene,cam);
  const px=new Uint8Array(W*H*4);gl.readPixels(0,0,W,H,gl.RGBA,gl.UNSIGNED_BYTE,px);const png=new PNG({width:W,height:H});
  for(let y=0;y<H;y++){const s=(H-1-y)*W*4;png.data.set(px.subarray(s,s+W*4),y*W*4);}
  fs.writeFileSync('./out/'+name+'.png',PNG.sync.write(png));console.log(name);
}
module.exports={T,shot,THREE};
if(require.main===module){
  /* plan map: straight down, x to the right, south at the top */
  const X0=-760,X1=960,Z0=-400,Z1=760,W=1720,H=1160;
  const oc=new THREE.OrthographicCamera((X0-X1)/2*-1*-1,(X1-X0)/2,(Z1-Z0)/2,-(Z1-Z0)/2,1,4000);
  oc.left=-(X1-X0)/2;oc.right=(X1-X0)/2;oc.top=(Z1-Z0)/2;oc.bottom=-(Z1-Z0)/2;oc.updateProjectionMatrix();
  oc.position.set((X0+X1)/2,900,(Z0+Z1)/2);oc.up.set(0,0,-1);oc.lookAt((X0+X1)/2,0,(Z0+Z1)/2);oc.updateMatrixWorld();
  shot('map',W,H,oc,{size:900,pix:1});
  /* about: one fixed view of the core, in three states */
  const pc=new THREE.PerspectiveCamera(40,1500/640,2,9000);pc.position.set(520,330,-520);pc.lookAt(20,10,70);pc.updateMatrixWorld();
  shot('about1',1500,640,pc,{scan:-1,focus:0,fog:[900,2600]});
  shot('about2',1500,640,pc,{scan:9,focus:0,show:0,fog:[900,2600]});
  shot('about3',1500,640,pc,{scan:9,focus:1,links:1,fog:[900,2600]});
  /* footer: a long low elevation of the world seen from the south */
  const ec=new THREE.OrthographicCamera(-900,1000,150,-40,1,6000);ec.position.set(50,60,-1500);ec.up.set(0,1,0);ec.lookAt(50,60,0);ec.updateMatrixWorld();
  shot('horizon',1900,190,ec,{size:1200,hideAgri:1});
}
