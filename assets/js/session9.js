/* הסלון של מזל · מפגש 9: הבית החכם
   בלוק נתונים ורכיבים של המפגש. לא נוגע במנוע ולא במפגשים 1 עד 8. */
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
fetch('assets/audio/s9.m4a',{method:'HEAD'}).then(r=>{audioOK=r.ok}).catch(()=>{});

/* ---------- צבעים ---------- */
const C={ink:'#1A3A35',lead:'#14474A',terra:'#C65A3C',mustard:'#E0A63A',sage:'#9DB39A',paper:'#F7F0E4',cream:'#F2E6CF',brass:'#C9A24B',stone:'#E4D3B0',wood:'#B9824F',oak:'#C69C6A',wall:'#EFE6D6',floor:'#D9C29C',night:'#24303D',nightW:'#3A4656',warm:'#FFD98A'};
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const m=x=>Math.max(0,Math.min(255,Math.round(f<0?x*(1+f):x+(255-x)*f)));return '#'+[m(r),m(g),m(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
const G=(id,col,op)=>`<radialGradient id="${id}"><stop offset="0" stop-color="${col||C.warm}" stop-opacity="${op||.85}"/><stop offset="1" stop-color="${col||C.warm}" stop-opacity="0"/></radialGradient>`;
function sofa(x,y,w,col){col=col||C.lead;const d=shade(col,-.25);
  return `<g><rect x="${x}" y="${y-58}" width="${w}" height="40" rx="14" fill="${d}"/><rect x="${x-12}" y="${y-40}" width="26" height="42" rx="11" fill="${d}"/><rect x="${x+w-14}" y="${y-40}" width="26" height="42" rx="11" fill="${d}"/><rect x="${x+8}" y="${y-30}" width="${w-16}" height="26" rx="8" fill="${col}"/><rect x="${x-6}" y="${y}" width="6" height="10" fill="#5A3E28"/><rect x="${x+w}" y="${y}" width="6" height="10" fill="#5A3E28"/></g>`}

/* הבית בלילה: מצב לכל פעולה */
const ACT={lights:['לכבות את האורות בסלון',1],curtains:['לסגור את הווילונות',1],lock:['לנעול את הדלת',1],path:['להדליק אור דרך נמוך',1],ac:['לכוון את המזגן ללילה',1],music:['להנמיך את המוזיקה עד שקט',1],garden:['להשאיר אור עדין בגינה',1],tv:['לכבות את הטלוויזיה',1]};
function houseSvg(st,id){st=st||{};const lightsOn=!st.lights;const fy=340;
  return svg('0 0 640 420',`<defs>${G('lp'+id)}${G('pt'+id,'#FFE7B0',.9)}${G('gd'+id,'#FFE7B0',.6)}</defs>
   <rect width="640" height="420" fill="${lightsOn?'#6A5B4B':C.night}"/><rect y="${fy}" width="640" height="80" fill="${lightsOn?'#7C6648':'#2D3846'}"/>
   <rect x="40" y="60" width="200" height="200" fill="#1C2836"/><circle cx="190" cy="110" r="16" fill="#F3E6CF"/><circle cx="197" cy="105" r="14" fill="#1C2836"/>${st.garden?`<circle cx="100" cy="240" r="60" fill="url(#gd${id})"/><rect x="96" y="230" width="8" height="30" fill="#7C8A95"/>`:''}
   <rect x="36" y="56" width="208" height="208" fill="none" stroke="#5B6A7A" stroke-width="8"/>
   <g class="s9-cur" style="transform:translateX(${st.curtains?0:-70}px)"><rect x="40" y="52" width="104" height="${fy-52}" fill="#C9B99D" opacity=".96"/></g>
   <g class="s9-cur" style="transform:translateX(${st.curtains?0:70}px)"><rect x="136" y="52" width="104" height="${fy-52}" fill="#BDAE92" opacity=".96"/></g>
   <rect x="20" y="46" width="240" height="8" fill="${C.brass}"/>
   ${lightsOn?`<circle cx="420" cy="70" r="150" fill="url(#lp${id})"/><path d="M420 0 v40" stroke="#333" stroke-width="3"/><path d="M396 40 h48 l-10 24 h-28z" fill="${C.warm}"/>`:`<path d="M420 0 v40" stroke="#555" stroke-width="3"/><path d="M396 40 h48 l-10 24 h-28z" fill="#6E6A60"/>`}
   <rect x="290" y="120" width="130" height="80" rx="4" fill="${st.tv?'#111':'#2D5D7B'}" stroke="#222" stroke-width="5"/>${st.tv?'':'<path d="M300 180 l30 -30 l24 18 l30 -34 l26 30" stroke="#9CCFE0" stroke-width="4" fill="none"/>'}
   <rect x="470" y="70" width="110" height="34" rx="8" fill="#E9E4DA"/><path d="M482 96 h86" stroke="${st.ac?'#7FB7C2':'#C9C2B5'}" stroke-width="4"/>${st.ac?'<text x="525" y="94" font-size="16" font-family="Assistant,sans-serif" font-weight="800" fill="#14474A" text-anchor="middle">☾</text>':''}
   <rect x="560" y="170" width="70" height="170" fill="${C.wood}"/><circle cx="572" cy="260" r="6" fill="${C.brass}"/>${st.lock?`<rect x="574" y="250" width="16" height="14" rx="3" fill="#2E7D4F"/><path d="M577 250 v-6 a5 5 0 0 1 10 0 v6" stroke="#2E7D4F" stroke-width="3" fill="none"/>`:''}
   ${st.music?'':`<g fill="${lightsOn?'#F3E6CF':'#9CA9B5'}"><path d="M470 160 v-30 l18 -5 v28" stroke="currentColor"/><circle cx="466" cy="162" r="6"/><circle cx="484" cy="156" r="6"/><circle cx="510" cy="140" r="5"/><path d="M515 140 v-22" stroke="${lightsOn?'#F3E6CF':'#9CA9B5'}" stroke-width="3"/></g>`}`+
   sofa(290,fy,220,lightsOn?C.terra:'#5C3A33')+
   (st.path?`<ellipse cx="420" cy="${fy+20}" rx="240" ry="26" fill="url(#pt${id})"/>${[200,280,360,440,520].map(x=>`<rect x="${x}" y="${fy-6}" width="26" height="5" rx="2" fill="#FFE7B0"/>`).join('')}`:''))}

/* רגע היסטורי: דלתות המקדש של הרון */
function heronSvg(){return svg('0 0 640 420',`<defs>${G('fire9','#FFB347',.9)}</defs><rect width="640" height="420" fill="#F3E6CF"/><rect y="330" width="640" height="90" fill="${C.stone}"/>
  <path d="M240 90 L400 40 L560 90Z" fill="${C.terra}"/><rect x="250" y="90" width="300" height="16" fill="#E4D3B0"/>
  ${[270,320,480,530].map(x=>`<rect x="${x-9}" y="106" width="18" height="224" fill="#F7F1E6" stroke="#CDBFA4" stroke-width="2"/>`).join('')}
  <rect x="350" y="150" width="100" height="180" fill="#3A2A1C"/><circle cx="400" cy="230" r="22" fill="${C.brass}" opacity=".8"/>
  <g class="s9-door l"><rect x="350" y="150" width="50" height="180" fill="${C.wood}" stroke="#6B4F36" stroke-width="3"/></g>
  <g class="s9-door r"><rect x="400" y="150" width="50" height="180" fill="${C.oak}" stroke="#6B4F36" stroke-width="3"/></g>
  <rect x="100" y="250" width="90" height="80" fill="#E4D3B0" stroke="#C9B48A" stroke-width="3"/><rect x="92" y="240" width="106" height="12" fill="#C9B48A"/>
  <g class="s9-fire"><circle cx="145" cy="220" r="60" fill="url(#fire9)"/><path d="M145 240 q-24 -24 0 -60 q24 36 0 60z" fill="#F08A2A"/><path d="M145 240 q-10 -14 0 -32 q10 18 0 32z" fill="#FFD98A"/></g>
  <path d="M190 300 H300 V340 H400" stroke="#8C7A5E" stroke-width="4" stroke-dasharray="8 6" fill="none"/>`)}

/* טכנולוגיה נסתרת */
function hiddenSvg(){const fy=330;return svg('0 0 640 420',`<defs>${G('cove9','#FFE7B0',.7)}</defs><rect width="640" height="420" fill="${C.wall}"/><rect y="${fy}" width="640" height="90" fill="${C.floor}"/>
  <rect x="0" y="0" width="640" height="34" fill="#F6F0E4"/><rect x="0" y="34" width="640" height="18" fill="url(#cove9)"/><path d="M0 34 H640" stroke="#E2D4B8" stroke-width="3"/>
  <rect x="230" y="80" width="190" height="120" fill="${C.brass}"/><rect x="238" y="88" width="174" height="104" fill="#F4ECDD"/><circle cx="350" cy="130" r="30" fill="${C.terra}"/><rect x="258" y="140" width="80" height="44" fill="${C.lead}"/>
  <g opacity=".55">${[...Array(5)].map((_,r)=>[...Array(5)].map((_,c)=>`<circle cx="${92+c*9}" cy="${120+r*9}" r="2" fill="#B9AD98"/>`).join('')).join('')}</g>
  <rect x="500" y="40" width="110" height="${fy-40}" fill="#E7DCC6"/><rect x="496" y="34" width="118" height="12" rx="4" fill="#CFC4AE"/>
  <rect x="160" y="210" width="24" height="36" rx="5" fill="${C.brass}"/>`+sofa(210,fy,240,C.sage))}

/* חדר שינה בבוקר */
function bedroomSvg(){return svg('0 0 640 420',`<defs>${G('sun9','#FFE2A6',.9)}</defs><rect width="640" height="420" fill="#4E4A52" class="s9-dark"/><rect width="640" height="420" fill="${C.wall}" class="s9-day"/>
  <rect x="330" y="50" width="240" height="220" fill="#BFE0EC"/><circle cx="500" cy="110" r="70" fill="url(#sun9)"/><circle cx="500" cy="110" r="26" fill="${C.mustard}"/><path d="M330 220 q120 -40 240 0 V270 H330Z" fill="${C.sage}"/>
  <g class="s9-cl"><rect x="326" y="40" width="124" height="250" fill="#A89A82"/></g><g class="s9-cr"><rect x="450" y="40" width="124" height="250" fill="#9C8E77"/></g>
  <rect x="310" y="32" width="280" height="8" fill="${C.brass}"/>
  <rect y="330" width="640" height="90" fill="${C.floor}"/><rect x="40" y="240" width="250" height="100" rx="12" fill="#D9CFC0"/><rect x="40" y="200" width="250" height="60" rx="12" fill="${C.lead}"/><rect x="60" y="220" width="70" height="34" rx="10" fill="#F4ECDD"/>
  <g class="s9-lamp"><circle cx="40" cy="190" r="70" fill="url(#sun9)"/></g><rect x="20" y="180" width="40" height="30" fill="${C.cream}"/>
  <rect x="600" y="70" width="34" height="20" rx="5" fill="#E9E4DA"/>`)}

/* הצללה חכמה: חלון מערבי אחר הצהריים */
function shadeSvg(on,id){return svg('0 0 640 420',`<defs>${G('heat'+id,'#E8613A',.55)}${G('sn'+id,'#FFC86B',.9)}</defs><rect width="640" height="420" fill="${C.wall}"/><rect y="330" width="640" height="90" fill="${C.floor}"/>
  <rect x="60" y="60" width="240" height="220" fill="#F6C98A"/><circle cx="110" cy="220" r="90" fill="url(#sn${id})"/><circle cx="110" cy="220" r="28" fill="#F29C38"/>
  ${on?`<g>${[...Array(11)].map((_,i)=>`<rect x="60" y="${60+i*20}" width="240" height="16" fill="#CFC4AE" stroke="#B9AD98"/>`).join('')}</g>`:`<path d="M300 120 L520 330 L330 330 L300 280Z" fill="#FFD98A" opacity=".55"/><circle cx="430" cy="300" r="190" fill="url(#heat${id})"/>`}
  <rect x="56" y="56" width="248" height="228" fill="none" stroke="#FFF" stroke-width="8"/>`+sofa(360,330,220,C.lead)+
  `<g transform="translate(560 120)"><rect x="-12" y="-60" width="24" height="90" rx="12" fill="#FFF" stroke="${C.ink}" stroke-width="3"/><circle cx="0" cy="36" r="18" fill="${on?'#7FB7C2':'#E8613A'}" stroke="${C.ink}" stroke-width="3"/><rect x="-5" y="${on?-10:-48}" width="10" height="${on?46:84}" fill="${on?'#7FB7C2':'#E8613A'}"/></g>`)}

/* אור דרך בלילה */
function pathSvg(on,id){return svg('0 0 640 420',`<defs>${G('pl'+id,'#FFE7B0',.8)}</defs><rect width="640" height="420" fill="${C.night}"/><rect y="320" width="640" height="100" fill="#2D3846"/>
  <rect x="30" y="120" width="120" height="200" fill="#1C2836" stroke="#3E4C5C" stroke-width="6"/><rect x="490" y="120" width="120" height="200" fill="#1C2836" stroke="#3E4C5C" stroke-width="6"/>
  ${on?`<ellipse cx="320" cy="340" rx="300" ry="40" fill="url(#pl${id})"/>${[120,200,280,360,440,520].map(x=>`<rect x="${x}" y="314" width="34" height="6" rx="3" fill="#FFE7B0"/>`).join('')}<path d="M70 360 q120 30 250 10 t250 0" stroke="#FFE7B0" stroke-width="2" stroke-dasharray="4 8" fill="none" opacity=".7"/>`:''}
  <g transform="translate(${on?300:90} 320)" fill="${on?'#E9D7B8':'#46525F'}"><circle cx="0" cy="-128" r="14"/><path d="M-18 -110 h36 l6 60 h-10 l-4 50 h-22 l-4 -50 h-10z"/></g>
  <circle cx="560" cy="60" r="16" fill="#F3E6CF" opacity=".6"/>`)}

/* מתג על הקיר */
const SW={brass:['פליז','#C9A24B','#E7C978'],glass:['זכוכית לבנה','#F4F4F1','#FFFFFF'],stone:['אבן שחורה','#2E2F31','#4A4B4E']};
function switchSvg(m){const [_,a,b]=SW[m||'brass'];const ic=m==='stone'?'#E8DCC4':C.ink;
  return svg('0 0 640 420',`<defs><linearGradient id="sw${m}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></linearGradient></defs><rect width="640" height="420" fill="#E9C9A8"/>${[...Array(10)].map((_,i)=>`<path d="M${(i*67)%640} ${(i*41)%420} q20 -6 40 2" stroke="#D9B48E" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}
   <rect x="230" y="60" width="180" height="300" rx="18" fill="url(#sw${m})" stroke="${shade(a,-.3)}" stroke-width="3"/>
   ${[0,1,2].map(i=>`<rect x="252" y="${82+i*92}" width="136" height="76" rx="12" fill="${shade(a,m==='stone'?.08:-.06)}" stroke="${shade(a,-.25)}" stroke-width="2"/>`).join('')}
   <circle cx="320" cy="120" r="16" fill="none" stroke="${ic}" stroke-width="4"/>${[0,45,90,135,180,225,270,315].map(r=>`<path d="M320 96 v-8" stroke="${ic}" stroke-width="4" transform="rotate(${r} 320 120)"/>`).join('')}
   <g fill="${ic}"><circle cx="306" cy="205" r="9"/><circle cx="334" cy="205" r="9"/><path d="M290 228 q16 -18 32 0z M318 228 q16 -18 32 0z"/></g>
   <path d="M330 280 a22 22 0 1 0 0 34 a17 17 0 1 1 0 -34z" fill="${ic}"/>`)}

/* קיימות */
function ecoArt(k){switch(k){
  case 'rain':return svg('0 0 200 140',`<rect width="200" height="140" fill="#DDEBEE"/>${[...Array(12)].map((_,i)=>`<path d="M${10+i*16} ${10+(i%3)*8} l-4 12" stroke="#7FB7C2" stroke-width="3" stroke-linecap="round"/>`).join('')}<rect x="70" y="60" width="60" height="70" rx="8" fill="${C.lead}"/><path d="M70 80 h60" stroke="#7FB7C2" stroke-width="4"/><path d="M130 110 q30 0 40 20" stroke="${C.lead}" stroke-width="5" fill="none"/><rect y="130" width="200" height="10" fill="${C.sage}"/>`);
  case 'wood':return svg('0 0 200 140',`<rect width="200" height="140" fill="#E8EFE3"/>${[40,100,160].map(x=>`<path d="M${x} 130 v-40" stroke="#6B4F36" stroke-width="7"/><circle cx="${x}" cy="70" r="30" fill="${C.sage}"/>`).join('')}<path d="M70 130 v-14" stroke="#6B4F36" stroke-width="4"/><circle cx="70" cy="108" r="10" fill="#7BA05B"/><rect y="130" width="200" height="10" fill="#B9C98F"/>`);
  case 'shade':return svg('0 0 200 140',`<rect width="200" height="140" fill="${C.wall}"/><rect x="40" y="20" width="120" height="100" fill="#F6C98A"/>${[...Array(5)].map((_,i)=>`<rect x="40" y="${20+i*18}" width="120" height="14" fill="#CFC4AE"/>`).join('')}<circle cx="170" cy="24" r="14" fill="${C.mustard}"/>`);
  case 'led':return svg('0 0 200 140',`<rect width="200" height="140" fill="#2E3B4A"/><circle cx="100" cy="60" r="50" fill="#FFD98A" opacity=".25"/><path d="M84 70 a24 24 0 1 1 32 0 v16 h-32z" fill="#FFE7B0"/><rect x="86" y="90" width="28" height="16" rx="3" fill="#B9AD98"/>`);
 }return ''}

/* גשר: גלריה במוזיאון */
function bridgeArt(){return svg('0 0 400 300',`<rect width="400" height="300" fill="#F3EDE2"/><rect y="240" width="400" height="60" fill="${C.oak}"/><path d="M0 40 H400" stroke="#E2D4B8" stroke-width="6"/>
  <rect x="40" y="80" width="90" height="110" fill="${C.brass}"/><rect x="48" y="88" width="74" height="94" fill="${C.lead}"/><circle cx="85" cy="125" r="20" fill="${C.mustard}"/>
  <rect x="160" y="70" width="110" height="130" fill="${C.brass}"/><rect x="168" y="78" width="94" height="114" fill="#F4ECDD"/><path d="M175 180 L215 100 L255 180Z" fill="${C.terra}"/>
  <rect x="300" y="90" width="70" height="90" fill="${C.ink}"/><rect x="306" y="96" width="58" height="78" fill="${C.sage}"/>
  <rect x="190" y="215" width="50" height="25" fill="#FFF"/><path d="M215 215 v-20" stroke="#BBB" stroke-width="3"/><ellipse cx="215" cy="190" rx="12" ry="8" fill="#C9C2B5"/>`)}

const SEQ=['lights','tv','music','curtains','lock','ac','garden','path'];
function sceneText(st){return SEQ.filter(k=>st[k]).map(k=>ACT[k][0]).join(', ')+'.'}

function toggle2(el,ctx,o){
  const d=ctx.data;const tr=d.tr||(d.tr={});const keys=o.opts.map(x=>x[0]);const cur=d.cur||keys[0];
  const box=h('div',{class:'s3-draw s5-fin '+(o.cls||'s9-wide')},...o.opts.map(([k,_,art])=>h('div',{class:'lay'+(cur===k?' on':''),'data-k':k,html:art})),illus());
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':o.title},...o.opts.map(([k,t])=>h('button',{type:'button','data-k':k,'aria-pressed':String(cur===k),onclick:()=>show(k)},t)));
  function show(k){d.cur=k;tr[k]=1;ctx.save();box.querySelectorAll('.lay').forEach(i=>i.classList.toggle('on',i.dataset.k===k));btns.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));if(keys.every(x=>tr[x]))ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),copy(o.kicker,o.title,o.text)));
  return gate(ctx,keys.every(x=>tr[x]));
}
const ALLNIGHT={lights:1,tv:1,music:1,curtains:1,lock:1,ac:1,garden:1,path:1};

const screens=[

/* יחידה 1 */
{id:'open',title:'הבית החכם',hideNext:true,
 text:'ברוכה השבה, {name}. פעם בית חכם נשמע כמו מסכים, שלטים וכפתורים מסובכים. בווילה של היום זה הפוך: הטכנולוגיה נעלמת, והבית פשוט עושה את מה שצריך. היום תבני בעצמך תרחיש "לילה טוב", ותפעילי אותו בלחיצה אחת.',
 mount(el,ctx){
  const box=photo('assets/img/s9-open.jpg','סלון וילה בערב: אור נסתר בתקרה, תמונה על הקיר, וילונות חצי סגורים ופס אור נמוך לאורך הרצפה.','s9-wide',1);
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
    h('div',{class:'copy'},h('span',{class:'kicker'},'מפגש 9'),h('h1',null,'הבית החכם'),
      h('p',{class:'lede'},nameFill('ברוכה השבה, {name}. פעם בית חכם נשמע כמו מסכים, שלטים וכפתורים מסובכים. בווילה של היום זה הפוך: הטכנולוגיה נעלמת, והבית פשוט עושה את מה שצריך. היום תבני בעצמך תרחיש "לילה טוב", ותפעילי אותו בלחיצה אחת.')),
      h('button',{class:'cta',type:'button',onclick:ctx.next,html:'בואי נתחיל'+window.Salon.ICON.arrowL}))));
 }},

{id:'secrets',title:'ארבעה סודות',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'לבית חכם של וילה יש ארבעה סודות. היום נכיר את כולם.',
 mount(el,ctx){return flips(el,ctx,{kicker:'ארבעה סודות',title:'ארבעה סודות',lede:'לבית חכם של וילה יש ארבעה סודות. היום נכיר את כולם.',
  cards:['הטכנולוגיה נעלמת.','לחיצה אחת, הרבה פעולות.','הבית מצל על עצמו.','מתג יפה על הקיר.'].map((b,i)=>({t:'סוד '+(i+1),b}))})}},

{id:'heron',title:'רגע היסטורי: הדלתות של הרון',task:'לחצי על "הדליקי את האש", וראי מה קורה לדלתות.',wide:true,
 text:'רגע היסטורי. לפני כאלפיים שנה, באלכסנדריה, תיאר המהנדס הרון מכונה שפותחת את דלתות המקדש לבד. מדליקים אש על המזבח, האוויר מתחמם ודוחף מים, משקל יורד, והדלתות נפתחות. כבר אז חלמו על בית שעושה דברים בעצמו.',
 mount(el,ctx){
  const d=ctx.data;const res=h('div');
  const box=h('div',{class:'s3-draw s9-wide s9-heron'+(d.fire?' open':''),html:heronSvg()});box.append(illus());
  const btn=h('button',{class:'cta',type:'button',onclick:()=>{d.fire=!d.fire;d.tried=true;ctx.save();box.classList.toggle('open',!!d.fire);btn.textContent=d.fire?'כבי את האש':'הדליקי את האש';
    sayBox(res,d.fire?'<b>האש בוערת, והדלתות נפתחות לאט.</b> בלי שאף אחד נוגע בהן.':'<b>האש כבתה, והדלתות נסגרות.</b>');ctx.done()}},d.fire?'כבי את האש':'הדליקי את האש');
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
   copy('רגע היסטורי','הדלתות של הרון','רגע היסטורי. לפני כאלפיים שנה, באלכסנדריה, תיאר המהנדס הרון מכונה שפותחת את דלתות המקדש לבד. מדליקים אש על המזבח, האוויר מתחמם ודוחף מים, משקל יורד, והדלתות נפתחות. כבר אז חלמו על בית שעושה דברים בעצמו.',h('div',{class:'row',style:'margin-top:14px'},btn),res)));
  return gate(ctx,!!d.tried);
 }},

/* יחידה 2 */
{id:'hidden',title:'הטכנולוגיה נעלמת',task:'לחצי על ארבע הנקודות בציור.',wide:true,
 text:'הסוד הראשון: הטכנולוגיה נעלמת. בסלון של וילה חכמה לא רואים כבלים וקופסאות. הרמקולים בתוך הקיר, המסך נראה כמו תמונה, והאור מוסתר בתקרה. רק נהנים מהתוצאה.',
 mount(el,ctx){
  const box=h('div',{class:'s2-pic s3-draw s9-wide',html:hiddenSvg()});box.append(illus());
  return spots(el,ctx,{kicker:'הסוד הראשון',title:'הטכנולוגיה נעלמת',lede:'הסוד הראשון: הטכנולוגיה נעלמת. בסלון של וילה חכמה לא רואים כבלים וקופסאות. הרמקולים בתוך הקיר, המסך נראה כמו תמונה, והאור מוסתר בתקרה. רק נהנים מהתוצאה.',
   box,credit:'המחשה',
   pts:[{x:51,y:33,name:'מסך',t:'המסך: כשהוא כבוי, הוא נראה כמו תמונה ממוסגרת.'},{x:17,y:33,name:'רמקול',t:'הרמקול: מוסתר בתוך הקיר, ורק הצליל נשאר.'},{x:50,y:9,name:'אור',t:'האור: פס אור נסתר בתקרה, בלי מנורה גלויה.'},{x:87,y:45,name:'וילון',t:'הווילון: נע לבד, בשקט, בלי חבלים.'}]});
 }},

{id:'scenes',title:'לחיצה אחת, הרבה פעולות',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'הסוד השני. תרחיש (Scene) הוא כמה פעולות שקורות יחד, בלחיצה אחת. הווילונות, האורות, המזגן והמוזיקה פועלים בתיאום. במקום עשרה מתגים, כפתור אחד.',
 mount(el,ctx){return flips(el,ctx,{kicker:'הסוד השני',title:'לחיצה אחת, הרבה פעולות',lede:'הסוד השני. תרחיש (Scene) הוא כמה פעולות שקורות יחד, בלחיצה אחת. הווילונות, האורות, המזגן והמוזיקה פועלים בתיאום. במקום עשרה מתגים, כפתור אחד.',cls:'s3-secrets s9-three',
  cards:[{t:'בוקר טוב',b:'הווילונות נפתחים לאט, אור רך נדלק, והמזגן מתכוונן לטמפרטורה נעימה.'},{t:'אירוח',b:'אור חם ומעומעם בסלון, מוזיקה שקטה, ואור בגינה.'},{t:'לילה טוב',b:'האורות כבים, הווילונות נסגרים, והדלת ננעלת.'}]})}},

{id:'morning',title:'בוקר טוב',task:'לחצי על הכפתור "בוקר טוב".',wide:true,
 text:'נסי בעצמך. חדר שינה בבוקר, עוד חשוך. לחיצה אחת על "בוקר טוב": הווילונות נפתחים לאט, המנורה נדלקת רך, והמזגן מתכוונן. את רק מתעוררת.',
 mount(el,ctx){
  const d=ctx.data;const res=h('div');
  const box=h('div',{class:'s3-draw s9-wide s9-bed'+(d.on?' on':''),html:bedroomSvg()});box.append(illus());
  const btn=h('button',{class:'cta',type:'button',onclick:()=>{d.on=!d.on;ctx.save();box.classList.toggle('on',!!d.on);btn.textContent=d.on?'החשיכי שוב':'בוקר טוב';if(d.on){sayBox(res,'<b>בוקר טוב.</b> שלוש פעולות, לחיצה אחת.');ctx.done()}}},d.on?'החשיכי שוב':'בוקר טוב');
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
   copy('נסי בעצמך','בוקר טוב','נסי בעצמך. חדר שינה בבוקר, עוד חשוך. לחיצה אחת על "בוקר טוב": הווילונות נפתחים לאט, המנורה נדלקת רך, והמזגן מתכוונן. את רק מתעוררת.',h('div',{class:'row',style:'margin-top:14px'},btn),res)));
  if(d.on)sayBox(res,'<b>בוקר טוב.</b> שלוש פעולות, לחיצה אחת.');
  return gate(ctx,!!d.on);
 }},

{id:'shading',title:'הבית מצל על עצמו',task:'לחצי על "בלי הצללה" ועל "הצללה חכמה".',wide:true,
 text:'הסוד השלישי. זוכרת את החלון המערבי ממפגש 3? אחר הצהריים השמש הנמוכה מחממת אותו. הצללה חכמה מורידה את התריס לבד, בשעה הנכונה, עוד לפני שהחדר מתחמם.',
 mount(el,ctx){return toggle2(el,ctx,{kicker:'הסוד השלישי',title:'הבית מצל על עצמו',text:'הסוד השלישי. זוכרת את החלון המערבי ממפגש 3? אחר הצהריים השמש הנמוכה מחממת אותו. הצללה חכמה מורידה את התריס לבד, בשעה הנכונה, עוד לפני שהחדר מתחמם.',
  opts:[['off','בלי הצללה',shadeSvg(false,'a')],['on','הצללה חכמה',shadeSvg(true,'b')]]})}},

{id:'path',title:'אור שמוביל בלילה',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'בלילה, חיישן תנועה (Motion Sensor) מזהה שקמת, ומדליק אור רך ונמוך לאורך הרצפה, מחדר השינה ועד חדר הרחצה. רואים את הדרך, בלי לסנוור ובלי להעיר אף אחד.',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,pathSvg(false,'a'),pathSvg(true,'b'),'מסדרון חשוך','אור דרך')),
   copy('נוחות היא יוקרה','אור שמוביל בלילה','בלילה, חיישן תנועה (Motion Sensor) מזהה שקמת, ומדליק אור רך ונמוך לאורך הרצפה, מחדר השינה ועד חדר הרחצה. רואים את הדרך, בלי לסנוור ובלי להעיר אף אחד.')));
  return gate(ctx,ctx.data.cut!=null&&ctx.data.cut!==50);
 }},

/* יחידה 3 */
{id:'switch',title:'מתג יפה על הקיר',task:'בחרי חומר למתג.',wide:true,
 text:'הסוד הרביעי. לא צריך טלפון כדי לנהל את הבית. על הקיר יש מתג מעוצב, עם כפתורים גדולים וברורים, ונעים למגע. מתג מפליז או מזכוכית הוא חלק מהעיצוב, כמו תכשיט על הקיר.',
 mount(el,ctx){
  const d=ctx.data;const res=h('div');const box=h('div',{class:'s3-draw s9-wide'});
  const MSG={brass:'<b>פליז.</b> חם ונוצץ, ומשתלב עם מנורות ופרזול בגוון זהב.',glass:'<b>זכוכית לבנה.</b> נקי ושקט, כמעט נעלם על קיר בהיר.',stone:'<b>אבן שחורה.</b> דרמטי ועכשווי, בולט על קיר בהיר.'};
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':'חומר המתג'});
  function draw(){box.innerHTML=switchSvg(d.m);box.append(illus());
   btns.replaceChildren(...Object.entries(SW).map(([k,[t]])=>h('button',{type:'button','aria-pressed':String(d.m===k),onclick:()=>{d.m=k;ctx.save();draw();sayBox(res,MSG[k]);ctx.done()}},t)))}
  draw();if(d.m)sayBox(res,MSG[d.m]);
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),
   copy('הסוד הרביעי','מתג יפה על הקיר','הסוד הרביעי. לא צריך טלפון כדי לנהל את הבית. על הקיר יש מתג מעוצב, עם כפתורים גדולים וברורים, ונעים למגע. מתג מפליז או מזכוכית הוא חלק מהעיצוב, כמו תכשיט על הקיר.',res)));
  return gate(ctx,!!d.m);
 }},

{id:'eco',title:'יוקרה שחוסכת',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'יוקרה של היום היא גם אחריות. בית יפה יכול גם לחסוך: במים, בחשמל ובחומרים. ארבע דוגמאות מווילות חכמות.',
 mount(el,ctx){
  const th=k=>()=>h('span',{class:'s3-draw thumb',html:ecoArt(k)});
  return flips(el,ctx,{kicker:'קיימות',title:'יוקרה שחוסכת',lede:'יוקרה של היום היא גם אחריות. בית יפה יכול גם לחסוך: במים, בחשמל ובחומרים. ארבע דוגמאות מווילות חכמות.',cls:'s3-flips',
   cards:[{t:'מי גשם',front:th('rain'),b:'נאספים במכל, ומשקים את הגינה.'},{t:'עץ מיער מנוהל',front:th('wood'),b:'עץ מיערות שנוטעים בהם מחדש.'},{t:'הצללה בזמן',front:th('shade'),b:'תריס שיורד בזמן, ופחות צריך לקרר.'},{t:'אור חסכוני',front:th('led'),b:'תרחיש "לילה טוב" מכבה כל מה שנשכח דולק.'}]});
 }},

{id:'mynight',title:'התרחיש שלך',task:'בחרי לפחות ארבע פעולות לתרחיש "לילה טוב".',wide:true,
 text:'בעלי וילה ברמת השרון ביקשו תרחיש "לילה טוב" לכפתור שליד המיטה. את המעצבת. בחרי אילו פעולות יקרו בלחיצה אחת, וראי את הבית משתנה.',
 mount(el,ctx){
  const st=ctx.data.st||(ctx.data.st={});const res=h('div');const box=h('div',{class:'s3-draw s9-wide s9-house'});
  const list=h('div',{class:'s9-acts',role:'group','aria-label':'פעולות התרחיש'});
  const n=()=>Object.keys(st).filter(k=>st[k]).length;
  function draw(){box.innerHTML=houseSvg(st,'b');box.append(illus());
   list.replaceChildren(...SEQ.map(k=>h('button',{type:'button','aria-pressed':String(!!st[k]),onclick:()=>{st[k]=st[k]?0:1;ctx.save();draw();check()}},h('span',{class:'mk','aria-hidden':'true'},st[k]?'✓':''),ACT[k][0])))}
  function check(){const c=n();if(c>=4){sayBox(res,nameFill('<b>'+c+' פעולות, כפתור אחד.</b> תרחיש של מעצבת, {name}.'));ctx.done()}else if(c>0)sayBox(res,'בחרת '+c+'. עוד '+(4-c)+' לפחות.');else res.replaceChildren()}
  draw();check();
  el.append(head('רגע WOW','התרחיש שלך','בעלי וילה ברמת השרון ביקשו תרחיש "לילה טוב" לכפתור שליד המיטה. את המעצבת. בחרי אילו פעולות יקרו בלחיצה אחת, וראי את הבית משתנה.'),
   h('div',{class:'s3-simwrap s9-wrap'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},list,res)));
  return gate(ctx,n()>=4);
 }},

{id:'run',title:'לילה טוב',task:'לחצי על "לילה טוב", ואחר כך שמרי במחברת.',wide:true,
 text:'הגיע הזמן לבדוק את התרחיש שלך, {name}. ערב בווילה, הכול עוד דולק. לחיצה אחת, וצפי בבית מתכונן לשינה.',
 mount(el,ctx){
  const st=((ctx.all.mynight||{}).st)||{};const d=ctx.data;const res=h('div');
  const chosen=SEQ.filter(k=>st[k]);
  if(chosen.length<4){el.append(h('div',{class:'center'},h('div',null,h('h2',null,'לילה טוב'),h('p',{class:'lede'},'התרחיש עוד לא מוכן. חזרי מסך אחד אחורה ובחרי לפחות ארבע פעולות.'))));return gate(ctx,false)}
  const box=h('div',{class:'s3-draw s9-wide'});const cur={};
  const draw=()=>{box.innerHTML=houseSvg(cur,'r');box.append(illus())};
  const text=sceneText(st);
  const save=h('button',{class:'cta',type:'button',disabled:!d.ran,onclick:()=>{
    const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='scene9'&&n.session===9);
    if(old){old.text=text;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:'scene9',title:'תרחיש "לילה טוב" שלי',text});
    d.saved=true;ctx.save();sayBox(res,'<b>נשמר במחברת שלך.</b>');ctx.done()}},'שמרי במחברת');
  const run=h('button',{class:'btn s9-run',type:'button',onclick:()=>{run.disabled=true;Object.keys(cur).forEach(k=>delete cur[k]);draw();let i=0;
    const step=()=>{if(i>=chosen.length){d.ran=true;ctx.save();run.disabled=false;save.disabled=false;sayBox(res,'<b>לילה טוב.</b> '+chosen.length+' פעולות, לחיצה אחת.');return}
      cur[chosen[i]]=1;draw();sayBox(res,ACT[chosen[i]][0]+'.');i++;setTimeout(step,700)};setTimeout(step,300)}},'☾ לילה טוב');
  draw();if(d.ran){chosen.forEach(k=>cur[k]=1);draw()}
  el.append(h('div',{class:'split media s2-split s7-eve s9-runsplit'},h('div',{class:'s2-media'},box),
   copy('הפעלה','לילה טוב',nameFill('הגיע הזמן לבדוק את התרחיש שלך, {name}. ערב בווילה, הכול עוד דולק. לחיצה אחת, וצפי בבית מתכונן לשינה.'),h('p',{class:'s3-sum'},text),h('div',{class:'row',style:'margin-top:12px'},run,save),res)));
  if(d.saved)sayBox(res,'<b>נשמר במחברת שלך.</b>');
  return gate(ctx,!!d.saved);
 }},

/* יחידה 4 */
{id:'check1',title:'בדיקה 1',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה זה תרחיש בבית חכם?',[['כמה פעולות יחד, בלחיצה אחת'],['מסך גדול בסלון'],['שלט נפרד לכל מנורה']]),
 mount(el,ctx){const v=drawBox(switchSvg('brass'),'s9-wide');
  return quiz(el,ctx,{kicker:'בדיקה 1',lede:'ארבע שאלות קצרות על מה שראית היום.',q:'מה זה תרחיש בבית חכם?',visual:v,
  opts:[['כמה פעולות יחד, בלחיצה אחת',1],['מסך גדול בסלון',0],['שלט נפרד לכל מנורה',0]],hint:'היזכרי בכפתור "בוקר טוב".',right:'<b>נכון.</b> במקום עשרה מתגים, כפתור אחד.'})}},

{id:'check2',title:'בדיקה 2',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה עושה הצללה חכמה אחר הצהריים?',[['מורידה תריס לפני שהחדר מתחמם'],['מדליקה את כל האורות'],['פותחת את החלון לרווחה']]),
 mount(el,ctx){const v=drawBox(shadeSvg(false,'q'),'s9-wide');
  return quiz(el,ctx,{kicker:'בדיקה 2',q:'מה עושה הצללה חכמה אחר הצהריים?',visual:v,
  opts:[['מורידה תריס לפני שהחדר מתחמם',1],['מדליקה את כל האורות',0],['פותחת את החלון לרווחה',0]],hint:'חשבי על השמש הנמוכה במערב.',right:'<b>נכון.</b> הבית מצל על עצמו, בזמן.'})}},

{id:'check3',title:'בדיקה 3',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה פתחה המכונה של הרון, בעזרת אש?',[['את דלתות המקדש'],['את שער העיר'],['ברז של מזרקה']]),
 mount(el,ctx){const v=drawBox(heronSvg(),'s9-wide');
  return quiz(el,ctx,{kicker:'בדיקה 3',q:'מה פתחה המכונה של הרון, בעזרת אש?',visual:v,
  opts:[['את דלתות המקדש',1],['את שער העיר',0],['ברז של מזרקה',0]],hint:'היזכרי ברגע ההיסטורי.',right:'<b>נכון.</b> לפני כאלפיים שנה, באלכסנדריה.'})}},

{id:'check4',title:'בדיקה 4',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה עושה חיישן תנועה במסדרון בלילה?',[['מדליק אור רך לאורך הדרך'],['מדליק את כל הבית'],['משמיע צלצול']]),
 mount(el,ctx){const v=drawBox(pathSvg(true,'q'),'s9-wide');
  return quiz(el,ctx,{kicker:'בדיקה 4',q:'מה עושה חיישן תנועה במסדרון בלילה?',visual:v,
  opts:[['מדליק אור רך לאורך הדרך',1],['מדליק את כל הבית',0],['משמיע צלצול',0]],hint:'רואים את הדרך, ואף אחד לא מתעורר.',right:nameFill('<b>נכון.</b> אור נמוך, בלי לסנוור. <b>ארבע מתוך ארבע, {name}.</b>')})}},

/* יחידה 5 */
{id:'home-idea',title:'רעיון לבית',task:'אם תרצי, כתבי את הכפתור שלך ושמרי במחברת.',
 text:'רעיון לבית, למי שרוצה. חשבי על הבוקר שלך: אילו שלושה דברים את עושה מיד כשאת קמה? אם היה לך כפתור אחד, מה היה קורה בלחיצה? אפשר להתחיל בצעד קטן, כמו מנורת לילה עם חיישן.',
 mount(el,ctx){ideaScreen(el,ctx,{n:9,media:h('div',{class:'s6-ideaimg',html:switchSvg('brass')}),field:'הכפתור שלי היה עושה',
  text:'רעיון לבית, למי שרוצה. חשבי על הבוקר שלך: אילו שלושה דברים את עושה מיד כשאת קמה? אם היה לך כפתור אחד, מה היה קורה בלחיצה? אפשר להתחיל בצעד קטן, כמו מנורת לילה עם חיישן.'})}},

{id:'summary',title:'סיכום',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',
 mount(el,ctx){
  const th=html=>()=>h('span',{class:'s3-draw thumb',html});
  return flips(el,ctx,{kicker:'סיכום',title:'ארבעה כללים',lede:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',cls:'s3-flips',toggle:true,
   cards:[{t:'הטכנולוגיה נעלמת',front:th(hiddenSvg()),b:'רמקול בקיר, מסך שנראה כמו תמונה, ואור נסתר.'},
    {t:'לחיצה אחת',front:th(houseSvg(ALLNIGHT,'su')),b:'תרחיש: בוקר טוב, אירוח, לילה טוב. כפתור אחד.'},
    {t:'הבית מצל על עצמו',front:th(shadeSvg(true,'su')),b:'התריס יורד בזמן, והחדר נשאר נעים.'},
    {t:'מתג יפה על הקיר',front:th(switchSvg('brass')),b:'כפתורים גדולים וברורים, מפליז, זכוכית או אבן.'}]});
 }},

{id:'audio',title:'סקירה קולית',task:'לחצי על הנגן כדי לשמוע.',skip:()=>!audioOK,
 text:'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.',
 mount(el,ctx){audioScreen(el,ctx,9)}},

{id:'feedback',title:'משוב וגשר',task:'דרגי בלחיצה, ואם תרצי, כתבי גם כמה מילים.',wide:true,hideNext:true,
 say:'{name}, סיימת את מפגש 9. פתחת דלתות של מקדש, בחרת מתג ובנית תרחיש "לילה טוב". ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
 mount(el,ctx){feedbackScreen(el,ctx,{n:9,open:'{name}, סיימת את מפגש 9. פתחת דלתות של מקדש, בחרת מתג ובנית תרחיש "לילה טוב". ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
  bridgeMedia:drawBox(bridgeArt(),'s7-bridge'),
  bridge:'במפגש הבא: סיור במוזיאוני עיצוב. תטיילי בין אוספים מפורסמים, ותהיי האוצרת שבוחרת מה יוצג.'})}}
];

window.Salon.register(9,screens);
})();
