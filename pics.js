'use strict';
/* Step pictures: small inline SVG illustrations, one per step type. Works offline. */
function stepPic(id,beard){
  const T='#2bb3a3',S='#c99572',D='#8a5a3c',H='#22282b';
  const hl=(d)=>`<g fill="${T}" fill-opacity=".45" stroke="${T}" stroke-width="1.5" stroke-dasharray="3 2">${d}</g>`;
  const dots=(pts,r=2.6)=>pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${T}" stroke-width="1.2"/>`).join('');
  const bd=beard==='full'?`<path d="M33 66 Q34 98 60 104 Q86 98 87 66 Q84 86 72 88 Q60 82 48 88 Q36 86 33 66Z" fill="${H}" opacity=".85"/>`
    :beard==='stubble'?`<path d="M34 68 Q36 96 60 101 Q84 96 86 68 Q82 86 72 87 Q60 83 48 87 Q38 86 34 68Z" fill="${H}" opacity=".3"/>`:'';
  const face=`<rect width="120" height="120" rx="16" fill="#263136"/>
   <path d="M46 102 L44 118 L76 118 L74 102Z" fill="${S}"/>
   <ellipse cx="60" cy="62" rx="27" ry="37" fill="${S}"/>
   <ellipse cx="32.5" cy="64" rx="4" ry="7" fill="${S}"/><ellipse cx="87.5" cy="64" rx="4" ry="7" fill="${S}"/>
   ${bd}
   <path d="M32 54 Q30 22 60 20 Q90 22 88 54 Q84 36 74 33 Q60 30 46 33 Q36 36 32 54Z" fill="${H}"/>
   <path d="M43 50 Q49 46 55 49 M65 49 Q71 46 77 50" stroke="${H}" stroke-width="3" fill="none" stroke-linecap="round"/>
   <ellipse cx="49" cy="58" rx="4" ry="2.4" fill="#fff"/><circle cx="49" cy="58" r="1.8" fill="${H}"/>
   <ellipse cx="71" cy="58" rx="4" ry="2.4" fill="#fff"/><circle cx="71" cy="58" r="1.8" fill="${H}"/>
   <path d="M60 60 L57 74 Q60 76 63 74" stroke="${D}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
   <path d="M52 84 Q60 88 68 84" stroke="#a0574a" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  const ov={
   cleanse: hl('<ellipse cx="60" cy="64" rx="25" ry="33" fill-opacity=".18"/>')+dots([[44,40],[76,42],[40,70],[80,72],[60,96],[52,44],[70,92]],2.2)+
     `<path d="M98 18 q5 8 0 12 q-5-4 0-12Z M106 34 q4 6 0 9 q-4-3 0-9Z" fill="${T}"/>`,
   moist: dots([[60,38],[45,70],[75,70],[60,93],[53,40],[67,40]],3)+`<text x="96" y="22" font-size="13" fill="${T}" font-weight="700">SPF</text>`,
   primer: hl('<path d="M42 34 H78 V44 H66 V78 H54 V44 H42Z"/><ellipse cx="60" cy="95" rx="8" ry="4"/>'),
   eyes: hl('<path d="M42 62 Q49 70 56 62 Q49 66 42 62Z M64 62 Q71 70 78 62 Q71 66 64 62Z"/>')+dots([[45,64],[48,66],[72,66],[75,64]],1.5),
   base: hl('<ellipse cx="60" cy="66" rx="24" ry="30" fill-opacity=".2"/>')+dots([[60,40],[46,72],[74,72],[60,92]],2.4)+
     `<g stroke="${T}" stroke-width="1.6" fill="none"><path d="M40 72 l-6 0 m2-2 l-2 2 2 2 M80 72 l6 0 m-2-2 l2 2-2 2"/></g>`,
   spots: `<g fill="#8f4f3d"><circle cx="44" cy="74" r="1.8"/><circle cx="76" cy="42" r="1.6"/><circle cx="73" cy="78" r="1.8"/></g>`+
     `<g fill="none" stroke="${T}" stroke-width="1.6"><circle cx="44" cy="74" r="5"/><circle cx="76" cy="42" r="5"/><circle cx="73" cy="78" r="5"/></g>`,
   brows: hl('<path d="M41 50 Q49 43 57 49 L56 52 Q49 48 42 53Z M63 49 Q71 43 79 50 L78 53 Q71 48 64 52Z"/>')+
     `<g stroke="${T}" stroke-width="1.6" fill="none"><path d="M49 42 v-6 m-2 2 l2-2 2 2 M71 42 v-6 m-2 2 l2-2 2 2"/></g>`,
   lips: hl('<ellipse cx="60" cy="85" rx="10" ry="4.5"/>'),
   beard: hl(beard==='clean'?'<path d="M35 70 Q38 98 60 102 Q82 98 85 70 Q82 92 60 97 Q38 92 35 70Z"/>':'<path d="M33 66 Q34 99 60 105 Q86 99 87 66 L84 66 Q82 95 60 100 Q38 95 36 66Z"/><path d="M48 106 Q60 110 72 106" fill="none"/>')+
     `<g stroke="${T}" stroke-width="1.6" fill="none"><path d="M96 90 l12 -12 m-14 8 l6 6"/></g>`,
   hair: hl('<path d="M30 54 Q28 18 60 16 Q92 18 90 54 Q84 34 60 30 Q36 34 30 54Z"/>')+
     `<g stroke="${T}" stroke-width="1.6" fill="none"><path d="M44 14 q8-6 16-2 M64 12 q8-4 14 2"/></g>`,
   set: hl('<path d="M42 34 H78 V44 H66 V78 H54 V44 H42Z" fill-opacity=".25"/>')+
     `<circle cx="96" cy="30" r="10" fill="#e8eef0" opacity=".85"/><circle cx="96" cy="30" r="6" fill="${T}" opacity=".5"/>`+dots([[84,38],[80,42],[86,44]],1.2),
   check: `<rect x="22" y="8" width="76" height="104" rx="8" fill="none" stroke="${T}" stroke-width="2"/>`+
     `<g stroke="#e0a84a" stroke-width="1.8"><circle cx="106" cy="14" r="5" fill="#e0a84a"/><path d="M106 3v3 M106 22v3 M95 14h3 M114 14h3"/></g>`
  };
  return `<svg class="pic" viewBox="0 0 120 120" role="img" aria-label="Illustration: ${id}">${face}${ov[id]||''}</svg>`;
}
