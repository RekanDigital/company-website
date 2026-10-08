/* RekanMU Home loading.
   Scattered points assemble into the logo square and move away from the pointer.
   When the page is ready the points close up, the solid logo takes over, and the header and headline arrive.

   createHomeLoading({ root, canvas, square, logo }) returns { setProgress, finish, destroy }.
     root    element that receives the state classes: "loading" (set in the markup), then "merge", then "ready"
     canvas  a canvas covering the hero
     square  the element that marks where the hero's logo square sits; the points assemble exactly there
     logo    a loaded HTMLImageElement of the mark; blue pixels become points, the white R stays open
   setProgress(p)   real load progress, 0 to 1. May jump; it is smoothed here.
   finish(onDone)   the page is ready. The points complete quickly, hand over, then onDone() is called.
   destroy()        stop and release everything. */
function createHomeLoading(o){
  "use strict";
  var root=o.root,cv=o.canvas,sq=o.square,logo=o.logo,c=cv.getContext('2d');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W=0,H=0,R=null,P=[],mx=-9999,my=-9999,alive=true,target=0,shown=0,finishing=false,tDone=0,stage=0,onDone=null;
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
    var order=cells.slice().sort(function(a,b){return (a[0]+Math.random()*10)-(b[0]+Math.random()*10);});
    P=order.map(function(q){return {gx:q[0],gy:q[1],x:Math.random()*W,y:Math.random()*H,vx:0,vy:0,in:0,ph:Math.random()*6.283,sp:0.25+Math.random()*0.5};});}
  function ease(u){return u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;}
  function end(){alive=false;cv.style.opacity=0;window.removeEventListener('resize',layout);root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);if(onDone){var f=onDone;onDone=null;f();}}
  function frame(now){
    if(!alive)return;requestAnimationFrame(frame);
    /* progress is smoothed, and hurried once the page says it is ready: the loading never holds the visitor back */
    shown+=(target-shown)*(finishing?0.2:0.08);if(finishing&&shown>0.995){shown=1;if(!tDone)tDone=now;}
    var ts=tDone?now-tDone:-1,settling=ts>=0;
    if(settling&&ts>SETTLE*MERGE_AT&&stage<1){stage=1;root.classList.add('merge');}
    if(settling&&ts>SETTLE&&stage<2){stage=2;root.classList.remove('loading');root.classList.add('ready');}
    var swell=settling?Math.max(0,Math.min(1,(ts-80)/(SETTLE*0.8))):0;swell=swell*swell*(3-2*swell);
    var fade=settling?Math.max(0,Math.min(1,(ts-SETTLE*FADE_AT)/FADE)):0;
    cv.style.opacity=1-fade;if(fade>=1){end();return;}
    c.clearRect(0,0,W,H);var step=R.s/GRID,n=P.length,called=settling?n:Math.floor(ease(shown)*n),ink=[],blue=[];
    for(var i=0;i<n;i++){var p=P[i],tx=R.l+(p.gx+.5)*step,ty=R.t+(p.gy+.5)*step,go=i<called;
      if(go){var kk=settling?0.11:0.045,dm=settling?0.72:0.84;p.vx=(p.vx+(tx-p.x)*kk)*dm;p.vy=(p.vy+(ty-p.y)*kk)*dm;p.in+=(1-p.in)*0.06;}
      else{p.vx=(p.vx+Math.cos(p.ph+now*0.0006*p.sp)*0.05)*0.96;p.vy=(p.vy+Math.sin(p.ph*1.7+now*0.0005*p.sp)*0.05)*0.96;}
      if(!settling){var dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;if(d2<REPEL*REPEL&&d2>0.01){var d=Math.sqrt(d2),f=(1-d/REPEL)*(go?3.2:1.6);p.vx+=dx/d*f;p.vy+=dy/d*f;}}
      p.x+=p.vx;p.y+=p.vy;
      if(!go){if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;if(p.y<-10)p.y=H+10;if(p.y>H+10)p.y=-10;}
      var dist=Math.abs(p.x-tx)+Math.abs(p.y-ty);(go&&dist<14?blue:ink).push(p.x,p.y,go?0.55+0.45*p.in:0.5);}
    var z0=Math.max(2,step*0.62),z=z0+(step*1.04-z0)*swell,hz=z/2,zi=z0/2;
    c.fillStyle='rgb(14,17,22)';for(var a=0;a<ink.length;a+=3){c.globalAlpha=ink[a+2];c.fillRect(ink[a]-zi,ink[a+1]-zi,z0,z0);}
    c.fillStyle='rgb(49,121,203)';c.globalAlpha=1;for(var b=0;b<blue.length;b+=3){c.fillRect(blue[b]-hz,blue[b+1]-hz,z,z);}
  }
  function move(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;}
  function leave(){mx=my=-9999;}
  layout();seed();
  if(reduce){ /* no motion: the finished state appears as soon as the page is ready */
    return {setProgress:function(){},finish:function(cb){root.classList.remove('loading');root.classList.add('merge','ready');cv.style.opacity=0;if(cb)cb();},destroy:function(){}};}
  window.addEventListener('resize',layout);root.addEventListener('pointermove',move);root.addEventListener('pointerleave',leave);
  requestAnimationFrame(frame);
  return {setProgress:function(p){target=Math.max(target,Math.min(1,p));},finish:function(cb){onDone=cb||null;target=1;finishing=true;},destroy:function(){onDone=null;end();}};
}
