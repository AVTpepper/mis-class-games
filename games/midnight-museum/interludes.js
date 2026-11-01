/* Short, optional changes of pace. They never cost lives or award code digits. */
const Interludes=(()=>{
  const labels=['Moon','Star','Pumpkin','Ghost','Bat','Spider'],symbols=['☾','★','🎃','👻','🦇','🕷️'];
  const fresh=()=>({pending:null,completed:[],cards:[0,1,2,1,0,2,3,4,5,3,4,5],matched:[],open:[],moves:0,caught:0});
  let state=fresh(),frame=null,beam={x:50,y:50},target={x:50,y:50},bug={x:25,y:25},lastFrame=0,manual=false;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  function restore(saved){
    state=fresh();if(!saved||typeof saved!=='object')return;
    state.pending=[2,4].includes(saved.pending)?saved.pending:null;
    state.completed=Array.isArray(saved.completed)?saved.completed.filter(n=>[2,4].includes(n)):[];
    const validCards=count=>Array.isArray(saved.cards)&&saved.cards.length===count*2&&Array.from({length:count},(_,i)=>i).every(n=>saved.cards.filter(c=>c===n).length===2);
    if(validCards(6))state.cards=[...saved.cards];
    else if(validCards(3))state.cards=[...saved.cards,3,4,5,3,4,5];
    if(Array.isArray(saved.matched))state.matched=[...new Set(saved.matched.filter(n=>Number.isInteger(n)&&n>=0&&n<labels.length))];
    if(Array.isArray(saved.open))state.open=[...new Set(saved.open.filter(n=>Number.isInteger(n)&&n>=0&&n<state.cards.length&&!state.matched.includes(state.cards[n])))].slice(0,2);
    state.moves=Number.isInteger(saved.moves)?Math.max(0,saved.moves):0;
    state.caught=Number.isInteger(saved.caught)?Math.max(0,Math.min(5,saved.caught)):0;
  }
  function begin(room){
    if(![2,4].includes(room)||state.completed.includes(room))return false;
    state.pending=room;
    if(room===2){for(let i=state.cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[state.cards[i],state.cards[j]]=[state.cards[j],state.cards[i]];}}
    render();return true;
  }
  function complete(){return state.pending===2?state.matched.length===labels.length:state.caught===5;}
  function render(){
    stopBeam();
    const memory=state.pending===2,done=complete();
    document.getElementById('breakTitle').textContent=memory?'The lantern alcove':'The firefly corridor';
    document.getElementById('breakInstructions').textContent=memory?'Select two cards to turn them over. If the pictures match, they stay face up. If they do not match, choose another card to try again. Find all six pairs to light up Continue.':'Catch five fireflies. Move your mouse or finger to aim the light, then select a bug fully inside it. With a keyboard, press Tab to reach the corridor. Aim with arrows / WASD; press Enter or Space to catch. The light wanders until you aim it. If reduced motion is on, aim it yourself.';
    document.getElementById('breakStatus').textContent=done?'Break complete! Continue your rescue.':memory?`${state.matched.length} / ${labels.length} pairs found · ${state.moves} turns`:`${state.caught} / 5 fireflies caught`;
    const host=document.getElementById('breakGame');
    if(memory){
      host.innerHTML=`<div class="lantern-grid">${state.cards.map((value,i)=>{const matched=state.matched.includes(value),visible=matched||state.open.includes(i);return `<button class="lantern-card ${visible?'revealed':''}" aria-label="Lantern ${i+1}${visible?`: ${labels[value]}`:''}" aria-pressed="${visible}" ${matched?'disabled':''} onclick="Interludes.flip(${i})"><span aria-hidden="true">${visible?symbols[value]:'?'}</span><small>${matched?'Pair found':visible?labels[value]:'Turn over'}</small></button>`;}).join('')}</div>`;
    }else{
      host.innerHTML=done?'<div class="firefly-finished" aria-hidden="true">✦ ✦ ✦ ✦ ✦</div>':`<div class="firefly-field" tabindex="0" role="group" aria-label="Flashlight corridor" aria-describedby="breakInstructions beamStatus"><span id="beamStatus" class="beam-status" role="status"></span><button id="firefly" disabled aria-label="Catch firefly ${state.caught+1}" onclick="Interludes.catchOne()">✦</button></div>`;
      if(!done)mountBeam();
    }
    document.getElementById('breakContinue').disabled=!done;
    document.getElementById('breakSkip').classList.toggle('hidden',done);
  }
  function flip(i){
    if(state.pending!==2||!Number.isInteger(i)||i<0||i>=state.cards.length||state.matched.includes(state.cards[i])||state.open.includes(i))return;
    if(state.open.length===2)state.open=[];
    state.open.push(i);
    if(state.open.length===2){state.moves++;if(state.cards[state.open[0]]===state.cards[state.open[1]]){state.matched.push(state.cards[i]);state.open=[];MuseumAudio.play('success');}}
    render();save();
    const next=document.querySelectorAll('.lantern-card')[i];if(!next.disabled)next.focus({preventScroll:true});else (complete()?document.getElementById('breakContinue'):document.querySelector('.lantern-card:not(:disabled)')).focus({preventScroll:true});
  }
  const randomPoint=()=>({x:12+Math.random()*76,y:16+Math.random()*68});
  function stopBeam(){cancelAnimationFrame(frame);frame=null;lastFrame=0;}
  function updateBeam(){
    const field=document.querySelector('.firefly-field'),button=document.getElementById('firefly');
    if(!field||!button)return false;
    const {width,height}=field.getBoundingClientRect(),radius=Math.max(90,Math.min(140,Math.min(width,height)*.38));
    const visible=field.checkVisibility()&&width>0&&height>0&&Math.hypot((beam.x-bug.x)*width/100,(beam.y-bug.y)*height/100)+32<=radius;
    field.style.setProperty('--beam-x',`${beam.x}%`);field.style.setProperty('--beam-y',`${beam.y}%`);field.style.setProperty('--beam-radius',`${radius}px`);
    button.style.setProperty('--x',`${bug.x}%`);button.style.setProperty('--y',`${bug.y}%`);
    button.disabled=!visible;button.dataset.visible=String(visible);
    const status=document.getElementById('beamStatus'),message=visible?'Firefly lit — catch it!':'Search the darkness with the flashlight.';
    if(status.textContent!==message)status.textContent=message;
    return visible&&field.checkVisibility()&&!document.hidden&&!document.querySelector('dialog[open]');
  }
  function animateBeam(now){
    const field=document.querySelector('.firefly-field');
    if(state.pending!==4||!field||complete())return;
    const elapsed=lastFrame?Math.min((now-lastFrame)/1000,.05):0;lastFrame=now;
    if(!manual&&!reducedMotion.matches&&!document.hidden&&field.checkVisibility()&&!document.querySelector('dialog[open]')){
      const distance=Math.hypot(target.x-beam.x,target.y-beam.y),travel=elapsed*18;
      if(distance<=travel)target=randomPoint();
      else{beam.x+=(target.x-beam.x)*travel/distance;beam.y+=(target.y-beam.y)*travel/distance;}
    }
    updateBeam();frame=requestAnimationFrame(animateBeam);
  }
  function mountBeam(){
    const field=document.querySelector('.firefly-field');bug=randomPoint();beam={x:50,y:50};target=randomPoint();manual=false;
    const aim=event=>{
      const rect=field.getBoundingClientRect();manual=true;
      beam={x:Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100)),y:Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100))};updateBeam();
    };
    field.addEventListener('pointermove',aim);field.addEventListener('pointerdown',aim);
    field.addEventListener('pointerleave',()=>{manual=false;});
    field.addEventListener('focusin',()=>{manual=true;});
    field.addEventListener('focusout',()=>{manual=false;});
    field.addEventListener('keydown',event=>{
      if(event.altKey||event.ctrlKey||event.metaKey||event.isComposing)return;
      const directions={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]},direction=directions[event.key.length===1?event.key.toLowerCase():event.key];
      if(direction){event.preventDefault();manual=true;beam.x=Math.max(0,Math.min(100,beam.x+direction[0]*6));beam.y=Math.max(0,Math.min(100,beam.y+direction[1]*6));updateBeam();}
      if(event.target===field&&(event.key==='Enter'||event.code==='Space')){event.preventDefault();if(!event.repeat)catchOne();}
    });
    updateBeam();frame=requestAnimationFrame(animateBeam);
  }
  function catchOne(){if(state.pending!==4||complete()||!updateBeam())return;state.caught++;MuseumAudio.play('clue');render();save();document.querySelector(complete()?'#breakContinue':'.firefly-field').focus({preventScroll:true});}
  function finish(){
    if(!state.pending)return;
    stopBeam();
    state.completed.push(state.pending);state.pending=null;
    renderRoomAfterBreak();save();
  }
  function setActive(active){stopBeam();if(active&&state.pending===4&&!complete()){updateBeam();frame=requestAnimationFrame(animateBeam);}}
  return {begin,render,flip,catchOne,finish,restore,setActive,pending:()=>state.pending,reset:()=>{stopBeam();state=fresh();},snapshot:()=>structuredClone(state)};
})();
