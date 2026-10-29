/* הסלון של מזל · מפגש 1: מבית לחלל חלומות */
(function(){
'use strict';
const {h,ICON}=window.Salon;const P=window.SalonPlan;

/* ---------- מדיה ---------- */
const U=(id,w,hh)=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${hh}&q=78`;
const IMG={
  open:{id:'1778640331184-dc4c3e2608e1',by:'Gabriel Quintana',alt:'סלון בווילה עם חלונות גבוהים הפונים לבריכה ולגן ירוק'},
  door:{id:'1779231927040-16f1e163d77a',by:'Meanwhile In San Diego',alt:'דלת כניסה כפולה מעץ מגולף, ופנסים משני צדדיה'},
  lounge:{id:'1758448756084-c44d73014c07',by:'Aalo Lens',alt:'סלון בגובה כפול עם קיר זכוכית אל הגן'},
  win:{id:'1781962479780-b910226837a3',by:'Omar',alt:'חדר אורחים מעוצב עם דלת זכוכית גבוהה אל גן'},
  fire:{id:'1560449752-8b6023e2ab5a',by:'Francesca Tosolini',alt:'סלון עם קיר אבנים גדול ובו אח'},
  seat1:{id:'1758024836397-2c9c698087f0',by:'Clay Banks',alt:'כורסה ליד חלון עם נוף לגן'},
  seat2:{id:'1759264244744-4b0077534bfd',by:'ubeyonroad',alt:'כורסה כתומה ליד מנורה וחלון מואר'},
  seat3:{id:'1720161263981-84281892ee4b',by:'Pepita Martasya',alt:'פינת ישיבה מול בריכה בווילה'},
  villa:{id:'1760067537204-fe9b55b2f1b0',by:'Alef Morais',alt:'וילה מודרנית עם בריכה'},
  art:{id:'1647082550285-119acfd169f2',by:'mahmoud azmy',alt:'סלון בהיר עם ציור גדול על הקיר וצמח בפינה'},
  marble:{id:'1523251836828-b75d28b89804',by:'Augustine Wong',alt:'משטח שיש לבן'},
  glass:{id:'1784397545371-d26d49c0bf6f',by:'Ashutosh Gupta',alt:'אגרטל זכוכית ירוק על אדן חלון'},
  metal:{id:'1618352357270-ef40d25bcef8',by:'Kier in Sight Archives',alt:'משטח מתכת מוזהבת'},
  wood:{id:'1737094662085-7e0db16198e3',by:'Maria Kovalets',alt:'משטח עץ בהיר'},
  velvet:{id:'1759647020668-648cd90ddce4',by:'Vlad Deep',alt:'ספת קטיפה ירוקה עם כריות'},
  wool:{id:'1773747310660-240fa5282250',by:'Yuliia Pakhomova',alt:'בד צמר סרוג'}
};
const MET={src:'https://images.metmuseum.org/CRDImages/gr/web-large/DP143704.jpg',alt:'חדר מווילה רומית בבוסקוריאלה, שקירותיו מצוירים בציורי קיר צבעוניים',credit:'המוזיאון המטרופוליטן לאמנות, ניו יורק. נחלת הכלל',url:'https://www.metmuseum.org/art/collection/search/247017'};
const PANO={src:'assets/img/s1-pano.jpg',credit:'Sergej Majboroda, Poly Haven',spots:[
  {id:'path',yaw:20,pitch:-30,title:'השביל',text:'כאן עוברים מהדלת אל דלתות הזכוכית. שום רהיט לא עומד בדרך.'},
  {id:'sight',yaw:-8,pitch:2,title:'קו המבט',text:'מהכניסה העין רצה ישר אל דלתות הזכוכית והאור. שום דבר גבוה לא עוצר אותה.'},
  {id:'focal',yaw:-73,pitch:-4,title:'מוקד העניין',text:'האח הלבנה מושכת את העין ראשונה, והספה מונחת לידה, על השטיח.'}]};
let audioOK=false,panoOK=false;
fetch('assets/audio/s1.m4a',{method:'HEAD'}).then(r=>{audioOK=r.ok}).catch(()=>{});
fetch('assets/img/s1-pano.jpg',{method:'HEAD'}).then(r=>{panoOK=r.ok}).catch(()=>{});

function photo(key,w,hh){const m=IMG[key];return h('img',{src:U(m.id,w,hh),alt:m.alt,loading:'eager',decoding:'async'})}
function credit(key){const m=IMG[key];return h('div',{class:'credit'},'צילום: ',h('span',{class:'en'},m.by),', ',h('span',{class:'en'},'Unsplash'))}
function arch(content,cr,{back}={}){const a=h('div',{class:'arch-wrap'},h('div',{class:'arch-back',style:back?'background:'+back:null}),h('div',{class:'arch'},content));if(cr)a.append(cr);return a}
function split(visual,...copy){return h('div',{class:'split'},visual,h('div',{class:'copy'},...copy))}
function head(kicker,title,text){return h('div',{class:'head'},h('div',null,kicker?h('span',{class:'kicker'},kicker):null,h('h2',null,title),text?h('p',{class:'lede'},text):null))}
function sayBox(parent,html,warn){parent.querySelectorAll('.say').forEach(x=>x.remove());const b=h('div',{class:'say'+(warn?' warn':''),role:'status',html});parent.append(b);setTimeout(()=>{try{b.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){}},60);return b}

/* השוואת לפני ואחרי (שתי שכבות) */
function compare(beforeEl,afterEl,{labels=['לפני','אחרי'],start=50,onMove,chrome}={}){
  const c=h('div',{class:'compare',style:chrome?'--chrome:'+chrome+'px':null},h('div',{class:'layer after'},afterEl),h('div',{class:'layer before'},beforeEl),h('div',{class:'handle'}),
    h('span',{class:'lbl b'},labels[0]),h('span',{class:'lbl a'},labels[1]));
  const r=h('input',{type:'range',min:0,max:100,value:start,dir:'ltr','aria-label':'גררי כדי להשוות לפני ואחרי'});
  const set=v=>{c.style.setProperty('--cut',v+'%');r.value=v;onMove&&onMove(+v)};
  r.addEventListener('input',()=>set(r.value));c.append(r);set(start);
  c.setTo=set;return c;
}
/* מדף ספרים מצויר, שמסתיר את המבט */
function bookcase(){
  const s='http://www.w3.org/2000/svg';const svg=document.createElementNS(s,'svg');svg.setAttribute('viewBox','0 0 1200 800');svg.setAttribute('preserveAspectRatio','xMidYMid slice');
  const cols=['#C65A3C','#E0A63A','#14474A','#9DB39A','#F7F0E4','#7E5A3C','#B8C7D6'];let m='<rect x="430" y="70" width="360" height="730" fill="#4A3424"/><rect x="440" y="80" width="340" height="720" fill="#5B4130"/>';
  let k=0;for(let y=80;y<760;y+=128){m+=`<rect x="440" y="${y+112}" width="340" height="16" fill="#3A281C"/>`;let x=452;while(x<760){const w=14+((k*7)%18),hh=70+((k*13)%38);m+=`<rect x="${x}" y="${y+112-hh}" width="${w}" height="${hh}" fill="${cols[k%cols.length]}" stroke="#2A1D14" stroke-width="2"/>`;x+=w+3;k++}}
  m+='<rect x="430" y="70" width="360" height="730" fill="none" stroke="#2A1D14" stroke-width="6"/>';svg.innerHTML=m;return svg}

/* ---------- פינת הקריאה ---------- */
const CORNER={
  focal:{window:'חלון אל הגן',art:'יצירת אמנות',fire:'אח מאבן'},
  chair:{wing:'כורסת כנפיים בטרקוטה',barrel:'כורסה עגולה בקטיפה ירוקה',lounge:'כורסת עור ועץ'},
  lamp:{arc:'מנורת קשת',read:'מנורת קריאה עם זרוע',ceramic:'מנורת שולחן מקרמיקה'},
  mat:{marble:'שיש',wood:'עץ אלון',brass:'פליז'}
};
const SHORT={focal:{window:'חלון',art:'אמנות',fire:'אח'},chair:{wing:'כנפיים',barrel:'עגולה',lounge:'עור ועץ'},lamp:{arc:'קשת',read:'קריאה',ceramic:'קרמיקה'},mat:{marble:'שיש',wood:'עץ',brass:'פליז'}};
function cornerSvg(c){
  const k='stroke="#1A3A35" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';
  let s=`<rect width="600" height="420" fill="#F7F0E4"/><rect y="320" width="600" height="100" fill="#E3CBA6"/>`;
  for(let x=-40;x<600;x+=90)s+=`<line x1="${x}" y1="420" x2="${x+60}" y2="320" stroke="#D3B88E" stroke-width="2"/>`;
  s+=`<rect y="312" width="600" height="10" fill="#E9DFCC"/>`;
  if(c.focal==='window')s+=`<path d="M330 300 V120 a100 100 0 0 1 200 0 V300 Z" fill="#DCEBEE" ${k}/><path d="M334 300 C380 250 430 268 526 236 V300 Z" fill="#9DB39A"/><path d="M334 300 C400 270 470 286 526 270 V300Z" fill="#7E9C79"/><line x1="430" y1="22" x2="430" y2="300" ${k}/><line x1="330" y1="190" x2="530" y2="190" ${k}/><path d="M330 300 V120 a100 100 0 0 1 200 0 V300 Z" fill="none" ${k}/>`;
  if(c.focal==='art')s+=`<rect x="340" y="70" width="180" height="200" fill="#B08A3E" ${k}/><rect x="356" y="86" width="148" height="168" fill="#F3EAD7"/><circle cx="410" cy="150" r="42" fill="#C65A3C"/><rect x="430" y="170" width="58" height="66" fill="#E0A63A"/><path d="M370 236 Q420 196 470 120" fill="none" stroke="#14474A" stroke-width="10" stroke-linecap="round"/>`;
  if(c.focal==='fire'){s+=`<rect x="330" y="110" width="200" height="210" fill="#D9D2C3" ${k}/>`;for(let i=0;i<14;i++){const x=345+(i%5)*38,y=125+Math.floor(i/5)*34;s+=`<ellipse cx="${x}" cy="${y}" rx="16" ry="11" fill="#C9C0AE" stroke="#1A3A35" stroke-width="2"/>`}
    s+=`<rect x="320" y="104" width="220" height="14" fill="#8B5A2B" ${k}/><rect x="375" y="215" width="110" height="105" fill="#2E2622" ${k}/><path d="M400 318 q8 -40 22 -18 q6 -34 18 -4 q12 -26 18 18 z" fill="#E0A63A"/><path d="M414 318 q8 -22 16 -6 q6 -16 12 6 z" fill="#C65A3C"/>`}
  if(c.lamp==='arc')s+=`<ellipse cx="80" cy="402" rx="34" ry="9" fill="#14474A" ${k}/><path d="M80 400 V230 Q80 70 240 90" fill="none" stroke="#14474A" stroke-width="7" stroke-linecap="round"/><path d="M212 84 a32 32 0 0 1 64 0 z" fill="#E0A63A" ${k}/><ellipse cx="244" cy="88" rx="10" ry="5" fill="#FFF4C8"/>`;
  if(c.lamp==='read')s+=`<ellipse cx="90" cy="402" rx="30" ry="8" fill="#14474A" ${k}/><line x1="90" y1="400" x2="90" y2="170" stroke="#14474A" stroke-width="7"/><circle cx="90" cy="172" r="7" fill="#E0A63A" ${k}/><line x1="90" y1="172" x2="170" y2="120" stroke="#14474A" stroke-width="7" stroke-linecap="round"/><path d="M150 108 l44 -12 l14 40 l-52 10 z" fill="#14474A" ${k}/><path d="M160 145 l46 -9" stroke="#E0A63A" stroke-width="6"/>`;
  const tableTop={marble:'#F5F5F1',wood:'#C99A63',brass:'#D9A93B'}[c.mat];
  s+=`<rect x="285" y="292" width="120" height="16" rx="6" fill="${tableTop}" ${k}/>`;
  if(c.mat==='marble')s+=`<path d="M296 300 q20 -6 40 2 t40 -4" fill="none" stroke="#A9A9A2" stroke-width="2"/><rect x="335" y="308" width="20" height="80" fill="#EDEDE8" ${k}/><ellipse cx="345" cy="392" rx="36" ry="8" fill="#F5F5F1" ${k}/>`;
  if(c.mat==='wood')s+=`<line x1="298" y1="308" x2="292" y2="396" ${k}/><line x1="392" y1="308" x2="398" y2="396" ${k}/><line x1="320" y1="308" x2="316" y2="390" ${k}/><line x1="372" y1="308" x2="376" y2="390" ${k}/>`;
  if(c.mat==='brass')s+=`<line x1="300" y1="308" x2="330" y2="396" stroke="#B88A2E" stroke-width="5"/><line x1="390" y1="308" x2="360" y2="396" stroke="#B88A2E" stroke-width="5"/><line x1="345" y1="308" x2="345" y2="396" stroke="#B88A2E" stroke-width="5"/>`;
  if(c.lamp==='ceramic')s+=`<path d="M330 292 q-14 -30 6 -50 h18 q20 20 6 50 z" fill="#C65A3C" ${k}/><path d="M314 242 l12 -48 h38 l12 48 z" fill="#F3EAD7" ${k}/>`;
  if(c.chair==='wing')s+=`<path d="M120 210 q0 -60 30 -70 q20 -18 40 -4 q22 -14 42 4 q30 10 30 70 v60 h-142 z" fill="#C65A3C" ${k}/><path d="M104 250 q-4 -36 26 -38 q20 2 20 30 v60 h-46 z" fill="#C65A3C" ${k}/><path d="M276 250 q4 -36 -26 -38 q-20 2 -20 30 v60 h46 z" fill="#C65A3C" ${k}/><rect x="146" y="262" width="88" height="36" rx="10" fill="#D97B5E" ${k}/><path d="M112 310 h156 v14 h-156 z" fill="#9E3F25" ${k}/><path d="M122 324 q-6 40 6 66 M258 324 q6 40 -6 66" fill="none" stroke="#9E3F25" stroke-width="8" stroke-linecap="round"/>`;
  if(c.chair==='barrel')s+=`<path d="M108 232 q0 -82 82 -82 q82 0 82 82 v74 h-164 z" fill="#4F7A5C" ${k}/><path d="M128 238 q0 -62 62 -62 q62 0 62 62 v24 h-124 z" fill="#5E8C6A" ${k}/><rect x="124" y="262" width="132" height="36" rx="14" fill="#6E9C78" ${k}/><line x1="128" y1="306" x2="124" y2="380" stroke="#B88A2E" stroke-width="7" stroke-linecap="round"/><line x1="252" y1="306" x2="256" y2="380" stroke="#B88A2E" stroke-width="7" stroke-linecap="round"/>`;
  if(c.chair==='lounge')s+=`<path d="M112 300 l26 -150 h100 l26 150" fill="none" stroke="#8B5A2B" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><rect x="140" y="160" width="96" height="104" rx="18" fill="#6B3E26" ${k}/><rect x="118" y="262" width="140" height="38" rx="14" fill="#7A472C" ${k}/><line x1="122" y1="300" x2="112" y2="390" stroke="#8B5A2B" stroke-width="10" stroke-linecap="round"/><line x1="254" y1="300" x2="264" y2="390" stroke="#8B5A2B" stroke-width="10" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" role="img" aria-label="פינת קריאה שעיצבת">${s}</svg>`;
}
function cornerSentence(c){return 'פינת קריאה שפונה אל '+CORNER.focal[c.focal]+', עם '+CORNER.chair[c.chair]+', '+CORNER.lamp[c.lamp]+' ושולחן צד מ'+CORNER.mat[c.mat]+'.'}
window.Salon.drawNote=function(it){
  if(it.kind==='plan'){const s=P.staticPlan(it.layout,{labels:false});return s}
  if(it.kind==='corner'){const d=h('div',{html:cornerSvg(it.choice)});return d.firstChild}
  return null;
};

/* ---------- המסכים ---------- */
const screens=[
{id:'name',title:'ברוכה הבאה לסלון',skip:S=>!!S.name,hideNext:true,
 say:'ברוכה הבאה לסלון. לפני שנכנסים: איך לקרוא לך? כתבי את השם בתיבה, ולחצי על שמרי והמשיכי.',
 mount(el,ctx){
  const inp=h('input',{id:'nm',type:'text',autocomplete:'given-name',maxlength:30});
  const go=()=>{const v=inp.value.trim();if(!v){inp.focus();sayBox(form,'כתבי את השם שלך בתיבה.',true);return}ctx.S.name=v;ctx.save();ctx.next()};
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')go()});
  const form=h('div',{class:'field',style:'margin:18px auto 0;text-align:right'},h('label',{for:'nm'},'איך לקרוא לך?'),inp,
    h('button',{class:'cta',type:'button',style:'margin-top:8px;justify-self:start',onclick:go,html:'שמרי והמשיכי'+ICON.arrowL}),
    h('p',{class:'note',style:'margin:4px 0 0'},'השם נשמר רק במחשב הזה.'));
  el.append(h('div',{class:'center'},h('div',null,h('img',{src:'assets/img/logo-full.png',alt:'',style:'width:min(170px,40vw);height:auto'}),
    h('h1',null,'ברוכה הבאה לסלון'),h('p',{class:'lede'},'לפני שנכנסים: איך לקרוא לך?'),form)));
  setTimeout(()=>inp.focus(),300);
 }},

{id:'open',title:'מבית לחלל חלומות',
 say:'ברוכה הבאה, {name}. מבית לחלל חלומות. היום את נכנסת לסלון של וילה. תגלי איך מעצבים מתכננים חלל שנעים לשבת בו ונוח לעבור בו, ואחר כך תסדרי אותו בעצמך, רהיט אחרי רהיט.',
 mount(el,ctx){
  el.append(split(arch(photo('open',900,1125),credit('open')),
    h('span',{class:'kicker'},'מפגש ראשון'),h('h1',null,'מבית לחלל חלומות'),
    h('p',{class:'greet'},'ברוכה הבאה, '+ctx.name+'.'),
    h('p',{class:'lede'},'היום את נכנסת לסלון של וילה. תגלי איך מעצבים מתכננים חלל שנעים לשבת בו ונוח לעבור בו, ואחר כך תסדרי אותו בעצמך, רהיט אחרי רהיט.'),
    h('div',{class:'meta'},h('span',null,'כחצי שעה'),h('span',null,'סלון לעיצוב בעצמך'),h('span',null,'חדר שמסתובב סביבך')),
    h('button',{class:'cta',type:'button',onclick:ctx.next,html:'בואי נתחיל'+ICON.arrowL})));
 }},

{id:'door',title:'הדלת נפתחת',
 text:'כשנכנסים לווילה מעוצבת, הדבר הראשון שמרגישים הוא לא הרהיטים. זה האוויר, האור והשקט. לחצי על הדלת והיכנסי.',
 mount(el,ctx){
  const d=photo('door',900,1125);const inside=photo('lounge',900,1125);inside.style.cssText='position:absolute;inset:0;opacity:0;transition:opacity 1.1s ease,transform 1.6s ease;transform:scale(1.18)';
  d.style.transition='transform 1.4s ease,opacity 1.1s ease';
  const cr=h('div',{class:'credit'},'צילום: ',h('span',{class:'en'},IMG.door.by),', ',h('span',{class:'en'},'Unsplash'));
  const btn=h('button',{type:'button',style:'all:unset;cursor:pointer;display:block;position:relative;height:100%','aria-label':'פתחי את הדלת'},d,inside);
  const msg=h('div');
  const open=()=>{if(ctx.data.open)return;ctx.data.open=true;ctx.save();d.style.transform='scale(1.35)';d.style.opacity='0';inside.style.opacity='1';inside.style.transform='scale(1)';
    cr.replaceChildren('צילום: ',h('span',{class:'en'},IMG.lounge.by),', ',h('span',{class:'en'},'Unsplash'));
    sayBox(msg,'<b>ברוכה הבאה לווילה.</b> שימי לב לתחושה: הרבה אור, תקרה גבוהה ומבט שרץ עד הגן.');ctx.done()};
  btn.addEventListener('click',open);
  el.append(split(arch(btn,cr),h('span',{class:'kicker'},'סיפור פתיחה'),h('h2',null,'הדלת נפתחת'),
    h('p',{class:'lede'},'כשנכנסים לווילה מעוצבת, הדבר הראשון שמרגישים הוא לא הרהיטים. זה האוויר, האור והשקט.'),
    h('button',{class:'cta terra',type:'button',onclick:open},'לחצי על הדלת והיכנסי'),msg));
  if(ctx.data.open){ctx.data.open=false;open()}
 }},

{id:'feel',task:'איפה היית רוצה לשבת עכשיו, עם כוס קפה? לחצי על אחת התמונות.',title:'איך תרגישי בתוכו?',wide:true,
 text:'מעצבים טובים לא שואלים קודם מה להכניס לחדר. הם שואלים איך ירגישו בתוכו. איפה היית רוצה לשבת עכשיו, עם כוס קפה? לחצי על אחת התמונות.',
 mount(el,ctx){
  const opts=[['seat1','ליד החלון'],['seat2','פינה מוארת'],['seat3','מול הבריכה']];
  const res=h('div');
  const cards=h('div',{class:'cards'},...opts.map(([k,l])=>h('button',{type:'button',class:'card','aria-pressed':String(ctx.data.pick===k),onclick:e=>{
      ctx.data.pick=k;ctx.save();cards.querySelectorAll('.card').forEach(c=>c.setAttribute('aria-pressed',String(c===e.currentTarget)));
      sayBox(res,'<b>בחירה של מעצבת.</b> שמת לב? בכל אחת מהפינות יש אור, מבט פתוח ומקום לעבור. אלה בדיוק הכללים שנלמד היום.');ctx.done()}},
    photo(k,700,525),h('div',{class:'cap'},l,h('span',{class:'cr'},'צילום: '+IMG[k].by+', Unsplash')))));
  el.append(head('איך זה מרגיש','איך תרגישי בתוכו?','מעצבים טובים לא שואלים קודם מה להכניס לחדר. הם שואלים איך ירגישו בתוכו. איפה היית רוצה לשבת עכשיו, עם כוס קפה?'),cards,res);
  if(ctx.data.pick)sayBox(res,'<b>בחירה של מעצבת.</b> בכל אחת מהפינות יש אור, מבט פתוח ומקום לעבור.');
 }},

{id:'flow',task:'לחצי וראי את השביל.',title:'כלל 1: זרימה',
 text:'זרימה, ובאנגלית Space Flow, היא הדרך שעוברים בה בחדר: מהכניסה אל הספה, ומהספה אל המרפסת. בסלון של וילה השביל הזה פנוי ורחב, ואין צורך לעקוף רהיט. לחצי וראי את השביל.',
 mount(el,ctx){
  const svg=P.staticPlan(P.SOLUTION.window,{showPath:false});const box=h('div',{class:'planbox'},svg);
  const show=()=>{if(svg.querySelector('.pathline'))return;const pl=P.pathLine();pl.style.cssText='stroke-dashoffset:700;transition:stroke-dashoffset 2.4s ease';svg.insertBefore(pl,svg.querySelector('g'));requestAnimationFrame(()=>requestAnimationFrame(()=>pl.style.strokeDashoffset='0'));
    ctx.data.seen=true;ctx.save();sayBox(cp,'<b>זה השביל.</b> מהכניסה ועד המרפסת, בלי לעקוף אף רהיט. הסלון מסודר מעליו, והמעבר נשאר חופשי.');ctx.done()};
  const cp=h('div',{class:'copy'},h('span',{class:'kicker'},'כלל 1'),h('h2',null,'זרימה'),
    h('p',{class:'lede',html:'<span class="term">זרימה</span> (<span class="en">Space Flow</span>) היא הדרך שעוברים בה בחדר: מהכניסה אל הספה, ומהספה אל המרפסת. בסלון של וילה השביל הזה פנוי ורחב, ואין צורך לעקוף רהיט.'}),
    h('button',{class:'cta',type:'button',onclick:show},'הראי לי את השביל'));
  el.append(h('div',{class:'split'},box,cp));
  if(ctx.data.seen)show();
 }},

{id:'width',task:'הזיזי את הכורסה עד שהסרגל יהפוך לירוק.',title:'כמה רחב שביל נוח?',
 text:'כמה רחב שביל נוח? בתקני תכנון מקובלים, מעבר נוח בין רהיטים רחב כ־90 סנטימטרים לפחות. הזיזי את הכורסה עד שהסרגל יהפוך לירוק.',
 mount(el,ctx){
  let gap=ctx.data.gap||50;
  const NS='http://www.w3.org/2000/svg';const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 760 300');svg.setAttribute('role','img');
  const readout=h('div',{class:'width-read'});
  function draw(){
    const good=gap>=90;const col=good?'#14474A':'#B0472B';const ax=330+gap;
    svg.innerHTML=`<rect width="760" height="300" rx="16" fill="#E9D7B6"/>
     <g transform="translate(60 60)"><rect width="270" height="180" rx="18" fill="#EFE6D6" stroke="#1A3A35" stroke-width="4"/><rect width="40" height="180" rx="14" fill="#DCCDB4" stroke="#1A3A35" stroke-width="3"/><rect x="230" width="40" height="180" rx="14" fill="#DCCDB4" stroke="#1A3A35" stroke-width="3"/><text x="135" y="100" text-anchor="middle" font-family="Assistant, Arial" font-size="26" font-weight="700" fill="#1A3A35">ספה</text></g>
     <g transform="translate(${ax} 80)" style="cursor:ew-resize" id="ch"><rect width="150" height="150" rx="24" fill="#C65A3C" stroke="#1A3A35" stroke-width="4"/><rect x="24" y="20" width="102" height="96" rx="14" fill="#D97B5E" stroke="#1A3A35" stroke-width="2"/><text x="75" y="76" text-anchor="middle" font-family="Assistant, Arial" font-size="24" font-weight="700" fill="#fff">כורסה</text></g>
     <line x1="334" y1="270" x2="${ax-4}" y2="270" stroke="${col}" stroke-width="5"/><path d="M344 260 l-10 10 l10 10 M${ax-14} 260 l10 10 l-10 10" stroke="${col}" stroke-width="5" fill="none"/>
     <g transform="translate(${330+gap/2} 150)" opacity="${good?1:.45}"><ellipse cx="-11" cy="-14" rx="9" ry="16" fill="${col}"/><ellipse cx="11" cy="14" rx="9" ry="16" fill="${col}"/></g>`;
    readout.textContent=gap+' ס"מ';readout.className='width-read '+(good?'good':'bad');
    ctx.data.gap=gap;ctx.save();
    if(good){sayBox(msg,'<b>עכשיו אפשר לעבור בנוחות</b>, בלי לגעת ברהיטים. זה הרוחב שמעצבים שומרים בכל שביל ראשי.');ctx.done()}else msg.replaceChildren();
    const ch=svg.querySelector('#ch');ch.addEventListener('pointerdown',drag);
  }
  function drag(e){e.preventDefault();const start=e.clientX,g0=gap;const k=760/svg.getBoundingClientRect().width;
    const mv=ev=>{gap=Math.max(40,Math.min(140,Math.round((g0+(ev.clientX-start)*k)/10)*10));draw()};
    const up=()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up)};window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up)}
  const msg=h('div');
  el.append(h('div',{class:'split'},h('div',{class:'planbox'},svg),h('div',{class:'copy'},h('span',{class:'kicker'},'המספר של היום'),h('h2',null,'כמה רחב שביל נוח?'),
    h('p',{class:'lede'},'בתקני תכנון מקובלים, מעבר נוח בין רהיטים רחב כ־90 ס"מ לפחות. הזיזי את הכורסה עד שהסרגל יהפוך לירוק.'),
    h('div',{class:'row'},readout,h('button',{class:'btn',type:'button',onclick:()=>{gap=Math.max(40,gap-10);draw()}},'צמצמי'),h('button',{class:'btn solid',type:'button',onclick:()=>{gap=Math.min(140,gap+10);draw()}},'הרחיבי את המעבר')),msg)));
  draw();
 }},

{id:'sight',task:'גררי את הסרגל ופתחי את המבט.',title:'כלל 2: קו מבט',wide:true,
 text:'קו מבט, ובאנגלית Sightlines, הוא מה שהעין רואה כשנכנסים. כשהמבט רץ מהדלת עד הגינה, החדר מרגיש גדול יותר. גררי את הסרגל, ופתחי את המבט.',
 mount(el,ctx){
  const before=h('div',{style:'position:relative;width:100%;height:100%'},photo('lounge',1200,800),h('div',{style:'position:absolute;inset:0'},bookcase()));
  const res=h('div');
  const cmp=compare(before,photo('lounge',1200,800),{chrome:40,start:ctx.data.cut!=null?ctx.data.cut:20,onMove:v=>{ctx.data.cut=v;ctx.save();if(v>=80&&!ctx.data.ok){ctx.data.ok=true;ctx.save()}if(v>=80){sayBox(res,'<b>המבט נפתח.</b> אותו חדר בדיוק, אבל עכשיו העין רצה עד הגן, והחלל מרגיש כפול.');ctx.done()}}});
  el.append(h('div',{class:'split media'},h('div',null,cmp,h('div',{class:'note',style:'margin-top:6px'},'צילום: ',h('span',{class:'en'},IMG.lounge.by+', Unsplash'),'. המדף מצויר לצורך ההמחשה')),
    h('div',{class:'copy'},h('span',{class:'kicker'},'כלל 2'),h('h2',null,'קו מבט'),
      h('p',{class:'lede',html:'<span class="term">קו מבט</span> (<span class="en">Sightlines</span>) הוא מה שהעין רואה כשנכנסים. כשהמבט רץ מהדלת עד הגינה, החדר מרגיש גדול יותר. גררי את הסרגל ופתחי את המבט.'}),
      h('div',{class:'row'},h('button',{class:'btn',type:'button',onclick:()=>cmp.setTo(0)},'הראי לפני'),h('button',{class:'btn solid',type:'button',onclick:()=>cmp.setTo(100)},'הראי אחרי')),res)));
 }},

{id:'focal',task:'לחצי על מוקד העניין בתמונה.',title:'כלל 3: מוקד עניין',wide:true,
 text:'מוקד עניין, ובאנגלית Focal Point, הוא המקום שהעין נחה עליו ראשון: חלון אל הנוף, קיר אבן או יצירת אמנות. הרהיטים מסודרים כך שיפנו אליו. לחצי על מוקד העניין בתמונה.',
 mount(el,ctx){hotspot(el,ctx,{img:'win',zone:{x:37,y:18,w:19,h:74},kicker:'כלל 3',title:'מוקד עניין',
   lede:'<span class="term">מוקד עניין</span> (<span class="en">Focal Point</span>) הוא המקום שהעין נחה עליו ראשון: חלון אל הנוף, קיר אבן או יצירת אמנות. הרהיטים מסודרים כך שיפנו אליו. לחצי על מוקד העניין בתמונה.',
   right:'<b>בדיוק.</b> דלת הזכוכית אל הגן היא מוקד העניין. שימי לב איך שתי הכורסאות מסודרות משני צדיה, כמו מסגרת.',
   hint:'כמעט. חפשי את המקום הבהיר ביותר בתמונה, זה שהעין בורחת אליו.'})}},

{id:'focal2',task:'איפה העין שלך נחה ראשון? לחצי עליו בתמונה.',title:'תרגול: מצאי את המוקד',wide:true,
 text:'ועכשיו בסלון אחר. הפעם המוקד שונה. איפה העין שלך נחה ראשון? לחצי עליו בתמונה.',
 mount(el,ctx){hotspot(el,ctx,{img:'fire',zone:{x:17,y:3,w:31,h:72},kicker:'תרגול',title:'מצאי את המוקד',
   lede:'ועכשיו בסלון אחר. הפעם המוקד שונה. איפה העין שלך נחה ראשון?',
   right:'<b>עין של מעצבת.</b> קיר האבן עם האח הוא מוקד העניין, והספה והשולחן מסודרים מולו.',
   hint:'נסי שוב. חפשי את הקיר שהכי שונה מכל השאר.'})}},

{id:'focus',title:'רגע היסטורי: המילה Focus',
 text:'הידעת מאיפה הגיעה המילה Focus? בלטינית, השפה של רומא, פירושה אח: המקום שבו בוערת האש בבית. כלומר, מוקד העניין הראשון של הבית היה האש. לחצי על הכרטיס.',
 mount(el,ctx){
  const fl=h('button',{type:'button',class:'flip'+(ctx.data.flipped?' on':''),style:'--h:200px;width:100%','aria-label':'הפכי את הכרטיס'},
    h('div',{class:'in'},h('div',{class:'f'},h('div',{class:'tap'},'לחצי כדי להפוך'),h('div',{class:'q'},'מה עוד אמרה המילה Focus ברומא?')),
      h('div',{class:'b'},h('div',{style:'font:900 32px/1.2 var(--serif)'},'בית ומשפחה.'),h('div',{style:'font-size:21px'},'האש הייתה הלב של הבית, והמשפחה התאספה סביבה. גם היום, הישיבה בסלון מתאספת סביב המוקד.'))));
  fl.addEventListener('click',()=>{fl.classList.toggle('on');ctx.data.flipped=fl.classList.contains('on');ctx.save();ctx.done()});
  const img=h('img',{src:MET.src,alt:MET.alt});
  el.append(split(arch(img,h('div',{class:'credit'},MET.credit+'. ',h('a',{href:MET.url,target:'_blank',rel:'noopener'},'לדף היצירה'))),
    h('span',{class:'kicker'},'רגע היסטורי'),h('h2',null,'המילה Focus'),
    h('p',{class:'lede'},'הידעת מאיפה הגיעה המילה Focus? בלטינית, השפה של רומא, פירושה אח: המקום שבו בוערת האש בבית. כלומר, מוקד העניין הראשון של הבית היה האש.'),
    fl,h('p',{class:'note',style:'margin-top:12px'},'בתמונה: חדר מווילה רומית ליד פומפיי, ששוחזר במוזיאון בניו יורק.')));
 }},

{id:'roman',title:'רגע היסטורי: הבית הרומי',
 text:'וגם קו המבט הגיע מרומא. בבית פנסה בפומפיי עובר ציר ישר: מהכניסה, דרך האטריום, האולם המרכזי של הבית, ועד חצר העמודים. מי שעמד בכניסה ראה את כל עומק הבית. לחצי על הכפתור, והדליקי את הציר.',
 mount(el,ctx){
  const NS='http://www.w3.org/2000/svg';const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 420 600');svg.setAttribute('role','img');svg.setAttribute('aria-label','תוכנית מאוירת של בית רומי: כניסה, אטריום וחצר עמודים');svg.style.cssText='width:100%;max-height:56vh;display:block';
  let cols='';for(let i=0;i<6;i++){cols+=`<circle cx="${95+i*46}" cy="70" r="8" fill="#F7F0E4" stroke="#1A3A35" stroke-width="3"/><circle cx="${95+i*46}" cy="210" r="8" fill="#F7F0E4" stroke="#1A3A35" stroke-width="3"/>`}
  for(let j=1;j<3;j++){cols+=`<circle cx="95" cy="${70+j*46.6}" r="8" fill="#F7F0E4" stroke="#1A3A35" stroke-width="3"/><circle cx="325" cy="${70+j*46.6}" r="8" fill="#F7F0E4" stroke="#1A3A35" stroke-width="3"/>`}
  svg.innerHTML=`<rect x="40" y="20" width="340" height="540" fill="#E9D7B6" stroke="#1A3A35" stroke-width="6"/>
   <rect x="70" y="45" width="280" height="190" fill="#C9D8C2" stroke="#1A3A35" stroke-width="3"/><rect x="120" y="95" width="180" height="90" fill="#9DB39A"/>${cols}
   <rect x="150" y="255" width="120" height="70" fill="#EFE2C6" stroke="#1A3A35" stroke-width="3"/>
   <rect x="90" y="340" width="240" height="160" fill="#F2E6CC" stroke="#1A3A35" stroke-width="3"/><rect x="175" y="395" width="70" height="50" fill="#8FB3C2" stroke="#1A3A35" stroke-width="3"/>
   <rect x="185" y="500" width="50" height="60" fill="#F2E6CC" stroke="#1A3A35" stroke-width="3"/>
   <line id="ax" x1="210" y1="575" x2="210" y2="60" stroke="#E0A63A" stroke-width="12" stroke-linecap="round" stroke-dasharray="520" stroke-dashoffset="520" style="transition:stroke-dashoffset 2.2s ease"/>
   <g font-family="Assistant, Arial" font-weight="700" font-size="21" fill="#1A3A35" text-anchor="middle">
    <text x="210" y="140">חצר העמודים</text><text x="210" y="380">אטריום</text><text x="210" y="595">כניסה</text></g>`;
  const light=()=>{svg.querySelector('#ax').style.strokeDashoffset='0';ctx.data.lit=true;ctx.save();sayBox(cp,'<b>זה הציר.</b> מהכניסה ועד הגן, בקו אחד. בדיוק כמו המבט מהדלת עד הבריכה בווילה שראית בתחילת המפגש.');ctx.done()};
  const cp=h('div',{class:'copy'},h('span',{class:'kicker'},'רגע היסטורי'),h('h2',null,'הבית הרומי'),
    h('p',{class:'lede',html:'וגם קו המבט הגיע מרומא. בבית פנסה בפומפיי עובר ציר ישר: מהכניסה, דרך ה<span class="term">אטריום</span> (<span class="en">Atrium</span>), האולם המרכזי של הבית, ועד חצר העמודים. מי שעמד בכניסה ראה את כל עומק הבית.'}),
    h('button',{class:'cta',type:'button',onclick:light},'הדליקי את הציר'));
  el.append(h('div',{class:'split'},h('div',{class:'planbox',style:'max-width:440px;justify-self:center;position:relative'},svg,h('span',{class:'ai-tag',style:'left:auto;right:10px'},'המחשה')),cp));
  if(ctx.data.lit)setTimeout(light,200);
 }},

{id:'materials',task:'מייני את החומרים: לחצי על חומר, ואז על הסל המתאים.',title:'כלל 4: חם לצד קר',wide:true,
 text:'החומרים סביבנו משפיעים על מצב הרוח. שיש, זכוכית ומתכת מרגישים קרירים ונקיים. עץ, קטיפה וצמר מרגישים חמים ועוטפים. סלון יוקרתי משלב את שניהם. מייני את החומרים: לחצי על חומר, ואז על הסל המתאים.',
 mount(el,ctx){
  const M=[['marble','שיש','cold'],['glass','זכוכית','cold',1],['metal','מתכת','cold',1],['wood','עץ','warm'],['velvet','קטיפה','warm',1],['wool','צמר','warm']];
  const placed=ctx.data.placed||(ctx.data.placed={});let pick=null;
  const res=h('div');
  const sw={};const row=h('div',{class:'sort'},...M.map(([k,l])=>sw[k]=h('button',{type:'button',class:'sw',draggable:'true','aria-pressed':'false',
      onclick:()=>{if(placed[k])return;pick=k;Object.values(sw).forEach(b=>b.setAttribute('aria-pressed',String(b===sw[k])))},
      ondragstart:e=>{pick=k;e.dataTransfer.setData('text/plain',k)}},photo(k,300,300),h('span',null,l))));
  const mkBin=(cls,title,icon)=>{const got=h('div',{class:'got'});const b=h('button',{type:'button',class:'bin '+cls,onclick:()=>drop(cls),
      ondragover:e=>{e.preventDefault();b.classList.add('over')},ondragleave:()=>b.classList.remove('over'),ondrop:e=>{e.preventDefault();b.classList.remove('over');pick=e.dataTransfer.getData('text/plain')||pick;drop(cls)}},
      h('h3',null,icon,title),got);b.got=got;return b};
  const bins={cold:mkBin('cold','קריר ונקי','❄ '),warm:mkBin('warm','חם ועוטף','☼ ')};
  function drop(cls){if(!pick){sayBox(res,'קודם לחצי על אחד החומרים למעלה.',true);return}
    const m=M.find(x=>x[0]===pick);if(m[2]!==cls){sayBox(res,m[1]+(m[3]?' מרגישה ':' מרגיש ')+(m[2]==='cold'?(m[3]?'קרירה וחלקה':'קריר וחלק'):(m[3]?'רכה וחמה':'רך וחם'))+' במגע. נסי את הסל השני.',true);return}
    placed[pick]=cls;ctx.save();refresh();pick=null;
    if(Object.keys(placed).length===M.length){sayBox(res,'<b>מושלם.</b> ועכשיו הסוד: בסלון יוקרתי הם תמיד יחד. שולחן שיש על שטיח צמר, ספת קטיפה ליד חלון זכוכית.');ctx.done()}
    else sayBox(res,'נכון. המשיכי.')}
  function refresh(){for(const [k,,c] of M){sw[k].classList.toggle('placed',!!placed[k]);sw[k].setAttribute('aria-pressed','false');sw[k].disabled=!!placed[k]}
    for(const c of ['cold','warm'])bins[c].got.replaceChildren(...M.filter(m=>placed[m[0]]===c).map(m=>photo(m[0],120,120)))}
  el.append(head('כלל 4','חם לצד קר','שיש, זכוכית ומתכת מרגישים קרירים ונקיים. עץ, קטיפה וצמר מרגישים חמים ועוטפים. מייני את החומרים: לחצי על חומר, ואז על הסל המתאים.'),
    row,h('div',{class:'bins'},bins.cold,bins.warm),res,h('p',{class:'note',style:'margin-top:8px'},'צילומים: Unsplash'));
  refresh();
 }},

{id:'pano',task:'גררי את התמונה עם העכבר, או לחצי על החיצים, כדי להסתובב. מצאי את שלוש הנקודות המהבהבות.',title:'חדר שמסתובב סביבך',wide:true,skip:()=>!panoOK,
 text:'עכשיו את עומדת באמצע סלון. גררי את התמונה עם העכבר, או לחצי על החיצים, כדי להסתובב. מצאי את שלוש הנקודות המהבהבות: השביל, קו המבט ומוקד העניין.',
 mount(el,ctx){
  const found=ctx.data.found||(ctx.data.found={});
  const box=h('div',{class:'pano',id:'pano',style:'height:min(calc(var(--room,520px) - 170px),600px)'});const counter=h('span',{class:'counter'});const res=h('div',{class:'pano-wrap'},box);
  let viewer=null;
  const upd=()=>{const n=Object.keys(found).length;counter.textContent='מצאת '+n+' מתוך 3';if(n===3){sayBox(res,'<b>מצאת את כולן. עין של מעצבת.</b> שביל, מבט ומוקד, באותו חדר.');ctx.done()}};
  function mk(spot){return (div)=>{div.classList.add('hs');if(found[spot.id])div.classList.add('found');div.setAttribute('role','button');div.setAttribute('aria-label',spot.title);
    div.addEventListener('click',()=>{found[spot.id]=true;ctx.save();div.classList.add('found');sayBox(res,'<b>'+spot.title+'.</b> '+spot.text);upd()})}}
  function start(){
    if(!window.pannellum){box.replaceChildren(h('p',{style:'color:#fff;padding:30px'},'החדר לא נטען. בדקי שהמחשב מחובר לאינטרנט.'));return}
    viewer=pannellum.viewer(box,{type:'equirectangular',panorama:PANO.src,autoLoad:true,showControls:false,hfov:105,yaw:-35,pitch:-5,compass:false,mouseZoom:false,keyboardZoom:false,
      hotSpots:PANO.spots.map(s=>({pitch:s.pitch,yaw:s.yaw,cssClass:'hs-wrap',createTooltipFunc:mk(s)}))});
    viewer.on('error',()=>box.replaceChildren(h('p',{style:'color:#fff;padding:30px'},'החדר לא נטען. נסי לרענן את הדף.')));
  }
  const turn=d=>{if(viewer)viewer.setYaw(viewer.getYaw()+d,800)};
  const next=()=>{const s=PANO.spots.find(s=>!found[s.id])||PANO.spots[0];if(viewer)viewer.lookAt(s.pitch,s.yaw,100,1000)};
  el.append(h('div',{class:'head',style:'align-items:center'},h('h2',{style:'margin:0'},'חדר שמסתובב סביבך'),h('p',{class:'lede',style:'margin:0;max-width:62ch'},'גררי את התמונה, או לחצי על החיצים. מצאי שלוש נקודות מהבהבות: השביל, קו המבט ומוקד העניין.')),
    res,h('div',{class:'row',style:'margin-top:10px;justify-content:space-between'},
      h('div',{class:'row'},h('button',{class:'btn',type:'button',onclick:()=>turn(45),'aria-label':'סובבי ימינה'},'→ ימינה'),h('button',{class:'btn',type:'button',onclick:()=>turn(-45),'aria-label':'סובבי שמאלה'},'שמאלה ←'),
        h('button',{class:'btn solid',type:'button',onclick:next},'קחי אותי לנקודה הבאה')),
      h('div',{class:'row'},counter,h('span',{class:'note'},'צילום 360°: ',h('span',{class:'en'},PANO.credit)))));
  upd();setTimeout(start,50);
  return ()=>{try{viewer&&viewer.destroy()}catch(e){}};
 }},

{id:'brief',title:'את המעצבת',
 text:'בעלי הווילה הזמינו אותך. הבקשה שלהם: שביל פנוי מהכניסה אל המרפסת, ישיבה שפונה אל מוקד העניין, ושילוב של חומרים חמים וקרים. הרהיטים כבר בחדר, אבל הם מפוזרים.',
 mount(el,ctx){
  el.append(split(arch(photo('villa',900,1125),credit('villa'),{back:'var(--lead)'}),
    h('span',{class:'kicker'},'הפרויקט שלך'),h('h2',null,'את המעצבת'),
    h('div',{class:'letter'},h('div',{class:'from'},'מכתב מבעלי הווילה'),
      h('p',{style:'margin:0'},ctx.name+' היקרה, הרהיטים כבר בסלון, אבל הם מפוזרים. נשמח שתסדרי אותו. שלוש בקשות:'),
      h('ul',null,h('li',null,'שביל פנוי מהכניסה אל המרפסת'),h('li',null,'ישיבה שפונה אל מוקד העניין'),h('li',null,'חם לצד קר, צמר ליד שיש'))),
    h('div',{style:'margin-top:18px'},h('button',{class:'cta terra',type:'button',onclick:ctx.next,html:'קבלי את הפרויקט'+ICON.arrowL}))));
 }},

{id:'planner',task:'גררי כל רהיט למקומו, או לחצי עליו והזיזי אותו בחצים.',title:'מתכנן הסלון',wide:true,
 text:'גררי כל רהיט למקומו, או לחצי עליו והזיזי אותו בחצים. הסרגל יראה לך את רוחב השביל. בחרי למעלה לאן תפנה הישיבה: אל החלון או אל האח.',
 mount(el,ctx){
  const host=h('div');el.append(host);
  P.planner(host,{layout:ctx.data.layout,focal:ctx.data.focal,solved:ctx.data.solved,
    onChange:st=>{Object.assign(ctx.data,st);ctx.save()},
    onSolved:()=>{ctx.data.solved=true;ctx.save();ctx.done()}});
  if(ctx.data.solved)ctx.done();
 }},

{id:'ba',task:'גררי את הסרגל ותראי את ההבדל.',title:'לפני ואחרי',wide:true,
 text:'זה הסלון שעיצבת. גררי את הסרגל כדי לראות איך הוא נראה לפני, ואיך הוא נראה עכשיו. כך נראה תכנון של מעצבת.',
 mount(el,ctx){
  const pl=ctx.all.planner||{};const after=pl.layout||P.START;
  const res=h('div');
  const cmp=compare(P.staticPlan(P.START,{measureLine:true}),P.staticPlan(after,{measureLine:true}),{start:50});
  cmp.style.aspectRatio='780/660';cmp.style.width='min(100%,calc((var(--room,520px) - 20px) * 1.18))';
  const saveIt=()=>{if(ctx.data.saved){window.Salon.toast('הסלון כבר שמור במחברת');return}ctx.notebook({kind:'plan',svg:true,title:'הסלון שעיצבתי',layout:after,focal:pl.focal||'window',text:pl.solved?'השביל פתוח, הישיבה פונה אל המוקד, והחם פוגש את הקר.':''});
    ctx.data.saved=true;ctx.save();sayBox(res,'<b>נשמר במחברת שלך.</b> אפשר לראות אותו בכל רגע, דרך התפריט.');ctx.done()};
  el.append(h('div',{class:'split'},cmp,h('div',{class:'copy'},h('span',{class:'kicker'},'לפני ואחרי'),h('h2',null,'זה הסלון שעיצבת'),
    h('p',{class:'lede'},pl.solved?'השביל פתוח, והישיבה פונה אל המוקד. גררי את הסרגל ותראי את ההבדל.':'גררי את הסרגל ותראי את ההבדל. אפשר תמיד לחזור למתכנן ולשפר.'),
    h('button',{class:'cta',type:'button',onclick:saveIt},'שמרי במחברת'),res)));
 }},

quiz('q1','בדיקה 1 מתוך 4','מה זה זרימה בחדר?',[['הדרך שעוברים בה בחדר, בלי לעקוף רהיטים',1],['כמות האור שנכנסת מהחלונות'],['הצבע שחוזר בכל החדר']],
  'נכון. זרימה היא השביל שהגוף עושה בחדר, מהכניסה ועד היציאה.','זרימה קשורה לתנועה. חשבי על השביל מהכניסה אל המרפסת.'),
quiz('q2','בדיקה 2 מתוך 4','מה רוחב מעבר נוח בין רהיטים?',[['כ־50 ס"מ'],['כ־70 ס"מ'],['כ־90 ס"מ לפחות',1]],
  'נכון. כ־90 ס"מ לפחות, כמו שראית בסרגל.','נזכיר: הסרגל הפך לירוק רק במספר גדול יותר.'),
quiz('q3','בדיקה 3 מתוך 4','מה מוקד העניין בתמונה?',[['הציור הגדול על הקיר',1],['הכרית על הספה'],['המנורה הקטנה']],
  'נכון. הציור הגדול מושך את העין ראשון, והספה מסודרת מולו.','חפשי את מה שהעין פוגשת ראשון, הדבר הגדול והבולט ביותר.','art'),
quiz('q4','בדיקה 4 מתוך 4','מה פירוש המילה Focus בלטינית?',[['אח, המקום שבו בוערת האש',1],['חלון'],['תמונה על הקיר']],
  'נכון. מוקד העניין הראשון של הבית היה האש.','רמז: חשבי על הלב החם של הבית הרומי.','met'),

{id:'corner',task:'בחרי לאן היא תפנה, כורסה, מנורה וחומר לשולחן הצד. כשתסיימי, לחצי על שמרי במחברת.',title:'משימה יצירתית: פינה משלך',wide:true,
 text:'עכשיו פינה משלך בווילה. בחרי לאן היא תפנה, כורסה, מנורה וחומר לשולחן הצד. כשתסיימי, לחצי על שמרי במחברת.',
 mount(el,ctx){
  const c=ctx.data.choice||(ctx.data.choice={focal:'window',chair:'wing',lamp:'read',mat:'marble'});
  const scene=h('div',{class:'scene'});const sent=h('p',{class:'lede',style:'margin:12px 0 0;max-width:none'});const res=h('div');
  const draw=()=>{scene.innerHTML=cornerSvg(c);sent.textContent=cornerSentence(c)};
  const grp=(key,label)=>h('div',{class:'grp'},h('b',null,label),h('div',{class:'chips sm'},...Object.entries(SHORT[key]).map(([k,v])=>h('button',{type:'button','aria-pressed':String(c[key]===k),
    onclick:e=>{c[key]=k;ctx.save();e.currentTarget.parentNode.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)));draw()}},v))));
  const saveIt=()=>{ctx.notebook({kind:'corner',svg:true,title:'פינת הקריאה שלי',choice:Object.assign({},c),text:cornerSentence(c)});ctx.data.saved=true;ctx.save();
    sayBox(res,'<b>נשמר במחברת.</b> '+ctx.name+', זו פינה של מעצבת: מוקד אחד, אור לקריאה, וחם לצד קר.');ctx.done()};
  el.append(head('משימה יצירתית','פינה משלך בווילה','בחרי לאן היא תפנה, כורסה, מנורה וחומר לשולחן הצד.'),
    h('div',{class:'builder'},h('div',null,scene,sent),h('div',{class:'opts'},grp('focal','מול'),grp('chair','כורסה'),grp('lamp','מנורה'),grp('mat','שולחן צד'),
      h('div',null,h('button',{class:'cta',type:'button',onclick:saveIt},'שמרי במחברת')),res)));
  draw();
 }},

{id:'home-idea',task:'כתבי שינוי קטן אחד שיעשה אותה עוד יותר שלך, או לחצי על דלגי.',title:'רעיון לבית',
 text:'רעיון לבית, וזה רשות. שבי רגע בפינה שהכי נעימה לך בבית. מה העין שלך פוגשת ראשון? זה מוקד העניין של הפינה. האם הדרך אליה פנויה? כתבי שינוי קטן אחד שיעשה אותה עוד יותר שלך.',
 mount(el,ctx){
  const ta=h('textarea',{id:'idea',maxlength:600},ctx.data.text||'');const res=h('div');
  const saveIt=()=>{const v=ta.value.trim();if(!v){sayBox(res,'כתבי רעיון קטן אחד, או לחצי על דלגי.',true);return}
    ctx.notebook({kind:'idea',title:'רעיון לבית',text:v});ctx.data.text=v;ctx.save();sayBox(res,'<b>נשמר במחברת.</b> רעיון קטן, הבדל גדול.');ctx.done()};
  const card=h('div',{class:'letter idea',style:'border-top-color:var(--mustard);max-width:980px'},
    h('div',{class:'row',style:'justify-content:space-between'},h('h2',{style:'margin:0'},'רעיון לבית: הפינה האהובה עלייך'),h('span',{class:'kicker'},'רשות · אפשר לדלג')),
    h('ol',null,h('li',null,'שבי רגע בפינה שהכי נעימה לך בבית.'),h('li',null,'מה העין שלך פוגשת ראשון? זה מוקד העניין של הפינה.'),
      h('li',null,'האם הדרך אל הפינה פנויה, בלי לעקוף דבר?'),h('li',null,'כתבי שינוי קטן אחד שיעשה אותה עוד יותר שלך.')),
    h('div',{class:'field',style:'max-width:none'},h('label',{for:'idea'},'השינוי הקטן שלי'),ta),
    h('div',{class:'row',style:'margin-top:12px'},h('button',{class:'btn solid',type:'button',onclick:saveIt},'שמרי במחברת'),h('button',{class:'btn',type:'button',onclick:ctx.next},'דלגי')),res);
  el.append(h('div',{class:'center'},h('div',{style:'width:100%;text-align:right'},card)));
 }},

{id:'summary',title:'מה למדנו היום',wide:true,
 text:'ארבעה כללים של מעצבים: שביל פנוי, מבט פתוח, מוקד אחד, חם לצד קר. מהיום תראי אותם בכל חדר שתיכנסי אליו. לחצי על כל כרטיס.',
 mount(el,ctx){
  const R=[['שביל פנוי','כ־90 ס"מ לפחות, מהכניסה ועד היציאה.','lounge'],['מבט פתוח','העין רצה מהדלת עד האור.','open'],['מוקד אחד','חלון, אח או אמנות. הישיבה פונה אליו.','fire'],['חם לצד קר','קטיפה, צמר ועץ לצד שיש, זכוכית ומתכת.','velvet']];
  const seen=ctx.data.seen||(ctx.data.seen={});
  const grid=h('div',{class:'cards',style:'grid-template-columns:repeat(4,minmax(0,1fr))'},...R.map(([t,d,img],i)=>{
    const f=h('button',{type:'button',class:'flip'+(seen[i]?' on':''),style:'--h:300px'},h('div',{class:'in'},
      h('div',{class:'f'},h('div',{class:'tap'},'כלל '+(i+1)),h('div',{class:'q'},t)),
      h('div',{class:'b',style:'padding:0;overflow:hidden;justify-content:flex-start'},photo(img,500,300),h('div',{style:'padding:12px 16px;font-size:20px;font-weight:600'},d))));
    f.addEventListener('click',()=>{f.classList.toggle('on');seen[i]=true;ctx.save();if(Object.keys(seen).length===4)ctx.done()});return f}));
  el.append(head('סיכום','ארבעה כללים של מעצבים','מהיום תראי אותם בכל חדר שתיכנסי אליו. לחצי על כל כרטיס.'),grid);
 }},

{id:'audio',task:'לחצי והקשיבי.',title:'סקירה קולית',skip:()=>!audioOK,
 text:'רוצה לשמוע את כל המפגש כשיחה קלילה? לחצי והקשיבי.',
 mount(el,ctx){
  el.append(h('div',{class:'center'},h('div',null,h('span',{class:'kicker'},'סקירה קולית'),h('h2',null,'המפגש כשיחה קלילה'),h('p',{class:'lede'},'רוצה לשמוע את כל המפגש כשיחה קלילה? לחצי והקשיבי.'),
    h('audio',{controls:true,src:'assets/audio/s1.m4a',style:'width:min(640px,90vw)',onplay:ctx.done}))));
 }},

{id:'feedback',title:'המשוב שלך',wide:true,
 say:'{name}, כל מילה שלך עוזרת לבנות את המפגש הבא, כך שיתאים לך עוד יותר. מה אהבת? מה היית משנה? שווה להקדיש לזה דקה.',
 mount(el,ctx){
  const f=Object.assign({content:'',visual:'',overall:'',text:''},(ctx.S.feedback||{})[1]||{});
  const W=['אהבתי מאוד','אהבתי','היה בסדר','פחות'];const res=h('div');
  const q=(key,label)=>h('div',{class:'q'},h('b',null,label),h('div',{class:'chips',role:'group','aria-label':label},...W.map(w=>h('button',{type:'button','aria-pressed':String(f[key]===w),
    onclick:e=>{f[key]=w;e.currentTarget.parentNode.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)))}},w))));
  const ta=h('textarea',{id:'fb',maxlength:1500},f.text||'');
  const btns=h('div',{class:'row',style:'margin-top:12px'},h('button',{class:'cta',type:'button',onclick:()=>saveIt()},'שמרי משוב'),h('button',{class:'btn',type:'button',onclick:ctx.next},'אותיר לפעם אחרת'));
  const saveIt=()=>{f.text=ta.value.trim();if(!f.content&&!f.visual&&!f.overall&&!f.text){sayBox(res,'אפשר לבחור מילה אחת בכל שורה, או לכתוב משפט.',true);return}
    window.Salon.setFeedback(1,{content:f.content,visual:f.visual,overall:f.overall,text:f.text});btns.hidden=true;sayBox(res,'<b>תודה, '+ctx.name+'.</b> המשוב נשמר, והוא ישפיע על המפגש הבא.');ctx.done()};
  el.append(head('המשוב שלך',ctx.name+', איך היה?','כל מילה שלך עוזרת לבנות את המפגש הבא, כך שיתאים לך עוד יותר. שווה להקדיש לזה דקה.'),
    h('div',{class:'rate'},q('content','התוכן'),q('visual','המראה והתמונות'),q('overall','החוויה בכלל')),
    h('div',{class:'field',style:'max-width:900px;margin-top:16px'},h('label',{for:'fb'},'מה עוד תרצי לספר? מה אהבת, ומה היית משנה?'),ta),
    btns,res);
 }},

{id:'bridge',title:'במפגש הבא: קפלים בזמן',
 text:'סיימת את המפגש הראשון. במפגש הבא: קפלים בזמן. ניכנס לאותו סלון בשלוש תקופות, ותגלי איך כל תקופה שינתה אותו.',
 mount(el,ctx){
  const res=h('div');const done=()=>{window.Salon.finish(1);sayBox(res,'<b>מפגש 1 הושלם.</b> כל הכבוד, '+ctx.name+'.');ctx.done()};
  el.append(split(arch(photo('open',900,1125),credit('open'),{back:'var(--mustard)'}),
    h('span',{class:'kicker'},'סוף המפגש'),h('h2',null,'סיימת את המפגש הראשון'),
    h('p',{class:'lede'},'במפגש הבא: קפלים בזמן. ניכנס לאותו סלון בשלוש תקופות, ותגלי איך כל תקופה שינתה אותו.'),
    h('div',{class:'row'},h('button',{class:'cta',type:'button',onclick:done},'סיימתי את המפגש'),h('button',{class:'btn',type:'button',onclick:()=>window.Salon.backup()},'שמרי גיבוי של ההתקדמות')),res));
  if(window.Salon.sess(1).done)sayBox(res,'<b>מפגש 1 הושלם.</b> אפשר לחזור אליו מתי שתרצי.');
 }}
];

/* מסך עם נקודת לחיצה בתמונה */
function hotspot(el,ctx,o){
  const img=photo(o.img,1200,800);const box=h('div',{class:'hot',role:'button','aria-label':'תמונה. לחצי על מוקד העניין',style:'--chrome:40px'},img);const res=h('div');
  const showZone=()=>{box.querySelectorAll('.zone').forEach(z=>z.remove());box.append(h('div',{class:'zone',style:`left:${o.zone.x}%;top:${o.zone.y}%;width:${o.zone.w}%;height:${o.zone.h}%`}))};
  box.addEventListener('click',e=>{const r=box.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*100,y=(e.clientY-r.top)/r.height*100;
    box.querySelectorAll('.ping').forEach(p=>p.remove());
    const hit=x>=o.zone.x-3&&x<=o.zone.x+o.zone.w+3&&y>=o.zone.y-3&&y<=o.zone.y+o.zone.h+3;
    if(hit){showZone();ctx.data.ok=true;ctx.save();sayBox(res,o.right);ctx.done()}
    else{box.append(h('div',{class:'ping',style:`left:${x}%;top:${y}%`}));ctx.data.miss=(ctx.data.miss||0)+1;
      if(ctx.data.miss>=2){showZone();sayBox(res,'הנה הוא, מסומן בצהוב. '+o.right.replace(/^<b>[^<]*<\/b>\s*/,''));ctx.done()}else sayBox(res,o.hint,true)}});
  el.append(h('div',{class:'split media'},h('div',null,box,h('div',{class:'note',style:'margin-top:6px'},'צילום: ',h('span',{class:'en'},IMG[o.img].by+', Unsplash'))),
    h('div',{class:'copy'},h('span',{class:'kicker'},o.kicker),h('h2',null,o.title),h('p',{class:'lede',html:o.lede}),res)));
  if(ctx.data.ok){showZone();sayBox(res,o.right)}
}
/* מסך שאלה */
function quiz(id,kick,q,opts,right,wrong,img){
  return {id,title:q,wide:true,say:kick+'. '+q+' '+opts.map((o,i)=>'תשובה '+(i+1)+': '+o[0]+'.').join(' '),
   mount(el,ctx){
    const res=h('div');const list=h('div',{class:'quiz'},...opts.map(([t,ok],i)=>{const b=h('button',{type:'button',class:'opt'},h('span',{class:'mk','aria-hidden':'true'},String(i+1)),t);
      b.addEventListener('click',()=>{if(ok){list.querySelectorAll('.opt').forEach(x=>x.classList.remove('wrong'));b.classList.add('right');b.querySelector('.mk').textContent='✓';ctx.data.ok=true;ctx.save();sayBox(res,'<b>'+right.split('.')[0]+'.</b>'+right.slice(right.indexOf('.')+1));ctx.done()}
        else{b.classList.add('wrong');b.querySelector('.mk').textContent='✗';sayBox(res,wrong+' נסי שוב.',true)}});return b}));
    const pic=img==='art'?h('div',{class:'hot',style:'cursor:default;--chrome:150px'},photo('art',1200,800)):img==='met'?h('div',{class:'hot',style:'cursor:default;--chrome:150px'},h('img',{src:MET.src,alt:MET.alt})):null;
    el.append(head(kick,q,null));
    el.append(pic?h('div',{class:'split',style:'min-height:auto;align-items:start'},h('div',null,pic,h('div',{class:'note',style:'margin-top:6px'},img==='art'?'צילום: '+IMG.art.by+', Unsplash':MET.credit)),h('div',null,list,res)):h('div',null,list,res));
    if(ctx.data.ok){const b=list.querySelectorAll('.opt')[opts.findIndex(o=>o[1])];b.classList.add('right');b.querySelector('.mk').textContent='✓';sayBox(res,'<b>'+right.split('.')[0]+'.</b>'+right.slice(right.indexOf('.')+1))}
   }};
}

window.Salon.register(1,screens);
})();
