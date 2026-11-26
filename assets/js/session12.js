/* הסלון של מזל · מפגש 12: הבית האידיאלי שלי
   בלוק נתונים ורכיבים של המפגש. לא נוגע במנוע ולא במפגשים 1 עד 11. */
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
let audioOK=false;
fetch('assets/audio/s12.m4a',{method:'HEAD'}).then(r=>{audioOK=r.ok}).catch(()=>{});

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

/* ---------- נתוני הלוח ---------- */
const WORDS=['חמימות','אור','טבע','אלגנטיות','שקט','אמנות','זוהר','נוסטלגיה','ים','משפחה','אירוח','פשטות'];
const PAL={base:[['cream','שמנת','#F2E6CF'],['stone','אבן','#E4D3B0'],['white','לבן חם','#F7F1E6'],['grey','אפור חם','#CFC6B8']],
 second:[['oak','עץ אלון','#C69C6A'],['terra','טרקוטה','#C65A3C'],['sage','ירוק מרווה','#9DB39A'],['petrol','ירוק נפט','#14474A']],
 accent:[['navy','כחול עמוק','#1F3A68'],['olive','ירוק זית','#6F7A4A'],['mustard','חרדל','#E0A63A'],['brass','פליז','#C9A24B']]};
const palOf=(g,k)=>(PAL[g].find(x=>x[0]===k)||PAL[g][0]);
const MAT={wood:['עץ',`<rect width="100" height="100" fill="#C69C6A"/>${[12,30,52,70,88].map((y,i)=>`<path d="M0 ${y} q50 ${i%2?8:-8} 100 0" stroke="#A97C4C" stroke-width="3" fill="none"/>`).join('')}`],
 marble:['שיש',`<rect width="100" height="100" fill="#EFEDE8"/><path d="M0 30 q30 10 50 -6 t50 20 M10 100 q20 -40 60 -50 M40 0 q-10 30 20 50" stroke="#B8B4AC" stroke-width="2.5" fill="none"/>`],
 linen:['פשתן',`<rect width="100" height="100" fill="#E3D5BC"/>${[...Array(12)].map((_,i)=>`<path d="M0 ${i*9} H100 M${i*9} 0 V100" stroke="#CDBC9E" stroke-width="1.5"/>`).join('')}`],
 velvet:['קטיפה',`<defs><radialGradient id="vlv"><stop offset="0" stop-color="#3E7A6E"/><stop offset="1" stop-color="#1F4B44"/></radialGradient></defs><rect width="100" height="100" fill="url(#vlv)"/>`],
 brass:['פליז',`<defs><linearGradient id="brs" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#F1D88E"/><stop offset=".5" stop-color="#C9A24B"/><stop offset="1" stop-color="#8E6E2A"/></linearGradient></defs><rect width="100" height="100" fill="url(#brs)"/>`],
 stone:['אבן ירושלמית',`<rect width="100" height="100" fill="#E4D3B0"/>${[...Array(18)].map((_,i)=>`<circle cx="${(i*37)%100}" cy="${(i*53)%100}" r="${1.5+(i%3)}" fill="#CDB68A"/>`).join('')}`],
 rattan:['קש',`<rect width="100" height="100" fill="#D9B77E"/>${[...Array(7)].map((_,r)=>[...Array(7)].map((_,c)=>`<circle cx="${c*16+(r%2)*8}" cy="${r*16}" r="5" fill="none" stroke="#A9864E" stroke-width="2"/>`).join('')).join('')}`]};
const MKEYS=Object.keys(MAT);
const ANC={seat:{t:'ישיבה',o:[['round','ספה מעוגלת'],['velvet','כורסת קטיפה'],['linen','ספת פשתן']]},
 light:{t:'אור',o:[['chand','נברשת פליז'],['sculpt','מנורה שהיא פסל'],['cove','אור נסתר בתקרה']]},
 view:{t:'מבט',o:[['garden','חלון לגינה'],['gallery','קיר גלריה'],['pool','בריכת השתקפות']]},
 heart:{t:'לב הבית',o:[['island','אי מטבח'],['nook','פינת קריאה'],['table','שולחן לשמונה']]}};
function ancArt(g,k,acc){const a=acc||C.mustard;switch(g+':'+k){
 case 'seat:round':return `<path d="M20 70 q0 -36 40 -36 h80 q40 0 40 36 v14 H20z" fill="${C.sage}"/><rect x="26" y="84" width="148" height="8" rx="4" fill="${shade(C.sage,-.3)}"/>`;
 case 'seat:velvet':return `<path d="M60 30 q40 -14 80 0 v40 h10 v24 H50 V70 h10z" fill="#2F6B60"/><rect x="66" y="64" width="68" height="14" rx="6" fill="#3E7A6E"/>`;
 case 'seat:linen':return `<rect x="24" y="36" width="152" height="30" rx="10" fill="#E3D5BC"/><rect x="16" y="56" width="168" height="30" rx="10" fill="#D6C5A6"/><rect x="40" y="44" width="30" height="20" rx="6" fill="${a}"/>`;
 case 'light:chand':return `<path d="M100 0 v24" stroke="#555" stroke-width="2"/><ellipse cx="100" cy="40" rx="50" ry="10" fill="${C.brass}"/>${[60,80,100,120,140].map(x=>`<rect x="${x-3}" y="40" width="6" height="18" fill="${C.brass}"/><circle cx="${x}" cy="62" r="6" fill="#FFE7B0"/>`).join('')}`;
 case 'light:sculpt':return `<circle cx="100" cy="44" r="34" fill="#FFE7B0" opacity=".5"/><path d="M76 44 a24 24 0 0 1 48 0z" fill="${C.terra}"/><path d="M100 44 q-16 30 0 46" stroke="${C.ink}" stroke-width="4" fill="none"/><rect x="80" y="90" width="40" height="6" fill="${C.ink}"/>`;
 case 'light:cove':return `<rect x="10" y="10" width="180" height="12" fill="#F6F0E4"/><rect x="10" y="22" width="180" height="22" fill="#FFE7B0" opacity=".7"/><rect x="10" y="44" width="180" height="50" fill="#EFE6D6"/>`;
 case 'view:garden':return `<rect x="40" y="10" width="120" height="84" fill="#BFE0EC"/><path d="M40 70 q60 -30 120 0 V94 H40z" fill="${C.sage}"/><circle cx="80" cy="56" r="14" fill="#6F9A5A"/><rect x="36" y="6" width="128" height="92" fill="none" stroke="#FFF" stroke-width="6"/>`;
 case 'view:gallery':return `<rect x="30" y="14" width="50" height="40" fill="${C.brass}"/><rect x="36" y="20" width="38" height="28" fill="${C.terra}"/><rect x="90" y="10" width="40" height="56" fill="${C.ink}"/><rect x="95" y="15" width="30" height="46" fill="${a}"/><rect x="140" y="20" width="36" height="36" fill="${C.brass}"/><rect x="145" y="25" width="26" height="26" fill="${C.sage}"/><rect x="40" y="62" width="40" height="30" fill="${C.ink}"/><rect x="45" y="67" width="30" height="20" fill="#F4ECDD"/>`;
 case 'view:pool':return `<rect x="10" y="10" width="180" height="50" fill="#BFE0EC"/><circle cx="150" cy="30" r="12" fill="#FFE2A6"/><rect x="10" y="60" width="180" height="34" fill="#6FA8B8"/><circle cx="150" cy="76" r="10" fill="#FFE2A6" opacity=".6"/><path d="M20 72 h40 M80 84 h50" stroke="#DDEFF4" stroke-width="3"/>`;
 case 'heart:island':return `<rect x="30" y="50" width="140" height="40" fill="${C.oak}"/><rect x="24" y="42" width="152" height="10" fill="#EFEDE8"/><path d="M60 0 v20 M140 0 v20" stroke="#555" stroke-width="2"/><path d="M48 20 h24 l-4 12 h-16z M128 20 h24 l-4 12 h-16z" fill="${C.brass}"/>`;
 case 'heart:nook':return `<path d="M40 40 q30 -20 60 0 v30 h8 v20 H32 V70 h8z" fill="${C.terra}"/><rect x="128" y="20" width="4" height="70" fill="${C.ink}"/><path d="M114 20 h32 l-6 -14 h-20z" fill="${C.cream}"/><rect x="150" y="50" width="34" height="40" fill="${C.oak}"/>`;
 case 'heart:table':return `<rect x="30" y="50" width="140" height="10" fill="${C.wood}"/><rect x="40" y="60" width="6" height="34" fill="${C.wood}"/><rect x="154" y="60" width="6" height="34" fill="${C.wood}"/>${[40,70,100,130,160].map(x=>`<circle cx="${x}" cy="44" r="5" fill="#F7F1E6"/>`).join('')}<path d="M100 0 v24" stroke="#555" stroke-width="2"/><path d="M84 24 h32 l-6 10 h-20z" fill="${a}"/>`;
 }return ''}
/* הרכבת הלוח */
function boardData(all){const w=(all.words||{}).w||[];const p=(all.palette||{}).p||{};const m=(all.mats||{}).m||[];const a=(all.anchors||{}).a||{};const nm=(all.board||{}).name||'';
 return {w,p,m,a,nm}}
function boardReady(b){return b.w.length===3&&b.p.base&&b.p.second&&b.p.accent&&b.m.length>=2&&['seat','light','view','heart'].every(g=>b.a[g])}
function boardSvg(b,id,exp){const base=palOf('base',b.p.base)[2],sec=palOf('second',b.p.second)[2],acc=palOf('accent',b.p.accent)[2];
 const f='font-family="Assistant, Arial, sans-serif"';
 const tile=(x,y,inner,lbl)=>`<g transform="translate(${x} ${y})"><rect width="200" height="128" rx="10" fill="#FFF" opacity=".92"/><g transform="translate(0 6)">${inner}</g>${lbl?`<text x="100" y="122" ${f} font-size="15" font-weight="700" fill="${C.ink}" text-anchor="middle" direction="rtl">${lbl}</text>`:''}</g>`;
 const groups=['seat','light','view','heart'];const pos=[[424,96],[214,96],[424,236],[214,236]];
 return `<svg viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg" ${exp?'width="1280" height="840"':'aria-hidden="true" preserveAspectRatio="xMidYMid meet"'}><defs>${MKEYS.map(k=>`<pattern id="pt${k}${id}" width="100" height="100" patternUnits="userSpaceOnUse">${MAT[k][1].replace(/id="(vlv|brs)"/g,'id="$1'+id+'"').replace(/url\(#(vlv|brs)\)/g,'url(#$1'+id+')')}</pattern>`).join('')}</defs>
  <rect width="640" height="420" fill="${base}"/><rect x="0" y="0" width="640" height="84" fill="${sec}" opacity=".9"/>
  <text x="620" y="40" ${f} font-size="30" font-weight="800" fill="#FFF" text-anchor="start" direction="rtl">${(b.nm||'הבית האידיאלי שלי').replace(/[<&]/g,'')}</text>
  <text x="620" y="70" ${f} font-size="20" font-weight="700" fill="#FFF" text-anchor="start" direction="rtl">${b.w.join(' · ')}</text>
  <rect x="24" y="22" width="96" height="40" rx="8" fill="${base}"/><rect x="120" y="22" width="48" height="40" fill="${sec}" stroke="#FFF" stroke-width="2"/><rect x="168" y="22" width="16" height="40" rx="4" fill="${acc}" stroke="#FFF" stroke-width="2"/>
  ${groups.map((g,i)=>{const k=b.a[g];const o=ANC[g].o.find(x=>x[0]===k);return k?tile(pos[i][0],pos[i][1],ancArt(g,k,acc),o?o[1]:''):''}).join('')}
  ${b.m.slice(0,3).map((k,i)=>`<g transform="translate(${74} ${92+i*94})"><circle cx="40" cy="36" r="34" fill="url(#pt${k}${id})" stroke="#FFF" stroke-width="4"/><text x="40" y="88" ${f} font-size="15" font-weight="700" fill="${C.ink}" text-anchor="middle" direction="rtl">${MAT[k][0]}</text></g>`).join('')}
  <rect x="30" y="392" width="580" height="10" rx="5" fill="${acc}"/></svg>`}
function svgToPng(svgStr,name,cb){const img=new Image();const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgStr);
 img.onload=()=>{try{const c=document.createElement('canvas');c.width=img.width||1280;c.height=img.height||840;const g=c.getContext('2d');g.drawImage(img,0,0,c.width,c.height);
  c.toBlob(bl=>{if(!bl){cb&&cb(false);return}const a=h('a',{href:URL.createObjectURL(bl),download:name});document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);cb&&cb(true)},'image/png')}catch(e){cb&&cb(false)}};
 img.onerror=()=>cb&&cb(false);img.src=url}
function printNode(node){const wrap=h('div',{class:'s12-print'},node);document.body.append(wrap);document.body.classList.add('s12-printing');
 const done=()=>{document.body.classList.remove('s12-printing');wrap.remove();window.removeEventListener('afterprint',done)};window.addEventListener('afterprint',done);
 setTimeout(()=>{try{window.print()}catch(e){done()}},120)}
function certNode(name){const d=new Date();const ds=d.getDate()+'.'+(d.getMonth()+1)+'.'+d.getFullYear();
 return h('div',{class:'s12-cert'},h('img',{src:'assets/img/logo-full.png',alt:'סמל הקורס הסלון של מזל',class:'s12-certlogo'}),h('span',{class:'kicker'},'הסלון של מזל'),h('h2',null,'תעודת סיום'),
  h('p',{class:'s12-certname'},name||''),h('p',null,(name?'סיימה':'סיום')+' מסע של 12 מפגשים בעולם הווילות ובתי היוקרה: עיצוב, היסטוריה, חומרים, אור ותרבות.'),h('p',{class:'note'},ds))}
const prevDraw=window.Salon.drawNote;
window.Salon.drawNote=function(it){if(it.kind==='board12'&&it.b){return h('div',{class:'s3-nb',html:boardSvg(it.b,'nb'+it.ts)})}return prevDraw?prevDraw(it):null};

const JOURNEY=[[1,'מבית לחלל חלומות','שביל פנוי, קו מבט ומוקד עניין.'],[2,'קפלים בזמן','קלאסי, אר-דקו ובאוהאוס: לכל תקופה שפה משלה.'],[3,'וילות יוקרה בישראל','שמש וצל, אבן ירושלמית ומשרבייה.'],
 [4,'אור ואווירה','אור בשלוש שכבות, ואור חם בסלון.'],[5,'סוד הצבעים והחומרים','כלל 60-30-10, ומרקם במקום דוגמה.'],[6,'המטבח וחללי האירוח','משולש עבודה, ומעבר רחב סביב האי.'],
 [7,'הלבשת הבית ואמנות','שכבות טקסטיל, ותמונה בגובה העיניים.'],[8,'הבית והטבע','החוץ נכנס פנימה: פטיו, מים וחומרים חיים.'],[9,'הבית החכם','הטכנולוגיה נעלמת, ולחיצה אחת עושה הרבה.'],
 [10,'סיור במוזיאוני עיצוב','בוחרים מעט, ונותנים לכל חפץ מרווח.'],[11,'סודות המעצבים','שלושה צעדים, בלי לשבור אף קיר.']];
const DEMO={w:['חמימות','אור','טבע'],p:{base:'cream',second:'oak',accent:'olive'},m:['wood','linen','stone'],a:{seat:'round',light:'chand',view:'garden',heart:'island'},nm:''};

const screens=[

/* יחידה 1 */
{id:'open',title:'הבית האידיאלי שלי',hideNext:true,
 text:'ברוכה השבה, {name}, למפגש האחרון. אחד-עשר מפגשים טיילת בין וילות, תקופות ומוזיאונים. היום כל מה שאספת הופך לזהות עיצובית אחת: לוח השראה של הבית האידיאלי שלך. ובסוף מחכה לך תעודה.',
 mount(el,ctx){
  const box=drawBox(boardSvg(DEMO,'hero'),'s12-wide');
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
    h('div',{class:'copy'},h('span',{class:'kicker'},'מפגש 12'),h('h1',null,'הבית האידיאלי שלי'),
      h('p',{class:'lede'},nameFill('ברוכה השבה, {name}, למפגש האחרון. אחד-עשר מפגשים טיילת בין וילות, תקופות ומוזיאונים. היום כל מה שאספת הופך לזהות עיצובית אחת: לוח השראה של הבית האידיאלי שלך. ובסוף מחכה לך תעודה.')),
      h('button',{class:'cta',type:'button',onclick:ctx.next,html:'בואי נתחיל'+window.Salon.ICON.arrowL}))));
 }},

{id:'journey',title:'המסע עד כאן',task:'לחצי על לפחות ארבעה מפגשים כדי להיזכר.',wide:true,
 text:'לפני שבונים, מסתכלים אחורה. כל מפגש השאיר כלל אחד קטן. לחצי על מפגשים, ותיזכרי.',
 mount(el,ctx){const seen=ctx.data.seen||(ctx.data.seen={});const res=h('div');
  const grid=h('div',{class:'s12-journey'},...JOURNEY.map(([n,t,r])=>{const b=h('button',{type:'button',class:'s12-jn'+(seen[n]?' on':'')},h('span',{class:'num'},String(n)),h('span',{class:'t'},t));
   b.addEventListener('click',()=>{seen[n]=1;ctx.save();b.classList.add('on');sayBox(res,'<b>מפגש '+n+'.</b> '+r);if(Object.keys(seen).length>=4)ctx.done()});return b}));
  el.append(head('המסע','המסע עד כאן','לפני שבונים, מסתכלים אחורה. כל מפגש השאיר כלל אחד קטן. לחצי על מפגשים, ותיזכרי.'),grid,res);
  return gate(ctx,Object.keys(seen).length>=4);
 }},

{id:'vitruvius',title:'רגע היסטורי: שלוש התכונות',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'רגע היסטורי. לפני כאלפיים שנה כתב האדריכל הרומי ויטרוביוס את הספר היחיד על אדריכלות ששרד מהעולם העתיק. לפיו, לכל בניין טוב יש שלוש תכונות. זה גם המתכון לבית האידיאלי.',
 mount(el,ctx){return flips(el,ctx,{kicker:'רגע היסטורי',title:'שלוש התכונות של ויטרוביוס',lede:'רגע היסטורי. לפני כאלפיים שנה כתב האדריכל הרומי ויטרוביוס את הספר היחיד על אדריכלות ששרד מהעולם העתיק. לפיו, לכל בניין טוב יש שלוש תכונות. זה גם המתכון לבית האידיאלי.',cls:'s3-secrets s9-three',
  cards:[{t:'חוזק (Firmitas)',b:'בית שעומד יציב, מחומרים טובים.'},{t:'תועלת (Utilitas)',b:'בית שנוח לחיות בו, בכל יום.'},{t:'יופי (Venustas)',b:'בית שמשמח את העין ואת הלב.'}]})}},

{id:'steps',title:'ארבעה שלבים ללוח',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'מעצבות מתחילות כל בית בלוח השראה (Moodboard): תמונות, צבעים וחומרים על לוח אחד, שמראים במבט אחד איך הבית ירגיש. בונים אותו בארבעה שלבים.',
 mount(el,ctx){return flips(el,ctx,{kicker:'לוח השראה',title:'ארבעה שלבים ללוח',lede:'מעצבות מתחילות כל בית בלוח השראה (Moodboard): תמונות, צבעים וחומרים על לוח אחד, שמראים במבט אחד איך הבית ירגיש. בונים אותו בארבעה שלבים.',
  cards:[{t:'שלב 1',b:'שלוש מילים לתחושה.'},{t:'שלב 2',b:'צבעים לפי 60-30-10.'},{t:'שלב 3',b:'שניים או שלושה חומרים.'},{t:'שלב 4',b:'ארבעה פריטי עוגן.'}]})}},

/* יחידה 2: בונים את הלוח */
{id:'words',title:'שלב 1: שלוש מילים',task:'בחרי בדיוק שלוש מילים.',wide:true,
 text:'לפני שבוחרים צבע או רהיט, מחליטים מה הבית ירגיש. בחרי שלוש מילים שמתארות את הבית האידיאלי שלך.',
 mount(el,ctx){const w=ctx.data.w||(ctx.data.w=[]);const res=h('div');const wrap=h('div');
  function draw(){wrap.replaceChildren(h('div',{class:'chips s12-words',role:'group','aria-label':'המילים'},...WORDS.map(x=>h('button',{type:'button','aria-pressed':String(w.includes(x)),onclick:()=>tog(x)},x))),h('p',{class:'s12-big'},w.length?w.join(' · '):' '));
   if(w.length===3){sayBox(res,'<b>זו התחושה של הבית שלך.</b>');ctx.done()}}
  function tog(x){const i=w.indexOf(x);if(i>=0)w.splice(i,1);else{if(w.length>=3){sayBox(res,'שלוש מילים בדיוק. הורידי אחת, ורק אז הוסיפי.');return}w.push(x)}ctx.save();res.replaceChildren();draw()}
  el.append(head('שלב 1','שלוש מילים','לפני שבוחרים צבע או רהיט, מחליטים מה הבית ירגיש. בחרי שלוש מילים שמתארות את הבית האידיאלי שלך.'),wrap,res);draw();
  return gate(ctx,w.length===3);
 }},

{id:'palette',title:'שלב 2: הצבעים',task:'בחרי צבע שולט, צבע תומך וצבע דגש.',wide:true,
 text:'זוכרת את כלל 60-30-10 ממפגש 5? צבע אחד שולט, צבע שני תומך, וצבע שלישי נותן ניצוץ. בחרי את שלושת הצבעים של הבית שלך.',
 mount(el,ctx){const p=ctx.data.p||(ctx.data.p={});const box=h('div',{class:'s12-pal'});const ctr=h('div',{class:'s3-side'});
  const ok=()=>p.base&&p.second&&p.accent;
  function draw(){const b=palOf('base',p.base)[2],s=palOf('second',p.second)[2],a=palOf('accent',p.accent)[2];
   box.replaceChildren(h('div',{style:`flex:60;background:${p.base?b:'#EEE'}`},'60%'),h('div',{style:`flex:30;background:${p.second?s:'#DDD'}`},'30%'),h('div',{style:`flex:10;background:${p.accent?a:'#CCC'}`},'10%'));
   ctr.replaceChildren(chipRow('שולט 60%',PAL.base.map(x=>[x[0],x[1]]),p.base,k=>{p.base=k;ctx.save();draw()}),chipRow('תומך 30%',PAL.second.map(x=>[x[0],x[1]]),p.second,k=>{p.second=k;ctx.save();draw()}),chipRow('דגש 10%',PAL.accent.map(x=>[x[0],x[1]]),p.accent,k=>{p.accent=k;ctx.save();draw()}));
   if(ok())ctx.done()}
  el.append(head('שלב 2','הצבעים','זוכרת את כלל 60-30-10 ממפגש 5? צבע אחד שולט, צבע שני תומך, וצבע שלישי נותן ניצוץ. בחרי את שלושת הצבעים של הבית שלך.'),h('div',{class:'s3-simwrap s12-wrap'},h('div',{class:'s3-simcol'},box),ctr));draw();
  return gate(ctx,!!ok());
 }},

{id:'mats',title:'שלב 3: החומרים',task:'בחרי שניים או שלושה חומרים.',wide:true,
 text:'חומר מוסיף לבית מרקם, מה שהעין רואה והיד מרגישה. בחרי שניים או שלושה חומרים שתרצי לגעת בהם בכל יום.',
 mount(el,ctx){const m=ctx.data.m||(ctx.data.m=[]);const res=h('div');const wrap=h('div',{class:'s12-mats'});
  function draw(){wrap.replaceChildren(...MKEYS.map(k=>h('button',{type:'button',class:'s12-mat','aria-pressed':String(m.includes(k)),onclick:()=>tog(k)},h('span',{class:'sw',html:svg('0 0 100 100',MAT[k][1].replace(/id="(vlv|brs)"/g,'id="$1m'+k+'"').replace(/url\(#(vlv|brs)\)/g,'url(#$1m'+k+')'))}),h('span',{class:'nm'},MAT[k][0]))));
   if(m.length>=2)ctx.done()}
  function tog(k){const i=m.indexOf(k);if(i>=0)m.splice(i,1);else{if(m.length>=3){sayBox(res,'עד שלושה חומרים. הורידי אחד, ורק אז הוסיפי.');return}m.push(k)}ctx.save();res.replaceChildren();draw();if(m.length>=2)sayBox(res,'<b>'+m.map(x=>MAT[x][0]).join(', ')+'.</b> שילוב יפה.')}
  el.append(head('שלב 3','החומרים','חומר מוסיף לבית מרקם, מה שהעין רואה והיד מרגישה. בחרי שניים או שלושה חומרים שתרצי לגעת בהם בכל יום.'),wrap,res);draw();
  return gate(ctx,m.length>=2);
 }},

{id:'anchors',title:'שלב 4: פריטי העוגן',task:'בחרי פריט אחד בכל שורה.',wide:true,
 text:'פריטי עוגן (Anchor Pieces) הם הפריטים שכל החדר נבנה סביבם. בחרי ארבעה: מקום לשבת, אור, מבט, ולב הבית.',
 mount(el,ctx){const a=ctx.data.a||(ctx.data.a={});const ctr=h('div',{class:'s12-anc'});
  const ok=()=>['seat','light','view','heart'].every(g=>a[g]);
  function draw(){ctr.replaceChildren(...Object.entries(ANC).map(([g,v])=>h('div',{class:'s12-ancrow'},h('b',null,v.t),...v.o.map(([k,t])=>h('button',{type:'button',class:'s12-anci','aria-pressed':String(a[g]===k),onclick:()=>{a[g]=k;ctx.save();draw()}},h('span',{class:'sw',html:svg('0 0 200 100',ancArt(g,k))}),h('span',{class:'nm'},t))))));
   if(ok())ctx.done()}
  el.append(head('שלב 4','פריטי העוגן','פריטי עוגן (Anchor Pieces) הם הפריטים שכל החדר נבנה סביבם. בחרי ארבעה: מקום לשבת, אור, מבט, ולב הבית.'),ctr);draw();
  return gate(ctx,!!ok());
 }},

{id:'board',title:'הלוח שלך',task:'תני שם לבית, ושמרי את הלוח במחברת.',wide:true,
 text:'רגע WOW. כל הבחירות שלך מתחברות ללוח אחד: הבית האידיאלי שלך, {name}. תני לו שם ושמרי אותו במחברת.',
 mount(el,ctx){const res=h('div');const b=boardData(ctx.all);
  if(!boardReady(b)){el.append(h('div',{class:'center'},h('div',null,h('h2',null,'הלוח שלך'),h('p',{class:'lede'},'הלוח עוד לא מוכן. חזרי אחורה והשלימי את ארבעת השלבים.'))));return gate(ctx,false)}
  const box=h('div',{class:'s3-draw s12-wide s12-board'});const draw=()=>{box.innerHTML=boardSvg(boardData(ctx.all),'bd');box.append(illus())};draw();
  setTimeout(()=>box.classList.add('on'),60);
  const inp=h('input',{id:'home12',type:'text',maxlength:40,value:ctx.data.name||'',placeholder:'למשל: הבית בין הזיתים'});
  inp.addEventListener('input',()=>{ctx.data.name=inp.value.trim();draw()});
  const save=()=>{const v=inp.value.trim();if(!v){inp.focus();return}ctx.data.name=v;ctx.data.saved=1;const bb=JSON.parse(JSON.stringify(boardData(ctx.all)));
   const text=v+'. '+bb.w.join(', ')+'.';const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='board12'&&n.session===12);
   if(old){old.b=bb;old.text=text;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:'board12',svg:true,title:'הבית האידיאלי שלי',b:bb,text});
   ctx.save();draw();sayBox(res,'<b>הלוח נשמר במחברת שלך.</b>');ctx.done()};
  const png=()=>svgToPng(boardSvg(boardData(ctx.all),'ex',true),'הבית-האידיאלי-שלי.png',ok=>sayBox(res,ok?'<b>התמונה נשמרה בתיקיית ההורדות.</b>':'לא הצלחתי לשמור תמונה. אפשר להדפיס במקום.'));
  const prn=()=>printNode(h('div',{class:'s12-pboard',html:boardSvg(boardData(ctx.all),'pr')}));
  el.append(h('div',{class:'split media s2-split s12-bsplit'},h('div',{class:'s2-media'},box),
   copy('רגע WOW','הלוח שלך',nameFill('רגע WOW. כל הבחירות שלך מתחברות ללוח אחד: הבית האידיאלי שלך, {name}. תני לו שם ושמרי אותו במחברת.'),
    h('div',{class:'field'},h('label',{for:'home12'},'שם הבית'),inp),
    h('div',{class:'row s12-more'},h('button',{class:'cta',type:'button',onclick:save},'שמרי במחברת'),h('button',{class:'btn',type:'button',onclick:png},'שמרי כתמונה'),h('button',{class:'btn',type:'button',onclick:prn},'הדפיסי')),res)));
  if(ctx.data.saved)sayBox(res,'<b>הלוח נשמר במחברת שלך.</b>');
  return gate(ctx,!!ctx.data.saved);
 }},

{id:'onestep',title:'צעד קטן אחד',task:'אם תרצי, כתבי צעד אחד ושמרי במחברת.',
 text:'לוח השראה הוא חלום, וצעד קטן הופך אותו לבית. איזה שינוי קטן אחד תעשי השבוע, בהשראת הקורס? למשל להחליף נורה לאור חם, או להשאיר שלושה חפצים על השידה.',
 mount(el,ctx){ideaScreen(el,ctx,{n:12,media:h('div',{class:'s6-ideaimg',html:boardSvg(boardReady(boardData(ctx.all))?boardData(ctx.all):DEMO,'os')}),field:'השינוי הקטן שלי השבוע',
  text:'לוח השראה הוא חלום, וצעד קטן הופך אותו לבית. איזה שינוי קטן אחד תעשי השבוע, בהשראת הקורס? למשל להחליף נורה לאור חם, או להשאיר שלושה חפצים על השידה.'});
  const k=el.querySelector('.kicker');if(k)k.textContent='כרטיס רשות';const t=el.querySelector('h2');if(t)t.textContent='צעד קטן אחד'}},

/* יחידה 3: בדיקה מסכמת */
{id:'check1',title:'בדיקה 1',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('בכלל 60-30-10, כמה מקום תופס צבע הדגש?',[['10 אחוזים'],['60 אחוזים'],['30 אחוזים']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 1',lede:'ארבע שאלות על כל המסע.',q:'בכלל 60-30-10, כמה מקום תופס צבע הדגש?',visual:drawBox(boardSvg(DEMO,'q1'),'s12-wide'),
  opts:[['10 אחוזים',1],['60 אחוזים',0],['30 אחוזים',0]],hint:'הדגש הוא הניצוץ הקטן.',right:'<b>נכון.</b> כריות, תמונה, נגיעה של פליז.'})}},

{id:'check2',title:'בדיקה 2',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('איזה אור מתאים לסלון בערב?',[['אור חם, בסביבות 2700K'],['אור יום, 5000K'],['אור אחד חזק מהתקרה']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 2',q:'איזה אור מתאים לסלון בערב?',visual:drawBox(svg('0 0 200 100',ancArt('light','chand')),'s12-wide'),
  opts:[['אור חם, בסביבות 2700K',1],['אור יום, 5000K',0],['אור אחד חזק מהתקרה',0]],hint:'היזכרי במפגש 4.',right:'<b>נכון.</b> מספר נמוך, אור צהבהב וחם.'})}},

{id:'check3',title:'בדיקה 3',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('באיזה גובה תולים את מרכז התמונה?',[['כ-145 ס"מ מהרצפה'],['צמוד לתקרה'],['כ-80 ס"מ מהרצפה']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 3',q:'באיזה גובה תולים את מרכז התמונה?',visual:drawBox(svg('0 0 200 100',ancArt('view','gallery')),'s12-wide'),
  opts:[['כ-145 ס"מ מהרצפה',1],['צמוד לתקרה',0],['כ-80 ס"מ מהרצפה',0]],hint:'היזכרי במפגש 7: בגובה העיניים.',right:'<b>נכון.</b> כמו בגלריה.'})}},

{id:'check4',title:'בדיקה 4',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('אילו שלוש תכונות נתן ויטרוביוס לבניין טוב?',[['חוזק, תועלת ויופי'],['גובה, רוחב ועומק'],['זהב, שיש ועץ']]),
 mount(el,ctx){return quiz(el,ctx,{kicker:'בדיקה 4',q:'אילו שלוש תכונות נתן ויטרוביוס לבניין טוב?',visual:drawBox(boardSvg(DEMO,'q4'),'s12-wide'),
  opts:[['חוזק, תועלת ויופי',1],['גובה, רוחב ועומק',0],['זהב, שיש ועץ',0]],hint:'היזכרי ברגע ההיסטורי של היום.',right:nameFill('<b>נכון.</b> המתכון לבית האידיאלי. <b>ארבע מתוך ארבע, {name}.</b>')})}},

/* יחידה 4: סיום */
{id:'cert',title:'תעודת סיום',task:'אם תרצי, הדפיסי את התעודה.',wide:true,
 text:'ברכות, {name}. סיימת את כל שנים-עשר המפגשים. הנה התעודה שלך.',
 mount(el,ctx){const res=h('div');const card=certNode(ctx.name);
  el.append(h('div',{class:'s12-certwrap'},card,h('div',{class:'row',style:'justify-content:center;margin-top:12px'},h('button',{class:'cta',type:'button',onclick:()=>printNode(certNode(ctx.name))},'הדפיסי את התעודה')),res));
  ctx.done();
 }},

{id:'summary',title:'ארגז הכלים',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'ארבעה כללים לכל החיים. ארגז הכלים של עין מעצבת, מכל שנים-עשר המפגשים.',
 mount(el,ctx){return flips(el,ctx,{kicker:'סיכום',title:'ארגז הכלים',lede:'ארבעה כללים לכל החיים. ארגז הכלים של עין מעצבת, מכל שנים-עשר המפגשים.',toggle:true,
  cards:[{t:'אור',b:'בשלוש שכבות, וחם בערב.'},{t:'צבע',b:'60-30-10, ומרקם במקום דוגמה.'},{t:'מרווח',b:'מעט חפצים, ושביל פנוי.'},{t:'טבע',b:'ירוק, מים ואור יום בתוך הבית.'}]})}},

{id:'audio',title:'סקירה קולית',task:'לחצי על הנגן כדי לשמוע.',skip:()=>!audioOK,
 text:'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.',
 mount(el,ctx){audioScreen(el,ctx,12)}},

{id:'feedback',title:'משוב על כל המסע',task:'דרגי בלחיצה, ואם תרצי, כתבי גם כמה מילים.',wide:true,hideNext:true,
 say:'{name}, סיימת את כל הקורס. בנית לוח השראה, קיבלת תעודה, ועברת שנים-עשר מפגשים. ספרי איך היה המסע כולו. כל מילה חשובה.',
 mount(el,ctx){feedbackScreen(el,ctx,{n:12,open:'{name}, סיימת את כל הקורס. בנית לוח השראה, קיבלת תעודה, ועברת שנים-עשר מפגשים. ספרי איך היה המסע כולו. כל מילה חשובה.',
  extra:{q:'מה הכי אהבת בקורס?',opts:['התקופות וההיסטוריה','הווילות','האור והצבע','המשימות'],show:'הכי אהבתי',why:'למה? (לא חובה)'},
  bridgeMedia:drawBox(boardSvg(boardReady(boardData(ctx.all))?Object.assign(boardData(ctx.all),{nm:(ctx.all.board||{}).name||''}):DEMO,'br'),'s7-bridge'),
  bridge:'המסע הסתיים, והבית ממשיך. כל המשימות, הלוחות והרעיונות שלך מחכים ב"המחברת שלי", בתפריט.'});
  const k=el.querySelector('.s3-bridge .kicker');if(k)k.textContent='סוף המסע'}}
];

window.Salon.register(12,screens);
})();
