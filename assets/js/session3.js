/* הסלון של מזל · מפגש 3: וילות יוקרה בישראל
   בלוק נתונים ורכיבים של המפגש. לא נוגע במנוע ולא במפגשים 1 ו-2. */
(function(){
'use strict';
const {h}=window.Salon;

/* ---------- מדיה ---------- */
const IMG={
  salon:{src:'assets/img/s3-salon',alt:'סלון וילה פתוח אל הגן, ופסי אור ושמש נופלים על הרצפה דרך פרגולה.',ai:true},
  villa:{src:'assets/img/s3-villa',alt:'וילה מאבן בהירה באור אחר הצהריים, עץ זית עתיק ובריכה ארוכה מול קיר זכוכית.',ai:true},
  eve:{src:'assets/img/s3-villa-eve',alt:'אותה וילה בערב. הזית מואר מלמטה, והבריכה מחזירה את אור החלונות.',ai:true},
  mash:{src:'assets/img/s3-mash',alt:'חלון משרבייה מעץ מסורג בולט מחזית אבן, בית א-רזאז, קהיר'}
};
const MASH_CREDIT=()=>h('span',null,'צילום: ',h('a',{class:'en',href:'https://commons.wikimedia.org/wiki/File:Bayt_al-Razzaz_exterior.jpg',target:'_blank',rel:'noopener'},'Robert Prazeres, CC BY-SA 4.0, Wikimedia Commons'));
let audioOK=false;
fetch('assets/audio/s3.m4a',{method:'HEAD'}).then(r=>{audioOK=r.ok}).catch(()=>{});

function pic(key,size,extra){const m=IMG[key];return h('img',Object.assign({src:m.src+(size==='sm'?'-sm':'')+'.jpg',alt:m.alt,decoding:'async'},extra||{}))}
const aiTag=()=>h('span',{class:'ai-tag'},'הדמיה');
const illus=()=>h('span',{class:'ai-tag s3-illus'},'המחשה');

/* ---------- עזרים ---------- */
function sayBox(parent,html){parent.querySelectorAll('.say').forEach(x=>x.remove());const b=h('div',{class:'say',role:'status',html});parent.append(b);
  setTimeout(()=>{try{b.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){}},60);return b}
function head(kicker,title,text){return h('div',{class:'head s2-head'},h('div',null,kicker?h('span',{class:'kicker'},kicker):null,h('h2',null,title)),text?h('p',{class:'lede'},text):null)}
function copy(kicker,title,text,...more){return h('div',{class:'copy'},kicker?h('span',{class:'kicker'},kicker):null,h('h2',null,title),text?h('p',{class:'lede'},text):null,...more)}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function gate(ctx,isDone){const nx=document.querySelector('.nav .next');if(nx&&!isDone)nx.disabled=true;
  const d=ctx.done;ctx.done=()=>{if(nx)nx.disabled=false;d()};if(isDone)d();
  return ()=>{if(nx)nx.disabled=false}}
function label(s){const i=s.indexOf(':');return i<0?h('span',null,s):h('span',null,h('b',null,s.slice(0,i)+':'),s.slice(i+1))}
const nameFill=s=>window.Salon.fill(s);

/* ---------- צבעים וציורים בקוד ---------- */
const C={ink:'#1A3A35',lead:'#14474A',terra:'#C65A3C',mustard:'#E0A63A',sage:'#9DB39A',paper:'#F7F0E4',cream:'#F2E6CF',brass:'#C9A24B',stone:'#E4D3B0',stoneD:'#C9B48A',glass:'#BFDDE4',sky:'#CFE6EE',wood:'#B9824F'};
function svg(vb,inner,extra){return '<svg viewBox="'+vb+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet" '+(extra||'')+'>'+inner+'</svg>'}
function drawBox(html,cls){return h('div',{class:'s3-draw'+(cls?' '+cls:''),html})}
const sofa=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s||1})"><rect x="0" y="0" width="120" height="34" rx="10" fill="${C.lead}"/><rect x="-8" y="18" width="136" height="30" rx="10" fill="${C.lead}"/><rect x="8" y="10" width="34" height="20" rx="6" fill="${C.mustard}"/><rect x="78" y="10" width="34" height="20" rx="6" fill="${C.terra}"/><path d="M4 48v8M116 48v8" stroke="${C.ink}" stroke-width="4"/></g>`;
const olive=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s||1})"><path d="M0 0c-2-30 6-44 2-66M2-40c10-8 18-10 24-22" stroke="#6B5A43" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="-14" cy="-78" rx="34" ry="22" fill="#8FA587"/><ellipse cx="22" cy="-70" rx="28" ry="18" fill="#7E9677"/><ellipse cx="2" cy="-96" rx="30" ry="18" fill="#9DB39A"/></g>`;
const shrub=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="26" ry="14" fill="#8FA587"/><ellipse cx="${x+18}" cy="${y-4}" rx="16" ry="10" fill="#7E9677"/>`;

/* פנים וחוץ: סלון ומרפסת */
function indoorOutdoor(same){
  const inside=`<pattern id="io-w" width="40" height="18" patternUnits="userSpaceOnUse"><rect width="40" height="18" fill="#D6B48A"/><path d="M0 17.5h40M20 0v18" stroke="#B9935F" stroke-width="1.5"/></pattern>`;
  const outside=`<pattern id="io-s" width="48" height="24" patternUnits="userSpaceOnUse"><rect width="48" height="24" fill="#B8BDB9"/><path d="M0 23.5h48M47.5 0v24" stroke="#959C97" stroke-width="2"/></pattern>`;
  const one=`<pattern id="io-o" width="48" height="24" patternUnits="userSpaceOnUse"><rect width="48" height="24" fill="${C.stone}"/><path d="M0 23.5h48M47.5 0v24" stroke="${C.stoneD}" stroke-width="2"/></pattern>`;
  return svg('0 0 600 400',`<defs>${inside}${outside}${one}</defs>
  <rect width="600" height="400" fill="${C.sky}"/><path d="M0 230c90-40 170-30 250-12V300H0z" fill="#B7C9A9"/>
  ${olive(120,250,1)}${shrub(60,262)}${shrub(220,270)}
  <rect x="300" y="40" width="300" height="230" fill="${C.cream}"/><rect x="300" y="30" width="300" height="14" fill="${C.ink}"/>
  <rect x="296" y="40" width="10" height="230" fill="#E8EEF0" stroke="${C.ink}" stroke-width="2"/>
  <rect x="440" y="80" width="80" height="100" rx="4" fill="${C.terra}" opacity=".8"/>${sofa(410,214,1)}
  <rect x="0" y="270" width="300" height="130" fill="url(#${same?'io-o':'io-s'})"/>
  <rect x="300" y="270" width="300" height="130" fill="url(#${same?'io-o':'io-w'})"/>
  ${same?'':`<rect x="296" y="266" width="10" height="134" fill="${C.ink}" opacity=".75"/>`}
  <rect x="60" y="300" width="110" height="10" rx="4" fill="${C.wood}"/><path d="M70 310v24M160 310v24" stroke="${C.wood}" stroke-width="6"/>`,'role="img"');
}

/* דלתות כיס */
function pocketSvg(){
  return svg('0 0 640 400',`<rect width="640" height="400" fill="${C.cream}"/>
  <rect x="110" y="70" width="420" height="250" fill="${C.sky}"/><path d="M110 250c120-40 260-50 420-10v80H110z" fill="#B7C9A9"/>
  ${olive(240,300,1.05)}${shrub(400,300)}${shrub(170,310)}
  <g class="pd pd-r"><rect x="110" y="70" width="210" height="250" fill="${C.glass}" fill-opacity=".55" stroke="${C.ink}" stroke-width="6"/><path d="M140 100l40-26M150 140l70-46" stroke="#fff" stroke-width="5" opacity=".7"/></g>
  <g class="pd pd-l"><rect x="320" y="70" width="210" height="250" fill="${C.glass}" fill-opacity=".55" stroke="${C.ink}" stroke-width="6"/><path d="M350 100l40-26M360 140l70-46" stroke="#fff" stroke-width="5" opacity=".7"/></g>
  <rect x="0" y="40" width="110" height="300" fill="${C.cream}"/><rect x="530" y="40" width="110" height="300" fill="${C.cream}"/>
  <rect x="0" y="40" width="640" height="30" fill="${C.cream}"/>
  <path d="M110 70v250M530 70v250" stroke="${C.stoneD}" stroke-width="4"/>
  <rect x="0" y="320" width="640" height="80" fill="${C.stone}"/><path d="M0 320h640" stroke="${C.stoneD}" stroke-width="3"/>
  ${sofa(30,276,.7)}<rect x="560" y="230" width="60" height="90" rx="6" fill="${C.sage}"/>`);
}

/* רפרפות: חלון ופסי אור */
function louvreSvg(on){
  const stripes=on?Array.from({length:7},(_,i)=>`<path d="M${150+i*30} 280L${120+i*44} 380h22L${168+i*30} 280z" fill="#FBE7B0" opacity=".9"/>`).join(''):`<path d="M150 280L110 380h330L380 280z" fill="#FBE7B0" opacity=".95"/>`;
  const slats=on?Array.from({length:10},(_,i)=>`<rect x="142" y="${74+i*20}" width="246" height="9" rx="3" fill="${C.wood}" stroke="${C.ink}" stroke-width="1.5"/>`).join(''):'';
  return svg('0 0 540 400',`<rect width="540" height="400" fill="${C.cream}"/><rect x="0" y="280" width="540" height="120" fill="#D6B48A"/>
  <rect x="150" y="70" width="230" height="210" fill="#FFF3CF"/><path d="M150 210c70-30 150-20 230 0v70H150z" fill="#B7C9A9"/>
  <circle cx="330" cy="120" r="24" fill="${C.mustard}"/>
  <rect x="146" y="66" width="238" height="218" fill="none" stroke="${C.ink}" stroke-width="7"/>${stripes}${slats}
  ${sofa(400,300,.9)}`);
}

/* הפטיו: תוכנית וילה מלמעלה */
function patioPlan(){
  return svg('0 0 600 400',`<rect width="600" height="400" fill="${C.paper}"/>
  <rect x="30" y="30" width="540" height="340" fill="#fff" stroke="${C.ink}" stroke-width="8"/>
  <path d="M30 140h170M400 140h170M30 260h170M400 260h170M200 30v340M400 30v340" stroke="${C.ink}" stroke-width="5"/>
  <rect x="200" y="140" width="200" height="120" fill="#E8EFE2" stroke="${C.ink}" stroke-width="3" stroke-dasharray="8 6"/>
  <g font-family="Assistant,sans-serif" font-weight="800" font-size="24" fill="${C.lead}" text-anchor="middle">
   <text x="485" y="92">סלון</text><text x="115" y="92">מטבח</text><text x="485" y="330">סוויטה</text><text x="115" y="330">מסדרון</text></g>`);
}

/* סימולטור השמש: חתך סלון */
const SIM={W:640,H:380,wall:252,top:110,bot:250,floor:280};
function simSvg(){
  return svg('0 0 640 380',`<defs>
   <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sk1" stop-color="#9FCBE0"/><stop offset="1" class="sk2" stop-color="#E7F2F4"/></linearGradient>
   <pattern id="st" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(12)"><rect width="16" height="9" fill="#FFE29A"/></pattern>
   <radialGradient id="gl"><stop offset="0" stop-color="#FFD66B" stop-opacity=".8"/><stop offset="1" stop-color="#FFD66B" stop-opacity="0"/></radialGradient></defs>
  <rect width="640" height="300" fill="url(#sk)"/><path d="M0 252c80-24 160-22 240-6v54H0z" fill="#B7C9A9"/><rect x="0" y="280" width="252" height="100" fill="#A7BC98"/>
  <g class="sun"><circle r="58" fill="url(#gl)"/><circle r="24" fill="${C.mustard}" stroke="#F6C04F" stroke-width="5"/></g>
  <rect x="252" y="56" width="388" height="224" fill="${C.cream}"/><rect x="230" y="44" width="410" height="14" fill="${C.ink}"/>
  <rect x="240" y="58" width="12" height="52" fill="${C.stone}" stroke="${C.ink}" stroke-width="2"/><rect x="240" y="250" width="12" height="30" fill="${C.stone}" stroke="${C.ink}" stroke-width="2"/>
  <rect x="244" y="110" width="4" height="140" fill="${C.glass}"/>
  <path class="beam" d="M252 110L252 250L252 280L252 280Z" fill="#FFE7A3" opacity=".7"/>
  <path class="patch" d="M252 280h0v8h0z" fill="#FFD66B"/>
  <rect x="252" y="280" width="388" height="100" fill="#D6B48A"/><path d="M252 280h388" stroke="#B9935F" stroke-width="3"/>
  <path class="patch2" d="M252 280h0v10h0z" fill="#FFCE5A" opacity=".9"/>
  <ellipse cx="520" cy="282" rx="96" ry="6" fill="${C.terra}" opacity=".5"/>${sofa(462,232,1)}
  <g class="dark"><rect x="252" y="56" width="388" height="324" fill="${C.ink}" opacity="0"/></g>
  <g class="sh-overhang" opacity="0"><rect x="168" y="100" width="84" height="10" fill="${C.ink}"/></g>
  <g class="sh-pergola" opacity="0"><path d="M130 104h122M150 104v176" stroke="${C.wood}" stroke-width="8"/>${[138,164,190,216,240].map((x,i)=>`<circle cx="${x}" cy="${98+(i%2)*10}" r="17" fill="#7E9677"/>`).join('')}<circle cx="236" cy="128" r="14" fill="#8FA587"/><circle cx="226" cy="150" r="11" fill="#7E9677"/></g>
  <g class="sh-louvres" opacity="0">${Array.from({length:8},(_,i)=>`<rect x="216" y="${112+i*18}" width="22" height="8" rx="2" fill="${C.wood}" stroke="${C.ink}" stroke-width="1.2"/>`).join('')}<path d="M214 106v148M240 106v148" stroke="${C.ink}" stroke-width="3"/></g>
  <g class="sh-shutter"><rect class="shut" x="240" y="110" width="12" height="0" fill="${C.terra}"/></g>
  <g class="lbl"><rect x="16" y="16" width="150" height="40" rx="20" fill="#fff" opacity=".92"/><text x="91" y="43" text-anchor="middle" font-family="Assistant,sans-serif" font-weight="800" font-size="22" fill="${C.lead}"></text></g>`,'class="s3-simsvg"');
}
const LV=['קריר וחשוך','נעים','חם מדי'];
function meterEl(){return h('div',{class:'s3-meter',role:'status','aria-label':'המד'},...LV.map((t,i)=>h('span',{class:'m m'+i},t)))}
function setMeter(m,v){m.querySelectorAll('.m').forEach((s,i)=>s.classList.toggle('on',i===v))}
/* מצב התמונה: el=גובה השמש במעלות, front=השמש מול החלון, k=עוצמת האור */
function simApply(box,st){
  const s=box.querySelector('svg');if(!s)return;
  const tan=Math.tan((st.el||30)*Math.PI/180);
  let sx,sy;
  if(st.front){const R=230;sx=SIM.wall-6-R*Math.cos(st.el*Math.PI/180);sy=SIM.floor-R*Math.sin(st.el*Math.PI/180)}
  else{sx=st.side==='east'?560:520;sy=st.side==='east'?30:24}
  const sun=s.querySelector('.sun');sun.style.transform=`translate(${sx}px,${sy}px)`;sun.style.opacity=st.front?1:.45;
  let top=SIM.top;const bot=SIM.bot;
  if(st.shade==='overhang')top=Math.max(top,105+80*tan);
  if(st.shutter==='half')top=Math.max(top,180);
  let k=st.k==null?1:st.k;if(!st.front||st.shutter==='closed'||top>=bot)k=0;
  const fx=y=>Math.min(636,SIM.wall+(SIM.floor-y)/tan);
  const xb=fx(bot),xt=fx(top);
  const beam=s.querySelector('.beam'),patch=s.querySelector('.patch2');
  beam.setAttribute('d',`M252 ${top}L252 ${bot}L${xb} 280L${xt} 280Z`);
  patch.setAttribute('d',`M${xb} 281L${xt} 281L${xt+6} 292L${xb+6} 292Z`);
  const striped=st.shutter==='half'||st.shade==='louvres'||st.shade==='pergola';
  beam.setAttribute('fill',striped?'url(#st)':'#FFE7A3');
  beam.style.opacity=k*(striped?.75:.6);patch.style.opacity=k;
  s.querySelector('.dark rect').setAttribute('opacity',st.shutter==='closed'?.35:0);
  ['overhang','pergola','louvres'].forEach(n=>{s.querySelector('.sh-'+n).setAttribute('opacity',st.shade===n?1:0)});
  s.querySelector('.shut').setAttribute('height',st.shutter==='closed'?140:st.shutter==='half'?70:0);
  const winter=st.season==='winter',sk=st.time==='afternoon'?['#F3C98B','#FBE9CF']:st.time==='morning'?['#BFE0EC','#F2F7F4']:winter?['#B8CED8','#E8EEF0']:['#8EC3DC','#E4F1F4'];
  s.querySelector('.sk1').setAttribute('stop-color',sk[0]);s.querySelector('.sk2').setAttribute('stop-color',sk[1]);
  s.querySelector('.lbl text').textContent=st.tag||'';s.querySelector('.lbl').style.opacity=st.tag?1:0;
}
/* מסך 10: מצב לפי שעה, כיוון ותריס */
function sim10(t,d,sh){
  let st,msg,lvl;
  if(t==='morning'){st={front:false,side:'east'};msg='בבוקר השמש במזרח, ולחלון הזה מגיע אור רך.';lvl=1}
  else if(d==='south'&&t==='noon'){st={front:true,el:72,k:1};msg='השמש גבוהה וחזקה. כתם אור חם ליד החלון, והסלון מתחמם.';lvl=2}
  else if(d==='south'){st={front:true,el:42,k:.45};msg='השמש כבר פונה למערב, ולחלון הזה מגיע פחות.';lvl=1}
  else if(t==='noon'){st={front:false,side:'top'};msg='השמש עוד לא הגיעה לצד הזה של הבית.';lvl=1}
  else{st={front:true,el:17,k:1};msg='השמש נמוכה ונכנסת עמוק, עד הספה.';lvl=2}
  st.shutter=sh;st.time=t;st.tag=d==='south'?'חלון דרומי':'חלון מערבי';
  if(sh==='half'){msg+=' התריס עוצר חלק מהשמש, ועל הרצפה נשארים פסי אור.';lvl=Math.max(0,lvl-1)}
  if(sh==='closed'){msg='קריר, אבל גם חשוך, ואת הנוף כבר לא רואים.';lvl=0}
  return {st,msg,lvl};
}

/* שני חלונות: דרום עם גגון, מערב עם רפרפות */
function winSouth(){return svg('0 0 260 220',`<rect width="260" height="220" fill="${C.sky}"/><rect x="30" y="50" width="200" height="170" fill="${C.stone}"/><rect x="18" y="40" width="224" height="12" fill="${C.ink}"/>
  <rect x="70" y="100" width="120" height="100" fill="${C.glass}" stroke="${C.ink}" stroke-width="5"/><rect x="56" y="86" width="148" height="12" rx="3" fill="${C.lead}"/>
  <circle cx="200" cy="22" r="16" fill="${C.mustard}"/><path d="M186 34l-40 50" stroke="${C.mustard}" stroke-width="4" stroke-dasharray="6 6"/>`)}
function winWest(){return svg('0 0 260 220',`<rect width="260" height="220" fill="#F6D9A8"/><rect x="30" y="50" width="200" height="170" fill="${C.stone}"/><rect x="18" y="40" width="224" height="12" fill="${C.ink}"/>
  <rect x="70" y="90" width="120" height="110" fill="${C.glass}" stroke="${C.ink}" stroke-width="5"/>${Array.from({length:7},(_,i)=>`<rect x="64" y="${94+i*15}" width="132" height="7" rx="2" fill="${C.wood}" stroke="${C.ink}" stroke-width="1.2"/>`).join('')}
  <circle cx="20" cy="120" r="14" fill="${C.terra}"/>`)}

/* הכול בקומה אחת: חתך וילה */
function floorsSvg(){
  return svg('0 0 600 380',`<rect width="600" height="380" fill="${C.sky}"/><rect x="0" y="330" width="600" height="50" fill="#A7BC98"/>
  ${olive(70,334,.9)}${shrub(150,334)}
  <rect x="200" y="40" width="360" height="290" fill="${C.cream}" stroke="${C.ink}" stroke-width="6"/><path d="M200 185h360" stroke="${C.ink}" stroke-width="6"/>
  <rect x="190" y="30" width="380" height="14" fill="${C.ink}"/>
  <rect x="194" y="215" width="12" height="115" fill="${C.glass}" stroke="${C.ink}" stroke-width="2"/><path d="M206 330h-30" stroke="${C.stoneD}" stroke-width="6"/>`);
}

/* אבן ירושלמית: המחשה */
function jlmSvg(){
  const blocks=(x,y,w,hh)=>{let s='';for(let r=0;r<hh/18;r++){const off=r%2?14:0;for(let c=-1;c<w/30+1;c++){const bx=x+c*30+off;if(bx+28<x||bx>x+w)continue;const x1=Math.max(x,bx),x2=Math.min(x+w,bx+28);s+=`<rect x="${x1}" y="${y+r*18}" width="${x2-x1}" height="16" rx="2" fill="${(r*7+c*3)%5?'#EAD9B4':'#E2CC9F'}"/>`}}return s};
  const win=(x,y)=>`<path d="M${x} ${y+40}v-26a14 14 0 0 1 28 0v26z" fill="#6E8C92" stroke="#B89D6C" stroke-width="3"/>`;
  return svg('0 0 600 400',`<rect width="600" height="400" fill="#BFDDEA"/><path d="M0 230c120-50 260-60 600-30v200H0z" fill="#D9CDB0"/>
  <rect x="20" y="130" width="170" height="270" fill="#D8C49B"/>${blocks(20,130,170,270)}${[45,95,145].map(x=>win(x,160)+win(x,240)).join('')}
  <rect x="210" y="80" width="200" height="320" fill="#D8C49B"/>${blocks(210,80,200,320)}${[235,290,345].map(x=>win(x,110)+win(x,190)+win(x,270)).join('')}
  <rect x="430" y="150" width="160" height="250" fill="#D8C49B"/>${blocks(430,150,160,250)}${[455,515].map(x=>win(x,180)+win(x,260)).join('')}
  <path d="M196 400c-6-80 2-160 8-200 6 40 12 120 6 200z" fill="#5E7A5A"/><path d="M420 400c-6-60 2-120 6-150 6 30 10 90 4 150z" fill="#5E7A5A"/>
  <rect x="0" y="384" width="600" height="16" fill="#C9B48A"/>`,'role="img"');
}

/* החזית */
const WALL=[['stone','אבן פראית','חמה וטבעית, ומשתנה עם האור.'],['plaster','טיח לבן','נקי ושקט. בשקיעה הוא נצבע כתום.'],['wood','חיפוי עץ','מוסיף לחזית חום ורכות.']];
const SHADE=[['louvres','רפרפות','<b>בדיוק.</b> הן עוצרות את השמש הנמוכה ומשאירות פסי אור.'],['shutter','תריס','<b>בדיוק.</b> בשעות החמות סוגרים, ובשקיעה פותחים לנוף.'],
  ['overhang','גגון','<b>רמז:</b> במערב השמש נמוכה ועוברת מתחת לגגון. רוצה לנסות רפרפות או תריס?'],['pergola','פרגולה עם גפן','<b>רמז:</b> הגפן עוזרת, אבל מול המערב היא לא מספיקה. רוצה לנסות רפרפות או תריס?']];
const FLOOR=[['same','ממשיך מהסלון למרפסת','הסלון והמרפסת נראים כמו חדר אחד גדול.'],['diff','שונה','כל חלל מקבל אופי משלו.']];
const PLANT=[['olive','עץ זית','זית מול החלון, כמו תמונה חיה.'],['bougainvillea','בוגנוויליה','צבעים חזקים של ורוד וסגול על הקיר.'],['palm','דקל','דקל גבוה שממסגר את השקיעה.']];
const nm=(L,k)=>(L.find(x=>x[0]===k)||[])[1]||'';
function facadeSvg(f,sunset){
  f=f||{};
  const skyA=sunset?'#F2A65A':'#A9D3E6',skyB=sunset?'#FBE3B5':'#E8F3F5';
  const wallFill=f.wall==='stone'?'url(#fs)':f.wall==='plaster'?(sunset?'#F8DCC0':'#FAF8F2'):f.wall==='wood'?'url(#fw)':'#E9E4DA';
  let shade='';
  if(f.shade==='louvres')shade=Array.from({length:9},(_,i)=>`<rect x="186" y="${122+i*17}" width="228" height="8" rx="2" fill="${C.wood}" stroke="${C.ink}" stroke-width="1.2"/>`).join('');
  if(f.shade==='shutter')shade=`<rect x="190" y="118" width="220" height="${sunset?20:80}" fill="${C.terra}"/>${Array.from({length:sunset?1:4},(_,i)=>`<path d="M190 ${134+i*18}h220" stroke="#9C4630" stroke-width="2"/>`).join('')}`;
  if(f.shade==='overhang')shade=`<rect x="170" y="100" width="260" height="14" fill="${C.ink}"/>`;
  if(f.shade==='pergola')shade=`<path d="M120 96h360M140 96v214M460 96v214" stroke="${C.wood}" stroke-width="9"/>${[150,190,240,290,340,390,440].map((x,i)=>`<circle cx="${x}" cy="${90+(i%2)*10}" r="20" fill="#7E9677"/>`).join('')}`;
  const terr=f.floor==='diff'?'url(#ft)':'url(#ff)';
  let plant='';
  if(f.plant==='olive')plant=olive(80,330,1.25);
  if(f.plant==='palm')plant=`<path d="M78 330c-4-90 4-170 14-220" stroke="#8B6B45" stroke-width="10" fill="none"/>${[-60,-25,10,45,80,200,235].map(a=>`<path d="M92 112q${Math.cos(a*Math.PI/180)*40} ${Math.sin(a*Math.PI/180)*40-10} ${Math.cos(a*Math.PI/180)*80} ${Math.sin(a*Math.PI/180)*80+20}" stroke="#5E7A5A" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('')}`;
  if(f.plant==='bougainvillea')plant=Array.from({length:22},(_,i)=>`<circle cx="${150+((i*37)%110)-30}" cy="${130+((i*53)%170)}" r="${9+(i%3)*3}" fill="${i%3?'#D9418B':'#9B4DB5'}"/>`).join('')+`<path d="M120 330c0-60 20-120 40-190" stroke="#6B5A43" stroke-width="5" fill="none"/>`;
  const sun=sunset?`<circle cx="540" cy="262" r="30" fill="#F7B34A"/><path d="M470 270h140" stroke="#F7C77A" stroke-width="3"/>`:'';
  return svg('0 0 600 400',`<defs><linearGradient id="fsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyA}"/><stop offset="1" stop-color="${skyB}"/></linearGradient>
   <pattern id="fs" width="60" height="40" patternUnits="userSpaceOnUse"><rect width="60" height="40" fill="${sunset?'#E9C79A':C.stone}"/><path d="M2 2h30v16H2zM36 4h22v14H36zM-6 22h24v16H-6zM22 22h34v16H22z" fill="none" stroke="${C.stoneD}" stroke-width="2.5" stroke-linejoin="round"/></pattern>
   <pattern id="fw" width="22" height="40" patternUnits="userSpaceOnUse"><rect width="22" height="40" fill="${sunset?'#B97A47':'#C08C5A'}"/><path d="M21 0v40" stroke="#8F6237" stroke-width="2"/></pattern>
   <pattern id="ff" width="50" height="16" patternUnits="userSpaceOnUse"><rect width="50" height="16" fill="${C.stone}"/><path d="M0 15h50M49 0v16" stroke="${C.stoneD}" stroke-width="2"/></pattern>
   <pattern id="ft" width="40" height="16" patternUnits="userSpaceOnUse"><rect width="40" height="16" fill="#AEB4B0"/><path d="M0 15h40M39 0v16" stroke="#8D948F" stroke-width="2"/></pattern></defs>
  <rect width="600" height="400" fill="url(#fsk)"/><rect x="0" y="268" width="600" height="20" fill="${sunset?'#C7795A':'#5D9DB3'}"/>${sun}
  <rect x="110" y="70" width="380" height="240" fill="${wallFill}" stroke="${C.ink}" stroke-width="4"/><rect x="100" y="58" width="400" height="14" fill="${C.ink}"/>
  <rect x="190" y="118" width="220" height="186" fill="${sunset?'#F6C88C':C.glass}" stroke="${C.ink}" stroke-width="6"/><path d="M300 118v186" stroke="${C.ink}" stroke-width="4"/>
  ${sunset?`<rect x="196" y="124" width="208" height="176" fill="#FFE2A0" opacity=".55"/>`:''}${sofa(230,250,.8)}
  <rect x="196" y="290" width="208" height="14" fill="${f.floor?'url(#ff)':'#E9E4DA'}"/>
  ${shade}
  <path d="M0 310h600v90H0z" fill="${f.floor?terr:'#DDD6C8'}"/><path d="M0 310h600" stroke="${C.ink}" stroke-width="3"/>
  ${plant}`,'role="img"');
}
/* החזית במחברת */
const prevDraw=window.Salon.drawNote;
window.Salon.drawNote=function(it){if(it.kind==='facade3'&&it.facade){return h('div',{class:'s3-nb',html:facadeSvg(it.facade,true)})}return prevDraw?prevDraw(it):null};

/* ---------- רכיבים ---------- */
function spots(el,ctx,o){
  const found=ctx.data.found||(ctx.data.found={});
  const box=h('div',{class:'s2-pic'},h('img',{src:o.src,alt:o.alt,decoding:'async'}));
  if(o.ai)box.append(aiTag());
  const counter=h('span',{class:'counter'});const list=h('ol',{class:'s2-tags'});
  o.pts.forEach((p,i)=>{const b=h('button',{type:'button',class:'s2-dot'+(found[i]?' found':''),style:`left:${p.x}%;top:${p.y}%`,'aria-label':p.name||('נקודה '+(i+1))},found[i]?String(i+1):'');
    b.addEventListener('click',()=>{found[i]=1;ctx.save();b.classList.add('found');b.textContent=String(i+1);upd()});box.append(b)});
  function upd(){const n=Object.keys(found).length;counter.textContent='מצאת '+n+' מתוך '+o.pts.length;
    list.replaceChildren(...o.pts.map((p,i)=>found[i]?h('li',{value:i+1},label(p.t)):null).filter(Boolean));if(n===o.pts.length)ctx.done()}
  el.append(head(o.kicker,o.title,o.lede),h('div',{class:'s3-row'},h('div',{class:'s2-media'},box,o.credit?h('div',{class:'note s2-cap'},o.credit):null),h('div',null,h('div',{class:'row'},counter),list)));
  upd();
  return gate(ctx,Object.keys(found).length===o.pts.length);
}
/* לפני ואחרי עם חצים בלחיצה */
function compare(ctx,beforeHtml,afterHtml,lb,la){
  const c=h('div',{class:'compare s2-compare s3-compare'},h('div',{class:'layer after',html:afterHtml}),h('div',{class:'layer before',html:beforeHtml}),h('div',{class:'handle'}),
    h('span',{class:'lbl b'},lb),h('span',{class:'lbl a'},la),illus());
  const r=h('input',{type:'range',min:0,max:100,value:ctx.data.cut!=null?ctx.data.cut:50,dir:'ltr','aria-label':'גררי כדי להשוות בין '+lb+' ל'+la});
  const set=v=>{v=Math.max(0,Math.min(100,+v));c.style.setProperty('--cut',v+'%');r.value=v;ctx.data.cut=v};
  const mark=()=>{ctx.save();ctx.done()};
  r.addEventListener('input',()=>{set(r.value);ctx.done()});r.addEventListener('change',mark);c.append(r);set(r.value);
  const arrows=h('div',{class:'row s2-ab s3-arrows'},
    h('button',{class:'btn',type:'button','aria-label':'הזיזי את הקו ימינה',onclick:()=>{set(ctx.data.cut+25);mark()}},'→'),
    h('button',{class:'btn',type:'button','aria-label':'הזיזי את הקו שמאלה',onclick:()=>{set(ctx.data.cut-25);mark()}},'←'));
  if(ctx.data.cut!=null&&ctx.data.cut!==50)ctx.done();
  return h('div',null,c,arrows);
}
/* שאלה עם תשובות בסדר אקראי ורמז */
function quiz(el,ctx,o){
  if(!ctx.data.order){ctx.data.order=shuffle(o.opts.map((_,i)=>i));ctx.save()}
  const res=h('div');
  const list=h('div',{class:'quiz s2-quiz'},...ctx.data.order.map((oi,n)=>{const [t,ok]=o.opts[oi];const b=h('button',{type:'button',class:'opt','data-i':oi},h('span',{class:'mk','aria-hidden':'true'},String(n+1)),t);
    b.addEventListener('click',()=>{if(ctx.data.ok)return;if(ok){ctx.data.ok=true;ctx.save();mark();sayBox(res,o.right);o.onRight&&o.onRight();ctx.done()}else{b.classList.add('tried');sayBox(res,o.hint)}});return b}));
  function mark(){const b=list.querySelector('[data-i="'+o.opts.findIndex(x=>x[1])+'"]');b.classList.add('right');b.querySelector('.mk').textContent='✓'}
  el.append(h('div',{class:'split media s2-split s3-qsplit'},h('div',{class:'s2-media'},o.visual),h('div',{class:'copy'},h('span',{class:'kicker'},o.kicker),o.lede?h('p',{class:'lede s3-small'},o.lede):null,h('h2',null,o.q),list,res)));
  if(ctx.data.ok){mark();sayBox(res,o.right);o.onRight&&o.onRight(true)}
  return gate(ctx,!!ctx.data.ok);
}
const sayOf=(q,opts)=>q+' '+opts.map((o,i)=>'תשובה '+(i+1)+': '+o[0]+'.').join(' ');
function chipRow(labelText,opts,cur,onPick,cls){
  return h('div',{class:'s3-q'+(cls?' '+cls:'')},labelText?h('b',null,labelText):null,h('div',{class:'chips sm',role:'group','aria-label':labelText||''},...opts.map(([k,t])=>h('button',{type:'button','aria-pressed':String(cur===k),onclick:()=>onPick(k)},t))));
}

/* ---------- 24 המסכים ---------- */
const screens=[

/* יחידה 1 */
{id:'open',title:'וילות יוקרה בישראל',hideNext:true,
 text:'ברוכה השבה, {name}. את הסלון הזה ראית בסוף המפגש הקודם. היום נוסעים לווילות של ישראל. האור כאן חזק וחם, והאדריכלים למדו לנהל אותו. בסוף המפגש השמש תהיה בידיים שלך.',
 mount(el,ctx){
  el.append(h('div',{class:'split'},h('div',{class:'s2-arch'},h('div',{class:'arch-back'}),h('div',{class:'frame'},pic('salon','lg'),aiTag())),
    h('div',{class:'copy'},h('span',{class:'kicker'},'מפגש 3'),h('h1',null,'וילות יוקרה בישראל'),
      h('p',{class:'lede'},nameFill('ברוכה השבה, {name}. את הסלון הזה ראית בסוף המפגש הקודם. היום נוסעים לווילות של ישראל. האור כאן חזק וחם, והאדריכלים למדו לנהל אותו. בסוף המפגש השמש תהיה בידיים שלך.')),
      h('button',{class:'cta',type:'button',onclick:ctx.next,html:'בואי נתחיל'+window.Salon.ICON.arrowL}))));
 }},

{id:'secrets',title:'ארבעה סודות',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'לווילה ישראלית יש ארבעה סודות. היום נכיר את כולם.',
 mount(el,ctx){
  const R=['פנים וחוץ הם מרחב אחד.','את השמש מנהלים.','אבן לצד זכוכית.','הכול בקומה אחת, צעד מהגינה.'];
  const seen=ctx.data.seen||(ctx.data.seen={});
  const grid=h('div',{class:'cards s2-flips s3-secrets'},...R.map((d,i)=>{
    const f=h('button',{type:'button',class:'flip'+(seen[i]?' on':''),'aria-label':'סוד '+(i+1)},h('div',{class:'in'},
      h('div',{class:'f'},h('span',{class:'s3-num'},String(i+1)),h('div',{class:'q'},'סוד '+(i+1))),h('div',{class:'b'},h('div',{class:'rule'},d))));
    f.addEventListener('click',()=>{f.classList.add('on');seen[i]=true;ctx.save();if(Object.keys(seen).length===4)ctx.done()});return f}));
  el.append(head('ארבעה סודות','ארבעה סודות','לווילה ישראלית יש ארבעה סודות. היום נכיר את כולם.'),grid);
  return gate(ctx,Object.keys(seen).length===4);
 }},

{id:'inout',title:'פנים וחוץ',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'בווילה ישראלית הסלון לא נגמר בקיר. הוא ממשיך החוצה, אל המרפסת והגינה. מעצבים קוראים לזה חיים בין פנים לחוץ (Indoor-Outdoor Living). הסוד פשוט: אותו ריצוף בפנים ובחוץ. העין לא נעצרת בגבול, והסלון נראה גדול יותר.',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,indoorOutdoor(false),indoorOutdoor(true),'שני ריצופים','ריצוף אחד')),
   copy('הסוד הראשון','פנים וחוץ','בווילה ישראלית הסלון לא נגמר בקיר. הוא ממשיך החוצה, אל המרפסת והגינה. מעצבים קוראים לזה חיים בין פנים לחוץ (Indoor-Outdoor Living). הסוד פשוט: אותו ריצוף בפנים ובחוץ. העין לא נעצרת בגבול, והסלון נראה גדול יותר.')));
 }},

{id:'pocket',title:'הקיר שנעלם',task:'לחצי על הכפתור ותראי את הדלתות נעלמות.',wide:true,
 text:'ומה עם הזכוכית שבין הסלון למרפסת? בווילות רבות הדלתות נגררות ונעלמות לתוך הקיר. קוראים להן דלתות כיס (Pocket Doors). כשהן פתוחות, אין גבול בין הסלון לגינה.',
 mount(el,ctx){
  const box=h('div',{class:'s3-draw s3-pocket'+(ctx.data.open?' open':''),html:pocketSvg()});box.append(illus());
  const btn=h('button',{class:'cta',type:'button',onclick:()=>{ctx.data.open=!ctx.data.open;ctx.save();box.classList.toggle('open',!!ctx.data.open);btn.textContent=ctx.data.open?'סגרי את הקיר':'פתחי את הקיר';ctx.done()}},ctx.data.open?'סגרי את הקיר':'פתחי את הקיר');
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
   copy('הסוד הראשון','הקיר שנעלם','ומה עם הזכוכית שבין הסלון למרפסת? בווילות רבות הדלתות נגררות ונעלמות לתוך הקיר. קוראים להן דלתות כיס (Pocket Doors). כשהן פתוחות, אין גבול בין הסלון לגינה.',h('div',{class:'row',style:'margin-top:14px'},btn))));
  if(ctx.data.open!=null)ctx.done();
 }},

/* יחידה 2 */
{id:'stoneglass',title:'אבן וזכוכית',task:'לחצי על קיר האבן ועל הזכוכית שבתמונה.',wide:true,
 text:'עוד סוד מהכרטיסים: אבן לצד זכוכית. האבן גסה וכבדה, והזכוכית דקה ושקופה. כשהן עומדות זו לצד זו, כל אחת מדגישה את השנייה. האבן נראית חמה יותר, והזכוכית נראית קלה יותר.',
 mount(el,ctx){return spots(el,ctx,{kicker:'הסוד השלישי',title:'אבן וזכוכית',lede:'עוד סוד מהכרטיסים: אבן לצד זכוכית. האבן גסה וכבדה, והזכוכית דקה ושקופה. כשהן עומדות זו לצד זו, כל אחת מדגישה את השנייה. האבן נראית חמה יותר, והזכוכית נראית קלה יותר.',
  src:IMG.villa.src+'.jpg',alt:IMG.villa.alt,ai:true,
  pts:[{x:43,y:42,name:'קיר האבן',t:'קיר אבן בהירה. ליד הזכוכית הגוון החם שלו בולט עוד יותר.'},{x:66,y:50,name:'הזכוכית',t:'הזכוכית כמעט נעלמת, והאבן שלידה נראית מוצקה עוד יותר.'}]})}},

{id:'jlm',title:'אבן ירושלמית',task:'בחרי את התשובה שנראית לך נכונה.',wide:true,
 say:'למה כמעט כל הבניינים בירושלים באותו גוון בהיר? תשובה 1: כל בניין חדש חייב להיות מחופה באבן. תשובה 2: כל הבניינים נצבעים באותו צבע. תשובה 3: ככה בונים שם רק בשנים האחרונות.',
 mount(el,ctx){
  const res=h('div');const STORY='כשהבריטים שלטו בירושלים, נקבע שכל בניין חדש יחופה באבן. החוק בתוקף עד היום. לכן העיר כולה נראית בגוון אחד, בהיר וחם.';
  const OPT=[['כל בניין חדש חייב להיות מחופה באבן',1],['כל הבניינים נצבעים באותו צבע',0],['ככה בונים שם רק בשנים האחרונות',0]];
  const list=h('div',{class:'quiz s2-quiz'},...OPT.map(([t],i)=>{const b=h('button',{type:'button',class:'opt'},h('span',{class:'mk','aria-hidden':'true'},String(i+1)),t);
    b.addEventListener('click',()=>{ctx.data.ans=i;ctx.save();show()});return b}));
  function show(){const i=ctx.data.ans;if(i==null)return;list.querySelectorAll('.opt').forEach((b,j)=>{b.classList.toggle('right',OPT[j][1]===1);b.querySelector('.mk').textContent=OPT[j][1]?'✓':String(j+1)});
    sayBox(res,(OPT[i][1]?'':'<b>כמעט. הנה הסיפור:</b> ')+STORY);ctx.done()}
  const box=h('div',{class:'s3-draw',html:jlmSvg()});box.append(illus());
  el.append(h('div',{class:'split media s2-split s3-qsplit'},h('div',{class:'s2-media'},box),
    h('div',{class:'copy'},h('span',{class:'kicker'},'אבן ירושלמית'),h('h2',null,'למה כמעט כל הבניינים בירושלים באותו גוון בהיר?'),list,res)));
  show();
 }},

{id:'mash',title:'רגע היסטורי: המשרבייה',task:'מצאי בתמונה שלוש נקודות: אור, אוויר ופרטיות.',wide:true,
 text:'רגע היסטורי. בערים של צפון אפריקה והמזרח התיכון בנו חלון בולט מעץ מסורג, במקום זכוכית ותריס. קוראים לו משרבייה (Mashrabiya). דרכו נכנסים אור ואוויר, החום נשאר בחוץ, ומי שבפנים רואה את הרחוב בלי שיראו אותו.',
 mount(el,ctx){return spots(el,ctx,{kicker:'רגע היסטורי',title:'המשרבייה',lede:'רגע היסטורי. בערים של צפון אפריקה והמזרח התיכון בנו חלון בולט מעץ מסורג, במקום זכוכית ותריס. קוראים לו משרבייה (Mashrabiya). דרכו נכנסים אור ואוויר, החום נשאר בחוץ, ומי שבפנים רואה את הרחוב בלי שיראו אותו.',
  src:IMG.mash.src+'.jpg',alt:IMG.mash.alt,credit:MASH_CREDIT(),
  pts:[{x:43,y:27,name:'נקודה ראשונה',t:'אור: השמש עוברת דרך החורים הקטנים ונשברת לנקודות רכות.'},{x:56,y:49,name:'נקודה שנייה',t:'אוויר: אין זכוכית, ולכן הרוח עוברת ומקררת את החדר.'},{x:84,y:82,name:'נקודה שלישית',t:'פרטיות: מבחוץ רואים רק עץ. מבפנים רואים את כל הרחוב.'}]})}},

{id:'louvres',title:'מהמשרבייה לרפרפות',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'בווילה של היום עושות את העבודה הזו רפרפות: פסים דקים שמותקנים מחוץ לחלון. בצרפתית קוראים להן בריז-סולי (Brise-soleil), "שוברות שמש". הן עושות היום את מה שעשתה המשרבייה: עוצרות את החום ומכניסות אור רך, בפסים על הרצפה.',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,louvreSvg(false),louvreSvg(true),'בלי רפרפות','עם רפרפות')),
   copy('מאז ועד היום','מהמשרבייה לרפרפות','בווילה של היום עושות את העבודה הזו רפרפות: פסים דקים שמותקנים מחוץ לחלון. בצרפתית קוראים להן בריז-סולי (Brise-soleil), "שוברות שמש". הן עושות היום את מה שעשתה המשרבייה: עוצרות את החום ומכניסות אור רך, בפסים על הרצפה.')));
 }},

{id:'patio',title:'הפטיו',task:'לחצי על המקום בתוכנית שבו היית שמה פטיו.',wide:true,
 text:'יש וילות שמכניסות את האור מבפנים. במרכז הבית יש חצר פתוחה לשמיים, פטיו (Patio), והחדרים סביבה. את הרעיון פגשת במפגש 1, בבית פנסה שבפומפיי, שבו החדרים הקיפו את החצר. אותו רעיון עתיק, בלב וילה ישראלית.',
 mount(el,ctx){
  const res=h('div');
  const Z=[['c',50,50,'מרכז הבית'],['n',50,18,'קצה עליון'],['s',50,82,'קצה תחתון'],['e',84,50,'קצה ימני'],['w',16,50,'קצה שמאלי']];
  const box=h('div',{class:'s3-draw s3-plan',html:patioPlan()});
  Z.forEach(([k,x,y,t])=>{const b=h('button',{type:'button',class:'s3-zone'+(ctx.data.pick===k?' on':'')+(k==='c'?' c':''),style:`left:${x}%;top:${y}%`,'aria-label':t});
    b.addEventListener('click',()=>{ctx.data.pick=k;if(k==='c')ctx.data.ok=true;ctx.save();box.querySelectorAll('.s3-zone').forEach(z=>z.classList.toggle('on',z===b));fb()});box.append(b)});
  function fb(){if(!ctx.data.pick)return;if(ctx.data.pick==='c'){box.classList.add('lit');sayBox(res,'<b>בדיוק.</b> מכאן האור מגיע לכל החדרים, ולכל חדר יש חלון אל הירוק.');ctx.done()}
    else{box.classList.remove('lit');sayBox(res,'כאן הפטיו מאיר רק חדר אחד. נסי מקום שכל החדרים נוגעים בו.')}}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
   copy('מבפנים','הפטיו','יש וילות שמכניסות את האור מבפנים. במרכז הבית יש חצר פתוחה לשמיים, פטיו (Patio), והחדרים סביבה. את הרעיון פגשת במפגש 1, בבית פנסה שבפומפיי, שבו החדרים הקיפו את החצר. אותו רעיון עתיק, בלב וילה ישראלית.',res)));
  fb();if(ctx.data.ok&&ctx.data.pick!=='c'){ctx.done()}
  return gate(ctx,!!ctx.data.ok);
 }},

/* יחידה 3 */
{id:'sun',title:'שחקי עם השמש',task:'בחרי שעה, כיוון ותריס, וראי מה קורה לאור.',wide:true,
 text:'יום קיץ בווילה. השמש זזה בשמיים, וכתם האור על הרצפה זז איתה. אדריכלים מתכננים כל חלון לפי השעה ולפי הכיוון שהוא פונה אליו.',
 mount(el,ctx){
  const d=ctx.data;d.t=d.t||'noon';d.d=d.d||'south';d.sh=d.sh||'open';const tried=d.tried||(d.tried={});
  const box=h('div',{class:'s3-draw s3-sim',html:simSvg()});box.append(illus());const meter=meterEl();const msg=h('div',{class:'say s3-msg',role:'status'});
  const ctr=h('div',{class:'s3-ctrls'});
  function draw(first){
   const r=sim10(d.t,d.d,d.sh);simApply(box,Object.assign({season:'summer'},r.st));setMeter(meter,r.lvl);msg.textContent=r.msg;
   ctr.replaceChildren(
    chipRow('שעה',[['morning','בוקר'],['noon','צהריים'],['afternoon','אחר הצהריים']],d.t,k=>{d.t=k;upd()}),
    chipRow('כיוון',[['south','דרום'],['west','מערב']],d.d,k=>{d.d=k;tried[k]=1;upd()}),
    chipRow('תריס',[['open','פתוח'],['half','חצי'],['closed','סגור']],d.sh,k=>{d.sh=k;if(k!=='open')tried.shutter=1;upd()}));
   if(tried.south&&tried.west&&tried.shutter)ctx.done();
  }
  function upd(){ctx.save();draw()}
  tried[d.d]=1;
  el.append(head('רגע WOW','שחקי עם השמש','יום קיץ בווילה. השמש זזה בשמיים, וכתם האור על הרצפה זז איתה. אדריכלים מתכננים כל חלון לפי השעה ולפי הכיוון שהוא פונה אליו.'),
   h('div',{class:'s3-simwrap'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},meter,ctr,msg)));
  draw(true);
  return gate(ctx,!!(tried.south&&tried.west&&tried.shutter));
 }},

{id:'tasks',title:'שלוש משימות',task:'בחרי את הפתרון שמתאים למשימה.',wide:true,
 text:'שלוש משימות של אדריכלים, בעונות ובשעות שונות. אחת האפשרויות היא גגון (Overhang): גג קטן שבולט מעל החלון.',
 mount(el,ctx){
  const d=ctx.data;const solved=d.solved||(d.solved={});let n=d.n||1;
  const T={
   1:{tag:'קיץ, צהריים',sit:'קיץ, צהריים, חלון דרומי. הסלון חם מדי, ובעלי הבית רוצים צל בלי לוותר על הנוף.',base:{front:true,el:72,season:'summer',time:'noon',tag:'חלון דרומי'},
      opts:[['overhang','גגון',1,'<b>בדיוק.</b> השמש גבוהה ונעצרת על הגגון. הסלון בצל, והנוף נשאר פתוח.',{shade:'overhang'}],
            ['shutter','תריס',0,'הסלון בצל, אבל גם חשוך, והנוף נעלם. נסי פתרון שנמצא רק מעל החלון.',{shutter:'closed'}],
            ['pergola','פרגולה עם גפן',0,'הפרגולה מצלה, אבל העלים מסתירים חלק מהנוף. נסי פתרון שנמצא רק מעל החלון.',{shade:'pergola',k:.5}]]},
   2:{tag:'חורף, צהריים',sit:'חורף, צהריים, אותו חלון ואותו גגון. בחוץ קר. מה יקרה לסלון?',base:{front:true,el:72,season:'winter',time:'noon',shade:'overhang',tag:'חלון דרומי'},
      opts:[['in','השמש תיכנס מתחת לגגון ותחמם',1],['shade','הסלון יישאר בצל וקר',0]]},
   3:{tag:'קיץ, אחר הצהריים',sit:'קיץ, אחר הצהריים, חלון מערבי. השמש נמוכה וחמה, ובעלי הבית רוצים לשבת בסלון.',base:{front:true,el:17,season:'summer',time:'afternoon',tag:'חלון מערבי'},
      opts:[['overhang','גגון',0,'השמש נמוכה ועוברת מתחת לגגון. נסי פתרון שעומד מול החלון.',{shade:'overhang'}],
            ['pergola','פרגולה עם גפן',0,'הגפן עוזרת, אבל לא מספיק. השמש הנמוכה עוד מגיעה לספה.',{shade:'pergola',k:.6}],
            ['louvres','רפרפות',1,'<b>בדיוק.</b> השמש הנמוכה מגיעה מהצד, ורק מה שעומד מול החלון עוצר אותה.',{shade:'louvres',k:.5}],
            ['shutter','תריס',1,'<b>בדיוק.</b> השמש הנמוכה מגיעה מהצד, ורק מה שעומד מול החלון עוצר אותה.',{shutter:'half'}]]}};
  const W2='בחורף השמש נמוכה ועוברת מתחת לגגון. אותו גגון מצל בקיץ ומחמם בחורף.';
  const box=h('div',{class:'s3-draw s3-sim',html:simSvg()});box.append(illus());
  const tabs=h('div',{class:'s3-tabs',role:'group','aria-label':'שלוש המשימות'});const panel=h('div',{class:'s3-panel'});const res=h('div');
  function render(){
   tabs.replaceChildren(...[1,2,3].map(i=>h('button',{type:'button','aria-pressed':String(n===i),class:solved[i]?'ok':'',onclick:()=>{n=i;d.n=i;ctx.save();render()}},'משימה '+i+(solved[i]?' ✓':''))));
   const t=T[n];const pick=(d.pick||{})[n];
   let st=Object.assign({},t.base);
   if(n===2){if(pick)st.el=35}else if(pick){const o=t.opts.find(x=>x[0]===pick);Object.assign(st,o[4])}
   simApply(box,st);
   const cut=t.sit.indexOf('.')+1;
   panel.replaceChildren(h('p',{class:'s3-sit'},h('b',null,t.sit.slice(0,cut)),t.sit.slice(cut)),
    h('div',{class:'chips s3-opts',role:'group','aria-label':'פתרונות'},...t.opts.map(o=>h('button',{type:'button','aria-pressed':String(pick===o[0]),class:pick===o[0]&&o[2]?'right':'',onclick:()=>choose(o)},o[1]))));
   res.replaceChildren();
   if(pick){const o=t.opts.find(x=>x[0]===pick);
    if(n===2)sayBox(res,(o[2]?'':'<b>כמעט. תראי מה קורה:</b> ')+W2);else sayBox(res,o[3]);}
   if(solved[1]&&solved[2]&&solved[3]){const b=res.querySelector('.say');if(b)b.append(h('div',{class:'s3-winline'},nameFill('חשבת כמו אדריכלית, {name}.')));ctx.done()}
   else if(solved[n]){const nx=[1,2,3].find(i=>!solved[i]);res.append(h('div',{class:'row',style:'margin-top:10px'},h('button',{class:'btn solid',type:'button',onclick:()=>{n=nx;d.n=nx;ctx.save();render()}},'למשימה '+nx)))}
  }
  function choose(o){(d.pick||(d.pick={}))[n]=o[0];if(n===2||o[2])solved[n]=1;ctx.save();render()}
  el.append(head('המשימה','שלוש משימות','שלוש משימות של אדריכלים, בעונות ובשעות שונות. אחת האפשרויות היא גגון (Overhang): גג קטן שבולט מעל החלון.'),
   h('div',{class:'s3-simwrap'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},tabs,panel,res)));
  render();
  return gate(ctx,!!(solved[1]&&solved[2]&&solved[3]));
 }},

{id:'rules',title:'מה למדנו מהשמש',task:'לחצי על כל אחד מהחלונות.',wide:true,
 text:'שני כללים שאדריכלים זוכרים, ומעכשיו גם את.',
 mount(el,ctx){
  const seen=ctx.data.seen||(ctx.data.seen={});const res=h('div');
  const M={south:'<b>דרום:</b> גגון קטן מעל החלון. בקיץ הוא מצל, ובחורף הוא נותן לשמש להיכנס.',west:'<b>מערב:</b> אחר הצהריים השמש מגיעה נמוכה. עוצרים אותה מול החלון, ברפרפות או בתריס.'};
  const card=(k,t,s)=>{const b=h('button',{type:'button',class:'s3-win-btn'+(seen[k]?' on':''),'aria-label':t},h('span',{class:'s3-draw',html:s}),h('span',{class:'nm'},t));
    b.addEventListener('click',()=>{seen[k]=1;ctx.save();b.classList.add('on');show()});return b};
  function show(){res.replaceChildren(...['south','west'].filter(k=>seen[k]).map(k=>h('div',{class:'say',html:M[k]})));if(seen.south&&seen.west)ctx.done()}
  el.append(head('שני כללים','מה למדנו מהשמש','שני כללים שאדריכלים זוכרים, ומעכשיו גם את.'),
   h('div',{class:'s3-rules'},h('div',{class:'s3-two'},card('south','חלון דרומי',winSouth()),card('west','חלון מערבי',winWest())),h('div',null,res)),h('div',{class:'note'},'המחשה'));
  show();
  return gate(ctx,!!(seen.south&&seen.west));
 }},

/* יחידה 4 */
{id:'floors',title:'הכול בקומה אחת',task:'לחצי על חדר, ואז על הקומה שבה תשימי אותו.',wide:true,
 text:'רעיון של יוקרה: כל מה שאוהבים ביום-יום נמצא בקומה אחת, צעד מהגינה. בווילות רבות מתכננים כך את קומת הכניסה. סוויטת הורים (Master Suite): חדר שינה עם חדר רחצה וחדר ארונות צמודים.',
 mount(el,ctx){
  const place=ctx.data.place||(ctx.data.place={});let pick=null;const res=h('div');
  const R=[['salon','סלון'],['kitchen','מטבח'],['suite','סוויטת ההורים'],['kids','חדרי הילדים'],['guest','חדר אורחים'],['study','חדר עבודה']];
  const pool=h('div',{class:'chips s3-rooms',role:'group','aria-label':'החדרים'});
  const box=h('div',{class:'s3-draw s3-house',html:floorsSvg()});box.append(illus());
  const fl={up:h('button',{type:'button',class:'s3-floor up','aria-label':'הקומה העליונה'}),down:h('button',{type:'button',class:'s3-floor down','aria-label':'קומת הכניסה'})};
  for(const k of ['up','down']){fl[k].addEventListener('click',()=>drop(k));box.append(fl[k])}
  function msg(r,k){if(r==='suite')return k==='down'?'כל בוקר מתחיל בצעד אחד מהמיטה לגינה. זו היוקרה האמיתית.':'גם ככה יפה, עם נוף מלמעלה. רק שהגינה רחוקה יותר מהבוקר שלך.';
    if((r==='salon'||r==='kitchen')&&k==='up')return 'אפשר גם ככה. רק שהגינה תהיה רחוקה מהחיים של כל יום.';return ''}
  function drop(k){if(!pick)return;place[pick]=k;const m=msg(pick,k);pick=null;ctx.save();draw();if(m)sayBox(res,m);else res.querySelectorAll('.say').forEach(x=>x.remove());fin()}
  function draw(){
   pool.replaceChildren(...R.map(([k,t])=>h('button',{type:'button','aria-pressed':String(pick===k),class:place[k]?'placed':'',onclick:()=>{pick=pick===k?null:k;draw()}},t,place[k]?h('span',{class:'tagf'},place[k]==='down'?' · כניסה':' · עליונה'):null)));
   for(const k of ['up','down'])fl[k].replaceChildren(h('span',{class:'fl-nm'},k==='up'?'הקומה העליונה':'קומת הכניסה'),h('span',{class:'fl-in'},...R.filter(r=>place[r[0]]===k).map(r=>h('span',{class:'s3-chip'},r[1]))));
   box.classList.toggle('picking',!!pick);
  }
  function fin(){if(R.every(r=>place[r[0]]))ctx.done()}
  el.append(head('הסוד הרביעי','הכול בקומה אחת','רעיון של יוקרה: כל מה שאוהבים ביום-יום נמצא בקומה אחת, צעד מהגינה. בווילות רבות מתכננים כך את קומת הכניסה.'),
   h('div',{class:'s3-simwrap'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},h('p',{class:'s3-term'},h('b',null,'סוויטת הורים (Master Suite): '),'חדר שינה עם חדר רחצה וחדר ארונות צמודים.'),pool,res)));
  draw();
  return gate(ctx,R.every(r=>place[r[0]]));
 }},

{id:'living',title:'תמונה חיה',task:'החליפי בין יום לערב.',wide:true,
 text:'עץ נכון מול החלון הוא התמונה היפה ביותר בסלון. כאן עץ זית ובריכת השתקפות (Reflecting Pool): בריכה רדודה ושקטה, שהמים בה כמו מראה.',
 mount(el,ctx){
  const res=h('div');const cur=ctx.data.cur||'day';
  const box=h('div',{class:'s2-pic s2-fade'},pic('villa','lg',{class:'lay'+(cur==='day'?' on':''),'data-k':'day'}),pic('eve','lg',{class:'lay'+(cur==='eve'?' on':''),'data-k':'eve'}),aiTag());
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':'יום או ערב'},...[['day','יום'],['eve','ערב']].map(([k,t])=>h('button',{type:'button','data-k':k,'aria-pressed':String(cur===k),onclick:()=>show(k)},t)));
  function show(k){ctx.data.cur=k;if(k==='eve')ctx.data.eve=true;ctx.save();
   box.querySelectorAll('.lay').forEach(i=>i.classList.toggle('on',i.dataset.k===k));btns.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));
   if(k==='eve'){sayBox(res,'בערב אור קטן בגינה מאיר את הזית, והבריכה מחזירה את אור הבית. על אור כזה נלמד במפגש הבא.')}else res.replaceChildren();
   if(ctx.data.eve)ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),
   copy('הנוף מהסלון','תמונה חיה','עץ נכון מול החלון הוא התמונה היפה ביותר בסלון. כאן עץ זית ובריכת השתקפות (Reflecting Pool): בריכה רדודה ושקטה, שהמים בה כמו מראה.',res)));
  if(cur==='eve')show('eve');
  return gate(ctx,!!ctx.data.eve);
 }},

{id:'facade',title:'המשימה',task:'בחרי קיר, צל, ריצוף וצמח, וראי את החזית נבנית.',wide:true,
 text:'בעלי וילה בהרצליה רוצים סלון מול הים והשקיעה, כלומר חלון מערבי. הם מבקשים נוף, בלי החום של אחר הצהריים. את מעצבת את החזית.',
 mount(el,ctx){
  const f=ctx.data.f||(ctx.data.f={});const res=h('div');
  const box=h('div',{class:'s3-draw s3-facade'});const ctr=h('div',{class:'s3-ctrls'});
  const ok=()=>!!(f.wall&&f.shade&&f.floor&&f.plant);
  function draw(){box.innerHTML=facadeSvg(f,false);box.append(illus());
   ctr.replaceChildren(chipRow('קיר',WALL,f.wall,k=>pick('wall',k)),chipRow('צל',SHADE,f.shade,k=>pick('shade',k)),chipRow('ריצוף',FLOOR,f.floor,k=>pick('floor',k)),chipRow('צמח מול החלון',PLANT,f.plant,k=>pick('plant',k)));
   if(ok())ctx.done()}
  function pick(g,k){f[g]=k;ctx.save();draw();
   if(g==='wall'){const w=WALL.find(x=>x[0]===k);sayBox(res,'<b>'+w[1]+'</b>'+(k==='stone'?' (אבן בצורתה הטבעית, לא מסותתת לריבועים)':'')+': '+w[2])}
   if(g==='shade')sayBox(res,SHADE.find(x=>x[0]===k)[2]);
   if(g==='floor'){const x=FLOOR.find(x=>x[0]===k);sayBox(res,'<b>'+(k==='same'?'ריצוף ממשיך':'ריצוף שונה')+':</b> '+x[2])}
   if(g==='plant'){const x=PLANT.find(x=>x[0]===k);sayBox(res,'<b>'+x[1]+':</b> '+x[2])}}
  el.append(head('המשימה','החזית בהרצליה','בעלי וילה בהרצליה רוצים סלון מול הים והשקיעה, כלומר חלון מערבי. הם מבקשים נוף, בלי החום של אחר הצהריים. את מעצבת את החזית.'),
   h('div',{class:'s3-simwrap'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},ctr,res)));
  draw();
  return gate(ctx,ok());
 }},

{id:'myfacade',title:'החזית שלך',task:'שמרי את החזית במחברת.',wide:true,
 text:'ככה החזית שלך נראית בשקיעה, {name}. כל מה שלמדת היום נמצא בה: חומר, צל, אור וירוק.',
 mount(el,ctx){
  const f=((ctx.all.facade||{}).f)||{};const res=h('div');
  if(!(f.wall&&f.shade&&f.floor&&f.plant)){el.append(h('div',{class:'center'},h('div',null,h('h2',null,'החזית שלך'),h('p',{class:'lede'},'החזית עוד לא מוכנה. חזרי מסך אחד אחורה והשלימי אותה.'))));return gate(ctx,false)}
  const text='קיר '+nm(WALL,f.wall)+', צל '+nm(SHADE,f.shade)+', ריצוף '+(f.floor==='same'?'ממשיך מהסלון למרפסת':'שונה')+', מול החלון '+nm(PLANT,f.plant)+'.';
  const box=h('div',{class:'s3-draw s3-facade sunset',html:facadeSvg(f,true)});box.append(illus());
  const btn=h('button',{class:'cta',type:'button',onclick:()=>{
    const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='facade3'&&n.session===3);
    if(old){old.facade=JSON.parse(JSON.stringify(f));old.text=text;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:'facade3',svg:true,title:'החזית שלי בהרצליה',facade:JSON.parse(JSON.stringify(f)),text});
    ctx.data.saved=true;ctx.save();sayBox(res,'<b>נשמר במחברת שלך.</b>');ctx.done()}},'שמרי במחברת');
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
   copy('בשקיעה','החזית שלך',nameFill('ככה החזית שלך נראית בשקיעה, {name}. כל מה שלמדת היום נמצא בה: חומר, צל, אור וירוק.'),h('p',{class:'s3-sum'},text),h('div',{class:'row',style:'margin-top:12px'},btn),res)));
  if(ctx.data.saved)sayBox(res,'<b>נשמר במחברת שלך.</b>');
  return gate(ctx,!!ctx.data.saved);
 }},

/* יחידה 5 */
{id:'check1',title:'בדיקה 1',task:'בחרי את התשובה הנכונה.',wide:true,
 say:sayOf('ארבע שאלות קצרות על מה שראית היום. מה עוזר לסלון להיראות גדול יותר?',[['אותו ריצוף בסלון ובמרפסת'],['קירות כהים'],['וילונות כבדים'],['רהיטים גבוהים']]),
 mount(el,ctx){const v=h('div',{class:'s3-draw',html:indoorOutdoor(true)});v.append(illus());
  return quiz(el,ctx,{kicker:'בדיקה 1',lede:'ארבע שאלות קצרות על מה שראית היום.',q:'מה עוזר לסלון להיראות גדול יותר?',visual:v,
  opts:[['אותו ריצוף בסלון ובמרפסת',1],['קירות כהים',0],['וילונות כבדים',0],['רהיטים גבוהים',0]],
  hint:'חשבי על הגבול בין הסלון למרפסת.',right:'<b>נכון.</b> העין לא נעצרת בגבול, והסלון נראה גדול יותר.'})}},

{id:'check2',title:'בדיקה 2',task:'בחרי את התשובה הנכונה.',wide:true,
 say:sayOf('חורף, צהריים, חלון דרומי עם גגון. מה קורה לסלון?',[['השמש הנמוכה נכנסת מתחת לגגון ומחממת'],['הגגון עוצר את השמש, והסלון נשאר קר'],['בחורף השמש לא מגיעה לחלון דרומי'],['השמש נכנסת רק בבוקר']]),
 mount(el,ctx){const box=h('div',{class:'s3-draw s3-sim',html:simSvg()});box.append(illus());
  simApply(box,{front:false,side:'top',shade:'overhang',season:'winter',time:'noon',tag:'חלון דרומי'});
  return quiz(el,ctx,{kicker:'בדיקה 2',q:'חורף, צהריים, חלון דרומי עם גגון. מה קורה לסלון?',visual:box,
  opts:[['השמש הנמוכה נכנסת מתחת לגגון ומחממת',1],['הגגון עוצר את השמש, והסלון נשאר קר',0],['בחורף השמש לא מגיעה לחלון דרומי',0],['השמש נכנסת רק בבוקר',0]],
  hint:'חשבי איפה השמש בשמיים בחורף.',right:'<b>בדיוק.</b> אותו גגון מצל בקיץ ומחמם בחורף.',
  onRight:(inst)=>{const go=()=>simApply(box,{front:true,el:35,shade:'overhang',season:'winter',time:'noon',tag:'חלון דרומי'});if(inst)go();else setTimeout(go,60)}})}},

{id:'check3',title:'בדיקה 3',task:'בחרי את התשובה הנכונה.',wide:true,
 say:sayOf('בשביל מה בנו את המשרבייה?',[['להכניס אור ואוויר, ולהשאיר את החום בחוץ'],['רק לקישוט'],['לשמור מפני הגשם'],['לתלות עליה עציצים']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 3',q:'בשביל מה בנו את המשרבייה?',
  visual:h('div',null,h('div',{class:'s2-pic'},pic('mash','lg')),h('div',{class:'note s2-cap'},MASH_CREDIT())),
  opts:[['להכניס אור ואוויר, ולהשאיר את החום בחוץ',1],['רק לקישוט',0],['לשמור מפני הגשם',0],['לתלות עליה עציצים',0]],
  hint:'חשבי מה עובר דרך החורים הקטנים בעץ.',right:'<b>נכון.</b> ומי שבפנים רואה את הרחוב, בלי שיראו אותו.'})}},

{id:'check4',title:'בדיקה 4',task:'בחרי את התשובה הנכונה.',wide:true,
 say:sayOf('מה מיוחד במראה של ירושלים?',[['כל הבניינים מחופים באבן'],['כל הבניינים מטויחים בלבן'],['כל הבניינים מזכוכית'],['כל הבניינים מעץ']]),
 mount(el,ctx){const v=h('div',{class:'s3-draw',html:jlmSvg()});v.append(illus());
  return quiz(el,ctx,{kicker:'בדיקה 4',q:'מה מיוחד במראה של ירושלים?',visual:v,
  opts:[['כל הבניינים מחופים באבן',1],['כל הבניינים מטויחים בלבן',0],['כל הבניינים מזכוכית',0],['כל הבניינים מעץ',0]],
  hint:'חשבי על החוק מהתקופה שבה הבריטים שלטו בעיר.',right:'<b>נכון.</b> החוק בתוקף עד היום, ולכן העיר כולה בגוון אחד, בהיר וחם.'})}},

/* יחידה 6 */
{id:'home-idea',title:'רעיון לבית',task:'אם תרצי, כתבי שינוי קטן אחד ושמרי במחברת.',
 text:'רעיון לבית, למי שרוצה. באחר הצהריים שבי כמה דקות מול החלון הגדול אצלך. מתי השמש מגיעה אליו: בבוקר, בצהריים או אחר הצהריים? האור נעים או חזק מדי? ואם היית מוסיפה לו צל אחד, מה הוא היה?',
 mount(el,ctx){
  const res=h('div');const inp=h('input',{id:'s3idea',type:'text',maxlength:200,value:ctx.data.text||''});
  const save=()=>{const v=inp.value.trim();if(!v){inp.focus();return}ctx.data.text=v;
    const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='idea3'&&n.session===3);
    if(old){old.text=v;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:'idea3',title:'רעיון לבית, מפגש 3',text:v});ctx.save();sayBox(res,'<b>נשמר במחברת שלך.</b>')};
  el.append(h('div',{class:'split s3-idea'},h('div',{class:'s2-arch s3-arch-sm'},h('div',{class:'arch-back'}),h('div',{class:'frame'},pic('salon','lg'),aiTag())),
    h('div',{class:'copy'},h('span',{class:'kicker'},'כרטיס רשות'),h('h2',null,'רעיון לבית'),
      h('p',{class:'lede'},'רעיון לבית, למי שרוצה. באחר הצהריים שבי כמה דקות מול החלון הגדול אצלך. מתי השמש מגיעה אליו: בבוקר, בצהריים או אחר הצהריים? האור נעים או חזק מדי? ואם היית מוסיפה לו צל אחד, מה הוא היה?'),
      h('div',{class:'field'},h('label',{for:'s3idea'},'מה הייתי משנה בחלון שלי'),inp),
      h('div',{class:'row s3-inline',style:'margin-top:14px'},h('button',{class:'cta',type:'button',onclick:save},'שמרי במחברת'),h('button',{class:'btn',type:'button',onclick:ctx.next},'דלגי'),res))));
  if(ctx.data.text)sayBox(res,'<b>נשמר במחברת שלך.</b>');
  ctx.done();
 }},

{id:'summary',title:'סיכום',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',
 mount(el,ctx){
  const R=[['פנים וחוץ',indoorOutdoor(true),'פנים וחוץ הם מרחב אחד: אותו ריצוף, ודלתות זכוכית שנעלמות בתוך הקיר.'],
    ['את השמש מנהלים',svg('0 0 520 220',`<g transform="translate(0 0)">${winSouth().replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g><g transform="translate(260 0)">${winWest().replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g>`),'גגון מעל חלון דרומי, רפרפות או תריס מול המערב.'],
    ['אבן לצד זכוכית',null,'החומר הגס מדגיש את העדין.'],
    ['הכול בקומה אחת',floorsSvg(),'סלון, מטבח וסוויטת ההורים בקומה אחת, צעד מהגינה.']];
  const seen=ctx.data.seen||(ctx.data.seen={});
  const grid=h('div',{class:'cards s2-flips s3-flips'},...R.map(([t,s,d],i)=>{
    const front=s?h('span',{class:'s3-draw thumb',html:s}):h('span',{class:'thumb ph'},pic('villa','sm',{alt:''}),aiTag());
    const f=h('button',{type:'button',class:'flip'+(seen[i]?' on':''),'aria-label':t},h('div',{class:'in'},
      h('div',{class:'f'},front,h('div',{class:'q'},t)),h('div',{class:'b'},h('div',{class:'rule'},d))));
    f.addEventListener('click',()=>{f.classList.toggle('on');seen[i]=true;ctx.save();if(Object.keys(seen).length===4)ctx.done()});return f}));
  el.append(head('סיכום','ארבעה כללים','ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.'),grid);
  return gate(ctx,Object.keys(seen).length===4);
 }},

{id:'audio',title:'סקירה קולית',task:'לחצי על הנגן כדי לשמוע.',skip:()=>!audioOK,
 text:'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.',
 mount(el,ctx){
  el.append(h('div',{class:'center'},h('div',null,h('span',{class:'kicker'},'סקירה קולית'),h('h2',null,'סקירה קולית'),h('p',{class:'lede'},'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.'),
    h('audio',{controls:true,src:'assets/audio/s3.m4a',style:'width:min(640px,90vw)',onplay:ctx.done}))));
 }},

{id:'feedback',title:'משוב וגשר',task:'דרגי בלחיצה, ואם תרצי, כתבי גם כמה מילים.',wide:true,hideNext:true,
 say:'{name}, סיימת את מפגש 3. ניהלת את השמש, בנית חזית מול הים וחשבת כמו אדריכלית. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
 mount(el,ctx){
  window.Salon.finish(3);
  const f=Object.assign({content:'',visual:'',overall:'',text:'',sim:'',simWhy:''},(ctx.S.feedback||{})[3]||{});
  const W=['אהבתי מאוד','אהבתי','היה בסדר','פחות'];const res=h('div');
  const q=(key,lbl,opts)=>h('div',{class:'q'},h('b',null,lbl),h('div',{class:'chips sm',role:'group','aria-label':lbl},...opts.map(w=>h('button',{type:'button','aria-pressed':String(f[key]===w),
    onclick:e=>{f[key]=w;e.currentTarget.parentNode.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)))}},w))));
  const ta=h('textarea',{id:'fb3',maxlength:1500},f.text||'');const why=h('input',{id:'fb3why',type:'text',maxlength:300,value:f.simWhy||''});
  const saveIt=()=>{f.text=ta.value.trim();f.simWhy=why.value.trim();
    if(!f.content&&!f.visual&&!f.overall&&!f.text&&!f.sim&&!f.simWhy){ta.focus();return}
    window.Salon.setFeedback(3,{content:f.content,visual:f.visual,overall:f.overall,text:f.text,sim:f.sim,simWhy:f.simWhy});
    note.innerHTML='<b>תודה'+(ctx.name?', '+ctx.name:'')+'.</b> המשוב נשמר.';note.classList.add('s3-thanks')};
  const note=h('p',{class:'note',role:'status',style:'margin:8px 0 0'},'המשוב לא חובה. אפשר להמשיך גם בלעדיו.');
  const top=head('המשוב שלך','איך היה?',nameFill('{name}, סיימת את מפגש 3. ניהלת את השמש, בנית חזית מול הים וחשבת כמו אדריכלית. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.'));
  const fb=h('div',{class:'s2-fb'},
    h('div',{class:'rate'},q('content','התוכן',W),q('visual','המראה והתמונות',W),q('overall','החוויה בכלל',W),
    h('div',{class:'q s3-simq'},h('b',null,'סימולטור השמש היה ברור?'),h('div',{class:'chips sm',role:'group','aria-label':'סימולטור השמש היה ברור?'},...['ברור לגמרי','הבנתי אחרי כמה ניסיונות','הייתי צריכה הסבר נוסף'].map(w=>h('button',{type:'button','aria-pressed':String(f.sim===w),
      onclick:e=>{f.sim=w;e.currentTarget.parentNode.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)))}},w))))),
    h('div',{class:'s2-two'},
      h('div',{class:'field',style:'max-width:none'},h('label',{for:'fb3'},'מה עוד תרצי לספר? מה אהבת, ומה היית משנה?'),ta),
      h('div',{class:'field',style:'max-width:none'},h('label',{for:'fb3why'},'רוצה לכתוב מה היה עוזר?'),why)));
  const bridge=h('aside',{class:'s2-bridge s3-bridge'},h('div',{class:'ph'},pic('eve','sm'),aiTag()),
      h('div',null,h('span',{class:'kicker'},'מפגש 4'),h('p',null,'במפגש הבא: תאורה. אחרי שלמדת לנהל את אור השמש, תלמדי לבנות אור משלך. תדליקי, תעמעמי ותחממי את האור, ותראי איך הסלון משנה אופי.')));
  const side=h('div',{class:'s2-fb'},bridge,
    note,
    h('div',{class:'row',style:'margin-top:8px'},h('button',{class:'cta',type:'button',onclick:saveIt},'שמרי משוב'),h('button',{class:'btn',type:'button',onclick:()=>window.Salon.goHome()},'למסך הבית')));
  el.append(top,h('div',{class:'s2-end'},fb,side));
  ctx.done();
 }}
];

window.Salon.register(3,screens);
})();
