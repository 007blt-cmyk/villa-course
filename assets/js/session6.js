/* הסלון של מזל · מפגש 6: המטבח וחללי האירוח
   בלוק נתונים ורכיבים של המפגש. לא נוגע במנוע ולא במפגשים 1 עד 5. */
(function(){
'use strict';
const {h}=window.Salon;
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
  el.append(head(o.kicker,o.title,o.lede),h('div',{class:'s3-row'},h('div',{class:'s2-media'},box,o.credit?h('div',{class:'note s2-cap'},o.credit):null),h('div',null,h('div',{class:'row'},counter),list)));
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

/* ---------- מדיה ---------- */
const BRIDGE={src:'assets/img/s6-bridge.jpg',alt:'ארבעה לוחות עץ מגולפים תלויים על קיר בהיר, מעל כורסת עץ ושטיח.'};
let audioOK=false;
fetch('assets/audio/s6.m4a',{method:'HEAD'}).then(r=>{audioOK=r.ok}).catch(()=>{});

/* ---------- צבעים ---------- */
const C={ink:'#1A3A35',lead:'#14474A',terra:'#C65A3C',mustard:'#E0A63A',sage:'#9DB39A',paper:'#F7F0E4',cream:'#F2E6CF',brass:'#C9A24B',stone:'#E4D3B0',stoneD:'#C9B48A',wood:'#B9824F',oak:'#C69C6A'};
const glowDef=(id,col)=>`<radialGradient id="${id}"><stop offset="0" stop-color="${col||'#FFD98A'}" stop-opacity=".9"/><stop offset="1" stop-color="${col||'#FFD98A'}" stop-opacity="0"/></radialGradient>`;

/* המטבח: חזית, לבחירה ולמחברת */
const CAB={petrol:['ירוק נפט','#14474A'],cream:['שמנת','#EFE4CF'],terra:['טרקוטה','#C65A3C'],sage:['מרווה','#9DB39A']};
const TOP={light:['שיש בהיר','#F3F0EA','#C9C2B5'],dark:['שיש כהה','#3B3F42','#7C8186'],oak:['עץ אלון','#C69C6A','#A97F4E']};
const STOOL={wood:['כיסאות עץ'],mustard:['כיסאות מרופדים בחרדל'],black:['כיסאות מתכת שחורה']};
const PEND={brass:['מנורות פליז'],glass:['מנורות זכוכית'],rattan:['מנורות קש']};
function kitchenSvg(k,eve,id){
  id=id||'kt';k=Object.assign({cab:'petrol',top:'light',stool:'wood',pend:'brass'},k||{});
  const cab=CAB[k.cab][1],cabD=shade(cab,-.2),top=TOP[k.top];
  const stool=x=>{if(k.stool==='wood')return `<rect x="${x}" y="300" width="60" height="14" rx="6" fill="${C.oak}"/><path d="M${x+6} 314l-6 70M${x+54} 314l6 70M${x+4} 356h52" stroke="#8B5A2B" stroke-width="7"/>`;
   if(k.stool==='mustard')return `<rect x="${x-2}" y="262" width="64" height="40" rx="12" fill="${C.mustard}"/><rect x="${x}" y="294" width="60" height="20" rx="8" fill="${C.mustard}"/><path d="M${x+8} 314v70M${x+52} 314v70" stroke="#5B4630" stroke-width="6"/>`;
   return `<rect x="${x}" y="300" width="60" height="10" rx="4" fill="#2B2B2B"/><path d="M${x+6} 310l-4 74M${x+54} 310l4 74M${x+6} 356h48" stroke="#2B2B2B" stroke-width="5"/>`};
  const pend=x=>{let s=`<path d="M${x} 0v${k.pend==='glass'?92:78}" stroke="#333" stroke-width="2"/>`;
   if(k.pend==='brass')s+=`<path d="M${x-26} 106l10-28h32l10 28z" fill="${C.brass}"/>`;
   if(k.pend==='glass')s+=`<circle cx="${x}" cy="108" r="22" fill="#E8F2F2" fill-opacity=".7" stroke="#9FB9BC" stroke-width="2"/><circle cx="${x}" cy="110" r="6" fill="${eve?'#FFF3C4':'#D8D8D8'}"/>`;
   if(k.pend==='rattan')s+=`<path d="M${x-30} 110q30-46 60 0z" fill="#D7B47A"/><path d="M${x-24} 100h48M${x-16} 90h32" stroke="#B38E52" stroke-width="2"/>`;
   if(eve)s+=`<ellipse cx="${x}" cy="150" rx="70" ry="60" fill="url(#${id}g)"/><path d="M${x-26} 110l-30 160h112l-30-160z" fill="#FFE4A0" opacity=".25"/>`;
   return s};
  return svg('0 0 640 420',`<defs>${glowDef(id+'g')}</defs><rect width="640" height="420" fill="${eve?'#5E5A55':'#F1E8DA'}"/>
  <rect y="384" width="640" height="36" fill="${eve?'#6E5638':C.oak}"/>
  <rect x="40" y="40" width="560" height="110" fill="${cab}"/>${[180,320,460].map(x=>`<path d="M${x} 40v110" stroke="${cabD}" stroke-width="2"/>`).join('')}
  <rect x="40" y="150" width="560" height="70" fill="${eve?'#7A746C':'#E9E3D8'}"/>
  <rect x="40" y="220" width="560" height="10" fill="${top[1]}" stroke="${top[2]}" stroke-width="2"/>
  <rect x="40" y="230" width="560" height="154" fill="${cab}"/>${[180,320,460].map(x=>`<path d="M${x} 230v154" stroke="${cabD}" stroke-width="2"/>`).join('')}
  <rect x="120" y="270" width="400" height="16" fill="${top[1]}" stroke="${top[2]}" stroke-width="2"/>
  <path d="M150 274c60 4 120-4 180 2s110-2 160 2" stroke="${top[2]}" stroke-width="1.5" fill="none" opacity="${k.top==='oak'?0:.8}"/>
  <rect x="132" y="286" width="376" height="98" fill="${shade(cab,.12)}"/>
  ${stool(160)}${stool(290)}${stool(420)}${pend(250)}${pend(390)}
  ${eve?`<rect x="0" y="0" width="640" height="420" fill="#1A2330" opacity=".18"/>`:''}`,'role="img"');
}
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const m=x=>Math.max(0,Math.min(255,Math.round(f<0?x*(1+f):x+(255-x)*f)));return '#'+[m(r),m(g),m(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function kitText(k){return 'ארונות ב'+CAB[k.cab][0]+', משטח אי מ'+TOP[k.top][0]+', '+STOOL[k.stool][0]+' ו'+PEND[k.pend][0]+'.'}
const prevDraw=window.Salon.drawNote;
window.Salon.drawNote=function(it){if(it.kind==='kitchen6'&&it.kit){return h('div',{class:'s3-nb',html:kitchenSvg(it.kit,true,'nb'+it.ts)})}return prevDraw?prevDraw(it):null};

/* תכנית: מטבח סגור ומטבח פתוח */
function planArt(open){
  const wall='stroke="'+C.ink+'" stroke-width="10" stroke-linecap="square"';
  return svg('0 0 600 400',`<rect width="600" height="400" fill="#E9D7B6"/>
  <rect x="20" y="20" width="560" height="360" fill="none" ${wall}/>
  <rect x="30" y="30" width="200" height="40" fill="${C.lead}"/><rect x="30" y="70" width="40" height="120" fill="${C.lead}"/>
  ${open?`<rect x="90" y="140" width="150" height="56" rx="4" fill="${C.stone}" stroke="${C.ink}" stroke-width="2"/>${[110,165,220].map(x=>`<circle cx="${x}" cy="214" r="11" fill="${C.wood}"/>`).join('')}`:`<path d="M250 20v150M250 230v150M20 230h80M160 230h90" ${wall}/>`}
  <rect x="330" y="80" width="150" height="70" rx="6" fill="${C.wood}"/>${[350,400,450].map(x=>`<circle cx="${x}" cy="70" r="10" fill="${C.terra}"/><circle cx="${x}" cy="160" r="10" fill="${C.terra}"/>`).join('')}
  <rect x="320" y="260" width="200" height="60" rx="18" fill="${C.sage}"/><rect x="380" y="200" width="70" height="40" rx="4" fill="#fff" stroke="${C.ink}" stroke-width="2"/>
  <g font-family="Assistant,sans-serif" font-weight="800" font-size="22" fill="${C.ink}" text-anchor="middle"><text x="130" y="${open?120:150}">מטבח</text><text x="405" y="190">פינת אוכל</text><text x="420" y="350">סלון</text></g>
  ${open?`<circle cx="160" cy="120" r="12" fill="${C.mustard}"/><path d="M172 124 L330 260" stroke="${C.mustard}" stroke-width="4" stroke-dasharray="10 8"/>`:`<circle cx="160" cy="150" r="12" fill="${C.mustard}"/>`}`,'role="img"');
}

/* הבית הרומי: שלוש תחנות */
function stopArt(k){
  if(k==='atrium')return svg('0 0 200 200',`<rect width="200" height="200" fill="#EFE3C8"/><rect x="20" y="20" width="160" height="160" fill="#E2D2AE" stroke="${C.ink}" stroke-width="5"/><rect x="70" y="70" width="60" height="60" fill="#9CC3CF" stroke="${C.ink}" stroke-width="3"/><circle cx="100" cy="150" r="14" fill="${C.terra}"/><path d="M92 150c0-14 8-20 8-26 0 6 8 12 8 26z" fill="#FFC24A"/>`);
  if(k==='culina')return svg('0 0 200 200',`<rect width="200" height="200" fill="#EFE3C8"/><rect x="20" y="20" width="160" height="160" fill="#E2D2AE" stroke="${C.ink}" stroke-width="5"/><rect x="70" y="70" width="60" height="60" fill="#9CC3CF" stroke="${C.ink}" stroke-width="3"/><rect x="128" y="128" width="52" height="52" fill="#D2B88C" stroke="${C.ink}" stroke-width="4"/><circle cx="154" cy="154" r="10" fill="${C.terra}"/>`);
  return svg('0 0 200 200',`<rect width="200" height="200" fill="#EFE3C8"/><rect x="20" y="20" width="160" height="160" fill="#E9D7B6" stroke="${C.ink}" stroke-width="5"/><rect x="28" y="28" width="144" height="22" fill="${C.lead}"/><rect x="66" y="84" width="68" height="30" rx="4" fill="${C.stone}" stroke="${C.ink}" stroke-width="2"/><rect x="50" y="140" width="100" height="26" rx="10" fill="${C.sage}"/><circle cx="84" cy="99" r="7" fill="${C.terra}"/>`);
}

/* משולש העבודה */
const ST={sink:{x:300,y:40,t:'כיור'},cook:{x:300,y:220,t:'כיריים'},fA:{x:50,y:40},fB:{x:140,y:40},fC:{x:380,y:40}};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)/100;
function triArt(fr,show){
  const f=ST[fr]||ST.fB;const s=ST.sink,c=ST.cook;
  const L=[[s,f],[f,c],[c,s]].map(([a,b])=>dist(a,b));const ok=x=>x>=1.2&&x<=2.7;
  const lab=(a,b,v)=>`<g><rect x="${(a.x+b.x)/2-34}" y="${(a.y+b.y)/2-16}" width="68" height="30" rx="15" fill="${ok(v)?C.lead:C.terra}"/><text x="${(a.x+b.x)/2}" y="${(a.y+b.y)/2+6}" text-anchor="middle" font-family="Assistant,sans-serif" font-weight="800" font-size="18" fill="#fff">${v.toFixed(1)} מ'</text></g>`;
  const node=(p,t,col)=>`<circle cx="${p.x}" cy="${p.y}" r="22" fill="${col}" stroke="#fff" stroke-width="4"/><text x="${p.x}" y="${p.y+(p.y<100?46:-30)}" text-anchor="middle" font-family="Assistant,sans-serif" font-weight="800" font-size="20" fill="${C.ink}">${t}</text>`;
  return svg('0 0 600 330',`<rect width="600" height="330" fill="#E9D7B6"/><rect x="10" y="10" width="580" height="310" fill="none" stroke="${C.ink}" stroke-width="8"/>
  <rect x="14" y="14" width="572" height="56" fill="${C.sage}" opacity=".8"/><rect x="180" y="190" width="240" height="70" rx="6" fill="${C.stone}" stroke="${C.ink}" stroke-width="2"/>
  ${show?`<path d="M${s.x} ${s.y}L${f.x} ${f.y}L${c.x} ${c.y}Z" fill="${C.mustard}" fill-opacity=".18" stroke="${C.mustard}" stroke-width="5" stroke-dasharray="12 8"/>${lab(s,f,L[0])}${lab(f,c,L[1])}${lab(c,s,L[2])}`:''}
  ${node(s,'כיור','#5D8FA8')}${node(c,'כיריים',C.terra)}${node(f,'מקרר','#7E8C8F')}`,'role="img"');
}

/* האי: תכנית בסנטימטרים */
const IS={W:600,H:560,cf:60,tab:480,dep:100,x1:180,x2:420};
function islandSvg(T,mode){
  const A=T-IS.cf,B=IS.tab-(T+IS.dep);const needA=mode===2?122:107,needB=92;
  const okA=A>=needA,okB=B>=needB;
  const dim=(y1,y2,v,ok,x)=>`<path d="M${x} ${y1+4}V${y2-4}" stroke="${ok?C.lead:C.terra}" stroke-width="5" marker-start="url(#ar)" marker-end="url(#ar)"/><rect x="${x+12}" y="${(y1+y2)/2-18}" width="104" height="36" rx="18" fill="${ok?C.lead:C.terra}"/><text x="${x+64}" y="${(y1+y2)/2+7}" text-anchor="middle" font-family="Assistant,sans-serif" font-weight="800" font-size="20" fill="#fff">${Math.round(v)} ס"מ</text>`;
  return {okA,okB,A,B,html:svg(`0 0 ${IS.W} ${IS.H}`,`<defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#fff"/></marker></defs>
  <rect width="${IS.W}" height="${IS.H}" fill="#E9D7B6"/><rect x="0" y="0" width="${IS.W}" height="${IS.cf}" fill="${C.lead}"/><path d="M0 ${IS.cf}h${IS.W}" stroke="${C.ink}" stroke-width="3"/>
  <rect x="280" y="10" width="60" height="40" rx="8" fill="#9CC3CF" stroke="#fff" stroke-width="3"/>
  <rect x="160" y="${IS.tab}" width="280" height="70" rx="8" fill="${C.wood}"/>${[190,250,310,370,410].map(x=>`<circle cx="${x}" cy="${IS.tab+86}" r="0" fill="none"/>`).join('')}
  <g class="isl" style="cursor:grab"><rect x="${IS.x1}" y="${T}" width="${IS.x2-IS.x1}" height="${IS.dep}" rx="8" fill="${C.stone}" stroke="${C.ink}" stroke-width="3"/><path d="M${IS.x1+20} ${T+30}c60 6 120-4 200 4" stroke="${C.stoneD}" stroke-width="2" fill="none"/>
   <text x="300" y="${T+60}" text-anchor="middle" font-family="Assistant,sans-serif" font-weight="800" font-size="24" fill="${C.ink}">האי</text></g>
  ${A>8?dim(IS.cf,T,A,okA,110):''}${B>8?dim(T+IS.dep,IS.tab,B,okB,110):''}
  <g font-family="Assistant,sans-serif" font-weight="800" font-size="20" fill="#fff" text-anchor="middle"><text x="470" y="38">ארונות</text></g>
  <text x="300" y="${IS.tab+44}" text-anchor="middle" font-family="Assistant,sans-serif" font-weight="800" font-size="20" fill="#fff">שולחן האוכל</text>`,'role="img"')};
}

/* מגירה מול מדף */
function drawerArt(open){
  return svg('0 0 600 400',`<rect width="600" height="400" fill="#EFE6D6"/><rect y="350" width="600" height="50" fill="${C.oak}"/>
  <rect x="140" y="80" width="320" height="16" fill="#F3F0EA" stroke="#C9C2B5" stroke-width="2"/>
  <rect x="150" y="96" width="300" height="254" fill="${C.lead}"/>
  ${open?`<g><rect x="120" y="190" width="360" height="150" fill="${shade(C.lead,.25)}" stroke="${C.ink}" stroke-width="3"/><rect x="130" y="200" width="340" height="130" fill="#E5DCCB"/>
   ${[[150,'#7E8C8F'],[230,'#B04E33'],[310,'#7E8C8F'],[390,'#C9A24B']].map(([x,c])=>`<ellipse cx="${x+30}" cy="250" rx="34" ry="20" fill="${c}"/><rect x="${x-4}" y="250" width="68" height="40" fill="${c}"/><ellipse cx="${x+30}" cy="290" rx="34" ry="12" fill="${shade(c,-.2)}"/>`).join('')}
   <rect x="270" y="320" width="60" height="10" rx="5" fill="${C.brass}"/></g>`:
   `<rect x="166" y="190" width="268" height="150" fill="${shade(C.lead,.15)}" stroke="${C.ink}" stroke-width="2"/><rect x="270" y="260" width="60" height="10" rx="5" fill="${C.brass}"/>`}
  <rect x="166" y="110" width="268" height="70" fill="${shade(C.lead,.15)}" stroke="${C.ink}" stroke-width="2"/><rect x="270" y="140" width="60" height="10" rx="5" fill="${C.brass}"/>`,'role="img"');
}
function shelfArt(){
  return svg('0 0 600 400',`<rect width="600" height="400" fill="#EFE6D6"/><rect y="350" width="600" height="50" fill="${C.oak}"/>
  <rect x="140" y="80" width="320" height="16" fill="#F3F0EA" stroke="#C9C2B5" stroke-width="2"/><rect x="150" y="96" width="300" height="254" fill="#2A3A3C"/>
  <rect x="160" y="250" width="280" height="8" fill="#6C7A7C"/><ellipse cx="380" cy="226" rx="30" ry="14" fill="#55605F"/><rect x="350" y="226" width="60" height="24" fill="#55605F"/>
  <ellipse cx="300" cy="320" rx="34" ry="16" fill="#4E5857"/><rect x="266" y="320" width="68" height="28" fill="#4E5857"/><ellipse cx="210" cy="324" rx="28" ry="12" fill="#B04E33"/><rect x="182" y="324" width="56" height="24" fill="#B04E33"/>
  <path d="M150 96L80 70v300l70-20z" fill="${C.lead}" stroke="${C.ink}" stroke-width="2"/>`,'role="img"');
}

/* קיר נגרות עם דלתות כיס */
function pantryArt(){
  return svg('0 0 640 420',`<rect width="640" height="420" fill="#EFE6D6"/><rect y="380" width="640" height="40" fill="${C.oak}"/>
  <rect x="80" y="30" width="480" height="350" fill="#3E2E22"/>
  <g class="pin"><rect x="160" y="60" width="320" height="300" fill="#E9DCC6"/><rect x="160" y="200" width="320" height="10" fill="#C9B48A"/>
   <rect x="190" y="150" width="70" height="50" rx="6" fill="#4A4A4A"/><circle cx="225" cy="172" r="12" fill="#888"/><rect x="290" y="168" width="18" height="32" rx="4" fill="#fff" stroke="#999"/><rect x="316" y="168" width="18" height="32" rx="4" fill="#fff" stroke="#999"/>
   <path d="M360 110h90M360 150h90" stroke="#C9B48A" stroke-width="6"/><rect x="370" y="82" width="18" height="28" fill="${C.terra}"/><rect x="396" y="86" width="14" height="24" fill="${C.sage}"/><rect x="380" y="122" width="40" height="28" rx="4" fill="#fff"/>
   <rect x="190" y="230" width="260" height="110" fill="#D8C9AE"/><path d="M190 286h260" stroke="#BCA985" stroke-width="3"/><circle cx="320" cy="222" r="0"/></g>
  <g class="pd pd-r"><rect x="80" y="30" width="240" height="350" fill="${C.oak}" stroke="#8E6438" stroke-width="3"/>${Array.from({length:9},(_,i)=>`<path d="M${100+i*24} 34v342" stroke="#B38A57" stroke-width="2"/>`).join('')}</g>
  <g class="pd pd-l"><rect x="320" y="30" width="240" height="350" fill="${C.oak}" stroke="#8E6438" stroke-width="3"/>${Array.from({length:9},(_,i)=>`<path d="M${340+i*24} 34v342" stroke="#B38A57" stroke-width="2"/>`).join('')}</g>
  <rect x="0" y="30" width="80" height="350" fill="#EFE6D6"/><rect x="560" y="30" width="80" height="350" fill="#EFE6D6"/>`);
}

/* ---------- המסכים ---------- */
const screens=[

/* יחידה 1 */
{id:'open',title:'המטבח וחללי האירוח',hideNext:true,
 text:'ברוכה השבה, {name}. פעם המטבח היה חדר סגור בירכתי הבית. בווילה של היום הוא לב הבית: פתוח לסלון, עם אי גדול במרכז ומקום לאורחים. היום תמקמי אי מטבח בעצמך, ותמדדי את המעברים סביבו.',
 mount(el,ctx){
  const box=h('div',{class:'s3-draw s6-hero',html:kitchenSvg({cab:'petrol',top:'light',stool:'mustard',pend:'brass'},false,'hero')});box.append(illus());
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
    h('div',{class:'copy'},h('span',{class:'kicker'},'מפגש 6'),h('h1',null,'המטבח וחללי האירוח'),
      h('p',{class:'lede'},nameFill('ברוכה השבה, {name}. פעם המטבח היה חדר סגור בירכתי הבית. בווילה של היום הוא לב הבית: פתוח לסלון, עם אי גדול במרכז ומקום לאורחים. היום תמקמי אי מטבח בעצמך, ותמדדי את המעברים סביבו.')),
      h('button',{class:'cta',type:'button',onclick:ctx.next,html:'בואי נתחיל'+window.Salon.ICON.arrowL}))));
 }},

{id:'secrets',title:'ארבעה סודות',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'למטבח של וילה יש ארבעה סודות. היום נכיר את כולם.',
 mount(el,ctx){return flips(el,ctx,{kicker:'ארבעה סודות',title:'ארבעה סודות',lede:'למטבח של וילה יש ארבעה סודות. היום נכיר את כולם.',
  cards:['המטבח פתוח לסלון.','האי הוא רהיט.','מקום לעבוד, מקום לעבור.','מה שלא בשימוש, מתחבא.'].map((b,i)=>({t:'סוד '+(i+1),b}))})}},

{id:'roman',title:'רגע היסטורי: המטבח הרומי',task:'לחצי על שלוש התחנות, מהראשונה ועד האחרונה.',wide:true,
 text:'רגע היסטורי. בבית הרומי הקדום בישלו באטריום, החדר המרכזי של הבית. עם הזמן עבר הבישול לחדר נפרד, המטבח, שבלטינית נקרא culina. במטבח של בית פנסה בפומפיי, שפגשת במפגש 1, נמצאה כירה לתבשילים. אלפיים שנה אחר כך, המטבח חוזר אל לב הבית.',
 mount(el,ctx){
  const seen=ctx.data.seen||(ctx.data.seen={});
  const S=[['atrium','בית רומי קדום','מבשלים באטריום, בלב הבית.'],['culina','בית רומי מאוחר','חדר נפרד לבישול, בפינת הבית.'],['today','וילה של היום','המטבח חוזר אל הלב, פתוח לסלון.']];
  const line=h('div',{class:'s2-line s6-line'},...S.map(([k,t,w],i)=>{const st=h('div',{class:'s2-stop'+(seen[i]?' on':'')},
    h('button',{type:'button',class:'node','aria-label':t,onclick:()=>{seen[i]=1;ctx.save();st.classList.add('on');if(Object.keys(seen).length===3)ctx.done()}},h('span',{class:'s2-art',html:stopArt(k)}),h('span',{class:'nm'},t)),h('p',{class:'what'},w));return st}));
  el.append(head('רגע היסטורי','המטבח הרומי','רגע היסטורי. בבית הרומי הקדום בישלו באטריום, החדר המרכזי של הבית. עם הזמן עבר הבישול לחדר נפרד, המטבח, שבלטינית נקרא culina. במטבח של בית פנסה בפומפיי, שפגשת במפגש 1, נמצאה כירה לתבשילים. אלפיים שנה אחר כך, המטבח חוזר אל לב הבית.'),line,h('p',{class:'note s6-note'},'המחשה'));
  return gate(ctx,Object.keys(seen).length===3);
 }},

/* יחידה 2 */
{id:'openplan',title:'מטבח פתוח',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'מעצבים קוראים לזה תכנון פתוח (Open Plan): המטבח, פינת האוכל והסלון בחלל אחד. מי שמבשלת לא נשארת לבד מאחורי קיר. היא רואה את האורחים, ומשתתפת בשיחה.',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,planArt(false),planArt(true),'מטבח סגור','מטבח פתוח')),
   copy('הסוד הראשון','מטבח פתוח','מעצבים קוראים לזה תכנון פתוח (Open Plan): המטבח, פינת האוכל והסלון בחלל אחד. מי שמבשלת לא נשארת לבד מאחורי קיר. היא רואה את האורחים, ומשתתפת בשיחה.')));
  return gate(ctx,ctx.data.cut!=null&&ctx.data.cut!==50);
 }},

{id:'triangle',title:'משולש העבודה',task:'לחצי על הכיור, על המקרר ועל הכיריים.',wide:true,
 text:'שלוש תחנות עובדות הכי קשה במטבח: הכיור, המקרר והכיריים. הקו שמחבר ביניהן נקרא משולש העבודה (Work Triangle). ההמלצה של מתכנני מטבחים: כל צלע בין 1.2 ל-2.7 מטר, וכל המשולש יחד עד 7.9 מטר.',
 mount(el,ctx){
  const seen=ctx.data.seen||(ctx.data.seen={});const res=h('div');
  const box=h('div',{class:'s3-draw s6-tri'});
  const P=[['sink','כיור',ST.sink],['fB','מקרר',ST.fB],['cook','כיריים',ST.cook]];
  function draw(){const all=P.every(p=>seen[p[0]]);box.innerHTML=triArt('fB',all);box.append(illus());
   P.forEach(([k,t,p])=>{const b=h('button',{type:'button',class:'s2-dot'+(seen[k]?' found':''),style:`left:${p.x/6}%;top:${p.y/3.3}%`,'aria-label':t},seen[k]?'✓':'');b.addEventListener('click',()=>{seen[k]=1;ctx.save();draw()});box.append(b)});
   if(all){sayBox(res,'<b>הנה המשולש.</b> שלוש הצלעות בין 1.2 ל-2.7 מטר, וכולן יחד 5.8 מטר. אפשר לבשל בלי לרוץ.');ctx.done()}}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
   copy('הסוד השלישי','משולש העבודה','שלוש תחנות עובדות הכי קשה במטבח: הכיור, המקרר והכיריים. הקו שמחבר ביניהן נקרא משולש העבודה (Work Triangle). ההמלצה של מתכנני מטבחים: כל צלע בין 1.2 ל-2.7 מטר, וכל המשולש יחד עד 7.9 מטר.',res)));
  draw();
  return gate(ctx,P.every(p=>seen[p[0]]));
 }},

{id:'fridge',title:'איפה המקרר?',task:'בחרי מקום למקרר, עד שכל הצלעות ירוקות.',wide:true,
 text:'הכיור והכיריים כבר במקום. נשאר לבחור מקום למקרר. רחוק מדי, ותרוצי הלוך וחזור. קרוב מדי, ואין מקום להניח את הקניות.',
 mount(el,ctx){
  const d=ctx.data;const res=h('div');const box=h('div',{class:'s3-draw s6-tri'});
  const O=[['fA','בפינה הרחוקה'],['fB','קרוב, אבל לא צמוד'],['fC','צמוד לכיור']];
  function verdict(k){const f=ST[k];const L=[dist(ST.sink,f),dist(f,ST.cook),dist(ST.cook,ST.sink)];
   if(L.some(x=>x>2.7))return [0,'רחוק מדי. צלע אחת ארוכה מ-2.7 מטר, והדרך מהמקרר לכיריים ארוכה.'];
   if(L.some(x=>x<1.2))return [0,'קרוב מדי. בין המקרר לכיור פחות מ-1.2 מטר, ואין מקום להניח את הקניות.'];
   return [1,'<b>בדיוק.</b> כל הצלעות בין 1.2 ל-2.7 מטר, וכל המשולש '+(L[0]+L[1]+L[2]).toFixed(1)+' מטר.']}
  function draw(){box.innerHTML=triArt(d.k||'fA',true);box.append(illus());
   ctrl.replaceChildren(...O.map(([k,t])=>h('button',{type:'button','aria-pressed':String(d.k===k),onclick:()=>{d.k=k;const v=verdict(k);if(v[0])d.ok=true;ctx.save();sayBox(res,v[1]);draw()}},t)));
   if(d.ok)ctx.done()}
  const ctrl=h('div',{class:'s2-periods sm s6-fr',role:'group','aria-label':'מקום למקרר'});
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,ctrl),
   copy('המשימה','איפה המקרר?','הכיור והכיריים כבר במקום. נשאר לבחור מקום למקרר. רחוק מדי, ותרוצי הלוך וחזור. קרוב מדי, ואין מקום להניח את הקניות.',res)));
  draw();if(d.k)sayBox(res,verdict(d.k)[1]);
  return gate(ctx,!!d.ok);
 }},

/* יחידה 3 */
{id:'island',title:'מקום לאי',task:'גררי את האי, או לחצי על החצים, עד ששני המעברים ירוקים.',wide:true,
 text:'אי המטבח (Kitchen Island) הוא משטח עבודה באמצע החלל. בין האי לארונות צריך מעבר רחב, ומאחורי האי צריך שביל מעבר (Walkway) אל השולחן. כמה רחב? המספרים מחכים לך במשימה.',
 mount(el,ctx){
  const d=ctx.data;d.T=d.T||90;let mode=d.mode||1;const done=d.done||(d.done={});
  const box=h('div',{class:'s3-draw s6-isl'});const res=h('div');const tabs=h('div',{class:'s3-tabs'});const info=h('div',{class:'s6-info'});
  const MS={1:['מבשלת אחת','בין האי לארונות לפחות 107 ס"מ. מאחורי האי לפחות 92 ס"מ.'],2:['מבשלים בשניים','עכשיו שניים מבשלים יחד. בין האי לארונות צריך לפחות 122 ס"מ.']};
  function draw(){const r=islandSvg(d.T,mode);box.innerHTML=r.html;box.append(illus());
   tabs.replaceChildren(...[1,2].map(i=>h('button',{type:'button','aria-pressed':String(i===mode),class:done[i]?'ok':'',disabled:i===2&&!done[1],onclick:()=>{mode=i;d.mode=i;ctx.save();res.replaceChildren();draw()}},(done[i]?'✓ ':'')+MS[i][0])));
   info.replaceChildren(h('p',{class:'s3-sit'},h('b',null,MS[mode][0]+'. '),MS[mode][1]));
   if(r.okA&&r.okB&&!done[mode]){done[mode]=true;ctx.save();
     if(mode===1){sayBox(res,'<b>בדיוק.</b> מקום לעבוד ומקום לעבור. עכשיו נסי את המשימה של שניים.');mode=2;d.mode=2;setTimeout(draw,1400)}
     else sayBox(res,nameFill('<b>בדיוק.</b> שניים מבשלים, ואף אחד לא נתקע. <b>תכננת אי כמו מעצבת, {name}.</b>'))}
   else if(!r.okA||!r.okB){if(res.dataset.k!==String(d.T)){res.dataset.k=d.T;sayBox(res,!r.okA?'המעבר ליד הארונות צר מדי. הזיזי את האי למטה.':'שביל המעבר ליד השולחן צר מדי. הזיזי את האי למעלה.')}}
   if(done[1]&&done[2])ctx.done()}
  function move(dy){d.T=Math.max(70,Math.min(370,d.T+dy));ctx.save();draw()}
  let y0=null,T0=0;
  const ptY=e=>{const sv=box.querySelector('svg');const r=sv.getBoundingClientRect();return (e.clientY-r.top)/r.height*IS.H};
  box.addEventListener('pointerdown',e=>{if(!e.target.closest('.isl'))return;y0=ptY(e);T0=d.T;box.setPointerCapture(e.pointerId);e.preventDefault()});
  box.addEventListener('pointermove',e=>{if(y0==null)return;const nT=Math.max(70,Math.min(370,Math.round((T0+ptY(e)-y0)/10)*10));if(nT!==d.T){d.T=nT;box.querySelector('svg').outerHTML=islandSvg(d.T,mode).html}});
  const end=()=>{if(y0==null)return;y0=null;ctx.save();draw()};box.addEventListener('pointerup',end);box.addEventListener('pointercancel',end);
  const arrows=h('div',{class:'row s3-arrows s6-arr'},h('button',{class:'btn',type:'button','aria-label':'הזיזי את האי למעלה',onclick:()=>move(-10)},'↑'),h('button',{class:'btn',type:'button','aria-label':'הזיזי את האי למטה',onclick:()=>move(10)},'↓'));
  el.append(head('רגע WOW','מקום לאי','אי המטבח (Kitchen Island) הוא משטח עבודה באמצע החלל. בין האי לארונות צריך מעבר רחב, ומאחורי האי צריך שביל מעבר (Walkway) אל השולחן. כמה רחב? המספרים מחכים לך במשימה.'),
   h('div',{class:'s3-simwrap s6-islwrap'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},tabs,info,arrows,res)));
  draw();
  return gate(ctx,!!(done[1]&&done[2]));
 }},

{id:'pantry',title:'מה שלא בשימוש, מתחבא',task:'לחצי על הכפתור ותראי מה מסתתר בקיר.',wide:true,
 text:'במטבח שפתוח לסלון, הסדר הוא חלק מהיופי. קיר נגרות גבוה מסתיר את פינת הקפה ואת המכשירים. גם כאן יש דלתות כיס (Pocket Doors), כמו במפגש 3: פותחים, והן נכנסות לתוך הארון. סוגרים, ונשאר קיר עץ נקי.',
 mount(el,ctx){
  const box=h('div',{class:'s3-draw s3-pocket s6-pantry'+(ctx.data.open?' open':''),html:pantryArt()});box.append(illus());
  const btn=h('button',{class:'cta',type:'button',onclick:()=>{ctx.data.open=!ctx.data.open;ctx.data.tried=true;ctx.save();box.classList.toggle('open',!!ctx.data.open);btn.textContent=ctx.data.open?'סגרי את הקיר':'פתחי את הקיר';ctx.done()}},ctx.data.open?'סגרי את הקיר':'פתחי את הקיר');
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
   copy('הסוד הרביעי','מה שלא בשימוש, מתחבא','במטבח שפתוח לסלון, הסדר הוא חלק מהיופי. קיר נגרות גבוה מסתיר את פינת הקפה ואת המכשירים. גם כאן יש דלתות כיס (Pocket Doors), כמו במפגש 3: פותחים, והן נכנסות לתוך הארון. סוגרים, ונשאר קיר עץ נקי.',h('div',{class:'row',style:'margin-top:14px'},btn))));
  return gate(ctx,!!ctx.data.tried);
 }},

{id:'drawer',title:'מגירה במקום מדף',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'בארון עמוק עם מדף, הסירים שמאחור נעלמים, וצריך להתכופף ולחפש. מגירה שנשלפת עד הסוף מביאה את הכול אלייך, ורואים הכול במבט אחד. במטבח של וילה מתכננים מגירות גדולות במקום מדפים נמוכים.',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,shelfArt(),drawerArt(true),'מדף עמוק','מגירה נשלפת')),
   copy('נוחות היא יוקרה','מגירה במקום מדף','בארון עמוק עם מדף, הסירים שמאחור נעלמים, וצריך להתכופף ולחפש. מגירה שנשלפת עד הסוף מביאה את הכול אלייך, ורואים הכול במבט אחד. במטבח של וילה מתכננים מגירות גדולות במקום מדפים נמוכים.')));
  return gate(ctx,ctx.data.cut!=null&&ctx.data.cut!==50);
 }},

{id:'pendants',title:'חדר בתוך חדר',task:'לחצי על "יום" ועל "ערב".',wide:true,
 text:'מעל האי תולים מנורות. הן מאירות את משטח העבודה, וגם מסמנות את האי כחדר קטן בתוך החלל הגדול. זוכרת את המנורה שהיא פסל ממפגש 4? כאן היא בבית.',
 mount(el,ctx){
  const d=ctx.data;const tr=d.tr||(d.tr={});const cur=d.cur||'day';const K={cab:'cream',top:'dark',stool:'wood',pend:'brass'};
  const box=h('div',{class:'s3-draw s5-fin s6-pend'},h('div',{class:'lay'+(cur==='day'?' on':''),'data-k':'day',html:kitchenSvg(K,false,'pd1')}),h('div',{class:'lay'+(cur==='eve'?' on':''),'data-k':'eve',html:kitchenSvg(K,true,'pd2')}),illus());
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':'יום או ערב'},...[['day','יום'],['eve','ערב']].map(([k,t])=>h('button',{type:'button','data-k':k,'aria-pressed':String(cur===k),onclick:()=>show(k)},t)));
  function show(k){d.cur=k;tr[k]=1;ctx.save();box.querySelectorAll('.lay').forEach(i=>i.classList.toggle('on',i.dataset.k===k));btns.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));if(tr.day&&tr.eve)ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),
   copy('אור מעל האי','חדר בתוך חדר','מעל האי תולים מנורות. הן מאירות את משטח העבודה, וגם מסמנות את האי כחדר קטן בתוך החלל הגדול. זוכרת את המנורה שהיא פסל ממפגש 4? כאן היא בבית.')));
  return gate(ctx,!!(tr.day&&tr.eve));
 }},

/* יחידה 4 */
{id:'mykitchen',title:'המטבח שלך',task:'בחרי ארונות, משטח, כיסאות ומנורות, וראי את המטבח נבנה.',wide:true,
 text:'בעלי וילה בקיסריה מבקשים מטבח שפתוח לסלון, שאפשר לארח בו. את מעצבת. ארבע בחירות, ואין כאן בחירה לא נכונה.',
 mount(el,ctx){
  const k=ctx.data.k||(ctx.data.k={});const res=h('div');const box=h('div',{class:'s3-draw s6-kit'});const ctr=h('div',{class:'s3-ctrls'});
  const ok=()=>!!(k.cab&&k.top&&k.stool&&k.pend);
  const MSG={cab:{petrol:'<b>ירוק נפט:</b> עמוק ואלגנטי, ומבליט את המשטח.',cream:'<b>שמנת:</b> בהיר ושקט, וממשיך את הסלון.',terra:'<b>טרקוטה:</b> חם ונועז, מטבח עם אופי.',sage:'<b>מרווה:</b> רך וטבעי, כמו הגינה.'},
   top:{light:'<b>שיש בהיר:</b> מחזיר אור ומרגיש נקי.',dark:'<b>שיש כהה:</b> דרמטי, ומבליט את הכיסאות.',oak:'<b>עץ אלון:</b> חם, ומזמין לשבת סביבו.'},
   stool:{wood:'<b>כיסאות עץ:</b> חם לצד קר.',mustard:'<b>מרופדים בחרדל:</b> נוח לשבת הרבה, וזה צבע הדגש.',black:'<b>מתכת שחורה:</b> קווים דקים ונקיים.'},
   pend:{brass:'<b>פליז:</b> ברק חם, מנורה שהיא תכשיט.',glass:'<b>זכוכית:</b> קלה, כמעט נעלמת.',rattan:'<b>קש:</b> טבעי ורך, מטיל צללים יפים.'}};
  function draw(){box.innerHTML=kitchenSvg(Object.assign({},k),false,'mk');box.append(illus());
   ctr.replaceChildren(chipRow('ארונות',Object.entries(CAB).map(([x,v])=>[x,v[0]]),k.cab,x=>pick('cab',x)),chipRow('משטח האי',Object.entries(TOP).map(([x,v])=>[x,v[0]]),k.top,x=>pick('top',x)),
    chipRow('כיסאות',Object.entries(STOOL).map(([x,v])=>[x,v[0].replace('כיסאות ','')]),k.stool,x=>pick('stool',x)),chipRow('מנורות',Object.entries(PEND).map(([x,v])=>[x,v[0].replace('מנורות ','')]),k.pend,x=>pick('pend',x)));
   if(ok())ctx.done()}
  function pick(g,x){k[g]=x;ctx.save();draw();sayBox(res,MSG[g][x])}
  el.append(head('המשימה','המטבח שלך','בעלי וילה בקיסריה מבקשים מטבח שפתוח לסלון, שאפשר לארח בו. את מעצבת. ארבע בחירות, ואין כאן בחירה לא נכונה.'),
   h('div',{class:'s3-simwrap s6-kitwrap'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},ctr,res)));
  draw();
  return gate(ctx,ok());
 }},

{id:'mykitchen-eve',title:'המטבח שלך בערב',task:'שמרי את המטבח במחברת.',wide:true,
 text:'ככה המטבח שלך נראה בערב, {name}, כשהאורחים מגיעים. המנורות מעל האי דולקות, והמטבח מוכן לארח.',
 mount(el,ctx){
  const k=((ctx.all.mykitchen||{}).k)||{};const res=h('div');
  if(!(k.cab&&k.top&&k.stool&&k.pend)){el.append(h('div',{class:'center'},h('div',null,h('h2',null,'המטבח שלך בערב'),h('p',{class:'lede'},'המטבח עוד לא מוכן. חזרי מסך אחד אחורה והשלימי אותו.'))));return gate(ctx,false)}
  const text=kitText(k);
  const box=h('div',{class:'s3-draw s6-kit',html:kitchenSvg(k,true,'ev')});box.append(illus());
  const btn=h('button',{class:'cta',type:'button',onclick:()=>{
    const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='kitchen6'&&n.session===6);
    if(old){old.kit=JSON.parse(JSON.stringify(k));old.text=text;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:'kitchen6',svg:true,title:'המטבח שלי בקיסריה',kit:JSON.parse(JSON.stringify(k)),text});
    ctx.data.saved=true;ctx.save();sayBox(res,'<b>נשמר במחברת שלך.</b>');ctx.done()}},'שמרי במחברת');
  el.append(h('div',{class:'split media s2-split s6-eve'},h('div',{class:'s2-media'},box),
   copy('בערב','המטבח שלך בערב',nameFill('ככה המטבח שלך נראה בערב, {name}, כשהאורחים מגיעים. המנורות מעל האי דולקות, והמטבח מוכן לארח.'),h('p',{class:'s3-sum'},text),h('div',{class:'row',style:'margin-top:12px'},btn),res)));
  if(ctx.data.saved)sayBox(res,'<b>נשמר במחברת שלך.</b>');
  return gate(ctx,!!ctx.data.saved);
 }},

/* יחידה 5 */
{id:'check1',title:'בדיקה 1',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מבשלת אחת במטבח. כמה מקום צריך בין האי לארונות?',[['לפחות 107 ס"מ'],['60 ס"מ מספיקים'],['שלושה מטרים לפחות']]),
 mount(el,ctx){const v=drawBox(islandSvg(180,1).html);
  return quiz(el,ctx,{kicker:'בדיקה 1',lede:'ארבע שאלות קצרות על מה שראית היום.',q:'מבשלת אחת במטבח. כמה מקום צריך בין האי לארונות?',visual:v,
  opts:[['לפחות 107 ס"מ',1],['60 ס"מ מספיקים',0],['שלושה מטרים לפחות',0]],hint:'היזכרי במספר שהפך את המעבר לירוק.',right:'<b>נכון.</b> וכששניים מבשלים יחד, לפחות 122 ס"מ.'})}},

{id:'check2',title:'בדיקה 2',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('אילו שלוש תחנות יוצרות את משולש העבודה?',[['כיור, מקרר וכיריים'],['שולחן, כיסא ומנורה'],['תנור, מגירה ומזווה']]),
 mount(el,ctx){const v=drawBox(triArt('fB',false));
  return quiz(el,ctx,{kicker:'בדיקה 2',q:'אילו שלוש תחנות יוצרות את משולש העבודה?',visual:v,
  opts:[['כיור, מקרר וכיריים',1],['שולחן, כיסא ומנורה',0],['תנור, מגירה ומזווה',0]],hint:'אלה שלוש התחנות שעובדות הכי קשה במטבח.',right:'<b>נכון.</b> וכל צלע ביניהן בין 1.2 ל-2.7 מטר.'})}},

{id:'check3',title:'בדיקה 3',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('איפה בישלו בבית הרומי הקדום?',[['באטריום, בלב הבית'],['בחצר שמחוץ לעיר'],['בקומה השנייה']]),
 mount(el,ctx){const v=drawBox(stopArt('atrium'),'s6-sq');
  return quiz(el,ctx,{kicker:'בדיקה 3',q:'איפה בישלו בבית הרומי הקדום?',visual:v,
  opts:[['באטריום, בלב הבית',1],['בחצר שמחוץ לעיר',0],['בקומה השנייה',0]],hint:'היזכרי בתחנה הראשונה בציר הזמן.',right:'<b>נכון.</b> ובווילה של היום המטבח חוזר אל הלב.'})}},

{id:'check4',title:'בדיקה 4',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה עושה מגירה שנשלפת עד הסוף?',[['מביאה את הכול אלייך, במבט אחד'],['מסתירה את המקרר'],['מגדילה את המטבח']]),
 mount(el,ctx){const v=drawBox(drawerArt(true));
  return quiz(el,ctx,{kicker:'בדיקה 4',q:'מה עושה מגירה שנשלפת עד הסוף?',visual:v,
  opts:[['מביאה את הכול אלייך, במבט אחד',1],['מסתירה את המקרר',0],['מגדילה את המטבח',0]],hint:'חשבי על הסירים שנעלמו בעומק הארון.',right:nameFill('<b>נכון.</b> בלי להתכופף ובלי לחפש. <b>ארבע מתוך ארבע, {name}.</b>')})}},

/* יחידה 6 */
{id:'home-idea',title:'רעיון לבית',task:'אם תרצי, כתבי שינוי קטן אחד ושמרי במחברת.',
 text:'רעיון לבית, למי שרוצה. פתחי שלוש מגירות או ארונות שאת משתמשת בהם כל יום. מה כבד ונמצא נמוך מדי? מה היית מעבירה לגובה נוח? בחרי שינוי קטן אחד.',
 mount(el,ctx){ideaScreen(el,ctx,{n:6,media:h('div',{class:'s6-ideaimg',html:drawerArt(true)}),field:'השינוי הקטן שלי במטבח',
  text:'רעיון לבית, למי שרוצה. פתחי שלוש מגירות או ארונות שאת משתמשת בהם כל יום. מה כבד ונמצא נמוך מדי? מה היית מעבירה לגובה נוח? בחרי שינוי קטן אחד.'})}},

{id:'summary',title:'סיכום',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',
 mount(el,ctx){
  const th=html=>()=>h('span',{class:'s3-draw thumb',html});
  return flips(el,ctx,{kicker:'סיכום',title:'ארבעה כללים',lede:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',cls:'s3-flips',toggle:true,
   cards:[{t:'המטבח פתוח לסלון',front:th(planArt(true)),b:'מי שמבשלת רואה את האורחים ומשתתפת בשיחה.'},
    {t:'האי הוא רהיט',front:th(kitchenSvg({cab:'petrol',top:'light',stool:'mustard',pend:'brass'},true,'su')),b:'משטח, מקום ישיבה ומנורות מעליו. חדר קטן בתוך החלל.'},
    {t:'מקום לעבוד, מקום לעבור',front:th(islandSvg(200,2).html),b:'לפחות 107 ס"מ ליד האי, 122 כששניים מבשלים. משולש עבודה עד 7.9 מטר.'},
    {t:'מה שלא בשימוש, מתחבא',front:th(drawerArt(true)),b:'דלתות כיס וקיר נגרות, ומגירות שנשלפות עד הסוף.'}]});
 }},

{id:'audio',title:'סקירה קולית',task:'לחצי על הנגן כדי לשמוע.',skip:()=>!audioOK,
 text:'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.',
 mount(el,ctx){audioScreen(el,ctx,6)}},

{id:'feedback',title:'משוב וגשר',task:'דרגי בלחיצה, ואם תרצי, כתבי גם כמה מילים.',wide:true,hideNext:true,
 say:'{name}, סיימת את מפגש 6. מיקמת אי מטבח, מצאת מקום למקרר ועיצבת מטבח לאירוח. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
 mount(el,ctx){feedbackScreen(el,ctx,{n:6,open:'{name}, סיימת את מפגש 6. מיקמת אי מטבח, מצאת מקום למקרר ועיצבת מטבח לאירוח. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
  bridgeMedia:h('div',{style:'position:relative'},h('img',{src:BRIDGE.src,alt:BRIDGE.alt,decoding:'async'}),aiTag()),
  bridge:'במפגש הבא: הלבשת הבית ואמנות. תסדרי מדף בעצמך, ותתלי תמונה בגובה הנכון. נגלה איך פריטים קטנים הופכים בית לבית שלך.'})}}
];

window.Salon.register(6,screens);
})();
