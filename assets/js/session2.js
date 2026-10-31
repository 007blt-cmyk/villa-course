/* הסלון של מזל · מפגש 2: קפלים בזמן
   בלוק נתונים ורכיבים של המפגש. לא נוגע במנוע ולא במפגש 1. */
(function(){
'use strict';
const {h}=window.Salon;

/* ---------- מדיה ---------- */
const IMG={
  classic:{src:'assets/img/s2-classic',alt:'סלון שמנת וזהב עם עמודים מעוטרים, נברשת קריסטל וארבע כורסאות בזוגות.',ai:true},
  deco:{src:'assets/img/s2-deco',alt:'אותו סלון עם ספה מקטיפה ירוקה, פרטי פליז, נברשת מדורגת ושטיח גאומטרי.',ai:true},
  bauhaus:{src:'assets/img/s2-bauhaus',alt:'אותו סלון בלבן, עם כורסאות מצינור פלדה, שולחן זכוכית ושטיח עם כתמי אדום, צהוב וכחול.',ai:true},
  today:{src:'assets/img/s2-today',alt:'אותו סלון, עם מראת שמש מפליז על הקיר, כריות קטיפה ירוקות על הספה ושולחן עם מסגרת פליז.',ai:true},
  white:{src:'assets/img/s2-white-city',alt:'בניין לבן בתל אביב עם פינה מעוגלת, שני חלונות עגולים ומרפסת גג מעוגלת.'},
  bridge:{src:'assets/img/s2-bridge',alt:'סלון וילה פתוח אל הגן, ופסי אור ושמש נופלים על הרצפה דרך פרגולה.',ai:true}
};
const ALT_BEFORE='סלון לבן ונקי עם כורסאות מצינור פלדה ושולחן זכוכית.';
const U=(id,w,hh)=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${hh}&q=78`;
const DECO_PHOTO={src:U('1651667349561-2d9c75e62580',1200,800),alt:'גרם מדרגות בסגנון אר-דקו, עם מעקה מתכת בקשתות, מנורת קיר מבריקה וחלון צר',by:'henry perks'};
const CHAIRS_PHOTO={src:U('1768726455579-ee29777cbdac',1200,800),alt:'שני כיסאות עם מסגרת כרום, ואחד מהם עם ריפוד מפוספס',by:'Bernd Dittrich'};
const LOTUS={src:'https://collectionapi.metmuseum.org/api/collection/v1/iiif/548339/2298308/main-image',
  alt:'גביע כחול בצורת פרח לוטוס',cap:'גביע בצורת פרח לוטוס, מצרים, בערך 945 עד 664 לפנה"ס. המוזיאון המטרופוליטני, נחלת הכלל (26.7.971)'};
let audioOK=false;
fetch('assets/audio/s2.m4a',{method:'HEAD'}).then(r=>{audioOK=r.ok}).catch(()=>{});

function pic(key,size,extra){const m=IMG[key];return h('img',Object.assign({src:m.src+(size==='sm'?'-sm':'')+'.jpg',alt:m.alt,decoding:'async'},extra||{}))}
const aiTag=()=>h('span',{class:'ai-tag'},'הדמיה');

/* ---------- עזרים ---------- */
function sayBox(parent,html){parent.querySelectorAll('.say').forEach(x=>x.remove());const b=h('div',{class:'say',role:'status',html});parent.append(b);
  setTimeout(()=>{try{b.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){}},60);return b}
function head(kicker,title,text){return h('div',{class:'head'},h('div',null,kicker?h('span',{class:'kicker'},kicker):null,h('h2',null,title),text?h('p',{class:'lede'},text):null))}
function headWide(kicker,title,text){return h('div',{class:'head s2-head'},h('div',null,kicker?h('span',{class:'kicker'},kicker):null,h('h2',null,title)),text?h('p',{class:'lede'},text):null)}
function copy(kicker,title,text,...more){return h('div',{class:'copy'},kicker?h('span',{class:'kicker'},kicker):null,h('h2',null,title),text?h('p',{class:'lede'},text):null,...more)}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
/* "הבא" נפתח רק אחרי סיום המשימה. מוחזר כפונקציית ניקוי, כדי שהמסך הבא יקבל כפתור פתוח */
function gate(ctx,isDone){const nx=document.querySelector('.nav .next');if(nx&&!isDone)nx.disabled=true;
  const d=ctx.done;ctx.done=()=>{if(nx)nx.disabled=false;d()};if(isDone)d();
  return ()=>{if(nx)nx.disabled=false}}
function label(s){const i=s.indexOf(':');return i<0?h('span',null,s):h('span',null,h('b',null,s.slice(0,i)+':'),s.slice(i+1))}

/* ---------- ציורים בקוד ---------- */
const C={ink:'#1A3A35',lead:'#14474A',terra:'#C65A3C',mustard:'#E0A63A',sage:'#9DB39A',paper:'#F7F0E4',brass:'#C9A24B',red:'#C8372D',blue:'#2B5BA8',yellow:'#F2C230'};
function svg(vb,inner,extra){return '<svg viewBox="'+vb+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" '+(extra||'')+'>'+inner+'</svg>'}
const ART={
  capital:svg('0 0 120 120',`<rect x="22" y="18" width="76" height="10" rx="2" fill="${C.brass}"/><path d="M30 28c-14 0-16 18-2 18 8 0 8-10 1-10M90 28c14 0 16 18 2 18-8 0-8-10-1-10" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><path d="M34 30h52l-6 20H40z" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/><path d="M48 34c4 8 4 12 0 16M60 33v17M72 34c-4 8-4 12 0 16" stroke="${C.sage}" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="40" y="50" width="40" height="62" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/><path d="M50 54v54M60 54v54M70 54v54" stroke="${C.ink}" stroke-width="2" opacity=".45"/>`),
  chandelier:svg('0 0 120 120',`<path d="M60 6v24" stroke="${C.ink}" stroke-width="3"/><circle cx="60" cy="34" r="7" fill="${C.brass}"/><path d="M60 38c-30 0-40 14-40 14M60 38c30 0 40 14 40 14M60 40c-14 6-20 20-20 20M60 40c14 6 20 20 20 20" fill="none" stroke="${C.brass}" stroke-width="4" stroke-linecap="round"/>${[20,40,60,80,100].map((x,i)=>`<path d="M${x} ${i%2?62:54}l-5 12 5 12 5-12z" fill="#DCEBF2" stroke="${C.lead}" stroke-width="2"/><circle cx="${x}" cy="${(i%2?62:54)+30}" r="4" fill="#DCEBF2" stroke="${C.lead}" stroke-width="2"/>`).join('')}<path d="M52 70l-4 14 12 16 12-16-4-14z" fill="#DCEBF2" stroke="${C.lead}" stroke-width="2"/>`),
  pair:svg('0 0 120 120',`<g id="ch"><path d="M10 40c0-12 26-12 26 0v34H10z" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/><rect x="6" y="64" width="38" height="16" rx="6" fill="${C.sage}" stroke="${C.ink}" stroke-width="3"/><path d="M12 80l-2 18M40 80l2 18" stroke="${C.brass}" stroke-width="4" stroke-linecap="round"/><path d="M6 64c-4-10 6-12 6-2M44 64c4-10-6-12-6-2" fill="none" stroke="${C.brass}" stroke-width="3"/></g><use href="#ch" transform="translate(120 0) scale(-1 1)"/><path d="M60 30v76" stroke="${C.terra}" stroke-width="2" stroke-dasharray="5 5"/>`),
  sunburst:svg('0 0 120 120',`${Array.from({length:24},(_,i)=>{const a=i*15*Math.PI/180,r1=26,r2=i%2?48:56;return `<path d="M${60+r1*Math.cos(a)} ${60+r1*Math.sin(a)}L${60+r2*Math.cos(a)} ${60+r2*Math.sin(a)}" stroke="${C.brass}" stroke-width="${i%2?3:5}" stroke-linecap="round"/>`}).join('')}<circle cx="60" cy="60" r="26" fill="${C.brass}"/><circle cx="60" cy="60" r="20" fill="#DCEBF2" stroke="${C.ink}" stroke-width="2"/><path d="M50 52l10-6" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`),
  zigzag:svg('0 0 120 120',`<rect x="6" y="40" width="108" height="40" rx="4" fill="${C.lead}"/><path d="M10 72l12-24 12 24 12-24 12 24 12-24 12 24 12-24 12 24" fill="none" stroke="${C.brass}" stroke-width="5" stroke-linejoin="round"/><rect x="6" y="40" width="108" height="40" rx="4" fill="none" stroke="${C.ink}" stroke-width="3"/>`),
  scarab:svg('0 0 120 120',`<path d="M54 52C30 30 8 34 4 44c14 2 30 6 48 18zM66 52c24-22 46-18 50-8-14 2-30 6-48 18z" fill="${C.lead}" stroke="${C.brass}" stroke-width="3"/><path d="M8 50c12 4 26 10 40 16M112 50c-12 4-26 10-40 16" stroke="${C.mustard}" stroke-width="2" fill="none"/><ellipse cx="60" cy="68" rx="15" ry="22" fill="${C.terra}" stroke="${C.brass}" stroke-width="3"/><path d="M60 48v42" stroke="${C.brass}" stroke-width="2"/><circle cx="60" cy="42" r="8" fill="${C.brass}"/><path d="M50 88l-6 12M70 88l6 12M46 72l-12 6M74 72l12 6" stroke="${C.brass}" stroke-width="3" stroke-linecap="round"/>`),
  tubechair:svg('0 0 120 120',`<path d="M30 14h40v58M30 14v40c0 10 4 18 12 18h44c8 0 10 6 10 12v20H24" fill="none" stroke="#9AA3A8" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><path d="M30 14h40v58M30 14v40c0 10 4 18 12 18h44c8 0 10 6 10 12v20H24" fill="none" stroke="#E8EDEF" stroke-width="2" stroke-linejoin="round"/><rect x="34" y="20" width="32" height="36" fill="${C.ink}" opacity=".85"/><rect x="44" y="60" width="44" height="10" fill="${C.ink}" opacity=".85"/>`),
  lamp:svg('0 0 120 120',`<ellipse cx="60" cy="106" rx="26" ry="7" fill="${C.ink}"/><path d="M60 104V56l26-22" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M70 22l30 26-12 6-26-20z" fill="${C.mustard}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`),
  squares:svg('0 0 120 120',`<rect x="10" y="10" width="100" height="100" fill="#fff"/><rect x="10" y="10" width="56" height="56" fill="${C.red}"/><rect x="74" y="74" width="36" height="36" fill="${C.blue}"/><rect x="74" y="10" width="36" height="30" fill="${C.yellow}"/><path d="M66 10v100M10 66h100M74 40h36M74 74v36" stroke="#111" stroke-width="6"/><rect x="10" y="10" width="100" height="100" fill="none" stroke="#111" stroke-width="6"/>`),
  lotus:svg('0 0 120 120',`<path d="M60 18c10 14 12 40 0 64-12-24-10-50 0-64z" fill="#4C8FB0" stroke="${C.ink}" stroke-width="3"/><path d="M60 82C44 70 30 50 32 30c14 6 24 26 28 52zM60 82c16-12 30-32 28-52-14 6-24 26-28 52z" fill="#6FAFCB" stroke="${C.ink}" stroke-width="3"/><path d="M60 82C40 80 20 66 14 50c18 0 34 14 46 32zM60 82c20-2 40-16 46-32-18 0-34 14-46 32z" fill="${C.sage}" stroke="${C.ink}" stroke-width="3"/><path d="M60 82v26" stroke="${C.lead}" stroke-width="5"/>`),
  pyramid:svg('0 0 120 120',`<path d="M60 16L108 100H12z" fill="${C.mustard}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M60 16l12 84" stroke="${C.ink}" stroke-width="2" fill="none"/><path d="M60 16l12 84H108z" fill="${C.terra}" opacity=".45"/><path d="M30 70h56M22 85h74M40 54h38" stroke="${C.ink}" stroke-width="1.5" opacity=".45"/><path d="M6 104h108" stroke="${C.sage}" stroke-width="5" stroke-linecap="round"/>`),
  leaf:svg('0 0 120 120',`<path d="M60 108C24 92 18 52 34 22c4 14 10 18 16 18-2-14 4-24 10-30 6 6 12 16 10 30 6 0 12-4 16-18 16 30 10 70-26 86z" fill="${C.sage}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M60 104V26M60 70l-18-18M60 70l18-18M60 88l-24-14M60 88l24-14" stroke="${C.lead}" stroke-width="3" fill="none" stroke-linecap="round"/>`),
  rose:svg('0 0 120 120',`<path d="M60 64v46" stroke="${C.lead}" stroke-width="5"/><path d="M60 92c-14-2-22-12-24-20 14 0 22 8 24 20zM60 84c12-4 18-14 18-22-12 2-18 10-18 22z" fill="${C.sage}" stroke="${C.ink}" stroke-width="2.5"/><circle cx="60" cy="40" r="28" fill="${C.terra}" stroke="${C.ink}" stroke-width="3"/><path d="M60 22c-10 0-16 8-14 16 2 8 12 10 16 4 4-6-2-12-8-10M40 36c-2 14 6 26 20 26 12 0 20-10 20-22" fill="none" stroke="${C.paper}" stroke-width="3" stroke-linecap="round"/>`),
  frame:svg('0 0 120 120',`<rect x="10" y="12" width="100" height="96" rx="6" fill="${C.brass}" stroke="${C.ink}" stroke-width="3"/>${[[10,12],[110,12],[10,108],[110,108]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="11" fill="${C.mustard}" stroke="${C.ink}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="4" fill="${C.ink}"/>`).join('')}<path d="M60 12c-6-8 6-8 0 0M60 108c-6 8 6 8 0 0M10 60c-8-6-8 6 0 0M110 60c8-6 8 6 0 0" stroke="${C.ink}" stroke-width="3" fill="${C.mustard}"/><rect x="26" y="28" width="68" height="64" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/><path d="M32 84l18-24 12 14 10-10 16 20z" fill="${C.sage}"/>`),
  goblet:svg('0 0 120 120',`<path d="M28 14h64c0 30-14 46-32 46S28 44 28 14z" fill="${C.brass}" stroke="${C.ink}" stroke-width="3"/><path d="M34 24c8 6 16 6 26 0 10 6 18 6 26 0M38 36c8 6 14 6 22 0 8 6 14 6 22 0" fill="none" stroke="${C.ink}" stroke-width="2.5"/><circle cx="60" cy="68" r="8" fill="${C.mustard}" stroke="${C.ink}" stroke-width="3"/><path d="M56 76h8v14h-8z" fill="${C.brass}" stroke="${C.ink}" stroke-width="2.5"/><circle cx="60" cy="94" r="5" fill="${C.terra}" stroke="${C.ink}" stroke-width="2"/><path d="M34 108c4-10 48-10 52 0z" fill="${C.brass}" stroke="${C.ink}" stroke-width="3"/>`),
  chair:svg('0 0 120 120',`<path d="M38 10v96M38 62h46v44M84 62v-4" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" fill="none"/><rect x="38" y="12" width="10" height="46" fill="${C.terra}"/><rect x="34" y="56" width="54" height="10" rx="2" fill="${C.terra}" stroke="${C.ink}" stroke-width="3"/>`),
  ornateLamp:svg('0 0 120 120',`<path d="M60 70c-10 6-14 18-6 24-8 2-14 8-14 14h40c0-6-6-12-14-14 8-6 4-18-6-24z" fill="${C.brass}" stroke="${C.ink}" stroke-width="3"/><circle cx="60" cy="66" r="6" fill="${C.mustard}" stroke="${C.ink}" stroke-width="2"/><path d="M30 60l10-40h40l10 40z" fill="${C.terra}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M30 60c5 6 10 6 15 0 5 6 10 6 15 0 5 6 10 6 15 0 5 6 10 6 15 0" fill="none" stroke="${C.brass}" stroke-width="3"/><path d="M40 20c6-6 34-6 40 0M44 32h32M38 46h44" stroke="${C.mustard}" stroke-width="2.5" fill="none"/>`)
};
function art(key,cls){return h('span',{class:'s2-art'+(cls?' '+cls:''),html:ART[key]})}

/* תשעת הפריטים של בלשית הסגנון, ששבים בלוח ההשראה */
const PERIODS=[['classic','קלאסי'],['deco','אר-דקו'],['bauhaus','באוהאוס']];
const PNAME={classic:'קלאסי',deco:'אר-דקו',bauhaus:'באוהאוס'};
const ITEMS=[
  {id:'capital',p:'classic',t:'עמוד עם ראש מעוטר'},{id:'chandelier',p:'classic',t:'נברשת בדולח'},{id:'pair',p:'classic',t:'שתי כורסאות זהות זו מול זו'},
  {id:'sunburst',p:'deco',t:'מראת שמש עם קרניים'},{id:'zigzag',p:'deco',t:'קורת זיגזג'},{id:'scarab',p:'deco',t:'תכשיט חיפושית מכונפת'},
  {id:'tubechair',p:'bauhaus',t:'כורסת צינור פלדה'},{id:'lamp',p:'bauhaus',t:'מנורת שולחן פשוטה'},{id:'squares',p:'bauhaus',t:'ריבועים בצבעי יסוד'}];
const IT=Object.fromEntries(ITEMS.map(i=>[i.id,i]));
const COLORS=[['terra','טרקוטה','#C65A3C'],['petrol','ירוק נפט','#14474A'],['mustard','חרדל','#E0A63A'],['sage','ירוק מרווה','#9DB39A'],['cream','שמנת','#F2E6CF']];
const CHEX=Object.fromEntries(COLORS.map(c=>[c[0],c[2]]));

/* ---------- רכיב: נקודות בתמונה ---------- */
function spotScreen(el,ctx,o){
  const found=ctx.data.found||(ctx.data.found={});
  const box=h('div',{class:'s2-pic'+(o.tall?' tall':'')},h('img',{src:o.src,alt:o.alt,decoding:'async'}));
  if(o.ai)box.append(aiTag());
  const counter=h('span',{class:'counter'});const list=h('ol',{class:'s2-tags'});const res=h('div');
  o.pts.forEach((p,i)=>{const b=h('button',{type:'button',class:'s2-dot'+(found[i]?' found':''),style:`left:${p.x}%;top:${p.y}%`,'aria-label':'נקודה '+(i+1)},found[i]?String(i+1):'');
    b.addEventListener('click',()=>{found[i]=1;ctx.save();b.classList.add('found');b.textContent=String(i+1);upd()});box.append(b)});
  function upd(){const n=Object.keys(found).length;counter.textContent='מצאת '+n+' מתוך '+o.pts.length;
    list.replaceChildren(...o.pts.map((p,i)=>found[i]?h('li',{value:i+1},label(p.t)):null).filter(Boolean));if(n===o.pts.length)ctx.done()}
  const media=h('div',{class:'s2-media'},box,o.caption?h('div',{class:'note s2-cap'},o.caption):null,o.credit?h('div',{class:'note s2-cap'},o.credit):null);
  el.append(h('div',{class:'split media s2-split'},media,copy(o.kicker,o.title,o.lede,h('div',{class:'row'},counter),list,o.extra||null,res)));
  upd();
}

/* ---------- רכיב: שאלה עם רמז, בלי צבע אדום ---------- */
function quizScreen(el,ctx,o){
  const res=h('div');
  const list=h('div',{class:'quiz s2-quiz'},...o.opts.map(([t,ok],i)=>{const b=h('button',{type:'button',class:'opt'},h('span',{class:'mk','aria-hidden':'true'},String(i+1)),t);
    b.addEventListener('click',()=>{if(ctx.data.ok)return;if(ok){mark(b);ctx.data.ok=true;ctx.save();sayBox(res,o.right);ctx.done()}else{b.classList.add('tried');sayBox(res,o.hint)}});return b}));
  function mark(b){list.querySelectorAll('.opt').forEach(x=>x.classList.remove('tried'));b.classList.add('right');b.querySelector('.mk').textContent='✓'}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},o.visual),h('div',{class:'copy'},h('span',{class:'kicker'},o.kicker),h('h2',null,o.q),list,res)));
  if(ctx.data.ok){mark(list.querySelectorAll('.opt')[o.opts.findIndex(x=>x[1])]);sayBox(res,o.right)}
}
const bold1=s=>{const i=s.indexOf('.');return '<b>'+s.slice(0,i+1)+'</b>'+s.slice(i+1)};

/* ---------- לוח ההשראה ---------- */
function boardEl(b,big){
  const el=h('div',{class:'s2-board'+(big?' big':''),style:b.color?'--frame:'+CHEX[b.color]:null});
  const inner=h('div',{class:'in'});
  if(b.base){inner.append(h('img',{src:IMG[b.base].src+(big?'':'-sm')+'.jpg',alt:'הבסיס: '+PNAME[b.base]}));inner.append(aiTag())}
  else inner.append(h('div',{class:'empty'}));
  const row=h('div',{class:'touches'});
  for(let i=0;i<3;i++){const id=(b.touches||[])[i];row.append(id?h('span',{class:'t',title:IT[id].t},art(id)):h('span',{class:'t empty'}))}
  inner.append(row);el.append(inner);return el;
}
function boardSentence(b){
  const A={classic:'בסיס קלאסי נותן לחדר סדר ושקט,',deco:'בסיס אר-דקו נותן לחדר עומק וזוהר,',bauhaus:'בסיס באוהאוס נותן לחדר אור ומרחב,'};
  const B={classic:'והנגיעות הקלאסיות מוסיפות חגיגיות.',deco:'ונגיעות האר-דקו מוסיפות ברק.',bauhaus:'ונגיעות הבאוהאוס מוסיפות קלילות.'};
  const ps=[...new Set(b.touches.map(id=>IT[id].p))];
  return A[b.base]+' '+(ps.length===1?B[ps[0]]:'והנגיעות משתי התקופות האחרות מוסיפות עניין.');
}
const boardDone=b=>!!(b&&b.base&&b.touches&&b.touches.length===3&&b.color);
/* הצגת הלוח במחברת, בלי לגעת בציור של מפגש 1 */
const prevDraw=window.Salon.drawNote;
window.Salon.drawNote=function(it){if(it.kind==='board'&&it.board){const d=boardEl(it.board,false);d.classList.add('nb-board');return d}return prevDraw?prevDraw(it):null};

/* ---------- 23 המסכים ---------- */
const screens=[

/* יחידה 1 */
{id:'open',title:'קפלים בזמן',hideNext:true,
 text:'ברוכה השבה, {name}. הסלון הזה נראה חדש לגמרי, אבל הוא מסתיר שלוש תקופות. היום נגלה אותן.',
 mount(el,ctx){
  el.append(h('div',{class:'split'},h('div',{class:'s2-arch'},h('div',{class:'arch-back'}),h('div',{class:'frame'},pic('today','lg'),aiTag())),
    h('div',{class:'copy'},h('span',{class:'kicker'},'מפגש 2'),h('h1',null,'קפלים בזמן'),
      h('p',{class:'lede'},window.Salon.fill('ברוכה השבה, {name}. הסלון הזה נראה חדש לגמרי, אבל הוא מסתיר שלוש תקופות. היום נגלה אותן.')),
      h('button',{class:'cta',type:'button',onclick:ctx.next,html:'בואי נתחיל'+window.Salon.ICON.arrowL}))));
 }},

{id:'timeline',title:'קו הזמן',task:'לחצי על כל אחת משלוש התחנות.',
 text:'שלוש תקופות, שלושה רעיונות שונים על מהו בית יפה.',
 mount(el,ctx){
  const seen=ctx.data.seen||(ctx.data.seen={});
  const S=[['classic','קלאסי','סימטריה וסדר.','capital',C.paper],['deco','אר-דקו','גאומטריה וזוהר.','sunburst',C.lead],['bauhaus','באוהאוס','הצורה הולכת אחרי השימוש.','squares','#fff']];
  const line=h('div',{class:'s2-line'},...S.map(([k,t,d,a],i)=>{
    const card=h('div',{class:'s2-stop'+(seen[k]?' on':'')},
      h('button',{type:'button',class:'node','aria-expanded':String(!!seen[k]),onclick:e=>{seen[k]=1;ctx.save();card.classList.add('on');e.currentTarget.setAttribute('aria-expanded','true');if(Object.keys(seen).length===3)ctx.done()}},
        art(a),h('span',{class:'nm'},t)),
      h('p',{class:'what'},d));return card}));
  el.append(head('קו הזמן','שלוש תקופות','שלוש תקופות, שלושה רעיונות שונים על מהו בית יפה.'),line);
  if(Object.keys(seen).length===3)ctx.done();
 }},

{id:'classic',title:'הקלאסי',task:'לחצי על שלוש הנקודות המהבהבות בתמונה.',wide:true,
 text:'בסלון קלאסי הכול בא בזוגות, וצד ימין משקף את צד שמאל. הסדר הזה נקרא סימטריה (Symmetry).',
 mount(el,ctx){spotScreen(el,ctx,{kicker:'התחנה הראשונה',title:'הקלאסי',lede:'בסלון קלאסי הכול בא בזוגות, וצד ימין משקף את צד שמאל. הסדר הזה נקרא סימטריה (Symmetry).',
  src:IMG.classic.src+'.jpg',alt:IMG.classic.alt,ai:true,
  pts:[{x:27,y:40,t:'עמוד: עוגן של סדר.'},{x:50,y:48,t:'ציר: קו דמיוני במרכז, ומה שבצד אחד חוזר בצד השני.'},{x:50,y:13,t:'נברשת: המרכז תמיד ברור.'}]})}},

{id:'orders',title:'רגע היסטורי: העמודים מיוון',task:'לחצי על שם, ואז על הראש שמתאים לו.',wide:true,
 text:'העמודים בכניסה לווילה קלאסית הגיעו מיוון העתיקה. היוונים בנו שלושה סוגים, וכל סוג נקרא סדר עמודים (Order). מזהים אותו לפי הראש: הדורי פשוט, היוני מסתלסל כמו שני שבלולים, והקורינתי עטוף עלים.',
 mount(el,ctx){
  const done=ctx.data.done||(ctx.data.done={});let pick=null;
  const CAP={
   doric:svg('0 0 160 170',`<rect x="20" y="20" width="120" height="20" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/><path d="M34 40h92c-6 18-18 26-46 26S40 58 34 40z" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/><rect x="44" y="66" width="72" height="100" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/><path d="M62 70v94M80 70v94M98 70v94" stroke="${C.ink}" stroke-width="2" opacity=".4"/>`),
   ionic:svg('0 0 160 170',`<rect x="20" y="20" width="120" height="14" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/><path d="M26 34h108v18H26z" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/><circle cx="30" cy="58" r="18" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/><path d="M30 58m-10 0a10 10 0 1 0 10-10M30 58m-4 0a4 4 0 1 0 4-4" fill="none" stroke="${C.ink}" stroke-width="3"/><circle cx="130" cy="58" r="18" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/><path d="M130 58m10 0a10 10 0 1 1-10-10M130 58m4 0a4 4 0 1 1-4-4" fill="none" stroke="${C.ink}" stroke-width="3"/><path d="M48 52h64v18H48z" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/><rect x="48" y="70" width="64" height="96" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/><path d="M64 74v90M80 74v90M96 74v90" stroke="${C.ink}" stroke-width="2" opacity=".4"/>`),
   corinthian:svg('0 0 160 170',`<path d="M16 20h128l-10 14H26z" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/><path d="M34 34h92l-12 52H46z" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>${[[50,86,40],[80,86,44],[110,86,40],[64,62,34],[96,62,34]].map(([x,y,hh])=>`<path d="M${x} ${y}c-14-8-14-${hh-10} -2-${hh} 2 8 6 10 4 14 2-10 8-16 10-14 8 14 4 ${hh-14}-12 ${hh}z" fill="${C.sage}" stroke="${C.lead}" stroke-width="3"/>`).join('')}<path d="M30 34c-12 2-14 16-2 18M130 34c12 2 14 16 2 18" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><rect x="48" y="86" width="64" height="80" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/><path d="M64 90v74M80 90v74M96 90v74" stroke="${C.ink}" stroke-width="2" opacity=".4"/>`)};
  const NM={doric:'דורי (Doric)',ionic:'יוני (Ionic)',corinthian:'קורינתי (Corinthian)'};
  const ORDER=['ionic','corinthian','doric'];
  const names=h('div',{class:'chips s2-names',role:'group','aria-label':'שמות לבחירה'});
  const caps=h('div',{class:'s2-caps'});
  function draw(){
   names.replaceChildren(...['doric','ionic','corinthian'].map(k=>h('button',{type:'button','aria-pressed':String(pick===k),disabled:!!done[k],class:done[k]?'used':'',
     onclick:()=>{pick=pick===k?null:k;draw()}},NM[k])));
   caps.replaceChildren(...ORDER.map(k=>{const b=h('button',{type:'button',class:'s2-cap-btn'+(done[k]?' ok':''),'aria-label':done[k]?NM[k]:'ראש עמוד',html:CAP[k]},);
     if(done[k])b.append(h('span',{class:'tag'},NM[k]));
     b.addEventListener('click',()=>{if(done[k]||!pick)return;
       if(pick===k){done[k]=1;pick=null;ctx.save();draw();if(Object.keys(done).length===3)ctx.done()}
       else{const p=pick;pick=null;b.classList.add('nudge');setTimeout(()=>{draw()},420)}});return b}));
  }
  draw();
  el.append(headWide('רגע היסטורי','העמודים מיוון','העמודים בכניסה לווילה קלאסית הגיעו מיוון העתיקה. היוונים בנו שלושה סוגים, וכל סוג נקרא סדר עמודים (Order). מזהים אותו לפי הראש: הדורי פשוט, היוני מסתלסל כמו שני שבלולים, והקורינתי עטוף עלים.'),
    names,caps,h('div',{class:'note s2-cap'},'מקור: ',h('span',{class:'en'},'The Met, Architecture in Ancient Greece')));
  if(Object.keys(done).length===3)ctx.done();
 }},

/* יחידה 2 */
{id:'deco',title:'האר-דקו',task:'לחצי על שלוש הנקודות המהבהבות בתמונה.',wide:true,
 text:'שנות ה-20 הביאו לבית זוהר חדש. הסגנון נקרא אר-דקו (Art Deco), והוא אוהב גאומטריה: מניפות, זיגזגים וקווים חדים. החומרים מבריקים ועשירים, כמו פליז וקטיפה. הבית הופך לתכשיט.',
 mount(el,ctx){spotScreen(el,ctx,{kicker:'התחנה השנייה',title:'האר-דקו',lede:'שנות ה-20 הביאו לבית זוהר חדש. הסגנון נקרא אר-דקו (Art Deco), והוא אוהב גאומטריה: מניפות, זיגזגים וקווים חדים. החומרים מבריקים ועשירים, כמו פליז וקטיפה. הבית הופך לתכשיט.',
  src:DECO_PHOTO.src,alt:DECO_PHOTO.alt,credit:h('span',null,'צילום: ',h('span',{class:'en'},DECO_PHOTO.by+', Unsplash')),
  pts:[{x:85,y:86,t:'גאומטריה: אותה צורה חוזרת שוב ושוב, בקצב.'},{x:73,y:42,t:'מתכת מבריקה: תופסת את האור ומוסיפה זוהר.'},{x:93,y:24,t:'קו אנכי: מוביל את העין למעלה.'}]})}},

{id:'egypt',title:'רגע היסטורי: מקבר במצרים לסלון בפריז',task:'בחרי את שלוש הדוגמאות שהגיעו ממצרים.',wide:true,
 text:'ב-1922 נחשף במצרים הקבר של תותנקאמון. העולם כולו התאהב במצרים העתיקה, והעיצוב מיהר להצטרף. פרחי לוטוס, חיפושיות ופירמידות הופיעו פתאום על תכשיטים, על בגדים ואפילו על חזיתות של בתי קולנוע.',
 mount(el,ctx){
  const got=ctx.data.got||(ctx.data.got={});const res=h('div');
  const O=[['lotus','פרח לוטוס',1],['leaf','עלה מהעמוד הקורינתי',0],['scarab','חיפושית',1],['squares','ריבועים בצבעי יסוד',0],['pyramid','פירמידה',1],['rose','ורד',0]];
  const grid=h('div',{class:'s2-pick6 s2-pool compact'},...O.map(([k,t,ok])=>{const b=h('button',{type:'button',class:'s2-tile'+(got[k]?' ok':''),'aria-pressed':String(!!got[k])},art(k),h('span',{class:'nm'},t));
    b.addEventListener('click',()=>{if(got[k])return;if(ok){got[k]=1;ctx.save();b.classList.add('ok');b.setAttribute('aria-pressed','true');fin()}else{b.classList.add('nudge');setTimeout(()=>b.classList.remove('nudge'),420)}});return b}));
  function fin(){if(Object.keys(got).length===3){sayBox(res,'<b>בדיוק.</b> שלושתן הגיעו מקבר עתיק אל הסלונים של שנות ה-20.');ctx.done()}}
  el.append(headWide('רגע היסטורי','מקבר במצרים לסלון בפריז','ב-1922 נחשף במצרים הקבר של תותנקאמון. העולם כולו התאהב במצרים העתיקה, והעיצוב מיהר להצטרף. פרחי לוטוס, חיפושיות ופירמידות הופיעו פתאום על תכשיטים, על בגדים ואפילו על חזיתות של בתי קולנוע.'),
    h('div',{class:'s2-row2'},h('div',{class:'s2-media'},h('div',{class:'s2-met sm'},h('img',{src:LOTUS.src,alt:LOTUS.alt,decoding:'async'})),h('div',{class:'note s2-cap'},LOTUS.cap)),h('div',null,grid,res)));
  fin();
 }},

{id:'name',title:'מאיפה השם',task:'נחשי, ולחצי על אחת משתי התשובות.',wide:true,
 text:'איך קראו לסגנון הזה בשנות ה-20, כשכולם התלהבו ממנו?',
 say:'איך קראו לסגנון הזה בשנות ה-20, כשכולם התלהבו ממנו? תשובה 1: הסגנון המודרני. תשובה 2: אר-דקו.',
 mount(el,ctx){
  const res=h('div');
  const poster=svg('0 0 300 420',`<rect width="300" height="420" fill="${C.lead}"/><rect x="14" y="14" width="272" height="392" fill="none" stroke="${C.brass}" stroke-width="3"/>${Array.from({length:13},(_,i)=>{const a=(180+i*15)*Math.PI/180;return `<path d="M150 250L${150+260*Math.cos(a)} ${250+260*Math.sin(a)}" stroke="${i%2?C.mustard:C.brass}" stroke-width="${i%2?3:7}" opacity=".9"/>`}).join('')}<circle cx="150" cy="250" r="56" fill="${C.terra}" stroke="${C.brass}" stroke-width="5"/><path d="M150 120l20 130h-40z" fill="${C.paper}" opacity=".95"/><path d="M150 96v24" stroke="${C.paper}" stroke-width="4"/><rect x="40" y="300" width="220" height="90" fill="${C.paper}"/><text x="150" y="340" text-anchor="middle" font-family="Frank Ruhl Libre,serif" font-weight="900" font-size="38" fill="${C.ink}">פריז</text><text x="150" y="378" text-anchor="middle" font-family="Assistant,sans-serif" font-weight="800" font-size="30" fill="${C.terra}" letter-spacing="6">1925</text>`,'role="img"');
  const EXPL='בזמנו קראו לו "הסגנון המודרני" (Style Moderne). השם אר-דקו נולד רק בשנות ה-60. זה קיצור של "אמנויות דקורטיביות" בצרפתית, על שם תערוכה גדולה שנערכה בפריז ב-1925.';
  const OPT=[['"הסגנון המודרני"',1],['"אר-דקו"',0]];
  const list=h('div',{class:'quiz s2-quiz'},...OPT.map(([t,ok],i)=>{const b=h('button',{type:'button',class:'opt'},h('span',{class:'mk','aria-hidden':'true'},String(i+1)),t);
    b.addEventListener('click',()=>{ctx.data.ans=i;ctx.save();show()});return b}));
  function show(){const i=ctx.data.ans;if(i==null)return;list.querySelectorAll('.opt').forEach((b,j)=>{b.classList.toggle('right',OPT[j][1]===1);b.querySelector('.mk').textContent=OPT[j][1]?'✓':String(j+1)});
    sayBox(res,'<b>'+(OPT[i][1]?'בדיוק.':'הפתעה, נכון?')+'</b> '+EXPL);ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},h('div',{class:'s2-poster',html:poster}),h('div',{class:'note s2-cap'},'המחשה')),
    h('div',{class:'copy'},h('span',{class:'kicker'},'מאיפה השם'),h('h2',null,'איך קראו לסגנון הזה בשנות ה-20, כשכולם התלהבו ממנו?'),list,res)));
  show();
 }},

/* יחידה 3 */
{id:'bauhaus',title:'הבאוהאוס',task:'לחצי על שלוש הנקודות המהבהבות בתמונה.',wide:true,
 text:'ב-1919 נפתח בגרמניה בית ספר לעיצוב בשם באוהאוס (Bauhaus), והוא נסגר ב-1933. הסגנון שלו נקי וקל לעין. תראי את הכיסאות: מסגרת מתכת דקה, מושב בד, והאור עובר דרכם.',
 mount(el,ctx){spotScreen(el,ctx,{kicker:'התחנה השלישית',title:'הבאוהאוס',lede:'ב-1919 נפתח בגרמניה בית ספר לעיצוב בשם באוהאוס (Bauhaus), והוא נסגר ב-1933. הסגנון שלו נקי וקל לעין. תראי את הכיסאות: מסגרת מתכת דקה, מושב בד, והאור עובר דרכם.',
  src:CHAIRS_PHOTO.src,alt:CHAIRS_PHOTO.alt,credit:h('span',null,'צילום: ',h('span',{class:'en'},CHAIRS_PHOTO.by+', Unsplash')),
  pts:[{x:24,y:46,t:'צינור פלדה: מתכת דקה וחזקה, בלי עיטור.'},{x:86,y:80,t:'מושב בד: פשוט ונעים לישיבה.'},{x:41,y:44,t:'אור שעובר: בין הקווים נשאר מקום, והחדר נשאר פתוח.'}],
  extra:h('a',{class:'s2-link',href:'https://www.metmuseum.org/art/collection/search/485067',target:'_blank',rel:'noopener'},'הכורסה של מרסל ברויאר, 1925, פלדה מצופה כרום ובד',h('span',{class:'note'},'המוזיאון המטרופוליטני, 1988.256'))})}},

{id:'function',title:'הצורה הולכת אחרי השימוש',task:'מייני כל חפץ: קודם קישוט או קודם שימוש.',wide:true,
 text:'"הצורה הולכת אחרי השימוש" (Form follows function) נאמר ב-1896, על ידי האדריכל האמריקאי לואיס סאליבן. הרעיון פשוט: קודם שואלים מה החפץ צריך לעשות, ורק אחר כך מעצבים אותו.',
 mount(el,ctx){
  const placed=ctx.data.placed||(ctx.data.placed={});let pick=null;const res=h('div');
  const O=[['frame','מסגרת מגולפת מוזהבת','deco'],['lamp','מנורת שולחן פשוטה','use'],['goblet','גביע מעוטר בגילופים','deco'],['chair','כיסא עם גב ישר','use']];
  const pool=h('div',{class:'s2-pool compact four'});const bins={deco:h('div',{class:'s2-bin-in'}),use:h('div',{class:'s2-bin-in'})};
  const bin=(k,t)=>{const b=h('button',{type:'button',class:'s2-bin'},h('span',{class:'nm'},t),bins[k]);b.addEventListener('click',()=>drop(k));return b};
  function drop(k){if(!pick)return;const it=O.find(o=>o[0]===pick);
    if(it[2]===k){placed[pick]=k;pick=null;ctx.save();draw();if(Object.keys(placed).length===4){sayBox(res,'<b>יפה.</b> שאלה אחת מכוונת את הבחירה: מה החפץ צריך לעשות?');ctx.done()}else res.replaceChildren()}
    else{pick=null;draw();sayBox(res,'שאלי מה החפץ צריך לעשות.')}}
  function draw(){
   pool.replaceChildren(...O.filter(o=>!placed[o[0]]).map(([k,t])=>h('button',{type:'button',class:'s2-tile sm','aria-pressed':String(pick===k),onclick:()=>{pick=pick===k?null:k;draw()}},art(k),h('span',{class:'nm'},t))));
   for(const g of ['deco','use'])bins[g].replaceChildren(...O.filter(o=>placed[o[0]]===g).map(([k,t])=>h('span',{class:'s2-mini',title:t},art(k))));
  }
  const lamps=h('div',{class:'s2-lamps'},h('figure',null,art('ornateLamp'),h('figcaption',null,'קודם קישוט')),h('figure',null,art('lamp'),h('figcaption',null,'קודם שימוש')));
  el.append(headWide('רעיון גדול','הצורה הולכת אחרי השימוש','"הצורה הולכת אחרי השימוש" (Form follows function) נאמר ב-1896, על ידי האדריכל האמריקאי לואיס סאליבן. הרעיון פשוט: קודם שואלים מה החפץ צריך לעשות, ורק אחר כך מעצבים אותו.'),
    h('div',{class:'s2-row2'},h('div',{class:'s2-media'},lamps,h('div',{class:'note s2-cap'},'המחשה')),h('div',null,pool,h('div',{class:'s2-bins'},bin('deco','קודם קישוט'),bin('use','קודם שימוש')),res)));
  draw();if(Object.keys(placed).length===4){sayBox(res,'<b>יפה.</b> שאלה אחת מכוונת את הבחירה: מה החפץ צריך לעשות?');ctx.done()}
 }},

{id:'white',title:'העיר הלבנה',task:'לחצי על שלוש הנקודות המהבהבות בבניין.',wide:true,
 text:'הרעיונות האלה הגיעו גם לתל אביב. אדריכלים שלמדו ועבדו באירופה בנו בה בניינים בסגנון המודרני, והתאימו אותם לאקלים ולתרבות של המקום. ב-2003 הוכרה העיר הלבנה כאתר מורשת עולמית של אונסק"ו.',
 mount(el,ctx){spotScreen(el,ctx,{kicker:'מאירופה לתל אביב',title:'העיר הלבנה',tall:true,lede:'הרעיונות האלה הגיעו גם לתל אביב. אדריכלים שלמדו ועבדו באירופה בנו בה בניינים בסגנון המודרני, והתאימו אותם לאקלים ולתרבות של המקום. ב-2003 הוכרה העיר הלבנה כאתר מורשת עולמית של אונסק"ו.',
  src:IMG.white.src+'.jpg',alt:IMG.white.alt,caption:'בניין בתל אביב.',credit:'המקור לא ידוע.',
  pts:[{x:78,y:22,t:'מרפסת מעוגלת: פינה בחוץ בראש הבניין, בקו מעוגל.'},{x:33,y:43,t:'חלון עגול: חלון קטן בצורת עיגול, בלי מסגרת מעוטרת.'},{x:30,y:32,t:'קיר לבן: משטח חלק, בלי עיטור.'}]})}},

/* יחידה 4 */
{id:'switch',title:'מתג הסגנונות',task:'לחצי על כל אחת משלוש התקופות, וצפי איך הסלון משתנה.',wide:true,
 text:'אותו סלון, אותו חלון, אותה נקודת מבט. רק התקופה משתנה. שימי לב מה נשאר ומה מתחלף.',
 mount(el,ctx){
  const seen=ctx.data.seen||(ctx.data.seen={});let cur=ctx.data.cur||null;
  const L={classic:[[27,20,'עמודים מעוטרים: ראש מגולף בראש כל עמוד.'],[18,70,'זוגות: הכורסאות מסודרות בזוגות, וצד ימין משקף את צד שמאל.'],[50,13,'נברשת קריסטל: אור עדין ומעוטר.']],
    deco:[[27,19,'העמודים נשארו, והזוהר נוסף מעליהם.'],[55,64,'קטיפה ירוקה ופליז: חומרים עמוקים ומבריקים.'],[50,88,'שטיח גאומטרי: קרני שמש ומשולשים.']],
    bauhaus:[[20,74,'צינור פלדה וזכוכית: כורסאות דקות ושולחן שקוף.'],[36,22,'קירות חלקים: בלי עיטור.'],[66,84,'כתמי צבע קטנים: אדום, צהוב וכחול, רק בפרטים.']]};
  const box=h('div',{class:'s2-pic s2-fade'},...PERIODS.map(([k])=>pic(k,'lg',{class:'lay','data-k':k})),aiTag());
  const pins=h('div',{class:'pins'});box.append(pins);
  const list=h('ol',{class:'s2-tags'});let tmr=null;
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':'שלוש תקופות'},...PERIODS.map(([k,t])=>h('button',{type:'button','data-k':k,'aria-pressed':'false',onclick:()=>show(k)},t)));
  function show(k,instant){cur=k;ctx.data.cur=k;seen[k]=1;ctx.save();
    box.querySelectorAll('.lay').forEach(i=>i.classList.toggle('on',i.dataset.k===k));
    btns.querySelectorAll('button').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.k===k));b.classList.toggle('seen',!!seen[b.dataset.k])});
    pins.replaceChildren();list.replaceChildren();clearTimeout(tmr);
    tmr=setTimeout(()=>{pins.replaceChildren(...L[k].map(([x,y],i)=>h('span',{class:'s2-dot found pin',style:`left:${x}%;top:${y}%`},String(i+1))));
      list.replaceChildren(...L[k].map(([,,t],i)=>h('li',{value:i+1},label(t))))},instant?0:1000);
    if(Object.keys(seen).length===3)ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),
    copy('רגע WOW','מתג הסגנונות','אותו סלון, אותו חלון, אותה נקודת מבט. רק התקופה משתנה. שימי לב מה נשאר ומה מתחלף.',list)));
  if(cur)show(cur,true);else box.querySelector('.lay').classList.add('on');
  const cl=gate(ctx,Object.keys(seen).length===3);return ()=>{clearTimeout(tmr);cl()};
 }},

{id:'detective',title:'בלשית הסגנון',task:'לחצי על פריט, ואז על החדר שהוא שייך לו.',wide:true,
 text:'עכשיו את הבלשית. תשעה פריטים מחכים למקום שלהם בחדר הנכון.',
 mount(el,ctx){
  const placed=ctx.data.placed||(ctx.data.placed={});let pick=null;const res=h('div');
  if(!ctx.data.order){ctx.data.order=shuffle(ITEMS.map(i=>i.id));ctx.save()}
  const pool=h('div',{class:'s2-pool nine compact'});
  const rooms=h('div',{class:'s2-rooms'});
  const roomSvg=k=>svg('0 0 200 110',`<rect x="0" y="0" width="200" height="110" fill="${k==='classic'?'#F4EAD6':k==='deco'?'#1F5357':'#FAFAF7'}"/><path d="M0 84h200" stroke="${k==='deco'?C.brass:'#C8BCA6'}" stroke-width="3"/><path d="M80 84V34a20 20 0 0 1 40 0v50" fill="${k==='deco'?'#2C6A6E':'#E3EEF0'}" stroke="${k==='deco'?C.brass:'#C8BCA6'}" stroke-width="3"/>`);
  function draw(){
   pool.replaceChildren(...ctx.data.order.filter(id=>!placed[id]).map(id=>h('button',{type:'button',class:'s2-tile sm','aria-pressed':String(pick===id),onclick:()=>{pick=pick===id?null:id;draw()}},art(id),h('span',{class:'nm'},IT[id].t))));
   const all=Object.keys(placed).length===9;
   rooms.replaceChildren(...PERIODS.map(([k,t])=>{const b=h('button',{type:'button',class:'s2-room'+(all?' lit':''),'aria-label':'החדר ה'+t},
     h('span',{class:'bg',html:roomSvg(k)}),h('span',{class:'nm'},t),h('span',{class:'in'},...ITEMS.filter(i=>placed[i.id]===k).map(i=>h('span',{class:'s2-mini',title:i.t},art(i.id)))));
     b.addEventListener('click',()=>drop(k));return b}));
   if(all){sayBox(res,'<b>עין של בלשית, '+(ctx.name||'')+'.</b> מעכשיו תזהי תקופות בכל בית.'.replace(', .','.'));ctx.done()}
  }
  function drop(k){if(!pick)return;if(IT[pick].p===k){placed[pick]=k;pick=null;ctx.save();res.replaceChildren();draw()}else{pick=null;draw();sayBox(res,'הסתכלי על החומר ועל הצורה.')}}
  el.append(headWide('רגע WOW','בלשית הסגנון','עכשיו את הבלשית. תשעה פריטים מחכים למקום שלהם בחדר הנכון.'),h('div',{class:'s2-detective'},rooms,pool),res,h('div',{class:'note'},'המחשה'));
  draw();
 }},

{id:'today',title:'הווילה של היום',task:'גררי את הסליידר, ובדקי מה הנגיעות מוסיפות לחדר.',wide:true,
 text:'וילה של היום לא בוחרת תקופה אחת. בסיס נקי בסגנון הבאוהאוס, ועליו נגיעות זוהר בסגנון האר-דקו. כאן הוספנו רק שלוש.',
 mount(el,ctx){
  const P=[[12,41,'מראת שמש: קרני פליז סביב מראה עגולה.'],[60,59,'כריות קטיפה: צבע עמוק על ספה פשוטה.'],[50,73,'מסגרת פליז: אותו שולחן, עם ברק חם.']];
  const after=h('div',{class:'s2-after'},pic('today','lg'),...P.map(([x,y],i)=>h('span',{class:'s2-dot found pin',style:`left:${x}%;top:${y}%`},String(i+1))));
  const before=pic('bauhaus','lg',{alt:ALT_BEFORE});
  const mark=()=>{if(!ctx.data.moved){ctx.data.moved=true;ctx.save()}ctx.done()};
  const c=h('div',{class:'compare s2-compare'},h('div',{class:'layer after'},after),h('div',{class:'layer before'},before),h('div',{class:'handle'}),
    h('span',{class:'lbl b'},'לפני'),h('span',{class:'lbl a'},'אחרי'),aiTag());
  const r=h('input',{type:'range',min:0,max:100,value:ctx.data.cut!=null?ctx.data.cut:50,dir:'ltr','aria-label':'גררי כדי להשוות לפני ואחרי'});
  const set=v=>{c.style.setProperty('--cut',v+'%');r.value=v;ctx.data.cut=+v};
  r.addEventListener('input',()=>{set(r.value);mark()});r.addEventListener('change',()=>ctx.save());c.append(r);set(r.value);
  const btns=h('div',{class:'row s2-ab'},h('button',{class:'btn',type:'button',onclick:()=>{set(0);ctx.save();mark()}},'הבסיס'),h('button',{class:'btn',type:'button',onclick:()=>{set(100);ctx.save();mark()}},'עם נגיעות'));
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},c,btns),
    copy('הבסיס והנגיעות','הווילה של היום','וילה של היום לא בוחרת תקופה אחת. בסיס נקי בסגנון הבאוהאוס, ועליו נגיעות זוהר בסגנון האר-דקו. כאן הוספנו רק שלוש.',
      h('ol',{class:'s2-tags'},...P.map(([,,t],i)=>h('li',{value:i+1},label(t)))))));
  if(ctx.data.moved)ctx.done();
 }},

/* יחידה 5 */
{id:'board',title:'המשימה: סלון של שתי תקופות',task:'בחרי בסיס, אחר כך שלוש נגיעות, ולבסוף צבע אחד.',wide:true,
 text:'בעלי הווילה מבקשים סלון של שתי תקופות, בדיוק כמו הווילה של היום: בסיס אחד, ועליו שלוש נגיעות מתקופה אחרת. הפעם את המעצבת.',
 mount(el,ctx){
  const b=ctx.data.b||(ctx.data.b={base:null,touches:[],color:null});const res=h('div');
  const boardBox=h('div',{class:'s2-boardbox'});const steps=h('div',{class:'s2-steps'});
  let manual=null;
  const auto=()=>!b.base?1:b.touches.length<3?2:3;
  function step(n,title,summary,ready,body){const open=ready&&(manual||auto())===n;
    const hd=h('h3',null,h('span',{class:'num'},String(n)),title,summary&&!open?h('span',{class:'sum'},summary):null);
    if(ready&&!open)return h('button',{type:'button',class:'s2-step closed',onclick:()=>{manual=n;draw()}},hd);
    return h('section',{class:'s2-step'+(ready?'':' locked')},hd,open?body:null)}
  function draw(){
   boardBox.replaceChildren(boardEl(b,true));
   const s1=h('div',{class:'s2-bases'},...PERIODS.map(([k,t])=>h('button',{type:'button','aria-pressed':String(b.base===k),onclick:()=>{b.base=k;b.touches=b.touches.filter(id=>IT[id].p!==k);manual=null;ctx.save();draw()}},pic(k,'sm'),h('span',{class:'nm'},t))));
   const s2=h('div',{class:'s2-pool nine compact'},...ITEMS.map(i=>{const inBase=i.p===b.base;const on=b.touches.includes(i.id);
     return h('button',{type:'button',class:'s2-tile sm'+(inBase?' dim':''),disabled:inBase,'aria-pressed':String(on),
       onclick:()=>{if(on)b.touches=b.touches.filter(x=>x!==i.id);else if(b.touches.length<3)b.touches.push(i.id);if(b.touches.length===3)manual=null;ctx.save();draw()}},art(i.id),h('span',{class:'nm'},inBase?'כבר בבסיס':i.t))}));
   const s3=h('div',{class:'s2-swatches'},...COLORS.map(([k,t,hex])=>h('button',{type:'button','aria-pressed':String(b.color===k),onclick:()=>{b.color=k;ctx.save();draw()}},h('span',{class:'sw',style:'background:'+hex}),h('span',{class:'nm'},t))));
   const cn=b.color&&COLORS.find(c=>c[0]===b.color)[1];
   steps.replaceChildren(step(1,'בסיס',b.base&&PNAME[b.base],true,s1),step(2,'שלוש נגיעות',b.touches.length+' מתוך 3',!!b.base,s2),step(3,'צבע',cn,!!b.base&&b.touches.length===3,s3));
   if(boardDone(b)){sayBox(res,'<b>משפט מעצבים:</b> '+boardSentence(b));ctx.done()}else res.replaceChildren();
  }
  el.append(headWide('המשימה','סלון של שתי תקופות','בעלי הווילה מבקשים סלון של שתי תקופות, בדיוק כמו הווילה של היום: בסיס אחד, ועליו שלוש נגיעות מתקופה אחרת. הפעם את המעצבת.'),
    h('div',{class:'s2-builder'},h('div',null,boardBox,h('figure',{class:'s2-sample'},pic('today','sm',{alt:IMG.today.alt}),h('figcaption',null,'ככה זה נראה: בסיס אחד ושלוש נגיעות'))),h('div',null,steps,res)));
  draw();
  return gate(ctx,boardDone(b));
 }},

{id:'myboard',title:'הלוח שלך',task:'בחרי שתי מילים שמתארות את הסלון שלך.',wide:true,
 text:'זה הסלון שלך, {name}. עכשיו ספרי לבעלי הווילה מה הוא מרגיש.',
 mount(el,ctx){
  const b=(ctx.all.board||{}).b;const res=h('div');
  if(!boardDone(b)){el.append(h('div',{class:'center'},h('div',null,h('h2',null,'הלוח שלך'),h('p',{class:'lede'},'הלוח עוד לא מוכן. חזרי מסך אחד אחורה והשלימי אותו.'))));return}
  const W=['מואר','חגיגי','שקט','חמים','נועז','אלגנטי','קליל','מזמין'];const words=ctx.data.words||(ctx.data.words=[]);
  const chips=h('div',{class:'chips s2-words',role:'group','aria-label':'מילים לבחירה'});
  function draw(){chips.replaceChildren(...W.map(w=>h('button',{type:'button','aria-pressed':String(words.includes(w)),onclick:()=>{
      const i=words.indexOf(w);if(i>=0)words.splice(i,1);else{if(words.length>=2)words.shift();words.push(w)}ctx.save();draw()}},w)));
    if(words.length===2){const s='בעלי הווילה, הסלון שלכם '+words[0]+' ו'+words[1]+'.';saveNote(s);sayBox(res,'<b>'+s+'</b> הלוח נשמר במחברת שלך.');ctx.done()}else res.replaceChildren()}
  function saveNote(s){const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='board'&&n.session===2);
    if(old){old.board=JSON.parse(JSON.stringify(b));old.text=s;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:'board',svg:true,title:'הסלון של שתי תקופות',board:JSON.parse(JSON.stringify(b)),text:s})}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},boardEl(b,true)),
    copy('הלוח שלך','הלוח שלך',window.Salon.fill('זה הסלון שלך, {name}. עכשיו ספרי לבעלי הווילה מה הוא מרגיש.'),chips,res)));
  draw();
  return gate(ctx,words.length===2);
 }},

{id:'check1',title:'בדיקה 1',task:'לחצי על הסלון הקלאסי.',wide:true,
 text:'ארבעה סלונים באותו חדר. רק אחד מהם קלאסי.',
 mount(el,ctx){
  if(!ctx.data.order){ctx.data.order=shuffle(['classic','deco','bauhaus','today']);ctx.save()}
  const res=h('div');const alts={bauhaus:IMG.bauhaus.alt};
  const grid=h('div',{class:'s2-four'},...ctx.data.order.map(k=>{const b=h('button',{type:'button',class:'card s2-card'+(ctx.data.ok&&k==='classic'?' right':'')},pic(k,'sm',{alt:alts[k]||IMG[k].alt}),aiTag());
    b.addEventListener('click',()=>{if(ctx.data.ok)return;if(k==='classic'){ctx.data.ok=true;ctx.save();b.classList.add('right');sayBox(res,bold1('נכון. נברשת קריסטל, זוגות וסדר: זה הקלאסי.'));ctx.done()}
      else{b.classList.add('tried');sayBox(res,'חפשי נברשת קריסטל וצבעי שמנת וזהב.')}});return b}));
  el.append(head('בדיקה 1','איזה סלון קלאסי?','ארבעה סלונים באותו חדר. רק אחד מהם קלאסי.'),grid,res);
  if(ctx.data.ok)sayBox(res,bold1('נכון. נברשת קריסטל, זוגות וסדר: זה הקלאסי.'));
  return gate(ctx,!!ctx.data.ok);
 }},

{id:'check2',title:'בדיקה 2',task:'בחרי את התשובה הנכונה.',wide:true,
 say:'מה נכנס לאר-דקו אחרי שנחשף הקבר של תותנקאמון? תשובה 1: עמודים יווניים. תשובה 2: פרחי לוטוס, חיפושיות ופירמידות. תשובה 3: צינורות פלדה. תשובה 4: צבעי יסוד.',
 mount(el,ctx){quizScreen(el,ctx,{kicker:'בדיקה 2',q:'מה נכנס לאר-דקו אחרי שנחשף הקבר של תותנקאמון?',
  visual:h('div',null,h('div',{class:'s2-met'},h('img',{src:LOTUS.src,alt:LOTUS.alt})),h('div',{class:'note s2-cap'},'המוזיאון המטרופוליטני, 26.7.971, נחלת הכלל')),
  opts:[['עמודים יווניים',0],['פרחי לוטוס, חיפושיות ופירמידות',1],['צינורות פלדה',0],['צבעי יסוד',0]],
  hint:'חשבי על מצרים העתיקה.',right:bold1('נכון. ב-1922 מצרים העתיקה נכנסה לעיצוב.')});return gate(ctx,!!ctx.data.ok)}},

{id:'check3',title:'בדיקה 3',task:'בחרי את התשובה הנכונה.',wide:true,
 say:'מה פירוש "הצורה הולכת אחרי השימוש"? תשובה 1: חפץ יפה חשוב יותר מחפץ נוח. תשובה 2: קודם חושבים מה החפץ צריך לעשות, ורק אחר כך מעצבים אותו. תשובה 3: לכל חפץ צריך קישוט. תשובה 4: בוחרים חפצים לפי האופנה.',
 mount(el,ctx){quizScreen(el,ctx,{kicker:'בדיקה 3',q:'מה פירוש "הצורה הולכת אחרי השימוש"?',
  visual:h('div',null,h('div',{class:'s2-lamps'},h('figure',null,art('ornateLamp')),h('figure',null,art('lamp'))),h('div',{class:'note s2-cap'},'המחשה')),
  opts:[['חפץ יפה חשוב יותר מחפץ נוח',0],['קודם חושבים מה החפץ צריך לעשות, ורק אחר כך מעצבים אותו',1],['לכל חפץ צריך קישוט',0],['בוחרים חפצים לפי האופנה',0]],
  hint:'שאלי מה החפץ צריך לעשות.',right:bold1('בדיוק. קודם השימוש, ואחר כך הצורה.')});return gate(ctx,!!ctx.data.ok)}},

{id:'check4',title:'בדיקה 4',task:'בחרי את התשובה הנכונה.',wide:true,
 say:'מה בסלון הזה הגיע מהאר-דקו? תשובה 1: הקירות הלבנים והחלקים. תשובה 2: הכורסאות מצינור פלדה. תשובה 3: מראת השמש מפליז. תשובה 4: שולחן הזכוכית.',
 mount(el,ctx){quizScreen(el,ctx,{kicker:'בדיקה 4',q:'מה בסלון הזה הגיע מהאר-דקו?',
  visual:h('div',{class:'s2-pic'},pic('today','lg'),aiTag()),
  opts:[['הקירות הלבנים והחלקים',0],['הכורסאות מצינור פלדה',0],['מראת השמש מפליז',1],['שולחן הזכוכית',0]],
  hint:'חפשי ברק וקרני שמש.',right:bold1('נכון. קרני השמש הן מהמוטיבים המפורסמים של האר-דקו.')});return gate(ctx,!!ctx.data.ok)}},

{id:'home-idea',title:'בלשית בבית שלך',task:'כתבי את שם הפריט, ולחצי על התקופה שהוא מזכיר לך.',
 text:'רוצה להיות בלשית גם בבית? בחרי פריט אחד שאת אוהבת, למשל כורסה, מנורה, מראה או אגרטל.',
 mount(el,ctx){
  const res=h('div');const inp=h('input',{id:'s2item',type:'text',maxlength:60,value:ctx.data.item||''});
  const pick=k=>{const v=inp.value.trim();if(!v){inp.focus();return}
    ctx.data.item=v;ctx.data.period=k;ctx.save();
    const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='idea2'&&n.session===2);const text=v+' · '+PNAME[k];
    if(old){old.text=text;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:'idea2',title:'בלשית בבית שלך',text});
    btns.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));
    sayBox(res,'<b>נשמר במחברת שלך.</b>');ctx.done()};
  const btns=h('div',{class:'chips s2-periods sm',role:'group','aria-label':'תקופה'},...PERIODS.map(([k,t])=>h('button',{type:'button','data-k':k,'aria-pressed':String(ctx.data.period===k),onclick:()=>pick(k)},t)));
  const mag=svg('0 0 200 200',`<circle cx="84" cy="84" r="56" fill="#E3EEF0" stroke="${C.brass}" stroke-width="14"/><path d="M60 64a30 30 0 0 1 30-18" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M126 126l46 46" stroke="${C.lead}" stroke-width="22" stroke-linecap="round"/><path d="M126 126l14 14" stroke="${C.brass}" stroke-width="22"/>`);
  el.append(h('div',{class:'split'},h('div',{class:'s2-mag',html:mag}),
    h('div',{class:'copy'},h('span',{class:'kicker'},'רעיון לבית'),h('h2',null,'בלשית בבית שלך'),
      h('p',{class:'lede'},'רוצה להיות בלשית גם בבית? בחרי פריט אחד שאת אוהבת, למשל כורסה, מנורה, מראה או אגרטל.'),
      h('div',{class:'field'},h('label',{for:'s2item'},'שם הפריט'),inp),btns,
      h('div',{class:'row',style:'margin-top:14px'},h('button',{class:'btn',type:'button',onclick:ctx.next},'דלגי')),res)));
  if(ctx.data.period)sayBox(res,'<b>נשמר במחברת שלך.</b>');
 }},

/* יחידה 6 */
{id:'summary',title:'סיכום',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'ארבעה כללים לקחת הביתה מהמפגש.',
 mount(el,ctx){
  const R=[['classic','קלאסי','קלאסי זה סימטריה וסדר: עמודים, זוגות ומרכז ברור.'],['deco','אר-דקו','אר-דקו זה גאומטריה וזוהר: קרני שמש, זיגזגים, פליז וקטיפה.'],
    ['bauhaus','באוהאוס','באוהאוס זה קודם השימוש ואחר כך הצורה: קווים נקיים, צינור פלדה ואור.'],['today','הווילה של היום','וילה של היום משלבת בסיס נקי, ועליו נגיעות של זוהר.']];
  const seen=ctx.data.seen||(ctx.data.seen={});
  const grid=h('div',{class:'cards s2-flips'},...R.map(([k,t,d],i)=>{
    const f=h('button',{type:'button',class:'flip'+(seen[i]?' on':''),'aria-label':t},h('div',{class:'in'},
      h('div',{class:'f'},pic(k,'sm',{alt:''}),h('div',{class:'q'},t)),h('div',{class:'b'},h('div',{class:'rule'},d))));
    f.addEventListener('click',()=>{f.classList.toggle('on');seen[i]=true;ctx.save();if(Object.keys(seen).length===4)ctx.done()});return f}));
  el.append(head('סיכום','ארבעה כללים','ארבעה כללים לקחת הביתה מהמפגש.'),grid);
  return gate(ctx,Object.keys(seen).length===4);
 }},

{id:'audio',title:'סקירה קולית',task:'לחצי על הנגן כדי לשמוע.',skip:()=>!audioOK,
 text:'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.',
 mount(el,ctx){
  el.append(h('div',{class:'center'},h('div',null,h('span',{class:'kicker'},'סקירה קולית'),h('h2',null,'סקירה קולית'),h('p',{class:'lede'},'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.'),
    h('audio',{controls:true,src:'assets/audio/s2.m4a',style:'width:min(640px,90vw)',onplay:ctx.done}))));
 }},

{id:'feedback',title:'משוב וגשר',task:'דרגי בלחיצה, ואם תרצי, כתבי גם כמה מילים.',wide:true,hideNext:true,
 say:'{name}, סיימת את מפגש 2. טיילת בין שלוש תקופות וחזרת עם עין של מעצבת. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
 mount(el,ctx){
  window.Salon.finish(2);
  const f=Object.assign({content:'',visual:'',overall:'',text:'',period:'',periodWhy:''},(ctx.S.feedback||{})[2]||{});
  const W=['אהבתי מאוד','אהבתי','היה בסדר','פחות'];const res=h('div');
  const q=(key,label,opts)=>h('div',{class:'q'},h('b',null,label),h('div',{class:'chips sm',role:'group','aria-label':label},...opts.map(w=>h('button',{type:'button','aria-pressed':String(f[key]===w),
    onclick:e=>{f[key]=w;e.currentTarget.parentNode.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)))}},w))));
  const ta=h('textarea',{id:'fb2',maxlength:1500},f.text||'');const why=h('input',{id:'fb2why',type:'text',maxlength:300,value:f.periodWhy||''});
  const saveIt=()=>{f.text=ta.value.trim();f.periodWhy=why.value.trim();
    if(!f.content&&!f.visual&&!f.overall&&!f.text&&!f.period&&!f.periodWhy){ta.focus();return}
    window.Salon.setFeedback(2,{content:f.content,visual:f.visual,overall:f.overall,text:f.text,period:f.period,periodWhy:f.periodWhy});
    sayBox(res,'<b>תודה'+(ctx.name?', '+ctx.name:'')+'.</b> המשוב נשמר.')};
  const pq=h('div',{class:'chips sm',role:'group','aria-label':'איזו תקופה הכי דיברה אלייך?'},...['קלאסי','אר-דקו','באוהאוס','השילוב של היום'].map(w=>h('button',{type:'button','aria-pressed':String(f.period===w),
      onclick:e=>{f.period=w;e.currentTarget.parentNode.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)))}},w)));
  const top=headWide('המשוב שלך','איך היה?',window.Salon.fill('{name}, סיימת את מפגש 2. טיילת בין שלוש תקופות וחזרת עם עין של מעצבת. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.'));
  const fb=h('div',{class:'s2-fb'},
    h('div',{class:'rate'},q('content','התוכן',W),q('visual','המראה והתמונות',W),q('overall','החוויה בכלל',W),
      h('div',{class:'q'},h('b',null,'איזו תקופה הכי דיברה אלייך?'),pq)),
    h('div',{class:'s2-two'},
      h('div',{class:'field',style:'max-width:none'},h('label',{for:'fb2'},'מה עוד תרצי לספר? מה אהבת, ומה היית משנה?'),ta),
      h('div',{class:'field',style:'max-width:none'},h('label',{for:'fb2why'},'רוצה לכתוב למה?'),why)));
  const bridge=h('aside',{class:'s2-bridge'},h('div',{class:'ph'},pic('bridge','sm',{alt:IMG.bridge.alt}),aiTag()),
      h('div',null,h('span',{class:'kicker'},'מפגש 3'),h('p',null,'במפגש הבא: וילות בישראל. נשחק עם השמש. תבחרי שעה וכיוון, תפתחי ותסגרי תריסים, ותראי איך האור משנה את הסלון.')));
  const side=h('div',{class:'s2-fb'},bridge,
    h('p',{class:'note',style:'margin:8px 0 0'},'המשוב לא חובה. אפשר להמשיך גם בלעדיו.'),
    h('div',{class:'row',style:'margin-top:8px'},h('button',{class:'cta',type:'button',onclick:saveIt},'שמרי משוב'),h('button',{class:'btn',type:'button',onclick:()=>window.Salon.goHome()},'למסך הבית')),res);
  el.append(top,h('div',{class:'s2-end'},fb,side));
  ctx.done();
 }}
];

window.Salon.register(2,screens);
})();
