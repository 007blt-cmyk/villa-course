/* הסלון של מזל · מפגש 4: אור ואווירה
   בלוק נתונים ורכיבים של המפגש. לא נוגע במנוע ולא במפגשים 1 עד 3. */
(function(){
'use strict';
const {h}=window.Salon;const P=window.SalonPlan;

/* ---------- מדיה ---------- */
const IMG={
  off:{src:'assets/img/s4-off',alt:'סלון של וילה בערב, כל האורות כבויים, ורק אור ירח כחלחל נכנס מהחלון.'},
  on:{src:'assets/img/s4-on',alt:'אותו סלון בערב, מואר באור חם: פס אור נסתר בתקרה, מנורת עמידה, ספוטים על קיר האבן ומנורת פליז מעל השולחן.'}
};
const MET_LAMP='https://www.metmuseum.org/art/collection/search/241643';
let audioOK=false;
fetch('assets/audio/s4.m4a',{method:'HEAD'}).then(r=>{audioOK=r.ok}).catch(()=>{});
function pic(key,size,extra){const m=IMG[key];return h('img',Object.assign({src:m.src+(size==='sm'?'-sm':'')+'.jpg',alt:m.alt,decoding:'async'},extra||{}))}
const imgHtml=(key,alt)=>'<img src="'+IMG[key].src+'.jpg" alt="'+(alt!=null?alt:IMG[key].alt)+'" decoding="async">';
/* ---------- עזרים משותפים (עותק מקומי לכל מפגש) ---------- */
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
const aiTag=()=>h('span',{class:'ai-tag'},'הדמיה');
const illus=()=>h('span',{class:'ai-tag s3-illus'},'המחשה');
function svg(vb,inner,extra){return '<svg viewBox="'+vb+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet" '+(extra||'')+'>'+inner+'</svg>'}
function drawBox(html,cls){const b=h('div',{class:'s3-draw'+(cls?' '+cls:''),html});b.append(illus());return b}
/* כרטיסים הפוכים */
function flips(el,ctx,o){
  const seen=ctx.data.seen||(ctx.data.seen={});const n=o.cards.length;
  const grid=h('div',{class:'cards s2-flips '+(o.cls||'s3-secrets')},...o.cards.map((c,i)=>{
    const front=c.front?c.front():[h('span',{class:'s3-num'},String(i+1)),h('div',{class:'q'},c.t)];
    const f=h('button',{type:'button',class:'flip'+(seen[i]?' on':''),'aria-label':c.t},h('div',{class:'in'},
      h('div',{class:'f'},...[].concat(front),c.front?h('div',{class:'q'},c.t):null),h('div',{class:'b'},h('div',{class:'rule'},c.b))));
    f.addEventListener('click',()=>{if(o.toggle)f.classList.toggle('on');else f.classList.add('on');seen[i]=true;ctx.save();if(Object.keys(seen).length===n)ctx.done()});return f}));
  el.append(head(o.kicker,o.title,o.lede),grid);
  return gate(ctx,Object.keys(seen).length===n);
}
/* נקודות בתמונה */
function spots(el,ctx,o){
  const found=ctx.data.found||(ctx.data.found={});
  const box=o.box||h('div',{class:'s2-pic'},h('img',{src:o.src,alt:o.alt,decoding:'async'}));
  if(o.ai)box.append(aiTag());
  const counter=h('span',{class:'counter'});const list=h('ol',{class:'s2-tags'});
  o.pts.forEach((p,i)=>{const b=h('button',{type:'button',class:'s2-dot'+(found[i]?' found':''),style:`left:${p.x}%;top:${p.y}%`,'aria-label':p.name||('נקודה '+(i+1))},found[i]?String(i+1):'');
    b.addEventListener('click',()=>{found[i]=1;ctx.save();b.classList.add('found');b.textContent=String(i+1);upd()});box.append(b)});
  function upd(){const n=Object.keys(found).length;counter.textContent='מצאת '+n+' מתוך '+o.pts.length;
    list.replaceChildren(...o.pts.map((p,i)=>found[i]?h('li',{value:i+1},label(p.t)):null).filter(Boolean));if(n===o.pts.length)ctx.done()}
  el.append(head(o.kicker,o.title,o.lede),h('div',{class:'s3-row'+(o.rowCls?' '+o.rowCls:'')},h('div',{class:'s2-media'},box,o.credit?h('div',{class:'note s2-cap'},o.credit):null),h('div',null,h('div',{class:'row'},counter),list)));
  upd();
  return gate(ctx,Object.keys(found).length===o.pts.length);
}
/* לפני ואחרי עם חצים בלחיצה */
function compare(ctx,beforeHtml,afterHtml,lb,la,tag){
  const c=h('div',{class:'compare s2-compare s3-compare'},h('div',{class:'layer after',html:afterHtml}),h('div',{class:'layer before',html:beforeHtml}),h('div',{class:'handle'}),
    h('span',{class:'lbl b'},lb),h('span',{class:'lbl a'},la),tag==='ai'?aiTag():illus());
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
/* מיון בלחיצה: פריט ואז תיבה */
function sorter(el,ctx,o){
  const placed=ctx.data.placed||(ctx.data.placed={});let pick=null;const res=h('div');
  if(!ctx.data.order){ctx.data.order=shuffle(o.items.map(x=>x[0]));ctx.save()}
  const pool=h('div',{class:'s2-pool compact '+(o.poolCls||'')});const ins={};
  const bins=h('div',{class:'s2-bins s4-bins'+(o.bins.length===3?' three':'')},...o.bins.map(([k,t])=>{ins[k]=h('div',{class:'s2-bin-in'});
    const b=h('button',{type:'button',class:'s2-bin'},h('span',{class:'nm'},t),ins[k]);b.addEventListener('click',()=>drop(k));return b}));
  const IT=Object.fromEntries(o.items.map(x=>[x[0],x]));
  function draw(){
    pool.replaceChildren(...ctx.data.order.filter(id=>!placed[id]).map(id=>h('button',{type:'button',class:'s2-tile sm','aria-pressed':String(pick===id),onclick:()=>{pick=pick===id?null:id;draw()}},
      h('span',{class:'s2-art',html:o.art(id)}),h('span',{class:'nm'},IT[id][1]))));
    Object.keys(ins).forEach(k=>ins[k].replaceChildren(...Object.keys(placed).filter(id=>placed[id]===k).map(id=>h('span',{class:'s2-mini',title:IT[id][1]},h('span',{class:'s2-art',html:o.art(id)})))));
    if(Object.keys(placed).length===o.items.length){sayBox(res,o.doneMsg);ctx.done()}
  }
  function drop(k){if(!pick){sayBox(res,o.pickFirst||'קודם לחצי על פריט, ואחר כך על התיבה.');return}
    if(IT[pick][2]===k){placed[pick]=k;pick=null;ctx.save();res.replaceChildren();draw()}else{sayBox(res,o.hint);pick=null;draw()}}
  el.append(head(o.kicker,o.title,o.lede),h('div',{class:'s4-sort'},pool,bins,res));
  draw();
  return gate(ctx,Object.keys(placed).length===o.items.length);
}
/* מסך משוב משותף */
function feedbackScreen(el,ctx,o){
  window.Salon.finish(o.n);
  const prev=(ctx.S.feedback||{})[o.n]||{};
  const f=Object.assign({content:'',visual:'',overall:'',own:'',xq:'',xwhy:''},prev);
  const W=['אהבתי מאוד','אהבתי','היה בסדר','פחות'];
  const q=(key,lbl,opts)=>h('div',{class:'q'},h('b',null,lbl),h('div',{class:'chips sm',role:'group','aria-label':lbl},...opts.map(w=>h('button',{type:'button','aria-pressed':String(f[key]===w),
    onclick:e=>{f[key]=w;e.currentTarget.parentNode.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)))}},w))));
  const ta=h('textarea',{id:'fb'+o.n,maxlength:1500},f.own||(prev.text&&!prev.own?prev.text:''));
  const why=o.extra?h('input',{id:'fb'+o.n+'why',type:'text',maxlength:300,value:f.xwhy||''}):null;
  const note=h('p',{class:'note',role:'status',style:'margin:8px 0 0'},'המשוב לא חובה. אפשר להמשיך גם בלעדיו.');
  const saveIt=()=>{f.own=ta.value.trim();if(why)f.xwhy=why.value.trim();
    if(!f.content&&!f.visual&&!f.overall&&!f.own&&!f.xq&&!f.xwhy){ta.focus();return}
    const lines=[];if(o.extra&&f.xq)lines.push(o.extra.show+': '+f.xq+(f.xwhy?'. למה: '+f.xwhy:''));if(f.own)lines.push(f.own);
    window.Salon.setFeedback(o.n,{content:f.content,visual:f.visual,overall:f.overall,text:lines.join('\n'),own:f.own,xq:f.xq,xwhy:f.xwhy});
    note.innerHTML='<b>תודה'+(ctx.name?', '+ctx.name:'')+'.</b> המשוב נשמר.';note.classList.add('s3-thanks')};
  const rate=h('div',{class:'rate'},q('content','התוכן',W),q('visual','המראה והתמונות',W),q('overall','החוויה בכלל',W));
  if(o.extra)rate.append(h('div',{class:'q s3-simq'},h('b',null,o.extra.q),h('div',{class:'chips sm',role:'group','aria-label':o.extra.q},...o.extra.opts.map(w=>h('button',{type:'button','aria-pressed':String(f.xq===w),
      onclick:e=>{f.xq=w;e.currentTarget.parentNode.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===e.currentTarget)))}},w)))));
  const fb=h('div',{class:'s2-fb'},rate,
    h('div',{class:o.extra?'s2-two':''},
      h('div',{class:'field',style:'max-width:none'},h('label',{for:'fb'+o.n},'מה עוד תרצי לספר? מה אהבת, ומה היית משנה?'),ta),
      why?h('div',{class:'field',style:'max-width:none'},h('label',{for:'fb'+o.n+'why'},o.extra.why),why):null));
  const bridge=h('aside',{class:'s2-bridge s3-bridge'},h('div',{class:'ph'},o.bridgeMedia),
      h('div',null,h('span',{class:'kicker'},'מפגש '+(o.n+1)),h('p',null,o.bridge)));
  const side=h('div',{class:'s2-fb'},bridge,note,
    h('div',{class:'row',style:'margin-top:8px'},h('button',{class:'cta',type:'button',onclick:saveIt},'שמרי משוב'),h('button',{class:'btn',type:'button',onclick:()=>window.Salon.goHome()},'למסך הבית')));
  el.append(head('המשוב שלך','איך היה?',nameFill(o.open)),h('div',{class:'s2-end s'+o.n+'-fb'},fb,side));
  ctx.done();
}
/* כרטיס רשות: רעיון לבית */
function ideaScreen(el,ctx,o){
  const res=h('div');const id='idea'+o.n;const inp=h('input',{id,type:'text',maxlength:200,value:ctx.data.text||''});
  const save=()=>{const v=inp.value.trim();if(!v){inp.focus();return}ctx.data.text=v;
    const nb=ctx.S.notebook;const old=nb.find(n=>n.kind===id&&n.session===o.n);
    if(old){old.text=v;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:id,title:'רעיון לבית, מפגש '+o.n,text:v});ctx.save();sayBox(res,'<b>נשמר במחברת שלך.</b>')};
  el.append(h('div',{class:'split s3-idea'},h('div',{class:'s2-arch s3-arch-sm'},h('div',{class:'arch-back'}),h('div',{class:'frame'},o.media)),
    h('div',{class:'copy'},h('span',{class:'kicker'},'כרטיס רשות'),h('h2',null,'רעיון לבית'),
      h('p',{class:'lede'},o.text),
      h('div',{class:'field'},h('label',{for:id},o.field),inp),
      h('div',{class:'row s3-inline',style:'margin-top:14px'},h('button',{class:'cta',type:'button',onclick:save},'שמרי במחברת'),h('button',{class:'btn',type:'button',onclick:ctx.next},'דלגי'),res))));
  if(ctx.data.text)sayBox(res,'<b>נשמר במחברת שלך.</b>');
  ctx.done();
}
function audioScreen(el,ctx,n){
  el.append(h('div',{class:'center'},h('div',null,h('span',{class:'kicker'},'סקירה קולית'),h('h2',null,'סקירה קולית'),h('p',{class:'lede'},'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.'),
    h('audio',{controls:true,src:'assets/audio/s'+n+'.m4a',style:'width:min(640px,90vw)',onplay:ctx.done}))));
}
function linkCard(href,title,sub){return h('a',{class:'s2-link',href,target:'_blank',rel:'noopener'},h('b',null,title),sub?h('span',null,sub):null)}

/* ---------- צבעים וציורים בקוד ---------- */
const C={ink:'#1A3A35',lead:'#14474A',terra:'#C65A3C',mustard:'#E0A63A',sage:'#9DB39A',paper:'#F7F0E4',cream:'#F2E6CF',brass:'#C9A24B',stone:'#E4D3B0',stoneD:'#C9B48A',wood:'#B9824F',night:'#1F2F3A',glow:'#FFD98A'};
const glowDef=(id,col)=>`<radialGradient id="${id}"><stop offset="0" stop-color="${col||C.glow}" stop-opacity=".95"/><stop offset=".45" stop-color="${col||C.glow}" stop-opacity=".45"/><stop offset="1" stop-color="${col||C.glow}" stop-opacity="0"/></radialGradient>`;

/* מנורת שמן רומית: המחשה */
function romanLamp(){
  return svg('0 0 600 400',`<defs>${glowDef('rl-g')}<radialGradient id="rl-f" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".5" stop-color="#FFC24A"/><stop offset="1" stop-color="#E86A2A"/></radialGradient></defs>
  <rect class="rl-bg" width="600" height="400" fill="#2A3A40"/>
  <g class="rl-halo"><circle cx="400" cy="170" r="230" fill="url(#rl-g)"/></g>
  <rect x="0" y="300" width="600" height="100" fill="#3A3026"/><rect class="rl-table" x="0" y="300" width="600" height="100" fill="#8B6440" opacity="0"/>
  <ellipse cx="300" cy="306" rx="200" ry="18" fill="#000" opacity=".25"/>
  <path d="M150 250c0-46 50-70 120-70s120 24 120 70c0 26-50 46-120 46s-120-20-120-46z" fill="#B5643E"/>
  <path d="M374 238c30-14 52-18 70-14 14 4 16 22 2 28-20 8-48 8-80 6z" fill="#A9583A"/>
  <ellipse cx="270" cy="236" rx="70" ry="22" fill="#9C4F33"/><ellipse cx="270" cy="234" rx="44" ry="13" fill="#7C3B27"/>
  <circle cx="270" cy="234" r="7" fill="#3E2016"/><ellipse cx="438" cy="236" rx="10" ry="5" fill="#3E2016"/>
  <path d="M150 252c0 26 50 44 120 44s120-18 120-44" fill="none" stroke="#8E4A31" stroke-width="4"/>
  <path d="M190 210q-6 8 0 16M350 210q6 8 0 16" stroke="#8E4A31" stroke-width="3" fill="none"/>
  <g class="rl-flame"><path d="M438 232c-14-22-10-44 2-62 4 18 18 30 10 50-2 8-6 12-12 12z" fill="url(#rl-f)"/></g>`,'role="img"');
}

/* שלוש השכבות: ציורים קטנים */
const ART={
  cove:`<rect x="0" y="0" width="120" height="120" fill="#F7F0E4"/><path d="M8 34h104" stroke="${C.ink}" stroke-width="6"/><path d="M8 40h104v10H8z" fill="${C.glow}"/><path d="M8 50l-4 60h112l-4-60z" fill="${C.glow}" opacity=".35"/>`,
  sconce:`<rect width="120" height="120" fill="#F7F0E4"/><rect x="52" y="50" width="16" height="30" rx="4" fill="${C.brass}"/><path d="M60 50 30 6h60z" fill="${C.glow}" opacity=".7"/><path d="M60 80 36 116h48z" fill="${C.glow}" opacity=".35"/>`,
  reading:`<rect width="120" height="120" fill="#F7F0E4"/><path d="M74 18h30l8 26H66z" fill="#F3EAD7" stroke="${C.ink}" stroke-width="2"/><path d="M88 44v66M74 112h28" stroke="${C.ink}" stroke-width="4"/><path d="M70 46 40 110h60z" fill="${C.glow}" opacity=".5"/><rect x="12" y="70" width="50" height="40" rx="10" fill="${C.terra}"/><rect x="12" y="56" width="16" height="54" rx="8" fill="${C.terra}"/>`,
  under:`<rect width="120" height="120" fill="#F7F0E4"/><rect x="6" y="14" width="108" height="34" fill="${C.sage}" stroke="${C.ink}" stroke-width="2"/><path d="M6 50h108" stroke="${C.glow}" stroke-width="6"/><path d="M10 52 0 90h120l-10-38z" fill="${C.glow}" opacity=".45"/><rect x="0" y="90" width="120" height="8" fill="${C.stoneD}"/><rect x="0" y="98" width="120" height="22" fill="#fff"/>`,
  spotPic:`<rect width="120" height="120" fill="#F7F0E4"/><circle cx="24" cy="12" r="8" fill="${C.ink}"/><path d="M28 18 86 46 64 98z" fill="${C.glow}" opacity=".45"/><rect x="58" y="44" width="46" height="36" fill="#7FA7B8" stroke="${C.brass}" stroke-width="5"/>`,
  spotSculpt:`<rect width="120" height="120" fill="#F7F0E4"/><circle cx="96" cy="12" r="8" fill="${C.ink}"/><path d="M92 18 30 60 70 70z" fill="${C.glow}" opacity=".45"/><path d="M52 44c-10 0-12 14-6 22-8 6-8 22 4 26h16c12-4 12-20 4-26 6-8 4-22-6-22z" fill="${C.terra}"/><rect x="40" y="92" width="40" height="22" fill="${C.stone}"/>`
};
const art=k=>svg('0 0 120 120',ART[k]);

/* שלושה חדרים: סלון, מטבח, חדר שינה */
function roomArt(k,warm){
  const col=warm?'#FFD27A':'#DDEBFF',wall=warm?'#F6E3C3':'#E3EAF2',fl=warm?'#C79B6A':'#B9B9B6';
  let s=`<defs><radialGradient id="ra-${k}"><stop offset="0" stop-color="${col}" stop-opacity=".9"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><rect width="300" height="200" fill="${wall}"/><rect y="150" width="300" height="50" fill="${fl}"/><ellipse cx="150" cy="70" rx="160" ry="110" fill="url(#ra-${k})"/>`;
  if(k==='living')s+=`<rect x="60" y="108" width="150" height="34" rx="10" fill="${C.lead}"/><rect x="50" y="128" width="170" height="28" rx="10" fill="${C.lead}"/><rect x="70" y="114" width="34" height="20" rx="6" fill="${C.mustard}"/><path d="M240 60v96M226 156h28" stroke="${C.ink}" stroke-width="4"/><path d="M226 44h28l6 18h-40z" fill="#F3EAD7"/>`;
  if(k==='kitchen')s+=`<rect x="20" y="40" width="260" height="40" fill="${C.sage}" stroke="${C.ink}" stroke-width="2"/><rect x="20" y="104" width="260" height="10" fill="${C.stoneD}"/><rect x="20" y="114" width="260" height="42" fill="${C.sage}" stroke="${C.ink}" stroke-width="2"/><path d="M90 114v42M160 114v42M230 114v42" stroke="${C.ink}" stroke-width="2"/><circle cx="200" cy="96" r="8" fill="${C.ink}"/>`;
  if(k==='bed')s+=`<rect x="70" y="92" width="160" height="22" rx="6" fill="${C.terra}"/><rect x="60" y="112" width="180" height="40" rx="8" fill="#F7F0E4" stroke="${C.ink}" stroke-width="2"/><rect x="80" y="100" width="44" height="18" rx="6" fill="#fff"/><rect x="176" y="100" width="44" height="18" rx="6" fill="#fff"/><rect x="250" y="120" width="30" height="32" fill="${C.wood}"/><path d="M256 104h18l4 14h-26z" fill="#F3EAD7"/>`;
  return svg('0 0 300 200',s);
}

/* נורה חשופה מול אור עקיף: המחשה */
function cornerArt(indirect){
  const base=`<rect width="600" height="400" fill="${indirect?'#E9D7B8':'#CBB8A0'}"/><rect y="300" width="600" height="100" fill="${indirect?'#B89870':'#8E7558'}"/>`;
  const chair=`<rect x="150" y="214" width="150" height="86" rx="20" fill="${C.terra}"/><rect x="138" y="180" width="40" height="120" rx="18" fill="${C.terra}"/><rect x="274" y="200" width="40" height="100" rx="18" fill="#B04E33"/><rect x="340" y="250" width="70" height="50" fill="${C.wood}"/>`;
  if(!indirect)return svg('0 0 600 400',`<defs>${glowDef('bb-g','#FFF4D0')}</defs>${base}<path d="M300 0v96" stroke="#222" stroke-width="3"/>
   <circle cx="300" cy="116" r="120" fill="url(#bb-g)"/><circle cx="300" cy="112" r="20" fill="#FFFBEA" stroke="#FFF" stroke-width="3"/>
   ${chair}<path d="M150 300l-70 60h170l-20-60zM340 300l-30 70h110l-10-70z" fill="#000" opacity=".35"/>
   <path d="M140 180l-60-90h40z" fill="#000" opacity=".22"/>`,'role="img"');
  return svg('0 0 600 400',`<defs>${glowDef('ia-g')}<linearGradient id="ia-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE3A8"/><stop offset="1" stop-color="#E9D7B8" stop-opacity="0"/></linearGradient></defs>${base}
   <rect x="0" y="0" width="600" height="26" fill="#F7EAD2"/><rect x="0" y="26" width="600" height="10" fill="${C.ink}" opacity=".5"/><rect x="0" y="36" width="600" height="120" fill="url(#ia-c)"/>
   <rect x="470" y="130" width="40" height="24" rx="4" fill="${C.brass}"/><path d="M470 130l-30-90h130l-30 90z" fill="url(#ia-g)" opacity=".8"/>
   ${chair}<path d="M150 300l-20 20h170l-10-20zM340 300l-10 18h90l-6-18z" fill="#000" opacity=".12"/>`,'role="img"');
}

/* ספוט על התקרה וכורסה לשאלות */
function readArt(){return svg('0 0 600 400',`<defs>${glowDef('rd-g')}</defs><rect width="600" height="400" fill="#E9DCC6"/><rect y="310" width="600" height="90" fill="#C79B6A"/>
  <path d="M380 70h80l20 60H360z" fill="#F3EAD7" stroke="${C.ink}" stroke-width="3"/><path d="M420 130v176M380 310h80" stroke="${C.ink}" stroke-width="8"/>
  <ellipse cx="330" cy="250" rx="190" ry="120" fill="url(#rd-g)"/>
  <rect x="140" y="214" width="190" height="96" rx="26" fill="${C.terra}"/><rect x="126" y="150" width="52" height="160" rx="24" fill="${C.terra}"/><rect x="300" y="196" width="50" height="114" rx="22" fill="#B04E33"/>
  <rect x="236" y="176" width="64" height="46" rx="4" fill="#fff" transform="rotate(-12 268 199)"/>`,'role="img"')}
function bulbBox(){return svg('0 0 600 400',`<rect width="600" height="400" fill="#F2E6CF"/><rect x="190" y="60" width="220" height="290" rx="10" fill="#fff" stroke="${C.ink}" stroke-width="5"/>
  <rect x="190" y="60" width="220" height="70" rx="10" fill="${C.lead}"/><text x="300" y="108" text-anchor="middle" font-family="Assistant,sans-serif" font-weight="800" font-size="34" fill="#fff">נורה</text>
  <circle cx="300" cy="196" r="44" fill="#FFE7A3" stroke="${C.ink}" stroke-width="4"/><rect x="284" y="238" width="32" height="26" fill="#B8B8B8" stroke="${C.ink}" stroke-width="3"/>
  <text x="300" y="318" text-anchor="middle" font-family="Assistant,sans-serif" font-weight="900" font-size="54" fill="${C.ink}" direction="ltr">2700K</text>`,'role="img"')}
function threeRooms(){return h('div',{class:'s4-rooms3'},...[['living','סלון',true],['kitchen','מטבח',false],['bed','חדר שינה',true]].map(([k,t,w])=>h('figure',null,h('div',{class:'s3-draw s4-mini',html:roomArt(k,w)}),h('figcaption',null,t))))}

/* ---------- הסימולטור: שכבות אור על התמונה ---------- */
const LIGHTS=[
  ['cove','פס נסתר בתקרה','radial-gradient(ellipse 72% 40% at 45% 14%,#000 40%,transparent 78%),radial-gradient(ellipse 36% 30% at 14% 42%,#000 25%,transparent 78%),radial-gradient(ellipse 70% 48% at 45% 78%,rgba(0,0,0,.5) 20%,transparent 80%)'],
  ['read','מנורת קריאה','radial-gradient(ellipse 15% 27% at 50% 53%,#000 35%,transparent 80%)'],
  ['pend','מנורה מעל השולחן','radial-gradient(ellipse 13% 22% at 91% 42%,#000 40%,transparent 80%),radial-gradient(ellipse 19% 18% at 89% 69%,#000 25%,transparent 82%)'],
  ['spot','ספוטים על קיר האבן','radial-gradient(ellipse 22% 30% at 64% 46%,#000 40%,transparent 80%),radial-gradient(ellipse 34% 7% at 68% 31%,#000 20%,transparent 85%)']
];
const LMSG={off:'חושך. רק אור הירח נכנס מהחלון.',cove:'אור רך ממלא את החדר. זה האור הכללי.',read:'עיגול אור ליד הכורסה. פינה לקריאה.',pend:'השולחן מואר, והמנורה עצמה נוצצת כמו תכשיט.',spot:'האבן מקבלת עומק, והתמונה בולטת.',all:'שלוש שכבות יחד. ככה נראה סלון של וילה בערב.',low:'אותן מנורות, אווירה אחרת. הסלון נרגע.',cool:'הרגשת שהסלון התקרר?'};
const DIM=[['low','חלש',.42],['mid','בינוני',.72],['full','מלא',1]];
function rig(){
  const lights=h('div',{class:'s4-lights'},...LIGHTS.map(([k,,m])=>h('div',{class:'s4-ly','data-k':k,style:'-webkit-mask-image:'+m+';mask-image:'+m})),h('div',{class:'s4-ly s4-full'}));
  const box=h('div',{class:'s4-rig'},pic('off','lg',{class:'base',alt:IMG.off.alt}),lights,h('div',{class:'s4-tint'}),aiTag());
  return box;
}
function rigApply(box,st){
  const on=st.on||{};const n=LIGHTS.filter(l=>on[l[0]]).length;
  box.querySelectorAll('.s4-ly[data-k]').forEach(l=>l.classList.toggle('on',!!on[l.dataset.k]));
  box.querySelector('.s4-full').classList.toggle('on',n===4);
  box.style.setProperty('--dim',(DIM.find(d=>d[0]===(st.dim||'full'))||DIM[2])[2]);
  box.classList.toggle('cool',st.color==='cool');
}
function switchRow(st,onTap){
  return h('div',{class:'s4-switches',role:'group','aria-label':'מתגים'},...LIGHTS.map(([k,t])=>h('button',{type:'button',class:'s4-sw','aria-pressed':String(!!(st.on||{})[k]),onclick:()=>onTap(k)},h('span',{class:'dot','aria-hidden':'true'}),t)));
}
function dimRow(st,onDim){
  const i=DIM.findIndex(d=>d[0]===(st.dim||'full'));
  return h('div',{class:'s3-q s4-dim'},h('b',null,'עמעם'),h('div',{class:'row'},
    h('button',{type:'button',class:'btn s4-pm','aria-label':'פחות אור',onclick:()=>onDim(Math.max(0,i-1))},'−'),
    h('span',{class:'s4-lvl',role:'status'},DIM[i][1]),
    h('button',{type:'button',class:'btn s4-pm','aria-label':'יותר אור',onclick:()=>onDim(Math.min(2,i+1))},'+')));
}
function colorRow(st,onCol){return chipRow('צבע',[['warm','אור חם'],['cool','אור קר']],st.color||'warm',onCol)}

/* ---------- תכנית התאורה לסלון של מזל ---------- */
const PT=[
 {k:'ceil',t:'התקרה',opts:[['cove','פס תאורה נסתר','אור כללי'],['recessed','נורות שקועות בתקרה','אור כללי'],['chand','נברשת במרכז','אור כללי, וגם פסל']]},
 {k:'read',t:'פינת הקריאה',opts:[['floor','מנורת עמידה','אור לפעולה'],['table','מנורת שולחן עם אהיל','אור לפעולה'],['wallarm','מנורת קיר מתכווננת','אור לפעולה']]},
 {k:'wall',t:'הקיר שמול הספה',opts:[['spot','ספוט על תמונה','אור מדגיש'],['wash','מנורת קיר שמאירה את הקיר','אור כללי'],['none','בלי אור בקיר הזה','']]},
 {k:'tab',t:'השולחן',opts:[['pendant','מנורה תלויה','אור לפעולה, וגם פסל'],['dspot','ספוט מהתקרה','אור לפעולה'],['none','בלי אור מעל השולחן','']]}
];
const VB={x:-70,y:-50,w:780,h:660};
function layoutOf(S){const pl=((S.sessions[1]||{}).data||{}).planner||{};return {layout:pl.layout||null,done:!!pl.layout}}
function ptPos(layout){
  const L=layout||P.SOLUTION.window;const so=L.sofa;const r=((so.r%360)+360)%360;
  const wall=r===0?{x:so.x,y:24}:r===180?{x:so.x,y:P.H-24}:r===90?{x:P.W-24,y:so.y}:{x:24,y:so.y};
  const tab={x:L.table.x,y:L.table.y};
  if(Math.hypot(wall.x-tab.x,wall.y-tab.y)<120){if(r===0||r===180)wall.x=tab.x+(tab.x<P.W/2?150:-150);else wall.y=tab.y+(tab.y<P.H/2?150:-150)}
  const pts=[{x:L.lamp.x,y:L.lamp.y},wall,tab,{x:so.x,y:so.y}];
  const cands=[[P.W/2,P.H/2],[P.W/2,P.H*.7],[P.W/2,P.H*.3],[P.W*.3,P.H/2],[P.W*.7,P.H/2]];
  const far=c=>Math.min(...pts.map(q=>Math.hypot(q.x-c[0],q.y-c[1])));
  const best=cands.reduce((a,c)=>far(c)>far(a)?c:a,cands[0]);
  return {ceil:{x:best[0],y:best[1]},read:{x:L.lamp.x,y:L.lamp.y},wall,tab};
}
const pc=p=>({l:(p.x-VB.x)/VB.w*100,t:(p.y-VB.y)/VB.h*100});
function glowSvg(pos,picks,lit){
  let s=`<defs>${glowDef('pl-g')}</defs><rect x="${VB.x}" y="${VB.y}" width="${VB.w}" height="${VB.h}" fill="#0E1C24" opacity="${lit?.5:.3}"/>`;
  if(lit)PT.forEach(p=>{const c=picks[p.k];if(!c||c==='none')return;const q=pos[p.k];
    const R=p.k==='ceil'?(c==='cove'?0:200):p.k==='wall'?150:130;
    if(p.k==='ceil'&&c==='cove')s+=`<rect x="-6" y="-6" width="${P.W+12}" height="${P.H+12}" fill="none" stroke="${C.glow}" stroke-width="26" opacity=".85"/><rect x="0" y="0" width="${P.W}" height="${P.H}" fill="${C.glow}" opacity=".16"/>`;
    else if(p.k==='ceil'&&c==='recessed')[[.25,.25],[.75,.25],[.25,.75],[.75,.75]].forEach(([a,b])=>{s+=`<circle cx="${P.W*a}" cy="${P.H*b}" r="120" fill="url(#pl-g)" opacity=".7"/><circle cx="${P.W*a}" cy="${P.H*b}" r="9" fill="#FFF6D8"/>`});
    else s+=`<circle cx="${q.x}" cy="${q.y}" r="${R}" fill="url(#pl-g)"/><circle cx="${q.x}" cy="${q.y}" r="${c==='chand'||c==='pendant'?18:11}" fill="#FFF6D8" stroke="${C.brass}" stroke-width="4"/>`});
  return `<svg class="s4-ov" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${s}</svg>`;
}
function lightPlan(layout,picks,lit){
  const L=layout||P.SOLUTION.window;const wrap=h('div',{class:'s4-plan'});
  wrap.append(P.staticPlan(L,{labels:false}));wrap.insertAdjacentHTML('beforeend',glowSvg(ptPos(L),picks||{},lit));
  return wrap;
}
function layersOf(p){const s=new Set();PT.forEach(x=>{const c=p[x.k];const o=x.opts.find(y=>y[0]===c);if(!o||!o[2])return;if(o[2].startsWith('אור כללי'))s.add('amb');if(o[2].startsWith('אור לפעולה'))s.add('task');if(o[2].startsWith('אור מדגיש'))s.add('acc')});return s}
function planSentence(p){
  const s=layersOf(p);let t;
  if(s.size===3)t='אור כללי, אור לפעולה ואור מדגיש. שלוש שכבות בסלון אחד, בדיוק כמו אצל מעצבות תאורה.';
  else if(s.has('amb')&&s.has('task'))t='יש לך אור כללי ואור לפעולה. ספוט אחד על תמונה ישלים את השכבה השלישית.';
  else t='יש כאן '+(s.size===1?'שכבה אחת':'שתי שכבות')+'. נסי להוסיף עוד שכבה, והסלון יתמלא.';
  if(p.ceil==='chand'||p.tab==='pendant')t+=' ובחרת גם מנורה שהיא פסל.';
  return t;
}
function planText(p){return PT.map(x=>{const o=x.opts.find(y=>y[0]===p[x.k]);return x.t+': '+(o?o[1]:'')}).join('. ')+'.'}
const prevDraw=window.Salon.drawNote;
window.Salon.drawNote=function(it){if(it.kind==='light4'&&it.picks){const w=lightPlan(it.layout,it.picks,true);w.classList.add('s4-nb');return w}return prevDraw?prevDraw(it):null};

/* ---------- 22 המסכים ---------- */
const screens=[

/* יחידה 1 */
{id:'open',title:'אור ואווירה',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'ברוכה השבה, {name}. במפגש הקודם ניהלת את אור השמש. עכשיו ירד הערב, והאור כולו בידיים שלך. זה אותו סלון, באותה שעה. ההבדל היחיד: מישהי הדליקה את האורות הנכונים. בסוף המפגש זו תהיי את.',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,imgHtml('off'),imgHtml('on'),'אורות כבויים','אורות דלוקים','ai')),
   h('div',{class:'copy'},h('span',{class:'kicker'},'מפגש 4'),h('h1',null,'אור ואווירה'),
    h('p',{class:'lede'},nameFill('ברוכה השבה, {name}. במפגש הקודם ניהלת את אור השמש. עכשיו ירד הערב, והאור כולו בידיים שלך. זה אותו סלון, באותה שעה. ההבדל היחיד: מישהי הדליקה את האורות הנכונים. בסוף המפגש זו תהיי את.')))));
  return gate(ctx,ctx.data.cut!=null&&ctx.data.cut!==50);
 }},

{id:'secrets',title:'ארבעה סודות',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'לתאורה של וילה יש ארבעה סודות. היום נכיר את כולם.',
 mount(el,ctx){return flips(el,ctx,{kicker:'ארבעה סודות',title:'ארבעה סודות',lede:'לתאורה של וילה יש ארבעה סודות. היום נכיר את כולם.',
  cards:['אור בונים בשכבות.','בסלון, אור חם.','מנורה יכולה להיות פסל.','רואים את האור, לא את הנורה.'].map((b,i)=>({t:'סוד '+(i+1),b}))})}},

{id:'roman',title:'רגע היסטורי: מנורת השמן',task:'לחצי על המנורה כדי להדליק אותה.',wide:true,
 text:'רגע היסטורי. בבית רומי, לפני כאלפיים שנה, האור של הערב הגיע ממנורות חרס קטנות כאלה. ממלאים שמן, מדליקים פתיל, ומקבלים להבה קטנה וצהבהבה. אולי לכן אור חם עדיין מרגיש לנו כמו בית.',
 mount(el,ctx){
  const box=h('button',{type:'button',class:'s3-draw s4-roman'+(ctx.data.lit?' lit':''),'aria-label':'מנורת השמן. לחצי כדי להדליק או לכבות',html:romanLamp()});box.append(illus());
  box.addEventListener('click',()=>{ctx.data.lit=!ctx.data.lit;ctx.data.tried=true;ctx.save();box.classList.toggle('lit',ctx.data.lit);ctx.done()});
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
   copy('רגע היסטורי','מנורת השמן הרומית','רגע היסטורי. בבית רומי, לפני כאלפיים שנה, האור של הערב הגיע ממנורות חרס קטנות כאלה. ממלאים שמן, מדליקים פתיל, ומקבלים להבה קטנה וצהבהבה. אולי לכן אור חם עדיין מרגיש לנו כמו בית.',
    linkCard(MET_LAMP,'מנורת שמן רומית מחרס, באתר המוזיאון','The Metropolitan Museum of Art, The Cesnola Collection'))));
  return gate(ctx,!!ctx.data.tried);
 }},

/* יחידה 2 */
{id:'layers',title:'שלוש שכבות',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'מעצבי תאורה לא מסתפקים במנורה אחת באמצע התקרה. הם בונים את האור בשלוש שכבות, וכל שכבה עושה עבודה אחרת.',
 mount(el,ctx){return flips(el,ctx,{kicker:'שכבה אחר שכבה',title:'שלוש שכבות',lede:'מעצבי תאורה לא מסתפקים במנורה אחת באמצע התקרה. הם בונים את האור בשלוש שכבות, וכל שכבה עושה עבודה אחרת.',cls:'s3-flips s4-three',
  cards:[{t:'אור כללי',front:()=>h('span',{class:'s3-draw thumb',html:art('cove')}),b:'אור כללי (Ambient Lighting): אור רך ואחיד שממלא את כל החדר. למשל פס תאורה נסתר בתקרה.'},
   {t:'אור לפעולה',front:()=>h('span',{class:'s3-draw thumb',html:art('reading')}),b:'אור לפעולה (Task Lighting): אור ממוקד במקום שבו עושים משהו. למשל מנורת קריאה ליד הכורסה.'},
   {t:'אור מדגיש',front:()=>h('span',{class:'s3-draw thumb',html:art('spotPic')}),b:'אור מדגיש (Accent Lighting): אור שמכוון אל דבר יפה. למשל ספוט על תמונה.'}]})}},

{id:'sort',title:'מה שייך לאיזו שכבה',task:'לחצי על גוף תאורה, ואחר כך על השכבה שלו.',wide:true,
 text:'שישה גופי תאורה מחכים למקום שלהם. כל אחד שייך לשכבה אחת.',
 mount(el,ctx){return sorter(el,ctx,{kicker:'מיון',title:'מה שייך לאיזו שכבה',lede:'שישה גופי תאורה מחכים למקום שלהם. כל אחד שייך לשכבה אחת.',poolCls:'s4-pool6',
  items:[['cove','פס תאורה נסתר בתקרה','amb'],['sconce','מנורת קיר שמאירה את הקיר','amb'],['reading','מנורת קריאה ליד הכורסה','task'],['under','תאורה מתחת לארונות המטבח','task'],['spotPic','ספוט על תמונה','acc'],['spotSculpt','ספוט על פסל','acc']],
  bins:[['amb','אור כללי'],['task','אור לפעולה'],['acc','אור מדגיש']],art:k=>ART[k]?'<svg viewBox="0 0 120 120" aria-hidden="true">'+ART[k]+'</svg>':'',
  hint:'כמעט. חשבי: האור הזה ממלא את החדר, עוזר לעשות משהו, או מדגיש משהו יפה?',doneMsg:'<b>שלוש שכבות, שישה גופי תאורה. הכול במקום.</b>'})}},

{id:'find',title:'מצאי את השכבות',task:'לחצי על כל נקודה מהבהבת בתמונה.',wide:true,
 text:'הנה הסלון מהפתיחה. שלוש השכבות כולן כאן, בתמונה אחת.',
 mount(el,ctx){return spots(el,ctx,{kicker:'בתמונה אחת',title:'מצאי את השכבות',lede:'הנה הסלון מהפתיחה. שלוש השכבות כולן כאן, בתמונה אחת.',
  src:IMG.on.src+'.jpg',alt:IMG.on.alt,ai:true,rowCls:'s4-findrow',
  pts:[{x:40,y:15,name:'התקרה',t:'התקרה: אור כללי. פס תאורה נסתר מקיף את התקרה, והאור נשפך ממנה רך.'},{x:49,y:52,name:'מנורת העמידה',t:'מנורת העמידה ליד הכורסה: אור לפעולה. עיגול אור בדיוק במקום שבו קוראים.'},
   {x:66,y:40,name:'קיר האבן',t:'קיר האבן והתמונה: אור מדגיש. ספוטים קטנים מהתקרה מבליטים את האבן ואת התמונה.'},{x:91,y:44,name:'המנורה מעל השולחן',t:'המנורה מעל שולחן האוכל: אור לפעולה, וגם תכשיט. עוד נחזור אליה.'}]})}},

/* יחידה 3 */
{id:'sim',title:'שחקי עם האור',task:'הדליקי כל אור, ונסי גם את העמעם ואת הצבע.',wide:true,
 text:'ערב בווילה, והכול כבוי. כל מתג מדליק אור אחר. העמעם (Dimmer) מחליש ומחזק את האור, וכפתור הצבע מחליף בין אור חם לאור קר.',
 mount(el,ctx){
  const d=ctx.data;d.st=d.st||{on:{},dim:'full',color:'warm'};const tr=d.tr||(d.tr={});
  const box=rig();const ctr=h('div',{class:'s3-ctrls'});const msg=h('div',{class:'say s3-msg',role:'status'});
  const ok=()=>LIGHTS.every(l=>tr[l[0]])&&tr.dim&&tr.color;
  function draw(m){rigApply(box,d.st);
   ctr.replaceChildren(switchRow(d.st,k=>{d.st.on[k]=!d.st.on[k];tr[k]=1;const n=LIGHTS.filter(l=>d.st.on[l[0]]).length;upd(n===4?'all':n===0?'off':d.st.on[k]?k:'off')}),
    dimRow(d.st,i=>{d.st.dim=DIM[i][0];tr.dim=1;upd(i===0?'low':null)}),colorRow(d.st,k=>{d.st.color=k;tr.color=1;upd(k==='cool'?'cool':null)}));
   if(m)msg.textContent=LMSG[m];if(ok())ctx.done()}
  function upd(m){ctx.save();draw(m)}
  el.append(head('רגע WOW','שחקי עם האור','ערב בווילה, והכול כבוי. כל מתג מדליק אור אחר. העמעם (Dimmer) מחליש ומחזק את האור, וכפתור הצבע מחליף בין אור חם לאור קר.'),
   h('div',{class:'s3-simwrap s4-simwrap'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},ctr,msg)));
  draw(LIGHTS.some(l=>d.st.on[l[0]])?null:'off');if(!msg.textContent)msg.textContent=LMSG.off;
  return gate(ctx,ok());
 }},

{id:'evenings',title:'שלושה ערבים',task:'הדליקי את האורות שמתאימים לערב, ולחצי על "זה הערב שלי".',wide:true,
 text:'שלושה ערבים בווילה, ולכל ערב אווירה אחרת. אין תשובה אחת נכונה. יש אור שמתאים לרגע.',
 mount(el,ctx){
  const d=ctx.data;const solved=d.solved||(d.solved={});let n=d.n||1;
  const E={
   1:{t:'ערב קריאה',sit:'בעלת הווילה מתיישבת בכורסה עם ספר.',check(s){const c=LIGHTS.filter(l=>s.on[l[0]]).length;if(!s.on.read)return 'יפה, אבל על הספר עדיין חשוך. איזה אור עוזר לקרוא?';if(c>=3)return 'אפשר לקרוא, אבל כל הסלון מואר. נסי לכבות את מה שלא צריך.';return null},right:'<b>בדיוק.</b> אור ממוקד על הספר, ושקט מסביב. מעצבים קוראים לזה: אינטימי.'},
   2:{t:'ארוחת אורחים',sit:'אורחים בדרך, והשולחן ערוך.',check(s){const c=LIGHTS.filter(l=>s.on[l[0]]).length;if(!s.on.pend)return 'האורחים יושבים בחושך. איזה אור מאיר את השולחן?';if(c<3)return 'השולחן מואר, אבל החדר סביבו חשוך. הוסיפי עוד שכבה.';return null},right:'<b>בדיוק.</b> השולחן במרכז, והחדר כולו מזמין. מעצבים קוראים לזה: חגיגי.'},
   3:{t:'ערב שקט מול הגינה',sit:'סוף הערב. יושבים על הספה מול הגינה, ורוצים אור רך ושקט.',check(s){const c=LIGHTS.filter(l=>s.on[l[0]]).length;if(s.on.pend)return 'השולחן כבר ריק, והמנורה שמעליו עוד דולקת. נסי לכבות אותה.';if(c<1||c>2)return c<1?'חושך גמור. הדליקי אור אחד או שניים.':'קצת מואר מדי לסוף הערב. נסי לכבות אור אחד.';if(s.dim!=='low')return 'קצת מואר מדי לסוף הערב. רוצה לעמעם?';return null},right:'<b>בדיוק.</b> מעט אור, נמוך ורך. מעצבים קוראים לזה: רגוע.'}
  };
  const st=d.st||(d.st={on:{},dim:'full',color:'warm'});
  const box=rig();const ctr=h('div',{class:'s3-ctrls'});const res=h('div',{class:'s4-res'});box.append(res);const card=h('div',{class:'s4-card'});const tabs=h('div',{class:'s3-tabs',role:'group','aria-label':'הערבים'});
  function draw(){rigApply(box,st);const e=E[n];
   tabs.replaceChildren(...[1,2,3].map(i=>h('button',{type:'button','aria-pressed':String(i===n),class:solved[i]?'ok':'',onclick:()=>{n=i;d.n=i;ctx.save();res.replaceChildren();draw()}},(solved[i]?'✓ ':'')+'ערב '+i)));
   card.replaceChildren(h('p',{class:'s3-sit'},h('b',null,'ערב '+n+': '+e.t+'. '),e.sit));
   ctr.replaceChildren(switchRow(st,k=>{st.on[k]=!st.on[k];ctx.save();draw()}),h('div',{class:'s4-dc'},dimRow(st,i=>{st.dim=DIM[i][0];ctx.save();draw()}),colorRow(st,k=>{st.color=k;ctx.save();draw()})));
   tabs.append(h('button',{class:'cta s4-mine',type:'button',onclick:judge},'זה הערב שלי'));
   if([1,2,3].every(i=>solved[i]))ctx.done()}
  function judge(){const e=E[n];const pre=st.color==='cool'?'הרגשת שהסלון התקרר? לערב בסלון מתאים אור חם. ':'';const bad=e.check(st);
   if(bad||st.color==='cool'){sayBox(res,pre+(bad||''));return}
   solved[n]=true;ctx.save();
   if([1,2,3].every(i=>solved[i]))sayBox(res,e.right+' '+nameFill('<b>הדלקת שלושה ערבים, {name}. ככה עובדת מעצבת תאורה.</b>'));
   else sayBox(res,e.right);draw()}
  el.append(head('המשימה','שלושה ערבים','שלושה ערבים בווילה, ולכל ערב אווירה אחרת. אין תשובה אחת נכונה. יש אור שמתאים לרגע.'),
   h('div',{class:'s3-simwrap s4-simwrap s4-eve'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},tabs,card,ctr)));
  draw();
  return gate(ctx,[1,2,3].every(i=>solved[i]));
 }},

/* יחידה 4 */
{id:'kelvin',title:'צבע האור',task:'לחצי על שלושת הכפתורים וראי איך הסלון משתנה.',wide:true,
 text:'לכל נורה יש צבע, והוא נמדד בקלווין (Kelvin), באות K. מספר נמוך נותן אור צהבהב וחם. מספר גבוה נותן אור לבן וכחלחל. לסלון, לחדר השינה ולפינת האוכל בוחרים אור חם, בסביבות 2700K.',
 mount(el,ctx){
  const d=ctx.data;const tr=d.tr||(d.tr={});const res=h('div');
  const K=[['k27','חם, 2700K','אור צהבהב ורך. העץ, הבד והאבן נראים חמים.'],['k35','לבן-קר, 3500K','האור מתבהר, והצבעים מתקררים.'],['k50','אור יום, 5000K','אור לבן וכחלחל, כמו שמיים בצהריים.']];
  const box=h('div',{class:'s2-pic s4-k '+(d.k||'k27')},pic('on','lg'),h('div',{class:'s4-ktint'}),aiTag());
  const btns=h('div',{class:'s2-periods sm s4-kbtns',role:'group','aria-label':'צבע האור'});
  function draw(){btns.replaceChildren(...K.map(([k,t])=>h('button',{type:'button','aria-pressed':String(d.k===k),class:tr[k]?'seen':'',dir:'rtl',onclick:()=>{d.k=k;tr[k]=1;ctx.save();box.className='s2-pic s4-k '+k;sayBox(res,'<b>'+t+':</b> '+K.find(x=>x[0]===k)[2]);draw()}},t)));
   if(K.every(x=>tr[x[0]]))ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),
   copy('קלווין','צבע האור','לכל נורה יש צבע, והוא נמדד בקלווין (Kelvin), באות K. מספר נמוך נותן אור צהבהב וחם. מספר גבוה נותן אור לבן וכחלחל. לסלון, לחדר השינה ולפינת האוכל בוחרים אור חם, בסביבות 2700K.',res)));
  draw();if(d.k){const x=K.find(y=>y[0]===d.k);sayBox(res,'<b>'+x[1]+':</b> '+x[2])}
  return gate(ctx,K.every(x=>tr[x[0]]));
 }},

{id:'rooms',title:'לכל חדר האור שלו',task:'בחרי צבע אור לכל אחד משלושת החדרים.',wide:true,
 text:'אור לבן-קר הוא לא טעות. הוא פשוט שייך למקום אחר: למטבח ולפינת העבודה.',
 mount(el,ctx){
  const d=ctx.data;const pick=d.pick||(d.pick={});const res=h('div');
  const R=[['living','סלון','warm'],['kitchen','מטבח','cool'],['bed','חדר שינה','warm']];
  const grid=h('div',{class:'s4-rooms'});
  function draw(){grid.replaceChildren(...R.map(([k,t,ans])=>{const v=pick[k];
    const pic=h('div',{class:'s3-draw s4-room'+(v===ans?' ok':''),html:roomArt(k,v!=='cool')});pic.append(illus());
    return h('figure',null,pic,h('figcaption',null,t),h('div',{class:'chips sm',role:'group','aria-label':'צבע האור ב'+t},...[['warm','אור חם'],['cool','אור לבן-קר']].map(([c,ct])=>h('button',{type:'button','aria-pressed':String(v===c),onclick:()=>choose(k,c)},ct))))}));
   if(R.every(([k,,a])=>pick[k]===a))ctx.done()}
  function choose(k,c){pick[k]=c;ctx.save();const ans=R.find(x=>x[0]===k)[2];
   if(c===ans)sayBox(res,R.every(([kk,,a])=>pick[kk]===a)?'<b>בדיוק.</b> אור חם לסלון ולחדר השינה, ואור לבן-קר למטבח.':'<b>בדיוק.</b>');
   else sayBox(res,k==='kitchen'?'אפשר, אבל למטבח מתאים דווקא אור לבן-קר.':'החדר נראה ערני מדי לערב. נסי אור חם.');draw()}
  el.append(head('לכל חדר','לכל חדר האור שלו','אור לבן-קר הוא לא טעות. הוא פשוט שייך למקום אחר: למטבח ולפינת העבודה.'),grid,res);
  draw();
  return gate(ctx,R.every(([k,,a])=>pick[k]===a));
 }},

{id:'statement',title:'מנורה שהיא פסל',task:'לחצי על "כבויה" ועל "דלוקה".',wide:true,
 text:'מעל שולחן האוכל תלויה מנורה מפליז. בערב היא מאירה את השולחן. גם כשהיא כבויה, היא מושכת את העין. מעצבים קוראים לה גוף תאורה מרכזי (Statement Lighting): מנורה שהיא גם פסל.',
 mount(el,ctx){
  const d=ctx.data;const tr=d.tr||(d.tr={});const cur=d.cur||'off';
  const box=h('div',{class:'s2-pic s2-fade s4-zoom'},pic('off','lg',{class:'lay'+(cur==='off'?' on':''),'data-k':'off',alt:'המנורה מפליז מעל שולחן האוכל, כבויה.'}),pic('on','lg',{class:'lay'+(cur==='on'?' on':''),'data-k':'on',alt:'המנורה מפליז מעל שולחן האוכל, דלוקה.'}),aiTag());
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':'כבויה או דלוקה'},...[['off','כבויה'],['on','דלוקה']].map(([k,t])=>h('button',{type:'button','data-k':k,'aria-pressed':String(cur===k),onclick:()=>show(k)},t)));
  function show(k){d.cur=k;tr[k]=1;ctx.save();box.querySelectorAll('.lay').forEach(i=>i.classList.toggle('on',i.dataset.k===k));btns.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));if(tr.on&&tr.off)ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),
   copy('גוף תאורה מרכזי','מנורה שהיא פסל','מעל שולחן האוכל תלויה מנורה מפליז. בערב היא מאירה את השולחן. גם כשהיא כבויה, היא מושכת את העין. מעצבים קוראים לה גוף תאורה מרכזי (Statement Lighting): מנורה שהיא גם פסל.')));
  return gate(ctx,!!(tr.on&&tr.off));
 }},

{id:'indirect',title:'רואים את האור, לא את הנורה',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'נורה חשופה מושכת את העין אל עצמה. בווילה מסתירים את הנורה ומכוונים את האור אל התקרה או אל הקיר. משם הוא חוזר אל החדר, רך ואחיד. קוראים לזה תאורה עקיפה (Indirect Lighting).',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,cornerArt(false),cornerArt(true),'נורה חשופה','אור עקיף')),
   copy('הסוד הרביעי','רואים את האור, לא את הנורה','נורה חשופה מושכת את העין אל עצמה. בווילה מסתירים את הנורה ומכוונים את האור אל התקרה או אל הקיר. משם הוא חוזר אל החדר, רך ואחיד. קוראים לזה תאורה עקיפה (Indirect Lighting).')));
  return gate(ctx,ctx.data.cut!=null&&ctx.data.cut!==50);
 }},

/* יחידה 5 */
{id:'plan',title:'תאורה לסלון שלך',task:'לחצי על כל נקודה מהבהבת, ובחרי לה גוף תאורה.',wide:true,
 text:ctx=>layoutOf(ctx.S).done?'הסלון שסידרת במפגש הראשון חוזר, והפעם בערב. חסר לו רק אור. בארבע נקודות מחכה לך בחירה, ואין כאן בחירה לא נכונה.':'הנה סלון של וילה בערב. חסר לו רק אור. בארבע נקודות מחכה לך בחירה, ואין כאן בחירה לא נכונה.',
 mount(el,ctx){
  const {layout,done}=layoutOf(ctx.S);const p=ctx.data.p||(ctx.data.p={});let open=ctx.data.open||null;
  const wrap=h('div',{class:'s4-planwrap'});const side=h('div',{class:'s3-side'});const res=h('div');
  const all=()=>PT.every(x=>p[x.k]);
  function draw(){
   const pl=lightPlan(layout,p,false);const pos=ptPos(layout);
   PT.forEach(x=>{const c=pc(pos[x.k]);const b=h('button',{type:'button',class:'s2-dot s4-pt'+(p[x.k]?' found':'')+(open===x.k?' on':''),style:`left:${c.l}%;top:${c.t}%`,'aria-label':x.t},p[x.k]?'✓':'');
    b.addEventListener('click',()=>{open=x.k;ctx.data.open=open;ctx.save();draw()});pl.append(b)});
   pl.append(illus());wrap.replaceChildren(pl);
   const cur=PT.find(x=>x.k===open);
   side.replaceChildren(h('p',{class:'s3-sit'},h('b',null,'נבחרו '+PT.filter(x=>p[x.k]).length+' מתוך 4.'),' '+(cur?'':'לחצי על נקודה בתכנית.')),
    ...(cur?[h('div',{class:'s4-opts'},h('b',null,cur.t),h('div',{class:'chips s3-opts'},...cur.opts.map(([k,t,l])=>h('button',{type:'button','aria-pressed':String(p[cur.k]===k),onclick:()=>{p[cur.k]=k;ctx.save();
      const nx=PT.find(x=>!p[x.k]);open=nx?nx.k:open;ctx.data.open=open;draw()}},t,l?h('span',{class:'s4-l'},' · '+l):null))))]:[]),res);
   if(all()){sayBox(res,'<b>ארבע בחירות.</b> לחצי על "הבא" ותראי את הסלון שלך בערב.');ctx.done()}
  }
  el.append(head('המשימה','תאורה לסלון שלך',done?'הסלון שסידרת במפגש הראשון חוזר, והפעם בערב. חסר לו רק אור. בארבע נקודות מחכה לך בחירה, ואין כאן בחירה לא נכונה.':'הנה סלון של וילה בערב. חסר לו רק אור. בארבע נקודות מחכה לך בחירה, ואין כאן בחירה לא נכונה.'),
   h('div',{class:'s3-simwrap s4-planrow'},wrap,side));
  draw();
  return gate(ctx,all());
 }},

{id:'myplan',title:'הסלון שלך בלילה',task:'לחצי על "שמרי במחברת", או על "שני בחירה" כדי לחזור.',wide:true,
 text:'ככה הסלון שלך נראה בערב, {name}.',
 mount(el,ctx){
  const {layout}=layoutOf(ctx.S);const p=((ctx.all.plan||{}).p)||{};const res=h('div');
  if(!PT.every(x=>p[x.k])){el.append(h('div',{class:'center'},h('div',null,h('h2',null,'הסלון שלך בלילה'),h('p',{class:'lede'},'התכנית עוד לא מוכנה. חזרי מסך אחד אחורה והשלימי אותה.'))));return gate(ctx,false)}
  const pl=lightPlan(layout,p,true);pl.classList.add('lit');pl.append(illus());
  const sentence=planSentence(p);
  const btn=h('button',{class:'cta',type:'button',onclick:()=>{
    const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='light4'&&n.session===4);const L=layout||P.SOLUTION.window;
    if(old){old.picks=JSON.parse(JSON.stringify(p));old.layout=JSON.parse(JSON.stringify(L));old.text=planText(p);old.ts=Date.now();ctx.save()}
    else ctx.notebook({kind:'light4',svg:true,title:'תכנית התאורה שלי, מפגש 4',picks:JSON.parse(JSON.stringify(p)),layout:JSON.parse(JSON.stringify(L)),text:planText(p)});
    ctx.data.saved=true;ctx.save();sayBox(res,'<b>נשמר במחברת שלך.</b>');ctx.done()}},'שמרי במחברת');
  el.append(h('div',{class:'split media s2-split s4-myplan'},h('div',{class:'s2-media'},pl),
   copy('בערב','הסלון שלך בלילה',nameFill('ככה הסלון שלך נראה בערב, {name}.'),h('p',{class:'s3-sum'},sentence),
    h('div',{class:'row',style:'margin-top:12px'},btn,h('button',{class:'btn',type:'button',onclick:()=>document.querySelector('.nav .prev').click()},'שני בחירה')),res)));
  if(ctx.data.saved)sayBox(res,'<b>נשמר במחברת שלך.</b>');
  return gate(ctx,!!ctx.data.saved);
 }},

/* יחידה 6 */
{id:'check1',title:'בדיקה 1',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מנורת קריאה ליד הכורסה היא איזו שכבה?',[['אור לפעולה'],['אור כללי'],['אור מדגיש']]),
 mount(el,ctx){const v=drawBox(readArt());
  return quiz(el,ctx,{kicker:'בדיקה 1',lede:'ארבע שאלות קצרות על מה שראית היום.',q:'מנורת קריאה ליד הכורסה היא איזו שכבה?',visual:v,
  opts:[['אור לפעולה',1],['אור כללי',0],['אור מדגיש',0]],hint:'חשבי: מה עושים ליד המנורה הזו?',right:'<b>בדיוק.</b> היא מאירה את המקום שבו קוראים.'})}},

{id:'check2',title:'בדיקה 2',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('על הנורה כתוב 2700K. איזה אור היא נותנת?',[['אור צהבהב וחם'],['אור לבן וכחלחל'],['אי אפשר לדעת מהמספר']]),
 mount(el,ctx){const v=drawBox(bulbBox());
  return quiz(el,ctx,{kicker:'בדיקה 2',q:'על הנורה כתוב 2700K. איזה אור היא נותנת?',visual:v,
  opts:[['אור צהבהב וחם',1],['אור לבן וכחלחל',0],['אי אפשר לדעת מהמספר',0]],hint:'מספר נמוך או גבוה? היזכרי בשלושת הכפתורים של צבע האור.',right:'<b>בדיוק.</b> מספר נמוך נותן אור חם.'})}},

{id:'check3',title:'בדיקה 3',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('לאיזה חדר מתאים אור לבן-קר?',[['למטבח'],['לסלון בערב'],['לחדר השינה']]),
 mount(el,ctx){
  return quiz(el,ctx,{kicker:'בדיקה 3',q:'לאיזה חדר מתאים אור לבן-קר?',visual:h('div',{class:'s4-q3'},threeRooms(),h('div',{class:'note s2-cap'},'המחשה')),
  opts:[['למטבח',1],['לסלון בערב',0],['לחדר השינה',0]],hint:'זה החדר שבו עובדים, לא החדר שבו נחים.',right:'<b>בדיוק.</b> במטבח ובפינת העבודה אור לבן-קר נמצא במקומו.'})}},

{id:'check4',title:'בדיקה 4',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('אותן מנורות, אווירה אחרת. מה עושה את ההבדל?',[['עמעם'],['נורה חזקה יותר'],['וילון עבה']]),
 mount(el,ctx){
  const v=h('div',{class:'s4-two'},h('figure',null,h('div',{class:'s2-pic'},pic('on','sm')),h('figcaption',null,'עוצמה מלאה')),h('figure',null,h('div',{class:'s2-pic s4-dimmed'},pic('on','sm',{alt:'אותו סלון, באור מעומעם.'})),h('figcaption',null,'מעומעם')),aiTag());
  return quiz(el,ctx,{kicker:'בדיקה 4',q:'אותן מנורות, אווירה אחרת. מה עושה את ההבדל?',visual:v,
  opts:[['עמעם',1],['נורה חזקה יותר',0],['וילון עבה',0]],hint:'היזכרי בפלוס ובמינוס שבסימולטור.',right:nameFill('<b>בדיוק.</b> העמעם מחליש את האור בלי להחליף אף מנורה. <b>ארבע מתוך ארבע, {name}.</b>')})}},

/* יחידה 7 */
{id:'home-idea',title:'רעיון לבית',task:'אם תרצי, כתבי איפה הייתה עומדת המנורה ושמרי במחברת.',
 text:'רעיון לבית, למי שרוצה. ערב אחד הדליקי מנורה קטנה אחת או שתיים, ורק אז כבי את האור שבתקרה. הסלון מרגיש אחרת? ואם היית מוסיפה לו מנורה אחת, איפה היא הייתה עומדת?',
 mount(el,ctx){ideaScreen(el,ctx,{n:4,media:h('div',{style:'position:relative;height:100%'},pic('on','lg'),aiTag()),field:'המנורה שהייתי מוסיפה',
  text:'רעיון לבית, למי שרוצה. ערב אחד הדליקי מנורה קטנה אחת או שתיים, ורק אז כבי את האור שבתקרה. הסלון מרגיש אחרת? ואם היית מוסיפה לו מנורה אחת, איפה היא הייתה עומדת?'})}},

{id:'summary',title:'סיכום',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',
 mount(el,ctx){
  const th=(html)=>()=>h('span',{class:'s3-draw thumb',html});
  return flips(el,ctx,{kicker:'סיכום',title:'ארבעה כללים',lede:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',cls:'s3-flips',toggle:true,
   cards:[{t:'אור בונים בשכבות',front:th(svg('0 0 360 120',`<g>${ART.cove}</g><g transform="translate(120 0)">${ART.reading}</g><g transform="translate(240 0)">${ART.spotPic}</g>`)),b:'אור כללי, אור לפעולה ואור מדגיש. שלושתם יחד.'},
    {t:'בסלון, אור חם',front:()=>h('span',{class:'thumb ph'},pic('on','sm',{alt:''}),aiTag()),b:'בסביבות 2700K. אור לבן-קר שייך למטבח ולפינת העבודה.'},
    {t:'מנורה יכולה להיות פסל',front:()=>h('span',{class:'thumb ph s4-thumbzoom'},pic('off','sm',{alt:''}),aiTag()),b:'היא יפה גם ביום, כשהיא כבויה.'},
    {t:'רואים את האור, לא את הנורה',front:th(cornerArt(true)),b:'האור מכוון אל התקרה ואל הקיר, ועמעם משנה את האווירה.'}]});
 }},

{id:'audio',title:'סקירה קולית',task:'לחצי על הנגן כדי לשמוע.',skip:()=>!audioOK,
 text:'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.',
 mount(el,ctx){audioScreen(el,ctx,4)}},

{id:'feedback',title:'משוב וגשר',task:'דרגי בלחיצה, ואם תרצי, כתבי גם כמה מילים.',wide:true,hideNext:true,
 say:'{name}, סיימת את מפגש 4. הדלקת סלון שלם שכבה אחר שכבה, ותכננת תאורה לסלון שלך. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
 mount(el,ctx){feedbackScreen(el,ctx,{n:4,open:'{name}, סיימת את מפגש 4. הדלקת סלון שלם שכבה אחר שכבה, ותכננת תאורה לסלון שלך. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
  extra:{q:'איזה מפגש הכי אהבת עד עכשיו?',show:'המפגש שהכי אהבתי',opts:['מבית לחלל חלומות','קפלים בזמן','וילות יוקרה בישראל','אור ואווירה'],why:'רוצה לכתוב למה?'},
  bridgeMedia:h('div',{style:'position:relative'},h('div',{class:'s4-board',html:boardArt()}),illus()),
  bridge:'במפגש הבא: צבעים וחומרים. אחרי האור מגיע הצבע. תערבבי פלטה לסלון שלם, ותתקרבי אל האבן, העץ והבד עד שכמעט אפשר לגעת.'})}}
];

/* לוח חומרים לגשר: המחשה */
function boardArt(){return svg('0 0 300 300',`<rect width="300" height="300" fill="#E9E1D3"/>
 <rect x="22" y="24" width="70" height="96" rx="4" fill="${C.terra}"/><rect x="100" y="24" width="70" height="96" rx="4" fill="${C.lead}"/><rect x="178" y="24" width="70" height="96" rx="4" fill="${C.mustard}"/>
 <rect x="30" y="140" width="120" height="70" rx="6" fill="#EADFC8"/><path d="M40 160c30 6 60-4 100 4M44 188c34-8 60 6 96-2" stroke="#D2C2A2" stroke-width="3" fill="none"/>
 <rect x="162" y="136" width="110" height="60" rx="4" fill="#C39A66"/><path d="M162 150h110M162 166c40-4 70 4 110 0M162 182h110" stroke="#A97F4E" stroke-width="2"/>
 <path d="M40 230h120l14 46H54z" fill="#E7E2D6" stroke="#CFC7B4" stroke-width="2"/><path d="M60 236l10 36M84 236l8 36M108 236l6 36M132 236l4 36" stroke="#D8D0BE" stroke-width="2"/>
 <circle cx="230" cy="244" r="30" fill="${C.brass}"/><circle cx="230" cy="244" r="30" fill="none" stroke="#A88433" stroke-width="3"/><rect x="250" y="26" width="34" height="94" rx="4" fill="${C.sage}"/>`,'role="img"')}

window.Salon.register(4,screens);
})();
