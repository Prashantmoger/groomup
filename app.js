'use strict';
/* GroomUp (temporary name) – occasion-based grooming & light makeup guide for men. Offline PWA. */
const OCC = {
  office:  {n:'Office / Interview', e:'💼', d:'Fresh, polished, invisible', lvl:1, day:true,
    tips:['Less is more: nobody should be able to tell you are wearing anything.','Check yourself near a window in daylight before leaving.','Carry blotting papers for the afternoon shine.']},
  wedding: {n:'Wedding / Festive', e:'🎉', d:'Long-lasting, glowing, photo-ready', lvl:2, day:true,
    tips:['Long hours + heat: set everything and carry blotting papers.','Coloured kurtas reflect onto your face; check your base under warm indoor light too.','Keep a small kit in your pocket: balm, blotting papers, comb.']},
  date:    {n:'Date night', e:'🌙', d:'Natural, warm, well-rested', lvl:1, day:false,
    tips:['Aim for "well-slept you", not "made-up you".','Soft lips and neat brows matter more up close than foundation.','Go easy on fragrance: 2 sprays is enough.']},
  party:   {n:'Party / Night out', e:'🥂', d:'Shine control, lasts all night', lvl:2, day:false,
    tips:['Dance floors get hot: oil control and setting are your friends.','Flash photos show shine most; blot before group photos.','Drink water through the night; it shows on skin.']},
  photo:   {n:'Photo / Video shoot', e:'📸', d:'Even skin, zero shine on camera', lvl:3, day:true,
    tips:['Cameras flatten your face and exaggerate shine; matte is safer.','Avoid base products with high SPF for flash photos – they can cause a white cast. Use your SPF earlier and let it settle, or choose a "no white cast" label.','Do a quick test photo on your phone with flash before the shoot.']},
  everyday:{n:'Everyday natural', e:'☀️', d:'2-minute fresh look', lvl:0, day:true,
    tips:['Consistency beats products: cleanse, moisturise, sunscreen every day.','Only conceal what bothers you; skip the rest.','Sleep and water show on your face more than any product.']}
};
const SKIN={oily:'Oily',dry:'Dry',combination:'Combination',normal:'Normal',sensitive:'Sensitive'};
const TONE={fair:'Fair',wheatish:'Wheatish',medium:'Medium',dusky:'Dusky',deep:'Deep'};
const BEARD={clean:'Clean-shaven',stubble:'Stubble',full:'Full beard'};

const $=s=>document.querySelector(s);
const LS='groomup-v1';
let S=load();
function load(){try{return Object.assign({profile:{},saved:[],checks:{}},JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){return{profile:{},saved:[],checks:{}}}}
function save(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),1600)}

/* ---------- look builder ---------- */
function buildLook(o,p){
  const O=OCC[o],L=O.lvl,sk=p.skin,tn=p.tone,bd=p.beard,deepish=(tn==='dusky'||tn==='deep'),st=[];
  const add=(id,title,min,product,what,why,how)=>st.push({id,title,min,product,what,why,how});
  // 1 cleanse
  add('cleanse','Cleanse',2,
    sk==='oily'?'Gel or foaming face wash (oil-control, non-comedogenic)':sk==='dry'?'Cream or hydrating, non-foaming cleanser':sk==='sensitive'?'Gentle, fragrance-free cleanser':'Mild gel face wash',
    'Wash your face to remove oil, sweat and dirt.','A clean face lets products sit evenly and last longer.',
    'Wet face with lukewarm (not hot) water, massage a coin-sized amount for 30–60 seconds, rinse, pat dry with a clean towel. Don\'t scrub hard.');
  // 2 moisturise + SPF
  add('moist',O.day?'Moisturise + sunscreen':'Moisturise',O.day?3:2,
    (sk==='oily'?'Lightweight oil-free gel moisturiser':sk==='dry'?'Richer cream moisturiser':sk==='sensitive'?'Fragrance-free moisturiser for sensitive skin':'Light lotion moisturiser')+(O.day?' + broad-spectrum sunscreen SPF 30 or higher':''),
    'Hydrate the skin'+(O.day?' and protect it from the sun.':'.'),
    'Hydrated skin looks healthy and stops makeup from looking patchy or flaky.'+(O.day?' Indian sun causes tanning and dark spots; sunscreen is the single best anti-ageing step.':''),
    'Dot a pea-sized amount on forehead, cheeks, chin; spread evenly. '+(O.day?'Then apply sunscreen generously (about two finger-lengths for face and neck). ':'')+'Wait 2–3 minutes to let it absorb before the next step.');
  // 3 primer
  if(L>=2&&sk!=='dry') add('primer','Primer (T-zone)',1,sk==='oily'||sk==='combination'?'Mattifying / pore-blurring primer':'Lightweight smoothing primer',
    'A thin layer that grips makeup and controls shine.','Helps your look survive long hours, heat and lights.',
    'Use a pea-sized amount only on forehead, nose and chin. Press in with fingertips; don\'t rub.');
  // 4 under-eye
  if(L>=1||true){
    const cc=deepish?'peach or orange colour corrector':(tn==='fair'?'light peach colour corrector':'peach colour corrector');
    add('eyes','Hide dark circles',L===0?1:2,
      (L>=2?'A tiny amount of '+cc+', then ':'')+'liquid concealer one shade lighter than or same as your skin (never much lighter)',
      L===0?'Optional: only if you have dark circles today.':'Even out the darker area under your eyes.',
      'Dark circles make you look tired; covering them is the biggest "fresh" upgrade for most men.',
      (L>=2?'If circles are dark/bluish, first dab a little corrector only on the darkest part. ':'')+'Dot 2–3 tiny dots of concealer at the inner corner and darkest spot, then tap gently with your ring finger until edges disappear. Tap, don\'t swipe. Too much will crease – use less than you think.');
  }
  // 5 base
  if(L>=1){
    const shade={fair:'light, neutral-to-pink undertone',wheatish:'light-medium, warm/golden undertone',medium:'medium, warm/olive undertone',dusky:'medium-deep, warm undertone',deep:'deep, warm/red undertone'}[tn];
    add('base',L>=2?'Light foundation':'Even skin tone',L>=2?4:3,
      (L>=2?'Lightweight liquid foundation':'BB cream or tinted moisturiser')+(sk==='oily'?' (matte / oil-free)':sk==='dry'?' (dewy / hydrating)':'')+' – shade: '+shade,
      'A sheer layer that evens out redness, tan lines and uneven patches.',
      'Gives an even, healthy look without hiding your real skin.',
      'Test shade on your jawline in daylight – it should disappear. Use a small amount (1–2 pumps max), dot on the centre of your face and blend outwards with fingers or a damp sponge. Blend into the jaw and down the neck so there\'s no line'+(bd!=='clean'?'; keep it out of your beard':'')+'.');
  }
  // 6 spots
  if(L>=1) add('spots','Cover spots & marks',2,'Same concealer (your exact shade) + small brush or fingertip',
    'Hide pimples, acne marks or pigmentation spots.','Spots draw the eye; covering just them keeps the rest natural.',
    'Dab a tiny amount right on the spot, tap the edges only so the centre stays covered. Don\'t cover active pimples with heavy layers. Clean your fingertip/brush after.');
  // 7 brows
  add('brows','Tidy brows',1,L>=2?'Clear or tinted brow gel (tint close to your hair colour)':'Clear brow gel or a clean spoolie brush',
    'Brush brows into shape.','Neat brows frame the face and make you look groomed instantly.',
    'Brush hairs upward, then slightly outward along the natural shape. Don\'t draw or reshape. Trim only very long strays with small scissors.');
  // 8 lips
  add('lips','Lip balm',1,'Plain or untinted lip balm'+(O.day?' (with SPF if outdoors)':''),
    'Soften dry or chapped lips.','Dry, cracked lips look tired up close and in photos.',
    'Apply a thin layer, press lips together, blot extra with a tissue so they don\'t look shiny.');
  // 9 beard
  if(bd==='clean') add('beard','Clean shave care',L>=2?5:3,'Shaving gel/cream, sharp razor, alcohol-free aftershave balm',
    'Get a smooth shave and calm the skin.','Razor bumps and redness show through makeup.',
    'Shave after washing (warm, soft hair), go with the grain, rinse with cool water, apply aftershave balm. Shave a few hours before'+(L>=2?' – or the night before if you get razor bumps':'')+'.');
  else if(bd==='stubble') add('beard','Shape stubble',4,'Beard trimmer with guard + a few drops of beard oil',
    'Even out stubble length and clean the edges.','Neat edges make stubble look intentional, not lazy.',
    'Trim to one even length, clean up the neckline (about two fingers above the Adam\'s apple) and cheek line. Rub 1–2 drops of beard oil on stubble for softness and to stop itch.');
  else add('beard','Groom the beard',6,'Beard wash, beard oil or balm, wide-tooth comb/brush, trimmer',
    'Clean, soften and shape your beard.','A well-shaped beard is the frame of your face.',
    'Apply 3–5 drops of beard oil (more for longer beards), massage into the skin underneath, comb downward. Trim stray hairs and keep the neckline and cheek line clean. '+(L>=2?'Use a little balm to hold shape for long events.':''));
  // 10 hair
  add('hair','Style hair',L>=2?5:3,L>=2?'Medium-hold paste, clay or wax (matte for photos)':'Light cream or matte paste',
    'Set your hair in place.','Hair is the first thing people notice after your face.',
    'Towel-dry, warm a fingertip-sized amount between palms, work in from back to front, then shape the front. Start small – add more if needed.');
  // 11 set
  if(L>=1){
    let prod,how,min=1;
    if(L>=3){prod='Translucent setting powder + setting spray';how='Lightly press powder on T-zone and under eyes with a puff, dust off extra. Hold spray 20–30 cm away, mist 2–3 times in an "X" and "T". Let it dry.';min=2}
    else if(sk==='dry'){prod='Setting spray only (skip powder)';how='Hold 20–30 cm away and mist 2–3 times. Let it dry naturally.'}
    else if(L>=2){prod='Translucent powder + setting spray';how='Press a tiny bit of powder on forehead, nose and chin only. Then 2–3 mists of setting spray from arm\'s length.';min=2}
    else {prod='Translucent powder or blotting papers';how='Press a very small amount of powder only on the shiny T-zone. No powder on dry areas.'}
    add('set','Set & control shine',min,prod,'Lock everything in place and reduce shine.','Stops makeup moving and keeps you matte for hours.',how);
  }
  // final check
  add('check','Daylight check',1,'A mirror near a window, phone camera',
    'Check your face in natural light.','Bathroom light hides harsh edges and wrong shades.',
    'Look at your jawline, hairline and under the eyes. Blend any visible lines. If someone could tell you\'re wearing makeup, blend more or remove some.');
  return st;
}
const lookId=(o,p)=>[o,p.skin,p.tone,p.beard].join('|');

/* ---------- routing ---------- */
let state={};
function go(h){location.hash=h}
window.addEventListener('hashchange',render);
function render(){
  const h=(location.hash||'#home').slice(1).split('/'),v=$('#view');
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.go===h[0]));
  $('#back').hidden=h[0]==='home';
  $('#title').innerHTML='Groom<b>Up</b>';
  window.scrollTo(0,0);
  if(h[0]==='profile'&&OCC[h[1]]) return viewProfile(v,h[1]);
  if(h[0]==='look'&&OCC[h[1]]) return viewLook(v,h[1]);
  if(h[0]==='scan') return viewScan(v,h[1]==='other'?'other':'self');
  if(h[0]==='result') return viewResult(v);
  if(h[0]==='tutorials') return viewTutorials(v);
  if(h[0]==='saved') return viewSaved(v);
  if(h[0]==='basics') return viewBasics(v);
  viewHome(v);
}
function viewHome(v){
  v.innerHTML=`<h2>What's the occasion?</h2><p class="sub">Pick one and get a simple step-by-step look made for you.</p>
  ${state.guest?`<div class="guest">👥 Making looks for <b>a friend</b> (from their scan) <button class="chip" id="endGuest">Back to me</button></div>`:''}
  <div class="scanrow"><button class="btn scanbtn" data-go="scan/self">📷 Scan my face</button><button class="btn sec scanbtn" data-go="scan/other">👥 Scan someone else</button></div>
  ${S.scan&&!state.guest?`<p class="sub small">Last scan: ${SHAPE[S.scan.shape]} face · ${TONE_L[S.scan.tone]} · ${UNDER[S.scan.under]} undertone</p>`:''}
  <div class="grid">${Object.entries(OCC).map(([k,o])=>`<button class="occ" data-o="${k}"><span class="e">${o.e}</span>${o.n}<small>${o.d}</small></button>`).join('')}</div>
  <button class="btn sec" data-go="basics">New to this? Read Beginner basics</button>
  <button class="btn sec" data-go="tutorials">▶ Watch video tutorials</button>
  <p class="foot">GroomUp is a temporary name · Works offline</p>`;
  v.querySelectorAll('.occ').forEach(b=>b.onclick=()=>go('profile/'+b.dataset.o));
  if($('#endGuest'))$('#endGuest').onclick=()=>{state.guest=null;viewHome(v)};
}
function chips(name,obj,cur){return `<div class="chips" data-n="${name}">${Object.entries(obj).map(([k,l])=>`<button class="chip" data-v="${k}" aria-pressed="${cur===k}">${l}</button>`).join('')}</div>`}
function viewProfile(v,o){
  const p=Object.assign({},state.guest?state.guest.profile:S.profile);
  v.innerHTML=`<h2>${OCC[o].e} ${OCC[o].n}</h2><p class="sub">${state.guest?'Your friend\'s profile (from their scan).':'Quick profile – we\'ll remember it for next time.'}</p>
  <button class="btn sec slim" data-go="scan/${state.guest?'other':'self'}">📷 Fill this in with a face scan</button>
  <h3>Skin type</h3>${chips('skin',SKIN,p.skin)}
  <h3>Skin tone</h3>${chips('tone',TONE,p.tone)}
  <h3>Beard</h3>${chips('beard',BEARD,p.beard)}
  <div class="note" id="sensnote" ${p.skin==='sensitive'?'':'hidden'}>Sensitive skin: patch test every new product first – a small amount behind the ear or on the inner arm, wait 24–48 hours. Choose fragrance-free products.</div>
  <button class="btn" id="mk" disabled>Show my look</button>`;
  const upd=()=>{$('#mk').disabled=!(p.skin&&p.tone&&p.beard);$('#sensnote').hidden=p.skin!=='sensitive'};
  v.querySelectorAll('.chips').forEach(c=>c.onclick=e=>{const b=e.target.closest('.chip');if(!b)return;p[c.dataset.n]=b.dataset.v;c.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));upd()});
  upd();
  $('#mk').onclick=()=>{if(state.guest)state.guest.profile=p;else{S.profile=p;save()}go('look/'+o)};
}
function viewLook(v,o){
  const p=state.guest?state.guest.profile:S.profile,scan=state.guest?state.guest.scan:S.scan,focus=(scan&&scan.focus)||[];if(!(p.skin&&p.tone&&p.beard))return go('profile/'+o);
  const steps=buildLook(o,p),id=lookId(o,p),ch=S.checks[id]||(S.checks[id]={}),O=OCC[o];
  const total=steps.reduce((a,s)=>a+s.min,0),isSaved=S.saved.some(x=>x.id===id);
  v.innerHTML=`<h2>${O.e} ${O.n} look</h2>${state.guest?'<p class="sub">👥 For your friend</p>':''}
  <div class="sum"><span class="pill"><b>${SKIN[p.skin]}</b> skin</span><span class="pill"><b>${TONE[p.tone]}</b></span><span class="pill"><b>${BEARD[p.beard]}</b></span><span class="pill">⏱ <b>~${total} min</b></span></div>
  <div id="prog"></div><div class="bar"><i id="pbar"></i></div>
  ${p.skin==='sensitive'?'<div class="note">Sensitive skin: patch test each new product 24–48 h before the day. Stop if you get itching, burning or redness.</div>':''}
  ${steps.map((s,i)=>`<div class="step ${ch[s.id]?'done':''}" data-id="${s.id}">
    <div class="sh"><button class="tick" aria-label="Mark step done">${ch[s.id]?'✓':''}</button><div class="t"><b>${i+1}. ${esc(s.title)}</b><span>${s.min} min · ${esc(s.product)}</span></div></div>
    <div class="sb">${stepPic(s.id,p.beard)}${focus.includes(s.id)?'<span class="focus">⭐ Focus for '+(state.guest?'them':'you')+' (from scan)</span>':''}<p><span class="k">What:</span> ${esc(s.what)}</p><p><span class="k">Why:</span> ${esc(s.why)}</p><p><span class="k">How:</span> ${esc(s.how)}</p>${vidButtons(STEP_VIDS[s.id==='beard'&&p.beard==='clean'?'shave':s.id],true)}</div></div>`).join('')}
  <h3>▶ Video guides for this look</h3>${vidButtons(OCC_VIDS[o],false)}<p class="vnote">${VNOTE}</p>
  <h3>Tips to look natural</h3><ul class="tips">${O.tips.concat(['Blend edges until you can\'t see where product starts or stops.','Remove everything at night with a cleanser (oil-based cleanser first if you wore foundation), then moisturise.']).map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
  <div class="row"><button class="btn sec" id="reset">Reset ticks</button><button class="btn" id="fav">${isSaved?'★ Saved':'☆ Save look'}</button></div>
  <button class="btn sec" id="edit">Change profile</button>`;
  const prog=()=>{const d=steps.filter(s=>ch[s.id]).length,m=steps.filter(s=>ch[s.id]).reduce((a,s)=>a+s.min,0);
    $('#prog').innerHTML=`<b>${d}/${steps.length}</b> steps done · ${total-m} min left`;$('#pbar').style.width=(100*d/steps.length)+'%';if(d===steps.length&&d)toast('All done – looking sharp!')};
  v.querySelectorAll('.step').forEach(el=>el.querySelector('.tick').onclick=()=>{const k=el.dataset.id;ch[k]=!ch[k];el.classList.toggle('done',ch[k]);el.querySelector('.tick').textContent=ch[k]?'✓':'';save();prog()});
  $('#reset').onclick=()=>{S.checks[id]={};save();viewLook(v,o)};
  $('#edit').onclick=()=>go('profile/'+o);
  $('#fav').onclick=()=>{const i=S.saved.findIndex(x=>x.id===id);
    if(i>=0){S.saved.splice(i,1);toast('Removed from saved')}else{S.saved.unshift({id,o,p:Object.assign({},p),t:Date.now()});toast('Look saved')}
    save();$('#fav').textContent=S.saved.some(x=>x.id===id)?'★ Saved':'☆ Save look'};
  prog();
}
function viewSaved(v){
  v.innerHTML=`<h2>★ Saved looks</h2><p class="sub">Your favourite looks, stored on this phone.</p>`+
  (S.saved.length?S.saved.map((x,i)=>`<div class="saved"><button class="t" data-i="${i}">${OCC[x.o].e} ${OCC[x.o].n}<small>${SKIN[x.p.skin]} · ${TONE[x.p.tone]} · ${BEARD[x.p.beard]}</small></button><button class="iconbtn" data-del="${i}" aria-label="Delete">🗑</button></div>`).join('')
   :'<p class="sub">No saved looks yet. Open a look and tap "Save look".</p><button class="btn" data-go="home">Pick an occasion</button>');
  v.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const x=S.saved[b.dataset.i];S.profile=Object.assign({},x.p);save();go('look/'+x.o)});
  v.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{S.saved.splice(+b.dataset.del,1);save();viewSaved(v)});
}
const BASICS=[
 ['The golden rule','If people can tell you\'re wearing makeup, it\'s too much. Use tiny amounts and blend well.'],
 ['Daily must-haves','Cleanser, moisturiser and sunscreen (SPF 30+). These do more for your skin than any makeup.'],
 ['Finding your shade','Test base products on your jawline in daylight. The right shade disappears. Indian skin usually has warm/golden or olive undertones – avoid shades that look grey or pink on you.'],
 ['Concealer vs foundation','Concealer = small areas (dark circles, spots). Foundation/BB cream = a thin even layer for the whole face. Most days you only need concealer.'],
 ['Fingers are fine','Warm fingertips blend cream and liquid products well. Tap, don\'t rub. Wash hands before and after.'],
 ['Patch test','New product? Apply a little behind your ear or inner arm and wait 24–48 hours. Essential for sensitive or acne-prone skin. Stop using anything that burns, itches or causes redness, and see a dermatologist for ongoing problems.'],
 ['Hygiene','Don\'t share makeup, wash sponges/brushes weekly, and throw out products that smell or look different or are past their expiry date.'],
 ['Take it off','Always remove makeup before bed: cleanse (twice if you wore foundation), then moisturise. Sleeping in makeup can cause breakouts.'],
 ['Starter kit','Gentle cleanser · moisturiser · sunscreen · concealer · lip balm · clear brow gel · blotting papers · beard oil or aftershave balm.']
];
function viewBasics(v){
  v.innerHTML=`<h2>? Beginner basics</h2><p class="sub">Everything you need to know in 2 minutes.</p>`+BASICS.map(([t,d])=>`<div class="basic"><h3>${t}</h3>${esc(d)}</div>`).join('')+
  `<h3>▶ Start with these videos</h3>${vidList(BASICS_VIDS)}<button class="btn sec" data-go="tutorials">See all tutorials</button><p class="vnote">${VNOTE}</p><p class="foot">General grooming guidance, not medical advice.</p>`;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(b.dataset.go)});
$('#back').onclick=()=>history.length>1?history.back():go('home');
render();
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(()=>{});
