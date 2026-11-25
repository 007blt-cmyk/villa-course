/* הסלון של מזל · מפגש 5: סוד הצבעים והחומרים
   בלוק נתונים ורכיבים של המפגש. לא נוגע במנוע ולא במפגשים 1 עד 4. */
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
const HERO={src:'assets/img/s3-salon',alt:'סלון וילה פתוח אל הגן: קירות בהירים, עץ, אבן ובד, ופסי אור על הרצפה.'};
const MET_BLUE='https://www.metmuseum.org/art/collection/search/568012';
let audioOK=false;
fetch('assets/audio/s5.m4a',{method:'HEAD'}).then(r=>{audioOK=r.ok}).catch(()=>{});
const hero=(sz,extra)=>h('img',Object.assign({src:HERO.src+(sz==='sm'?'-sm':'')+'.jpg',alt:HERO.alt,decoding:'async'},extra||{}));

/* ---------- צבעים ---------- */
const C={ink:'#1A3A35',lead:'#14474A',terra:'#C65A3C',mustard:'#E0A63A',sage:'#9DB39A',paper:'#F7F0E4',cream:'#F2E6CF',brass:'#C9A24B',stone:'#E4D3B0',stoneD:'#C9B48A',wood:'#B9824F'};
const PAL={
  cream:['שמנת','#F2E6CF',0],stone:['אבן בהירה','#E4D3B0',0],greige:['אפור-בז\'','#CFC6B8',0],sage:['מרווה','#A9BDA3',0],
  terra:['טרקוטה','#C65A3C',1],mustard:['חרדל','#E0A63A',1],petrol:['ירוק נפט','#14474A',1],navy:['כחול עמוק','#1F3A5F',1],olive:['ירוק זית','#6B7A3A',1]
};
const col=k=>(PAL[k]||PAL.cream)[1];
const bold=k=>!!(PAL[k]||[])[2];
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const m=x=>Math.max(0,Math.min(255,Math.round(f<0?x*(1+f):x+(255-x)*f)));return '#'+[m(r),m(g),m(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}

/* הסלון של המערבל: 60 קירות ורצפה, 30 ספה וילונות ושטיח, 10 כריות אגרטל ותמונה */
function mixRoom(p){
  const a=col(p.c60),b=col(p.c30),c=col(p.c10);
  return svg('0 0 640 420',`<rect width="640" height="300" fill="${a}"/><rect y="300" width="640" height="120" fill="${shade(a,-.18)}"/>
  <path d="M0 300h640" stroke="${shade(a,-.3)}" stroke-width="3"/>
  <rect x="40" y="40" width="150" height="200" fill="#E8F0F2" stroke="${shade(a,-.35)}" stroke-width="6"/><path d="M40 170c40-20 90-24 150-6v76H40z" fill="#B7C9A9"/>
  <path d="M20 26h200" stroke="${C.ink}" stroke-width="5"/><path d="M26 30c10 70 6 150 12 236h34c-8-90-4-170 6-236z" fill="${b}"/><path d="M214 30c-10 70-6 150-12 236h-34c8-90 4-170-6-236z" fill="${b}"/>
  <rect x="360" y="70" width="120" height="90" fill="${c}" stroke="${C.brass}" stroke-width="6"/><path d="M372 140l30-34 22 22 18-16 26 28z" fill="${shade(c,.35)}"/>
  <ellipse cx="400" cy="372" rx="210" ry="34" fill="${b}" opacity=".9"/><ellipse cx="400" cy="372" rx="170" ry="24" fill="none" stroke="${shade(b,.3)}" stroke-width="3"/>
  <rect x="270" y="214" width="270" height="70" rx="20" fill="${b}"/><rect x="254" y="250" width="302" height="66" rx="18" fill="${shade(b,-.12)}"/>
  <rect x="244" y="226" width="40" height="90" rx="16" fill="${shade(b,-.2)}"/><rect x="526" y="226" width="40" height="90" rx="16" fill="${shade(b,-.2)}"/>
  <path d="M270 316v14M540 316v14" stroke="${C.ink}" stroke-width="6"/>
  <rect x="296" y="230" width="58" height="40" rx="10" fill="${c}"/><rect x="456" y="230" width="58" height="40" rx="10" fill="${c}"/><rect x="380" y="236" width="50" height="34" rx="10" fill="${shade(c,.25)}"/>
  <rect x="586" y="250" width="40" height="66" fill="${C.wood}"/><path d="M596 250c-6-24 2-44 10-56 8 12 16 32 10 56z" fill="${c}"/>`,'role="img"');
}
function bar(p){return h('div',{class:'s5-bar','aria-label':'חלוקת הצבע'},...[['c60',60],['c30',30],['c10',10]].map(([k,w])=>h('span',{style:`flex:${w};background:${col(p[k])};color:${bold(p[k])?'#fff':'#1A3A35'}`},w+'%')))}

/* חומרים */
function tex(k,id){
  id=id||k;
  const T={
   marble:`<defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7F4EE"/><stop offset="1" stop-color="#E7E2D8"/></linearGradient></defs><rect width="300" height="300" fill="url(#${id}g)"/><path d="M-10 60c60 10 90 60 160 50s120 40 170 30M-10 190c50-20 110 30 170 0s100 10 150-10M40 300c20-60 80-80 120-140" stroke="#B9B2A6" stroke-width="3" fill="none" opacity=".8"/><path d="M60 0c10 40 60 70 50 120" stroke="#CFC7B8" stroke-width="2" fill="none"/>`,
   oak:`<rect width="300" height="300" fill="#C69C6A"/>${Array.from({length:14},(_,i)=>`<path d="M0 ${i*22+6}c80 ${i%3?6:-8} 150 ${i%2?-6:10} 300 ${i%4?4:-6}" stroke="${i%2?'#A97F4E':'#B98E5C'}" stroke-width="${i%3?2:4}" fill="none"/>`).join('')}<ellipse cx="190" cy="140" rx="26" ry="9" fill="none" stroke="#8E6438" stroke-width="3"/>`,
   linen:`<rect width="300" height="300" fill="#DCCFB6"/>${Array.from({length:60},(_,i)=>`<path d="M0 ${i*5+1}h300" stroke="${i%3?'#CFC1A5':'#E7DCC6'}" stroke-width="1.6"/>`).join('')}${Array.from({length:60},(_,i)=>`<path d="M${i*5+2} 0v300" stroke="#C9BA9C" stroke-width="1" opacity=".6"/>`).join('')}<path d="M40 220c60-20 120 10 200-14" stroke="#BFAE8E" stroke-width="5" fill="none" opacity=".6"/>`,
   velvet:`<defs><linearGradient id="${id}v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E6B5A"/><stop offset=".45" stop-color="#4E8B76"/><stop offset=".55" stop-color="#2A5E50"/><stop offset="1" stop-color="#1E4A40"/></linearGradient></defs><rect width="300" height="300" fill="url(#${id}v)"/><path d="M0 120c90-30 200 40 300 0v40c-100 40-210-30-300 0z" fill="#fff" opacity=".08"/>`,
   concrete:`<rect width="300" height="300" fill="#B5B2AC"/>${Array.from({length:70},(_,i)=>`<circle cx="${(i*73)%300}" cy="${(i*131)%300}" r="${1.5+(i%4)}" fill="${i%2?'#9D9A94':'#C8C5BF'}"/>`).join('')}<path d="M0 150h300" stroke="#A3A09A" stroke-width="2" opacity=".6"/>`,
   brass:`<defs><linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B8902F"/><stop offset=".5" stop-color="#DDBB6A"/><stop offset="1" stop-color="#B08A2E"/></linearGradient></defs><rect width="300" height="300" fill="url(#${id}b)"/>${Array.from({length:50},(_,i)=>`<path d="M0 ${i*6+2}h300" stroke="#F0D894" stroke-width=".8" opacity=".5"/>`).join('')}`,
   wool:`<rect width="300" height="300" fill="#E8DFCF"/>${Array.from({length:12},(_,r)=>Array.from({length:12},(_,c)=>`<path d="M${c*26+(r%2?13:0)} ${r*26+20}q6-14 12 0q6-14 12 0" stroke="#CDBFA6" stroke-width="3" fill="none"/>`).join('')).join('')}`,
   glass:`<rect width="300" height="300" fill="#CFE3E6"/><path d="M0 300L300 0" stroke="#fff" stroke-width="22" opacity=".45"/><path d="M60 300L300 60" stroke="#fff" stroke-width="8" opacity=".4"/><rect width="300" height="300" fill="none" stroke="#9FC0C6" stroke-width="10"/>`
  };
  return svg('0 0 300 300',T[k],'preserveAspectRatio="xMidYMid slice"');
}
const MAT={
  marble:['שיש','קר','קריר וחלק. העורקים מציירים בו קווים, ואין שני לוחות זהים.'],
  oak:['עץ אלון','חם','חם ונעים. הסיבים יוצרים קווים רכים, והיד מרגישה אותם.'],
  linen:['פשתן','חם','בד מחוספס מעט, עם קמטים טבעיים. נראה נינוח ואוורירי.'],
  velvet:['קטיפה','חם','רכה ועמוקה. כשמלטפים אותה, הגוון משתנה עם האור.'],
  concrete:['בטון','קר','אפור ומחוספס, עם נקבוביות קטנות. נראה חזק ושקט.'],
  brass:['פליז מוברש','קר','מתכת בגוון זהב, עם קווים דקים של הברשה. מחזירה אור רך.'],
  wool:['צמר','חם','רך, עבה ומחמם. שטיח צמר מזמין להוריד נעליים.'],
  glass:['זכוכית','קר','שקופה וחלקה. כמעט נעלמת, ומשאירה את המבט פתוח.']
};

/* הכחול המצרי: המחשה */
function blueArt(ground){
  return svg('0 0 600 400',`<rect width="600" height="400" fill="#E9DDC4"/>
  <rect x="330" y="40" width="240" height="320" fill="#E2D2B2" stroke="#C9B48A" stroke-width="4"/>
  <g class="eb-wall" opacity="${ground?1:0}"><path d="M350 90h200M350 310h200" stroke="#1F4FA0" stroke-width="12"/>
   ${[0,1,2,3].map(i=>`<g transform="translate(${372+i*48} 150)"><path d="M12 0c-12 30-12 60 0 90 12-30 12-60 0-90z" fill="#2B63B8"/><path d="M12 90c-22-14-30-40-26-60 12 14 22 34 26 60zM12 90c22-14 30-40 26-60-12 14-22 34-26 60z" fill="#3E7BCF"/></g>`).join('')}
   <path d="M350 270h200" stroke="#C65A3C" stroke-width="8"/></g>
  <ellipse cx="160" cy="320" rx="130" ry="26" fill="#B79E73"/><path d="M40 300c10-50 70-80 120-80s110 30 120 80z" fill="#CDB58A"/><ellipse cx="160" cy="300" rx="120" ry="24" fill="#BCA27A"/>
  <g class="eb-lump" opacity="${ground?0:1}"><path d="M110 280c-6-30 20-56 52-54 30 2 52 22 46 50-4 20-40 30-60 28-22-2-36-8-38-24z" fill="#2B63B8"/><path d="M130 250c10-10 30-12 40-6" stroke="#6E9BE0" stroke-width="5" fill="none"/></g>
  <g class="eb-powder" opacity="${ground?1:0}"><ellipse cx="160" cy="292" rx="80" ry="14" fill="#2B63B8"/><ellipse cx="150" cy="288" rx="40" ry="6" fill="#6E9BE0"/></g>
  <path d="M250 150l-40 120" stroke="#8B6440" stroke-width="16" stroke-linecap="round"/><circle cx="252" cy="146" r="14" fill="#8B6440"/>`,'role="img"');
}

/* חם לצד קר: פינת אי */
function pairArt(warm){
  const stool=x=>warm?`<rect x="${x}" y="250" width="56" height="16" rx="6" fill="${C.wood}"/><path d="M${x+6} 266l-6 80M${x+50} 266l6 80M${x+4} 316h48" stroke="#8B5A2B" stroke-width="7"/><rect x="${x+4}" y="236" width="48" height="16" rx="6" fill="#D9CBB0"/>`:`<rect x="${x}" y="250" width="56" height="10" rx="4" fill="#9AA0A6"/><path d="M${x+28} 260v86M${x+8} 346h40" stroke="#7D838A" stroke-width="6"/>`;
  return svg('0 0 600 400',`<defs><pattern id="pc${warm?1:0}" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#BDBAB4"/><circle cx="10" cy="12" r="2" fill="#A3A09A"/><circle cx="30" cy="28" r="2.5" fill="#CAC7C1"/></pattern></defs>
  <rect width="600" height="300" fill="url(#pc${warm?1:0})"/><rect y="300" width="600" height="100" fill="${warm?'#C8A57A':'#D7D4CE'}"/>
  <rect x="80" y="170" width="440" height="22" fill="#F4F1EB" stroke="#CFC7B8" stroke-width="2"/><path d="M100 176c80 6 160-4 240 4s120-2 160 2" stroke="#BDB5A8" stroke-width="2" fill="none"/>
  <rect x="96" y="192" width="408" height="120" fill="#EDEAE4" stroke="#CFC7B8" stroke-width="2"/>
  ${stool(150)}${stool(270)}${stool(390)}
  ${warm?`<ellipse cx="420" cy="166" rx="44" ry="10" fill="#8B5A2B"/><path d="M380 166c4 14 76 14 80 0" fill="#A06A38"/><rect x="460" y="60" width="90" height="110" fill="#D9CBB0"/><path d="M470 80h70M470 100h70M470 120h70" stroke="#C4B394" stroke-width="2"/>`:`<path d="M410 150h40l-6 16h-28z" fill="#B9C2C8"/>`}
  <path d="M300 0v70" stroke="#333" stroke-width="2"/><path d="M276 70h48l-8 20h-32z" fill="${warm?C.brass:'#9AA0A6'}"/>`,'role="img"');
}

/* מט מול מבריק */
function finishArt(polished){
  return svg('0 0 600 400',`<defs><linearGradient id="fa${polished?1:0}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${polished?'#FFFFFF':'#F1ECE3'}"/><stop offset="1" stop-color="${polished?'#E2DCD2':'#E6E0D5'}"/></linearGradient></defs>
  <rect width="600" height="400" fill="#E7DCCB"/><rect y="290" width="600" height="110" fill="#BFA27C"/>
  <path d="M90 170h420l40 70H50z" fill="url(#fa${polished?1:0})" stroke="#CFC7B8" stroke-width="2"/>
  <path d="M120 190c90 8 180-6 260 6s100 0 140 2M90 220c120-8 200 10 300 0" stroke="#C3BBAE" stroke-width="2" fill="none"/>
  <rect x="50" y="240" width="500" height="18" fill="#D9D2C6"/><path d="M100 258v110M500 258v110" stroke="#8B6440" stroke-width="12"/>
  <path d="M270 40h60l-10 30h-40z" fill="${C.brass}"/><path d="M300 0v40" stroke="#333" stroke-width="2"/>
  ${polished?`<ellipse cx="300" cy="200" rx="56" ry="10" fill="#FFF7D6" opacity=".95"/><path d="M170 186l60 40M380 180l70 46" stroke="#fff" stroke-width="10" opacity=".85"/><path d="M280 196h40" stroke="#FFF" stroke-width="5"/>`:`<ellipse cx="300" cy="204" rx="120" ry="18" fill="#FFF1C8" opacity=".35"/>`}
  <ellipse cx="200" cy="196" rx="34" ry="8" fill="#A9583A"/><path d="M180 196c-4-30 10-44 20-50 10 6 24 20 20 50" fill="#C65A3C"/>`,'role="img"');
}

/* לוח החומרים של מזל */
const FLOOR={stone:['אבן בהירה','marble'],oak:['עץ אלון','oak'],concrete:['בטון מוחלק','concrete']};
const FAB={linen:['פשתן','linen'],velvet:['קטיפה','velvet'],wool:['צמר','wool']};
const QUIET=['cream','stone','greige','sage'],BOLD=['terra','mustard','petrol','navy','olive'];
function boardSvg(b,id){
  id=id||'bd';const inner=(k,x,y,w,hh,r)=>`<g transform="translate(${x} ${y})"><clipPath id="${id}${k}c"><rect width="${w}" height="${hh}" rx="${r||10}"/></clipPath><g clip-path="url(#${id}${k}c)"><g transform="scale(${w/300} ${hh/300})">${tex(k,id+k).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g></g></g>`;
  const wall=col(b.wall||'cream'),acc=col(b.accent||'terra');
  return svg('0 0 600 400',`<rect width="600" height="400" fill="#E9E1D3"/>
  <rect x="24" y="24" width="250" height="352" rx="12" fill="${wall}"/><text x="149" y="360" text-anchor="middle" font-family="Assistant,sans-serif" font-weight="800" font-size="22" fill="${bold(b.wall)?'#fff':'#1A3A35'}">60%</text>
  ${b.floor?inner(FLOOR[b.floor][1],296,24,280,150):`<rect x="296" y="24" width="280" height="150" rx="10" fill="none" stroke="#B9AE98" stroke-width="3" stroke-dasharray="10 8"/>`}
  ${b.fabric?inner(FAB[b.fabric][1],296,192,180,184):`<rect x="296" y="192" width="180" height="184" rx="10" fill="none" stroke="#B9AE98" stroke-width="3" stroke-dasharray="10 8"/>`}
  <circle cx="530" cy="250" r="${b.accent?44:40}" fill="${b.accent?acc:'none'}" stroke="${b.accent?'none':'#B9AE98'}" stroke-width="3" stroke-dasharray="${b.accent?'':'10 8'}"/>
  <rect x="500" y="320" width="60" height="44" rx="6" fill="${C.brass}"/><path d="M506 330h48M506 342h48M506 354h48" stroke="#E8CF86" stroke-width="1.5"/>`,'role="img"');
}
function boardText(b){return 'קירות ב'+PAL[b.wall][0]+', רצפת '+FLOOR[b.floor][0]+', ספה מ'+FAB[b.fabric][0]+', ונגיעה של '+PAL[b.accent][0]+'.'}
const prevDraw=window.Salon.drawNote;
window.Salon.drawNote=function(it){if(it.kind==='board5'&&it.board){return h('div',{class:'s3-nb',html:boardSvg(it.board,'nb'+it.ts)})}return prevDraw?prevDraw(it):null};

/* ציור מטבח לגשר */
function kitchenMini(){return svg('0 0 300 300',`<rect width="300" height="300" fill="#EFE6D6"/><rect y="220" width="300" height="80" fill="#C8A57A"/>
 <rect x="20" y="70" width="260" height="70" fill="${C.lead}"/><path d="M85 70v70M150 70v70M215 70v70" stroke="#0E3638" stroke-width="2"/>
 <rect x="20" y="150" width="260" height="8" fill="#F4F1EB"/><rect x="20" y="158" width="260" height="62" fill="${C.lead}"/>
 <rect x="60" y="196" width="180" height="12" fill="#F4F1EB"/><rect x="68" y="208" width="164" height="62" fill="#E4D3B0"/>
 <path d="M110 0v40M190 0v40" stroke="#333" stroke-width="2"/><path d="M96 40h28l-6 14h-16zM176 40h28l-6 14h-16z" fill="${C.brass}"/>`,'role="img"')}

/* ---------- המסכים ---------- */
const screens=[

/* יחידה 1 */
{id:'open',title:'סוד הצבעים והחומרים',hideNext:true,
 text:'ברוכה השבה, {name}. במפגש הקודם הדלקת את האור. עכשיו, כשהכול מואר, רואים את הצבעים ואת החומרים. היום תערבבי פלטה לסלון שלם, ותתקרבי אל האבן, העץ והבד עד שכמעט אפשר לגעת.',
 mount(el,ctx){
  el.append(h('div',{class:'split'},h('div',{class:'s2-arch'},h('div',{class:'arch-back'}),h('div',{class:'frame'},hero('lg'),aiTag())),
    h('div',{class:'copy'},h('span',{class:'kicker'},'מפגש 5'),h('h1',null,'סוד הצבעים והחומרים'),
      h('p',{class:'lede'},nameFill('ברוכה השבה, {name}. במפגש הקודם הדלקת את האור. עכשיו, כשהכול מואר, רואים את הצבעים ואת החומרים. היום תערבבי פלטה לסלון שלם, ותתקרבי אל האבן, העץ והבד עד שכמעט אפשר לגעת.')),
      h('button',{class:'cta',type:'button',onclick:ctx.next,html:'בואי נתחיל'+window.Salon.ICON.arrowL}))));
 }},

{id:'secrets',title:'ארבעה סודות',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'לצבעים ולחומרים של וילה יש ארבעה סודות. היום נכיר את כולם.',
 mount(el,ctx){return flips(el,ctx,{kicker:'ארבעה סודות',title:'ארבעה סודות',lede:'לצבעים ולחומרים של וילה יש ארבעה סודות. היום נכיר את כולם.',
  cards:['את הצבע מחלקים: 60, 30 ו-10.','חומר חם לצד חומר קר.','המרקם עושה את העבודה.','מט מרגיע, ברק מדגיש.'].map((b,i)=>({t:'סוד '+(i+1),b}))})}},

{id:'blue',title:'רגע היסטורי: הכחול המצרי',task:'לחצי על האבן הכחולה כדי לטחון אותה.',wide:true,
 text:'רגע היסטורי. לפני כחמשת אלפים שנה, במצרים, נולד הצבע הראשון שאדם ייצר בעצמו: הכחול המצרי (Egyptian Blue). עד אז צבעו רק במה שנמצא בטבע. המצרים ערבבו חול, סיד ונחושת, וקיבלו כחול עמוק. בו צבעו ציורי קיר.',
 mount(el,ctx){
  const box=h('button',{type:'button',class:'s3-draw s5-blue'+(ctx.data.g?' g':''),'aria-label':'האבן הכחולה. לחצי כדי לטחון אותה',html:blueArt(!!ctx.data.g)});box.append(illus());
  box.addEventListener('click',()=>{ctx.data.g=!ctx.data.g;ctx.data.tried=true;ctx.save();box.innerHTML=blueArt(ctx.data.g);box.append(illus());ctx.done()});
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
   copy('רגע היסטורי','הכחול המצרי','רגע היסטורי. לפני כחמשת אלפים שנה, במצרים, נולד הצבע הראשון שאדם ייצר בעצמו: הכחול המצרי (Egyptian Blue). עד אז צבעו רק במה שנמצא בטבע. המצרים ערבבו חול, סיד ונחושת, וקיבלו כחול עמוק. בו צבעו ציורי קיר.',
    linkCard(MET_BLUE,'גוש של כחול מצרי, באתר המוזיאון','The Metropolitan Museum of Art, 36.3.202'))));
  return gate(ctx,!!ctx.data.tried);
 }},

/* יחידה 2 */
{id:'rule',title:'כלל 60-30-10',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'מעצבים מחלקים את הצבע בחדר לפי כלל פשוט: כלל 60-30-10 (The 60-30-10 Rule). צבע אחד שולט, צבע שני תומך, וצבע שלישי נותן ניצוץ.',
 mount(el,ctx){
  const th=(a,b,c)=>()=>h('span',{class:'s3-draw thumb',html:mixRoom({c60:a,c30:b,c10:c})});
  return flips(el,ctx,{kicker:'הכלל',title:'כלל 60-30-10',lede:'מעצבים מחלקים את הצבע בחדר לפי כלל פשוט: כלל 60-30-10 (The 60-30-10 Rule). צבע אחד שולט, צבע שני תומך, וצבע שלישי נותן ניצוץ.',cls:'s3-flips s4-three s5-rule',
   cards:[{t:'הצבע השולט',front:()=>[h('span',{class:'s5-big'},'60%')],b:'הרקע של החדר: הקירות, הרצפה והרהיטים הגדולים.'},
    {t:'הצבע המשני',front:()=>[h('span',{class:'s5-big'},'30%')],b:'תומך ומוסיף עומק: וילונות, כורסאות, שטיח.'},
    {t:'צבע הדגש',front:()=>[h('span',{class:'s5-big'},'10%')],b:'הנגיעה הקטנה שנותנת אופי: כריות, מנורה, תמונה.'}]});
 }},

{id:'mixer',title:'המערבל',task:'בחרי צבע לכל אחד משלושת התפקידים, ונסי כמה פלטות.',wide:true,
 text:'זה המערבל של המעצבת. בחרי צבע לקירות, צבע לספה ולווילונות, וצבע לכריות ולתמונה. הסלון מתחלף מול העיניים.',
 mount(el,ctx){
  const d=ctx.data;const p=d.p||(d.p={c60:'cream',c30:'sage',c10:'terra'});const tr=d.tr||(d.tr={});
  const box=h('div',{class:'s3-draw s5-room'});const ctr=h('div',{class:'s5-ctrls'});const msg=h('div',{class:'say s3-msg',role:'status'});const barBox=h('div');
  const ok=()=>tr.c60&&tr.c30&&tr.c10&&(tr.n||0)>=4;
  function line(){if(bold(p.c60))return 'קיר שלם בצבע חזק. מרשים, אבל כבד לעין.';if(p.c60===p.c30)return 'הספה נבלעת בקיר. צבע משני אחר ייתן לה עומק.';if(!bold(p.c10))return 'יפה ושקט. צבע דגש חזק יותר ייתן ניצוץ.';return 'בדיוק ככה: רקע שקט, צבע שתומך, וניצוץ קטן של צבע.'}
  function sw(role,lbl){return h('div',{class:'s5-role'},h('b',null,lbl),h('div',{class:'s5-sw',role:'group','aria-label':lbl},...Object.keys(PAL).map(k=>h('button',{type:'button','aria-pressed':String(p[role]===k),title:PAL[k][0],'aria-label':PAL[k][0],style:'--c:'+PAL[k][1],onclick:()=>{p[role]=k;tr[role]=1;tr.n=(tr.n||0)+1;ctx.save();draw()}}))))}
  function draw(){box.innerHTML=mixRoom(p);box.append(illus());barBox.replaceChildren(bar(p));
   ctr.replaceChildren(sw('c60','60% · קירות ורצפה'),sw('c30','30% · ספה, וילונות ושטיח'),sw('c10','10% · כריות ותמונה'));msg.textContent=line();if(ok())ctx.done()}
  el.append(head('רגע WOW','המערבל','זה המערבל של המעצבת. בחרי צבע לקירות, צבע לספה ולווילונות, וצבע לכריות ולתמונה. הסלון מתחלף מול העיניים.'),
   h('div',{class:'s3-simwrap s5-mixwrap'},h('div',{class:'s3-simcol'},box,barBox),h('div',{class:'s3-side'},ctr,msg)));
  draw();
  return gate(ctx,ok());
 }},

{id:'fix',title:'שלושה סלונים',task:'תקני את הצבעים בכל סלון, ולחצי על "זה הסלון שלי".',wide:true,
 text:'שלושה סלונים, ובכל אחד משהו לא מסתדר. השתמשי בכלל 60-30-10 ותקני אותם.',
 mount(el,ctx){
  const d=ctx.data;const solved=d.solved||(d.solved={});let n=d.n||1;
  const PRE={1:{c60:'terra',c30:'cream',c10:'sage'},2:{c60:'cream',c30:'stone',c10:'cream'},3:{c60:'greige',c30:'greige',c10:'navy'}};
  const st=d.st||(d.st=JSON.parse(JSON.stringify(PRE)));
  const SIT={1:'הקירות בצבע הכי חזק בחדר, והכריות שקטות.',2:'הכול בהיר ונעים, אבל משהו חסר.',3:'הספה כמעט נעלמת בתוך הקיר.'};
  const box=h('div',{class:'s3-draw s5-room'});const res=h('div',{class:'s4-res'});box.append(res);const ctr=h('div',{class:'s5-ctrls'});const tabs=h('div',{class:'s3-tabs'});const card=h('div',{class:'s4-card'});
  function draw(){const p=st[n];box.querySelector('svg')&&box.querySelector('svg').remove();box.insertAdjacentHTML('afterbegin',mixRoom(p));if(!box.querySelector('.ai-tag'))box.append(illus());
   tabs.replaceChildren(...[1,2,3].map(i=>h('button',{type:'button','aria-pressed':String(i===n),class:solved[i]?'ok':'',onclick:()=>{n=i;d.n=i;ctx.save();res.replaceChildren();draw()}},(solved[i]?'✓ ':'')+'סלון '+i)),
    h('button',{class:'cta s4-mine',type:'button',onclick:judge},'זה הסלון שלי'));
   card.replaceChildren(h('p',{class:'s3-sit'},h('b',null,'סלון '+n+'. '),SIT[n]));
   const sw=(role,lbl)=>h('div',{class:'s5-role'},h('b',null,lbl),h('div',{class:'s5-sw',role:'group','aria-label':lbl},...Object.keys(PAL).map(k=>h('button',{type:'button','aria-pressed':String(p[role]===k),title:PAL[k][0],'aria-label':PAL[k][0],style:'--c:'+PAL[k][1],onclick:()=>{p[role]=k;ctx.save();draw()}}))));
   ctr.replaceChildren(sw('c60','60%'),sw('c30','30%'),sw('c10','10%'));
   if([1,2,3].every(i=>solved[i]))ctx.done()}
  function judge(){const p=st[n];let bad=null;
   if(bold(p.c60))bad='הקירות עדיין צועקים. העבירי את הצבע החזק לתפקיד הקטן, של ה-10%.';
   else if(p.c30===p.c60)bad='הספה נבלעת בקיר. בחרי לה צבע משני אחר.';
   else if(!bold(p.c10))bad='יפה, אבל הכול נבלע. חסר צבע דגש חזק ב-10%.';
   if(bad){sayBox(res,bad);return}
   solved[n]=true;ctx.save();sayBox(res,[1,2,3].every(i=>solved[i])?nameFill('<b>בדיוק.</b> שלושה סלונים, שלוש פלטות. <b>ככה עובדת מעצבת, {name}.</b>'):'<b>בדיוק.</b> רקע שקט, צבע שתומך, וניצוץ קטן של צבע.');draw()}
  el.append(head('המשימה','שלושה סלונים','שלושה סלונים, ובכל אחד משהו לא מסתדר. השתמשי בכלל 60-30-10 ותקני אותם.'),
   h('div',{class:'s3-simwrap s5-mixwrap s5-fix'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},tabs,card,ctr)));
  draw();
  return gate(ctx,[1,2,3].every(i=>solved[i]));
 }},

/* יחידה 3 */
{id:'warmcold',title:'חם או קר',task:'לחצי על חומר, ואחר כך על התיבה שלו.',wide:true,
 text:'חומרים, כמו צבעים, הם חמים או קרים. שיש, בטון וזכוכית מרגישים קרירים ונקיים. עץ, פשתן וצמר מרגישים חמים ורכים.',
 mount(el,ctx){return sorter(el,ctx,{kicker:'מיון',title:'חם או קר',lede:'חומרים, כמו צבעים, הם חמים או קרים. שיש, בטון וזכוכית מרגישים קרירים ונקיים. עץ, פשתן וצמר מרגישים חמים ורכים.',poolCls:'s4-pool6 s5-pool',
  items:[['marble','שיש','c'],['oak','עץ אלון','w'],['linen','פשתן','w'],['concrete','בטון','c'],['wool','צמר','w'],['glass','זכוכית','c']],
  bins:[['w','חומר חם'],['c','חומר קר']],art:k=>tex(k,'so'+k),
  hint:'כמעט. חשבי: החומר הזה מרגיש קריר ביד, או חמים ורך?',doneMsg:'<b>שלושה חמים, שלושה קרים. הכול במקום.</b>'})}},

{id:'wall',title:'קיר החומרים',task:'לחצי על כל אחד מששת החומרים כדי להתקרב אליו.',wide:true,
 text:'התקרבי אל החומרים. לכל חומר יש מרקם (Texture): מה שהעין רואה והיד מרגישה. בבית יוקרה המרקם עושה את העבודה של דוגמה.',
 mount(el,ctx){
  const d=ctx.data;const seen=d.seen||(d.seen={});let cur=d.cur||null;
  const K=['marble','oak','linen','velvet','concrete','brass'];
  const grid=h('div',{class:'s5-wall'});const zoom=h('div',{class:'s5-zoom'});
  function draw(){grid.replaceChildren(...K.map(k=>h('button',{type:'button',class:'s5-tile'+(seen[k]?' seen':'')+(cur===k?' on':''),'aria-label':MAT[k][0],onclick:()=>{cur=k;d.cur=k;seen[k]=1;ctx.save();draw()}},h('span',{class:'tx',html:tex(k,'w'+k)}),h('span',{class:'nm'},MAT[k][0]))));
   zoom.replaceChildren(...(cur?[h('div',{class:'s5-lensbox'},h('div',{class:'lens',html:tex(cur,'z'+cur)}),illus()),h('div',{class:'cap'},h('b',null,MAT[cur][0]+'. '),MAT[cur][2])]:[h('p',{class:'s3-sit'},'לחצי על חומר, והוא יתקרב לכאן.')]));
   if(cur){const l=zoom.querySelector('.lens');l.classList.remove('in');void l.offsetWidth;l.classList.add('in')}
   if(K.every(k=>seen[k]))ctx.done()}
  el.append(head('רגע WOW','קיר החומרים','התקרבי אל החומרים. לכל חומר יש מרקם (Texture): מה שהעין רואה והיד מרגישה. בבית יוקרה המרקם עושה את העבודה של דוגמה.'),h('div',{class:'s5-wallrow'},grid,zoom));
  draw();
  return gate(ctx,K.every(k=>seen[k]));
 }},

{id:'pair',title:'חם לצד קר',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'הסוד הוא לשלב. אי משיש וקיר בטון נראים יוקרתיים, אבל קרים. כיסאות מעץ, כריות מפשתן וקערת עץ מחממים את הפינה. החם והקר מדגישים זה את זה.',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,pairArt(false),pairArt(true),'רק קר','קר וחם')),
   copy('הסוד השני','חם לצד קר','הסוד הוא לשלב. אי משיש וקיר בטון נראים יוקרתיים, אבל קרים. כיסאות מעץ, כריות מפשתן וקערת עץ מחממים את הפינה. החם והקר מדגישים זה את זה.')));
  return gate(ctx,ctx.data.cut!=null&&ctx.data.cut!==50);
 }},

{id:'finish',title:'מט או מבריק',task:'לחצי על "מבריק" ועל "מט".',wide:true,
 text:'גם לגימור יש אופי. שיש מלוטש (Polished) מבריק כמו מראה, ומחזיר את האור. שיש מט (Honed) רך לעין ונראה כמו אבן טבעית. בסלון שקט, מט מרגיע. ברק קטן, כמו פליז, מוסיף נגיעה.',
 mount(el,ctx){
  const d=ctx.data;const tr=d.tr||(d.tr={});const cur=d.cur||'pol';
  const box=h('div',{class:'s3-draw s2-fade s5-fin'},h('div',{class:'lay'+(cur==='pol'?' on':''),'data-k':'pol',html:finishArt(true)}),h('div',{class:'lay'+(cur==='hon'?' on':''),'data-k':'hon',html:finishArt(false)}),illus());
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':'מבריק או מט'},...[['pol','מבריק'],['hon','מט']].map(([k,t])=>h('button',{type:'button','data-k':k,'aria-pressed':String(cur===k),onclick:()=>show(k)},t)));
  function show(k){d.cur=k;tr[k]=1;ctx.save();box.querySelectorAll('.lay').forEach(i=>i.classList.toggle('on',i.dataset.k===k));btns.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));if(tr.pol&&tr.hon)ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),
   copy('הסוד הרביעי','מט או מבריק','גם לגימור יש אופי. שיש מלוטש (Polished) מבריק כמו מראה, ומחזיר את האור. שיש מט (Honed) רך לעין ונראה כמו אבן טבעית. בסלון שקט, מט מרגיע. ברק קטן, כמו פליז, מוסיף נגיעה.')));
  return gate(ctx,!!(tr.pol&&tr.hon));
 }},

/* יחידה 4 */
{id:'board',title:'לוח החומרים שלך',task:'בחרי צבע לקירות, רצפה, בד לספה וצבע דגש.',wide:true,
 text:'כל מעצבת מתחילה מלוח חומרים (Moodboard): דוגמיות של צבע, אבן, עץ ובד על לוח אחד. עכשיו תורך. ארבע בחירות, ואין כאן בחירה לא נכונה.',
 mount(el,ctx){
  const b=ctx.data.b||(ctx.data.b={});const res=h('div');
  const box=h('div',{class:'s3-draw s5-board'});const ctr=h('div',{class:'s3-ctrls'});
  const ok=()=>!!(b.wall&&b.floor&&b.fabric&&b.accent);
  const MSG={wall:k=>'<b>'+PAL[k][0]+':</b> רקע שקט, שעליו כל השאר יבלוט.',floor:{stone:'<b>אבן בהירה:</b> קרירה ואלגנטית, ומחזירה את האור.',oak:'<b>עץ אלון:</b> חם ונעים לרגליים, ומחמם את כל החדר.',concrete:'<b>בטון מוחלק:</b> מודרני ושקט. בד רך לידו יחמם אותו.'},
   fabric:{linen:'<b>פשתן:</b> נינוח ואוורירי.',velvet:'<b>קטיפה:</b> עמוקה ונוצצת באור.',wool:'<b>צמר:</b> רך ומחמם.'},accent:k=>'<b>'+PAL[k][0]+':</b> הניצוץ של ה-10%. בכריות, באגרטל או בתמונה.'};
  function draw(){box.innerHTML=boardSvg(b,'mb');box.append(illus());
   ctr.replaceChildren(chipRow('קירות',QUIET.map(k=>[k,PAL[k][0]]),b.wall,k=>pick('wall',k)),chipRow('רצפה',Object.entries(FLOOR).map(([k,v])=>[k,v[0]]),b.floor,k=>pick('floor',k)),
    chipRow('בד לספה',Object.entries(FAB).map(([k,v])=>[k,v[0]]),b.fabric,k=>pick('fabric',k)),chipRow('צבע דגש',BOLD.map(k=>[k,PAL[k][0]]),b.accent,k=>pick('accent',k)));
   if(ok())ctx.done()}
  function pick(g,k){b[g]=k;ctx.save();draw();const m=MSG[g];sayBox(res,typeof m==='function'?m(k):m[k])}
  el.append(head('המשימה','לוח החומרים שלך','כל מעצבת מתחילה מלוח חומרים (Moodboard): דוגמיות של צבע, אבן, עץ ובד על לוח אחד. עכשיו תורך. ארבע בחירות, ואין כאן בחירה לא נכונה.'),
   h('div',{class:'s3-simwrap s5-boardwrap'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},ctr,res)));
  draw();
  return gate(ctx,ok());
 }},

{id:'myboard',title:'הלוח שלך',task:'שמרי את הלוח במחברת.',wide:true,
 text:'זה לוח החומרים שלך, {name}. ככה מעצבות מציגות ללקוחות את הבית לפני שבונים אותו.',
 mount(el,ctx){
  const b=((ctx.all.board||{}).b)||{};const res=h('div');
  if(!(b.wall&&b.floor&&b.fabric&&b.accent)){el.append(h('div',{class:'center'},h('div',null,h('h2',null,'הלוח שלך'),h('p',{class:'lede'},'הלוח עוד לא מוכן. חזרי מסך אחד אחורה והשלימי אותו.'))));return gate(ctx,false)}
  const text=boardText(b);
  const box=h('div',{class:'s3-draw s5-board',html:boardSvg(b,'my')});box.append(illus());
  const btn=h('button',{class:'cta',type:'button',onclick:()=>{
    const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='board5'&&n.session===5);
    if(old){old.board=JSON.parse(JSON.stringify(b));old.text=text;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:'board5',svg:true,title:'לוח החומרים שלי',board:JSON.parse(JSON.stringify(b)),text});
    ctx.data.saved=true;ctx.save();sayBox(res,'<b>נשמר במחברת שלך.</b>');ctx.done()}},'שמרי במחברת');
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
   copy('הלוח שלך','הלוח שלך',nameFill('זה לוח החומרים שלך, {name}. ככה מעצבות מציגות ללקוחות את הבית לפני שבונים אותו.'),h('p',{class:'s3-sum'},text),h('div',{class:'row',style:'margin-top:12px'},btn),res)));
  if(ctx.data.saved)sayBox(res,'<b>נשמר במחברת שלך.</b>');
  return gate(ctx,!!ctx.data.saved);
 }},

/* יחידה 5 */
{id:'check1',title:'בדיקה 1',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('בכלל 60-30-10, איפה שמים את צבע הדגש?',[['בכריות, במנורה ובתמונה'],['על כל הקירות'],['על כל הרצפה']]),
 mount(el,ctx){const v=drawBox(mixRoom({c60:'cream',c30:'sage',c10:'terra'}));
  return quiz(el,ctx,{kicker:'בדיקה 1',lede:'ארבע שאלות קצרות על מה שראית היום.',q:'בכלל 60-30-10, איפה שמים את צבע הדגש?',visual:v,
  opts:[['בכריות, במנורה ובתמונה',1],['על כל הקירות',0],['על כל הרצפה',0]],hint:'צבע הדגש הוא ה-10%. כמה מקום הוא תופס?',right:'<b>נכון.</b> נגיעה קטנה, שנותנת לכל החדר אופי.'})}},

{id:'check2',title:'בדיקה 2',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('איזה מהחומרים האלה הוא חומר חם?',[['עץ אלון'],['שיש'],['בטון']]),
 mount(el,ctx){const v=h('div',{class:'s5-three'},...['oak','marble','concrete'].map(k=>h('div',{class:'s5-sq',html:tex(k,'q2'+k)})),illus());
  return quiz(el,ctx,{kicker:'בדיקה 2',q:'איזה מהחומרים האלה הוא חומר חם?',visual:v,
  opts:[['עץ אלון',1],['שיש',0],['בטון',0]],hint:'חשבי איזה חומר מרגיש חמים ונעים ביד.',right:'<b>נכון.</b> עץ מחמם, ולצד שיש או בטון הוא מדגיש אותם.'})}},

{id:'check3',title:'בדיקה 3',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה עשו במצרים לפני כחמשת אלפים שנה?',[['ייצרו צבע כחול מחול, סיד ונחושת'],['צבעו את כל הבתים בלבן'],['הביאו שיש מאיטליה']]),
 mount(el,ctx){const v=drawBox(blueArt(true));
  return quiz(el,ctx,{kicker:'בדיקה 3',q:'מה עשו במצרים לפני כחמשת אלפים שנה?',visual:v,
  opts:[['ייצרו צבע כחול מחול, סיד ונחושת',1],['צבעו את כל הבתים בלבן',0],['הביאו שיש מאיטליה',0]],hint:'היזכרי באבן הכחולה שטחנת.',right:'<b>נכון.</b> הכחול המצרי, הצבע הראשון שאדם ייצר בעצמו.'})}},

{id:'check4',title:'בדיקה 4',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('רוצים סלון רגוע. איזה גימור מתאים לשולחן השיש?',[['מט, רך לעין'],['מלוטש ומבריק כמו מראה'],['מכוסה בזכוכית']]),
 mount(el,ctx){const v=drawBox(finishArt(false));
  return quiz(el,ctx,{kicker:'בדיקה 4',q:'רוצים סלון רגוע. איזה גימור מתאים לשולחן השיש?',visual:v,
  opts:[['מט, רך לעין',1],['מלוטש ומבריק כמו מראה',0],['מכוסה בזכוכית',0]],hint:'איזה גימור מחזיר פחות אור?',right:nameFill('<b>נכון.</b> מט מרגיע, וברק קטן נשמר לנגיעה. <b>ארבע מתוך ארבע, {name}.</b>')})}},

/* יחידה 6 */
{id:'home-idea',title:'רעיון לבית',task:'אם תרצי, כתבי מה הנחת על המגש ושמרי במחברת.',
 text:'רעיון לבית, למי שרוצה. הניחי על מגש שלושה דברים קטנים מהבית: משהו מבד, משהו מעץ, ומשהו מאבן או ממתכת. הצבעים והמרקמים משלימים זה את זה? ככה מתחיל כל לוח חומרים.',
 mount(el,ctx){ideaScreen(el,ctx,{n:5,media:h('div',{style:'position:relative;height:100%'},hero('lg'),aiTag()),field:'מה הנחתי על המגש',
  text:'רעיון לבית, למי שרוצה. הניחי על מגש שלושה דברים קטנים מהבית: משהו מבד, משהו מעץ, ומשהו מאבן או ממתכת. הצבעים והמרקמים משלימים זה את זה? ככה מתחיל כל לוח חומרים.'})}},

{id:'summary',title:'סיכום',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',
 mount(el,ctx){
  const th=html=>()=>h('span',{class:'s3-draw thumb',html});
  return flips(el,ctx,{kicker:'סיכום',title:'ארבעה כללים',lede:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',cls:'s3-flips',toggle:true,
   cards:[{t:'60, 30 ו-10',front:th(mixRoom({c60:'cream',c30:'sage',c10:'terra'})),b:'רקע שקט, צבע שתומך, וניצוץ קטן של צבע.'},
    {t:'חם לצד קר',front:th(pairArt(true)),b:'שיש ובטון לצד עץ, פשתן וצמר. כל אחד מדגיש את השני.'},
    {t:'המרקם עושה את העבודה',front:th(tex('velvet','sm1')),b:'עורקי השיש, סיבי העץ ואריג הבד מחליפים דוגמה.'},
    {t:'מט מרגיע, ברק מדגיש',front:th(finishArt(false)),b:'משטח מט רך לעין. ברק קטן, כמו פליז, הוא הנגיעה.'}]});
 }},

{id:'audio',title:'סקירה קולית',task:'לחצי על הנגן כדי לשמוע.',skip:()=>!audioOK,
 text:'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.',
 mount(el,ctx){audioScreen(el,ctx,5)}},

{id:'feedback',title:'משוב וגשר',task:'דרגי בלחיצה, ואם תרצי, כתבי גם כמה מילים.',wide:true,hideNext:true,
 say:'{name}, סיימת את מפגש 5. ערבבת פלטות, תיקנת שלושה סלונים ובנית לוח חומרים משלך. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
 mount(el,ctx){feedbackScreen(el,ctx,{n:5,open:'{name}, סיימת את מפגש 5. ערבבת פלטות, תיקנת שלושה סלונים ובנית לוח חומרים משלך. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
  bridgeMedia:h('div',{style:'position:relative'},h('div',{class:'s4-board',html:kitchenMini()}),illus()),
  bridge:'במפגש הבא: המטבח, לב הבית. תזיזי אי מטבח, תמדדי את המעברים סביבו, ותגלי איך מטבח הופך למקום של אירוח.'})}}
];

window.Salon.register(5,screens);
})();
