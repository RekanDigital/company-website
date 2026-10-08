/* Readable source of prototypes/businesses-hero.html, with the point data removed.
   The point data is in assets/point-data/. */


(function(){
"use strict";
var DATA={/* seven base64 strings, one per business: see assets/point-data/ */}, BZ=[{"k": "tech", "n": "Technology &amp; Digitalization", "x": 40, "z": 12}, {"k": "data", "n": "Data &amp; Business Intelligence", "x": 170, "z": 60}, {"k": "trading", "n": "General Trading &amp; Supply Chain", "x": -185, "z": -130}, {"k": "fisheries", "n": "Fisheries, Seaweed &amp; Blue Economy", "x": -520, "z": 50}, {"k": "health", "n": "Health &amp; Bioscience", "x": 440, "z": -60}, {"k": "agri", "n": "Agriculture &amp; Green Economy", "x": -215, "z": 345}, {"k": "fnb", "n": "Food &amp; Beverage", "x": 378, "z": 242}];
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function dec(b64){var s=atob(b64),n=s.length,u=new Uint8Array(n);for(var i=0;i<n;i++)u[i]=s.charCodeAt(i);return new Int16Array(u.buffer);}
function txt(t){var e=document.createElement('textarea');e.innerHTML=t;return e.value;}
var el=document.getElementById('hero'),cv=el.querySelector('canvas.main'),ov=el.querySelector('canvas.over'),ghost=el.querySelector('.ghost');
var gl=cv.getContext('webgl',{antialias:false,alpha:false,premultipliedAlpha:false})||cv.getContext('experimental-webgl');
if(!gl){return;}                         /* without WebGL the headline simply stays as ordinary point type */
el.classList.add('gl');
/* ---- every point of the world: the seven businesses in full, plus the ground ---- */
var NS=BZ.length,S=[],arrs=BZ.map(function(b){return dec(DATA[b.k]);}),NP=0;arrs.forEach(function(a){NP+=a.length/4;});
var G=[];for(var gx=-760;gx<=640;gx+=26){for(var gz=-330;gz<=500;gz+=26){G.push(gx,gz);}}
var N=NP+G.length/2,pos=new Float32Array(N*3),meta=new Float32Array(N*4),o=0;
arrs.forEach(function(a,si){var b=BZ[si],n=a.length/4,mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];
  for(var pass=0;pass<2;pass++){for(var i=0;i<n;i++){var ed=a[i*4+3]===1?1:0;if(ed!==pass)continue;var x=a[i*4]/10,y=a[i*4+1]/10,z=a[i*4+2]/10;pos[o*3]=x+b.x;pos[o*3+1]=y;pos[o*3+2]=z+b.z;meta[o*4]=ed;meta[o*4+1]=si;meta[o*4+2]=Math.random();meta[o*4+3]=Math.random();o++;
    mn[0]=Math.min(mn[0],x);mx[0]=Math.max(mx[0],x);mn[1]=Math.min(mn[1],y);mx[1]=Math.max(mx[1],y);mn[2]=Math.min(mn[2],z);mx[2]=Math.max(mx[2],z);}}
  S.push({cx:b.x+(mn[0]+mx[0])/2,cz:b.z+(mn[2]+mx[2])/2,h:mx[1],ext:Math.max(mx[0]-mn[0],mx[2]-mn[2],(mx[1]-mn[1])*1.25),name:b.n});});
for(var gi=0;gi<G.length;gi+=2,o++){pos[o*3]=G[gi];pos[o*3+1]=0;pos[o*3+2]=G[gi+1];meta[o*4]=0;meta[o*4+1]=7;meta[o*4+2]=Math.random();meta[o*4+3]=Math.random();}
var tgt=new Float32Array(N*3);                       /* where each point sits in the words, and whether it shows there */
var order=new Uint32Array(NP);for(var q=0;q<NP;q++)order[q]=q;for(var q2=NP-1;q2>0;q2--){var r2=Math.floor(Math.random()*(q2+1)),t2=order[q2];order[q2]=order[r2];order[r2]=t2;}
var VS='attribute vec3 aPos;attribute vec4 aMeta;attribute vec3 aTxt;uniform vec2 uRes;uniform vec2 uCam;uniform vec4 uRot;uniform float uSc;uniform vec2 uOrg;uniform float uMix;uniform vec2 uMouse;uniform float uHot;uniform float uFoc;uniform float uFz;uniform float uDpr;varying float vA;varying float vB;'+
'void main(){float X=aPos.x-uCam.x,Z=aPos.z-uCam.y;float xr=X*uRot.x-Z*uRot.y,zr=X*uRot.y+Z*uRot.x;vec2 w=vec2(uOrg.x+xr*uSc,uOrg.y-(aPos.y*uRot.z-zr*uRot.w)*uSc);'+
'float t=clamp(uMix*1.55-aMeta.z*0.55,0.0,1.0);float e=t*t*(3.0-2.0*t);vec2 p=mix(aTxt.xy,w,e);vec2 dir=normalize(w-aTxt.xy+vec2(0.001));p+=vec2(-dir.y,dir.x)*sin(e*3.14159)*(aMeta.w-0.5)*150.0;'+
'vec2 d=p-uMouse;float L=length(d);float k=(1.0-e)*smoothstep(120.0,0.0,L);p+=normalize(d+vec2(0.001))*k*46.0;'+
'float site=aMeta.y;float isG=step(6.5,site);float sel=uFoc>-0.5?uFoc:uHot;float mine=1.0-step(0.5,abs(site-sel));float any=step(-0.5,sel);'+
'float aw=mix(mix(0.86,1.0,aMeta.x),mix(mix(0.30,0.16,uFz),1.0,mine),any);aw=mix(aw,mix(0.30,0.14,uFz),isG);vA=mix(aTxt.z,aw,e);'+
'float blue=mix(aMeta.x,mine*mix(1.0,aMeta.x,step(-0.5,uFoc)),any)*(1.0-isG);vB=blue*e;'+
'float sz=mix(2.5,mix(mix(mix(1.25,1.6,aMeta.x),mix(1.9,2.4,aMeta.x),uFz),1.5,isG),e);gl_PointSize=sz*uDpr;gl_Position=vec4(p.x/uRes.x*2.0-1.0,1.0-p.y/uRes.y*2.0,0.0,1.0);}';
var FS='precision mediump float;varying float vA;varying float vB;void main(){if(vA<0.02)discard;vec3 c=mix(vec3(0.055,0.067,0.086),vec3(0.192,0.475,0.796),vB);gl_FragColor=vec4(c,vA);}';
function sh(t,s){var x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS)){throw new Error(gl.getShaderInfoLog(x));}return x;}
var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){throw new Error(gl.getProgramInfoLog(pr));}gl.useProgram(pr);
function buf(name,data,size,dyn){var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,dyn?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);var l=gl.getAttribLocation(pr,name);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,size,gl.FLOAT,false,0,0);return b;}
buf('aPos',pos,3);buf('aMeta',meta,4);var tb=buf('aTxt',tgt,3,true);
var UN={};['uRes','uCam','uRot','uSc','uOrg','uMix','uMouse','uHot','uFoc','uFz','uDpr'].forEach(function(n){UN[n]=gl.getUniformLocation(pr,n);});
gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(246/255,248/255,250/255,1);
var LINKS=[];[0,1].forEach(function(e){[2,3,4,5,6].forEach(function(v){LINKS.push([e,v]);});});
var WC={x:-40,z:95},V={w:0,h:0,d:1},oc=ov.getContext('2d'),labs=S.map(function(sv){var p=document.createElement('p');p.className='lab';p.textContent=txt(sv.name);el.appendChild(p);return p;});
var state='words',focus=-1,lock=false,hot=-1,yaw=0.5,pitch=0.62,vyaw=0,drag=false,moved=0,lx=0,ly=0,mx=-9999,my=-9999,nx=.5,ny=.5,lastUser=-1e9,ready=false,run=false,mixv=0,last=0,mapTop=0,ptype='mouse',tapHot=-1,cen=[],HOLD=8000,nt=0;
var cam={cx:WC.x,cz:WC.z,sc:0.5,ox:0,oy:0,fz:0};
function fit(){var r=el.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);[cv,ov].forEach(function(c){c.width=Math.round(r.width*d);c.height=Math.round(r.height*d);});oc.setTransform(d,0,0,d,0,0);gl.viewport(0,0,cv.width,cv.height);V={w:r.width,h:r.height,d:d};}
function sample(){
  fit();var er=el.getBoundingClientRect(),cs=getComputedStyle(ghost),fs=parseFloat(cs.fontSize),range=document.createRange();range.selectNodeContents(ghost);var rects=range.getClientRects();if(!rects.length)return;
  var seen=[];for(var q=0;q<rects.length;q++){var rr=rects[q];if(rr.width<2)continue;var dup=false;for(var z2=0;z2<seen.length;z2++){if(Math.abs(seen[z2].top-rr.top)<fs*0.4)dup=true;}if(!dup)seen.push(rr);}
  var m=document.createElement('canvas').getContext('2d');m.font=cs.fontWeight+' '+fs+'px '+cs.fontFamily;try{m.letterSpacing=cs.letterSpacing;}catch(e){}
  var words=ghost.textContent.split(' '),wi=0,lines=[],tp=[];
  seen.forEach(function(rr,li){var line='';while(wi<words.length){var tryl=line?line+' '+words[wi]:words[wi];if(line&&li<seen.length-1&&m.measureText(tryl).width>rr.width+fs*0.12)break;line=tryl;wi++;}lines.push([rr,line]);});
  lines.forEach(function(L){var r=L[0],off=document.createElement('canvas'),ow=Math.ceil(r.width)+24,oh=Math.ceil(fs*1.3);off.width=ow;off.height=oh;var c2=off.getContext('2d');
    c2.font=cs.fontWeight+' '+fs+'px '+cs.fontFamily;try{c2.letterSpacing=cs.letterSpacing;}catch(e){}
    c2.textBaseline='alphabetic';c2.fillStyle='#000';c2.fillText(L[1],0,fs*0.98);var d=c2.getImageData(0,0,ow,oh).data;
    for(var yy=1;yy<oh;yy+=4){for(var xx=1;xx<ow;xx+=4){if(d[(yy*ow+xx)*4+3]>140){tp.push(r.left-er.left+xx,r.top-er.top+(r.height-fs*1.3)/2+yy-fs*0.02);}}}});
  nt=tp.length/2;if(!nt)return;mapTop=seen[seen.length-1].bottom-er.top+fs*0.1;
  /* each point of the world gets a place in the words; only as many as the words need are visible there */
  for(var i=0;i<N;i++){var j=i<NP?order[i]:i,k=(i%nt)*2;tgt[j*3]=tp[k]+(i<nt?0:(Math.random()-.5)*10);tgt[j*3+1]=tp[k+1]+(i<nt?0:(Math.random()-.5)*10);tgt[j*3+2]=i<nt?1:0;}
  gl.bindBuffer(gl.ARRAY_BUFFER,tb);gl.bufferSubData(gl.ARRAY_BUFFER,0,tgt);ready=true;
}
function ui(){var k=state==='world'?hot:(state==='focus'?focus:-1);el.classList.toggle('world',state!=='words');el.classList.toggle('hot',state==='world'&&hot>=0&&!drag);labs.forEach(function(p,i){p.classList.toggle('on',i===k);});}
function go(s,k,user){state=s;focus=(s==='focus')?k:-1;if(s!=='world')hot=-1;if(user)lastUser=performance.now();ui();}
function nearest(){var best=-1,bd=1e9;for(var k=0;k<NS;k++){if(!cen[k])return -1;var d0=Math.hypot(cen[k][0]-mx,cen[k][1]-my);if(d0<bd){bd=d0;best=k;}}if(best>=0&&bd>Math.max(64,S[best].ext*cam.sc*0.55))best=-1;return best;}
function frame(now){
  if(!run)return;requestAnimationFrame(frame);if(!ready)return;
  var w=V.w,h=V.h,small=w<760,dt=Math.min(0.12,(now-last)/1000||0.016);last=now;
  if(!reduce&&!drag&&!lock&&mx<-9000&&now-lastUser>HOLD){var ph=Math.floor((now-lastUser-HOLD)/HOLD)%2;var want=ph===0?'world':'words';if(state!==want){state=want;focus=-1;hot=-1;ui();}}
  var inWorld=state!=='words',f=state==='focus'?focus:-1;
  var tm=inWorld?1:0,stp=dt/(reduce?0.01:1.15);if(mixv<tm){mixv=Math.min(tm,mixv+stp);}else if(mixv>tm){mixv=Math.max(tm,mixv-stp);}   /* arrives and stays: no drift once the world has formed */
  if(!drag){var fr=dt*60;if(!reduce&&inWorld&&hot<0)yaw+=(f>=0?0.0026:0.0016)*fr;yaw+=vyaw*fr;vyaw*=Math.pow(hot>=0?0.5:0.86,fr);}
  var tc,tz,ts,tox,toy;
  if(f>=0){tc=S[f].cx;tz=S[f].cz;ts=(small?Math.min(w*0.8,h*0.30):Math.min(w*0.44,h*0.48))/S[f].ext;tox=w*(small?0.5:0.56);toy=h*(small?0.56:0.74);}
  else{tc=WC.x;tz=WC.z;ts=Math.min(w/1640,h/1125);tox=w*0.5;toy=h*(small?0.56:0.70);}
  var e=1-Math.exp(-dt*5.2);cam.cx+=(tc-cam.cx)*e;cam.cz+=(tz-cam.cz)*e;cam.sc+=(ts-cam.sc)*e;cam.ox+=(tox-cam.ox)*e;cam.oy+=(toy-cam.oy)*e;cam.fz+=((f>=0?1:0)-cam.fz)*(1-Math.exp(-dt*4.6));
  var yw=yaw+(f>=0?(nx-.5)*0.5:0),pt=pitch+(f>=0?(ny-.5)*0.16-0.1:0),cy=Math.cos(yw),sy=Math.sin(yw),cp=Math.cos(pt),sp=Math.sin(pt),sc=cam.sc,ox=cam.ox,oy=cam.oy;
  function P(x,y,z){var a=x-cam.cx,b=z-cam.cz,xr=a*cy-b*sy,zr=a*sy+b*cy;return [ox+xr*sc,oy-(y*cp-zr*sp)*sc];}
  cen=S.map(function(s){return P(s.cx,0,s.cz);});
  if(state==='world'&&!drag&&ptype!=='touch'){var best=nearest();if(best!==hot){hot=best;ui();}}
  if(inWorld){for(var li=0;li<NS;li++){if(f>=0&&li!==f)continue;var q=P(S[li].cx,S[li].h+12,S[li].cz);labs[li].style.left=q[0]+'px';labs[li].style.top=(q[1]-22)+'px';}}
  gl.uniform2f(UN.uRes,w,h);gl.uniform2f(UN.uCam,cam.cx,cam.cz);gl.uniform4f(UN.uRot,cy,sy,cp,sp);gl.uniform1f(UN.uSc,sc);gl.uniform2f(UN.uOrg,ox,oy);gl.uniform1f(UN.uMix,mixv);gl.uniform2f(UN.uMouse,mx,my);
  gl.uniform1f(UN.uHot,state==='world'?hot:-1);gl.uniform1f(UN.uFoc,f);gl.uniform1f(UN.uFz,cam.fz);gl.uniform1f(UN.uDpr,V.d);
  gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.POINTS,0,N);
  /* the links between the businesses, drawn over the points once the world has formed */
  oc.clearRect(0,0,w,h);var la=Math.max(0,(mixv-0.7)/0.3);
  if(la>0.01){oc.strokeStyle='rgb(49,121,203)';oc.lineWidth=1.5;oc.setLineDash([6,8]);oc.lineDashOffset=-now/40;var sel=f>=0?f:hot;
    LINKS.forEach(function(l){var on=sel<0||l[0]===sel||l[1]===sel;oc.globalAlpha=la*(on?(sel<0?0.5:1):0.1);var p1=cen[l[0]],p2=cen[l[1]];oc.beginPath();oc.moveTo(p1[0],p1[1]);oc.quadraticCurveTo((p1[0]+p2[0])/2,(p1[1]+p2[1])/2-Math.abs(p2[0]-p1[0])*0.2-34*sc/0.8,p2[0],p2[1]);oc.stroke();});oc.setLineDash([]);oc.globalAlpha=1;}
}
function where(e){var r=el.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;nx=mx/r.width;ny=my/r.height;}
function follow(){if(drag||lock)return;if(my>mapTop){if(state==='words')go('world',-1,true);}else if(state==='world'){go('words',-1,true);}}
cv.addEventListener('pointerdown',function(e){ptype=e.pointerType||'mouse';where(e);drag=true;moved=0;lx=e.clientX;ly=e.clientY;vyaw=0;lastUser=performance.now();try{cv.setPointerCapture(e.pointerId);}catch(_){}});
el.addEventListener('pointermove',function(e){where(e);lastUser=performance.now();
  if(drag){var dx=e.clientX-lx,dy=e.clientY-ly;moved+=Math.abs(dx)+Math.abs(dy);if(state!=='words'&&moved>5){el.classList.add('drag');yaw+=dx*0.006;vyaw=dx*0.0022;pitch=Math.max(0.28,Math.min(1.15,pitch+dy*0.004));}lx=e.clientX;ly=e.clientY;}
  else if(e.pointerType!=='touch'){follow();}});
function up(){if(!drag)return;drag=false;el.classList.remove('drag');
  if(moved<=5){
    if(state==='words'){tapHot=-1;go('world',-1,true);}
    else if(state==='focus'){lock=false;tapHot=-1;go('world',-1,true);}
    else if(ptype==='touch'){var k=nearest();if(k<0){tapHot=-1;go('words',-1,true);}else if(k===tapHot){lock=true;go('focus',k,true);}else{tapHot=k;hot=k;ui();}}
    else if(hot>=0){lock=true;go('focus',hot,true);}
  }
  lastUser=performance.now();ui();}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',function(){drag=false;el.classList.remove('drag');});
el.addEventListener('pointerleave',function(e){if(drag||e.pointerType==='touch')return;mx=my=-9999;lock=false;if(state!=='words')go('words',-1,false);lastUser=performance.now();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&state!=='words'){lock=false;go(state==='focus'?'world':'words',-1,true);}});
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){sample();cam.ox=V.w*0.5;cam.oy=V.h*0.70;cam.sc=Math.min(V.w/1640,V.h/1125);ui();
  window.addEventListener('resize',function(){sample();});
  if('IntersectionObserver' in window){new IntersectionObserver(function(en){var on=en[0].isIntersecting;if(on&&!run){run=true;last=performance.now();lastUser=performance.now();requestAnimationFrame(frame);}else if(!on){run=false;}},{threshold:0.05}).observe(el);}else{run=true;requestAnimationFrame(frame);}});
window.__hero={get:function(){return {state:state,focus:focus,hot:hot,lock:lock,yaw:yaw,pitch:pitch,nt:nt,n:N,np:NP,cen:cen,mix:mixv,sc:cam.sc};},go:go};
})();

