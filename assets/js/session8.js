/* הסלון של מזל · מפגש 8: הבית והטבע
   בלוק נתונים ורכיבים של המפגש. לא נוגע במנוע ולא במפגשים 1 עד 7. */
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
fetch('assets/audio/s8.m4a',{method:'HEAD'}).then(r=>{audioOK=r.ok}).catch(()=>{});

/* ---------- צבעים ---------- */
const C={ink:'#1A3A35',lead:'#14474A',terra:'#C65A3C',mustard:'#E0A63A',sage:'#9DB39A',leaf:'#5E8A4E',leafD:'#3F6636',paper:'#F7F0E4',cream:'#F2E6CF',brass:'#C9A24B',stone:'#E4D3B0',wood:'#B9824F',oak:'#C69C6A',wall:'#EFE6D6',floor:'#D9C29C',sky:'#CFE6EE',water:'#7FB7C2'};
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const m=x=>Math.max(0,Math.min(255,Math.round(f<0?x*(1+f):x+(255-x)*f)));return '#'+[m(r),m(g),m(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}

/* ---------- רכיבי ציור ---------- */
function olive(x,y,s,col){s=s||1;col=col||C.sage;return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0 q-4 -40 4 -70 q6 -20 -6 -40 M2 -70 q20 -16 30 -36" stroke="#6B4F36" stroke-width="9" fill="none" stroke-linecap="round"/>
  ${[[-30,-120,34,24],[10,-135,40,26],[40,-110,32,22],[-8,-100,30,20],[24,-90,26,18],[-40,-95,24,16]].map(([a,b,rx,ry])=>`<ellipse cx="${a}" cy="${b}" rx="${rx}" ry="${ry}" fill="${col}" opacity=".95"/>`).join('')}</g>`}
function potPlant(x,y,s){s=s||1;return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-22 0 L-18 -40 L18 -40 L22 0Z" fill="${C.terra}"/>${[[-10,-120,-30],[26,-112,25],[0,-140,0],[-28,-86,-40],[30,-80,35],[-12,-66,-20],[14,-62,20]].map(([a,b,r])=>`<path d="M0 -40 Q${a/2} ${b/2-20} ${a} ${b}" stroke="${C.leafD}" stroke-width="3" fill="none"/><ellipse cx="${a}" cy="${b}" rx="16" ry="26" transform="rotate(${r} ${a} ${b})" fill="${C.leaf}" stroke="${C.leafD}" stroke-width="2"/>`).join('')}</g>`}
function sofa(x,y,w,col){col=col||C.lead;const d=shade(col,-.25);
  return `<g><rect x="${x}" y="${y-58}" width="${w}" height="40" rx="18" fill="${d}"/><rect x="${x-12}" y="${y-40}" width="26" height="42" rx="13" fill="${d}"/><rect x="${x+w-14}" y="${y-40}" width="26" height="42" rx="13" fill="${d}"/><rect x="${x+8}" y="${y-30}" width="${w-16}" height="26" rx="10" fill="${col}"/><rect x="${x-6}" y="${y}" width="6" height="10" fill="#5A3E28"/><rect x="${x+w}" y="${y}" width="6" height="10" fill="#5A3E28"/></g>`}

/* פתיחה: סלון עם קיר זכוכית, פטיו ובריכה */
function heroArt(){return svg('0 0 640 420',`<rect width="640" height="420" fill="${C.wall}"/><rect x="0" y="330" width="640" height="90" fill="${C.floor}"/>
  <rect x="250" y="40" width="360" height="290" fill="${C.sky}"/><path d="M250 250 q90 -40 180 -10 q90 20 180 -20 V330 H250Z" fill="${C.sage}"/>`+olive(470,300,1.25,C.leaf)+
  `<rect x="250" y="300" width="360" height="30" fill="${C.water}"/><path d="M262 312 h60 M350 318 h80 M460 310 h70" stroke="#E7F4F6" stroke-width="3" stroke-linecap="round"/>
  ${[250,370,490,610].map(x=>`<rect x="${x-4}" y="40" width="8" height="290" fill="#3B3B3B"/>`).join('')}<rect x="246" y="36" width="368" height="8" fill="#3B3B3B"/>`+
  potPlant(70,330,1.1)+sofa(40,350,190,C.sage)+`<ellipse cx="150" cy="384" rx="62" ry="16" fill="${C.oak}"/><ellipse cx="150" cy="380" rx="62" ry="16" fill="${C.wood}"/>`)}

/* רגע היסטורי: פריסטיל, המחשה */
function peristyleArt(){let cols='';for(let i=0;i<7;i++){const x=110+i*70;cols+=`<rect x="${x-8}" y="120" width="16" height="190" fill="#F4ECDD" stroke="#CDBFA4" stroke-width="2"/><rect x="${x-13}" y="112" width="26" height="10" fill="#E4D3B0"/>`}
  return svg('0 0 640 420',`<rect width="640" height="420" fill="#F3E6CF"/><rect x="0" y="0" width="640" height="112" fill="${C.terra}"/><path d="M0 112 L320 60 L640 112Z" fill="#A5482F"/>
   <rect x="60" y="240" width="520" height="140" fill="#C7D9B5"/><ellipse cx="320" cy="330" rx="90" ry="26" fill="${C.water}" stroke="#E4D3B0" stroke-width="6"/><path d="M320 330 v-40" stroke="#BFD8DA" stroke-width="4"/><path d="M320 290 q-16 10 -24 28 M320 290 q16 10 24 28" stroke="#BFD8DA" stroke-width="3" fill="none"/>
   ${[[140,300],[500,300],[220,280],[420,280]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="34" ry="22" fill="${C.leaf}"/><ellipse cx="${x+14}" cy="${y-10}" rx="20" ry="14" fill="${C.sage}"/>`).join('')}
   <rect x="168" y="250" width="14" height="40" fill="#E9E1D2"/><circle cx="175" cy="244" r="9" fill="#E9E1D2"/>`+cols+`<rect x="0" y="380" width="640" height="40" fill="#D9C29C"/>`)}

/* פטיו: בית סגור מול בית עם חצר פנימית, מבט מלמעלה */
function patioArt(open){const room=(x,y,w,hh,lit)=>`<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${lit?'#FFF3D6':'#C9BBA3'}" stroke="${C.ink}" stroke-width="5"/>`;
  return svg('0 0 640 420',`<rect width="640" height="420" fill="#E8EFE3"/><rect x="110" y="40" width="420" height="340" fill="#FFF" stroke="${C.ink}" stroke-width="8"/>`+
   (open?room(110,40,420,110,1)+room(110,270,420,110,1)+room(110,150,140,120,1)+room(390,150,140,120,1)+
     `<rect x="250" y="150" width="140" height="120" fill="#BFDDB0" stroke="#5D8FA0" stroke-width="5"/>`+olive(320,250,.7,C.leaf)+
     `<path d="M250 150 L180 90 M390 150 L460 90 M250 270 L180 330 M390 270 L460 330" stroke="#FFD98A" stroke-width="10" opacity=".7" stroke-linecap="round"/>`
    :room(110,40,420,110,1)+room(110,270,420,110,1)+room(110,150,420,120,0)+`<text x="320" y="218" font-size="22" font-family="Assistant,sans-serif" font-weight="700" fill="#6E6152" text-anchor="middle"></text>`)+
   `<path d="M106 80 v40 M534 80 v40 M106 300 v40 M534 300 v40" stroke="#5D8FA0" stroke-width="8"/>`)}

/* בריכת השתקפות: יום ושקיעה */
function poolArt(eve,id){
  const sky=eve?`<linearGradient id="sk${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#E38B5A"/><stop offset="1" stop-color="#F6CF86"/></linearGradient>`:`<linearGradient id="sk${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9CCFE0"/><stop offset="1" stop-color="#DDF0F4"/></linearGradient>`;
  const shimmer=eve?[...Array(9)].map((_,i)=>`<path class="s8-sh" style="animation-delay:${(i*.37).toFixed(2)}s" d="M${40+i*62} ${26+(i%3)*14} q14 -8 28 0 q14 8 28 0" stroke="#FFE2A6" stroke-width="5" fill="none" stroke-linecap="round"/>`).join(''):'';
  return svg('0 0 640 420',`<defs>${sky}</defs><rect width="640" height="420" fill="${eve?'#7A6450':C.wall}"/><rect x="0" y="0" width="640" height="70" fill="${eve?'#8C7058':'#F6F0E4'}"/>`+shimmer+
   `<rect x="60" y="70" width="520" height="210" fill="url(#sk${id})"/>${eve?'<circle cx="420" cy="230" r="34" fill="#FFD98A"/>':'<ellipse cx="200" cy="130" rx="60" ry="18" fill="#FFF" opacity=".9"/><ellipse cx="420" cy="110" rx="46" ry="14" fill="#FFF" opacity=".85"/>'}
   <path d="M60 240 q130 -30 260 -6 q130 22 260 -14 V280 H60Z" fill="${eve?'#7C6A4A':C.sage}"/>${[60,190,320,450,580].map(x=>`<rect x="${x-4}" y="70" width="8" height="210" fill="#3B3B3B"/>`).join('')}
   <rect x="0" y="280" width="640" height="140" fill="${eve?'#6E5A40':C.floor}"/><rect x="40" y="300" width="560" height="96" fill="${eve?'#C88B58':'#8EC1CC'}"/>
   ${eve?'<ellipse cx="420" cy="330" rx="40" ry="8" fill="#FFE2A6" opacity=".9"/><path d="M380 350 h80 M396 366 h50" stroke="#FFE2A6" stroke-width="4" stroke-linecap="round"/>':'<ellipse cx="200" cy="350" rx="58" ry="10" fill="#FFF" opacity=".7"/><ellipse cx="420" cy="336" rx="44" ry="8" fill="#FFF" opacity=".6"/>'}
   <path d="M70 318 h70 M260 380 h90 M470 372 h60" stroke="${eve?'#F3C890':'#D8EEF2'}" stroke-width="3" stroke-linecap="round"/>`)}

/* חומרים חיים */
function matArt(k){switch(k){
  case 'wood':return svg('0 0 200 140',`<rect width="200" height="140" fill="${C.oak}"/>${[20,48,80,110].map((y,i)=>`<path d="M0 ${y} q50 ${i%2?10:-10} 100 0 t100 0" stroke="#8E6236" stroke-width="3" fill="none"/>`).join('')}<ellipse cx="140" cy="64" rx="14" ry="8" fill="none" stroke="#8E6236" stroke-width="3"/>`);
  case 'stone':return svg('0 0 200 140',`<rect width="200" height="140" fill="#D8CDBA"/>${[[10,10,80,50],[96,8,94,44],[8,66,60,64],[74,58,70,74],[150,58,44,74]].map(([x,y,w,hh])=>`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="10" fill="#E9E0D0" stroke="#B9AD98" stroke-width="3"/>`).join('')}`);
  case 'plaster':return svg('0 0 200 140',`<rect width="200" height="140" fill="#E9C9A8"/>${[...Array(14)].map((_,i)=>`<path d="M${(i*37)%200} ${(i*23)%140} q20 -6 40 2" stroke="#D9B48E" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}`);
  case 'linen':return svg('0 0 200 140',`<rect width="200" height="140" fill="#E7DCC6"/>${[...Array(20)].map((_,i)=>`<line x1="${i*10}" y1="0" x2="${i*10}" y2="140" stroke="#D6C8AD" stroke-width="2"/>`).join('')}${[...Array(14)].map((_,i)=>`<line x1="0" y1="${i*10}" x2="200" y2="${i*10}" stroke="#DCCFB6" stroke-width="2"/>`).join('')}<path d="M30 0 q20 70 -10 140" stroke="#CDBE9F" stroke-width="6" fill="none" opacity=".6"/>`);
 }return ''}

/* צורות: פינות מול אבן נחל */
function formArt(soft){return svg('0 0 640 420',`<rect width="640" height="420" fill="${C.wall}"/><rect y="300" width="640" height="120" fill="${C.floor}"/>`+
  (soft?`<path d="M120 250 q0 -70 70 -70 h260 q70 0 70 70 v40 h-400z" fill="${C.sage}"/><path d="M110 300 q0 -50 40 -50 h340 q40 0 40 50z" fill="${shade(C.sage,-.2)}"/><ellipse cx="320" cy="350" rx="130" ry="34" fill="${C.oak}"/><ellipse cx="320" cy="344" rx="130" ry="34" fill="${C.wood}"/><path d="M60 300 V120 a80 80 0 0 1 160 0" fill="none" stroke="#FFF" stroke-width="0"/>`
   :`<rect x="120" y="180" width="400" height="70" fill="${C.sage}"/><rect x="110" y="250" width="420" height="50" fill="${shade(C.sage,-.2)}"/><rect x="200" y="330" width="240" height="40" fill="${C.wood}"/>`)+
  (soft?`<path d="M560 300 V150 a40 40 0 0 1 80 0 V300" fill="#E2D6C0"/>`:`<rect x="560" y="110" width="80" height="190" fill="#E2D6C0"/>`))}

/* החלון הוא ציור: עונות */
const SEAS={spring:['אביב','#F4C6CF','#9DC183'],summer:['קיץ','#5E8A4E','#B9D58C'],autumn:['סתיו','#D9822B','#D8C27A'],winter:['חורף','','#C9CFBF']};
function seasonArt(s){const [_,leaf,grass]=SEAS[s];
  const crown=s==='winter'?`<path d="M320 250 v-60 M320 200 l-50 -50 M320 190 l46 -54 M300 170 l-30 -10 M340 160 l30 -14" stroke="#6B4F36" stroke-width="7" fill="none" stroke-linecap="round"/>`
   :[[-50,-20,60],[20,-40,70],[60,0,56],[-10,10,64],[-70,20,44],[40,30,50]].map(([a,b,r])=>`<circle cx="${320+a}" cy="${150+b}" r="${r}" fill="${leaf}" opacity=".95"/>`).join('')+(s==='spring'?[...Array(14)].map((_,i)=>`<circle cx="${250+(i*53)%150}" cy="${100+(i*37)%110}" r="6" fill="#FFF"/>`).join(''):'');
  return svg('0 0 640 420',`<rect width="640" height="420" fill="${C.wall}"/><rect x="150" y="40" width="340" height="300" fill="${s==='winter'?'#D9E2E6':C.sky}"/><rect x="150" y="250" width="340" height="90" fill="${grass}"/><path d="M320 330 q-6 -60 0 -110" stroke="#6B4F36" stroke-width="16" fill="none"/>`+crown+
   `<rect x="138" y="28" width="364" height="324" fill="none" stroke="#FFF" stroke-width="24"/><rect x="126" y="16" width="388" height="348" fill="none" stroke="${C.wood}" stroke-width="6"/><rect y="370" width="640" height="50" fill="${C.floor}"/>`+(s==='autumn'?'<ellipse cx="260" cy="330" rx="8" ry="4" fill="#D9822B"/><ellipse cx="380" cy="322" rx="8" ry="4" fill="#C65A3C"/>':''))}

/* צמחים למיון */
const PL={cactus:['קקטוס','south'],jade:['צמח בשרני','south'],philo:['פילודנדרון','ew'],pothos:['פותוס','ew'],fern:['שרך','north'],snake:['לשון חמותי','north']};
function plantIcon(id){const pot=`<path d="M30 110 l4 -26 h32 l4 26z" fill="${C.terra}"/>`;let p='';
  switch(id){
   case 'cactus':p=`<rect x="42" y="30" width="16" height="56" rx="8" fill="${C.leaf}"/><path d="M42 60 h-10 v-16" stroke="${C.leaf}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M58 52 h10 v-14" stroke="${C.leaf}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="50" cy="28" r="5" fill="${C.terra}"/>`;break;
   case 'jade':p=[[50,60],[38,52],[62,50],[44,40],[58,38],[50,30]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="9" ry="7" fill="#7BA05B" stroke="#4E6B3A" stroke-width="2"/>`).join('')+`<path d="M50 84 v-24" stroke="#6B4F36" stroke-width="5"/>`;break;
   case 'philo':p=[[34,50,-30],[66,46,30],[50,34,0]].map(([x,y,r])=>`<path d="M50 84 Q${(x+50)/2} ${y+20} ${x} ${y}" stroke="${C.leafD}" stroke-width="3" fill="none"/><path d="M${x} ${y-18} q16 10 0 34 q-16 -24 0 -34z" transform="rotate(${r} ${x} ${y})" fill="${C.leaf}"/>`).join('');break;
   case 'pothos':p=`<path d="M36 84 q-10 10 -14 26 M64 84 q10 12 12 26" stroke="${C.leafD}" stroke-width="3" fill="none"/>`+[[22,104],[28,92],[76,104],[70,92],[40,70],[60,70],[50,58]].map(([x,y])=>`<path d="M${x} ${y-8} q10 6 0 16 q-10 -10 0 -16z" fill="#8DB65A" stroke="${C.leafD}" stroke-width="1.5"/>`).join('');break;
   case 'fern':p=[-50,-25,0,25,50].map(r=>`<g transform="rotate(${r} 50 84)"><path d="M50 84 V26" stroke="${C.leafD}" stroke-width="3"/>${[34,44,54,64,74].map(y=>`<path d="M50 ${y} l-9 -5 M50 ${y} l9 -5" stroke="${C.leaf}" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`).join('');break;
   case 'snake':p=[[40,22,-6],[50,14,0],[60,24,6]].map(([x,y,r])=>`<path d="M${x-6} 84 q-2 -30 6 ${y-84} q8 ${84-y-30} 6 ${84-y}z" transform="rotate(${r} ${x} 84)" fill="#4F7A48" stroke="#C9C26A" stroke-width="2"/>`).join('');break;
  }return svg('0 0 100 114',p+pot)}

/* לפני ואחרי: אותו סלון עם צמחים */
function roomArt(green){return svg('0 0 640 420',`<rect width="640" height="420" fill="${C.wall}"/><rect y="320" width="640" height="100" fill="${C.floor}"/><rect x="380" y="60" width="200" height="200" fill="${C.sky}" stroke="#FFF" stroke-width="10"/>`+
  sofa(110,330,260,'#D9CFC0')+`<rect x="420" y="250" width="110" height="70" fill="${C.wood}"/>`+
  (green?potPlant(560,330,1.35)+`<path d="M200 0 v60" stroke="#6B4F36" stroke-width="2"/><path d="M180 60 h40 l-6 24 h-28z" fill="${C.terra}"/>${[...Array(8)].map((_,i)=>`<path d="M${186+i*4} 80 q${i%2?-14:14} ${30+i*6} ${i%2?-6:8} ${60+i*8}" stroke="${C.leaf}" stroke-width="3" fill="none"/>`).join('')}
   <path d="M460 250 v-70" stroke="#6B4F36" stroke-width="3"/><path d="M460 200 q-30 -20 -36 -50 M460 210 q26 -22 40 -46 M460 190 q-4 -30 6 -56" stroke="${C.leafD}" stroke-width="4" fill="none"/><path d="M446 250 q-4 -30 14 -40 q18 10 14 40z" fill="#BFD8DA" opacity=".9"/>`:''))}

/* פינת הקריאה שלך */
const NOOK={view:{olive:['עצי זית'],hills:['הרים'],garden:['גן פרחים']},plant:{tree:['עץ בעציץ גדול'],hang:['צמח תלוי'],ferns:['שרכים']},chair:{sage:['פשתן מרווה','#9DB39A'],mustard:['קטיפה חרדל','#E0A63A'],rattan:['קש טבעי','#D6B47A']},water:{fountain:['מזרקה קטנה'],pool:['בריכת השתקפות'],none:['בלי מים']}};
function nookSvg(k,eve,id){
  const view=k.view==='hills'?`<path d="M150 230 l70 -70 l60 50 l70 -90 l90 110z" fill="#8FA88A"/><path d="M150 250 q120 -30 290 0 V300 H150Z" fill="#B9C98F"/>`:k.view==='garden'?`<rect x="150" y="220" width="290" height="80" fill="#9DC183"/>${[...Array(18)].map((_,i)=>`<circle cx="${160+(i*31)%280}" cy="${230+(i*17)%60}" r="7" fill="${['#F4C6CF','#E0A63A','#C65A3C','#FFF'][i%4]}"/>`).join('')}`:k.view==='olive'?`<rect x="150" y="240" width="290" height="60" fill="#C7D3A2"/>`+olive(220,290,.7)+olive(370,290,.8):'';
  const sky=eve?'#E9A26C':C.sky;
  const plant=k.plant==='tree'?potPlant(90,360,1.25):k.plant==='hang'?`<path d="M100 0 v70" stroke="#6B4F36" stroke-width="2"/><path d="M80 70 h40 l-6 24 h-28z" fill="${C.terra}"/>${[...Array(8)].map((_,i)=>`<path d="M${86+i*4} 90 q${i%2?-14:14} ${30+i*6} ${i%2?-6:8} ${60+i*8}" stroke="${C.leaf}" stroke-width="3" fill="none"/>`).join('')}`:k.plant==='ferns'?`<g transform="translate(40 250) scale(1.1)">${plantIcon('fern').replace(/<\/?svg[^>]*>/g,'')}</g><g transform="translate(470 250) scale(1.1)">${plantIcon('fern').replace(/<\/?svg[^>]*>/g,'')}</g>`:'';
  const cc=k.chair?NOOK.chair[k.chair][1]:'#CFC6B6';
  const chair=`<path d="M230 360 v-90 q0 -30 30 -30 h70 q30 0 30 30 v90z" fill="${shade(cc,-.15)}"/><rect x="222" y="300" width="156" height="44" rx="16" fill="${cc}"/><rect x="236" y="344" width="8" height="20" fill="#5A3E28"/><rect x="356" y="344" width="8" height="20" fill="#5A3E28"/>`+(k.chair==='rattan'?[...Array(6)].map((_,i)=>`<path d="M${240+i*20} 250 v90" stroke="#B8955A" stroke-width="2"/>`).join(''):'');
  const water=k.water==='pool'?`<rect x="380" y="372" width="250" height="40" fill="${eve?'#C88B58':C.water}"/><path d="M400 390 h60 M500 398 h80" stroke="${eve?'#FFE2A6':'#E7F4F6'}" stroke-width="3" stroke-linecap="round"/>`:k.water==='fountain'?`<path d="M520 370 q-20 0 -24 -30 h88 q-4 30 -24 30z" fill="#E4D3B0"/><ellipse cx="540" cy="340" rx="44" ry="8" fill="${C.water}"/><path d="M540 338 v-34 M540 306 q-14 8 -20 30 M540 306 q14 8 20 30" stroke="#BFD8DA" stroke-width="3" fill="none"/>`:'';
  const glow=eve?`<defs><radialGradient id="gl${id}"><stop offset="0" stop-color="#FFD98A" stop-opacity=".75"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient></defs><circle cx="440" cy="250" r="150" fill="url(#gl${id})"/>`:'';
  return svg('0 0 640 420',`<rect width="640" height="420" fill="${eve?'#5B5146':C.wall}"/>${glow}<rect x="150" y="50" width="290" height="250" fill="${sky}"/>${eve?'<circle cx="390" cy="200" r="22" fill="#FFD98A"/>':''}${view}<rect x="140" y="40" width="310" height="270" fill="none" stroke="#FFF" stroke-width="14"/><rect y="370" width="640" height="50" fill="${eve?'#6E5A40':C.floor}"/>`+plant+chair+
   `<path d="M450 370 v-110" stroke="${C.brass}" stroke-width="5"/><path d="M420 262 h60 l-12 -30 h-36z" fill="${eve?'#FFE3A8':'#E8DCC4'}"/>`+water)}
function nookText(k){return 'נוף של '+NOOK.view[k.view][0]+', '+NOOK.plant[k.plant][0]+', כורסה מ'+NOOK.chair[k.chair][0]+', ו'+(k.water==='none'?'בלי מים':NOOK.water[k.water][0])+'.'}

/* גשר: חדר שינה בלילה */
function bridgeArt(){return svg('0 0 400 300',`<rect width="400" height="300" fill="#2E3B4A"/><rect x="230" y="40" width="130" height="120" fill="#1C2836" stroke="#4A5868" stroke-width="8"/><circle cx="320" cy="80" r="18" fill="#F3E6CF"/><circle cx="328" cy="74" r="16" fill="#1C2836"/>
  <rect x="40" y="170" width="200" height="70" rx="10" fill="#4A5868"/><rect x="40" y="150" width="60" height="40" rx="10" fill="#C9D3DC"/><rect y="250" width="400" height="50" fill="#3B4654"/>
  <rect x="270" y="180" width="26" height="40" rx="6" fill="${C.brass}"/><circle cx="283" cy="200" r="7" fill="#FFE3A8"/><ellipse cx="200" cy="262" rx="160" ry="10" fill="#FFD98A" opacity=".35"/>`)}

const prevDraw=window.Salon.drawNote;
window.Salon.drawNote=function(it){if(it.kind==='nook8'&&it.k){return h('div',{class:'s3-nb',html:nookSvg(it.k,true,'nb'+it.ts)})}return prevDraw?prevDraw(it):null};

function toggle2(el,ctx,o){
  const d=ctx.data;const tr=d.tr||(d.tr={});const keys=o.opts.map(x=>x[0]);const cur=d.cur||keys[0];
  const box=h('div',{class:'s3-draw s5-fin '+(o.cls||'s8-wide')},...o.opts.map(([k,_,art])=>h('div',{class:'lay'+(cur===k?' on':''),'data-k':k,html:art})),illus());
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':o.title},...o.opts.map(([k,t])=>h('button',{type:'button','data-k':k,'aria-pressed':String(cur===k),onclick:()=>show(k)},t)));
  function show(k){d.cur=k;tr[k]=1;ctx.save();box.querySelectorAll('.lay').forEach(i=>i.classList.toggle('on',i.dataset.k===k));btns.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));if(keys.every(x=>tr[x]))ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),copy(o.kicker,o.title,o.text)));
  return gate(ctx,keys.every(x=>tr[x]));
}

const screens=[

/* יחידה 1 */
{id:'open',title:'הבית והטבע',hideNext:true,
 text:'ברוכה השבה, {name}. פעם הבית היה קופסה סגורה שמגינה מפני החוץ. בווילה של היום הגבול נעלם: קיר זכוכית, עץ זית בחצר, ומים שמשקפים את השמיים. היום תתאימי צמח לכל חלון, ותעצבי פינה ירוקה משלך.',
 mount(el,ctx){
  const box=drawBox(heroArt(),'s8-wide');
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
    h('div',{class:'copy'},h('span',{class:'kicker'},'מפגש 8'),h('h1',null,'הבית והטבע'),
      h('p',{class:'lede'},nameFill('ברוכה השבה, {name}. פעם הבית היה קופסה סגורה שמגינה מפני החוץ. בווילה של היום הגבול נעלם: קיר זכוכית, עץ זית בחצר, ומים שמשקפים את השמיים. היום תתאימי צמח לכל חלון, ותעצבי פינה ירוקה משלך.')),
      h('button',{class:'cta',type:'button',onclick:ctx.next,html:'בואי נתחיל'+window.Salon.ICON.arrowL}))));
 }},

{id:'secrets',title:'ארבעה סודות',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'לבית שמחובר לטבע יש ארבעה סודות. היום נכיר את כולם.',
 mount(el,ctx){return flips(el,ctx,{kicker:'ארבעה סודות',title:'ארבעה סודות',lede:'לבית שמחובר לטבע יש ארבעה סודות. היום נכיר את כולם.',
  cards:['החוץ נכנס פנימה.','מים מרגיעים.','חומרים חיים.','החלון הוא ציור.'].map((b,i)=>({t:'סוד '+(i+1),b}))})}},

{id:'peristyle',title:'רגע היסטורי: הגינה בלב הבית',task:'לחצי על שלוש הנקודות בציור.',wide:true,
 text:'רגע היסטורי. בבית הווטיי שבפומפיי, לפני כאלפיים שנה, היה בלב הבית פריסטיל (Peristyle): גינה מוקפת עמודים, עם פסלים ומזרקות. החדרים נפתחו אל הירוק. הפטיו בווילה של היום ממשיך את אותו רעיון.',
 mount(el,ctx){
  const box=h('div',{class:'s2-pic s3-draw s8-wide',html:peristyleArt()});box.append(illus());
  return spots(el,ctx,{kicker:'רגע היסטורי',title:'הגינה בלב הבית',lede:'רגע היסטורי. בבית הווטיי שבפומפיי, לפני כאלפיים שנה, היה בלב הבית פריסטיל (Peristyle): גינה מוקפת עמודים, עם פסלים ומזרקות. החדרים נפתחו אל הירוק. הפטיו בווילה של היום ממשיך את אותו רעיון.',
   box,credit:'המחשה של פריסטיל רומי',
   pts:[{x:17,y:40,name:'עמודים',t:'עמודים: מקיפים את הגינה מכל הצדדים.'},{x:66,y:66,name:'גינה',t:'גינה: ירוק בלב הבית.'},{x:50,y:79,name:'מזרקה',t:'מזרקה: מים בתוך הגינה, ופסלים סביבה.'}]});
 }},

{id:'biophilia',title:'ביופיליה',task:'לחצי על שני חלקי המילה.',wide:true,
 text:'המילה ביופיליה (Biophilia) בנויה משתי מילים ביוונית. אריך פרום השתמש בה לתיאור אהבה לכל מה שחי, והביולוג אדוארד ווילסון כתב עליה ספר ב-1984. הרעיון: אנחנו נמשכים אל הטבע. עיצוב ביופילי מכניס את הטבע אל הבית.',
 mount(el,ctx){return flips(el,ctx,{kicker:'מילה אחת',title:'ביופיליה',lede:'המילה ביופיליה (Biophilia) בנויה משתי מילים ביוונית. אריך פרום השתמש בה לתיאור אהבה לכל מה שחי, והביולוג אדוארד ווילסון כתב עליה ספר ב-1984. הרעיון: אנחנו נמשכים אל הטבע. עיצוב ביופילי מכניס את הטבע אל הבית.',cls:'s8-word',
  cards:[{t:'החלק הראשון',front:()=>h('span',{class:'s8-big'},'ביו'),b:'ביו: חיים'},{t:'החלק השני',front:()=>h('span',{class:'s8-big'},'פיליה'),b:'פיליה: אהבה'}]})}},

/* יחידה 2 */
{id:'patio',title:'החוץ נכנס פנימה',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'הסוד הראשון: החוץ נכנס פנימה. בלב הווילה פותחים חצר פנימית, פטיו (Patio), עם קירות זכוכית ועץ זית. האור הטבעי מגיע עד עומק הבית, ומכל חדר רואים ירוק.',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,patioArt(false),patioArt(true),'בית סגור','בית עם פטיו')),
   copy('הסוד הראשון','החוץ נכנס פנימה','הסוד הראשון: החוץ נכנס פנימה. בלב הווילה פותחים חצר פנימית, פטיו (Patio), עם קירות זכוכית ועץ זית. האור הטבעי מגיע עד עומק הבית, ומכל חדר רואים ירוק.')));
  return gate(ctx,ctx.data.cut!=null&&ctx.data.cut!==50);
 }},

{id:'pool',title:'מים מרגיעים',task:'לחצי על "יום" ועל "שקיעה".',wide:true,
 text:'הסוד השני. בריכת השתקפות (Reflecting Pool) היא בריכה רדודה ושקטה, צמודה לקיר הזכוכית של הסלון. ביום רואים בה את השמיים והעננים. בשקיעה, האור משתקף מהמים ומרצד על התקרה.',
 mount(el,ctx){return toggle2(el,ctx,{kicker:'רגע WOW',title:'מים מרגיעים',text:'הסוד השני. בריכת השתקפות (Reflecting Pool) היא בריכה רדודה ושקטה, צמודה לקיר הזכוכית של הסלון. ביום רואים בה את השמיים והעננים. בשקיעה, האור משתקף מהמים ומרצד על התקרה.',
  opts:[['day','יום',poolArt(false,'a')],['eve','שקיעה',poolArt(true,'b')]]})}},

{id:'materials',title:'חומרים חיים',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'הסוד השלישי: חומרים חיים. בוחרים חומרים טבעיים, כמו שהם: עץ, אבן, טיח ופשתן. עם השנים הם משנים מעט את המראה, ומעצבים קוראים לזה פטינה (Patina). זה חלק מהיופי.',
 mount(el,ctx){
  const th=k=>()=>h('span',{class:'s3-draw thumb',html:matArt(k)});
  return flips(el,ctx,{kicker:'הסוד השלישי',title:'חומרים חיים',lede:'הסוד השלישי: חומרים חיים. בוחרים חומרים טבעיים, כמו שהם: עץ, אבן, טיח ופשתן. עם השנים הם משנים מעט את המראה, ומעצבים קוראים לזה פטינה (Patina). זה חלק מהיופי.',cls:'s3-flips',
   cards:[{t:'עץ',front:th('wood'),b:'עץ במראה טבעי, שרואים בו את הסיבים.'},{t:'אבן',front:th('stone'),b:'אבן עם מרקם, לא מלוטשת עד ברק.'},{t:'טיח',front:th('plaster'),b:'טיח בגוון חם, עם מרקם רך של עבודת יד.'},{t:'פשתן',front:th('linen'),b:'בד טבעי, קצת מקומט, ונעים למגע.'}]});
 }},

{id:'forms',title:'צורות מהטבע',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'בטבע כמעט אין פינות חדות. לכן בעיצוב ביופילי בוחרים צורות רכות ומעוגלות: שולחן קפה כמו אבן נחל, ספה מעוגלת וקשת בפתח. מעצבים קוראים להן צורות ביומורפיות (Biomorphic Forms), צורות שמחקות את הטבע.',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,formArt(false),formArt(true),'פינות חדות','צורות רכות')),
   copy('חומרים וצורות','צורות מהטבע','בטבע כמעט אין פינות חדות. לכן בעיצוב ביופילי בוחרים צורות רכות ומעוגלות: שולחן קפה כמו אבן נחל, ספה מעוגלת וקשת בפתח. מעצבים קוראים להן צורות ביומורפיות (Biomorphic Forms), צורות שמחקות את הטבע.')));
  return gate(ctx,ctx.data.cut!=null&&ctx.data.cut!==50);
 }},

/* יחידה 3 */
{id:'frame',title:'החלון הוא ציור',task:'לחצי על ארבע העונות.',wide:true,
 text:'הסוד הרביעי. מתכננים את החלון מול עץ יפה או נוף פתוח, וממסגרים אותו כמו תמונה. מעצבים קוראים לזה מסגור נוף (Landscape Framing). זה ציור חי, שמשתנה עם עונות השנה.',
 mount(el,ctx){return toggle2(el,ctx,{kicker:'הסוד הרביעי',title:'החלון הוא ציור',text:'הסוד הרביעי. מתכננים את החלון מול עץ יפה או נוף פתוח, וממסגרים אותו כמו תמונה. מעצבים קוראים לזה מסגור נוף (Landscape Framing). זה ציור חי, שמשתנה עם עונות השנה.',
  opts:Object.keys(SEAS).map(k=>[k,SEAS[k][0],seasonArt(k)])})}},

{id:'windows',title:'איזה צמח לאיזה חלון',task:'לחצי על צמח, ואחר כך על החלון שמתאים לו.',wide:true,
 text:'לכל חלון יש אור אחר. בישראל, חלון דרומי מקבל את השמש החזקה ביותר. חלון צפוני מקבל אור רך, בלי שמש ישירה. חלונות מזרח ומערב באמצע. התאימי לכל צמח את החלון שלו.',
 mount(el,ctx){return sorter(el,ctx,{kicker:'רגע WOW',title:'איזה צמח לאיזה חלון',lede:'לכל חלון יש אור אחר. בישראל, חלון דרומי מקבל את השמש החזקה ביותר. חלון צפוני מקבל אור רך, בלי שמש ישירה. חלונות מזרח ומערב באמצע. התאימי לכל צמח את החלון שלו.',
  items:Object.entries(PL).map(([k,[t,b]])=>[k,t,b]),art:plantIcon,poolCls:'s8-pool',
  bins:[['south','דרום: שמש חזקה'],['ew','מזרח או מערב: אור בינוני'],['north','צפון: אור רך']],
  hint:'נסי חלון אחר. צמחי מדבר אוהבים שמש חזקה, ושרכים אוהבים אור רך.',
  doneMsg:nameFill('<b>כל צמח בחלון שלו.</b> קקטוס בשמש, שרך באור רך. <b>עין של מעצבת, {name}.</b>')})}},

{id:'beforeafter',title:'אותו חדר, עם ירוק',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'ככה צמחים משנים חדר. אותו סלון ואותם רהיטים. בצד אחד בלי צמחים, ובצד השני עם עץ גדול בעציץ, צמח תלוי וענפים ירוקים באגרטל. החדר מרגיש חי ורענן יותר.',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,roomArt(false),roomArt(true),'בלי ירוק','עם ירוק')),
   copy('לפני ואחרי','אותו חדר, עם ירוק','ככה צמחים משנים חדר. אותו סלון ואותם רהיטים. בצד אחד בלי צמחים, ובצד השני עם עץ גדול בעציץ, צמח תלוי וענפים ירוקים באגרטל. החדר מרגיש חי ורענן יותר.')));
  return gate(ctx,ctx.data.cut!=null&&ctx.data.cut!==50);
 }},

/* יחידה 4 */
{id:'mynook',title:'הפינה הירוקה שלך',task:'בחרי נוף, צמח, כורסה ומים, וראי את הפינה משתנה.',wide:true,
 text:'בעלי וילה בגליל ביקשו פינת קריאה מול החלון הגדול. את המעצבת. ארבע בחירות, ואין כאן בחירה לא נכונה.',
 mount(el,ctx){
  const k=ctx.data.k||(ctx.data.k={});const res=h('div');const box=h('div',{class:'s3-draw s8-nook'});const ctr=h('div',{class:'s3-side'});
  const MSG={view:{olive:'עצי זית: ירוק כסוף, כל השנה.',hills:'הרים: נוף פתוח עד האופק.',garden:'גן פרחים: צבע שמשתנה בכל עונה.'},plant:{tree:'עץ גדול בעציץ: נוכחות של יער בתוך הבית.',hang:'צמח תלוי: ירוק בגובה העיניים.',ferns:'שרכים: רכים ועדינים, ליד החלון.'},
   chair:{sage:'פשתן מרווה: רך וטבעי, כמו העלים.',mustard:'קטיפה חרדל: חמה ונוצצת באור.',rattan:'קש טבעי: קליל, כמו במרפסת.'},water:{fountain:'מזרקה קטנה: פכפוך שקט ברקע.',pool:'בריכת השתקפות: השמיים נכנסים לחדר.',none:'בלי מים: הירוק לבדו מדבר.'}};
  const ok=()=>k.view&&k.plant&&k.chair&&k.water;
  function draw(){box.innerHTML=nookSvg(k,false,'mk');box.append(illus());
   ctr.replaceChildren(chipRow('הנוף',Object.entries(NOOK.view).map(([x,v])=>[x,v[0]]),k.view,x=>pick('view',x)),chipRow('הצמח',Object.entries(NOOK.plant).map(([x,v])=>[x,v[0]]),k.plant,x=>pick('plant',x)),
    chipRow('הכורסה',Object.entries(NOOK.chair).map(([x,v])=>[x,v[0]]),k.chair,x=>pick('chair',x)),chipRow('מים',Object.entries(NOOK.water).map(([x,v])=>[x,v[0]]),k.water,x=>pick('water',x)),res);
   if(ok())ctx.done()}
  function pick(g,x){k[g]=x;ctx.save();draw();sayBox(res,MSG[g][x])}
  el.append(head('המשימה','הפינה הירוקה שלך','בעלי וילה בגליל ביקשו פינת קריאה מול החלון הגדול. את המעצבת. ארבע בחירות, ואין כאן בחירה לא נכונה.'),
   h('div',{class:'s3-simwrap s8-nookwrap'},h('div',{class:'s3-simcol'},box),ctr));
  draw();
  return gate(ctx,!!ok());
 }},

{id:'mynook-eve',title:'הפינה שלך בשקיעה',task:'שמרי את הפינה במחברת.',wide:true,
 text:'ככה הפינה שלך נראית בשקיעה, {name}. האור החם נכנס מהחלון, המנורה דולקת, והנוף נשאר בתמונה.',
 mount(el,ctx){
  const k=((ctx.all.mynook||{}).k)||{};const res=h('div');
  if(!(k.view&&k.plant&&k.chair&&k.water)){el.append(h('div',{class:'center'},h('div',null,h('h2',null,'הפינה שלך בשקיעה'),h('p',{class:'lede'},'הפינה עוד לא מוכנה. חזרי מסך אחד אחורה והשלימי אותה.'))));return gate(ctx,false)}
  const text=nookText(k);
  const box=h('div',{class:'s3-draw s8-wide',html:nookSvg(k,true,'ev')});box.append(illus());
  const btn=h('button',{class:'cta',type:'button',onclick:()=>{
    const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='nook8'&&n.session===8);
    if(old){old.k=JSON.parse(JSON.stringify(k));old.text=text;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:'nook8',svg:true,title:'הפינה הירוקה שלי בגליל',k:JSON.parse(JSON.stringify(k)),text});
    ctx.data.saved=true;ctx.save();sayBox(res,'<b>נשמר במחברת שלך.</b>');ctx.done()}},'שמרי במחברת');
  el.append(h('div',{class:'split media s2-split s7-eve s8-eve'},h('div',{class:'s2-media'},box),
   copy('בשקיעה','הפינה שלך בשקיעה',nameFill('ככה הפינה שלך נראית בשקיעה, {name}. האור החם נכנס מהחלון, המנורה דולקת, והנוף נשאר בתמונה.'),h('p',{class:'s3-sum'},text),h('div',{class:'row',style:'margin-top:12px'},btn),res)));
  if(ctx.data.saved)sayBox(res,'<b>נשמר במחברת שלך.</b>');
  return gate(ctx,!!ctx.data.saved);
 }},

/* יחידה 5 */
{id:'check1',title:'בדיקה 1',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה פירוש המילה ביופיליה?',[['אהבה לחיים ולטבע'],['פחד מהטבע'],['רהיטים מעץ']]),
 mount(el,ctx){const v=drawBox(heroArt(),'s8-wide');
  return quiz(el,ctx,{kicker:'בדיקה 1',lede:'ארבע שאלות קצרות על מה שראית היום.',q:'מה פירוש המילה ביופיליה?',visual:v,
  opts:[['אהבה לחיים ולטבע',1],['פחד מהטבע',0],['רהיטים מעץ',0]],hint:'ביו פירושו חיים. ומה פירוש פיליה?',right:'<b>נכון.</b> ביו, חיים. פיליה, אהבה.'})}},

{id:'check2',title:'בדיקה 2',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('איזה חלון מתאים לקקטוס?',[['חלון דרום, עם שמש חזקה'],['חלון צפון, עם אור רך'],['פינה בלי חלון']]),
 mount(el,ctx){const v=h('div',{class:'s3-draw s8-icon',html:plantIcon('cactus')});v.append(illus());
  return quiz(el,ctx,{kicker:'בדיקה 2',q:'איזה חלון מתאים לקקטוס?',visual:v,
  opts:[['חלון דרום, עם שמש חזקה',1],['חלון צפון, עם אור רך',0],['פינה בלי חלון',0]],hint:'הקקטוס בא מהמדבר.',right:'<b>נכון.</b> והשרך מעדיף את החלון הצפוני.'})}},

{id:'check3',title:'בדיקה 3',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה היה בלב הבית הרומי בפומפיי?',[['גינה מוקפת עמודים, עם מזרקות'],['מטבח גדול'],['חדר בלי חלונות']]),
 mount(el,ctx){const v=drawBox(peristyleArt(),'s8-wide');
  return quiz(el,ctx,{kicker:'בדיקה 3',q:'מה היה בלב הבית הרומי בפומפיי?',visual:v,
  opts:[['גינה מוקפת עמודים, עם מזרקות',1],['מטבח גדול',0],['חדר בלי חלונות',0]],hint:'היזכרי ברגע ההיסטורי ובמילה פריסטיל.',right:'<b>נכון.</b> והפטיו של היום ממשיך את הרעיון.'})}},

{id:'check4',title:'בדיקה 4',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה עושה בריכת השתקפות בשקיעה?',[['מחזירה אור שמרצד על התקרה'],['מסתירה את הנוף'],['מחליפה את החלון']]),
 mount(el,ctx){const v=drawBox(poolArt(true,'q'),'s8-wide');
  return quiz(el,ctx,{kicker:'בדיקה 4',q:'מה עושה בריכת השתקפות בשקיעה?',visual:v,
  opts:[['מחזירה אור שמרצד על התקרה',1],['מסתירה את הנוף',0],['מחליפה את החלון',0]],hint:'היזכרי במה שקרה כשלחצת על "שקיעה".',right:nameFill('<b>נכון.</b> המים מביאים את השמיים פנימה. <b>ארבע מתוך ארבע, {name}.</b>')})}},

/* יחידה 6 */
{id:'home-idea',title:'רעיון לבית',task:'אם תרצי, כתבי שינוי קטן אחד ושמרי במחברת.',
 text:'רעיון לבית, למי שרוצה. בחרי חדר שאת יושבת בו הרבה. יש בו צמח חי? הווילון פתוח בבוקר? נסי צעד קטן אחד: עציץ ליד החלון, או ענפים ירוקים באגרטל. מה השתנה בתחושה?',
 mount(el,ctx){ideaScreen(el,ctx,{n:8,media:h('div',{class:'s6-ideaimg',html:roomArt(true)}),field:'הצעד הירוק שלי',
  text:'רעיון לבית, למי שרוצה. בחרי חדר שאת יושבת בו הרבה. יש בו צמח חי? הווילון פתוח בבוקר? נסי צעד קטן אחד: עציץ ליד החלון, או ענפים ירוקים באגרטל. מה השתנה בתחושה?'})}},

{id:'summary',title:'סיכום',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',
 mount(el,ctx){
  const th=html=>()=>h('span',{class:'s3-draw thumb',html});
  return flips(el,ctx,{kicker:'סיכום',title:'ארבעה כללים',lede:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',cls:'s3-flips',toggle:true,
   cards:[{t:'החוץ נכנס פנימה',front:th(patioArt(true)),b:'פטיו בלב הבית, וקיר זכוכית אל הגינה.'},
    {t:'מים מרגיעים',front:th(poolArt(false,'su')),b:'בריכת השתקפות או מזרקה קטנה. השמיים נכנסים הביתה.'},
    {t:'חומרים חיים',front:th(matArt('wood')),b:'עץ, אבן, טיח ופשתן, וצורות רכות כמו בטבע.'},
    {t:'החלון הוא ציור',front:th(seasonArt('spring')),b:'חלון מול נוף, וכל צמח בחלון שמתאים לו.'}]});
 }},

{id:'audio',title:'סקירה קולית',task:'לחצי על הנגן כדי לשמוע.',skip:()=>!audioOK,
 text:'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.',
 mount(el,ctx){audioScreen(el,ctx,8)}},

{id:'feedback',title:'משוב וגשר',task:'דרגי בלחיצה, ואם תרצי, כתבי גם כמה מילים.',wide:true,hideNext:true,
 say:'{name}, סיימת את מפגש 8. התאמת צמחים לחלונות, ראית מים ואור נכנסים הביתה, ועיצבת פינה ירוקה. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
 mount(el,ctx){feedbackScreen(el,ctx,{n:8,open:'{name}, סיימת את מפגש 8. התאמת צמחים לחלונות, ראית מים ואור נכנסים הביתה, ועיצבת פינה ירוקה. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
  bridgeMedia:drawBox(bridgeArt(),'s7-bridge'),
  bridge:'במפגש הבא: הבית החכם. תבני בעצמך תרחיש "לילה טוב", ותראי איך הבית עושה הכול בלחיצה אחת.'})}}
];

window.Salon.register(8,screens);
})();
