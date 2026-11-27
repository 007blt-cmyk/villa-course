/* הסלון של מזל · מפגש 7: הלבשת הבית ואמנות
   בלוק נתונים ורכיבים של המפגש. לא נוגע במנוע ולא במפגשים 1 עד 6. */
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
const PANELS={src:'assets/img/s6-bridge.jpg',alt:'ארבעה לוחות עץ מגולפים תלויים יחד על קיר בהיר ויוצרים עיגול אחד, מעל כורסת עץ, עם עץ בעציץ ושטיח.'};
let audioOK=false;
fetch('assets/audio/s7.m4a',{method:'HEAD'}).then(r=>{audioOK=r.ok}).catch(()=>{});

/* ---------- צבעים ---------- */
const C={ink:'#1A3A35',lead:'#14474A',terra:'#C65A3C',mustard:'#E0A63A',sage:'#9DB39A',paper:'#F7F0E4',cream:'#F2E6CF',brass:'#C9A24B',stone:'#E4D3B0',wood:'#B9824F',oak:'#C69C6A',wall:'#EFE6D6',floor:'#D9C29C'};

/* ---------- רכיבי ציור ---------- */
function wallFloor(W,H,fy,eve){return `<rect width="${W}" height="${fy}" fill="${eve?'#5B5146':C.wall}"/><rect y="${fy}" width="${W}" height="${H-fy}" fill="${eve?'#6E5A40':C.floor}"/><line x1="0" y1="${fy}" x2="${W}" y2="${fy}" stroke="${eve?'#4A4036':'#C9B48A'}" stroke-width="3"/>`}
function sofa(x,y,w,col){col=col||C.lead;const d=shade(col,-.25);
  return `<g><rect x="${x}" y="${y-58}" width="${w}" height="40" rx="12" fill="${d}"/><rect x="${x-12}" y="${y-40}" width="26" height="42" rx="10" fill="${d}"/><rect x="${x+w-14}" y="${y-40}" width="26" height="42" rx="10" fill="${d}"/><rect x="${x+8}" y="${y-30}" width="${w-16}" height="26" rx="8" fill="${col}"/><rect x="${x-6}" y="${y}" width="6" height="12" fill="#5A3E28"/><rect x="${x+w}" y="${y}" width="6" height="12" fill="#5A3E28"/></g>`}
function abstractArt(x,y,w,hh,id){return `<g><rect x="${x-5}" y="${y-5}" width="${w+10}" height="${hh+10}" fill="${C.brass}"/><rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="#F4ECDD"/>
  <circle cx="${x+w*.62}" cy="${y+hh*.42}" r="${Math.min(w,hh)*.3}" fill="${C.terra}"/><rect x="${x+w*.12}" y="${y+hh*.5}" width="${w*.5}" height="${hh*.36}" fill="${C.lead}"/><path d="M${x+w*.1} ${y+hh*.3} Q${x+w*.4} ${y+hh*.1} ${x+w*.55} ${y+hh*.35}" stroke="${C.mustard}" stroke-width="${Math.max(3,w*.04)}" fill="none"/></g>`}
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const m=x=>Math.max(0,Math.min(255,Math.round(f<0?x*(1+f):x+(255-x)*f)));return '#'+[m(r),m(g),m(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function plantPot(x,y,s){s=s||1;return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-22 0 L-18 -40 L18 -40 L22 0Z" fill="${C.terra}"/><path d="M0 -40 C-30 -70 -40 -110 -10 -140 M0 -40 C20 -80 40 -100 30 -135 M0 -40 C-5 -90 5 -120 0 -160" stroke="#4E6B3A" stroke-width="4" fill="none"/>
  ${[[-10,-140,-30],[30,-135,25],[0,-160,0],[-28,-100,-40],[34,-96,35],[-16,-75,-20],[16,-70,20]].map(([a,b,r])=>`<ellipse cx="${a}" cy="${b}" rx="16" ry="26" transform="rotate(${r} ${a} ${b})" fill="${C.sage}" stroke="#4E6B3A" stroke-width="2"/>`).join('')}</g>`}

/* פתיחה: הסלון המולבש */
function heroArt(){const W=640,H=420,fy=330;
  return svg('0 0 640 420',wallFloor(W,H,fy)+
   `<rect x="40" y="0" width="8" height="${fy}" fill="#D8C9AE"/><rect x="60" y="40" width="110" height="200" fill="#CFE0E6"/><rect x="56" y="36" width="118" height="208" fill="none" stroke="#FFF" stroke-width="8"/>
   <path d="M30 6 h170" stroke="${C.brass}" stroke-width="6"/><path d="M34 8 Q50 160 38 ${fy} L80 ${fy} Q70 160 80 8Z" fill="#F5EEE2" opacity=".92"/><path d="M196 8 Q180 160 192 ${fy} L150 ${fy} Q160 160 150 8Z" fill="#F5EEE2" opacity=".92"/>
   <ellipse cx="385" cy="${fy+52}" rx="250" ry="34" fill="${C.terra}" opacity=".85"/><ellipse cx="385" cy="${fy+52}" rx="222" ry="25" fill="none" stroke="${C.mustard}" stroke-width="4"/>`+
   abstractArt(300,90,170,120)+sofa(270,fy+10,230,C.lead)+
   `<rect x="300" y="${fy-38}" width="40" height="24" rx="6" fill="${C.mustard}"/><rect x="430" y="${fy-38}" width="40" height="24" rx="6" fill="${C.cream}"/><path d="M480 ${fy-46} q20 10 22 46 h-26z" fill="${C.terra}"/>`+
   `<rect x="330" y="${fy+30}" width="120" height="10" rx="3" fill="${C.wood}"/><rect x="338" y="${fy+40}" width="6" height="18" fill="#5A3E28"/><rect x="436" y="${fy+40}" width="6" height="18" fill="#5A3E28"/>
   <rect x="345" y="${fy+18}" width="34" height="12" fill="${C.lead}"/><path d="M398 ${fy+30} v-36 q8 -6 16 0 v36z" fill="#BFD8DA" opacity=".9"/><rect x="420" y="${fy+16}" width="10" height="14" fill="${C.brass}"/>`+
   plantPot(585,fy+20,1));}

/* רגע היסטורי: שטיח פזיריק, המחשה */
function carpetArt(){let s='';const deer=(x,y)=>`<g transform="translate(${x} ${y})" fill="#E9D7A8"><ellipse cx="0" cy="0" rx="13" ry="7"/><rect x="-10" y="4" width="3" height="10"/><rect x="7" y="4" width="3" height="10"/><path d="M11 -3 l6 -12 l3 2 l-5 10z"/><path d="M15 -14 l-5 -7 M17 -14 l2 -8" stroke="#E9D7A8" stroke-width="2"/></g>`;
  const rider=(x,y)=>`<g transform="translate(${x} ${y})" fill="#2F4A44"><ellipse cx="0" cy="0" rx="16" ry="8"/><rect x="-12" y="5" width="3" height="11"/><rect x="9" y="5" width="3" height="11"/><path d="M14 -4 l8 -9 l3 3 l-7 9z"/><circle cx="-2" cy="-16" r="5" fill="${C.terra}"/><rect x="-5" y="-12" width="7" height="10" fill="${C.terra}"/></g>`;
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){const x=200+c*60,y=110+r*50;s+=`<rect x="${x}" y="${y}" width="50" height="40" fill="#A8432F" stroke="#E9D7A8" stroke-width="2"/><path d="M${x+25} ${y+6} l10 14 l-10 14 l-10 -14z" fill="${C.mustard}"/>`}
  let d='';for(let i=0;i<6;i++){d+=deer(196+i*48,86)+deer(196+i*48,334)}
  let rd='';for(let i=0;i<7;i++){rd+=rider(165+i*52,48)+rider(165+i*52,378)}
  return svg('0 0 640 420',`<rect width="640" height="420" fill="#EFE6D6"/><rect x="120" y="20" width="400" height="384" rx="6" fill="#7E2F22"/><rect x="140" y="66" width="360" height="290" fill="#2F4A44"/><rect x="180" y="100" width="280" height="220" fill="#7E2F22"/>`+s+d+rd+
   `<path d="M120 20 v384 M520 20 v384" stroke="#E9D7A8" stroke-width="3" stroke-dasharray="2 6"/>`);}

/* וילון: צמוד לחלון מול מהתקרה */
function curtainArt(high){const W=640,H=420,fy=360;
  const rodY=high?14:92,len=high?fy:250,x1=high?150:200,x2=high?490:440;
  return svg('0 0 640 420',wallFloor(W,H,fy)+`<rect x="0" y="0" width="640" height="6" fill="#D8C9AE"/>
   <rect x="220" y="100" width="200" height="150" fill="#BFD8E2"/><path d="M220 175 h200 M320 100 v150" stroke="#FFF" stroke-width="6"/><rect x="214" y="94" width="212" height="162" fill="none" stroke="#FFF" stroke-width="8"/>
   <path d="M${x1-10} ${rodY} H${x2+10}" stroke="${C.brass}" stroke-width="7" stroke-linecap="round"/>
   <path d="M${x1} ${rodY+4} Q${x1+18} ${(rodY+len)/2} ${x1-4} ${len} L${x1+62} ${len} Q${x1+52} ${(rodY+len)/2} ${x1+66} ${rodY+4}Z" fill="#F7F1E6" opacity="${high?.9:.97}"/>
   <path d="M${x2} ${rodY+4} Q${x2-18} ${(rodY+len)/2} ${x2+4} ${len} L${x2-62} ${len} Q${x2-52} ${(rodY+len)/2} ${x2-66} ${rodY+4}Z" fill="#F7F1E6" opacity="${high?.9:.97}"/>`+
   sofa(210,fy+6,220,C.terra));}

/* שלושה מרקמים על הספה */
function texSvg(on){const fy=320;
  return svg('0 0 600 400',wallFloor(600,400,fy)+abstractArt(225,70,150,110)+
   `<g transform="translate(-10 0)">${sofa(140,fy+12,330,'#DCD3C4')}</g>`+
   (on.linen?`<g><rect x="160" y="${fy-62}" width="64" height="54" rx="10" fill="#E7DCC6" stroke="#C9B48A" stroke-width="2"/>${[0,1,2,3,4,5].map(i=>`<line x1="${166+i*10}" y1="${fy-58}" x2="${166+i*10}" y2="${fy-12}" stroke="#CDBFA4" stroke-width="2"/>`).join('')}</g>`:'')+
   (on.velvet?`<defs><linearGradient id="vel7" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#2A6E70"/><stop offset=".45" stop-color="${C.lead}"/><stop offset="1" stop-color="#0B2F31"/></linearGradient></defs><rect x="236" y="${fy-60}" width="62" height="52" rx="12" fill="url(#vel7)"/>`:'')+
   (on.wool?`<g><path d="M392 ${fy-66} q48 6 54 66 l-14 38 q-40 -10 -52 -40z" fill="${C.mustard}"/>${[0,1,2,3,4].map(i=>`<path d="M${398+i*9} ${fy-58+i*4} q6 30 -2 60" stroke="#B8821F" stroke-width="3" fill="none" stroke-dasharray="5 4"/>`).join('')}</g>`:''));}

/* שטיח: מבט מלמעלה */
function rugPlan(size){const R={small:[220,140,160,110],front:[110,108,380,226],all:[70,40,460,320]}[size]||null;
  const leg=(x,y)=>`<circle cx="${x}" cy="${y}" r="5" fill="#3B2A1C"/>`;
  const rug=R?`<rect x="${R[0]}" y="${R[1]}" width="${R[2]}" height="${R[3]}" rx="6" fill="${C.terra}"/><rect x="${R[0]+10}" y="${R[1]+10}" width="${R[2]-20}" height="${R[3]-20}" rx="4" fill="none" stroke="${C.mustard}" stroke-width="4"/>`:'';
  return svg('0 0 600 400',`<rect width="600" height="400" fill="${C.floor}"/>${[...Array(12)].map((_,i)=>`<line x1="0" y1="${i*34}" x2="600" y2="${i*34}" stroke="#CDB58E" stroke-width="1.5"/>`).join('')}`+rug+
   `<rect x="150" y="50" width="300" height="76" rx="12" fill="${C.lead}" opacity=".93"/>${leg(158,58)+leg(442,58)+leg(158,118)+leg(442,118)}
   <rect x="40" y="170" width="76" height="86" rx="12" fill="${C.mustard}" opacity=".93"/>${leg(48,178)+leg(108,178)+leg(48,248)+leg(108,248)}
   <rect x="484" y="170" width="76" height="86" rx="12" fill="${C.mustard}" opacity=".93"/>${leg(492,178)+leg(552,178)+leg(492,248)+leg(552,248)}
   <rect x="235" y="165" width="130" height="80" rx="8" fill="${C.wood}"/>`);}

/* תליית תמונה: קיר עם סרגל */
const HG={W:600,H:460,fy:430,k:1.6};const cy=cm=>HG.fy-cm*HG.k;
function hangSvg(center,mode,noLine){const fy=HG.fy;let frames='',top,bot;
  if(mode===1){const hh=60*HG.k,ww=80*HG.k;top=cy(center)-hh/2;bot=top+hh;frames=abstractArt(300-ww/2,top,ww,hh)}
  else{const g=[[-1,38,48],[0,52,62],[1,38,48]];const H2=62*HG.k;top=cy(center)-H2/2;bot=top+H2;
    frames=g.map(([i,w,hh])=>{const ww=w*HG.k,hp=hh*HG.k,x=300+i*(52*HG.k/2+38*HG.k/2+10*HG.k)-ww/2,y=cy(center)-hp/2;return abstractArt(x,y,ww,hp)}).join('')}
  let ruler='';for(let c=0;c<=260;c+=10){const y=cy(c),big=c%50===0;ruler+=`<line x1="18" y1="${y}" x2="${big?44:34}" y2="${y}" stroke="${C.ink}" stroke-width="${big?2.5:1.2}"/>`+(big&&c>0?`<text x="50" y="${y+7}" font-size="19" font-family="Assistant,sans-serif" font-weight="700" fill="${C.ink}">${c}</text>`:'')}
  const ok=Math.abs(center-145)<=5;
  return {ok,html:svg('0 0 600 460',wallFloor(600,460,fy)+`<rect x="10" y="10" width="40" height="${fy-10}" fill="#FFF8EC" opacity=".8"/>`+ruler+
   (noLine?'':`<line x1="10" y1="${cy(145)}" x2="590" y2="${cy(145)}" stroke="${C.terra}" stroke-width="3" stroke-dasharray="10 8"/><text x="92" y="${cy(145)-8}" font-size="19" font-family="Assistant,sans-serif" font-weight="800" fill="${C.terra}">145</text>`)+
   `<g class="hg" style="cursor:grab">${frames}<rect x="150" y="${top-8}" width="300" height="${bot-top+16}" fill="transparent"/></g>`
   +(noLine?'':`<line x1="455" y1="${cy(center)}" x2="500" y2="${cy(center)}" stroke="${ok?'#2E7D4F':C.ink}" stroke-width="4"/><circle cx="455" cy="${cy(center)}" r="6" fill="${ok?'#2E7D4F':C.ink}"/>`)+
   sofa(200,fy-6,200,C.sage)+
   `<g transform="translate(545 ${fy})" fill="${C.ink}" opacity=".55"><circle cx="0" cy="${-152*HG.k-12}" r="${11*HG.k}"/><path d="M-22 ${-140*HG.k} h44 l6 ${70*HG.k} h-12 l-4 ${70*HG.k} h-24 l-4 ${-70*HG.k} h-12z"/></g>`)};}

/* יצירה אחת מול קיר גלריה */
function wallArt(kind){const fy=330;
  const art=kind==='one'?abstractArt(195,40,250,175):
   [[170,50,70,90],[250,50,110,90],[370,50,80,60],[370,118,80,62],[170,148,120,62],[300,148,60,62]].map(([x,y,w,hh],i)=>`<rect x="${x-4}" y="${y-4}" width="${w+8}" height="${hh+8}" fill="${i%2?C.ink:C.brass}"/><rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="#F4ECDD"/>`+
    [`<circle cx="${x+w/2}" cy="${y+hh/2}" r="${hh/3}" fill="${C.terra}"/>`,`<rect x="${x+8}" y="${y+hh/2}" width="${w-16}" height="${hh/2-8}" fill="${C.lead}"/>`,`<path d="M${x+6} ${y+hh-8} L${x+w/2} ${y+10} L${x+w-6} ${y+hh-8}Z" fill="${C.mustard}"/>`][i%3]).join('');
  return svg('0 0 640 420',wallFloor(640,420,fy)+art+sofa(190,fy+10,260,C.terra)+`<ellipse cx="320" cy="${fy+56}" rx="230" ry="26" fill="${C.sage}" opacity=".8"/>`);}

/* אור על האמנות */
function lightArt(eve,id){const fy=330;
  return svg('0 0 640 420',`<defs><radialGradient id="sp${id}" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#FFE3A8" stop-opacity=".95"/><stop offset="1" stop-color="#FFE3A8" stop-opacity="0"/></radialGradient></defs>`+wallFloor(640,420,fy,eve)+
   (eve?`<path d="M300 4 L210 250 L430 250 Z" fill="url(#sp${id})"/>`:'')+abstractArt(225,70,190,140)+(eve?`<rect x="220" y="65" width="200" height="150" fill="#FFE9B8" opacity=".18"/>`:'')+
   `<rect x="290" y="0" width="20" height="10" fill="#333"/><path d="M293 10 l-6 16 h26 l-6 -16z" fill="${eve?'#FFE3A8':'#555'}"/>`+sofa(190,fy+10,260,eve?shade(C.lead,-.35):C.lead));}

/* כלל השלושה על שולחן קפה */
function tableArt(three){const y=300;
  const items=three?`<rect x="210" y="${y-22}" width="90" height="22" fill="${C.lead}"/><rect x="214" y="${y-36}" width="80" height="14" fill="${C.terra}"/><path d="M330 ${y} v-110 q14 -16 28 0 v110z" fill="#BFD8DA" stroke="#8FB3B6" stroke-width="2"/><path d="M344 ${y-126} q-10 -30 4 -50 M344 ${y-126} q18 -24 10 -50" stroke="#4E6B3A" stroke-width="3" fill="none"/><ellipse cx="410" cy="${y-30}" rx="22" ry="30" fill="${C.terra}"/><circle cx="410" cy="${y-68}" r="12" fill="${C.terra}"/>`
   :`<path d="M250 ${y} v-80 q14 -14 28 0 v80z" fill="#BFD8DA" stroke="#8FB3B6" stroke-width="2"/><path d="M360 ${y} v-80 q14 -14 28 0 v80z" fill="#BFD8DA" stroke="#8FB3B6" stroke-width="2"/>`;
  return svg('0 0 640 420',`<rect width="640" height="420" fill="${C.wall}"/><rect y="350" width="640" height="70" fill="${C.floor}"/><rect x="150" y="${y}" width="340" height="20" rx="6" fill="${C.wood}"/><rect x="170" y="${y+20}" width="12" height="40" fill="#5A3E28"/><rect x="458" y="${y+20}" width="12" height="40" fill="#5A3E28"/>`+items);}

/* מדף: פריטים */
const IT={books:['ספרים בערימה','L'],bowl:['קערת עץ','L'],sculpt:['פסלון קרמיקה','M'],plant:['עציץ קטן','M'],jar:['כד טרקוטה','M'],vase:['אגרטל זכוכית גבוה','T'],candle:['נר בפמוט פליז','T'],frame:['צילום במסגרת','T']};
function itemArt(id){switch(id){
  case 'books':return `<rect x="-34" y="-14" width="68" height="14" fill="${C.lead}"/><rect x="-30" y="-26" width="60" height="12" fill="${C.terra}"/><rect x="-32" y="-36" width="64" height="10" fill="${C.cream}"/>`;
  case 'bowl':return `<path d="M-32 -26 q32 40 64 0z" fill="${C.oak}"/><ellipse cx="0" cy="-26" rx="32" ry="6" fill="#8E6236"/>`;
  case 'sculpt':return `<ellipse cx="0" cy="-22" rx="18" ry="22" fill="${C.cream}" stroke="#C9B48A" stroke-width="2"/><circle cx="0" cy="-54" r="12" fill="${C.cream}" stroke="#C9B48A" stroke-width="2"/><rect x="-16" y="-4" width="32" height="4" fill="${C.ink}"/>`;
  case 'plant':return `<path d="M-14 0 l-3 -26 h34 l-3 26z" fill="${C.terra}"/><path d="M0 -26 q-20 -20 -12 -44 M0 -26 q18 -22 12 -42 M0 -26 v-40" stroke="#4E6B3A" stroke-width="3" fill="none"/><ellipse cx="-12" cy="-58" rx="8" ry="13" fill="${C.sage}"/><ellipse cx="12" cy="-56" rx="8" ry="13" fill="${C.sage}"/><ellipse cx="0" cy="-66" rx="7" ry="12" fill="${C.sage}"/>`;
  case 'jar':return `<path d="M-14 0 q-16 -26 -4 -46 h36 q12 20 -4 46z" fill="${C.terra}"/><rect x="-12" y="-54" width="24" height="9" fill="#A5482F"/>`;
  case 'vase':return `<path d="M-12 0 q-6 -50 4 -96 h16 q10 46 4 96z" fill="#BFD8DA" stroke="#8FB3B6" stroke-width="2"/><path d="M0 -96 q-12 -24 -4 -40 M0 -96 q14 -18 10 -36" stroke="#4E6B3A" stroke-width="3" fill="none"/>`;
  case 'candle':return `<rect x="-14" y="-6" width="28" height="6" fill="${C.brass}"/><rect x="-4" y="-40" width="8" height="34" fill="${C.brass}"/><rect x="-9" y="-44" width="18" height="5" fill="${C.brass}"/><rect x="-6" y="-92" width="12" height="48" fill="#FBF6EC" stroke="#E5D9C2"/><path d="M0 -94 q-5 -9 0 -16 q5 7 0 16z" fill="${C.mustard}"/>`;
  case 'frame':return `<rect x="-26" y="-82" width="52" height="80" fill="${C.ink}" transform="rotate(-6)"/><rect x="-19" y="-74" width="38" height="64" fill="#D9D2C5" transform="rotate(-6)"/><circle cx="-4" cy="-50" r="9" fill="#9C9384" transform="rotate(-6)"/><path d="M-16 -16 q12 -22 30 0z" fill="#9C9384" transform="rotate(-6)"/>`;
 }return ''}
const SLOT={x:[180,300,420],y:[200,350]};
function shelfSvg(k,eve,id){
  const items=Object.entries(k||{}).map(([s,it])=>{const r=+s[0],c=+s[1];return `<g transform="translate(${SLOT.x[c]} ${SLOT.y[r]})">${itemArt(it)}</g>`}).join('');
  const glow=eve?`<defs><linearGradient id="led${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FFD98A" stop-opacity=".85"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></linearGradient></defs>${[54,212].map(y=>`<rect x="104" y="${y}" width="392" height="130" fill="url(#led${id})"/>`).join('')}`:'';
  return svg('0 0 600 420',`<rect width="600" height="420" fill="${eve?'#4F463C':C.wall}"/><rect y="390" width="600" height="30" fill="${eve?'#6E5A40':C.floor}"/>
   <rect x="90" y="40" width="420" height="350" fill="${eve?'#2D4B45':C.lead}"/><rect x="104" y="54" width="392" height="322" fill="${eve?'#3B5F58':'#D9E4DC'}"/>`+glow+
   `<rect x="104" y="${SLOT.y[0]}" width="392" height="12" fill="${C.oak}"/><rect x="104" y="${SLOT.y[1]}" width="392" height="14" fill="${C.oak}"/>`+
   items);}
function heightsOk(k,r){const hs=new Set([0,1,2].map(c=>k[r+''+c]).filter(Boolean).map(i=>IT[i][1]));return hs.size>=2}

/* עומס מול אוצרות */
function crowdArt(curated){const base=svg('0 0 600 420','');
  const all=curated?[['vase',0,0],['books',0,1],['sculpt',0,2],['frame',1,0],['bowl',1,2]]:
   [['vase',0,0],['books',0,1],['sculpt',0,2],['candle',0,1],['jar',0,2],['plant',0,0],['frame',1,0],['bowl',1,2],['jar',1,1],['plant',1,2],['books',1,0],['sculpt',1,1],['candle',1,2]];
  const k={};let extra='';
  all.forEach(([it,r,c],i)=>{const key=r+''+c;if(!k[key])k[key]=it;else{const dx=(i%2?-34:34);extra+=`<g transform="translate(${SLOT.x[c]+dx} ${SLOT.y[r]})">${itemArt(it)}</g>`}});
  return shelfSvg(k,false,'cr'+(curated?1:0)).replace('</svg>',extra+'</svg>');}

/* גשר: חלון וצמח */
function bridgeArt(){return svg('0 0 400 300',`<rect width="400" height="300" fill="${C.wall}"/><path d="M110 270 V110 a90 90 0 0 1 180 0 V270Z" fill="#CFE6E0"/><circle cx="250" cy="90" r="26" fill="${C.mustard}"/><path d="M110 210 q90 -50 180 0 V270 H110Z" fill="${C.sage}"/><path d="M110 270 V110 a90 90 0 0 1 180 0 V270" fill="none" stroke="#FFF" stroke-width="10"/><rect y="270" width="400" height="30" fill="${C.floor}"/>`+plantPot(70,275,.95)+plantPot(330,280,.75))}

const prevDraw=window.Salon.drawNote;
window.Salon.drawNote=function(it){if(it.kind==='shelf7'&&it.k){return h('div',{class:'s3-nb',html:shelfSvg(it.k,true,'nb'+it.ts)})}return prevDraw?prevDraw(it):null};
function shelfText(k){const r0=[0,1,2].map(c=>IT[k['0'+c]][0]),r1=[0,1,2].map(c=>IT[k['1'+c]][0]);return 'מדף עליון: '+r0.join(', ')+'. מדף תחתון: '+r1.join(', ')+'.'}

const screens=[

/* יחידה 1 */
{id:'open',title:'הלבשת הבית ואמנות',hideNext:true,
 text:'ברוכה השבה, {name}. בית יכול להיות מושלם באדריכלות, ועדיין להרגיש כמו אולם תצוגה. מה שהופך אותו לבית חי הוא השכבה האחרונה: הטקסטיל, השטיח, האמנות והחפצים שמספרים סיפור. היום תתלי תמונה בגובה הנכון, ותסדרי מדף בעצמך.',
 mount(el,ctx){
  const box=photo('assets/img/s7-open.jpg','סלון מולבש: וילונות פשתן ארוכים, שטיח, כריות במרקמים שונים, קיר גלריה ומדף מסודר.','s7-wide',1);
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box),
    h('div',{class:'copy'},h('span',{class:'kicker'},'מפגש 7'),h('h1',null,'הלבשת הבית ואמנות'),
      h('p',{class:'lede'},nameFill('ברוכה השבה, {name}. בית יכול להיות מושלם באדריכלות, ועדיין להרגיש כמו אולם תצוגה. מה שהופך אותו לבית חי הוא השכבה האחרונה: הטקסטיל, השטיח, האמנות והחפצים שמספרים סיפור. היום תתלי תמונה בגובה הנכון, ותסדרי מדף בעצמך.')),
      h('button',{class:'cta',type:'button',onclick:ctx.next,html:'בואי נתחיל'+window.Salon.ICON.arrowL}))));
 }},

{id:'secrets',title:'ארבעה סודות',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'להלבשת בית של וילה יש ארבעה סודות. היום נכיר את כולם.',
 mount(el,ctx){return flips(el,ctx,{kicker:'ארבעה סודות',title:'ארבעה סודות',lede:'להלבשת בית של וילה יש ארבעה סודות. היום נכיר את כולם.',
  cards:['רכות בשכבות.','השטיח הוא עוגן.','האמנות בגובה העיניים.','שלושה זה קסם.'].map((b,i)=>({t:'סוד '+(i+1),b}))})}},

{id:'carpet',title:'רגע היסטורי: השטיח העתיק',task:'לחצי על שלוש הנקודות בשטיח.',wide:true,
 text:'רגע היסטורי. השטיח השזור העתיק ביותר שנמצא בעולם נקרא שטיח פזיריק. הוא נמצא קפוא בקבר בהרי אלטאי שבסיביר, ונארג לפני כ-2,400 שנה. היום הוא מוצג במוזיאון ההרמיטאז\' בסנט פטרבורג. כבר אז, שטיח היה יצירת אמנות.',
 mount(el,ctx){
  const box=h('div',{class:'s2-pic s3-draw s7-wide',html:carpetArt()});
  return spots(el,ctx,{kicker:'רגע היסטורי',title:'השטיח העתיק',lede:'רגע היסטורי. השטיח השזור העתיק ביותר שנמצא בעולם נקרא שטיח פזיריק. הוא נמצא קפוא בקבר בהרי אלטאי שבסיביר, ונארג לפני כ-2,400 שנה. היום הוא מוצג במוזיאון ההרמיטאז\' בסנט פטרבורג. כבר אז, שטיח היה יצירת אמנות.',
   box:(box.append(illus()),box),credit:'המחשה בהשראת שטיח פזיריק',
   pts:[{x:40,y:80,name:'איילים',t:'איילים: במסגרת הפנימית צועדים איילים, בשורה.'},{x:62,y:11,name:'פרשים',t:'פרשים: במסגרת החיצונית רוכבים פרשים על סוסים.'},{x:50,y:50,name:'צמר',t:'צמר: כל השטיח עשוי צמר, קשר אחר קשר.'}]});
 }},

/* יחידה 2 */
{id:'curtain',title:'הווילון שיורד מהתקרה',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'הסוד הראשון: רכות בשכבות. מתחילים בווילון. כשתולים אותו צמוד לחלון, התקרה נראית נמוכה. כשתולים אותו קרוב לתקרה ונותנים לו לרדת עד הרצפה, החדר נראה גבוה ומרווח יותר. וילון פשתן חצי שקוף גם מרכך את האור החזק.',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,curtainArt(false),curtainArt(true),'צמוד לחלון','מהתקרה')),
   copy('הסוד הראשון','הווילון שיורד מהתקרה','הסוד הראשון: רכות בשכבות. מתחילים בווילון. כשתולים אותו צמוד לחלון, התקרה נראית נמוכה. כשתולים אותו קרוב לתקרה ונותנים לו לרדת עד הרצפה, החדר נראה גבוה ומרווח יותר. וילון פשתן חצי שקוף גם מרכך את האור החזק.')));
  return gate(ctx,ctx.data.cut!=null&&ctx.data.cut!==50);
 }},

{id:'textures',title:'שלושה מרקמים',task:'לחצי על פשתן, על קטיפה ועל צמר.',wide:true,
 text:'על הספה מניחים כריות ושמיכה בשלושה מרקמים: פשתן גס, קטיפה חלקה וצמר סרוג. גם כשהצבעים רכים ושקטים, המרקמים יוצרים עושר. מעצבים קוראים לזה שכבות טקסטיל (Textile Layering).',
 mount(el,ctx){
  const on=ctx.data.on||(ctx.data.on={});const res=h('div');const box=h('div',{class:'s3-draw s7-tex'});
  const M={linen:['פשתן','<b>פשתן גס.</b> מרקם טבעי ומחוספס, שנראה נינוח.'],velvet:['קטיפה','<b>קטיפה חלקה.</b> מבריקה באור, ונעימה למגע.'],wool:['צמר','<b>שמיכת צמר סרוגה.</b> זרוקה על משענת היד, ומזמינה להתכרבל.']};
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':'מרקמים'});
  function draw(){box.innerHTML=texSvg(on);box.append(illus());
   btns.replaceChildren(...Object.entries(M).map(([k,[t]])=>h('button',{type:'button','aria-pressed':String(!!on[k]),onclick:()=>{on[k]=1;ctx.save();draw();sayBox(res,M[k][1]);if(Object.keys(on).length===3){setTimeout(()=>sayBox(res,'<b>שלושה מרקמים, צבעים רכים.</b> ככה נראית ספה של וילה.'),1600);ctx.done()}}},t)))}
  draw();
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),
   copy('שכבות של רכות','שלושה מרקמים','על הספה מניחים כריות ושמיכה בשלושה מרקמים: פשתן גס, קטיפה חלקה וצמר סרוג. גם כשהצבעים רכים ושקטים, המרקמים יוצרים עושר. מעצבים קוראים לזה שכבות טקסטיל (Textile Layering).',res)));
  return gate(ctx,Object.keys(on).length===3);
 }},

{id:'rug',title:'השטיח הוא עוגן',task:'בחרי גודל לשטיח, ונסי את שלושת הגדלים.',wide:true,
 text:'הסוד השני. שטיח קטן מדי נראה כמו אי בודד באמצע החדר. הכלל של המעצבים: השטיח גדול מספיק כדי שלפחות הרגליים הקדמיות של הספה והכורסאות יעמדו עליו. כך הוא מאחד את פינת הישיבה.',
 mount(el,ctx){
  const d=ctx.data;const tr=d.tr||(d.tr={});const res=h('div');const box=h('div',{class:'s3-draw s7-plan'});
  const R={small:['שטיח קטן','השטיח צף לבד באמצע, והרהיטים נראים מפוזרים סביבו.'],front:['רגליים קדמיות','<b>בדיוק הכלל.</b> הרגליים הקדמיות על השטיח, והפינה נראית שלמה.'],all:['כל הרגליים','<b>גם זה נכון, בחדר גדול.</b> כל הרהיטים עומדים על השטיח, כמו חדר בתוך חדר.']};
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':'גודל השטיח'});
  function draw(){box.innerHTML=rugPlan(d.cur);box.append(illus());
   btns.replaceChildren(...Object.entries(R).map(([k,[t]])=>h('button',{type:'button','aria-pressed':String(d.cur===k),onclick:()=>{d.cur=k;tr[k]=1;ctx.save();draw();sayBox(res,R[k][1]);if(Object.keys(tr).length===3)ctx.done()}},t)))}
  draw();if(d.cur)sayBox(res,R[d.cur][1]);
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),
   copy('הסוד השני','השטיח הוא עוגן','הסוד השני. שטיח קטן מדי נראה כמו אי בודד באמצע החדר. הכלל של המעצבים: השטיח גדול מספיק כדי שלפחות הרגליים הקדמיות של הספה והכורסאות יעמדו עליו. כך הוא מאחד את פינת הישיבה.',res)));
  return gate(ctx,Object.keys(tr).length===3);
 }},

/* יחידה 3 */
{id:'hang',title:'תלי את התמונה',task:'גררי את התמונה, או לחצי על החצים, עד שהמרכז שלה על הקו.',wide:true,
 text:'הסוד השלישי. בגלריות ובמוזיאונים תולים כך שמרכז התמונה נמצא בגובה של כ-145 ס"מ מהרצפה, בערך בגובה העיניים. הטעות הנפוצה בבית היא לתלות גבוה מדי. עכשיו תורך.',
 mount(el,ctx){
  const d=ctx.data;d.c=d.c||190;let mode=d.mode||1;const done=d.done||(d.done={});
  const box=h('div',{class:'s3-draw s7-hang'});const res=h('div');const tabs=h('div',{class:'s3-tabs'});const info=h('div',{class:'s6-info s7-info'});
  const MS={1:['תמונה אחת','מרכז התמונה צריך להיות על הקו, בגובה של כ-145 ס"מ.'],2:['קבוצה של שלוש','בקבוצה מודדים את המרכז של כל הקבוצה יחד, לא של תמונה אחת.']};
  function draw(){const r=hangSvg(d.c,mode);box.innerHTML=r.html;box.append(illus());
   tabs.replaceChildren(...[1,2].map(i=>h('button',{type:'button','aria-pressed':String(i===mode),class:done[i]?'ok':'',disabled:i===2&&!done[1],onclick:()=>{mode=i;d.mode=i;d.c=190;ctx.save();res.replaceChildren();draw()}},(done[i]?'✓ ':'')+MS[i][0])));
   info.replaceChildren(h('p',{class:'s3-sit'},h('b',null,MS[mode][0]+'. '),MS[mode][1]),h('p',{class:'s3-sit s7-now'},'המרכז עכשיו: ',h('b',null,d.c+' ס"מ')));
   if(r.ok&&!done[mode]){done[mode]=true;ctx.save();
     if(mode===1){sayBox(res,'<b>בדיוק בגובה העיניים.</b> עכשיו נסי קבוצה של שלוש תמונות.');setTimeout(()=>{mode=2;d.mode=2;d.c=190;ctx.save();draw()},1600)}
     else sayBox(res,nameFill('<b>מושלם.</b> הקבוצה נקראת כיצירה אחת, בגובה העיניים. <b>תלית כמו אוצרת, {name}.</b>'))}
   else if(!r.ok){if(res.dataset.k!==String(d.c)){res.dataset.k=d.c;sayBox(res,d.c>145?'עדיין גבוה מדי. הורידי את התמונה.':'נמוך מדי. הרימי מעט את התמונה.')}}
   if(done[1]&&done[2])ctx.done()}
  function move(dc){d.c=Math.max(100,Math.min(210,d.c+dc));ctx.save();draw()}
  let y0=null,c0=0;
  const ptY=e=>{const sv=box.querySelector('svg');const r=sv.getBoundingClientRect();return (e.clientY-r.top)/r.height*HG.H};
  box.addEventListener('pointerdown',e=>{if(!e.target.closest('.hg'))return;y0=ptY(e);c0=d.c;box.setPointerCapture(e.pointerId);e.preventDefault()});
  box.addEventListener('pointermove',e=>{if(y0==null)return;const n=Math.max(100,Math.min(210,Math.round((c0-(ptY(e)-y0)/HG.k)/5)*5));if(n!==d.c){d.c=n;box.querySelector('svg').outerHTML=hangSvg(d.c,mode).html}});
  const end=()=>{if(y0==null)return;y0=null;ctx.save();draw()};box.addEventListener('pointerup',end);box.addEventListener('pointercancel',end);
  const arrows=h('div',{class:'row s3-arrows s6-arr'},h('button',{class:'btn',type:'button','aria-label':'הרימי את התמונה',onclick:()=>move(5)},'↑'),h('button',{class:'btn',type:'button','aria-label':'הורידי את התמונה',onclick:()=>move(-5)},'↓'));
  el.append(head('רגע WOW','תלי את התמונה','הסוד השלישי. בגלריות ובמוזיאונים תולים כך שמרכז התמונה נמצא בגובה של כ-145 ס"מ מהרצפה, בערך בגובה העיניים. הטעות הנפוצה בבית היא לתלות גבוה מדי. עכשיו תורך.'),
   h('div',{class:'s3-simwrap s7-hangwrap'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},tabs,info,arrows,res)));
  draw();
  return gate(ctx,!!(done[1]&&done[2]));
 }},

{id:'gallery',title:'יצירה אחת או קיר גלריה',task:'לחצי על שתי האפשרויות.',wide:true,
 text:'בווילה מודרנית בוחרים לרוב באחת משתי דרכים. יצירה אחת גדולה שממלאת את הקיר, כמו במוזיאון. או קיר גלריה (Gallery Wall): כמה תמונות שתלויות יחד, קרובות זו לזו. בשתי הדרכים, מה שעל הקיר נקרא כיצירה אחת.',
 mount(el,ctx){
  const d=ctx.data;const tr=d.tr||(d.tr={});const cur=d.cur||'one';
  const box=h('div',{class:'s3-draw s5-fin s7-wide'},h('div',{class:'lay'+(cur==='one'?' on':''),'data-k':'one',html:wallArt('one')}),h('div',{class:'lay'+(cur==='many'?' on':''),'data-k':'many',html:wallArt('many')}),illus());
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':'יצירה אחת או קיר גלריה'},...[['one','יצירה אחת'],['many','קיר גלריה']].map(([k,t])=>h('button',{type:'button','data-k':k,'aria-pressed':String(cur===k),onclick:()=>show(k)},t)));
  function show(k){d.cur=k;tr[k]=1;ctx.save();box.querySelectorAll('.lay').forEach(i=>i.classList.toggle('on',i.dataset.k===k));btns.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));if(tr.one&&tr.many)ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),
   copy('אמנות על הקיר','יצירה אחת או קיר גלריה','בווילה מודרנית בוחרים לרוב באחת משתי דרכים. יצירה אחת גדולה שממלאת את הקיר, כמו במוזיאון. או קיר גלריה (Gallery Wall): כמה תמונות שתלויות יחד, קרובות זו לזו. בשתי הדרכים, מה שעל הקיר נקרא כיצירה אחת.')));
  return gate(ctx,!!(tr.one&&tr.many));
 }},

{id:'panels',title:'ארבעה לוחות, יצירה אחת',task:'לחצי על ארבע הנקודות בתמונה.',wide:true,
 text:'ככה זה נראה בבית. ארבעה לוחות עץ מגולפים תלויים יחד, וביחד הם יוצרים עיגול אחד גדול. מתחתם כורסה, לידם עץ בעציץ, ולרגליהם שטיח. זו פינה שלמה.',
 mount(el,ctx){
  return spots(el,ctx,{kicker:'ככה זה נראה',title:'ארבעה לוחות, יצירה אחת',lede:'ככה זה נראה בבית. ארבעה לוחות עץ מגולפים תלויים יחד, וביחד הם יוצרים עיגול אחד גדול. מתחתם כורסה, לידם עץ בעציץ, ולרגליהם שטיח. זו פינה שלמה.',
   box:h('div',{class:'s2-pic s7-sq'},h('img',{src:PANELS.src,alt:PANELS.alt,decoding:'async'})),ai:true,credit:'הדמיה',
   pts:[{x:61,y:32,name:'הלוחות',t:'ארבעה לוחות: יחד הם עיגול אחד, כמו יצירה אחת גדולה.'},{x:44,y:66,name:'הכורסה',t:'הכורסה: האמנות תלויה מעליה, והן נקראות יחד.'},{x:22,y:91,name:'השטיח',t:'השטיח: מגדיר את הפינה ומרכך את הרצפה.'},{x:12,y:38,name:'העץ',t:'העץ בעציץ: ירוק וחי. עליו נדבר במפגש הבא.'}]});
 }},

{id:'artlight',title:'אור על האמנות',task:'לחצי על "יום" ועל "ערב".',wide:true,
 text:'בערב, ספוט מכוון מהתקרה מאיר את היצירה, ומדגיש את הצבעים ואת המרקם. זוכרת את האור המדגיש ממפגש 4? כאן הוא מאיר אמנות, והחדר נראה כמו גלריה פרטית.',
 mount(el,ctx){
  const d=ctx.data;const tr=d.tr||(d.tr={});const cur=d.cur||'day';
  const box=h('div',{class:'s3-draw s5-fin s7-wide'},h('div',{class:'lay'+(cur==='day'?' on':''),'data-k':'day',html:lightArt(false,'a')}),h('div',{class:'lay'+(cur==='eve'?' on':''),'data-k':'eve',html:lightArt(true,'b')}),illus());
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':'יום או ערב'},...[['day','יום'],['eve','ערב']].map(([k,t])=>h('button',{type:'button','data-k':k,'aria-pressed':String(cur===k),onclick:()=>show(k)},t)));
  function show(k){d.cur=k;tr[k]=1;ctx.save();box.querySelectorAll('.lay').forEach(i=>i.classList.toggle('on',i.dataset.k===k));btns.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));if(tr.day&&tr.eve)ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),
   copy('גלריה פרטית','אור על האמנות','בערב, ספוט מכוון מהתקרה מאיר את היצירה, ומדגיש את הצבעים ואת המרקם. זוכרת את האור המדגיש ממפגש 4? כאן הוא מאיר אמנות, והחדר נראה כמו גלריה פרטית.')));
  return gate(ctx,!!(tr.day&&tr.eve));
 }},

/* יחידה 4 */
{id:'three',title:'שלושה זה קסם',task:'לחצי על "שניים זהים" ועל "שלושה שונים".',wide:true,
 text:'הסוד הרביעי. על שולחן קפה, מדף או שידה, מעצבים מסדרים פריטים בקבוצות של שלושה, או במספר אי-זוגי אחר. וחשוב לגוון בגובה: משהו גבוה, משהו בינוני ומשהו נמוך. כך העין מטיילת, ונהנית.',
 mount(el,ctx){
  const d=ctx.data;const tr=d.tr||(d.tr={});const cur=d.cur||'two';
  const box=h('div',{class:'s3-draw s5-fin s7-wide'},h('div',{class:'lay'+(cur==='two'?' on':''),'data-k':'two',html:tableArt(false)}),h('div',{class:'lay'+(cur==='three'?' on':''),'data-k':'three',html:tableArt(true)}),illus());
  const btns=h('div',{class:'s2-periods',role:'group','aria-label':'שניים או שלושה'},...[['two','שניים זהים'],['three','שלושה שונים']].map(([k,t])=>h('button',{type:'button','data-k':k,'aria-pressed':String(cur===k),onclick:()=>show(k)},t)));
  function show(k){d.cur=k;tr[k]=1;ctx.save();box.querySelectorAll('.lay').forEach(i=>i.classList.toggle('on',i.dataset.k===k));btns.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));if(tr.two&&tr.three)ctx.done()}
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},box,btns),
   copy('הסוד הרביעי','שלושה זה קסם','הסוד הרביעי. על שולחן קפה, מדף או שידה, מעצבים מסדרים פריטים בקבוצות של שלושה, או במספר אי-זוגי אחר. וחשוב לגוון בגובה: משהו גבוה, משהו בינוני ומשהו נמוך. כך העין מטיילת, ונהנית.')));
  return gate(ctx,!!(tr.two&&tr.three));
 }},

{id:'curate',title:'לבחור, לא להעמיס',task:'גררי את הקו שבאמצע התמונה, או לחצי על החצים.',wide:true,
 text:'מזכרות מטיולים, ספרים וצילומים ישנים הם אוצר. הסוד הוא לבחור. במקום להציג הכול, בוחרים את הפריטים היפים והמרגשים ביותר, ונותנים להם מקום של כבוד. מעצבים קוראים לזה אוצרות (Curation), כמו במוזיאון.',
 mount(el,ctx){
  el.append(h('div',{class:'split media s2-split'},h('div',{class:'s2-media'},compare(ctx,crowdArt(false),crowdArt(true),'הכול על המדף','מדף אצור')),
   copy('אוצרות','לבחור, לא להעמיס','מזכרות מטיולים, ספרים וצילומים ישנים הם אוצר. הסוד הוא לבחור. במקום להציג הכול, בוחרים את הפריטים היפים והמרגשים ביותר, ונותנים להם מקום של כבוד. מעצבים קוראים לזה אוצרות (Curation), כמו במוזיאון.')));
  return gate(ctx,ctx.data.cut!=null&&ctx.data.cut!==50);
 }},

{id:'myshelf',title:'המדף שלך',task:'לחצי על פריט, ואחר כך על מקום פנוי במדף. שלושה פריטים בכל מדף.',wide:true,
 text:'בעלי וילה בהרצליה פיתוח ביקשו לעצב את הספרייה בסלון. את המעצבת. שני מדפים, שלושה פריטים בכל אחד. גווני בגובה ובחומרים. לחיצה על פריט שכבר במדף מחזירה אותו.',
 mount(el,ctx){
  const k=ctx.data.k||(ctx.data.k={});let pick=null;const res=h('div');
  const box=h('div',{class:'s3-draw s7-shelf'});const pool=h('div',{class:'s2-pool compact s7-pool'});
  const full=()=>Object.keys(k).length===6;const varied=()=>heightsOk(k,0)&&heightsOk(k,1);
  function draw(){box.innerHTML=shelfSvg(k,false,'ms');box.append(illus());
   SLOT.y.forEach((y,r)=>SLOT.x.forEach((x,c)=>{const key=r+''+c;const b=h('button',{type:'button',class:'s7-slot'+(k[key]?' full':''),style:`left:${(x-60)/6}%;top:${(y-120)/4.2}%;width:20%;height:${110/4.2}%`,'aria-label':k[key]?IT[k[key]][0]+', לחצי כדי להחזיר':'מקום פנוי'});
     b.addEventListener('click',()=>{if(k[key]){delete k[key];ctx.save();res.replaceChildren();draw();return}
       if(!pick){sayBox(res,'קודם לחצי על פריט, ואחר כך על המקום במדף.');return}k[key]=pick;pick=null;ctx.save();draw();check()});box.append(b)}));
   const used=Object.values(k);
   pool.replaceChildren(...Object.keys(IT).filter(id=>!used.includes(id)).map(id=>h('button',{type:'button',class:'s2-tile sm','aria-pressed':String(pick===id),onclick:()=>{pick=pick===id?null:id;draw()}},
     h('span',{class:'s2-art',html:svg('-50 -120 100 124',itemArt(id))}),h('span',{class:'nm'},IT[id][0]))))}
  function check(){if(!full())return;
   if(varied()){sayBox(res,nameFill('<b>שלושה בכל מדף, בגבהים שונים.</b> מדף של מעצבת, {name}.'));ctx.done()}
   else sayBox(res,'המדף כמעט מוכן. באחד המדפים כל הפריטים באותו גובה. החליפי פריט אחד כדי לגוון.')}
  draw();if(full())check();
  el.append(head('המשימה','המדף שלך','בעלי וילה בהרצליה פיתוח ביקשו לעצב את הספרייה בסלון. את המעצבת. שני מדפים, שלושה פריטים בכל אחד. גווני בגובה ובחומרים. לחיצה על פריט שכבר במדף מחזירה אותו.'),
   h('div',{class:'s3-simwrap s7-shelfwrap'},h('div',{class:'s3-simcol'},box),h('div',{class:'s3-side'},pool,res)));
  return gate(ctx,full()&&varied());
 }},

{id:'myshelf-eve',title:'המדף שלך בערב',task:'שמרי את המדף במחברת.',wide:true,
 text:'ככה המדף שלך נראה בערב, {name}. פס אור חם מתחת לכל מדף מאיר את הפריטים, והספרייה הופכת לתצוגה קטנה.',
 mount(el,ctx){
  const k=((ctx.all.myshelf||{}).k)||{};const res=h('div');
  if(Object.keys(k).length<6){el.append(h('div',{class:'center'},h('div',null,h('h2',null,'המדף שלך בערב'),h('p',{class:'lede'},'המדף עוד לא מוכן. חזרי מסך אחד אחורה והשלימי אותו.'))));return gate(ctx,false)}
  const text=shelfText(k);
  const box=h('div',{class:'s3-draw s7-shelf',html:shelfSvg(k,true,'ev')});box.append(illus());
  const btn=h('button',{class:'cta',type:'button',onclick:()=>{
    const nb=ctx.S.notebook;const old=nb.find(n=>n.kind==='shelf7'&&n.session===7);
    if(old){old.k=JSON.parse(JSON.stringify(k));old.text=text;old.ts=Date.now();ctx.save()}else ctx.notebook({kind:'shelf7',svg:true,title:'המדף שלי בהרצליה פיתוח',k:JSON.parse(JSON.stringify(k)),text});
    ctx.data.saved=true;ctx.save();sayBox(res,'<b>נשמר במחברת שלך.</b>');ctx.done()}},'שמרי במחברת');
  el.append(h('div',{class:'split media s2-split s7-eve'},h('div',{class:'s2-media'},box),
   copy('בערב','המדף שלך בערב',nameFill('ככה המדף שלך נראה בערב, {name}. פס אור חם מתחת לכל מדף מאיר את הפריטים, והספרייה הופכת לתצוגה קטנה.'),h('p',{class:'s3-sum'},text),h('div',{class:'row',style:'margin-top:12px'},btn),res)));
  if(ctx.data.saved)sayBox(res,'<b>נשמר במחברת שלך.</b>');
  return gate(ctx,!!ctx.data.saved);
 }},

/* יחידה 5 */
{id:'check1',title:'בדיקה 1',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('באיזה גובה תולים את מרכז התמונה?',[['כ-145 ס"מ מהרצפה'],['צמוד לתקרה'],['כ-80 ס"מ מהרצפה']]),
 mount(el,ctx){const v=drawBox(hangSvg(145,1,true).html,'s7-hangq');
  return quiz(el,ctx,{kicker:'בדיקה 1',lede:'ארבע שאלות קצרות על מה שראית היום.',q:'באיזה גובה תולים את מרכז התמונה?',visual:v,
  opts:[['כ-145 ס"מ מהרצפה',1],['צמוד לתקרה',0],['כ-80 ס"מ מהרצפה',0]],hint:'היזכרי בקו המקווקו ובגובה העיניים.',right:'<b>נכון.</b> בערך בגובה העיניים, כמו בגלריה.'})}},

{id:'check2',title:'בדיקה 2',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('מה הכלל של השטיח בפינת הישיבה?',[['לפחות הרגליים הקדמיות של הרהיטים עליו'],['שטיח קטן באמצע החדר'],['השטיח תמיד צמוד לקיר']]),
 mount(el,ctx){const v=drawBox(rugPlan('front'),'s7-plan');
  return quiz(el,ctx,{kicker:'בדיקה 2',q:'מה הכלל של השטיח בפינת הישיבה?',visual:v,
  opts:[['לפחות הרגליים הקדמיות של הרהיטים עליו',1],['שטיח קטן באמצע החדר',0],['השטיח תמיד צמוד לקיר',0]],hint:'חשבי על השטיח שנראה כמו אי בודד.',right:'<b>נכון.</b> כך השטיח מאחד את פינת הישיבה.'})}},

{id:'check3',title:'בדיקה 3',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('השטיח השזור העתיק ביותר נמצא קפוא בקבר. איפה?',[['בהרי אלטאי שבסיביר'],['במדבר סהרה'],['בעיר רומא']]),
 mount(el,ctx){const v=drawBox(carpetArt(),'s7-wide');
  return quiz(el,ctx,{kicker:'בדיקה 3',q:'השטיח השזור העתיק ביותר נמצא קפוא בקבר. איפה?',visual:v,
  opts:[['בהרי אלטאי שבסיביר',1],['במדבר סהרה',0],['בעיר רומא',0]],hint:'השטיח נשמר בזכות הקרח.',right:'<b>נכון.</b> והיום הוא מוצג בהרמיטאז\' בסנט פטרבורג.'})}},

{id:'check4',title:'בדיקה 4',task:'בחרי תשובה אחת.',wide:true,
 say:sayOf('איך מסדרים פריטים על שולחן קפה?',[['שלושה, בגבהים שונים'],['שניים זהים, אחד ליד השני'],['כמה שיותר פריטים']]),
 mount(el,ctx){const v=drawBox(tableArt(true),'s7-wide');
  return quiz(el,ctx,{kicker:'בדיקה 4',q:'איך מסדרים פריטים על שולחן קפה?',visual:v,
  opts:[['שלושה, בגבהים שונים',1],['שניים זהים, אחד ליד השני',0],['כמה שיותר פריטים',0]],hint:'היזכרי בסוד הרביעי.',right:nameFill('<b>נכון.</b> גבוה, בינוני ונמוך. <b>ארבע מתוך ארבע, {name}.</b>')})}},

/* יחידה 6 */
{id:'home-idea',title:'רעיון לבית',task:'אם תרצי, כתבי שינוי קטן אחד ושמרי במחברת.',
 text:'רעיון לבית, למי שרוצה. בחרי תמונה או חפץ שאת אוהבת בסלון. הם בגובה העיניים? יש סביבם מקום לנשום? אפשר גם להניח כרית או שמיכה בזווית חדשה. מה השתנה באווירה?',
 mount(el,ctx){ideaScreen(el,ctx,{n:7,media:h('div',{class:'s6-ideaimg',html:tableArt(true)}),field:'השינוי הקטן שלי בסלון',
  text:'רעיון לבית, למי שרוצה. בחרי תמונה או חפץ שאת אוהבת בסלון. הם בגובה העיניים? יש סביבם מקום לנשום? אפשר גם להניח כרית או שמיכה בזווית חדשה. מה השתנה באווירה?'})}},

{id:'summary',title:'סיכום',task:'לחצי על כל כרטיס כדי להפוך אותו.',wide:true,
 text:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',
 mount(el,ctx){
  const th=html=>()=>h('span',{class:'s3-draw thumb',html});
  return flips(el,ctx,{kicker:'סיכום',title:'ארבעה כללים',lede:'ארבעה כללים לקחת הביתה. אלה ארבעת הסודות שפגשת בתחילת המפגש.',cls:'s3-flips',toggle:true,
   cards:[{t:'רכות בשכבות',front:th(curtainArt(true)),b:'וילון מהתקרה עד הרצפה, ושלושה מרקמים על הספה.'},
    {t:'השטיח הוא עוגן',front:th(rugPlan('front')),b:'לפחות הרגליים הקדמיות של הרהיטים עומדות עליו.'},
    {t:'האמנות בגובה העיניים',front:th(hangSvg(145,2).html),b:'מרכז התמונה, או מרכז הקבוצה, בגובה של כ-145 ס"מ.'},
    {t:'שלושה זה קסם',front:th(tableArt(true)),b:'קבוצות של שלושה, בגבהים ובחומרים שונים. ולבחור, לא להעמיס.'}]});
 }},

{id:'audio',title:'סקירה קולית',task:'לחצי על הנגן כדי לשמוע.',skip:()=>!audioOK,
 text:'סקירה קולית של המפגש, לשמיעה בנחת. אפשר גם לדלג.',
 mount(el,ctx){audioScreen(el,ctx,7)}},

{id:'feedback',title:'משוב וגשר',task:'דרגי בלחיצה, ואם תרצי, כתבי גם כמה מילים.',wide:true,hideNext:true,
 say:'{name}, סיימת את מפגש 7. תלית תמונה בגובה הנכון, בחרת שטיח ועיצבת מדף. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
 mount(el,ctx){feedbackScreen(el,ctx,{n:7,open:'{name}, סיימת את מפגש 7. תלית תמונה בגובה הנכון, בחרת שטיח ועיצבת מדף. ספרי איך היה. כל מילה עוזרת לבנות את המפגשים הבאים.',
  bridgeMedia:drawBox(bridgeArt(),'s7-bridge'),
  bridge:'במפגש הבא: הבית והטבע. תתאימי צמח לכל חלון, ותראי איך מים, אור וירוק נכנסים אל תוך הבית.'})}}
];

window.Salon.register(7,screens);
})();
