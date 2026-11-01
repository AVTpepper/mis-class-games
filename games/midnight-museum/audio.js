/* All audio is generated locally and starts only after a student opts in. */
const MuseumAudio=(()=>{
  let context=null,musicNodes=[],musicLoop=null,nextMusicTime=0,musicStep=0,effects=false,music=false,sceneActive=false;
  // Original eight-bar A-minor Halloween waltz: music box, organ and plucked bass.
  // Six eighth notes per bar; null is a rest, not a sustained drone.
  const melody=[
    [81,84,83,81,80,81],[76,null,79,80,79,76],
    [77,81,84,83,81,77],[76,80,83,86,83,80],
    [81,84,88,86,84,83],[81,77,74,null,77,81],
    [80,83,86,84,83,80],[81,null,76,null,69,null]
  ];
  const chords=[[57,60,64],[57,60,64],[53,57,60],[52,56,59,62],[57,60,64],[50,53,57],[52,56,59,62],[57,60,64]];
  try{const saved=JSON.parse(localStorage.getItem('museum-audio')||'{}');effects=saved.effects===true;music=saved.music===true;}catch{}
  function store(){try{localStorage.setItem('museum-audio',JSON.stringify({effects,music}));}catch{}render();}
  function render(){for(const [id,on,label] of [['soundToggle',effects,'Sound'],['musicToggle',music,'Music']]){const button=document.getElementById(id);if(button){button.textContent=`${label}: ${on?'on':'off'}`;button.setAttribute('aria-pressed',String(on));}}}
  function stopMusic(){
    clearInterval(musicLoop);musicLoop=null;
    musicNodes.forEach(({oscillator,gain})=>{try{oscillator.stop();oscillator.disconnect();gain.disconnect();}catch{}});musicNodes=[];
  }
  function musicNote(midi,start,duration,type,volume){
    const oscillator=context.createOscillator(),gain=context.createGain(),voice={oscillator,gain};
    oscillator.type=type;oscillator.frequency.value=440*2**((midi-69)/12);
    gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    oscillator.connect(gain).connect(context.destination);musicNodes.push(voice);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();musicNodes=musicNodes.filter(node=>node!==voice);};
    oscillator.start(start);oscillator.stop(start+duration+.025);
  }
  function scheduleMusic(){
    if(!music||!sceneActive||document.hidden||!context)return;
    // Keep a small look-ahead for smooth audio without scheduling an uncancellable song.
    if(nextMusicTime<context.currentTime-.3)nextMusicTime=context.currentTime+.04;
    const eighth=60/108/2;
    while(nextMusicTime<context.currentTime+.25){
      const bar=Math.floor(musicStep/6)%melody.length,beat=musicStep%6,note=melody[bar][beat],chord=chords[bar];
      if(note!==null){
        musicNote(note,nextMusicTime,eighth*.85,'sine',.045);
        musicNote(note+12,nextMusicTime,eighth*.55,'sine',.009);
      }
      if(beat===0)musicNote(chord[0]-12,nextMusicTime,eighth*1.5,'triangle',.04);
      if(beat===2||beat===4)chord.forEach(pitch=>musicNote(pitch,nextMusicTime,eighth*.8,'triangle',.012));
      nextMusicTime+=eighth;musicStep=(musicStep+1)%(melody.length*6);
    }
  }
  function unlock(){
    if(!effects&&!music||document.hidden)return;
    try{
      context??=new (window.AudioContext||window.webkitAudioContext)();
      context.resume().catch(()=>{});
      if(music&&sceneActive&&musicLoop===null){
        nextMusicTime=context.currentTime+.04;musicStep=0;
        musicLoop=setInterval(scheduleMusic,80);scheduleMusic();
      }
    }catch{effects=false;music=false;stopMusic();store();}
  }
  function play(kind='clue'){
    if(!effects||!context||context.state!=='running'||document.hidden)return;
    const notes={clue:[523.25,659.25],success:[523.25,659.25,783.99],failure:[196],brass:[440,554.37],silver:[659.25,830.61]};
    (notes[kind]||notes.clue).forEach((frequency,i)=>{const oscillator=context.createOscillator(),gain=context.createGain(),start=context.currentTime+i*.13;oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.055,start+.015);gain.gain.exponentialRampToValueAtTime(.001,start+.32);oscillator.connect(gain).connect(context.destination);oscillator.start(start);oscillator.stop(start+.34);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};});
  }
  function toggle(kind){if(kind==='music'){music=!music;if(!music)stopMusic();}else effects=!effects;unlock();store();}
  document.addEventListener('pointerdown',unlock);
  document.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')unlock();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopMusic();context?.suspend().catch(()=>{});}});
  function setSceneActive(active){sceneActive=active;if(active)unlock();else stopMusic();}
  return {play,toggle,render,setSceneActive,status:()=>({effects,music,contextState:context?.state||'not-created',musicVoices:musicNodes.length})};
})();
