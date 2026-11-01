/* Two turns on one device. Every spark clears one level. */
const Snake = (() => {
  const SIZE=10, TARGET=10;
  let state, loop=null, directionQueued=false, frame=null, previousBody=[], movedAt=0;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  function freshBoard() {
    state.body=[{x:3,y:5},{x:2,y:5},{x:1,y:5}];
    state.direction={x:1,y:0}; state.next={x:1,y:0};
    placeFood(); directionQueued=false;previousBody=[];
  }
  function reset() {pause();state={cleared:[0,0],player:0,body:[],direction:{x:1,y:0},next:{x:1,y:0},food:{x:7,y:5}};freshBoard();}
  function placeFood() {
    const free=[];
    for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++)if(!state.body.some(p=>p.x===x&&p.y===y))free.push({x,y});
    state.food=free[Math.floor(Math.random()*free.length)];
  }
  function complete() {return state.cleared.every(n=>n===TARGET);}
  function pause() {if(loop)message('Turn paused. Your snake is safe until you resume.');clearTimeout(loop);loop=null;cancelAnimationFrame(frame);frame=null;previousBody=[];if(document.getElementById('snakeToggle')){document.getElementById('snakeToggle').textContent='Start / resume turn';draw();}}
  function restore(s) {
    reset();
    const point=p=>p&&Number.isInteger(p.x)&&Number.isInteger(p.y)&&p.x>=0&&p.y>=0&&p.x<SIZE&&p.y<SIZE;
    const dir=p=>p&&Number.isInteger(p.x)&&Number.isInteger(p.y)&&Math.abs(p.x)+Math.abs(p.y)===1;
    if(!s||!Array.isArray(s.cleared)||s.cleared.length!==2||!s.cleared.every(n=>Number.isInteger(n)&&n>=0&&n<=TARGET)||![0,1].includes(s.player)||!Array.isArray(s.body)||s.body.length<3||s.body.length>13||!s.body.every(point)||!point(s.food)||!dir(s.direction)||!dir(s.next))return;
    state=structuredClone(s);
    if(state.player===1&&state.cleared[0]!==TARGET)reset();
  }
  function mount() {
    pause();
    const host=document.getElementById('snakeGame');if(!host)return;
    host.innerHTML=`<div class="snake-scores"><p id="playerOne"></p><p id="playerTwo"></p></div>
      <p id="snakeMessage" role="status"></p>
      <canvas id="snakeCanvas" width="400" height="400" tabindex="0" aria-label="Snake board. Use arrow keys or WASD to steer. Collect gold sparks and avoid walls and your tail."></canvas>
      <div class="actions"><button id="snakeToggle" onclick="Snake.toggle()">Start / resume turn</button></div>
      <div class="snake-controls" aria-label="Snake direction controls"><button aria-label="Steer up" onclick="Snake.turn(0,-1)">↑</button><button aria-label="Steer left" onclick="Snake.turn(-1,0)">←</button><button aria-label="Steer down" onclick="Snake.turn(0,1)">↓</button><button aria-label="Steer right" onclick="Snake.turn(1,0)">→</button></div>`;
    draw();updateControls();message(complete()?'Both players cleared all 10 levels! Check the lock to collect your digit.':`Player ${state.player+1}: collect one gold spark per level. Clear 10 levels without crashing. Start when ready.`);
  }
  function message(text) {const e=document.getElementById('snakeMessage');if(e)e.textContent=text;}
  function draw(progress=1) {
    const canvas=document.getElementById('snakeCanvas');if(!canvas)return;
    const ctx=canvas.getContext('2d'),cell=canvas.width/SIZE;
    ctx.fillStyle='#120e22';ctx.fillRect(0,0,400,400);
    ctx.strokeStyle='#322641';
    for(let i=0;i<=SIZE;i++){ctx.beginPath();ctx.moveTo(i*cell,0);ctx.lineTo(i*cell,400);ctx.moveTo(0,i*cell);ctx.lineTo(400,i*cell);ctx.stroke();}
    ctx.fillStyle='#ffbb6d';ctx.beginPath();ctx.arc((state.food.x+.5)*cell,(state.food.y+.5)*cell,cell*.27,0,Math.PI*2);ctx.fill();
    state.body.forEach((p,i)=>{const from=previousBody[i]||p;ctx.fillStyle=i===0?'#ffffff':'#90e5c4';ctx.fillRect((from.x+(p.x-from.x)*progress)*cell+3,(from.y+(p.y-from.y)*progress)*cell+3,cell-6,cell-6);});
  }
  function updateControls() {
    document.getElementById('playerOne').textContent=`Player 1 · ${state.cleared[0]} / 10 levels`;
    document.getElementById('playerTwo').textContent=`Player 2 · ${state.cleared[1]} / 10 levels`;
    document.getElementById('snakeToggle').disabled=complete();
    document.getElementById('checkBtn').disabled=!complete();
  }
  function interval() {return Math.max(180,320-state.cleared[state.player]*14);}
  function animate(now) {
    if(!loop)return;
    draw(reducedMotion.matches?1:Math.min(1,(now-movedAt)/interval()));
    frame=requestAnimationFrame(animate);
  }
  function schedule() {loop=setTimeout(step,interval());}
  function toggle() {
    if(loop){pause();message('Turn paused. Your snake is safe until you resume.');return;}
    if(complete())return;
    document.getElementById('snakeCanvas').focus();
    document.getElementById('snakeToggle').textContent='Pause turn';
    message(`Player ${state.player+1} is playing. Arrows / WASD to steer; Space pauses.`);schedule();frame=requestAnimationFrame(animate);
  }
  function turn(x,y) {
    if(!loop||directionQueued||x===-state.direction.x&&y===-state.direction.y)return;
    state.next={x,y};directionQueued=true;
  }
  function step() {
    loop=null; state.direction={...state.next};directionQueued=false;
    const head={x:state.body[0].x+state.direction.x,y:state.body[0].y+state.direction.y};
    const eats=head.x===state.food.x&&head.y===state.food.y;
    const body=eats?state.body:state.body.slice(0,-1);
    if(head.x<0||head.y<0||head.x>=SIZE||head.y>=SIZE||body.some(p=>p.x===head.x&&p.y===head.y)) {
      pause();state.cleared[state.player]=0;freshBoard();
      if(loseLife(`Player ${state.player+1} crashed. This player’s 10-level run starts again.`)) {draw();updateControls();message(`Player ${state.player+1} crashed — one team life lost. Press Start to retry from level 1.`);}
      return;
    }
    previousBody=state.body.map(p=>({...p}));movedAt=performance.now();state.body.unshift(head);
    if(eats) {
      state.cleared[state.player]++;
      if(state.cleared[state.player]===TARGET) {
        pause();
        if(state.player===0){state.player=1;freshBoard();message('Player 1 cleared 10 levels! Pass the keyboard to Player 2, then press Start.');}
        else message('Both players cleared 10 levels! Check the lock to claim your digit.');
        draw();updateControls();save();return;
      }
      placeFood();message(`Player ${state.player+1}: level ${state.cleared[state.player]} cleared! Collect the next spark.`);
    } else state.body.pop();
    draw(reducedMotion.matches?1:0);updateControls();save();schedule();
  }
  document.addEventListener('keydown',e=>{
    if(!document.getElementById('snakeCanvas')?.checkVisibility()||document.querySelector('dialog[open]')||e.target.closest('input,textarea,select,[contenteditable="true"]')||e.isComposing||e.altKey||e.ctrlKey||e.metaKey)return;
    const keys={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]};
    const key=e.key.length===1?e.key.toLowerCase():e.key;
    if(keys[key]){e.preventDefault();turn(...keys[key]);}
    if(e.code==='Space'&&e.target.id==='snakeCanvas'){e.preventDefault();if(!e.repeat)toggle();}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  reset();
  return {reset,restore,mount,pause,toggle,turn,complete,snapshot:()=>structuredClone(state)};
})();
