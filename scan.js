'use strict';
/* Face scan: 100% on-device with MediaPipe Face Landmarker (files bundled in ./mp/). The photo is never uploaded or stored. */
const SHAPE={oval:'Oval',round:'Round',square:'Square',oblong:'Long / Oblong',heart:'Heart',diamond:'Diamond'};
const UNDER={warm:'Warm',neutral:'Neutral',cool:'Cool'};
const TONE_L={fair:'Fair',wheatish:'Light (wheatish)',medium:'Medium',dusky:'Tan (dusky)',deep:'Deep'};
let FL=null,camStream=null;
async function getLandmarker(){
  if(FL) return FL;
  const mp=await import('./mp/vision_bundle.mjs');
  const base=new URL('mp/',location.href).href;
  FL=await mp.FaceLandmarker.createFromOptions({wasmLoaderPath:base+'vision_wasm_internal.js',wasmBinaryPath:base+'vision_wasm_internal.wasm'},
    {baseOptions:{modelAssetPath:base+'face_landmarker.task',delegate:'CPU'},runningMode:'IMAGE',numFaces:1});
  return FL;
}
function stopCam(){if(camStream){camStream.getTracks().forEach(t=>t.stop());camStream=null}}
window.addEventListener('hashchange',()=>{if(!location.hash.startsWith('#scan'))stopCam()});

function viewScan(v,who){
  const other=who==='other';
  v.innerHTML=`<h2>📷 ${other?'Scan someone else':'Scan my face'}</h2>
  <p class="sub">Get your face shape, skin tone and grooming suggestions in a few seconds.</p>
  ${other?'<div class="note">Only scan someone who has said yes. Their result is not added to your own profile.</div>':''}
  <div class="cam"><video id="vid" playsinline muted autoplay></video><div class="oval"></div><p id="camMsg">Camera is off</p></div>
  <div class="row"><button class="btn" id="startCam">Start camera</button><button class="btn" id="snap" hidden>Capture</button></div>
  <label class="btn sec up">Upload a photo instead<input type="file" id="file" accept="image/*" hidden></label>
  <div class="tip">💡 Face a window, no filters, no cap or glasses. Keep your whole face inside the oval, looking straight ahead.</div>
  <div id="scanErr"></div>
  <p class="priv">🔒 Private: the photo is checked only on this phone and never uploaded or saved. Only the result is kept, and only if you tap Save.</p>`;
  const err=m=>{$('#scanErr').innerHTML=`<div class="note err">${m}</div>`};
  $('#startCam').onclick=async()=>{
    $('#scanErr').innerHTML='';
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia) return err('This browser can\'t use the camera. Use "Upload a photo instead".');
    try{
      camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1280},height:{ideal:960}},audio:false});
      const vd=$('#vid');vd.srcObject=camStream;await vd.play().catch(()=>{});
      $('#camMsg').textContent='';$('#startCam').hidden=true;$('#snap').hidden=false;
      getLandmarker().catch(()=>{});
    }catch(e){err(e&&e.name==='NotAllowedError'?'Camera permission was denied. Allow camera access for this site in your browser settings, or use "Upload a photo instead".':'Couldn\'t start the camera ('+esc(e&&e.name||'error')+'). Use "Upload a photo instead".')}
  };
  $('#snap').onclick=()=>{const vd=$('#vid');if(!vd.videoWidth)return err('Camera not ready yet – try again in a second.');
    const c=document.createElement('canvas');c.width=vd.videoWidth;c.height=vd.videoHeight;c.getContext('2d').drawImage(vd,0,0);stopCam();analyse(c,who,err)};
  $('#file').onchange=e=>{const f=e.target.files[0];if(!f)return;const u=URL.createObjectURL(f),im=new Image();
    im.onload=()=>{const k=Math.min(1,1280/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
      c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);e.target.value='';analyse(c,who,err)};
    im.onerror=()=>{URL.revokeObjectURL(u);err('Couldn\'t open that image. Try a JPG or PNG photo.')};im.src=u};
}

async function analyse(c,who,err){
  $('#scanErr').innerHTML='<div class="note busy">Checking your face… (the first scan loads the face model once, about 17 MB)</div>';
  let r;
  try{r=(await getLandmarker()).detect(c)}catch(e){console.warn(e);return err('The face model couldn\'t load. Check your connection for the first scan, then it works offline.')}
  const lm=r&&r.faceLandmarks&&r.faceLandmarks[0];
  if(!lm) return err('No face found. Face the camera straight on in good light, with your whole face visible, and try again.');
  const res=measure(lm,c);
  if(res.small) return err('Your face is too small in the photo. Move closer so your face fills the oval.');
  state.res=Object.assign(res,{who});go('result');
}

/* ---- measurements ---- */
function measure(lm,c){
  const W=c.width,H=c.height,P=i=>[lm[i].x*W,lm[i].y*H],d=(a,b)=>{const p=P(a),q=P(b);return Math.hypot(p[0]-q[0],p[1]-q[1])};
  const cheek=d(234,454),fore=d(54,284),jaw=d(172,397),chin=d(149,378),len=d(10,152)*1.12; // 10 is mid-forehead, not hairline
  const L=len/cheek,fw=fore/cheek,jw=jaw/cheek,cw=chin/cheek;
  let shape;
  if(L>=1.5) shape='oblong';
  else if(fw<0.76&&jw<0.82) shape='diamond';
  else if(fw-jw>0.06&&cw<0.5) shape='heart';
  else if(L<1.25) shape=jw>=0.86?'square':'round';
  else shape=jw>=0.9?'square':'oval';
  const ctx=c.getContext('2d',{willReadFrequently:true}),r=Math.max(3,cheek*0.035);
  const patch=i=>{const [x,y]=P(i),s=Math.round(r),D=ctx.getImageData(Math.round(x-s),Math.round(y-s),2*s,2*s).data,px=[];
    for(let k=0;k<D.length;k+=4)px.push([D[k],D[k+1],D[k+2]]);return px};
  const lab=([R,G,B])=>{const f=v=>{v/=255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4)},r1=f(R),g1=f(G),b1=f(B);
    const X=(r1*0.4124+g1*0.3576+b1*0.1805)/0.95047,Y=r1*0.2126+g1*0.7152+b1*0.0722,Z=(r1*0.0193+g1*0.1192+b1*0.9505)/1.08883;
    const g=t=>t>0.008856?Math.cbrt(t):7.787*t+16/116;return[116*g(Y)-16,500*(g(X)-g(Y)),200*(g(Y)-g(Z))]};
  const skinPts=[50,280,101,330,151,9,108,337];
  let all=[];skinPts.forEach(i=>all=all.concat(patch(i)));
  const labs=all.map(lab).sort((a,b)=>a[0]-b[0]),mid=labs.slice(Math.floor(labs.length*.2),Math.floor(labs.length*.8)); // trim shadows & highlights
  const avg=k=>mid.reduce((s,x)=>s+x[k],0)/mid.length,Lm=avg(0),Am=avg(1),Bm=avg(2);
  const ita=Math.atan2(Lm-50,Bm)*180/Math.PI,hue=Math.atan2(Bm,Am)*180/Math.PI;
  const tone=ita>48?'fair':ita>32?'wheatish':ita>14?'medium':ita>-20?'dusky':'deep';
  const under=hue>58?'warm':hue<45?'cool':'neutral';
  // shine: share of bright, low-chroma pixels in T-zone vs cheeks
  const shineFrac=ids=>{let n=0,t=0;ids.forEach(i=>patch(i).forEach(p=>{const q=lab(p);t++;if(q[0]>Lm+14&&Math.hypot(q[1],q[2])<22)n++}));return n/Math.max(1,t)};
  const tz=shineFrac([151,9,6,4,195]),ck=shineFrac([50,280,101,330]);
  const shine=tz>0.18&&ck>0.12?'oily':tz>0.12?'combination':'normal';
  // beard: darkness of jaw/chin/upper-lip skin compared to cheeks
  const lum=ids=>{let s=0,n=0;ids.forEach(i=>patch(i).forEach(p=>{s+=lab(p)[0];n++}));return s/n};
  const ckL=lum([50,280,101,330]),bL=lum([152,175,199,136,365,164,0,32,262]);
  const ratio=bL/ckL,beard=ratio<0.45?'full':ratio<0.8?'stubble':'clean';
  const lightOk=Lm>25&&Lm<85&&Math.abs(Am)<35;
  return{shape,tone,under,skin:shine,beard,small:cheek<W*0.12&&cheek<H*0.12,
    m:{L:+L.toFixed(2),fw:+fw.toFixed(2),jw:+jw.toFixed(2),cw:+cw.toFixed(2),ita:Math.round(ita),hue:Math.round(hue),tz:+tz.toFixed(2),ck:+ck.toFixed(2),beardRatio:+ratio.toFixed(2)},
    conf:lightOk?'medium':'low'};
}

/* ---- suggestions ---- */
const BEARD_BY_SHAPE={
 oval:'Lucky: most styles suit you. Short boxed beard or even stubble (3–5 mm) both work. Keep the cheek line natural.',
 round:'Add length at the chin and keep the sides shorter (e.g. a short goatee or a beard that\'s fuller at the chin) to make your face look longer.',
 square:'Your strong jaw is a feature. Keep sides short and round the chin slightly; heavy stubble or a short, neat beard looks great.',
 oblong:'Keep the chin short and let the sides be a bit fuller to add width. Avoid long pointed beards; even stubble works well.',
 heart:'A fuller beard at the chin and jaw balances a wider forehead. Medium stubble or a short full beard is ideal.',
 diamond:'Keep some fullness at the chin and jaw to balance wide cheekbones; avoid very bulky sides.'};
const HAIR_BY_SHAPE={
 oval:'Almost anything works; a textured quiff or side part is an easy win.',
 round:'Add height on top and keep the sides short (fade or undercut). Avoid round, bowl-like cuts.',
 square:'Short, textured top with tapered sides; a side part or crew cut suits a strong jaw.',
 oblong:'Avoid tall height on top. Some fringe or a side-swept style with a bit more volume at the sides.',
 heart:'Medium length on top with a soft fringe or side sweep; avoid very short sides that widen the forehead look.',
 diamond:'Fringe or textured top to widen the forehead; keep some length at the sides.'};
const BROW_BY_SHAPE={
 oval:'Keep your natural arch; only remove strays below the brow.',
 round:'A slightly angled brow adds structure; brush hairs up at the arch.',
 square:'Keep brows full and straight-ish; just tidy strays.',
 oblong:'Flatter, straighter brows make the face look shorter.',
 heart:'Soft, natural curve; don\'t over-thin.',
 diamond:'Soft rounded brows soften strong cheekbones.'};
function suggest(x){
  const shade={fair:'light',wheatish:'light-medium',medium:'medium',dusky:'medium-deep',deep:'deep'}[x.tone];
  const ut={warm:'golden / yellow-based',cool:'pink / rosy-based',neutral:'neutral (neither pink nor yellow)'}[x.under];
  const focus=['eyes','brows','check'];if(x.skin!=='normal')focus.push('primer','set');if(x.beard!=='clean')focus.push('beard');
  return{
   beard:x.beard==='clean'?'You look clean-shaven. '+(BEARD_BY_SHAPE[x.shape].split('.')[0])+' if you decide to grow one. For now: shave with the grain and use an aftershave balm.':BEARD_BY_SHAPE[x.shape]+' Clean the neckline about two fingers above the Adam\'s apple.',
   hair:HAIR_BY_SHAPE[x.shape],brow:BROW_BY_SHAPE[x.shape],
   shade:`Look for concealer and BB cream / foundation in a ${shade} shade with a ${ut} undertone. Concealer: same shade or at most one shade lighter. Test on the jawline in daylight – the right one disappears.`+(x.under==='cool'?'':' Indian skin often looks best with warm/golden or olive shades; avoid grey or pink-looking ones.'),
   skin:x.skin==='oily'?'T-zone looked shiny (rough estimate): use oil-free moisturiser, a mattifying primer and blot during the day.':x.skin==='combination'?'Some shine on forehead/nose (rough estimate): mattify just the T-zone.':'Shine looked low (rough estimate): a light moisturiser is enough.',
   focus:[...new Set(focus)]};
}
const STEP_N={eyes:'Hide dark circles',brows:'Tidy brows',check:'Daylight check',primer:'Primer (T-zone)',set:'Set & control shine',beard:'Beard / shave'};
function viewResult(v){
  const x=state.res;if(!x) return go('scan/self');
  const other=x.who==='other';
  const chipRow=(k,obj)=>`<div class="chips sm" data-k="${k}">${Object.entries(obj).map(([a,l])=>`<button class="chip" data-v="${a}" aria-pressed="${x[k]===a}">${l}</button>`).join('')}</div>`;
  const draw=()=>{const s=suggest(x);
   v.innerHTML=`<h2>✨ ${other?'Their':'Your'} scan result</h2>
   <p class="sub">Tap a chip to correct anything that looks wrong – suggestions update instantly.</p>
   <div class="res"><h3>Face shape</h3>${chipRow('shape',SHAPE)}
   <h3>Skin tone</h3>${chipRow('tone',TONE_L)}
   <h3>Undertone</h3>${chipRow('under',UNDER)}
   <h3>Shine (rough estimate)</h3>${chipRow('skin',{oily:'Oily',combination:'Combination',normal:'Normal',dry:'Dry',sensitive:'Sensitive'})}
   <h3>Beard</h3>${chipRow('beard',BEARD)}</div>
   <div class="note">Confidence: <b>${x.conf}</b>. Phone cameras and room lighting change colours; skin tone and shine are estimates. ${x.conf==='low'?'The lighting looked unusual – face a window and scan again for a better read.':'For best results face a window, no filters.'}</div>
   <h3>Suggestions for ${other?'them':'you'}</h3>
   <div class="sug"><b>🧔 Beard</b><p>${esc(s.beard)}</p></div>
   <div class="sug"><b>💇 Hairstyle</b><p>${esc(s.hair)}</p></div>
   <div class="sug"><b>〰️ Brows</b><p>${esc(s.brow)}</p></div>
   <div class="sug"><b>🎨 Shade guide</b><p>${esc(s.shade)}</p></div>
   <div class="sug"><b>💧 Skin</b><p>${esc(s.skin)}</p></div>
   <div class="sug"><b>⭐ Steps to focus on</b><p>${s.focus.map(f=>STEP_N[f]).join(' · ')}</p></div>
   <div class="note">These are grooming suggestions, not medical advice. The scan can't diagnose skin conditions – see a dermatologist for rashes, acne that won't settle or anything that worries you. Patch-test new products 24–48 h first.</div>
   ${other?`<button class="btn" id="useOther">Make looks for them</button>`:`<button class="btn" id="apply">Save & apply to my profile</button>`}
   <button class="btn sec" id="again">Scan again</button>`;
   v.querySelectorAll('.chips').forEach(cg=>cg.onclick=e=>{const b=e.target.closest('.chip');if(!b)return;x[cg.dataset.k]=b.dataset.v;const y=scrollY;draw();scrollTo(0,y)});
   const summary=()=>({shape:x.shape,tone:x.tone,under:x.under,skin:x.skin,beard:x.beard,focus:s.focus,t:Date.now()});
   if(other) $('#useOther').onclick=()=>{state.guest={profile:{skin:x.skin,tone:x.tone,beard:x.beard},scan:summary()};toast('Making looks for your friend');go('home')};
   else $('#apply').onclick=()=>{S.scan=summary();S.profile=Object.assign({},S.profile,{skin:x.skin,tone:x.tone,beard:x.beard});save();toast('Saved to your profile');go('home')};
   $('#again').onclick=()=>go('scan/'+(other?'other':'self'));
  };
  draw();
}
