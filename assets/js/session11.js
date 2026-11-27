/* הסלון של מזל · מפגש 11: סודות המעצבים
   בלוק נתונים ורכיבים של המפגש. לא נוגע במנוע ולא במפגשים 1 עד 10. */
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
fetch('assets/audio/s11.m4a',{method:'HEAD'}).then(r=>{audioOK=r.ok}).catch(()=>{});

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
const WALLS={plain:['שמנת','#EFE6D6'],olive:['ירוק זית','#6F7A4A'],night:['כחול לילה','#27384F'],terra:['טרקוטה','#B9603F'],stone:['טיח אבן','#CBBBA0']};
/* סלון במבט מלפנים. st: wall, float, curtain(high), cush(tex), mirror, lamps(layer), art(145), clear */
function roomSvg(st,id){st=st||{};const fy=330;const wall=WALLS[st.wall||'plain'][1];const dk=st.wall==='night'||st.wall==='olive';
  const sx=st.float?150:40;const evening=st.eve;
  const cur=st.curtain?`<rect x="374" y="22" width="232" height="6" fill="${C.brass}"/><rect x="372" y="28" width="34" height="${fy-28}" fill="#EDE3D0"/><rect x="574" y="28" width="34" height="${fy-28}" fill="#E3D8C2"/>`:
   `<rect x="384" y="82" width="212" height="6" fill="#8C8C8C"/><rect x="384" y="88" width="30" height="150" fill="#C7BBA3"/><rect x="566" y="88" width="30" height="150" fill="#BCB096"/>`;
  const artY=st.art?120:58;
  return svg('0 0 640 420',`<defs>${G('lmA'+id)}${G('lmB'+id)}${G('top'+id,'#FFF4D8',.5)}${G('mir'+id,'#E6F3F6',.6)}</defs>
   <rect width="640" height="420" fill="${wall}"/><rect y="${fy}" width="640" height="90" fill="${C.floor}"/>
   <rect x="400" y="96" width="180" height="200" fill="#BFE0EC"/><path d="M400 240 q90 -40 180 0 V296 H400Z" fill="${C.sage}"/><circle cx="540" cy="140" r="16" fill="#FFF3C8"/><rect x="396" y="92" width="188" height="208" fill="none" stroke="#FFF" stroke-width="8"/>
   ${cur}
   ${st.mirror?`<rect x="20" y="60" width="96" height="200" rx="48" fill="#C9A24B"/><rect x="28" y="68" width="80" height="184" rx="40" fill="#D7ECF1"/><path d="M36 210 q32 -20 64 0 V244 H36Z" fill="${C.sage}" opacity=".8"/><circle cx="68" cy="160" r="90" fill="url(#mir${id})"/>`:''}
   ${frameArt2(sx+40,artY,st.art?2:1)}
   ${st.float?`<ellipse cx="${sx+120}" cy="${fy+44}" rx="190" ry="30" fill="${C.terra}" opacity=".55"/><ellipse cx="${sx+120}" cy="${fy+44}" rx="160" ry="22" fill="none" stroke="#F3E6CF" stroke-width="3"/>`:''}
   ${sofa(sx,fy+(st.float?18:0),240,C.lead)}
   ${st.cush?`<rect x="${sx+14}" y="${fy-46+(st.float?18:0)}" width="46" height="36" rx="8" fill="#E6D7BE"/><rect x="${sx+70}" y="${fy-44+(st.float?18:0)}" width="42" height="34" rx="8" fill="${C.mustard}"/><rect x="${sx+180}" y="${fy-46+(st.float?18:0)}" width="46" height="36" rx="8" fill="#8E9C7C"/>${[0,1,2,3].map(i=>`<path d="M${sx+74+i*9} ${fy-40+(st.float?18:0)} v26" stroke="#C8902A" stroke-width="2"/>`).join('')}`:`<rect x="${sx+20}" y="${fy-44+(st.float?18:0)}" width="40" height="32" rx="6" fill="#9AA0A0"/><rect x="${sx+180}" y="${fy-44+(st.float?18:0)}" width="40" height="32" rx="6" fill="#9AA0A0"/>`}
   ${st.clear?`<rect x="${sx+260}" y="${fy-50}" width="50" height="50" fill="${C.oak}"/><path d="M${sx+272} ${fy-50} q13 -34 26 0z" fill="${C.sage}"/>`:`<rect x="${sx+250}" y="${fy-40}" width="40" height="40" fill="#9A8A74"/><rect x="${sx+254}" y="${fy-62}" width="14" height="22" fill="#C65A3C"/><rect x="${sx+270}" y="${fy-70}" width="12" height="30" fill="#7A9AB0"/><rect x="300" y="${fy+30}" width="70" height="30" rx="8" fill="#8F7F69"/><rect x="230" y="${fy+56}" width="40" height="20" rx="6" fill="#A08A6E"/>`}
   ${st.lamps?`<circle cx="${sx+285}" cy="${fy-80}" r="80" fill="url(#lmA${id})"/><path d="M${sx+272} ${fy-100} h26 l6 22 h-38z" fill="${C.cream}"/><rect x="${sx+283}" y="${fy-78}" width="4" height="28" fill="${C.brass}"/>
     <circle cx="${Math.max(30,sx-30)}" cy="140" r="90" fill="url(#lmB${id})"/><rect x="${Math.max(30,sx-30)-2}" y="150" width="5" height="${fy-150}" fill="${C.ink}"/><path d="M${Math.max(30,sx-30)-20} 150 h40 l-8 -30 h-24z" fill="${C.cream}"/>`:
     `<circle cx="300" cy="40" r="120" fill="url(#top${id})"/><rect x="270" y="0" width="60" height="16" fill="#FFF"/>`}`)}
function frameArt2(x,y,n){if(n===2)return `<rect x="${x}" y="${y}" width="70" height="90" fill="${C.brass}"/><rect x="${x+6}" y="${y+6}" width="58" height="78" fill="${C.terra}"/><rect x="${x+90}" y="${y+10}" width="60" height="70" fill="${C.ink}"/><rect x="${x+96}" y="${y+16}" width="48" height="58" fill="${C.mustard}"/>`;
  return `<rect x="${x+40}" y="${y}" width="80" height="60" fill="#8C8C8C"/><rect x="${x+46}" y="${y+6}" width="68" height="48" fill="#D9D9D9"/>`}
/* תוכנית מלמעלה */
function planSvg(float,obst){const rug=float?`<rect x="190" y="140" width="260" height="170" rx="16" fill="${C.terra}" opacity=".5"/>`:'';
  const S=float?{s:[200,130,240,46],a1:[150,190,46,70],a2:[444,190,46,70],t:[270,210,100,50]}:{s:[200,40,240,46],a1:[40,170,46,70],a2:[554,170,46,70],t:[270,200,100,50]};
  const r=(a,c)=>`<rect x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${a[3]}" rx="10" fill="${c}"/>`;
  return svg('0 0 640 420',`<rect width="640" height="420" fill="${C.floor}"/><rect x="20" y="20" width="600" height="380" fill="none" stroke="${C.ink}" stroke-width="10"/>
   <rect x="250" y="14" width="140" height="12" fill="#BFE0EC"/><rect x="560" y="330" width="60" height="70" fill="${C.floor}"/><path d="M560 400 a60 60 0 0 1 60 -60" stroke="${C.ink}" stroke-width="3" fill="none"/>
   ${rug}${r(S.s,C.lead)}${r(S.a1,C.sage)}${r(S.a2,C.sage)}${r(S.t,C.oak)}
   ${float?`<path d="M590 360 C480 360 140 360 60 300" stroke="#FFF" stroke-width="6" stroke-dasharray="14 10" fill="none"/>`:''}
   ${obst?`<circle cx="470" cy="360" r="24" fill="#8F7F69"/><rect x="300" y="340" width="44" height="44" fill="${C.wood}"/><circle cx="140" cy="330" r="22" fill="#6F9A5A"/>`:''}`)}
/* רגע היסטורי: מראה מצרית */
function mirrorSvg(on){return svg('0 0 640 420',`<defs>${G('ray11','#FFE7B0',.9)}</defs><rect width="640" height="420" fill="${on?'#F7E9CF':'#E9DCC2'}"/><rect y="330" width="640" height="90" fill="${C.stone}"/>
  <circle cx="90" cy="70" r="40" fill="${C.mustard}"/>
  ${on?`<path d="M120 90 L300 170 L300 200 Z" fill="#FFE7B0" opacity=".6"/><path d="M330 190 L600 120 L600 300 Z" fill="#FFE7B0" opacity=".45"/><circle cx="560" cy="210" r="90" fill="url(#ray11)"/>`:''}
  <g transform="rotate(${on?-18:0} 320 230)"><ellipse cx="320" cy="170" rx="70" ry="64" fill="#C98A4B" stroke="#8E5A2C" stroke-width="5"/><ellipse cx="305" cy="155" rx="40" ry="34" fill="#E6B27A" opacity=".7"/>
   <rect x="310" y="232" width="20" height="90" fill="#8E5A2C"/><path d="M296 240 q24 -20 48 0 q-6 14 -24 14 q-18 0 -24 -14z" fill="#B97A42"/><circle cx="320" cy="262" r="9" fill="#C9A24B"/></g>
  <rect x="470" y="160" width="140" height="170" fill="#D8C6A4"/><rect x="500" y="200" width="80" height="100" fill="#C2A27A"/>`)}
/* שידה עם חפצים */
const CONS={vase:['אגרטל',(x,b)=>`<path d="M${x-12} ${b} q-10 -26 2 -46 h20 q12 20 2 46z" fill="${C.terra}"/>`],lamp:['מנורת שולחן',(x,b)=>`<rect x="${x-3}" y="${b-50}" width="6" height="50" fill="${C.brass}"/><path d="M${x-24} ${b-50} h48 l-10 -30 h-28z" fill="${C.cream}"/>`],
 books:['ערמת ספרים',(x,b)=>`<rect x="${x-26}" y="${b-12}" width="52" height="12" fill="${C.lead}"/><rect x="${x-22}" y="${b-22}" width="44" height="10" fill="${C.mustard}"/><rect x="${x-24}" y="${b-32}" width="48" height="10" fill="${C.sage}"/>`],
 plant:['עציץ',(x,b)=>`<path d="M${x-14} ${b} l-4 -24 h36 l-4 24z" fill="${C.wood}"/><circle cx="${x}" cy="${b-40}" r="22" fill="#6F9A5A"/>`],
 photo:['תמונה ממוסגרת',(x,b)=>`<rect x="${x-18}" y="${b-46}" width="36" height="46" fill="${C.ink}"/><rect x="${x-13}" y="${b-41}" width="26" height="36" fill="#D9C29C"/>`],
 keys:['קערת מפתחות',(x,b)=>`<path d="M${x-20} ${b-14} q20 22 40 0z" fill="#8C8C8C"/>`],mail:['ערמת מכתבים',(x,b)=>`<rect x="${x-20}" y="${b-8}" width="40" height="8" fill="#FFF" stroke="#BBB"/><rect x="${x-18}" y="${b-15}" width="36" height="7" fill="#F2F2F2" stroke="#BBB"/>`],
 remote:['שלט',(x,b)=>`<rect x="${x-6}" y="${b-6}" width="30" height="6" rx="3" fill="#333"/>`],candle:['נר ריחני',(x,b)=>`<rect x="${x-10}" y="${b-24}" width="20" height="24" fill="#F7F1E6"/><path d="M${x} ${b-34} q-4 5 0 10 q4 -5 0 -10z" fill="#F29C38"/>`]};
const CKEYS=Object.keys(CONS);
function consoleSvg(items){const n=items.length;const gap=n?Math.min(110,420/n):0;const st=320-gap*(n-1)/2;
  return svg('0 0 640 420',`<rect width="640" height="420" fill="${C.wall}"/><rect y="350" width="640" height="70" fill="${C.floor}"/>
   <rect x="120" y="230" width="400" height="16" fill="${C.oak}"/><rect x="134" y="246" width="372" height="80" fill="${shade(C.oak,-.12)}"/><rect x="150" y="326" width="10" height="24" fill="#6B4F36"/><rect x="480" y="326" width="10" height="24" fill="#6B4F36"/>
   <rect x="250" y="60" width="140" height="120" fill="${C.brass}"/><rect x="258" y="68" width="124" height="104" fill="#D7ECF1"/>
   ${items.map((o,i)=>CONS[o][1](st+i*gap,230)).join('')}`)}

/* שלושה צעדים */
const STEPS=[{t:'לפני',st:{},b:'הספה צמודה לקיר, הווילון קצר, אור אחד מהתקרה, והרבה חפצים קטנים.'},
 {t:'צעד 1',st:{float:1,clear:1},b:'צעד 1: הספה זזה פנימה אל השטיח, והשביל התפנה.'},
 {t:'צעד 2',st:{float:1,clear:1,curtain:1,cush:1},b:'צעד 2: וילון מהתקרה עד הרצפה, וכריות בשלושה מרקמים.'},
 {t:'צעד 3',st:{float:1,clear:1,curtain:1,cush:1,mirror:1,lamps:1,art:1},b:'צעד 3: אור חם בשני גבהים, מנורת שולחן ומנורה גבוהה. אפשר להוסיף גם מראה מול החלון.'}];
const STEP_ALT=['סלון לפני: ספה ליד הקיר, וילון קצר בחלון, אור אחד מהתקרה, והרבה חפצים על השולחן.','אותו סלון אחרי צעד 1: הספה זזה קדימה אל השטיח, והשולחן התפנה.','אותו סלון אחרי צעד 2: וילונות פשתן מהתקרה עד הרצפה, וכריות במרקמים שונים.','אותו סלון אחרי צעד 3: מנורת שולחן ומנורה גבוהה מוסיפות אור חם בשני גבהים.'];
/* השדרוג שלך */
const HACKS={float:'להזיז את הספה אל השטיח',clear:'לפנות את המעבר',curtain:'וילון מהתקרה עד הרצפה',cush:'כריות בשלושה מרקמים',mirror:'מראה מול החלון',lamps:'אור חם בשני גבהים',art:'תמונות בגובה העיניים'};
const HKEYS=Object.keys(HACKS);
function upText(k){return (k.picks||[]).map(x=>HACKS[x]).join(', ')+(k.wall&&k.wall!=='plain'?', וקיר ב'+WALLS[k.wall][0]:'')+'.'}
function upState(k){const st={wall:k.wall||'plain'};(k.picks||[]).forEach(x=>st[x]=1);return st}
const prevDraw=window.Salon.drawNote;
window.Salon.drawNote=function(it){if(it.kind==='upgrade11'&&it.k){return h('div',{class:'s3-nb',html:roomSvg(upState(it.k),'nb'+it.ts)})}return prevDraw?prevDraw(it):null};

const screens=[

/* יחידה 1 */
{id:'open',title:'סודות המעצבים',hideNext:true,
 text:'ברוכה השבה, {name}. הרבה חושבים שבית מעוצב מתחיל בשיפוץ גדול. מעצבות יודעות סוד אחר: כמה שינויים קטנים ומדויקים עושים את רוב ההבדל. היום תשדרגי סלון שלם בשלושה צעדים, בלי לשבור אף קיר.',
 mount(el,ctx){
  const box=photo('assets/img/s11-step4.jpg',STEP_ALT[3],'s11-wide',1);
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
    h('div',{class:'copy'},h('span',{class:'kicker'},'מפגש 11'),h('h1',null,'סודות המעצבים'),
      h('p',{class:'lede'},nameFill('ברוכה השבה, {name}. הרבה חושבים שבית מעוצב מתחיל בשיפוץ גדול. מעצבות יודעות סוד אחר: כמה שינויים קטנים ומדויקים עושים את רוב ההבדל. היום תשדרגי סלון שלם בשלושה צעדים, בלי לשבור אף קיר.')),
      h('button',{class:'cta',type:'button',onclick:ctx.next,html:'בואי נתחיל'+window.Salon.ICON.arrowL}))));
 }},

{id:'secrets',title:'ארבעה סודות',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'לשדרוג מהיר של חדר יש ארבעה סודות. היום נכיר את כולם, ונחבר אליהם את מה שלמדת במפגשים הקודמים.',
 mount(el,ctx){return flips(el,ctx,{kicker:'ארבעה סודות',title:'ארבעה סודות',lede:'לשדרוג מהיר של חדר יש ארבעה סודות. היום נכיר את כולם, ונחבר אליהם את מה שלמדת במפגשים הקודמים.',
  cards:[{t:'סוד 1',b:'רהיטים צפים, ושביל פנוי.'},{t:'סוד 2',b:'טקסטיל מחליף פנים לחדר.'},{t:'סוד 3',b:'קיר אחד עם אופי.'},{t:'סוד 4',b:'אור חם ומראה במקום הנכון.'}]})}},

{id:'mirror-hist',title:'רגע היסטורי: המראה המצרית',task:'לחצי על "הפני אל השמש", ואחר כך על "הבא".',wide:true,
 text:'רגע היסטורי. לפני כשלושת אלפים וחמש מאות שנה, במצרים, מראה לא הייתה מזכוכית. היא הייתה דיסק של נחושת מלוטשת, עם ידית מעוצבת. מראה כזו מוצגת היום במוזיאון המטרופוליטן. וכבר אז היא החזירה את האור.',
 mount(el,ctx){const res=h('div');const box=h('div',{class:'s3-draw s11-wide'});
  const draw=on=>{if(on){box.style.background='';box.innerHTML=mirrorSvg(on);box.append(illus());return}box.innerHTML='';box.style.background='#A4A4A4';box.append(h('img',{src:'assets/img/s11-mirror.jpg',alt:'מראה מצרית עתיקה: דיסק נחושת עגול על ידית מעוצבת, במוזיאון המטרופוליטן.',decoding:'async',style:'width:100%;height:100%;object-fit:contain;display:block'}))};draw(!!ctx.data.on);
  const go=()=>{ctx.data.on=1;ctx.save();draw(true);sayBox(res,'<b>האור חוזר אל החדר.</b> אותו רעיון בדיוק נשתמש בו היום, עם מראה מול חלון.');ctx.done()};
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,linkCard('https://www.metmuseum.org/art/collection/search/545128','המראה במוזיאון המטרופוליטן','מראה מסגסוגת נחושת, מצרים, בערך 1491 עד 1473 לפני הספירה')),
   copy('רגע היסטורי','המראה המצרית','רגע היסטורי. לפני כשלושת אלפים וחמש מאות שנה, במצרים, מראה לא הייתה מזכוכית. היא הייתה דיסק של נחושת מלוטשת, עם ידית מעוצבת. מראה כזו מוצגת היום במוזיאון המטרופוליטן. וכבר אז היא החזירה את האור.',
    h('div',{class:'row'},h('button',{class:'btn',type:'button',onclick:go},'הפני אל השמש')),res)));
  if(ctx.data.on)sayBox(res,'<b>האור חוזר אל החדר.</b> אותו רעיון בדיוק נשתמש בו היום, עם מראה מול חלון.');
  return gate(ctx,!!ctx.data.on);
 }},

/* יחידה 2: ארבעת הסודות */
{id:'float',title:'רהיטים צפים',task:'לחצי על "צמוד לקיר" ועל "צף על השטיח".',wide:true,
 text:'הסוד הראשון. הטעות הנפוצה: כל הרהיטים צמודים לקירות, והאמצע ריק. מעצבות מזיזות את הספה והכורסאות פנימה, סביב שטיח אחד. קוראים לזה רהיטים צפים (Floating Furniture). כך נוצרת פינת שיחה, ומאחור נשאר שביל.',
 mount(el,ctx){return toggle2(el,ctx,{kicker:'הסוד הראשון',title:'רהיטים צפים',text:'הסוד הראשון. הטעות הנפוצה: כל הרהיטים צמודים לקירות, והאמצע ריק. מעצבות מזיזות את הספה והכורסאות פנימה, סביב שטיח אחד. קוראים לזה רהיטים צפים (Floating Furniture). כך נוצרת פינת שיחה, ומאחור נשאר שביל.',cls:'s11-wide',
  opts:[['wall','צמוד לקיר',planSvg(false)],['float','צף על השטיח',planSvg(true)]]})}},

{id:'path',title:'שביל פנוי',task:'לחצי על שלושת המכשולים בתוכנית.',wide:true,
 text:'שביל פנוי מהדלת אל החלון גורם לחדר להרגיש גדול ומתוכנן. בתוכנית הזו שלושה דברים קטנים חוסמים את הדרך. מצאי אותם.',
 mount(el,ctx){return spots(el,ctx,{kicker:'הסוד הראשון',title:'שביל פנוי',lede:'שביל פנוי מהדלת אל החלון גורם לחדר להרגיש גדול ומתוכנן. בתוכנית הזו שלושה דברים קטנים חוסמים את הדרך. מצאי אותם.',
  box:drawBox(planSvg(true,true),'s11-wide'),credit:'תוכנית מלמעלה',
  pts:[{x:73,y:86,name:'הדום',t:'הדום: עובר אל ליד הכורסה.'},{x:50,y:86,name:'שולחן צד',t:'שולחן הצד: עובר אל ליד הספה.'},{x:22,y:79,name:'עציץ',t:'העציץ: עובר אל הפינה, ליד החלון.'}]})}},

{id:'accent',title:'קיר אחד עם אופי',task:'נסי לפחות שני גוונים לקיר.',wide:true,
 text:'הסוד השלישי. במקום לצבוע את כל הבית, צובעים קיר אחד בגוון עמוק, או בטיח שנראה כמו אבן. קוראים לזה קיר מודגש (Accent Wall). זה נותן עומק ודרמה, בעלות קטנה.',
 mount(el,ctx){const tr=ctx.data.tr||(ctx.data.tr={});const res=h('div');const box=h('div',{class:'s3-draw s11-wide'});
  const MSG={olive:'ירוק זית: רגוע וטבעי, מתחבר לגינה.',night:'כחול לילה: עמוק ואלגנטי. הפליז והעץ בורקים עליו.',terra:'טרקוטה: חם, כמו אדמה בשקיעה.',stone:'טיח אבן: מרקם עדין שמשנה צבע עם האור.'};
  const draw=()=>{box.innerHTML=roomSvg({wall:ctx.data.cur||'plain',float:1,clear:1,curtain:1,cush:1},'ac');box.append(illus())};
  const row=()=>chipRow('הקיר',Object.keys(MSG).map(k=>[k,WALLS[k][0]]),ctx.data.cur,k=>{ctx.data.cur=k;tr[k]=1;ctx.save();draw();wrap.replaceChildren(row());sayBox(res,MSG[k]);if(Object.keys(tr).length>=2)ctx.done()});
  const wrap=h('div');wrap.append(row());draw();
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),copy('הסוד השלישי','קיר אחד עם אופי','הסוד השלישי. במקום לצבוע את כל הבית, צובעים קיר אחד בגוון עמוק, או בטיח שנראה כמו אבן. קוראים לזה קיר מודגש (Accent Wall). זה נותן עומק ודרמה, בעלות קטנה.',wrap,res)));
  return gate(ctx,Object.keys(tr).length>=2);
 }},

{id:'mirror',title:'מראה מול החלון',task:'לחצי על "בלי מראה" ועל "עם מראה".',wide:true,
 text:'הסוד הרביעי. מראה גדולה, במסגרת דקה, נתלית מול החלון. היא מחזירה אל החדר את האור ואת הירוק של הגינה. כמו המראה המצרית, רק גדולה יותר.',
 mount(el,ctx){const b={float:1,clear:1,curtain:1,cush:1};
  return toggle2(el,ctx,{kicker:'הסוד הרביעי',title:'מראה מול החלון',text:'הסוד הרביעי. מראה גדולה, במסגרת דקה, נתלית מול החלון. היא מחזירה אל החדר את האור ואת הירוק של הגינה. כמו המראה המצרית, רק גדולה יותר.',cls:'s11-wide',
   opts:[['no','בלי מראה',roomSvg(b,'m0')],['yes','עם מראה',roomSvg(Object.assign({mirror:1},b),'m1')]]})}},

{id:'lamps',title:'אור בשני גבהים',task:'לחצי על "אור מהתקרה" ועל "אור בשני גבהים".',wide:true,
 text:'ועוד חלק מהסוד הרביעי. בערב מכבים את האור המרכזי, ומדליקים מנורת שולחן ליד הספה ומנורת עמידה בפינה. זוכרת ממפגש 4? אור חם, בסביבות 2700K, בשני גבהים שונים.',
 mount(el,ctx){const b={float:1,clear:1,curtain:1,cush:1,mirror:1};
  return toggle2(el,ctx,{kicker:'הסוד הרביעי',title:'אור בשני גבהים',text:'ועוד חלק מהסוד הרביעי. בערב מכבים את האור המרכזי, ומדליקים מנורת שולחן ליד הספה ומנורת עמידה בפינה. זוכרת ממפגש 4? אור חם, בסביבות 2700K, בשני גבהים שונים.',cls:'s11-wide',
   opts:[['top','אור מהתקרה',roomSvg(b,'l0')],['layer','אור בשני גבהים',roomSvg(Object.assign({lamps:1},b),'l1')]]})}},

/* יחידה 3: רגע WOW */
{id:'steps',title:'שדרוג בשלושה צעדים',task:'הזיזי את המחוון עד "צעד 3", או לחצי על הכפתורים.',wide:true,
 text:'רגע WOW. אותו סלון, אותם רהיטים, ובלי שיפוץ. הזיזי את המחוון וראי איך כל צעד משנה את החדר.',
 mount(el,ctx){const d=ctx.data;const res=h('div');
  const box=h('div',{class:'s3-draw s5-fin s11-wide'},...STEPS.map((s,i)=>h('div',{class:'lay'+((d.v||0)===i?' on':''),'data-i':i},h('img',{src:'assets/img/s11-step'+(i+1)+'.jpg',alt:STEP_ALT[i],decoding:'async',style:'width:100%;height:100%;object-fit:cover;display:block'}))),aiTag());
  const r=h('input',{type:'range',min:0,max:3,step:1,value:d.v||0,dir:'rtl','aria-label':'הזיזי בין לפני לבין צעד 3',class:'s11-range'});
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':'הצעדים'},...STEPS.map((s,i)=>h('button',{type:'button','aria-pressed':String((d.v||0)===i),onclick:()=>set(i)},s.t)));
  function set(i){i=+i;d.v=i;if(i===3)d.done=1;ctx.save();r.value=i;box.querySelectorAll('.lay').forEach(l=>l.classList.toggle('on',+l.dataset.i===i));btns.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));sayBox(res,STEPS[i].b);if(d.done)ctx.done()}
  r.addEventListener('input',()=>set(r.value));
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,r,btns),copy('רגע WOW','שדרוג בשלושה צעדים','רגע WOW. אותו סלון, אותם רהיטים, ובלי שיפוץ. הזיזי את המחוון וראי איך כל צעד משנה את החדר.',res)));
  sayBox(res,STEPS[d.v||0].b);
  return gate(ctx,!!d.done);
 }},

{id:'declutter',title:'שלושה על השידה',task:'בחרי בדיוק שלושה חפצים שיישארו על השידה.',wide:true,
 text:'השידה בכניסה היא הדבר הראשון שאורחים רואים. מעצבות משאירות עליה רק שלושה חפצים אהובים, והשאר עובר למגירה.',
 mount(el,ctx){const k=ctx.data.k||(ctx.data.k=[]);const res=h('div');const box=h('div',{class:'s3-draw s11-wide'});const wrap=h('div');
  function draw(){box.innerHTML=consoleSvg(k.length?k:CKEYS);box.append(illus());
   wrap.replaceChildren(h('div',{class:'chips sm s11-items',role:'group','aria-label':'החפצים'},...CKEYS.map(o=>h('button',{type:'button','aria-pressed':String(k.includes(o)),onclick:()=>tog(o)},CONS[o][0]))));
   if(k.length===3){sayBox(res,'<b>שקט בעיניים.</b> שלושה חפצים, וכל אחד מהם נראה.');ctx.done()}}
  function tog(o){const i=k.indexOf(o);if(i>=0)k.splice(i,1);else{if(k.length>=3){sayBox(res,'כבר בחרת שלושה. הורידי אחד, ורק אז הוסיפי.');return}k.push(o)}ctx.save();res.replaceChildren();draw()}
  draw();
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),copy('פחות זה יותר','שלושה על השידה','השידה בכניסה היא הדבר הראשון שאורחים רואים. מעצבות משאירות עליה רק שלושה חפצים אהובים, והשאר עובר למגירה.',wrap,res)));
  return gate(ctx,k.length===3);
 }},

{id:'myup',title:'השדרוג שלך',task:'בחרי שלושה צעדים וגוון לקיר.',wide:true,
 text:'בעלי וילה בהרצליה פיתוח רוצים לרענן את הסלון לפני חג, בלי שיפוץ, ויש זמן לשלושה צעדים בלבד. את המעצבת.',
 mount(el,ctx){const k=ctx.data.k||(ctx.data.k={picks:[]});const res=h('div');const box=h('div',{class:'s3-draw s11-wide'});const ctr=h('div',{class:'s3-side'});
  const ok=()=>k.picks.length===3&&k.wall;
  function draw(){box.innerHTML=roomSvg(upState(k),'my');box.append(illus());
   ctr.replaceChildren(h('b',{class:'s11-lbl'},'שלושה צעדים'),h('div',{class:'chips sm s11-items',role:'group','aria-label':'הצעדים'},...HKEYS.map(x=>h('button',{type:'button','aria-pressed':String(k.picks.includes(x)),onclick:()=>tog(x)},HACKS[x]))),
    chipRow('הקיר',Object.keys(WALLS).map(w=>[w,WALLS[w][0]]),k.wall,w=>{k.wall=w;ctx.save();draw()}),h('div',{class:'row s11-save'},h('span',{class:'note'},'נבחרו '+k.picks.length+' מתוך 3'),saveBtn),res);
   if(ok()){ctx.done();saveBtn.hidden=false}}
  function tog(x){const i=k.picks.indexOf(x);if(i>=0)k.picks.splice(i,1);else{if(k.picks.length>=3){sayBox(res,'יש זמן לשלושה צעדים. הורידי אחד, ורק אז הוסיפי.');return}k.picks.push(x)}ctx.save();draw()}
  const saveBtn=h('button',{class:'cta',type:'button',hidden:true,onclick:()=>{const kk=JSON.parse(JSON.stringify(k));const text=upText(kk);
   const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='upgrade11'&&n.session===11);
   if(old){old.k=kk;old.text=text;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:'upgrade11',svg:true,title:'השדרוג שלי בהרצליה פיתוח',k:kk,text});
   ctx.save();sayBox(res,'<b>נשמר במחברת שלך.</b>')}},'שמרי במחברת');
  el.append(head('המשימה','השדרוג שלך','בעלי וילה בהרצליה פיתוח רוצים לרענן את הסלון לפני חג, בלי שיפוץ, ויש זמן לשלושה צעדים בלבד. את המעצבת.'),
   h('div',{class:'s3-simwrap s11-wrap'},h('div',{class:'s3-simcol'},box),ctr));
  draw();
  return gate(ctx,!!ok());
 }},

/* יחידה 4: בדיקה */
{id:'check1',title:'בדיקה 1',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('איפה מעמידים את הספה בסלון של מעצבת?',[['מעט פנימה, סביב שטיח'],['צמוד לקיר'],['באמצע השביל']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 1',lede:'ארבע שאלות קצרות על מה שראית היום.',q:'איפה מעמידים את הספה בסלון של מעצבת?',visual:drawBox(planSvg(true),'s11-wide'),
  opts:[['מעט פנימה, סביב שטיח',1],['צמוד לקיר',0],['באמצע השביל',0]],hint:'היזכרי ברהיטים הצפים.',right:'<b>נכון.</b> פינת שיחה במרכז, ושביל מאחור.'})}},

{id:'check2',title:'בדיקה 2',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('למה תולים מראה מול החלון?',[['כדי להחזיר אור וירוק אל החדר'],['כדי להסתיר את החלון'],['כדי לראות את הטלוויזיה']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 2',q:'למה תולים מראה מול החלון?',visual:drawBox(roomSvg({float:1,clear:1,curtain:1,mirror:1},'q2'),'s11-wide'),
  opts:[['כדי להחזיר אור וירוק אל החדר',1],['כדי להסתיר את החלון',0],['כדי לראות את הטלוויזיה',0]],hint:'חשבי על השמש והגינה.',right:'<b>נכון.</b> המראה מכניסה את החוץ פנימה.'})}},

{id:'check3',title:'בדיקה 3',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('ממה הייתה עשויה המראה המצרית?',[['נחושת מלוטשת'],['זכוכית'],['עץ צבוע']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 3',q:'ממה הייתה עשויה המראה המצרית?',visual:drawBox(mirrorSvg(false),'s11-wide'),
  opts:[['נחושת מלוטשת',1],['זכוכית',0],['עץ צבוע',0]],hint:'היזכרי ברגע ההיסטורי.',right:'<b>נכון.</b> דיסק של נחושת, מלוטש עד שהבריק.'})}},

{id:'check4',title:'בדיקה 4',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('כמה חפצים משאירים על השידה בכניסה?',[['שלושה אהובים'],['את כל מה שיש'],['אף אחד']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 4',q:'כמה חפצים משאירים על השידה בכניסה?',visual:drawBox(consoleSvg(['lamp','vase','books']),'s11-wide'),
  opts:[['שלושה אהובים',1],['את כל מה שיש',0],['אף אחד',0]],hint:'היזכרי בשידה ובשקט בעיניים.',right:nameFill('<b>נכון.</b> והשאר במגירה. <b>ארבע מתוך ארבע, {name}.</b>')})}},

/* יחידה 5 */
{id:'home-idea',title:'רעיון לבית',task:'אם תרצי, כתבי איזו פינה תשדרגי ושמרי במחברת.',
 text:'רעיון לבית, למי שרוצה. בחרי פינה אחת: שידת הכניסה, פינת הקריאה או פינה בסלון. צלמי אותה בטלפון. נסי שני סודות, למשל שלושה חפצים בלבד ומנורה חמה, וצלמי שוב.',
 mount(el,ctx){ideaScreen(el,ctx,{n:11,media:h('div',{class:'s6-ideaimg',html:consoleSvg(['lamp','plant','photo'])}),field:'הפינה שאשדרג, ומה אעשה בה',
  text:'רעיון לבית, למי שרוצה. בחרי פינה אחת: שידת הכניסה, פינת הקריאה או פינה בסלון. צלמי אותה בטלפון. נסי שני סודות, למשל שלושה חפצים בלבד ומנורה חמה, וצלמי שוב.'})}},

{id:'summary',title:'סיכום',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',
 mount(el,ctx){const th=html=>()=>h('span',{class:'s3-draw thumb',html});
  return flips(el,ctx,{kicker:'סיכום',title:'ארבעה כללים',lede:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',cls:'s3-flips',toggle:true,
   cards:[{t:'רהיטים צפים',front:th(planSvg(true)),b:'ספה סביב שטיח, ושביל פנוי מאחור.'},
    {t:'טקסטיל',front:th(roomSvg({float:1,clear:1,curtain:1,cush:1},'su2')),b:'וילון מהתקרה, וכריות בשלושה מרקמים.'},
    {t:'קיר אחד',front:th(roomSvg({wall:'night',float:1,clear:1,curtain:1,cush:1},'su3')),b:'גוון עמוק או טיח, רק על קיר אחד.'},
    {t:'אור ומראה',front:th(roomSvg(STEPS[3].st,'su4')),b:'מראה מול החלון, ואור חם בשני גבהים.'}]});
 }},

{id:'audio',title:'סקירה קולית',task:'לחצי על הנגן כדי לשמוע.',skip:()=>!audioOK,
 text:'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.',
 mount(el,ctx){audioScreen(el,ctx,11)}},

{id:'feedback',title:'משוב וגשר',task:'דרגי בלחיצה, ואם תרצי, כתבי גם כמה מילים.',wide:true,hideNext:true,
 say:'{name}, סיימת את מפגש 11. הזזת ספה, צבעת קיר, תלית מראה ושדרגת סלון שלם בשלושה צעדים. ספרי איך היה. כל מילה עוזרת לבנות את המפגש האחרון.',
 mount(el,ctx){feedbackScreen(el,ctx,{n:11,open:'{name}, סיימת את מפגש 11. הזזת ספה, צבעת קיר, תלית מראה ושדרגת סלון שלם בשלושה צעדים. ספרי איך היה. כל מילה עוזרת לבנות את המפגש האחרון.',
  extra:{q:'איזה סוד הכי שימושי בעינייך?',opts:['רהיטים צפים','טקסטיל','קיר אחד','אור ומראה'],show:'הסוד השימושי',why:'למה? (לא חובה)'},
  bridgeMedia:drawBox(roomSvg(STEPS[3].st,'br'),'s7-bridge'),
  bridge:'במפגש האחרון: הבית האידיאלי שלך. תבני לוח השראה אישי מכל מה שלמדת, ותקבלי תעודת סיום.'})}}
];

window.Salon.register(11,screens);
})();
