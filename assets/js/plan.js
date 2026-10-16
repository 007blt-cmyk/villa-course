/* הסלון של מזל · תוכנית הסלון ומתכנן הרהיטים (יחידות: סנטימטרים) */
(function(){
'use strict';
const NS='http://www.w3.org/2000/svg';
const W=640,H=560,PATH_Y=280,DOOR=[235,325],MIN=90;
const FOCAL={window:{x:320,y:0,label:'החלון אל הבריכה',short:'החלון'},fire:{x:320,y:H,label:'האח',short:'האח'}};
const SPEC={
  sofa:{name:'הספה',f:1,w:220,h:95,seat:true},
  chairA:{name:'הכורסה',f:1,w:85,h:85,seat:true,chair:true},
  chairB:{name:'הכורסה השנייה',f:1,w:85,h:85,seat:true,chair:true},
  table:{name:'שולחן השיש',w:120,h:60},
  rug:{name:'שטיח הצמר',w:240,h:170,flat:true},
  lamp:{name:'המנורה העומדת',f:1,w:40,h:40},
  plant:{name:'העציץ',w:56,h:56}
};
const START={sofa:{x:330,y:280,r:0},chairA:{x:575,y:285,r:180},chairB:{x:120,y:150,r:0},table:{x:470,y:150,r:0},rug:{x:220,y:440,r:0},lamp:{x:300,y:500,r:0},plant:{x:70,y:285,r:0}};
const SOLUTION={
  window:{rug:{x:320,y:105,r:0},table:{x:320,y:100,r:0},sofa:{x:320,y:190,r:0},chairA:{x:160,y:100,r:90},chairB:{x:480,y:100,r:270},lamp:{x:595,y:200,r:0},plant:{x:45,y:45,r:0}},
  fire:{rug:{x:320,y:455,r:0},table:{x:320,y:460,r:0},sofa:{x:320,y:370,r:180},chairA:{x:160,y:460,r:90},chairB:{x:480,y:460,r:270},lamp:{x:595,y:360,r:0},plant:{x:45,y:515,r:0}}
};
const clone=o=>JSON.parse(JSON.stringify(o));
function el(tag,a,...k){const e=document.createElementNS(NS,tag);if(a)for(const n in a)if(a[n]!=null)e.setAttribute(n,a[n]);for(const c of k)if(c!=null)e.append(c);return e}
function dims(id,p){const s=SPEC[id];return (p.r%180===0)?[s.w,s.h]:[s.h,s.w]}
function rect(id,p){const [w,h]=dims(id,p);return {x1:p.x-w/2,y1:p.y-h/2,x2:p.x+w/2,y2:p.y+h/2}}
function facing(p){const r=((p.r%360)+360)%360;return r===0?[0,-1]:r===90?[1,0]:r===180?[0,1]:[-1,0]}
function faces(p,t){const f=facing(p);const dx=t.x-p.x,dy=t.y-p.y;const L=Math.hypot(dx,dy)||1;return (f[0]*dx+f[1]*dy)/L>0.6}

/* ---------- ציור הרהיטים מלמעלה ---------- */
const INK='#1A3A35';
function drawPiece(id){
  const s=SPEC[id],w=s.w,h=s.h,g=el('g',{class:'body'});
  if(id==='sofa'){
    g.append(el('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:16,fill:'#EFE6D6',stroke:INK,'stroke-width':3}),
      el('rect',{x:-w/2,y:h/2-24,width:w,height:24,rx:10,fill:'#DCCDB4',stroke:INK,'stroke-width':2}),
      el('rect',{x:-w/2,y:-h/2,width:20,height:h,rx:10,fill:'#DCCDB4',stroke:INK,'stroke-width':2}),
      el('rect',{x:w/2-20,y:-h/2,width:20,height:h,rx:10,fill:'#DCCDB4',stroke:INK,'stroke-width':2}));
    for(const x of [-30,30])g.append(el('line',{x1:x,y1:-h/2+6,x2:x,y2:h/2-26,stroke:INK,'stroke-width':1.5,opacity:.6}));
    g.append(el('rect',{x:-70,y:-h/2+10,width:26,height:20,rx:6,fill:'#E0A63A',stroke:INK,'stroke-width':1.5}));
  }else if(id==='chairA'||id==='chairB'){
    g.append(el('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:18,fill:'#C65A3C',stroke:INK,'stroke-width':3}),
      el('path',{d:`M${-w/2+4} ${h/2-4} Q0 ${h/2-34} ${w/2-4} ${h/2-4}`,fill:'#9E3F25',stroke:INK,'stroke-width':2}),
      el('rect',{x:-w/2+16,y:-h/2+8,width:w-32,height:h-38,rx:10,fill:'#D97B5E',stroke:INK,'stroke-width':1.5}));
  }else if(id==='table'){
    g.append(el('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:10,fill:'#F6F5F1',stroke:INK,'stroke-width':3}),
      el('path',{d:`M${-w/2+10} ${-8} q25 -14 45 4 t50 -6`,fill:'none',stroke:'#A9A9A2','stroke-width':2}),
      el('path',{d:`M${-10} ${h/2-8} q18 -16 40 -8`,fill:'none',stroke:'#BEBEB6','stroke-width':1.5}));
  }else if(id==='rug'){
    g.append(el('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:6,fill:'#EBC77A',stroke:'#B88A2E','stroke-width':3}),
      el('rect',{x:-w/2+12,y:-h/2+12,width:w-24,height:h-24,rx:4,fill:'none',stroke:'#C65A3C','stroke-width':3,'stroke-dasharray':'10 7'}));
    for(let x=-w/2+30;x<w/2-20;x+=30)g.append(el('line',{x1:x,y1:-h/2+24,x2:x,y2:h/2-24,stroke:'#D9B25E','stroke-width':2}));
  }else if(id==='lamp'){
    g.append(el('circle',{r:20,fill:'#E0A63A',stroke:INK,'stroke-width':3}),el('circle',{r:7,fill:'#14474A'}));
  }else if(id==='plant'){
    g.append(el('circle',{r:16,fill:'#9DB39A',stroke:INK,'stroke-width':2}));
    for(let i=0;i<6;i++){const a=i*Math.PI/3;g.append(el('ellipse',{cx:Math.cos(a)*17,cy:Math.sin(a)*17,rx:13,ry:7,transform:`rotate(${i*60} ${Math.cos(a)*17} ${Math.sin(a)*17})`,fill:'#7E9C79',stroke:INK,'stroke-width':1.5}))}
  }
  return g;
}
function drawRoom(svg,{labels=true}={}){
  const defs=el('defs');
  const pat=el('pattern',{id:'oak',width:80,height:20,patternUnits:'userSpaceOnUse'},
    el('rect',{width:80,height:20,fill:'#E9D7B6'}),el('line',{x1:0,y1:20,x2:80,y2:20,stroke:'#D6C09A','stroke-width':1.5}),el('line',{x1:55,y1:0,x2:55,y2:20,stroke:'#D6C09A','stroke-width':1.2}));
  defs.append(pat);svg.append(defs);
  svg.append(el('rect',{x:0,y:0,width:W,height:H,fill:'url(#oak)'}));
  const wall={stroke:INK,'stroke-width':12,'stroke-linecap':'square'};
  svg.append(el('line',Object.assign({x1:0,y1:0,x2:180,y2:0},wall)),el('line',Object.assign({x1:460,y1:0,x2:W,y2:0},wall)),
    el('line',Object.assign({x1:W,y1:0,x2:W,y2:DOOR[0]},wall)),el('line',Object.assign({x1:W,y1:DOOR[1],x2:W,y2:H},wall)),
    el('line',Object.assign({x1:0,y1:H,x2:W,y2:H},wall)),
    el('line',Object.assign({x1:0,y1:0,x2:0,y2:DOOR[0]},wall)),el('line',Object.assign({x1:0,y1:DOOR[1],x2:0,y2:H},wall)));
  svg.append(el('rect',{x:180,y:-7,width:280,height:14,fill:'#CFE3EA',stroke:INK,'stroke-width':3}),el('line',{x1:180,y1:0,x2:460,y2:0,stroke:INK,'stroke-width':1.5}));
  svg.append(el('rect',{x:250,y:H-26,width:140,height:26,fill:'#D3C9B6',stroke:INK,'stroke-width':3}),el('rect',{x:285,y:H-18,width:70,height:18,fill:'#3A2E28'}),
    el('path',{d:`M305 ${H-2} q10 -14 15 -2 q6 -12 14 2 z`,fill:'#E0A63A'}));
  if(labels){
    const t=(x,y,s,a)=>el('text',{x,y,'text-anchor':a||'middle','font-family':'Assistant, Arial','font-size':22,'font-weight':700,fill:INK},s);
    svg.append(t(320,-20,'חלון אל הבריכה'),t(320,H+34,'אח'),t(W+16,DOOR[0]-14,'כניסה','end'),t(-16,DOOR[0]-14,'מרפסת','start'));
    svg.append(el('path',{d:`M${W+26} ${PATH_Y} h-22 m8 -9 l-9 9 l9 9`,stroke:'#C65A3C','stroke-width':4,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'}));
  }
}
function makeSvg(){const s=el('svg',{viewBox:`-70 -50 ${W+140} ${H+100}`,role:'img'});return s}

/* ---------- מדידת השביל ---------- */
function measure(layout){
  let min=Infinity,at=W/2,up=0,low=H;
  for(let x=10;x<=W-10;x+=10){
    let u=0,l=H,blocked=false;
    for(const id in layout){if(SPEC[id].flat)continue;const r=rect(id,layout[id]);
      if(x<r.x1||x>r.x2)continue;
      if(r.y2<=PATH_Y)u=Math.max(u,r.y2);else if(r.y1>=PATH_Y)l=Math.min(l,r.y1);else blocked=true}
    const w=blocked?0:l-u;
    if(w<min){min=w;at=x;up=blocked?PATH_Y:u;low=blocked?PATH_Y:l}
  }
  return {min,at,up,low};
}
function overlaps(layout){const ids=Object.keys(layout).filter(i=>!SPEC[i].flat);const bad=new Set();
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){const a=rect(ids[i],layout[ids[i]]),b=rect(ids[j],layout[ids[j]]);
    if(a.x1<b.x2-1&&a.x2>b.x1+1&&a.y1<b.y2-1&&a.y2>b.y1+1){bad.add(ids[i]);bad.add(ids[j])}}return bad}
function checks(layout,focal){
  const m=measure(layout);const F=FOCAL[focal];
  const t=layout.table;
  const sofaOk=faces(layout.sofa,F);
  const chairOk=id=>faces(layout[id],F)||faces(layout[id],t);
  const r=rect('rug',layout.rug);
  const rugOk=t.x>=r.x1&&t.x<=r.x2&&t.y>=r.y1&&t.y<=r.y2;
  return {width:m,path:m.min>=MIN,face:sofaOk&&chairOk('chairA')&&chairOk('chairB'),rug:rugOk,over:overlaps(layout)};
}

/* ---------- ציור תוכנית סטטית ---------- */
function staticPlan(layout,{labels=true,showPath=false,measureLine=false}={}){
  const svg=makeSvg();drawRoom(svg,{labels});
  const order=['rug','table','sofa','chairA','chairB','lamp','plant'];
  if(showPath)svg.append(pathLine());
  for(const id of order){const p=layout[id];const g=el('g',{transform:`translate(${p.x} ${p.y}) rotate(${p.r})`});g.append(drawPiece(id));svg.append(g)}
  if(measureLine)svg.append(ruler(measure(layout)));
  return svg;
}
function pathLine(){return el('line',{class:'pathline',x1:W-4,y1:PATH_Y,x2:4,y2:PATH_Y,stroke:'#C65A3C','stroke-width':6,'stroke-dasharray':'16 12','stroke-linecap':'round'})}
function ruler(m){
  const g=el('g',{class:'ruler'});const good=m.min>=MIN;const col=good?'#14474A':'#B0472B';
  const x=m.at, y1=m.up, y2=m.low;
  if(m.min<=0){g.append(el('circle',{cx:x,cy:PATH_Y,r:22,fill:'#B0472B',opacity:.85}),el('path',{d:`M${x-10} ${PATH_Y-10} l20 20 m0 -20 l-20 20`,stroke:'#fff','stroke-width':5,'stroke-linecap':'round'}));return g}
  const cap=Math.min(y2,y1+260);
  g.append(el('line',{x1:x,y1:y1+3,x2:x,y2:cap-3,stroke:col,'stroke-width':4}),
    el('path',{d:`M${x-9} ${y1+14} l9 -11 l9 11 M${x-9} ${cap-14} l9 11 l9 -11`,stroke:col,'stroke-width':4,fill:'none'}));
  const label=y2-y1>=300?'מרווח':Math.round(y2-y1)+' ס"מ';
  const lx=x>W-120?x-12:x+12;const anc=x>W-120?'end':'start';
  g.append(el('rect',{x:anc==='start'?lx-4:lx-120,y:(y1+cap)/2-20,width:124,height:38,rx:10,fill:'#fff',stroke:col,'stroke-width':2}),
    el('text',{x:anc==='start'?lx+58:lx-58,y:(y1+cap)/2+8,'text-anchor':'middle','font-family':'Assistant, Arial','font-size':24,'font-weight':800,fill:col},label));
  return g;
}

/* ---------- המתכנן האינטראקטיבי ---------- */
function planner(host,opts){
  const {h}=window.Salon;
  let layout=clone(opts.layout||START), focal=opts.focal||'window', sel=null, hints=0, lastHints=0, solved=!!opts.solved;
  const box=h('div',{class:'planbox'});const svg=makeSvg();svg.setAttribute('aria-label','תוכנית הסלון מלמעלה. אפשר לגרור רהיטים');box.append(svg);
  const status=h('div',{class:'panel'});const ctrl=h('div',{class:'panel'});
  const side=h('div',{class:'side'});
  const seg=h('div',{class:'seg',role:'group','aria-label':'מוקד העניין'},
    ...Object.entries(FOCAL).map(([k,f])=>h('button',{type:'button','aria-pressed':String(k===focal),onclick:()=>{focal=k;seg.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===focal)));update(true)},'data-k':k},f.label)));
  side.append(status,ctrl);
  host.prepend(h('div',{class:'head',style:'align-items:center;margin-bottom:8px'},h('h2',{style:'margin:0'},opts.title||'מתכנן הסלון'),h('div',{class:'row'},h('b',{style:'font-size:20px'},'הישיבה פונה אל:'),seg)));
  host.append(h('div',{class:'planner'},box,side));

  drawRoom(svg);
  const pathEl=pathLine();svg.append(pathEl);
  const layer=el('g');svg.append(layer);
  const rulerG=el('g');svg.append(rulerG);
  const nodes={};
  for(const id of ['rug','table','sofa','chairA','chairB','lamp','plant']){
    const g=el('g',{class:'piece',tabindex:0,role:'button','aria-label':SPEC[id].name,'data-id':id});
    g.append(drawPiece(id));nodes[id]=g;layer.append(g);
    g.addEventListener('pointerdown',e=>startDrag(e,id));
    g.addEventListener('focus',()=>select(id));
  }
  svg.addEventListener('pointerdown',e=>{if(!e.target.closest('.piece'))select(null)});
  function place(id){const p=layout[id];nodes[id].setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${p.r})`)}
  function clamp(id){const p=layout[id];const [w,hh]=dims(id,p);p.x=Math.min(W-w/2,Math.max(w/2,p.x));p.y=Math.min(H-hh/2,Math.max(hh/2,p.y))}
  function pt(e){const m=svg.getScreenCTM().inverse();const q=svg.createSVGPoint();q.x=e.clientX;q.y=e.clientY;return q.matrixTransform(m)}
  function startDrag(e,id){
    e.preventDefault();select(id,true);const g=nodes[id];g.focus({preventScroll:true});g.setPointerCapture(e.pointerId);
    const s=pt(e),p0={x:layout[id].x,y:layout[id].y};
    const mv=ev=>{const c=pt(ev);layout[id].x=Math.round((p0.x+c.x-s.x)/10)*10;layout[id].y=Math.round((p0.y+c.y-s.y)/10)*10;clamp(id);place(id);update()};
    const up=()=>{g.removeEventListener('pointermove',mv);g.removeEventListener('pointerup',up);g.removeEventListener('pointercancel',up);update(true)};
    g.addEventListener('pointermove',mv);g.addEventListener('pointerup',up);g.addEventListener('pointercancel',up);
  }
  function select(id,raise){sel=id;for(const k in nodes)nodes[k].classList.toggle('sel',k===id);if(id&&raise){layer.append(nodes[id]);layer.prepend(nodes.rug)}drawCtrl()}
  function move(dx,dy){if(!sel)return;layout[sel].x+=dx;layout[sel].y+=dy;clamp(sel);place(sel);update(true)}
  function rotate(){if(!sel)return;layout[sel].r=(layout[sel].r+90)%360;clamp(sel);place(sel);update(true)}
  svg.addEventListener('keydown',e=>{if(!sel)return;const k=e.key;const map={ArrowUp:[0,-10],ArrowDown:[0,10],ArrowLeft:[-10,0],ArrowRight:[10,0]};
    if(map[k]){e.preventDefault();move(...map[k])}else if(k==='r'||k==='R'||k==='ק'){e.preventDefault();rotate()}});
  svg.setAttribute('data-keys','1');
  function drawCtrl(){
    ctrl.replaceChildren();
    const acts=h('div',{class:sel?'':'row',style:sel?'display:grid;gap:8px':'margin-top:10px;display:flex;gap:10px;flex-wrap:wrap'},
        h('button',{class:'btn',type:'button',onclick:hint},'רמז'),
        hints>=2?h('button',{class:'btn',type:'button',onclick:()=>{layout=clone(SOLUTION[focal]);for(const k in nodes)place(k);update(true)}},'הראי לי פתרון'):null,
        h('button',{class:'btn',type:'button',onclick:()=>{layout=clone(START);for(const k in nodes)place(k);hints=0;update(true)}},'מההתחלה'));
    if(!sel){ctrl.append(h('h3',null,'איך מזיזים'),h('p',{style:'margin:0;font-size:20px;line-height:1.35'},'גררי רהיט עם העכבר, או לחצי עליו והזיזי אותו בחצים.'),acts);return}
    const B=(t,f,lbl)=>h('button',{type:'button',onclick:f,'aria-label':lbl},t);
    ctrl.append(h('h3',null,'נבחר: '+SPEC[sel].name),
      h('div',{class:'row',style:'gap:14px;align-items:center;flex-wrap:nowrap'},
        h('div',{class:'pad'},h('span'),B('↑',()=>move(0,-10),'למעלה'),h('span'),B('→',()=>move(10,0),'ימינה'),B('↓',()=>move(0,10),'למטה'),B('←',()=>move(-10,0),'שמאלה')),
        h('div',{style:'display:grid;gap:8px'},h('button',{class:'btn',type:'button',onclick:rotate},'סובבי'),h('button',{class:'btn',type:'button',onclick:()=>select(null)},'סיימתי')),acts));
  }
  function update(persist){
    const c=checks(layout,focal);
    rulerG.replaceChildren(ruler(c.width));
    for(const k in nodes)nodes[k].querySelector('.body').style.opacity=c.over.has(k)?.55:1;
    const okAll=c.path&&c.face&&c.rug&&c.over.size===0;
    const w=c.width.min;const wtxt=w<=0?'חסום':w>=300?'מרווח מאוד':Math.round(w)+' ס"מ';
    const K=[h('div',{class:'row',style:'justify-content:space-between'},h('h3',{style:'margin:0'},'רוחב השביל'),h('div',{class:'width-read '+(c.path?'good':'bad')},wtxt))];
    if(okAll)K.push(h('div',{class:'say',style:'margin-top:8px'},h('b',null,'בעלי הווילה מוקסמים'+(window.Salon.state.name?', '+window.Salon.state.name:'')+'.'),' השביל פתוח, הישיבה פונה אל '+FOCAL[focal].short+', והחם פוגש את הקר.'));
    else K.push(h('ul',{class:'checks',style:'margin-top:10px'},
        h('li',{class:c.path?'ok':''},'שביל פנוי של 90 ס"מ לפחות, מהכניסה אל המרפסת'),
        h('li',{class:c.face?'ok':''},'הספה פונה אל '+FOCAL[focal].short+', והכורסאות אליו או אל השולחן'),
        h('li',{class:c.rug?'ok':''},'שולחן השיש עומד על שטיח הצמר')));
    if(c.over.size)K.push(h('p',{class:'note',style:'margin:8px 0 0'},'שני רהיטים עומדים זה על זה. כדאי להרחיק אותם.'));
    status.replaceChildren(...K);
    lastHints=hints;
    if(okAll&&!solved){solved=true;opts.onSolved&&opts.onSolved()}
    if(persist&&opts.onChange)opts.onChange({layout:clone(layout),focal,solved});
  }
  function hint(){
    hints++;const c=checks(layout,focal);let id=null,msg='';
    if(!c.path){const m=c.width;for(const k in layout){if(SPEC[k].flat)continue;const r=rect(k,layout[k]);if(m.at>=r.x1&&m.at<=r.x2&&(r.y1<PATH_Y+60&&r.y2>PATH_Y-60)){id=k;break}}
      const F=id&&SPEC[id].f;msg=(id?SPEC[id].name:'משהו')+(F?' עומדת':' עומד')+' על השביל או קרוב אליו מדי. הזיזי '+(F?'אותה':'אותו')+' למעלה או למטה.'}
    else if(!c.face){id=faces(layout.sofa,FOCAL[focal])?(faces(layout.chairA,FOCAL[focal])||faces(layout.chairA,layout.table)?'chairB':'chairA'):'sofa';msg=SPEC[id].name+' עוד לא פונה למקום הנכון. לחצי עליה ועל "סובבי".'}
    else if(!c.rug){id='table';msg='גררי את שולחן השיש אל מרכז שטיח הצמר, או את השטיח אל השולחן.'}
    else if(c.over.size){id=[...c.over][0];const F=SPEC[id].f;msg=SPEC[id].name+(F?' עומדת':' עומד')+' על רהיט אחר. הרחיקי '+(F?'אותה':'אותו')+' מעט.'}
    else msg='הכול כבר מסודר. יפה מאוד.';
    if(id)select(id);else drawCtrl();window.Salon.toast(msg);update(false);
  }
  for(const k in nodes)place(k);drawCtrl();update(false);
}

window.SalonPlan={W,H,PATH_Y,START,SOLUTION,FOCAL,staticPlan,planner,measure,checks,pathLine};
})();
