'use strict';
/* Third-party YouTube tutorials. Every video below was checked via YouTube oEmbed on 27 Oct 2026 (title + channel). */
const V={
 sanNight:{t:'NIGHT Skincare Routine To Get Clear Skin For Men',c:'BeYourBest Skincare by San Kalra',id:'ZYl60cjSacM',l:'Hindi',m:10},
 ankush:{t:'Easy Men\'s Makeup Tutorial for Beginners',c:'Ankush Bahuguna',id:'gt13tUJ8SwU',l:'English',m:8},
 pbfConceal:{t:'How to Apply Concealer For Men | Hide Blemishes and Hide Dark Circles',c:'PrettyBoyFloyd',id:'N8M-Hxee2TA',l:'English',m:5},
 sumansi:{t:'How to Apply Concealer on dark circles with fingers | कंसीलर कैसे लगाए',c:'Sumansi Sahgal',id:'USvEwiSkE60',l:'Hindi',m:10},
 gqBeard:{t:'How to Trim Your Beard at Home (4 Step Tutorial)',c:'GQ',id:'nVY_hvAkmSY',l:'English',m:10},
 neckline:{t:'The ULTIMATE Beard Neckline Tutorial | How To Shape Up Your Neckline',c:'Balance Male Grooming',id:'oHgHz1ZeVr0',l:'English',m:5},
 groom:{t:'Basic & Natural Makeup for Men | Men\'s Daily Makeup Tutorial | Groom Makeup Step By Step',c:'DSBOSSKO',id:'CW9ZaCyR1Ic',l:'Hindi',m:7},
 brows:{t:'Men\'s Eyebrow Grooming | How to Thin, Tweeze, and Shape Eyebrows',c:'alpha m.',id:'k2WhluJKICA',l:'English',m:6},
 paste:{t:'How to Use Matte Styling Paste for Men | Natural Hair Look',c:'Rolda Cosmetics – Men\'s Grooming & Care',id:'4u5OBRzwT8s',l:'English',m:2},
 hairHindi:{t:'HOW TO STYLE YOUR HAIR | BASIC & EASY MEN\'S HAIRSTYLING TUTORIAL | INDIAN MEN | HINDI',c:'DEVRAJ ISHTYLES',id:'0otGA3_21k4',l:'Hindi',m:4},
 spfPal:{t:'How to apply sunscreen the right way?',c:'Dr Pal',id:'Pd3yfPk7ZTE',l:'English',m:1},
 spfAad:{t:'How to apply sunscreen: Dermatologist tips',c:'American Academy of Dermatology',id:'9pg-OybGGCc',l:'English',m:3},
 powder:{t:'MMUK MAN Anti-Shine Powder Tutorial',c:'MMUK MAN',id:'N6dNwPbTtxM',l:'English',m:1}
};
const SQ=q=>({q,url:'https://www.youtube.com/results?search_query='+encodeURIComponent(q)});
const STEP_VIDS={
 cleanse:{v:['sanNight'],s:SQ('how to wash face properly men face wash routine')},
 moist:{v:['spfPal','spfAad'],s:SQ('men moisturiser and sunscreen routine India')},
 primer:{v:[],s:SQ('how to apply primer for men T-zone')},
 eyes:{v:['pbfConceal','sumansi'],s:SQ('men concealer dark circles natural')},
 base:{v:['ankush'],s:SQ('men BB cream foundation natural look Indian skin')},
 spots:{v:['pbfConceal'],s:SQ('men cover acne marks concealer')},
 brows:{v:['brows'],s:SQ('men eyebrow grooming tutorial')},
 lips:{v:[],s:SQ('men lip care routine chapped lips')},
 beard:{v:['neckline','gqBeard'],s:SQ('beard trimming tutorial Hindi')},
 shave:{v:[],s:SQ('how to shave properly men razor bumps')},
 hair:{v:['hairHindi','paste'],s:SQ('men hairstyling tutorial Indian hair')},
 set:{v:['powder'],s:SQ('men setting powder oily skin shine control')},
 check:{v:[],s:SQ('men makeup natural look daylight check blending')}
};
const OCC_VIDS={
 office:{v:['ankush'],s:SQ('men natural makeup for office interview')},
 wedding:{v:['groom','ankush'],s:SQ('groom makeup step by step Hindi')},
 date:{v:['ankush'],s:SQ('men natural makeup date night look')},
 party:{v:[],s:SQ('men party makeup oil control long lasting')},
 photo:{v:['groom'],s:SQ('men makeup for photoshoot camera ready')},
 everyday:{v:['ankush','sanNight'],s:SQ('men daily grooming routine 5 minutes')}
};
const BASICS_VIDS=['ankush','sanNight','spfPal'];
const vurl=k=>'https://www.youtube.com/watch?v='+V[k].id;
function vidButtons(entry,compact){
  const a=entry.v.map(k=>`<a class="vbtn" href="${vurl(k)}" target="_blank" rel="noopener noreferrer">▶ Watch tutorial<small>${esc(V[k].c)}${V[k].l?' · '+V[k].l:''}</small></a>`);
  if(!entry.v.length||!compact) a.push(`<a class="vbtn s" href="${entry.s.url}" target="_blank" rel="noopener noreferrer">🔎 Search tutorials<small>YouTube: “${esc(entry.s.q)}”</small></a>`);
  return `<div class="vids">${a.join('')}</div>`;
}
function vidList(keys){return keys.map(k=>`<a class="vitem" href="${vurl(k)}" target="_blank" rel="noopener noreferrer"><b>▶ ${esc(V[k].t)}</b><small>${esc(V[k].c)}${V[k].l?' · '+V[k].l:''}${V[k].m?' · ~'+V[k].m+' min':''}</small></a>`).join('')}
const VNOTE='Videos are third-party YouTube content (not made or checked by GroomUp) and need internet. Product brands shown in videos are not recommendations.';
const STEP_LBL={cleanse:'Cleanse',moist:'Moisturise + sunscreen',primer:'Primer',eyes:'Dark circles / concealer',base:'Even skin tone / foundation',spots:'Spots & marks',brows:'Brows',lips:'Lips',beard:'Beard shaping & trim',shave:'Clean shave',hair:'Hair styling',set:'Setting powder / shine',check:'Daylight check'};
function viewTutorials(v){
  v.innerHTML=`<h2>▶ Tutorials</h2><p class="sub">Short video guides for every step and look.</p><div class="note">${VNOTE}</div>
  <h3>By step</h3>${Object.entries(STEP_VIDS).map(([k,e])=>`<div class="tut"><h4>${STEP_LBL[k]}</h4>${e.v.length?vidList(e.v):''}<a class="vitem s" href="${e.s.url}" target="_blank" rel="noopener noreferrer"><b>🔎 Search tutorials</b><small>YouTube: “${esc(e.s.q)}”</small></a></div>`).join('')}
  <h3>By occasion</h3>${Object.entries(OCC_VIDS).map(([k,e])=>`<div class="tut"><h4>${OCC[k].e} ${OCC[k].n}</h4>${e.v.length?vidList(e.v):''}<a class="vitem s" href="${e.s.url}" target="_blank" rel="noopener noreferrer"><b>🔎 Search tutorials</b><small>YouTube: “${esc(e.s.q)}”</small></a></div>`).join('')}`;
}
