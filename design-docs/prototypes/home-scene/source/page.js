/* The page script of source/prototype.html. It runs inside the same function as world.js, straight after it. */

var doc=document,body=doc.body;
var seq=doc.getElementById("seq"),stage=doc.getElementById("stage"),canvas=doc.getElementById("gl"),col=doc.getElementById("col");
var worldBg=doc.getElementById("worldBg"),heroBack=doc.getElementById("heroBack"),winLogo=doc.getElementById("winLogo"),winEdge=doc.getElementById("winEdge"),brandLogo=doc.getElementById("brandLogo"),heroBtn=doc.getElementById("heroBtn"),target=doc.getElementById("target");
/* business order, names and one-line summaries exactly as listed in HOME.md */
var NAMES=["General Trading & Supply Chain","Technology & Digitalization","Data & Business Intelligence","Fisheries, Seaweed & Blue Economy","Health & Bioscience","Agriculture & Green Economy","Food & Beverage"];
var LINES=["Sourcing, procurement, logistics, and distribution for business and industry.", "Digital systems, automation, AI, IoT, and infrastructure for connected operations.", "Turning business, operational, and spatial data into clearer decisions.", "Developing marine resources from cultivation through processing and downstream value.", "Developing higher-value opportunities from herbal and biological resources.", "Strengthening agriculture through productivity, circular resources, and green-economy development.", "Connecting agricultural outputs with processing, product development, and markets."];
var ORDER=[2,0,1,3,4,5,6];
function code(i){return ("00"+(i+1)).slice(-3);}
var mount=doc.getElementById("sitesMount");
NAMES.forEach(function(n,i){var d=doc.createElement("div");d.className="chap";
  var h=doc.createElement("h2");var a=doc.createElement("a");a.href="#";a.textContent=n;h.appendChild(a);
  var p=doc.createElement("p");p.textContent=LINES[i];
  d.appendChild(h);d.appendChild(p);mount.parentNode.insertBefore(d,mount);});
mount.parentNode.removeChild(mount);
var chaps=Array.prototype.slice.call(col.querySelectorAll(".chap"));

var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function clamp(v){return Math.max(0,Math.min(1,v));}
function sstep(a,b,x){var t=clamp((x-a)/(b-a));return t*t*(3-2*t);}
function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
function goStatic(){body.className+=" static";}

/* the Products & Services row: browsers without scroll-driven animations move it with a few lines of script */
(function(){
  if (window.CSS && CSS.supports && CSS.supports('animation-timeline: view()')) { return; }
  var hs=doc.querySelector('.hs'); if(!hs){return;} var track=hs.querySelector('.track'); track.style.animation='none';
  function move(){ var r=hs.getBoundingClientRect(), span=r.height-window.innerHeight, t=Math.max(0,Math.min(1,-r.top/span));
    track.style.transform='translateX('+(-(track.scrollWidth-window.innerWidth)*t)+'px)'; }
  window.addEventListener('scroll',move,{passive:true}); window.addEventListener('resize',move); move();
})();

var renderer=null,T=null;
if(!reduce&&window.THREE){
  try{
    renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:false,powerPreference:"high-performance"});
    var small=Math.min(window.innerWidth,window.innerHeight)<700||(navigator.deviceMemory&&navigator.deviceMemory<=4);
    var dpr=Math.min(window.devicePixelRatio||1,small?1.5:2);
    renderer.setPixelRatio(dpr);renderer.setClearColor(0x000000,0);
    T=createWorld(THREE,small?{spacing:3.4,objStep:1.25,pointSize:200,pixelRatio:dpr,alwaysDark:true,order:ORDER}:{spacing:2.4,objStep:1,pointSize:170,pixelRatio:dpr,alwaysDark:true,order:ORDER});
  }catch(err){renderer=null;T=null;}
}
if(!renderer||!T){goStatic();return;}

/* scroll phases: enter through the square, fly, exit into the logo */
var ENTER=0.05,EXIT=0.965;
function coreP(P){if(P<ENTER){return 0.02*(P/ENTER);}if(P<EXIT){return 0.02+(P-ENTER)/(EXIT-ENTER)*0.965;}return 0.985+(P-EXIT)/(1-EXIT)*0.015;}

var P=0,Ps=0,px=0,py=0,tx=0,ty=0,t0=performance.now(),visible=true,running=false,W=1,H=1,portrait=false,exitRect=null,btn=null;
function size(){W=stage.clientWidth;H=stage.clientHeight;renderer.setSize(W,H,false);T.camera.aspect=W/H;portrait=W/H<0.8||W<=900;
  var s=stage.getBoundingClientRect(),r=brandLogo.getBoundingClientRect();
  exitRect={l:r.left-s.left,t:r.top-s.top,w:r.width,h:r.height,el:brandLogo};
  /* the hero button sits just under the headline */
  var hr=chaps[0].querySelector("h1").getBoundingClientRect(),ct=chaps[0].getBoundingClientRect();
  heroBtn.style.top=((ct.top-s.top)+chaps[0].offsetHeight+30).toFixed(0)+"px";
  var b=heroBtn.getBoundingClientRect();btn={x:b.left-s.left+b.width/2,y:b.top-s.top+b.height/2};}
function onScroll(){var total=seq.offsetHeight-stage.offsetHeight;var r=seq.getBoundingClientRect();P=total>0?clamp(-r.top/total):0;visible=r.bottom>0&&r.top<window.innerHeight;if(visible&&!running){running=true;requestAnimationFrame(frame);}}

function frame(now,force){
  if(!force&&(!visible||doc.hidden)){running=false;return;}
  var time=(now-t0)/1000;
  Ps+=(P-Ps)*0.085;if(Math.abs(P-Ps)<0.00005){Ps=P;}
  px+=(tx-px)*0.06;py+=(ty-py)*0.06;

  var cp=coreP(Ps);
  /* the window: the logo square at rest, the whole screen in flight, the header logo at the end */
  var e=ease(clamp(Ps/ENTER)),x=ease(clamp((Ps-EXIT)/(1-EXIT)));
  var cx=portrait?W*0.5:W*0.68,cy=portrait?H*0.64:H*0.63,S0=portrait?Math.min(W*0.56,H*0.34):Math.min(H*0.4,W*0.3);
  var cover=Math.max(cx,W-cx,cy,H-cy)+2,half=S0/2+(cover-S0/2)*e;
  var l=Math.max(0,cx-half),t=Math.max(0,cy-half),r=Math.min(W,cx+half),b=Math.min(H,cy+half);
  if(x>0&&exitRect){l=exitRect.l*x;t=exitRect.t*x;r=W+(exitRect.l+exitRect.w-W)*x;b=H+(exitRect.t+exitRect.h-H)*x;}
  var clip="inset("+t.toFixed(1)+"px "+(W-r).toFixed(1)+"px "+(H-b).toFixed(1)+"px "+l.toFixed(1)+"px)";canvas.style.clipPath=clip;worldBg.style.clipPath=clip;
  var fade=Math.max(sstep(2.0,2.9,time),sstep(0.0005,0.012,Ps));
  winLogo.style.transform="translate3d("+l.toFixed(1)+"px,"+t.toFixed(1)+"px,0)";winLogo.style.width=(r-l).toFixed(1)+"px";winLogo.style.height=(b-t).toFixed(1)+"px";
  winLogo.style.opacity=x>0?sstep(0.86,1,x):(1-fade);
  winEdge.style.transform="translate3d("+l.toFixed(1)+"px,"+t.toFixed(1)+"px,0)";winEdge.style.width=(r-l).toFixed(1)+"px";winEdge.style.height=(b-t).toFixed(1)+"px";
  winEdge.style.opacity=x>0?sstep(0.05,0.3,x):(1-sstep(0.6,1,e));
  if(exitRect){exitRect.el.style.opacity=(Ps>ENTER&&x<1)?(x>0?1-sstep(0,0.12,x):1):1;if(x>=0.999){exitRect.el.style.opacity=1;}}

  var st=T.update(cp,time,px,py,portrait,W,H,{x:cx-W/2,y:cy-H/2,k:(1-e)});
  renderer.render(T.scene,T.camera);

  /* one chapter visible at a time, only while the camera holds */
  /* the hero headline moves behind the landscape once the window fills the screen, so terrain can pass in front of it */
  var inside=e>=0.999,ho=st.chap===0?st.o:0;
  heroBack.style.opacity=inside?ho:0;heroBack.style.visibility=(inside&&ho>0.001)?"visible":"hidden";heroBack.style.transform="translate3d(0,"+(-(Math.max(0,cp-0.02))*1300).toFixed(1)+"px,0)";
  chaps.forEach(function(c,i){var o=i===st.chap?st.o:0;if(i===0&&inside){o=0;}if(x>0){o*=1-sstep(0,0.2,x);}c.style.opacity=o;c.style.visibility=o<=0.001?"hidden":"visible";c.style.transform="translate3d(0,"+((1-o)*18).toFixed(1)+"px,0)";
    if(i===0){var bo=inside?ho:o;heroBtn.style.opacity=bo;heroBtn.style.visibility=bo<=0.001?"hidden":"visible";
      heroBtn.style.transform="translate3d(0,"+(inside?(-(Math.max(0,cp-0.02))*1300):((1-o)*18)).toFixed(1)+"px,0)";
      if(btn){var over=btn.x>l&&btn.x<r&&btn.y>t&&btn.y<b;heroBtn.classList.toggle("dk",over);}}});

  /* label on the focus frame */
  var lab=st.site>=0?code(st.site)+"  "+NAMES[st.site].toUpperCase():"";
  if(lab&&st.label.front&&!portrait&&x<=0){if(target.textContent!==lab){target.textContent=lab;}
    target.style.opacity=st.o;target.style.transform="translate3d("+(st.label.x*W).toFixed(1)+"px,"+(st.label.y*H-20).toFixed(1)+"px,0)";}
  else{target.style.opacity=0;}
  requestAnimationFrame(frame);
}
window.addEventListener("scroll",onScroll,{passive:true});
window.addEventListener("resize",function(){size();onScroll();});
window.addEventListener("pointermove",function(e){tx=(e.clientX/window.innerWidth)*2-1;ty=(e.clientY/window.innerHeight)*2-1;},{passive:true});
doc.addEventListener("visibilitychange",function(){if(!doc.hidden){onScroll();}});
canvas.addEventListener("webglcontextlost",function(e){e.preventDefault();goStatic();});
(doc.fonts&&doc.fonts.ready?doc.fonts.ready:Promise.resolve()).then(function(){size();onScroll();});
size();onScroll();running=true;frame(performance.now(),true);
})();
