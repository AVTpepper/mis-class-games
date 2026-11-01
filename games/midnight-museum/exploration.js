/* Scene props and experiments use ordinary buttons/inputs for keyboard and touch. */
const Exploration=(()=>{
  const initial=()=>[
    {minute:0,done:false},
    {orange:0,purple:0,done:false},
    {sorts:['','',''],done:false},
    {module:'camera',light:'day',failed:false,passed:false,done:false},
    {order:[2,4,0,3,1],done:false},
    {power:[false,false],done:false}
  ];
  let states=initial();
  const robotResults={pass:'Test: the robot reaches the painting. Record the evidence.',fail:'Test: the robot cannot find its way in the dark. Choose a part that helps it see in low light, then test again.'};
  const names=['Clockmaker’s workshop','The potion laboratory','The evidence gallery','The inventor’s workshop','The poet’s study','The serpent arcade'];
  const places=[[[21,40],[79,40],[50,60]],[[50,60],[80,40],[20,40]],[[21,40],[79,40],[50,60]],[[50,38],[20,60],[80,60]],[[21,40],[79,40],[50,60]],[[21,40],[79,40],[50,60]]];
  const guides=[
    'Inspect both clocks, then move the time slider until the chimes coincide. The desk drawer opens to reveal the notebook.',
    'Inspect the cupboard, then mix three orange drops with two purple drops to match the etched recipe. A hidden recipe scroll rises from the bench.',
    'Inspect the camera and newspaper. Sort all three evidence cards into observation or assumption to discover a note behind the frame.',
    'Inspect the toolkit, test the original camera in darkness, then fit and test the low-light sensor in darkness. The test log and maintenance note become available.',
    'Inspect the letter and portrait. Reorder the five torn poem strips by their Roman numeral stamps I–V to reveal the note behind the portrait.',
    'Read the safety plaque and activate both player power switches. The cabinet and service card are revealed, then both players complete 10 Snake levels.'
  ];
  function restore(saved){
    states=initial();if(!Array.isArray(saved))return;
    saved.slice(0,6).forEach((s,i)=>{
      if(!s||typeof s!=='object')return;
      const target=states[i];target.done=s.done===true;
      for(const key of ['minute','orange','purple'])if(key in target&&Number.isInteger(s[key])&&s[key]>=0&&s[key]<=(key==='minute'?48:12))target[key]=s[key];
      if(i===2&&Array.isArray(s.sorts)&&s.sorts.length===3&&s.sorts.every(x=>['','observation','assumption'].includes(x)))target.sorts=[...s.sorts];
      if(i===3){if(['camera','logo','sensor'].includes(s.module))target.module=s.module;if(['day','dark'].includes(s.light))target.light=s.light;target.failed=s.failed===true;target.passed=s.passed===true;if(Object.values(robotResults).includes(s.result))target.result=s.result;}
      if(i===4&&Array.isArray(s.order)&&s.order.length===5&&new Set(s.order).size===5&&s.order.every(n=>Number.isInteger(n)&&n>=0&&n<5))target.order=[...s.order];
      if(i===5&&Array.isArray(s.power)&&s.power.length===2&&s.power.every(x=>typeof x==='boolean'))target.power=[...s.power];
    });
  }
  function canInspect(room,i){
    const s=states[room];
    if(room===0&&i===2||room===1&&i===0||[2,4].includes(room)&&i===2||room===5&&[0,2].includes(i))return s.done;
    if(room===3&&i===0)return s.failed;
    if(room===3&&i===2)return s.done;
    return true;
  }
  function icon(room,i){
    const clock=(color,interval)=>`<circle cx="60" cy="57" r="43" fill="#20172e" stroke="${color}" stroke-width="8"/><circle cx="60" cy="57" r="33" fill="#f4e6cc"/><path class="hour-hand" d="M60 57V40" fill="none" stroke="#352640" stroke-width="6" stroke-linecap="round"/><path class="minute-hand" d="M60 57V29" fill="none" stroke="#352640" stroke-width="3" stroke-linecap="round" transform="rotate(${Math.floor(states[0].minute/interval)*interval*6} 60 57)"/><circle cx="60" cy="57" r="3" fill="${color}"/><text x="60" y="118" text-anchor="middle" fill="${color}" font-size="18">${interval} min</text>`;
    const book='<path d="M15 25Q35 12 60 25Q85 12 105 25V101Q85 89 60 102Q35 89 15 101Z" fill="#d9b777" stroke="#f8deb0" stroke-width="3"/><path d="M60 25V101M25 40H49M25 52H49M72 40H96M72 52H96" stroke="#755134" stroke-width="3"/>';
    const frame='<rect x="15" y="9" width="90" height="108" rx="6" fill="#ac794a" stroke="#f7c57a" stroke-width="4"/><rect x="26" y="20" width="68" height="86" fill="#3d2b58"/><circle cx="60" cy="49" r="18" fill="#d3c5e5"/><path d="M32 100Q38 64 60 66Q84 65 88 100" fill="#77678e"/>';
    const robot='<rect x="25" y="23" width="70" height="60" rx="13" fill="#859bab" stroke="#d0f5ec" stroke-width="3"/><circle cx="45" cy="49" r="9" fill="#90e5c4"/><circle cx="76" cy="49" r="9" fill="#90e5c4"/><path d="M44 69H76M60 23V10M30 84L17 109M90 84L103 109" stroke="#c7d8e3" stroke-width="7"/><circle cx="60" cy="10" r="5" fill="#ffbb6d"/>';
    const cabinet='<path d="M27 8H97L104 27V114H14V47L27 38Z" fill="#533a6c" stroke="#c7a1f2" stroke-width="3"/><rect x="31" y="27" width="57" height="43" rx="4" fill="#130e23"/><path d="M42 54H54V39H72V49H79" fill="none" stroke="#90e5c4" stroke-width="6"/><path d="M24 82H94" stroke="#d5b7ed" stroke-width="3"/><circle cx="72" cy="93" r="5" fill="#ffbb6d"/>';
    const flask='<path d="M43 10H77V22H70V44L103 102Q107 115 93 115H27Q13 115 18 102L50 44V22H43Z" fill="#a78dcb44" stroke="#eadbff" stroke-width="4"/><path d="M32 83H88L103 107Q103 112 93 112H27Q17 112 20 107Z" fill="#bd79da"/><circle cx="55" cy="87" r="6" fill="#ecd0ff"/><circle cx="73" cy="98" r="4" fill="#ecd0ff"/>';
    const drawer='<rect x="12" y="44" width="96" height="65" rx="5" fill="#704b3d" stroke="#d49e65" stroke-width="4"/><rect x="23" y="56" width="74" height="39" rx="3" fill="#44303a" stroke="#ba8f65" stroke-width="2"/><path d="M47 74H73" stroke="#ffd193" stroke-width="6" stroke-linecap="round"/>';
    const letter='<path d="M20 10H93L103 21V112H20Z" fill="#f3dfb6" stroke="#ceaa73" stroke-width="3"/><path d="M35 34H86M35 48H86M35 62H74M35 76H82" stroke="#83634d" stroke-width="4"/><circle cx="83" cy="94" r="11" fill="#b76a78"/>';
    const camera='<rect x="13" y="35" width="94" height="67" rx="10" fill="#526473" stroke="#b5d6d8" stroke-width="4"/><path d="M27 35V23H50V35" fill="#526473" stroke="#b5d6d8" stroke-width="4"/><circle cx="67" cy="68" r="24" fill="#17192e" stroke="#90e5c4" stroke-width="4"/><circle cx="67" cy="68" r="12" fill="#607d96"/><circle cx="30" cy="49" r="5" fill="#ffbb6d"/>';
    const art=room===0?(i<2?clock(i?'#c5b6de':'#dba469',i?12:9):book):room===1?(i===0?letter:i===1?drawer:flask):room===2?(i===0?camera:i===1?book:letter):room===3?(i===0?robot:i===1?drawer:letter):room===4?(i===0?letter:i===1?frame:book):(i===0?cabinet:i===1?frame:letter);
    return `<svg viewBox="0 0 120 125" aria-hidden="true" focusable="false">${art}</svg>`;
  }
  function background(room){return `<svg class="scene-backdrop" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="M0 0H1000V370H0Z" fill="${['#2d233d','#26303b','#33243d','#25313c','#34273e','#25283e'][room]}"/><path d="M0 370H1000V500H0Z" fill="#1a1425"/><path d="M0 370H1000M0 500L420 370M1000 500L580 370M500 370V500M0 430H1000" stroke="#6e546c" stroke-width="2"/><path d="M440 199V90A80 80 0 0 1 600 90V199Z" fill="#120e22" stroke="#85708f" stroke-width="9"/><circle cx="552" cy="75" r="25" fill="#e7d6a2"/><path d="M520 15V199M440 110H600" stroke="#85708f" stroke-width="6"/><rect x="80" y="340" width="840" height="22" rx="7" fill="#8f6049"/><path d="M112 362V450M885 362V450" stroke="#6c493d" stroke-width="24"/><path d="M0 260H1000" stroke="#695067" stroke-width="6"/></svg>`;}
  function task(room){
    const s=states[room],done=s.done?'<p class="scene-discovery" role="status">✓ Task complete! Select Continue to find and read the hidden clues.</p>':'';
    if(room===0)return `<h3>Wind the museum clocks</h3><p class="clock-explainer">The long hands show each clock’s last chime: brass jumps every 9 minutes, silver every 12.</p><p>Move the slider to count minutes after midnight. Find the first time both chime lights turn on together. This opens the desk drawer.</p><label for="sceneMinute">Minutes after midnight: <strong>${s.minute}</strong></label><input id="sceneMinute" type="range" min="0" max="48" value="${s.minute}" oninput="Exploration.change('minute',Number(this.value),'sceneMinute')"><div class="chime-lights"><span class="${s.minute>0&&s.minute%9===0?'lit':''}">Brass clock · 9 min</span><span class="${s.minute>0&&s.minute%12===0?'lit':''}">Silver clock · 12 min</span></div>${done}`;
    if(room===1)return `<h3>The etched mixing bench</h3><p>Use the buttons to add 3 orange drops and 2 purple drops. This matches the marks on the glass and reveals a hidden recipe. Use Empty the beaker if you want to try again.</p><div class="mixing-bench"><button class="drop-orange" onclick="Exploration.drop('orange')">Add orange drop <strong>${s.orange}</strong></button><div class="mix-glass" style="--fill:${Math.min(90,(s.orange+s.purple)*9)}%;--orange-fill:${s.orange+s.purple?Math.min(90,(s.orange+s.purple)*9)*s.orange/(s.orange+s.purple):0}%" aria-label="${s.orange} orange and ${s.purple} purple drops"></div><button class="drop-purple" onclick="Exploration.drop('purple')">Add purple drop <strong>${s.purple}</strong></button></div><button class="mini" onclick="Exploration.empty()">Empty the beaker</button>${done}`;
    if(room===2){const cards=['The painting was on the floor at 21:06.','Pip deliberately pushed the painting.','No recording shows anyone touching the painting.'];return `<h3>The evidence sorting table</h3><p>Read each card. Choose Observation for a fact the camera shows. Choose Assumption for a guess about what happened. Sort all three to find a hidden note.</p>${cards.map((text,i)=>`<fieldset class="evidence-sort"><legend>${text}</legend>${['observation','assumption'].map(type=>`<button class="${s.sorts[i]===type?'selected':''}" aria-pressed="${s.sorts[i]===type}" onclick="Exploration.sort(${i},'${type}')">${type==='observation'?'Observation':'Assumption'}</button>`).join('')}</fieldset>`).join('')}${done}`;}
    if(room===3)return `<h3>The robot testing bench</h3><p>Choose Original camera and Darkness, then select Run robot test. Read the result. Choose a part that could help the robot see in the dark, then test it in Darkness too.</p><label for="robotModule">Choose a robot part</label><select id="robotModule" onchange="Exploration.change('module',this.value,'robotModule')"><option value="camera" ${s.module==='camera'?'selected':''}>Original camera</option><option value="logo" ${s.module==='logo'?'selected':''}>Shiny logo</option><option value="sensor" ${s.module==='sensor'?'selected':''}>Low-light sensor</option></select><label for="robotLight">Choose the light</label><select id="robotLight" onchange="Exploration.change('light',this.value,'robotLight')"><option value="day" ${s.light==='day'?'selected':''}>Daylight</option><option value="dark" ${s.light==='dark'?'selected':''}>Darkness</option></select><button onclick="Exploration.testRobot()">Run robot test</button><p role="status">${s.result||'Choose a robot part and a light setting. Then select Run robot test.'}</p><p class="note">Original camera tested in darkness: ${s.failed?'✓':'not yet'} · improved sensor tested in darkness: ${s.passed?'✓':'not yet'}</p>${done}`;
    if(room===4){const lines=['Careful eyes can change the tale.','Headlines shout, but facts prevail.','Evidence helps us understand.','Check the truth before you stand.','Keep your judgement close at hand.'];return `<h3>The torn poem</h3><p>Use the up and down arrows to put the poem strips in order: I, II, III, IV, V (1 to 5). This reveals a hidden page.</p><ol class="poem-strips">${s.order.map((n,i)=>`<li><span><b>${['I','II','III','IV','V'][n]}</b> ${lines[n]}</span><button class="mini" aria-label="Move strip ${['I','II','III','IV','V'][n]} up" ${i===0?'disabled':''} onclick="Exploration.move(${i},-1)">↑</button><button class="mini" aria-label="Move strip ${['I','II','III','IV','V'][n]} down" ${i===4?'disabled':''} onclick="Exploration.move(${i},1)">↓</button></li>`).join('')}</ol>${done}`;}
    return `<h3>Restore the arcade power</h3><p>Turn on both Player power buttons. When both glow green, select Continue. Then search the arcade cabinet and service-card slot for clues.</p><div class="power-switches">${s.power.map((on,i)=>`<button aria-pressed="${on}" class="${on?'powered':''}" onclick="Exploration.power(${i})">Player ${i+1} power · ${on?'ON':'OFF'}</button>`).join('')}</div>${done}`;
  }
  function render(room){
    const count=objects[room].filter((_,i)=>inspected.includes(i)).length;
    const secret=room===1?0:2,position=places[room][secret];
    const sealed=canInspect(room,secret)?'':`<div class="sealed-prop" data-slot="${position[0]===50?'center':position[0]<50?'left':'right'}" style="--left:${position[0]}%;--top:${position[1]}%" aria-hidden="true">${[2,4].includes(room)?icon(4,1):icon(1,1)}<small>Sealed compartment</small></div>`;
    return `<p class="search-instruction"><strong>Click or tap each glowing object to find a clue.</strong><span>Read each clue in the Clues tab. Once you have found all the clues you can see, select Continue.</span></p><div class="room-scene scene-${room}" role="group" aria-label="${names[room]}">${background(room)}<div class="scene-dust" aria-hidden="true"></div>${sealed}${objects[room].map((o,i)=>{const p=places[room][i],visible=canInspect(room,i);return `<button class="object scene-object ${inspected.includes(i)?'found':''} ${visible?'':'hidden'}" data-slot="${p[0]===50?'center':p[0]<50?'left':'right'}" style="--left:${p?.[0]||50}%;--top:${p?.[1]||50}%" aria-controls="objectClue" aria-expanded="${activeClue===i}" onclick="inspectObject(${i})">${icon(room,i)}<span>${o[1]}</span><small>${inspected.includes(i)?'Clue collected · read again':'Click / tap to uncover'}</small></button>`;}).join('')}<div class="scene-caption">${count} / ${objects[room].length} clues · ${states[room].done?'Hidden compartment open':'A hidden compartment is still sealed'}</div></div><div class="scene-task mechanism-${room}">${room===0?`<div class="mechanism-clocks">${icon(0,0)}${icon(0,1)}</div>`:""}${task(room)}</div>`;
  }
  function update(focusId){
    const active=document.activeElement,action=active?.getAttribute('onclick'),label=active?.getAttribute('aria-label');
    Snake.pause();renderObjects();save();
    const focus=focusId?document.getElementById(focusId):Array.from(document.querySelectorAll('.scene-task button')).find(b=>label?b.getAttribute('aria-label')===label:action&&b.getAttribute('onclick')===action);
    if(focus&&!focus.disabled)focus.focus({preventScroll:true});
  }
  function change(key,value,focusId){
    const s=states[index];
    if(index===0&&key==='minute'){if(value!==s.minute&&value>0){if(value%9===0)MuseumAudio.play('brass');if(value%12===0)MuseumAudio.play('silver');}s.minute=value;if(value>0&&value%9===0&&value%12===0)s.done=true;}
    if(index===3&&['module','light'].includes(key))s[key]=value;
    update(focusId);
  }
  function drop(color){const s=states[1];if(s[color]<12)s[color]++;if(s.orange===3&&s.purple===2)s.done=true;update();}
  function empty(){states[1].orange=0;states[1].purple=0;update();}
  function sort(i,type){const s=states[2];s.sorts[i]=type;if(s.sorts.join(',')==='observation,assumption,observation')s.done=true;update();}
  function testRobot(){const s=states[3],works=s.light==='day'||s.module==='sensor';if(s.light==='dark'&&s.module==='camera')s.failed=true;if(s.light==='dark'&&s.module==='sensor')s.passed=true;s.done=s.done||s.failed&&s.passed;s.result=works?robotResults.pass:robotResults.fail;update();}
  function move(i,delta){const s=states[4],j=i+delta;if(j<0||j>4)return;[s.order[i],s.order[j]]=[s.order[j],s.order[i]];if(s.order.every((n,p)=>n===p))s.done=true;update();}
  function power(i){const s=states[5];s.power[i]=!s.power[i];if(s.power.every(Boolean))s.done=true;update();}
  return {render,restore,reset:()=>{states=initial();},snapshot:()=>structuredClone(states),complete:room=>states[room].done,canInspect,change,drop,empty,sort,testRobot,move,power,guide:room=>guides[room]};
})();
