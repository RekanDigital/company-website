/* RekanMU Home loading.
   Scattered points assemble into the logo square and move away from the pointer.
   When the page is ready the points close up, the solid logo takes over, and the header and headline arrive.

   createHomeLoading({ root, canvas, square, logo }) returns { setProgress, finish, destroy }.
   root    element that receives data-home-loading-state: loading, merge, ready, then done
     canvas  a canvas covering the hero
     square  the element that marks where the hero's logo square sits; the points assemble exactly there
     logo    a loaded HTMLImageElement of the mark; blue pixels become points, the white R stays open
   setProgress(p)   retained for scene callers; the owner-approved fill runs for 5.5 seconds.
   finish(onDone)   the page is ready. Complete the fill, hand over, then call onDone().
   destroy()        stop and release everything. */
function createHomeLoading(o){
  "use strict";
  var root=o.root,cv=o.canvas,sq=o.square,logo=o.logo,c=cv.getContext('2d');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W=0,H=0,R=null,P=[],mx=-9999,my=-9999,alive=true,shown=0,finishing=false,tDone=0,stage=0,lastFrame=0,frameId=0,onDone=null;
  var started=performance.now(),FILL=5500;
  var GRID=58;            /* the square is 58 by 58 cells */
  var SETTLE=650;         /* ms: points are pulled home and swell until they touch */
  var MERGE_AT=0.55;      /* fraction of SETTLE at which the solid logo starts to fade in */
  var FADE_AT=0.75;       /* fraction of SETTLE at which the points start to fade out */
  var FADE=700;           /* ms: how long the points take to fade */
  var REPEL=110;          /* px: how far the pointer pushes points */

  /* which cells are blue: read from the logo itself */
  var oc=document.createElement('canvas');oc.width=oc.height=GRID;var g=oc.getContext('2d');g.drawImage(logo,0,0,GRID,GRID);
  var px=g.getImageData(0,0,GRID,GRID).data,cells=[];
  for(var y=0;y<GRID;y++){for(var x=0;x<GRID;x++){var k=(y*GRID+x)*4;if(px[k+2]>150&&px[k]<140){cells.push([x,y]);}}}

  function layout(){var r=cv.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);cv.width=Math.round(r.width*d);cv.height=Math.round(r.height*d);c.setTransform(d,0,0,d,0,0);W=r.width;H=r.height;var s=sq.getBoundingClientRect();R={l:s.left-r.left,t:s.top-r.top,s:s.width};}
  function seed(){ /* points are called in roughly left to right */
    var order=cells.map(function(q){return {cell:q,key:q[0]+Math.random()*10};}).sort(function(a,b){return a.key-b.key;}).map(function(item){return item.cell;});
    P=order.map(function(q){return {gx:q[0],gy:q[1],x:Math.random()*W,y:Math.random()*H,vx:0,vy:0,in:0,ph:Math.random()*6.283,sp:0.25+Math.random()*0.5};});}
  function end(){if(!alive)return;alive=false;cancelAnimationFrame(frameId);frameId=0;cv.style.opacity=0;window.removeEventListener('resize',layout);root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);root.dataset.homeLoadingState='done';if(onDone){var f=onDone;onDone=null;f();}}
  function frame(now){
    if(!alive)return;frameId=requestAnimationFrame(frame);
    var delta=lastFrame?Math.min((now-lastFrame)/(1000/60),2):1;lastFrame=now;
    shown=Math.min(1,(now-started)/FILL);if(finishing&&shown>=1&&!tDone)tDone=now;
    var ts=tDone?now-tDone:-1,settling=ts>=0;
    if(settling&&ts>SETTLE*MERGE_AT&&stage<1){stage=1;root.dataset.homeLoadingState='merge';}
    if(settling&&ts>SETTLE&&stage<2){stage=2;root.dataset.homeLoadingState='ready';root.dispatchEvent(new Event('home-loading-ready'));}
    var swell=settling?Math.max(0,Math.min(1,(ts-80)/(SETTLE*0.8))):0;swell=swell*swell*(3-2*swell);
    var fade=settling?Math.max(0,Math.min(1,(ts-SETTLE*FADE_AT)/FADE)):0;
    cv.style.opacity=1-fade;if(fade>=1){end();return;}
    c.clearRect(0,0,W,H);var step=R.s/GRID,n=P.length,called=settling?n:Math.floor(shown*n),ink=[],blue=[];
    for(var i=0;i<n;i++){var p=P[i],tx=R.l+(p.gx+.5)*step,ty=R.t+(p.gy+.5)*step,go=i<called;
      if(go){var kk=settling?0.11:0.045,dm=settling?0.72:0.84;p.vx=(p.vx+(tx-p.x)*kk*delta)*Math.pow(dm,delta);p.vy=(p.vy+(ty-p.y)*kk*delta)*Math.pow(dm,delta);p.in+=(1-p.in)*(1-Math.pow(0.94,delta));}
      else{p.vx=(p.vx+Math.cos(p.ph+now*0.0006*p.sp)*0.05*delta)*Math.pow(0.96,delta);p.vy=(p.vy+Math.sin(p.ph*1.7+now*0.0005*p.sp)*0.05*delta)*Math.pow(0.96,delta);}
      if(!settling){var dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;if(d2<REPEL*REPEL&&d2>0.01){var d=Math.sqrt(d2),f=(1-d/REPEL)*(go?3.2:1.6)*delta;p.vx+=dx/d*f;p.vy+=dy/d*f;}}
      p.x+=p.vx*delta;p.y+=p.vy*delta;
      if(!go){if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;if(p.y<-10)p.y=H+10;if(p.y>H+10)p.y=-10;}
      var dist=Math.abs(p.x-tx)+Math.abs(p.y-ty);(go&&dist<14?blue:ink).push(p.x,p.y,go?0.55+0.45*p.in:0.5);}
    var z0=Math.max(2,step*0.62),z=z0+(step*1.04-z0)*swell,hz=z/2,zi=z0/2;
    c.fillStyle='rgb(14,17,22)';for(var a=0;a<ink.length;a+=3){c.globalAlpha=ink[a+2];c.fillRect(ink[a]-zi,ink[a+1]-zi,z0,z0);}
    c.fillStyle='rgb(49,121,203)';c.globalAlpha=1;for(var b=0;b<blue.length;b+=3){c.fillRect(blue[b]-hz,blue[b+1]-hz,z,z);}
  }
  function move(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;}
  function leave(){mx=my=-9999;}
  root.dataset.homeLoadingState='loading';layout();seed();
  if(reduce){ /* no motion: the finished state appears as soon as the page is ready */
    return {setProgress:function(){},finish:function(cb){root.dataset.homeLoadingState='done';cv.style.opacity=0;if(cb)cb();},destroy:end};}
  window.addEventListener('resize',layout);root.addEventListener('pointermove',move);root.addEventListener('pointerleave',leave);
  frameId=requestAnimationFrame(frame);
  return {setProgress:function(){},finish:function(cb){onDone=cb||null;finishing=true;},destroy:function(){onDone=null;end();}};
}

(function bootstrapHomeLoading(){
  "use strict";
  var path=location.pathname.replace(/\/+$/,'');
  if(path!==''&&path!=='/id')return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var observer=null;
  function start(){
    var root=document.querySelector('[data-home-scene]');
    if(!root)return false;
    if(root.dataset.homeFlightMode==='static'){observer&&observer.disconnect();return true;}
    if(root.__homeLoading){observer&&observer.disconnect();return true;}
    var canvas=root.querySelector('[data-home-loading-canvas]');
    var square=root.querySelector('[data-home-loading-square]');
    var logo=root.querySelector('[data-home-loading-logo]');
    if(!(canvas&&square&&logo))return false;
    if(!logo.complete){logo.addEventListener('load',start,{once:true});logo.addEventListener('error',function(){root.dataset.homeLoadingState='done';observer&&observer.disconnect();},{once:true});return false;}
    if(!logo.naturalWidth){root.dataset.homeLoadingState='done';observer&&observer.disconnect();return true;}
    try{
      root.__homeLoading=createHomeLoading({root:root,canvas:canvas,square:square,logo:logo});
    }catch(_error){root.dataset.homeLoadingState='done';}
    observer&&observer.disconnect();
    return true;
  }
  observer=new MutationObserver(function(){if(start())observer.disconnect();});
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(start())observer.disconnect();
})();
