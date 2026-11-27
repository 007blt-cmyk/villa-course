/* הסלון של מזל · מפגש 10: סיור במוזיאוני עיצוב
   בלוק נתונים ורכיבים של המפגש. לא נוגע במנוע ולא במפגשים 1 עד 9. */
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
function photo(src,alt,cls,ai){const b=h('div',{class:'s3-draw'+(cls?' '+cls:'')},h('img',{src,alt,decoding:'async',style:'width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit'}));if(ai)b.append(aiTag());return b}
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
let audioOK=false;
fetch('assets/audio/s10.m4a',{method:'HEAD'}).then(r=>{audioOK=r.ok}).catch(()=>{});

/* ---------- צבעים ---------- */
const C={ink:'#1A3A35',lead:'#14474A',terra:'#C65A3C',mustard:'#E0A63A',sage:'#9DB39A',paper:'#F7F0E4',cream:'#F2E6CF',brass:'#C9A24B',stone:'#E4D3B0',wood:'#B9824F',oak:'#C69C6A',wall:'#EFE6D6',floor:'#D9C29C',night:'#24303D',nightW:'#3A4656',warm:'#FFD98A'};
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const m=x=>Math.max(0,Math.min(255,Math.round(f<0?x*(1+f):x+(255-x)*f)));return '#'+[m(r),m(g),m(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
const G=(id,col,op)=>`<radialGradient id="${id}"><stop offset="0" stop-color="${col||C.warm}" stop-opacity="${op||.85}"/><stop offset="1" stop-color="${col||C.warm}" stop-opacity="0"/></radialGradient>`;
function sofa(x,y,w,col){col=col||C.lead;const d=shade(col,-.25);
  return `<g><rect x="${x}" y="${y-58}" width="${w}" height="40" rx="14" fill="${d}"/><rect x="${x-12}" y="${y-40}" width="26" height="42" rx="11" fill="${d}"/><rect x="${x+w-14}" y="${y-40}" width="26" height="42" rx="11" fill="${d}"/><rect x="${x+8}" y="${y-30}" width="${w-16}" height="26" rx="8" fill="${col}"/><rect x="${x-6}" y="${y}" width="6" height="10" fill="#5A3E28"/><rect x="${x+w}" y="${y}" width="6" height="10" fill="#5A3E28"/></g>`}
function toggle2(el,ctx,o){
  const d=ctx.data;const tr=d.tr||(d.tr={});const keys=o.opts.map(x=>x[0]);const cur=d.cur||keys[0];
  const box=h('div',{class:'s3-draw s5-fin '+(o.cls||'s9-wide')},...o.opts.map(([k,_,art])=>h('div',{class:'lay'+(cur===k?' on':''),'data-k':k,html:art})),illus());
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':o.title},...o.opts.map(([k,t])=>h('button',{type:'button','data-k':k,'aria-pressed':String(cur===k),onclick:()=>show(k)},t)));
  function show(k){d.cur=k;tr[k]=1;ctx.save();box.querySelectorAll('.lay').forEach(i=>i.classList.toggle('on',i.dataset.k===k));btns.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));if(keys.every(x=>tr[x]))ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),copy(o.kicker,o.title,o.text)));
  return gate(ctx,keys.every(x=>tr[x]));
}
const ALLNIGHT={lights:1,tv:1,music:1,curtains:1,lock:1,ac:1,garden:1,path:1};

/* ---------- ציורים ---------- */
function frameArt(x,y,w,hh,inner,frame){return `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${frame||C.brass}"/><rect x="${x+7}" y="${y+7}" width="${w-14}" height="${hh-14}" fill="#F4ECDD"/>${inner||''}`}
function spotCone(x,top,bot,id){return `<path d="M${x-10} ${top} L${x+10} ${top} L${x+90} ${bot} L${x-90} ${bot}Z" fill="url(#cone${id})" opacity=".55"/>`}
function coneDef(id){return `<linearGradient id="cone${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7B0" stop-opacity=".9"/><stop offset="1" stop-color="#FFE7B0" stop-opacity="0"/></linearGradient>`}
/* אולם תצוגה */
function hallSvg(id){return svg('0 0 640 420',`<defs>${coneDef(id)}</defs><rect width="640" height="420" fill="#2F3B3A"/><rect y="330" width="640" height="90" fill="#7A6146"/>
  <path d="M0 330 L640 330" stroke="#5E4A35" stroke-width="4"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M${i*90} 420 L${120+i*60} 330" stroke="#6C563E" stroke-width="2"/>`).join('')}
  ${spotCone(130,0,300,id)}${spotCone(320,0,300,id)}${spotCone(510,0,300,id)}
  ${frameArt(70,90,120,150,`<circle cx="130" cy="150" r="30" fill="${C.terra}"/><rect x="90" y="190" width="80" height="34" fill="${C.lead}"/>`)}
  ${frameArt(250,70,140,180,`<path d="M265 235 L320 110 L375 235Z" fill="${C.mustard}"/><circle cx="350" cy="120" r="16" fill="${C.terra}"/>`)}
  ${frameArt(450,90,120,150,`<rect x="468" y="108" width="84" height="114" fill="${C.sage}"/><path d="M470 200 q40 -50 80 0" stroke="${C.ink}" stroke-width="5" fill="none"/>`)}
  <rect x="290" y="270" width="60" height="60" fill="#E9E1D2"/><path d="M308 270 q12 -40 24 0z" fill="${C.lead}"/>`)}
/* רגע היסטורי: מקדש המוזות */
function mouseionSvg(){return svg('0 0 640 420',`<rect width="640" height="420" fill="#F3E6CF"/><rect y="340" width="640" height="80" fill="${C.stone}"/>
  <path d="M120 120 L320 50 L520 120Z" fill="${C.terra}"/><rect x="130" y="120" width="380" height="18" fill="#E4D3B0"/><rect x="120" y="320" width="400" height="22" fill="#E4D3B0"/>
  ${[160,215,270,370,425,480].map(x=>`<rect x="${x-11}" y="138" width="22" height="182" fill="#F7F1E6" stroke="#CDBFA4" stroke-width="2"/>`).join('')}
  <rect x="290" y="150" width="60" height="170" fill="#E9DCC2"/>${[0,1,2,3,4].map(i=>`<rect x="296" y="${160+i*30}" width="48" height="8" rx="4" fill="${i%2?C.wood:C.oak}"/><rect x="296" y="${170+i*30}" width="48" height="8" rx="4" fill="${i%2?C.oak:C.wood}"/>`).join('')}
  <circle cx="320" cy="92" r="16" fill="${C.mustard}"/><path d="M60 340 q40 -30 80 0 M500 340 q40 -30 80 0" stroke="${C.sage}" stroke-width="14" fill="none" stroke-linecap="round"/>`)}
/* מוזיאון העיצוב חולון: חמישה סרטים של פלדה */
function holonSvg(){const cols=['#B4532A','#C8642F','#9E3F25','#D07A3A','#8A3A24'];
  return svg('0 0 640 420',`<rect width="640" height="420" fill="#DDEAF0"/><rect y="340" width="640" height="80" fill="#E8DFCF"/><circle cx="540" cy="70" r="30" fill="#FFE2A6"/>
  <rect x="150" y="150" width="340" height="190" fill="#CFC8BC"/><rect x="200" y="190" width="240" height="150" fill="#E9E4DA"/>
  ${cols.map((c,i)=>`<path d="M40 ${120+i*42} C180 ${70+i*42} 300 ${200+i*36} 420 ${130+i*40} S600 ${110+i*44} 620 ${150+i*40}" stroke="${c}" stroke-width="30" fill="none" stroke-linecap="round"/>`).join('')}
  <rect x="290" y="290" width="60" height="50" fill="#3A4656"/>`)}
/* V&A: אולם עם קשתות וכיפה */
function vaSvg(){return svg('0 0 640 420',`<rect width="640" height="420" fill="#EFE6D6"/><rect y="340" width="640" height="80" fill="#C9B48A"/>
  <path d="M220 110 Q320 10 420 110Z" fill="#B9A27E"/><rect x="220" y="108" width="200" height="12" fill="#A78E66"/>
  ${[60,200,340,480].map(x=>`<path d="M${x} 340 V170 Q${x+50} 110 ${x+100} 170 V340" fill="#F7F1E6" stroke="#B9A27E" stroke-width="6"/>`).join('')}
  ${[60,200,340,480].map((x,i)=>`<rect x="${x+30}" y="230" width="40" height="70" fill="${[C.terra,C.lead,C.mustard,C.sage][i]}"/><rect x="${x+20}" y="300" width="60" height="40" fill="#E4D3B0"/>`).join('')}
  <rect x="0" y="150" width="640" height="10" fill="#B9A27E"/>`)}
/* חדר תקופה: סלון בסגנון הערבות */
function prairieSvg(){const oak='#B9824F';return svg('0 0 640 420',`<rect width="640" height="420" fill="#E9DCC2"/><rect y="330" width="640" height="90" fill="#8C6A44"/>
  <rect y="40" width="640" height="14" fill="${oak}"/><rect y="250" width="640" height="10" fill="${oak}"/>
  <rect x="70" y="80" width="300" height="160" fill="#CFE3E6"/>${[0,1,2,3,4].map(i=>`<rect x="${70+i*60}" y="80" width="60" height="160" fill="none" stroke="${oak}" stroke-width="6"/><path d="M${85+i*60} 100 h30 v30 h-30z M${100+i*60} 130 v90" stroke="#C65A3C" stroke-width="3" fill="none"/>`).join('')}
  <rect x="430" y="120" width="150" height="210" fill="#C2A27A"/><rect x="465" y="230" width="80" height="70" fill="#3A2A1C"/><rect x="420" y="110" width="170" height="14" fill="${oak}"/>
  <rect x="70" y="280" width="300" height="50" fill="${oak}"/><rect x="80" y="262" width="280" height="22" fill="${C.sage}"/>
  ${[0,1,2].map(i=>`<rect x="${100+i*90}" y="250" width="12" height="80" fill="${shade(oak,-.2)}"/>`).join('')}`)}
/* זכוכית מגדלת: כד מצויר */
function vaseSvg(){return svg('0 0 400 400',`<rect width="400" height="400" fill="#F3EDE2"/>
  <path d="M150 60 h100 v24 q-10 10 -10 26 q70 50 60 140 q-10 90 -100 100 q-90 -10 -100 -100 q-10 -90 60 -140 q0 -16 -10 -26z" fill="#2D5D7B"/>
  <path d="M110 200 q90 -40 180 0" stroke="#F3E6CF" stroke-width="10" fill="none"/><path d="M112 230 q88 30 176 0" stroke="${C.mustard}" stroke-width="6" fill="none"/>
  ${[0,1,2,3,4,5].map(i=>`<circle cx="${130+i*28}" cy="${258+(i%2)*12}" r="9" fill="#F3E6CF"/><circle cx="${130+i*28}" cy="${258+(i%2)*12}" r="4" fill="${C.terra}"/>`).join('')}
  <path d="M170 300 q30 30 60 0 q-30 -18 -60 0z" fill="${C.terra}"/><path d="M200 120 q-20 30 0 60 q20 -30 0 -60z" fill="${C.mustard}"/>
  ${[...Array(40)].map((_,i)=>`<path d="M${120+(i*37)%160} ${110+(i*53)%220} l3 1" stroke="#1E4860" stroke-width="1.4"/>`).join('')}
  <ellipse cx="200" cy="360" rx="80" ry="10" fill="#D9CDB8"/>`)}

/* ויטרינה */
const OBJ={vase:['כד קרמיקה',(x,b)=>`<path d="M${x-16} ${b} q-14 -30 4 -56 h24 q18 26 4 56z" fill="${C.terra}"/><rect x="${x-9}" y="${b-64}" width="18" height="10" fill="${shade(C.terra,-.2)}"/>`,70],
 glass:['קערת זכוכית',(x,b)=>`<path d="M${x-30} ${b-30} q30 44 60 0z" fill="#BFE0EC" opacity=".85" stroke="#FFF" stroke-width="2"/><ellipse cx="${x}" cy="${b-30}" rx="30" ry="6" fill="#DFF0F5"/>`,40],
 brass:['פמוט פליז',(x,b)=>`<rect x="${x-14}" y="${b-6}" width="28" height="6" fill="${C.brass}"/><rect x="${x-4}" y="${b-60}" width="8" height="56" fill="${C.brass}"/><rect x="${x-5}" y="${b-84}" width="10" height="24" fill="#F7F1E6"/><path d="M${x} ${b-96} q-5 6 0 12 q5 -6 0 -12z" fill="#F29C38"/>`,96],
 book:['ספר אמנות',(x,b)=>`<rect x="${x-34}" y="${b-14}" width="68" height="14" fill="${C.lead}"/><rect x="${x-30}" y="${b-26}" width="60" height="12" fill="${C.mustard}"/>`,26],
 photo:['צילום בשחור-לבן',(x,b)=>`<rect x="${x-26}" y="${b-70}" width="52" height="66" fill="#222"/><rect x="${x-20}" y="${b-64}" width="40" height="54" fill="#9A9A9A"/><circle cx="${x}" cy="${b-44}" r="9" fill="#DADADA"/><path d="M${x-14} ${b-12} q14 -22 28 0" fill="#C4C4C4"/>`,70],
 shell:['צדף מטיול',(x,b)=>`<path d="M${x-24} ${b} q24 -50 48 0z" fill="#F2D6C2"/>${[-16,-8,0,8,16].map(d=>`<path d="M${x} ${b-2} L${x+d} ${b-34}" stroke="#D9A98A" stroke-width="2"/>`).join('')}`,40],
 wood:['פסל עץ קטן',(x,b)=>`<path d="M${x-12} ${b} q-8 -40 6 -70 q22 26 8 70z" fill="${C.wood}"/><circle cx="${x+2}" cy="${b-78}" r="9" fill="${C.oak}"/>`,88],
 plate:['צלחת מצוירת',(x,b)=>`<rect x="${x-3}" y="${b-8}" width="6" height="8" fill="#6B4F36"/><circle cx="${x}" cy="${b-40}" r="34" fill="#F7F1E6" stroke="${C.lead}" stroke-width="4"/><circle cx="${x}" cy="${b-40}" r="18" fill="none" stroke="${C.terra}" stroke-width="4"/>`,74]};
const OKEYS=Object.keys(OBJ);
function vitrineSvg(k,lit,id){k=k||{};const dark=k.wall!=='light';const picks=(k.objs||[]).filter(o=>OBJ[o]);const n=picks.length;const spot=k.spot==='on'||lit;
  const wall=dark?'#1F3533':'#F2EAD9';const shelfY=300;const gap=n?Math.min(140,440/(n)):0;const start=320-gap*(n-1)/2;
  return svg('0 0 640 420',`<defs>${coneDef(id)}${G('glow'+id,'#FFE7B0',.55)}</defs><rect width="640" height="420" fill="${wall}"/>
   <rect x="80" y="40" width="480" height="300" fill="none" stroke="${dark?'#2E4A47':'#E2D6BE'}" stroke-width="6"/>
   ${spot?`<ellipse cx="320" cy="250" rx="250" ry="90" fill="url(#glow${id})"/>${picks.map((o,i)=>spotCone(start+i*gap,40,shelfY,id+i)).join('')}<defs>${picks.map((o,i)=>coneDef(id+i)).join('')}</defs>`:''}
   <rect x="80" y="${shelfY}" width="480" height="16" fill="${dark?'#C9A24B':C.oak}"/><rect x="80" y="${shelfY+16}" width="480" height="104" fill="${dark?'#18292A':'#E4D8C2'}"/>
   ${picks.map((o,i)=>OBJ[o][1](start+i*gap,shelfY)).join('')}
   ${!spot?`<rect width="640" height="420" fill="#000" opacity="${dark?.28:.12}"/>`:''}`)}
/* מדף עמוס מול מדף אצור */
function shelfSvg(crowd){const all=crowd?OKEYS.concat(['vase','glass','book','shell']):['vase','brass','plate'];const gap=crowd?40:150;const start=crowd?100:170;
  return svg('0 0 640 420',`<rect width="640" height="420" fill="${C.wall}"/><rect y="350" width="640" height="70" fill="${C.floor}"/>
   <rect x="80" y="250" width="480" height="14" fill="${C.oak}"/><rect x="100" y="264" width="440" height="86" fill="${shade(C.oak,-.15)}"/>
   ${all.map((o,i)=>OBJ[o][1](start+i*gap,250)).join('')}`)}

/* תערוכה במחברת */
function vitText(k){const names=(k.objs||[]).map(o=>OBJ[o][0]);return (k.title?'"'+k.title+'". ':'')+(k.wall==='light'?'קיר בהיר':'קיר כהה')+', '+names.join(', ')+(k.spot==='on'?', עם אור מדגיש.':'.')}
const prevDraw=window.Salon.drawNote;
window.Salon.drawNote=function(it){if(it.kind==='vitrine10'&&it.k){return h('div',{class:'s3-nb',html:vitrineSvg(it.k,true,'nb'+it.ts)})}return prevDraw?prevDraw(it):null};

/* זכוכית מגדלת */
const ZOOM=[{x:50,y:52,t:'הפס הבהיר: מכחול אחד, בתנועה אחת רציפה.'},{x:36,y:66,t:'הנקודות: כל נקודה צוירה ביד, ולכן אין שתיים זהות.'},{x:62,y:34,t:'הזיגוג: סדקים דקים מאוד, סימן של שריפה בתנור.'}];

const screens=[

/* יחידה 1 */
{id:'open',title:'סיור במוזיאוני עיצוב',hideNext:true,
 text:'ברוכה השבה, {name}. היום יוצאים לסיור בכמה ממוזיאוני העיצוב החשובים בעולם, בלי לטוס ובלי תורים. נראה איך אוצרת בוחרת, מאירה ומסדרת, ובסוף תאצרי בעצמך תערוכה קטנה.',
 mount(el,ctx){
  const box=photo('assets/img/s10-open.jpg','אולם במוזיאון: קירות ירוקים כהים, שלוש יצירות ממוסגרות תחת ספוטים, וכד קרמיקה על בסיס לבן.','s10-wide',1);
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
    h('div',{class:'copy'},h('span',{class:'kicker'},'מפגש 10'),h('h1',null,'סיור במוזיאוני עיצוב'),
      h('p',{class:'lede'},nameFill('ברוכה השבה, {name}. היום יוצאים לסיור בכמה ממוזיאוני העיצוב החשובים בעולם, בלי לטוס ובלי תורים. נראה איך אוצרת בוחרת, מאירה ומסדרת, ובסוף תאצרי בעצמך תערוכה קטנה.')),
      h('button',{class:'cta',type:'button',onclick:ctx.next,html:'בואי נתחיל'+window.Salon.ICON.arrowL}))));
 }},

{id:'secrets',title:'ארבעה סודות',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'לאוצרת (Curator), מי שבוחרת מה יוצג ואיך, יש ארבעה סודות. היום נכיר את כולם.',
 mount(el,ctx){return flips(el,ctx,{kicker:'ארבעה סודות',title:'ארבעה סודות',lede:'לאוצרת (Curator), מי שבוחרת מה יוצג ואיך, יש ארבעה סודות. היום נכיר את כולם.',
  cards:[{t:'סוד 1',b:'בוחרים מעט, ולא מציגים הכול.'},{t:'סוד 2',b:'לכל חפץ מרווח משלו.'},{t:'סוד 3',b:'הרקע בוחר את האווירה.'},{t:'סוד 4',b:'האור מספר לעין לאן להסתכל.'}]})}},

{id:'mouseion',title:'רגע היסטורי: מקדש המוזות',task:'לחצי על "גלי מאיפה המילה", ואחר כך על "הבא".',wide:true,
 text:'רגע היסטורי. המילה מוזאון באה מיוונית: מוזאון (Mouseion) היה מקום של המוזות, אלות האמנויות. באלכסנדריה, לפני כאלפיים ושלוש מאות שנה, הקים המלך תלמי הראשון מוזאון גדול: מקום של לימוד, ספרים ושיחה.',
 mount(el,ctx){const res=h('div');const box=drawBox(mouseionSvg(),'s10-wide');
  const show=()=>{ctx.data.seen=1;ctx.save();sayBox(res,'<b>מוזה, מוזאון, מוזיאון.</b> כל מוזיאון של היום נושא בשמו את מקדש האמנויות.');ctx.done()};
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,h('div',{class:'note s2-cap'},'המחשה של מקדש יווני וספרייה')),
   copy('רגע היסטורי','מקדש המוזות','רגע היסטורי. המילה מוזאון באה מיוונית: מוזאון (Mouseion) היה מקום של המוזות, אלות האמנויות. באלכסנדריה, לפני כאלפיים ושלוש מאות שנה, הקים המלך תלמי הראשון מוזאון גדול: מקום של לימוד, ספרים ושיחה.',
    h('div',{class:'row'},h('button',{class:'btn',type:'button',onclick:show},'גלי מאיפה המילה')),res)));
  if(ctx.data.seen)show();
  return gate(ctx,!!ctx.data.seen);
 }},

/* יחידה 2: הסיור */
{id:'holon',title:'תחנה 1: חולון',task:'לחצי על שלוש הנקודות בתמונה.',wide:true,
 text:'התחנה הראשונה קרובה לבית: מוזיאון העיצוב חולון, הראשון בישראל שמוקדש לעיצוב. הוא נפתח ב-2010. רון ארד, אדריכל ומעצב ישראלי, עטף אותו בחמישה סרטים מתפתלים של פלדה.',
 mount(el,ctx){return spots(el,ctx,{kicker:'תחנה 1 · חולון',title:'מוזיאון העיצוב חולון',lede:'התחנה הראשונה קרובה לבית: מוזיאון העיצוב חולון, הראשון בישראל שמוקדש לעיצוב. הוא נפתח ב-2010. רון ארד, אדריכל ומעצב ישראלי, עטף אותו בחמישה סרטים מתפתלים של פלדה.',
  box:photo('assets/img/s10-holon.jpg','מוזיאון העיצוב חולון: סרטי פלדה אדומים וסגולים מתפתלים סביב הבניין, מול שמיים כחולים.','s10-wide'),credit:'צילום של הבניין',
  pts:[{x:72,y:22,name:'הסרטים',t:'הסרטים: חמישה פסים ענקיים שמתפתלים סביב הבניין, ונראים כמו פסל.'},{x:84,y:56,name:'הפלדה',t:'פלדת קורטן (Corten): פלדה שמחלידה בכוונה, ומקבלת גוונים של כתום, אדום וחום.'},{x:56,y:62,name:'הכניסה',t:'בפנים: שני אולמות תצוגה, והבניין עצמו הוא חלק מהחוויה.'}]})}},

{id:'va',title:'תחנה 2: לונדון',task:'לחצי על שלוש הנקודות בציור.',wide:true,
 text:'בלונדון נמצא ה-V&A, מוזיאון ויקטוריה ואלברט. הוא נוסד ב-1852, מתוך התערוכה הגדולה של 1851, ונועד ללמד מעצבים, יצרנים והקהל הרחב מה זה עיצוב טוב.',
 mount(el,ctx){return spots(el,ctx,{kicker:'תחנה 2 · לונדון',title:'מוזיאון ויקטוריה ואלברט',lede:'בלונדון נמצא ה-V&A, מוזיאון ויקטוריה ואלברט. הוא נוסד ב-1852, מתוך התערוכה הגדולה של 1851, ונועד ללמד מעצבים, יצרנים והקהל הרחב מה זה עיצוב טוב.',
  box:drawBox(vaSvg(),'s10-wide'),credit:'המחשה של אולם מוזיאון',
  pts:[{x:50,y:20,name:'הכיפה',t:'הכיפה: בניין מפואר, כי גם הבניין נועד להראות עיצוב טוב.'},{x:24,y:62,name:'הקשתות',t:'הקשתות: כל קשת היא "חדר" קטן, וכך העין נחה בין חפץ לחפץ.'},{x:76,y:62,name:'הבסיסים',t:'הבסיסים: החפץ עומד על במה, ומקבל כבוד.'}]})}},

{id:'met',title:'תחנה 3: ניו יורק',task:'לחצי על שלוש הנקודות בתמונה.',wide:true,
 text:'במוזיאון המטרופוליטן בניו יורק יש חדרי תקופה (Period Rooms): חדרים שלמים מבתים אמיתיים. באגף האמריקאי לבדו יש עשרים. אחד מהם הוא סלון שתכנן האדריכל פרנק לויד רייט, בשנים 1912 עד 1914.',
 mount(el,ctx){return spots(el,ctx,{kicker:'תחנה 3 · ניו יורק',title:'חדר שלם בתוך מוזיאון',lede:'במוזיאון המטרופוליטן בניו יורק יש חדרי תקופה (Period Rooms): חדרים שלמים מבתים אמיתיים. באגף האמריקאי לבדו יש עשרים. אחד מהם הוא סלון שתכנן האדריכל פרנק לויד רייט, בשנים 1912 עד 1914.',
  box:photo('assets/img/s10-wright.jpg','הסלון של פרנק לויד רייט במוזיאון המטרופוליטן: שורות חלונות גבוהות, פסי עץ בתקרה, אח מלבנים ורהיטי עץ.','s10-wide'),credit:'צילום של החדר במוזיאון המטרופוליטן',
  pts:[{x:88,y:32,name:'החלונות',t:'החלונות: זכוכית בדוגמה גאומטרית, שחוזרת על הקווים של החדר.'},{x:30,y:12,name:'העץ',t:'עץ אלון: פסים אופקיים שעוברים לאורך כל הקירות.'},{x:89,y:73,name:'הספסל',t:'הספסל הבנוי: גם הרהיטים חלק מהתכנון. הכול מדבר באותה שפה.'}]})}},

{id:'zoom',title:'זכוכית מגדלת',task:'הזיזי את העכבר על הכד, או לחצי על שלושת הכפתורים.',wide:true,
 text:'במוזיאון דיגיטלי אפשר להתקרב עד החומר עצמו: לראות את המכחול, את הזיגוג ואת הסדקים. הזיזי את הזכוכית המגדלת על הכד, וגלי שלושה סודות קטנים.',
 mount(el,ctx){const seen=ctx.data.seen||(ctx.data.seen={});const res=h('div');
  const inner=vaseSvg();const box=h('div',{class:'s10-zoom',html:inner});const lens=h('div',{class:'s10-lens','aria-hidden':'true',html:inner});box.append(lens,illus());
  const counter=h('span',{class:'counter'});
  function place(px,py){lens.style.left=px+'%';lens.style.top=py+'%';const f=3/0.44*100,sv=lens.firstChild;sv.style.width=sv.style.height=f+'%';sv.style.left=(50-px/100*f)+'%';sv.style.top=(50-py/100*f)+'%';lens.classList.add('on');
    ZOOM.forEach((z,i)=>{if(Math.hypot(z.x-px,z.y-py)<9&&!seen[i]){seen[i]=1;ctx.save();sayBox(res,'<b>'+(i+1)+'.</b> '+z.t);upd()}})}
  function upd(){const n=Object.keys(seen).length;counter.textContent='גילית '+n+' מתוך 3';if(n===3)ctx.done()}
  box.addEventListener('mousemove',e=>{const r=box.getBoundingClientRect();place((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100)});
  const btns=h('div',{class:'row'},...ZOOM.map((z,i)=>h('button',{class:'btn',type:'button',onclick:()=>{place(z.x,z.y);sayBox(res,'<b>'+(i+1)+'.</b> '+z.t)}},'סוד '+(i+1))));
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),copy('רגע WOW','זכוכית מגדלת','במוזיאון דיגיטלי אפשר להתקרב עד החומר עצמו: לראות את המכחול, את הזיגוג ואת הסדקים. הזיזי את הזכוכית המגדלת על הכד, וגלי שלושה סודות קטנים.',h('div',{class:'row'},counter),btns,res)));
  upd();
  return gate(ctx,Object.keys(seen).length===3);
 }},

/* יחידה 3: סודות האוצרת */
{id:'wall',title:'קיר בהיר או קיר כהה',task:'לחצי על "קיר בהיר" ועל "קיר כהה".',wide:true,
 text:'הסוד השלישי. יש לאוצרות שתי דרכים גדולות: קיר לבן ובהיר (White Cube), או חלל כהה ודרמטי (Black Box). על קיר כהה, פליז וזכוכית נראים כאילו הם מאירים מבפנים.',
 mount(el,ctx){const k={objs:['glass','brass','vase'],spot:'on'};
  return toggle2(el,ctx,{kicker:'הסוד השלישי',title:'קיר בהיר או קיר כהה',text:'הסוד השלישי. יש לאוצרות שתי דרכים גדולות: קיר לבן ובהיר (White Cube), או חלל כהה ודרמטי (Black Box). על קיר כהה, פליז וזכוכית נראים כאילו הם מאירים מבפנים.',cls:'s10-wide',
   opts:[['light','קיר בהיר',vitrineSvg(Object.assign({wall:'light'},k),true,'wl')],['dark','קיר כהה',vitrineSvg(Object.assign({wall:'dark'},k),true,'wd')]]})}},

{id:'space',title:'רווח נשימה',task:'לחצי על "מדף עמוס" ועל "מדף אצור".',wide:true,
 text:'הסוד הראשון והשני. במוזיאון אף פעם לא מציגים את כל האוסף. בוחרים כמה פריטים, ונותנים לכל אחד רווח נשימה (White Space). העין צריכה שקט סביב חפץ כדי לראות כמה הוא יפה.',
 mount(el,ctx){return toggle2(el,ctx,{kicker:'הסוד הראשון והשני',title:'רווח נשימה',text:'הסוד הראשון והשני. במוזיאון אף פעם לא מציגים את כל האוסף. בוחרים כמה פריטים, ונותנים לכל אחד רווח נשימה (White Space). העין צריכה שקט סביב חפץ כדי לראות כמה הוא יפה.',cls:'s10-wide',
  opts:[['crowd','מדף עמוס',shelfSvg(true)],['calm','מדף אצור',shelfSvg(false)]]})}},

{id:'story',title:'חפצים שמספרים סיפור',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'תערוכה טובה מספרת סיפור אחד. גם בבית אפשר לקבץ חפצים לפי רעיון, ולתת לכל קבוצה מקום משלה. שלוש דוגמאות מווילות של אספנים.',
 mount(el,ctx){const th=html=>()=>h('span',{class:'s3-draw thumb',html});
  return flips(el,ctx,{kicker:'סיפור אחד',title:'חפצים שמספרים סיפור',lede:'תערוכה טובה מספרת סיפור אחד. גם בבית אפשר לקבץ חפצים לפי רעיון, ולתת לכל קבוצה מקום משלה. שלוש דוגמאות מווילות של אספנים.',cls:'s3-secrets s9-three',
   cards:[{t:'קרמיקה בעבודת יד',front:th(vitrineSvg({wall:'light',objs:['vase','plate','vase'],spot:'on'},true,'c1')),b:'כמה כלים באותו גוון, על מדף אחד.'},
    {t:'צילומים בשחור-לבן',front:th(vitrineSvg({wall:'light',objs:['photo','photo','photo'],spot:'on'},true,'c2')),b:'מסגרות דומות, בשורה אחת.'},
    {t:'מזכרות מטיולים',front:th(vitrineSvg({wall:'dark',objs:['shell','wood','glass'],spot:'on'},true,'c3')),b:'שלושה חפצים, שלושה מקומות, סיפור אחד.'}]})}},

{id:'curate',title:'האוצרת',task:'בחרי קיר, בין שלושה לחמישה חפצים, ואור.',wide:true,
 text:'בעלת וילה בקיסריה מבקשת תערוכה קטנה בוויטרינה של הסלון. את האוצרת. בחרי קיר, בחרי בין שלושה לחמישה חפצים מתוך שמונה, והחליטי אם להדליק אור מדגיש.',
 mount(el,ctx){
  const k=ctx.data.k||(ctx.data.k={objs:[]});const res=h('div');const box=h('div',{class:'s3-draw s10-wide'});const ctr=h('div',{class:'s3-side'});
  const ok=()=>k.wall&&k.spot&&k.objs.length>=3&&k.objs.length<=5;
  function draw(){box.innerHTML=vitrineSvg(k,false,'mk');box.append(illus());
   const objRow=h('div',{class:'s3-q'},h('b',null,'החפצים'),h('div',{class:'chips sm s10-objs',role:'group','aria-label':'החפצים'},...OKEYS.map(o=>h('button',{type:'button','aria-pressed':String(k.objs.includes(o)),onclick:()=>tog(o)},OBJ[o][0]))));
   ctr.replaceChildren(chipRow('הקיר',[['dark','קיר כהה'],['light','קיר בהיר']],k.wall,x=>{k.wall=x;ctx.save();draw();sayBox(res,x==='dark'?'קיר כהה: דרמטי, והפליז והזכוכית בורקים.':'קיר בהיר: שקט ואוורירי, כמו גלריה.')}),
    objRow,chipRow('האור',[['on','אור מדגיש'],['off','בלי אור']],k.spot,x=>{k.spot=x;ctx.save();draw();sayBox(res,x==='on'?'האור מספר לעין לאן להסתכל.':'בלי אור: הוויטרינה נחה, וקצת נבלעת בחדר.')}),
    h('p',{class:'note s10-count'},'נבחרו '+k.objs.length+' חפצים'),res);
   if(ok())ctx.done()}
  function tog(o){const i=k.objs.indexOf(o);if(i>=0)k.objs.splice(i,1);else{if(k.objs.length>=5){sayBox(res,'במוזיאון בוחרים. הורידי חפץ אחד, ורק אז הוסיפי.');return}k.objs.push(o)}ctx.save();draw();
   if(k.objs.length<3)sayBox(res,'עוד '+(3-k.objs.length)+' לפחות.');else sayBox(res,'יפה. לכל חפץ יש מרווח משלו.')}
  el.append(head('המשימה','האוצרת','בעלת וילה בקיסריה מבקשת תערוכה קטנה בוויטרינה של הסלון. את האוצרת. בחרי קיר, בחרי בין שלושה לחמישה חפצים מתוך שמונה, והחליטי אם להדליק אור מדגיש.'),
   h('div',{class:'s3-simwrap s10-curwrap'},h('div',{class:'s3-simcol'},box),ctr));
  draw();
  return gate(ctx,!!ok());
 }},

{id:'opening',title:'פתיחת התערוכה',task:'תני שם לתערוכה, ושמרי אותה במחברת.',wide:true,
 text:'ערב הפתיחה, {name}. האורות נדלקים, והאורחים נכנסים. לכל תערוכה יש שם. איך תקראי לשלך?',
 mount(el,ctx){
  const k=((ctx.all.curate||{}).k)||{};const res=h('div');
  if(!(k.wall&&k.spot&&k.objs&&k.objs.length>=3)){el.append(h('div',{class:'center'},h('div',null,h('h2',null,'פתיחת התערוכה'),h('p',{class:'lede'},'התערוכה עוד לא מוכנה. חזרי מסך אחד אחורה והשלימי אותה.'))));return gate(ctx,false)}
  const box=h('div',{class:'s3-draw s10-wide s10-open',html:vitrineSvg(Object.assign({},k,{spot:'on'}),true,'op')});box.append(illus());
  setTimeout(()=>box.classList.add('on'),60);
  const inp=h('input',{id:'vit10',type:'text',maxlength:60,value:ctx.data.title||'',placeholder:'למשל: אוצרות מהים'});
  const save=()=>{const v=inp.value.trim();if(!v){inp.focus();return}ctx.data.title=v;const kk=JSON.parse(JSON.stringify(Object.assign({},k,{title:v})));const text=vitText(kk);
   const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='vitrine10'&&n.session===10);
   if(old){old.k=kk;old.text=text;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:'vitrine10',svg:true,title:'התערוכה שלי בקיסריה',k:kk,text});
   ctx.save();sayBox(res,nameFill('<b>התערוכה נשמרה במחברת שלך.</b> ברכות לאוצרת, {name}.'));ctx.done()};
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
   copy('ערב הפתיחה','פתיחת התערוכה',nameFill('ערב הפתיחה, {name}. האורות נדלקים, והאורחים נכנסים. לכל תערוכה יש שם. איך תקראי לשלך?'),
    h('div',{class:'field'},h('label',{for:'vit10'},'שם התערוכה'),inp),h('div',{class:'row',style:'margin-top:12px'},h('button',{class:'cta',type:'button',onclick:save},'שמרי במחברת')),res)));
  if(ctx.data.title)sayBox(res,'<b>התערוכה נשמרה במחברת שלך.</b>');
  return gate(ctx,!!ctx.data.title);
 }},

{id:'real',title:'סיור אמיתי, למי שרוצה',task:'אם תרצי, פתחי אחד הקישורים. אפשר גם להמשיך.',wide:true,
 text:'רוצה לטייל באמת? שלושת המוזיאונים מציגים באתר שלהם חלק מהאוספים. האתרים באנגלית. מה לחפש: את הצבע של הקירות, את המרווח בין החפצים, ואת האור על מה שחשוב.',
 mount(el,ctx){
  el.append(head('רשות','סיור אמיתי, למי שרוצה','רוצה לטייל באמת? שלושת המוזיאונים מציגים באתר שלהם חלק מהאוספים. האתרים באנגלית. מה לחפש: את הצבע של הקירות, את המרווח בין החפצים, ואת האור על מה שחשוב.'),
   h('div',{class:'s10-links'},
    linkCard('https://www.metmuseum.org/about-the-met/collection-areas/the-american-wing/period-rooms','חדרי התקופה במטרופוליטן','עשרים חדרים, וביניהם הסלון של פרנק לויד רייט'),
    linkCard('https://www.vam.ac.uk/page/g/great-exhibition','ה-V&A בלונדון','איך נולד המוזיאון מתוך התערוכה הגדולה'),
    linkCard('https://www.dmh.org.il/en/about-us/','מוזיאון העיצוב חולון','על הבניין של רון ארד ועל המוזיאון')));
  ctx.done();
 }},

/* יחידה 4: בדיקה */
{id:'check1',title:'בדיקה 1',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מאיפה באה המילה מוזיאון?',[['ממקדש המוזות ביוון'],['משם של מלך'],['ממילה שפירושה מחסן']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 1',lede:'ארבע שאלות קצרות על מה שראית היום.',q:'מאיפה באה המילה מוזיאון?',visual:drawBox(mouseionSvg(),'s10-wide'),
  opts:[['ממקדש המוזות ביוון',1],['משם של מלך',0],['ממילה שפירושה מחסן',0]],hint:'היזכרי ברגע ההיסטורי.',right:'<b>נכון.</b> מוזאון: מקום של המוזות, אלות האמנויות.'})}},

{id:'check2',title:'בדיקה 2',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה זה חדר תקופה?',[['חדר שלם מבית אמיתי, בתוך מוזיאון'],['חדר שבו מוכרים כרטיסים'],['תמונה של חדר על הקיר']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 2',q:'מה זה חדר תקופה?',visual:drawBox(prairieSvg(),'s10-wide'),
  opts:[['חדר שלם מבית אמיתי, בתוך מוזיאון',1],['חדר שבו מוכרים כרטיסים',0],['תמונה של חדר על הקיר',0]],hint:'חשבי על הסלון של פרנק לויד רייט.',right:'<b>נכון.</b> הקירות, החלונות והרהיטים, הכול מדבר באותה שפה.'})}},

{id:'check3',title:'בדיקה 3',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה עושה קיר כהה לחפצים מפליז ומזכוכית?',[['מבליט אותם, כאילו הם מאירים'],['מסתיר אותם'],['לא משנה דבר']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 3',q:'מה עושה קיר כהה לחפצים מפליז ומזכוכית?',visual:drawBox(vitrineSvg({wall:'dark',objs:['glass','brass','vase'],spot:'on'},true,'q3'),'s10-wide'),
  opts:[['מבליט אותם, כאילו הם מאירים',1],['מסתיר אותם',0],['לא משנה דבר',0]],hint:'היזכרי בקיר הכהה ובקיר הבהיר.',right:'<b>נכון.</b> זה הקסם של החלל הכהה.'})}},

{id:'check4',title:'בדיקה 4',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה עושה אוצרת עם אוסף גדול?',[['בוחרת כמה פריטים ונותנת להם מרווח'],['מציגה את כולו בבת אחת'],['מסתירה את כולו']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 4',q:'מה עושה אוצרת עם אוסף גדול?',visual:drawBox(shelfSvg(false),'s10-wide'),
  opts:[['בוחרת כמה פריטים ונותנת להם מרווח',1],['מציגה את כולו בבת אחת',0],['מסתירה את כולו',0]],hint:'היזכרי במדף העמוס ובמדף האצור.',right:nameFill('<b>נכון.</b> רווח נשימה לכל חפץ. <b>ארבע מתוך ארבע, {name}.</b>')})}},

/* יחידה 5 */
{id:'home-idea',title:'רעיון לבית',task:'אם תרצי, כתבי את שלושת החפצים שלך ושמרי במחברת.',
 text:'רעיון לבית, למי שרוצה. בחרי מדף אחד או שידה אחת. הורידי הכול, ובחרי רק שלושה עד חמישה חפצים אהובים. החזירי אותם עם מרווח, בגבהים שונים, וכווני אליהם מנורה קטנה.',
 mount(el,ctx){ideaScreen(el,ctx,{n:10,media:h('div',{class:'s6-ideaimg',html:shelfSvg(false)}),field:'החפצים שאשאיר על המדף',
  text:'רעיון לבית, למי שרוצה. בחרי מדף אחד או שידה אחת. הורידי הכול, ובחרי רק שלושה עד חמישה חפצים אהובים. החזירי אותם עם מרווח, בגבהים שונים, וכווני אליהם מנורה קטנה.'})}},

{id:'summary',title:'סיכום',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות של האוצרת, שפגשת בתחילת המפגש.',
 mount(el,ctx){const th=html=>()=>h('span',{class:'s3-draw thumb',html});
  return flips(el,ctx,{kicker:'סיכום',title:'ארבעה כללים',lede:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות של האוצרת, שפגשת בתחילת המפגש.',cls:'s3-flips',toggle:true,
   cards:[{t:'בוחרים מעט',front:th(shelfSvg(false)),b:'שלושה עד חמישה חפצים אהובים, לא הכול.'},
    {t:'מרווח לכל חפץ',front:th(vitrineSvg({wall:'light',objs:['vase','brass','plate'],spot:'off'},false,'s2')),b:'שקט סביב החפץ, כדי שהעין תראה אותו.'},
    {t:'הרקע בוחר אווירה',front:th(vitrineSvg({wall:'dark',objs:['glass','brass','vase'],spot:'on'},true,'s3')),b:'קיר בהיר מרגיע, קיר כהה מבליט.'},
    {t:'האור מכוון את העין',front:th(hallSvg('s4')),b:'ספוט קטן על מה שהכי חשוב.'}]});
 }},

{id:'audio',title:'סקירה קולית',task:'לחצי על הנגן כדי לשמוע.',skip:()=>!audioOK,
 text:'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.',
 mount(el,ctx){audioScreen(el,ctx,10)}},

{id:'feedback',title:'משוב וגשר',task:'דרגי בלחיצה, ואם תרצי, כתבי גם כמה מילים.',wide:true,hideNext:true,
 say:'{name}, סיימת את מפגש 10. טיילת בחולון, בלונדון ובניו יורק, התקרבת לכד בזכוכית מגדלת ואצרת תערוכה משלך. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
 mount(el,ctx){feedbackScreen(el,ctx,{n:10,open:'{name}, סיימת את מפגש 10. טיילת בחולון, בלונדון ובניו יורק, התקרבת לכד בזכוכית מגדלת ואצרת תערוכה משלך. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
  extra:{q:'איזו תחנה הכי אהבת?',opts:['חולון','לונדון','ניו יורק','התערוכה שלי'],show:'התחנה האהובה',why:'למה? (לא חובה)'},
  bridgeMedia:drawBox(hallSvg('br'),'s7-bridge'),
  bridge:'במפגש הבא: סודות המעצבים. נאסוף את כל מה שלמדת, ונשדרג חדר שלם בשלושה צעדים, בלי לשבור אף קיר.'})}}
];

window.Salon.register(10,screens);
})();
