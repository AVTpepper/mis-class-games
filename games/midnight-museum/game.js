const rooms=[
{title:'The Clockmaker’s Secret',scene:'🕰️',story:'Two haunted clocks control the museum doors. One chimes every 9 minutes; another every 12. They both chimed together at midnight. The caretaker needs to know when they will chime together next.',html:`<div class="puzzlePanel"><div class="clockface"><div>🕘<br>9 min</div><div>🕛<br>12 min</div></div><p>Both clocks chimed at midnight. One chimes every 9 minutes and the other every 12. How many minutes pass before they next chime together?</p><div class="board multiples-workspace"><h3>Your multiples workspace</h3><p>Count in 9s for Clock A and in 12s for Clock B. Write both lists. The first number in both lists is the least common multiple.</p><label class="label" for="clockMultiplesA">Clock A multiples · every 9 minutes</label><input id="clockMultiplesA" type="text" autocomplete="off" placeholder="Write your own list"><label class="label" for="clockMultiplesB">Clock B multiples · every 12 minutes</label><input id="clockMultiplesB" type="text" autocomplete="off" placeholder="Write your own list"></div><label class="label" for="value1">Minutes until the chimes match</label><input id="value1" type="text" inputmode="numeric" placeholder="Number of minutes"><p class="note">The first lock takes the <b>ones digit</b> of that number.</p></div>`,hint:'Write multiples of 9 and 12 in your workspace. Find the first number appearing in both lists, then take its last digit.',validate:()=>val('value1')==='36',digit:'6',reveal:'36 is the first shared multiple. The ones digit is 6.'},
{title:'The Potion of Proportions',scene:'⚗️',story:'The rescue machine needs orange and purple potion. Keep the same balance of colours as you make a larger batch. Then work out how many jars to fill.',html:`<div class="puzzlePanel"><div class="tag">Potion recipe · orange : purple = 3 : 2</div><div class="bottles"><span class="bottle orange"></span><span class="bottle orange"></span><span class="bottle orange"></span><span class="bottle"></span><span class="bottle"></span></div><p><b>Part A:</b> The recipe uses 3 orange drops for every 2 purple drops. If you use <b>12 orange drops</b>, how many purple drops keep the same ratio (balance of colours)?</p><label class="label" for="value2a">Purple drops</label><input id="value2a" inputmode="numeric" type="text" placeholder="Enter a number"><p><b>Part B:</b> The caretaker prepared <b>12 empty jars</b>. Only <b>3/4</b> of the jars need potion. How many jars is that?</p><div class="board" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${Array(12).fill('<span class="tile">🫙</span>').join('')}</div><label class="label" for="value2b">Jars to fill (the next lock digit)</label><input id="value2b" inputmode="numeric" type="text" placeholder="Enter a number"></div>`,hint:'For Part A multiply both parts of 3:2 by 4. For Part B, divide 12 into four equal groups and take three.',validate:()=>val('value2a')==='8'&&val('value2b')==='9',digit:'9',reveal:'The equivalent ratio is 12:8, and 3/4 of 12 = 9 jars.'},
{title:'The Gallery of Misleading Headlines',scene:'🖼️',story:'A newspaper blames Pip for a fallen painting. Read the camera notes before you decide what happened. Work out what the camera shows and what people have only guessed.',html:`<div class="puzzlePanel"><div class="evidence"><div class="tile">👻<small>A ghost at the gallery door</small></div><div class="tile">🖼️<small>A painting has fallen</small></div><div class="tile">📸<small>Camera does not show the moment it fell</small></div></div><p>Camera notes: <i>“At 21:05, Pip was beside the gallery door. At 21:06, the painting was on the floor. The camera did not record anyone touching it.”</i></p><p><b>Part A:</b> Which statement is an observation: something the camera shows? An inference is a conclusion you draw from clues.</p><div class="options" data-group="fact"><button class="option" onclick="choose('fact','A',this)">A · Pip deliberately pushed the painting.</button><button class="option" onclick="choose('fact','FACT',this)">B · The painting was on the floor at 21:06.</button><button class="option" onclick="choose('fact','C',this)">C · Pip wanted to frighten everyone.</button></div><p><b>Part B:</b> Which headline sticks to the camera evidence without blaming someone?</p><div class="options" data-group="headline"><button class="option" onclick="choose('headline','A',this)">A · EVIL GHOST DESTROYS PRICELESS ART!</button><button class="option" onclick="choose('headline','B',this)">B · Painting falls; cause still unknown.</button><button class="option" onclick="choose('headline','C',this)">C · Museum security proves ghost is guilty.</button></div><p class="note">The responsible headline is labelled with the <b>second letter of the alphabet</b>. That gives you the next door digit: <b>its alphabet position</b>.</p></div>`,hint:'An observation is something the camera shows. A fair headline says what happened without guessing who caused it.',validate:()=>selected.fact==='FACT'&&selected.headline==='B',digit:'2',reveal:'The camera shows the fallen painting, not who caused it. The careful headline is B, the second letter.'},
{title:'The Rescue Robot That Failed',scene:'🤖',story:'An inventor built a robot to carry the painting to safety. Its camera works in daylight, but it cannot find its way in the dark. Use the test results to choose a change that could help.',html:`<div class="puzzlePanel"><div class="board"><div class="tag">Design-cycle checklist</div><div class="row" style="margin-top:10px"><span class="rune">1<br><small>Identify</small></span><span class="rune">2<br><small>Imagine</small></span><span class="rune">3<br><small>Build & test</small></span><span class="rune">4<br><small>Improve</small></span></div><p class="note">This numbered cycle is the museum inventor's version for the puzzle.</p></div><p><b>Part A:</b> The first test showed the camera fails in darkness. What should the designers do now?</p><div class="options" data-group="step"><button class="option" onclick="choose('step','A',this)">A · Ignore the evidence and launch it anyway.</button><button class="option" onclick="choose('step','B',this)">B · Improve the design, then test again.</button><button class="option" onclick="choose('step','C',this)">C · Claim that newer technology is always perfect.</button></div><p><b>Part B:</b> Which change could help the robot find its way in the dark?</p><div class="options" data-group="upgrade"><button class="option" onclick="choose('upgrade','A',this)">A · Give it a shinier logo.</button><button class="option" onclick="choose('upgrade','B',this)">B · Post a persuasive advert saying the robot never fails.</button><button class="option" onclick="choose('upgrade','C',this)">C · Add a low-light sensor and test it in darkness.</button></div><p class="note">Your code digit is the museum checklist number for <b>Improve</b>.</p></div>`,hint:'The camera fails in the dark. Choose a change that helps with that problem, then test it in the dark again.',validate:()=>selected.step==='B'&&selected.upgrade==='C',digit:'4',reveal:'Improve is stage 4 on the museum checklist. Low-light sensing directly addresses the failure.'},
{title:'The Poet Behind the Portrait',scene:'🎭',story:'Pip has left a message in a poem. First, choose a fair way to ask the museum director for help. Then read the poem to find a hidden word.',html:`<div class="puzzlePanel"><p><b>Part A:</b> Which sentence asks the museum director to check the facts fairly? Choose a clear request with a reason based on the camera notes.</p><div class="options" data-group="claim"><button class="option" onclick="choose('claim','A',this)">A · Everyone MUST believe Pip. He is so awesome!</button><button class="option" onclick="choose('claim','B',this)">B · The museum should review all camera evidence because the recording does not show who caused the painting to fall.</button><button class="option" onclick="choose('claim','C',this)">C · The museum is bad and its robots are terrible.</button></div><p><b>Part B:</b> Read the poem aloud. Read the first letter of each line from top to bottom. What five-letter word do they spell?</p><div class="poem">Careful eyes can change the tale.<br>Headlines shout, but facts prevail.<br>Evidence helps us understand.<br>Check the truth before you stand.<br>Keep your judgement close at hand.</div><label class="label" for="value5">Hidden word</label><input type="text" id="value5" placeholder="Five-letter word"><p class="note">This room's lock digit is the <b>number of letters</b> in the hidden word.</p></div>`,hint:'Look for a polite request with a reason based on the camera notes. For the poem, read the first letter of each line from top to bottom.',validate:()=>selected.claim==='B'&&val('value5').toUpperCase()==='CHECK',digit:'5',reveal:'The well-supported argument is B; the acrostic spells CHECK (five letters).'}
];
rooms.push({title:'The Serpent Arcade',scene:'🐍',story:'The museum’s security serpents guard the last digit. Two teammates must take turns at the controls. Each must clear 10 levels to power the final lock.',html:'<div class="puzzlePanel"><h3>Two players. Ten levels each.</h3><p>Press Start, then steer with arrows, WASD or the direction buttons. Collect 10 gold sparks each: Player 1 goes first, then Player 2. Avoid walls and your tail. A crash costs one team life and restarts that player’s turn.</p><div id="snakeGame"></div></div>',hint:'Plan wide turns and leave space around your tail. You can pause your turn to discuss your route. Both players need 10 / 10 before the lock opens.',validate:()=>Snake.complete(),digit:'7',reveal:'Both players cleared 10 levels. The security serpents release digit 7.'});
const el = id => document.getElementById(id);
// Move the existing controls rather than duplicating timer, navigation or save state.
const sidebarSlots=['.top','#teamStatus','.status','.room>.row','.footer'].map(selector=>{
  const node=document.querySelector(selector),anchor=document.createComment('Original information position');
  node.before(anchor);return {node,anchor};
});
function setGameLayout(active){
  toggleSidebar(false,false);
  sidebarSlots.forEach(({node,anchor},i)=>active?el(i===0?'sidebarTop':i===4?'sidebarBottom':'sidebarInfo').append(node):anchor.after(node));
  el('sidebarInfo').append(el('sidebarPreferences'));
  el('gameSidebar').classList.toggle('hidden',!active);
}
function toggleSidebar(open=!document.body.classList.contains('sidebar-open'),focus=true){
  if(open)Snake.pause();
  document.body.classList.toggle('sidebar-open',open);
  el('sidebarToggle').setAttribute('aria-expanded',String(open));
  el('main').inert=open&&matchMedia('(max-width:899px)').matches;
  if(focus)(open?el('sidebarClose'):el('sidebarToggle')).focus({preventScroll:true});
}
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('sidebar-open'))toggleSidebar(false);});
matchMedia('(min-width:900px)').addEventListener('change',()=>toggleSidebar(false,false));
const SAVE_KEY = 'midnight-museum-v2';
// A teacher test gets a copied session key in its own tab, never the team save.
function readTeacherTest(){
  try{
    const token=new URL(location.href).searchParams.get('teacherTest');
    if(!token)return null;
    const test=JSON.parse(sessionStorage.getItem('museum-teacher-test-'+token));
    return test&&Number.isInteger(test.room)&&test.room>=0&&test.room<rooms.length&&['search','lock'].includes(test.stage)?test:null;
  }catch{return null;}
}
const teacherTest=readTeacherTest();
const TEAM_LIVES = 5;
let lives = TEAM_LIVES, gameOver=false, gameOverReason='';
const objects = [
  [['🕰️','Inspect brass clock','The brass clock chimes every 9 minutes. Both clocks chimed at midnight.'],['🕛','Inspect silver clock','The silver clock chimes every 12 minutes. Find their first shared chime after midnight.'],['📓','Open clockmaker’s notebook','Count in 9s and in 12s. Find the first number in both lists. Its last digit opens the lock.']],
  [['⚗️','Read the recipe','Keep orange : purple at 3 : 2. Today the machine uses 12 orange drops.'],['📦','Open jar cupboard','There are 12 jars. Fill three out of every four. You will model this fraction with jars in the lock activity.'],['🔎','Inspect glass etchings','The glass shows three orange drops and two purple drops. Add these drops at the mixing bench to uncover the hidden recipe.']],
  [['📸','Examine camera record','21:05: Pip stands beside the gallery door. 21:06: a painting lies on the floor. No recording shows anyone touching it.'],['📰','Inspect the newspaper','“EVIL GHOST DESTROYS PRICELESS ART!” The writer blames Pip, but the camera does not show who caused the fall. Discuss which parts are facts and which are guesses.'],['🔎','Search behind the frame','A folded editor’s note reads: report only what you can support. The missing camera moment leaves the cause unknown.']],
  [['🤖','Read robot test log','Daylight: reaches the painting in 3 of 3 tests. Darkness: reaches it in 0 of 3 tests. Its camera cannot find the way in the dark.'],['🧰','Open inventor’s toolkit','A low-light sensor may help the robot see in darkness. A shiny logo changes its appearance. Every proposed improvement needs another test.'],['📋','Read maintenance note','Test the new sensor in the dark, where the old camera failed. Check whether the change helps.']],
  [['✉️','Read director’s letter','“Give me a clear recommendation and evidence. Tell me what the museum should do and why.”'],['🎭','Turn over the portrait','Pip’s poem hides a message in the first letter of each line. Read it aloud together, then read down its left edge.'],['📜','Unfold the hidden page','The strips now form one poem. Read the first letter of each line from top to bottom to find Pip’s message.']],
  [['🕹️','Inspect arcade cabinet','Player 1 clears 10 levels, then Player 2 clears 10. Collect one gold spark per level. Both turns are required.'],['🛡️','Read safety plaque','Your team shares five lives. A wrong lock answer, wrong final code or Snake crash costs one life. Lose your last life and you must start over from Room 1.'],['🔧','Pull out service card','Both circuits are powered. Clear ten levels for Player 1, then pass the keyboard to Player 2 for another ten levels.']]
];
let index = 0, code = [], remaining = 1200, running = false, timer = null;
let activeClue=null;
let clueHistory=Array.from({length:6},()=>[]),journalRoom=0,journalClue=null,sidebarTab='info',countdownShown=true;
try{countdownShown=localStorage.getItem('museum-countdown')!=='hidden';}catch{}
function setSidebarTab(tab){
  el('gameSidebar').classList.toggle('viewing-clues',tab==='clues');
  sidebarTab=tab;el('sidebarInfo').classList.toggle('hidden',tab!=='info');el('sidebarClues').classList.toggle('hidden',tab!=='clues');
  el('infoTab').setAttribute('aria-pressed',String(tab==='info'));el('cluesTab').setAttribute('aria-pressed',String(tab==='clues'));
}
function selectJournalRoom(room){journalRoom=room;journalClue=null;renderNotebook();}
function readClue(i){journalClue=i;if(journalRoom===index)activeClue=i;renderNotebook();save();}
function renderNotebook(){
  const found=clueHistory[journalRoom]||[];
  el('clueCount').textContent=clueHistory.reduce((total,entries)=>total+entries.length,0);
  el('journalRoom').innerHTML=rooms.map((room,i)=>i<=index&&i<6?`<option value="${i}" ${i===journalRoom?'selected':''}>${i+1}. ${room.title}</option>`:'').join('');
  if(!found.includes(journalClue))journalClue=found.at(-1)??null;
  el('clueChips').innerHTML=found.map(i=>`<button class="mini ${i===journalClue?'selected':''}" aria-pressed="${i===journalClue}" onclick="readClue(${i})">${objects[journalRoom][i][1]}</button>`).join('');
  const clue=journalClue===null?null:objects[journalRoom][journalClue];
  el('objectClue').innerHTML=clue?`<div class="tag">Clue collected</div><h3>${clue[1]}</h3><p>${clue[2]}</p>`:'<p>Click the glowing objects in the illustration. Collected clues stay here throughout your rescue.</p>';
}
function toggleCountdown(){countdownShown=!countdownShown;try{localStorage.setItem('museum-countdown',countdownShown?'shown':'hidden');}catch{}renderPreferences();}
function renderPreferences(){
  el('timerToggle').textContent=`Countdown: ${countdownShown?'shown':'hidden'}`;el('timerToggle').setAttribute('aria-pressed',String(countdownShown));
  el('clock').parentElement.classList.toggle('hidden',!countdownShown);el('mobileClock').classList.toggle('hidden',!countdownShown);el('finalClock').parentElement.classList.toggle('hidden',!countdownShown);MuseumAudio.render();
}
let roomFlow={room:0,stage:'search',part:0};
let selected = {}, inspected = [], answers = {}, jars = [], started = false, won = false, deadline = 0;
function val(id) { return (el(id)?.value || '').trim(); }
function save() {
  if(teacherTest)return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({index,code,remaining,running,selected,inspected,answers,jars,started,won,deadline,lives,gameOver,gameOverReason,roomFlow,activeClue,clueHistory,interludes:Interludes.snapshot(),arcade:Snake.snapshot(),exploration:Exploration.snapshot()})); } catch {}
}
function restore() {
  if(teacherTest)return;
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!s || !Number.isInteger(s.lives) || s.lives<0 || s.lives===0&&s.gameOver!==true || s.lives>TEAM_LIVES || !s.started || !Number.isInteger(s.index) || s.index < 0 || s.index > rooms.length || !Array.isArray(s.code) || s.code.join('') !== rooms.slice(0,s.index).map(r=>r.digit).join('') || s.code.length !== s.index || !Number.isFinite(s.remaining) || s.remaining < 0 || s.remaining > 1200) return;
    gameOver=s.lives===0;gameOverReason=typeof s.gameOverReason==='string'?s.gameOverReason.slice(0,300):'';
    lives=s.lives; Snake.restore(s.arcade); Exploration.restore(s.exploration);
    index=s.index; code=s.code; remaining=s.remaining; selected=s.selected || {}; inspected=Array.isArray(s.inspected)?s.inspected:[]; answers=s.answers || {}; jars=Array.isArray(s.jars)?s.jars:[]; started=true; won=!!s.won && index===rooms.length;
    roomFlow=s.roomFlow?.room===index&&['search','mechanism','reveal','lock'].includes(s.roomFlow.stage)?{room:index,stage:s.roomFlow.stage,part:s.roomFlow.part===1?1:0}:{room:index,stage:index<rooms.length&&Exploration.complete(index)&&inspected.length===3?'lock':'search',part:0};
    activeClue=Number.isInteger(s.activeClue)&&inspected.includes(s.activeClue)?s.activeClue:null;
    roomFlow.part=0;
    clueHistory=Array.from({length:6},(_,i)=>i<index?[0,1,2]:i===index?[...inspected]:[]);
    if(Array.isArray(s.clueHistory))s.clueHistory.slice(0,6).forEach((entries,i)=>{if(Array.isArray(entries))clueHistory[i]=[...new Set(entries.filter(n=>[0,1,2].includes(n)))];});
    Interludes.restore(s.interludes);if(Interludes.pending()!==null&&Interludes.pending()!==index)Interludes.restore(null);
    journalRoom=Math.min(index,5);journalClue=activeClue;
    running=!gameOver&&!won && remaining>0; deadline=s.running&&Number.isFinite(s.deadline)?s.deadline:Date.now()+remaining*1000;
    if(running) remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
    if(!remaining) running=false;
    el('enterBtn').textContent = won ? 'Visit your rescue →' : 'Continue your rescue →';
  } catch {}
}
function show(section) {
  Snake.pause(); updateLives();
  el('lifeNotice').classList.add('hidden');
  document.body.classList.toggle('playing',['game','interlude'].includes(section));
  setGameLayout(['game','interlude'].includes(section));
  MuseumAudio.setSceneActive(['game','interlude'].includes(section));
  if(section!=='teacher')lockTeacherRoom();
  ['home','game','interlude','final','win','vote','teacher'].forEach(x=>el(x).classList.toggle('hidden',x!==section));
  Interludes.setActive(section==='interlude');
  renderNotebook();renderPreferences();
  window.scrollTo({top:0,behavior:'instant'});
  el('main').focus({preventScroll:true});
  el('teacherTestBanner').classList.toggle('hidden',!teacherTest);
}
function resumeGame() {
  if(gameOver)return showGameOver();
  if(!started) return startGame();
  if(won) return show('win');
  if(Interludes.pending()){Interludes.render();return show('interlude');}
  if(index===rooms.length) { renderFinal(); return show('final'); }
  render(); show('game');
}
function startGame(withIntro=true) {
  el('gameOverDialog').close();el('lifeNotice').classList.add('hidden');gameOver=false;gameOverReason='';
  Interludes.reset();clueHistory=Array.from({length:6},()=>[]);journalRoom=0;journalClue=null;setSidebarTab('info');
  roomFlow={room:0,stage:'search',part:0};
  activeClue=null; Exploration.reset(); Snake.reset(); lives=TEAM_LIVES; clearInterval(timer); index=0; code=[]; remaining=1200; selected={}; inspected=[]; answers={}; jars=[]; started=true; won=false; running=true; deadline=Date.now()+remaining*1000;
  el('finalCode').value=''; el('finalFeedback').textContent='';
  el('enterBtn').textContent='Continue your rescue →';
  timer=setInterval(tick,1000); render(); show('game'); save();
  if(withIntro)Cutscene.play(0);
}
function tick() {
  if(!running) return;
  remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000)); updateClock();
  if(remaining===0) {running=false; updateClock(); const target=index===rooms.length?'finalFeedback':'feedback'; el(target).textContent='The museum bell rings! You may keep solving: the timer is for atmosphere.';}
  save();
}
function updateClock() {
  el('clock').textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
  el('clock').classList.toggle('low',remaining<180);
  el('mobileClock').textContent=el('clock').textContent;
  if(el('finalClock')) el('finalClock').textContent=el('clock').textContent;
}
function render() {
  const r=rooms[index];
  if(journalRoom!==index){journalRoom=index;journalClue=null;}
  roomFlow.part=0;
  el('roomNo').textContent=`Room ${index+1} of ${rooms.length}`;
  el('scene').textContent=r.scene; el('title').textContent=r.title; el('story').textContent=r.story;
  el('challenge').dataset.room=index;
  el('challenge').innerHTML=r.html;
  splitLockActivities();
  if(index===1) {
    const board=el('challenge').querySelector('.board');
    board.innerHTML=Array.from({length:12},(_,i)=>`<button class="jar" aria-label="Jar ${i+1}" aria-pressed="false" onclick="toggleJar(${i},this)">🫙</button>`).join('')+'<p id="jarCount" role="status"></p>';
    board.querySelectorAll('.jar').forEach((b,i)=>paintJar(b,i)); updateJars();
  }
  el('challenge').querySelectorAll('input').forEach(input=>{ input.value=answers[input.id] || ''; input.addEventListener('input',()=>{answers[input.id]=input.value;save();}); });
  el('challenge').querySelectorAll('input[id^="value"]').forEach(input=>{
    input.setAttribute('enterkeyhint','send');
    input.addEventListener('keydown',event=>{
      if(event.key!=='Enter'||event.isComposing||event.repeat||document.querySelector('dialog[open]')||el('checkBtn').disabled||!el('checkBtn').checkVisibility())return;
      event.preventDefault();checkAnswer();
    });
  });
  el('challenge').querySelectorAll('.option').forEach(button=>{
    button.setAttribute('aria-pressed','false');
    const match=button.getAttribute('onclick').match(/choose\('([^']+)','([^']+)'/);
    if(match && selected[match[1]]===match[2]) {button.classList.add('selected');button.setAttribute('aria-pressed','true');}
  });
  el('feedback').textContent=remaining?'':'The bell has rung, but you may keep solving.'; el('feedback').className='feedback';
  renderProgress();
  renderObjects(); updateClock();
}
function renderProgress(){
  el('progress').innerHTML=rooms.map((r,i)=>`<span class="${i<index?'done':''}" title="Room ${i+1}: ${i<index?'cleared':i===index?'current':'waiting'}"></span>`).join('');
  el('progress').setAttribute('aria-label',`${index} of ${rooms.length} rooms cleared`);
  el('codeSoFar').textContent=code.length?code.join(' · '):'None yet';
}
function renderObjects() {
  if(roomFlow.room!==index)roomFlow={room:index,stage:'search',part:0};
  el('exploration').innerHTML=Exploration.render(index);
  const ready=Exploration.complete(index)&&objects[index].every((o,i)=>inspected.includes(i));
  // A stale or older save may point at a later activity before its prerequisites.
  if(roomFlow.stage==='lock'&&!ready)roomFlow.stage=Exploration.complete(index)?'reveal':'search';
  const stage=roomFlow.stage,lock=stage==='lock',search=stage==='search'||stage==='reveal';
  el('exploration').classList.toggle('hidden',lock);
  document.querySelector('.room-scene').classList.toggle('hidden',!search);
  document.querySelector('.search-instruction').classList.toggle('hidden',!search);
  clueHistory[index]=[...inspected];renderNotebook();
  document.querySelector('.scene-task').classList.toggle('hidden',stage!=='mechanism');
  el('challenge').classList.toggle('hidden',!lock);
  el('checkBtn').disabled=!ready;
  el('checkBtn').classList.toggle('hidden',!lock||roomFlow.part<lockPartCount()-1);
  el('activityBack').disabled=stage==='search';
  const labels={search:'1 / 4 · Search the room',mechanism:'2 / 4 · Complete the room task',reveal:'3 / 4 · Read the hidden clues',lock:`4 / 4 · Solve the lock${lockPartCount()>1?` · Part ${roomFlow.part+1} of ${lockPartCount()}`:''}`};
  el('activityTitle').textContent=labels[stage];
  const next=el('activityNext');
  next.classList.toggle('hidden',lock&&roomFlow.part===lockPartCount()-1);
  next.disabled=stage==='search'?!objects[index].every((o,i)=>!Exploration.canInspect(index,i)||inspected.includes(i)):stage==='mechanism'?!Exploration.complete(index):stage==='reveal'?!ready:false;
  next.textContent=lock?'Next part \u2192':'Continue \u2192';

  if(index===5 && lock)Snake.mount();
}
function lockPartCount(){return 1;}
function splitLockActivities(){
  if(index===5)return;
  const panel=el('challenge').querySelector('.puzzlePanel'),children=[...panel.children];
  const boundary=index===0?children.indexOf(panel.querySelector('.multiples-workspace'))+1:children.findIndex(child=>child.tagName==='P'&&child.textContent.startsWith('Part B:'));
  panel.classList.add('questions-together');
  const context=document.createElement('div');context.className='lock-context';
  if(index===2){context.textContent='Camera record: at 21:05 Pip was beside the gallery door. At 21:06 the painting was on the floor. No recording shows anyone touching it.';}
  if(index===3){context.textContent='Museum design cycle: 1 Identify, 2 Imagine, 3 Build & test, 4 Improve. The original camera failed in darkness.';}
  if(context.textContent)panel.append(context);
  for(let part=0;part<2;part++){
    const section=document.createElement('section');section.className='lock-question';section.setAttribute('aria-label',index===0?(part===0?'Multiples workspace':'Lock answer'):'Question '+(part===0?'A':'B'));
    children.slice(part===0?0:boundary,part===0?boundary:undefined).forEach(child=>{if((index===2&&(child.matches('.evidence')||child.textContent.startsWith('Camera notes:')))||(index===3&&child.matches('.board')))child.remove();else section.append(child);});
    panel.append(section);
  }
}
function moveActivity(direction){
  const stages=['search','mechanism','reveal','lock'];
  if(direction>0&&el('activityNext').disabled)return;
  Snake.pause();
  if(roomFlow.stage==='lock'&&direction<0&&roomFlow.part>0)roomFlow.part--;
  else if(roomFlow.stage==='lock'&&direction>0&&roomFlow.part<lockPartCount()-1)roomFlow.part++;
  else {roomFlow.stage=stages[Math.max(0,Math.min(3,stages.indexOf(roomFlow.stage)+direction))];roomFlow.part=0;}
  el('feedback').textContent='';
  renderObjects();save();el('activityTitle').focus({preventScroll:true});
  window.scrollTo({top:0,behavior:'instant'});
}
function inspectObject(i) {
  if(!Exploration.canInspect(index,i))return;
  activeClue=i;
  const newlyFound=!inspected.includes(i);
  if(!inspected.includes(i)) inspected.push(i);
  renderObjects(); save();
  const object=el('exploration').querySelectorAll('.object')[i];
  if(newlyFound)object.classList.add('clue-new');
  object.focus({preventScroll:true});
  Snake.pause();journalRoom=index;journalClue=i;setSidebarTab('clues');renderNotebook();if(newlyFound)MuseumAudio.play('clue');
  if(matchMedia('(max-width:899px)').matches)toggleSidebar(true);
}
function paintJar(button,i) { button.classList.toggle('filled',jars.includes(i)); button.setAttribute('aria-pressed',String(jars.includes(i))); }
function updateJars() { el('jarCount').textContent=`${jars.length} of 12 jars filled. Model three-fourths, then enter your answer.`; }
function toggleJar(i,button) { jars=jars.includes(i)?jars.filter(n=>n!==i):[...jars,i]; paintJar(button,i); updateJars(); save(); }
function choose(group,value,button) {
  selected[group]=value;
  document.querySelectorAll(`[data-group="${group}"] .option`).forEach(e=>{e.classList.remove('selected');e.setAttribute('aria-pressed','false');});
  button.classList.add('selected');button.setAttribute('aria-pressed','true');save();
}
function showHint() {el('feedback').className='feedback';el('feedback').textContent='👻 Pip whispers: '+rooms[index].hint;}
let lockEffectTimer=null;
function playLockEffect(success,roomIndex=index,finalRescue=false) {
  MuseumAudio.play(success?'success':'failure');
  clearTimeout(lockEffectTimer);
  document.querySelector('.lock-effect')?.remove();
  const effect=document.createElement('div');
  effect.className='lock-effect';
  effect.dataset.outcome=success?'success':'failure';
  effect.dataset.room=finalRescue?'rescue':String(roomIndex);
  effect.setAttribute('aria-hidden','true');
  const r=rooms[roomIndex];
  const sparks=Array.from({length:12},(_,i)=>`<i class="lock-spark" style="--angle:${i*30}deg;--delay:${i*18}ms"></i>`).join('');
  effect.innerHTML=`<div class="lock-stage">
    <div class="lock-motif">${finalRescue?'👻':r?.scene||'🚪'}</div>
    <div class="lock-art">${sparks}<svg viewBox="0 0 120 130" focusable="false">
      <path class="lock-shackle" d="M34 57 V34 C34 0 86 0 86 34 V57"/>
      <rect class="lock-body" x="17" y="52" width="86" height="68" rx="15"/>
      <circle class="lock-keyhole" cx="60" cy="79" r="8"/><path class="lock-keyhole" d="M56 84 H64 L67 101 H53 Z"/>
    </svg></div>
    <strong>${success?(finalRescue?'Pip is free!':'Lock opened!'):'Lock sealed'}</strong>
    <span>${success?(finalRescue?'The painting releases its magic.':`Digit ${r.digit} recovered`):'One team life lost'}</span>
  </div>`;
  document.body.append(effect);
  lockEffectTimer=setTimeout(()=>effect.remove(),success?1550:950);
}
function checkAnswer() {
  if(gameOver)return;
  if(roomFlow.stage!=='lock'||roomFlow.part!==lockPartCount()-1)return;
  if(!Exploration.complete(index))return;
  if(index===5 && !Snake.complete())return;
  if(!objects[index].every((o,i)=>inspected.includes(i))) return;
  const r=rooms[index];
  if(!r.validate()) {loseLife('The lock stays closed. Read the clues and check your answers.');return;}
  playLockEffect(true);
  code.push(r.digit);index++;activeClue=null;selected={};inspected=[];answers={};jars=[];
  renderProgress();
  if(index===rooms.length) {renderFinal();show('final');}
  else if(Interludes.begin(index)){show('interlude');}
  else {render();setSidebarTab('info');show('game');el('feedback').textContent='✓ Lock opened! '+r.reveal;}
  save();
  document.querySelector('.lock-effect')?.remove();
  Cutscene.play(index);
}
function renderRoomAfterBreak(){render();setSidebarTab('info');show('game');el('activityTitle').focus({preventScroll:true});}
function updateLives() {
  el('teamStatus').classList.toggle('hidden',!started||won);
  el('lives').textContent=lives+' / '+TEAM_LIVES+' lives';
  el('mobileLives').textContent=el('lives').textContent;
  el('lives').setAttribute('aria-label',lives+' of '+TEAM_LIVES+' team lives remaining');
}
// Returns false when no lives remain and the team must start again.
function loseLife(reason,target='feedback') {
  if(gameOver)return false;
  playLockEffect(false);
  lives--;
  if(lives<=0) {
    gameOver=true;gameOverReason=reason;running=false;clearInterval(timer);Snake.pause();updateLives();save();showGameOver();
    return false;
  }
  updateLives();save();el(target).className='feedback error';
  const remaining=`${lives} ${lives===1?'life':'lives'} left.`,warning='If you lose your last life, you must start over from Room 1.';
  el(target).textContent='Life lost! '+remaining+' '+reason+' '+warning;
  el('lifeNoticeTitle').textContent='Life lost! '+remaining;
  el('lifeNoticeReason').textContent=reason;
  el('lifeNotice').classList.remove('hidden');
  return true;
}
function showGameOver(){
  Snake.pause();el('lifeNotice').classList.add('hidden');
  el('gameOverReason').textContent=gameOverReason;
  if(!el('gameOverDialog').open)el('gameOverDialog').showModal();
}
el('gameOverDialog').addEventListener('cancel',event=>event.preventDefault());
function renderFinal() {
  el('runes').innerHTML=code.map((digit,i)=>`<span class="rune" title="Room ${i+1}">${digit}</span>`).join('');
  updateClock();
}
function unlock() {
  if(gameOver)return;
  if(val('finalCode')===code.join('') && code.length===rooms.length) {playLockEffect(true,index,true);running=false;won=true;save();show('win');celebrate();document.querySelector('.lock-effect')?.remove();Cutscene.play(7);}
  else {loseLife('The painting remains shut. Check all six digits and their order.', 'finalFeedback');}
}
function celebrate() {
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for(let i=0;i<45;i++) {const p=document.createElement('span');p.className='particle';p.setAttribute('aria-hidden','true');p.textContent=['✨','🎃','⭐','👻'][i%4];p.style.left=(Math.random()*100)+'%';p.style.animationDelay=(Math.random()*1.8)+'s';p.style.fontSize=(15+Math.random()*20)+'px';document.body.append(p);setTimeout(()=>p.remove(),6200);}
}
function requestRestart() { if(!started || window.confirm('Start a new team game? This clears the current team’s clues and timer.')) startGame(); }

const teacherStages=[
  {goal:'Find the least common multiple of 9 and 12.',answer:'36 minutes. Multiples of 9 are 9, 18, 27, 36; multiples of 12 are 12, 24, 36. The first shared multiple is 36. Take its ones digit: 6.',discussion:'How can you show that 36 is the first shared multiple, rather than just a shared multiple?'},
  {goal:'Scale equivalent ratios and calculate a fraction of a quantity.',answer:'Part A: 8 purple drops. Multiply both parts of 3:2 by 4 to get 12:8. Part B: 9 jars, because 12 ÷ 4 × 3 = 9. The jars give digit 9.',discussion:'Why must both parts of the recipe be multiplied by the same number? Use the clickable jars to model three groups of three.'},
  {goal:'Separate observation from inference and communicate responsibly.',answer:'Observation B: the painting was on the floor at 21:06. Headline B: “Painting falls; cause still unknown.” The camera does not establish who caused the fall. B is the second letter, giving digit 2.',discussion:'Which words in the dramatic headline make claims that the camera cannot support? What evidence would you need to identify a cause?'},
  {goal:'Use testing evidence to identify a technology limitation and improve a design.',answer:'Part A: B, improve the design and test again. Part B: C, add a low-light sensor and test in darkness. Improve is stage 4 in the museum checklist, giving digit 4.',discussion:'How would you test whether the new sensor solves the problem? The numbered design cycle is a simplified version created for this puzzle.'},
  {goal:'Choose a persuasive recommendation supported by evidence, then decode an acrostic.',answer:'Claim B recommends that the museum review all camera evidence and supplies a relevant reason. The first letters of the five poetry lines spell CHECK. Five letters gives digit 5.',discussion:'Identify the audience, the recommendation, the modal verb “should”, and the evidence. Read the poem aloud before reading its first letters downward.'},
  {goal:'Plan routes, practise spatial reasoning and share responsibility through two arcade turns.',answer:'Player 1 must collect 10 gold sparks to clear 10 levels. Player 2 must then do the same. Only when both show 10/10 can the team check the lock and receive digit 7.',discussion:'Each spark grows and speeds up the snake. Use arrows, WASD or the on-screen controls. A wall or tail collision costs one team life and resets the active player to level zero; the completed teammate’s turn remains until all team lives are lost. Pause to discuss a safe route.'}
];
function lockTeacherRoom() {
  el('teacherTestFeedback').textContent='';
  el('teacherInfo').replaceChildren();
  el('teacherInfo').classList.add('hidden');
  el('teacherGate').classList.remove('hidden');
  el('teacherCode').value='';el('teacherCode').removeAttribute('aria-invalid');el('teacherFeedback').textContent='';
}
function openTeacherRoom() {
  lockTeacherRoom();show('teacher');el('teacherCode').focus();
}
function launchTeacherTest(room,stage='search'){
  if(!el('teacherGate').classList.contains('hidden')||!el('teacherInfo').checkVisibility()||!Number.isInteger(room)||room<0||room>=rooms.length||!['search','lock'].includes(stage))return;
  const token=crypto.randomUUID(),key='museum-teacher-test-'+token;
  try{
    sessionStorage.setItem(key,JSON.stringify({room,stage}));
    const url=new URL(location.href);url.searchParams.set('teacherTest',token);url.hash='';
    const tab=window.open(url.href,'_blank');
    el('teacherTestFeedback').textContent=tab?'Test opened in a new tab. Your team’s saved progress is unchanged.':'The test tab could not open. Allow pop-ups for this site, then try again.';
  }catch{el('teacherTestFeedback').textContent='The test tab could not open. Allow session storage for this site, then try again.';}
  finally{try{sessionStorage.removeItem(key);}catch{}}
}
function startTeacherTest(test){
  startGame(false);
  index=test.room;code=rooms.slice(0,index).map(room=>room.digit);
  clueHistory=Array.from({length:rooms.length},(_,i)=>i<index?[0,1,2]:[]);
  inspected=test.stage==='lock'?[0,1,2]:[];
  if(test.stage==='lock')Exploration.restore(Exploration.snapshot().map((state,i)=>i===index?{...state,done:true,failed:true,passed:true}:state));
  roomFlow={room:index,stage:test.stage,part:0};render();show('game');
  el('activityTitle').focus({preventScroll:true});
}
function unlockTeacherRoom(event) {
  event.preventDefault();
  if(el('teacherCode').value!=='halloween123') {
    el('teacherCode').value='';el('teacherCode').setAttribute('aria-invalid','true');
    el('teacherFeedback').textContent='That code is incorrect. Try again.';el('teacherCode').focus();return;
  }
  el('teacherCode').removeAttribute('aria-invalid');el('teacherCode').value='';
  el('teacherGate').classList.add('hidden');
  el('teacherTestFeedback').textContent='';
  el('teacherInfo').innerHTML=`<div class="card"><h2>Plan the rescue</h2><p>Allow 5 minutes to introduce Pip, 20 minutes to escape, 10 minutes for costume voting and 5 minutes to celebrate. Aim for 2–3 minutes per curriculum room and reserve 4–5 minutes for the arcade and final code. Teams use one device; two teammates take the Snake turns.</p><p>Once a team starts, its countdown continues during cutscenes, navigation, teacher access, Snake pauses and time away from the site. Students cannot pause it. At zero time, teams may keep solving.</p><p>Optional lantern matching follows the potion room, and a firefly-catching break follows the robot room. Both can be skipped and cost no lives. The Info tab can hide the countdown; it still runs, and reaching zero never ends the rescue. Sound and an original Halloween waltz are optional and start off. Related lock questions share one screen, and the Clues tab keeps discoveries from every visited room.</p><p><b>Five shared lives:</b> an incorrect puzzle submission, incorrect final code or Snake crash costs one life. Hints and inspecting objects are free. Losing the last life opens a Game over screen. Select Start again to reset all answers, clues, digits, arcade progress and the timer, with five new lives.</p><p>Progress is saved in the current browser when storage is available. Use Start a new team game between groups. Refresh restores progress but never starts the snake automatically.</p></div>
    <div class="card teacher-testing"><h2>Test any room</h2><p>Choose Test room to try the search, room task and lock. Choose Test lock to jump straight to the questions or Snake. Each test opens in a new tab with five lives and 20 minutes. Close the test tab when you finish. Your team’s saved progress stays unchanged.</p></div>
    <div class="teacher-stages">${rooms.map((room,i)=>`<article class="card"><div class="tag">Stage ${i+1} · digit ${room.digit}</div><h2>${room.scene} ${room.title}</h2><div class="actions teacher-test-actions"><button class="primary" aria-label="Test room ${i+1}: ${room.title}" onclick="launchTeacherTest(${i})">Test room ${i+1} ↗</button><button aria-label="Test lock ${i+1}: ${room.title}" onclick="launchTeacherTest(${i},'lock')">Test lock ↗</button></div><p><b>Learning focus:</b> ${teacherStages[i].goal}</p><p><b>Scene walkthrough:</b> ${Exploration.guide(i)}</p><p><b>Answer and reasoning:</b> ${teacherStages[i].answer}</p><p><b>Discuss with students:</b> ${teacherStages[i].discussion}</p><p><b>Available hint:</b> ${room.hint}</p></article>`).join('')}</div>
    <div class="card"><h2>The final painting</h2><p>Assemble the six digits in room order: <strong class="teacher-rescue-code">${rooms.map(room=>room.digit).join('')}</strong>. A wrong rescue code costs one life. A correct code releases Pip and starts the celebration.</p><h3>Costume awards setup</h3><p>Create a Google Form for funniest, scariest, most creative and best homemade costume; link its responses to Google Sheets. In game.js, set GOOGLE_FORM_URL to the published HTTPS responder link ending in /viewform. A forms.gle short link opens in a new tab. Use costume labels or nominee numbers and check school access settings on a student device.</p><h3>Curriculum and deployment notes</h3><p>The supplied curriculum links are PYP 6 maths, perception and responsibility, technology limitations, persuasion and poetry. The original six teaching resources were not included in this checkout, so their alignment has not been independently verified. The questions are original.</p><p>This static site works offline and on GitHub Pages. The README includes deployment, editing, voting and ZIP instructions. This code gate keeps teacher information out of the normal student view; it is not secure authentication, and source inspection can reveal answers.</p></div>
    <button class="secondary" onclick="openTeacherRoom()">Lock teacher room</button>`;
  el('teacherInfo').classList.remove('hidden');el('teacherInfo').focus();
}

// PASTE YOUR GOOGLE FORM /viewform LINK BELOW. Do not use the /edit link.
const GOOGLE_FORM_URL='https://docs.google.com/forms/d/e/1FAIpQLSc4OojxYbd5VzChovNeGCGnjMCrabJye-ya-9DLnqHuXAny9w/viewform?usp=dialog';
function mountForm(){if(!GOOGLE_FORM_URL)return;let url;try{url=new URL(GOOGLE_FORM_URL);if(url.protocol!=='https:'||!(url.hostname==='docs.google.com'||url.hostname==='forms.gle'))return}catch{return}const shell=el('formShell');shell.innerHTML='';if(url.hostname==='docs.google.com'&&url.pathname.includes('/forms/')&&url.pathname.includes('/viewform')){const iframe=document.createElement('iframe');iframe.title='PYP 6 costume awards Google Form';url.searchParams.set('embedded','true');iframe.src=url.toString();iframe.loading='lazy';shell.append(iframe)}else{let p=document.createElement('p');p.textContent='Use the button below to open costume voting.';shell.append(p)}let a=document.createElement('a');a.href=GOOGLE_FORM_URL;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Open the voting form in a new tab ↗';a.style.color='#ffbb6d';shell.append(a)}document.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing&&!e.repeat&&e.target?.id==='finalCode'&&e.target.checkVisibility()&&!document.querySelector('dialog[open]')){e.preventDefault();unlock()}});restore();mountForm();updateClock();renderPreferences();renderNotebook();if(started&&running)timer=setInterval(tick,1000);

if(gameOver)showGameOver();
if(teacherTest)startTeacherTest(teacherTest);
