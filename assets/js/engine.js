/* הסלון של מזל · מנוע הקורס
   ניווט בין מסכים, שמירת התקדמות בדפדפן, גיבוי ושחזור, הקראה בקול עברי, תפריט, מחברת ומשובים. */
(function(){
'use strict';
const KEY='salon_state_v1';
const SESSIONS=[
  {n:1,t:'מבית לחלל חלומות'},{n:2,t:'קפלים בזמן'},{n:3,t:'וילות יוקרה בישראל'},
  {n:4,t:'אור ואווירה'},{n:5,t:'סוד הצבעים והחומרים'},{n:6,t:'המטבח וחללי האירוח'},
  {n:7,t:'הלבשת הבית ואמנות'},{n:8,t:'הבית והטבע'},{n:9,t:'הבית החכם'},
  {n:10,t:'סיור במוזיאוני עיצוב'},{n:11,t:'סודות המעצבים'},{n:12,t:'הבית האידיאלי שלי'}
];

/* ---------- אחסון ---------- */
function fresh(){return {v:1,name:'',current:null,sessions:{},notebook:[],feedback:{},prefs:{big:false}}}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.v===1)return Object.assign(fresh(),s)}catch(e){}return fresh()}
let S=load();
let storageOk=true;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));storageOk=true}catch(e){storageOk=false}}
function sess(n){if(!S.sessions[n])S.sessions[n]={screen:0,data:{},done:false};return S.sessions[n]}

/* ---------- עזרים ---------- */
const $=(q,el=document)=>el.querySelector(q);
function h(tag,attrs,...kids){const el=document.createElement(tag);if(attrs)for(const k in attrs){const v=attrs[k];if(v==null||v===false)continue;
  if(k==='class')el.className=v;else if(k==='html')el.innerHTML=v;else if(k.startsWith('on'))el.addEventListener(k.slice(2),v);else el.setAttribute(k,v===true?'':v)}
  for(const c of kids.flat()){if(c==null||c===false)continue;el.append(c.nodeType?c:document.createTextNode(c))}return el}
const ICON={
  speak:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  stop:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  arrowL:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>',
  save:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 19h16"/></svg>',
  load:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M4 5h16"/></svg>',
  text:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18 9 6l5 12"/><path d="M6 14h6"/><path d="M15 18l3-7 3 7"/></svg>'
};
function toast(msg){document.querySelectorAll('.toast').forEach(t=>t.remove());const t=h('div',{class:'toast',role:'status'},msg);document.body.append(t);setTimeout(()=>t.remove(),2600)}
function fmtDate(ts){try{return new Date(ts).toLocaleDateString('he-IL',{day:'numeric',month:'long',year:'numeric'})}catch(e){return ''}}

/* ---------- קול ---------- */
const Voice={v:null,ready:false,speaking:false,
  pick(){if(!('speechSynthesis' in window))return;const all=speechSynthesis.getVoices();const he=all.filter(v=>/^(he|iw)/i.test(v.lang));
    this.v=he.find(v=>/Hila/i.test(v.name))||he.find(v=>/Natural|Online/i.test(v.name))||he[0]||null;this.ready=true},
  speak(text,onend){if(!('speechSynthesis' in window)){toast('הקראה לא זמינה בדפדפן הזה');return false}
    this.stop();if(!this.v)this.pick();const u=new SpeechSynthesisUtterance(text);u.lang='he-IL';if(this.v)u.voice=this.v;u.rate=.95;
    u.onend=u.onerror=()=>{this.speaking=false;onend&&onend()};this.speaking=true;speechSynthesis.speak(u);return true},
  stop(){if('speechSynthesis' in window)speechSynthesis.cancel();this.speaking=false}};
if('speechSynthesis' in window){Voice.pick();speechSynthesis.onvoiceschanged=()=>Voice.pick()}

/* ---------- מצב יישום ---------- */
const App={screens:[],session:null,idx:0,view:'home',cleanup:null};
const ui={};

function build(){
  document.title='הסלון של מזל';
  if(S.prefs.big)document.documentElement.dataset.big='1';
  const root=h('div',{class:'app'});
  ui.top=h('header',{class:'top'},
    h('button',{class:'brand',type:'button','aria-label':'למסך הבית של הקורס',onclick:()=>goHome()},
      h('img',{src:'assets/img/logo-chair.png',alt:''}),
      h('div',null,h('div',{class:'nm'},'הסלון של מזל'),h('div',{class:'sb'},'מסע בעיצוב פנים ווילות יוקרה'))),
    h('div',{class:'top-actions'},
      ui.where=h('div',{class:'where'}),
      ui.listen=h('button',{class:'pill',type:'button','aria-pressed':'false',onclick:toggleListen,html:ICON.speak+'<span>הקשיבי</span>'}),
      h('button',{class:'pill',type:'button',onclick:openMenu,html:ICON.menu+'<span>תפריט</span>'})));
  ui.stage=h('main',{class:'stage',id:'stage'});
  ui.prev=h('button',{class:'prev',type:'button',onclick:()=>go(-1)},h('span',{'aria-hidden':'true'},'→'),'הקודם');
  ui.next=h('button',{class:'next',type:'button',onclick:()=>go(1)},'הבא',h('span',{'aria-hidden':'true'},'←'));
  ui.step=h('span',{class:'step'});
  ui.nav=h('footer',{class:'nav'},ui.prev,ui.step,ui.next);
  ui.taskHint=h('span',{class:'tb-hint'},'קראי את ההנחיה לפני שאת פועלת');
  ui.taskText=h('span',{class:'tb-text'});
  ui.task=h('section',{class:'taskbar',hidden:true,'aria-label':'ההנחיה למסך'},
    h('span',{class:'tb-icon','aria-hidden':'true'},'✎'),h('div',{class:'tb-body'},ui.taskHint,ui.taskText));
  root.append(ui.top,ui.stage,ui.task,ui.nav);
  document.body.append(root);
  const fit=()=>document.documentElement.style.setProperty('--room',Math.max(420,ui.stage.clientHeight-34)+'px');
  if('ResizeObserver' in window)new ResizeObserver(fit).observe(ui.stage);fit();
  document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,[data-keys]'))return;
    if(App.view!=='session')return;if(e.key==='ArrowLeft'&&e.altKey)go(1);if(e.key==='ArrowRight'&&e.altKey)go(-1)});
}

function toggleListen(){
  if(Voice.speaking){Voice.stop();setListen(false);return}
  const t=currentSay();if(!t)return;
  if(Voice.speak(t,()=>setListen(false)))setListen(true);
  if(!Voice.v)toast('לא נמצא קול עברי במחשב. ההקראה תהיה בקול אחר.');
}
function setListen(on){ui.listen.setAttribute('aria-pressed',on);ui.listen.innerHTML=(on?ICON.stop:ICON.speak)+'<span>'+(on?'עצרי':'הקשיבי')+'</span>'}
function taskOf(sc,ctx){const t=typeof sc.task==='function'?sc.task(ctx):sc.task;return t?fill(t):''}
function currentSay(){
  if(App.view==='session'){const sc=App.screens[App.idx];const say=typeof sc.say==='function'?sc.say(ctxFor(sc)):sc.say;
    const tk=taskOf(sc,ctxFor(sc));
    return (tk?tk+' ':'')+fill(say||[sc.title,typeof sc.text==='function'?sc.text(ctxFor(sc)):sc.text].filter(Boolean).join('. '))}
  const el=ui.stage.querySelector('.screen');return el?el.innerText.slice(0,900):''
}
function fill(s){return String(s||'').replace(/\{name\}/g,S.name||'').replace(/,\s*\./g,'.').replace(/\s+\./g,'.')}

/* ---------- מסכי מפגש ---------- */
function visible(){return App.screens.filter(sc=>!(sc.skip&&sc.skip(S)))}
function ctxFor(sc){const ss=sess(App.session);if(!ss.data[sc.id])ss.data[sc.id]={};
  return {S,name:S.name,data:ss.data[sc.id],all:ss.data,save,done:()=>{ui.next.classList.add('glow')},next:()=>go(1),h,fill,toast,Voice,App,notebook:addNote,ICON}}

function isOpen(n){return !!(window.Salon&&window.Salon._reg&&window.Salon._reg[n])}
function openSession(n,screens,startIdx){
  App.view='session';App.session=n;App.screens=screens;
  const ss=sess(n);const vis=visible();
  let i=startIdx!=null?startIdx:Math.min(ss.screen||0,vis.length-1);
  App.idx=App.screens.indexOf(vis[Math.max(0,i)]);
  S.current={session:n};save();render();
}
function go(d){
  if(App.view!=='session'){goHome();return}
  const vis=visible();let p=vis.indexOf(App.screens[App.idx])+d;
  if(p<0)return;
  if(p>=vis.length){const nx=App.session+1;if(isOpen(nx)&&sess(App.session).done){window.Salon.start(nx)}else goHome();return}
  App.idx=App.screens.indexOf(vis[p]);sess(App.session).screen=p;save();render();
}
function render(){
  Voice.stop();setListen(false);
  if(App.cleanup){try{App.cleanup()}catch(e){}App.cleanup=null}
  ui.next.classList.remove('glow');ui.nav.hidden=false;
  const vis=visible();const sc=App.screens[App.idx];const p=vis.indexOf(sc);
  const ctx=ctxFor(sc);
  const el=h('section',{class:'screen'+(sc.wide?' wide':''),'aria-label':sc.title||''});
  ui.stage.replaceChildren(el);ui.stage.scrollTop=0;
  const r=sc.mount(el,ctx);if(typeof r==='function')App.cleanup=r;
  const tk=taskOf(sc,ctx);ui.task.hidden=!tk;ui.task.classList.remove('pulse');
  if(tk){ui.taskText.textContent=tk;void ui.task.offsetWidth;ui.task.classList.add('pulse')}
  ui.prev.disabled=p===0;
  ui.next.hidden=!!sc.hideNext;
  ui.next.firstChild.textContent=p===vis.length-1?((isOpen(App.session+1)&&sess(App.session).done)?'למפגש הבא ':'למסך הבית '):'הבא ';
  ui.step.textContent='מסך '+(p+1)+' מתוך '+vis.length;
  const pct=Math.round((p+1)/vis.length*12);
  ui.where.replaceChildren('מפגש '+App.session+' מתוך 12',h('span',{class:'bar','aria-hidden':'true'},...Array.from({length:12},(_,k)=>h('i',{class:k<pct-1?'on':k===pct-1?'now':''}))));
  const f=el.querySelector('h1,h2,button,input');
  if(f&&f.matches('h1,h2')){f.setAttribute('tabindex','-1');f.focus({preventScroll:true})}
}

/* ---------- מסך הבית ---------- */
function goHome(){
  Voice.stop();setListen(false);
  if(App.cleanup){try{App.cleanup()}catch(e){}App.cleanup=null}
  App.view='home';ui.nav.hidden=true;ui.task.hidden=true;ui.where.replaceChildren();
  const reg=SESSIONS.filter(x=>isOpen(x.n));
  const cur=reg.find(x=>!sess(x.n).done)||null;const last=reg[reg.length-1]||SESSIONS[0];
  const tgt=cur||last;const st=sess(tgt.n);const started=st.screen>0||st.done;
  const el=h('section',{class:'screen'});
  const left=h('div',{class:'copy'},
    h('span',{class:'kicker'},'הקורס'),
    h('h1',null,S.name?'שלום, '+S.name:'ברוכה הבאה'),
    h('p',{class:'lede'},!cur?'מפגש '+last.n+' הושלם. המפגש הבא בדרך.':started?'המסע שלך מחכה בדיוק במקום שעצרת.':tgt.n===1?'שנים־עשר מפגשים בעולם הווילות ובתי היוקרה. נתחיל מהסלון.':'המפגש הבא מחכה לך: '+tgt.t+'.'),
    h('div',{class:'row'},
      h('button',{class:'cta',type:'button',onclick:()=>window.Salon.start(tgt.n),html:(!cur?'לחזור למפגש '+last.n:started?'המשיכי מהמקום שעצרת':'בואי נתחיל')+ICON.arrowL})),
    h('p',{class:'note',style:'margin-top:22px'},'הכול נשמר אוטומטית בדפדפן הזה. כדאי לשמור גיבוי מדי פעם, דרך התפריט.'));
  const grid=h('div',{class:'sessions'},...SESSIONS.map(s=>{
    const st=S.sessions[s.n];const open=isOpen(s.n);const done=st&&st.done;
    return h('button',{type:'button',class:'sess'+(done?' done':open?' open':' soon'),disabled:!open,onclick:open?()=>window.Salon.start(s.n):null,'aria-label':'מפגש '+s.n+': '+s.t+(open?'':'. בקרוב')},
      h('span',{class:'n'},'מפגש '+s.n+(done?' · הושלם':open?'':' · בקרוב')),h('span',{class:'t'},s.t))}));
  el.append(h('div',{class:'home'},
    h('div',null,h('div',{class:'arch-wrap',style:'margin-bottom:18px'},h('div',{class:'arch-back'}),h('div',{class:'arch',style:'height:min(30vh,280px)'},h('img',{src:'assets/img/logo-full.png',alt:'כורסה, מנורה וצמח: הסמל של הסלון',style:'object-fit:contain;padding:18px;background:var(--paper)'}))),left),
    h('div',null,h('h2',{style:'font-size:34px;margin-top:4px'},'המפגשים'),grid)));
  ui.stage.replaceChildren(el);
}

/* ---------- מחברת ---------- */
function addNote(n){S.notebook.push(Object.assign({ts:Date.now(),session:App.session},n));save()}
function showNotebook(){
  closeOverlay();
  const items=S.notebook.slice().reverse();
  const body=items.length?h('div',{class:'nb'},...items.map(it=>{
    const box=h('div',{class:'item'},h('h3',null,it.title||''),h('div',{class:'d'},'מפגש '+it.session+' · '+fmtDate(it.ts)));
    if(it.text)box.append(h('p',{style:'margin:8px 0 0'},it.text));
    if(it.svg&&window.Salon.drawNote){const d=window.Salon.drawNote(it);if(d)box.append(d)}
    return box})):h('p',{class:'lede'},'המחברת עוד ריקה. כל מה שתשמרי במפגשים יופיע כאן.');
  overlay('המחברת שלי',body);
}
function showFeedback(){
  closeOverlay();
  const ent=Object.entries(S.feedback);
  const body=ent.length?h('div',{class:'nb'},...ent.map(([n,f])=>h('div',{class:'item'},
    h('h3',null,'מפגש '+n+' · '+(SESSIONS[n-1]||{}).t),h('div',{class:'d'},fmtDate(f.ts)),
    h('p',{style:'margin:8px 0 0'},'התוכן: '+(f.content||'לא סומן')),h('p',{style:'margin:4px 0 0'},'המראה והתמונות: '+(f.visual||'לא סומן')),
    h('p',{style:'margin:4px 0 0'},'החוויה בכלל: '+(f.overall||'לא סומן')),f.text?h('p',{style:'margin:8px 0 0;white-space:pre-wrap'},'במילים שלך: '+f.text):null))):h('p',{class:'lede'},'עוד אין משובים. בסוף כל מפגש יש מקום לכתוב.');
  overlay('המשובים שלי',body);
}

/* ---------- גיבוי ---------- */
function backup(){
  const data={app:'salon',version:1,exportedAt:new Date().toISOString(),state:S};
  const blob=new Blob([JSON.stringify(data,null,1)],{type:'application/json'});
  const a=h('a',{href:URL.createObjectURL(blob),download:'salon-backup-'+new Date().toISOString().slice(0,10)+'.json'});
  document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
  S.lastBackup=Date.now();save();toast('הגיבוי נשמר בתיקיית ההורדות');
}
function restore(){
  const inp=h('input',{type:'file',accept:'.json,application/json',style:'display:none'});
  inp.addEventListener('change',()=>{const f=inp.files[0];if(!f)return;const r=new FileReader();
    r.onload=()=>{try{const d=JSON.parse(r.result);if(d.app!=='salon'||!d.state||d.state.v!==1)throw 0;
        confirmBox('לשחזר מהגיבוי?','ההתקדמות שבדפדפן תוחלף במה ששמור בקובץ מ־'+fmtDate(d.exportedAt)+'.','שחזרי',()=>{S=Object.assign(fresh(),d.state);save();toast('ההתקדמות שוחזרה');goHome()})}
      catch(e){toast('הקובץ הזה הוא לא גיבוי של הקורס')}};r.readAsText(f)});
  document.body.append(inp);inp.click();setTimeout(()=>inp.remove(),60000);
}

/* ---------- חלונות ---------- */
function overlay(title,body,actions){
  closeOverlay();
  const dlg=h('div',{class:'dialog',role:'dialog','aria-modal':'true','aria-label':title},h('h2',null,title),body,
    h('div',{class:'row',style:'margin-top:22px'},...(actions||[]),h('button',{class:'btn',type:'button',onclick:closeOverlay},'סגרי')));
  const ov=h('div',{class:'overlay',onclick:e=>{if(e.target===ov)closeOverlay()}},dlg);
  ov.addEventListener('keydown',e=>{if(e.key==='Escape')closeOverlay()});
  document.body.append(ov);const b=dlg.querySelector('button');b&&b.focus();
}
function closeOverlay(){document.querySelectorAll('.overlay').forEach(o=>o.remove())}
function confirmBox(title,text,yes,fn){
  overlay(title,h('p',{class:'lede'},text),[h('button',{class:'btn solid',type:'button',onclick:()=>{closeOverlay();fn()}},yes)]);
}
function openMenu(){
  const it=(icon,label,fn)=>h('button',{type:'button',onclick:fn,html:ICON[icon]+'<span>'+label+'</span>'});
  overlay('תפריט',h('div',{class:'menu-list'},
    it('home','מסך הבית של הקורס',()=>{closeOverlay();goHome()}),
    it('book','המחברת שלי',showNotebook),
    it('heart','המשובים שלי',showFeedback),
    it('save','שמרי גיבוי של ההתקדמות',()=>{closeOverlay();backup()}),
    it('load','שחזרי מקובץ גיבוי',()=>{closeOverlay();restore()}),
    it('text',S.prefs.big?'אותיות בגודל רגיל':'אותיות גדולות יותר',()=>{S.prefs.big=!S.prefs.big;document.documentElement.dataset.big=S.prefs.big?'1':'';save();closeOverlay()})
  ));
}

/* ---------- ממשק ציבורי ---------- */
window.Salon={
  h,ICON,toast,Voice,fill,SESSIONS,
  get state(){return S},save,sess,
  register(n,screens){(this._reg||(this._reg={}))[n]=screens},
  start(n){const sc=this._reg&&this._reg[n];if(sc)openSession(n,sc)},
  setFeedback(n,f){S.feedback[n]=Object.assign({ts:Date.now()},f);save()},
  finish(n){const ss=sess(n);ss.done=true;ss.doneAt=Date.now();save()},
  backup,goHome,showNotebook
};
window.addEventListener('DOMContentLoaded',()=>{
  build();
  if(!S.name)window.Salon.start(1);else goHome();
  if(!storageOk)toast('הדפדפן לא מאפשר לשמור התקדמות');
});
})();
