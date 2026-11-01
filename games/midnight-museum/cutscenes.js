const Cutscene=(()=>{
  let returnFocus=null;
  const stories=[
    ['The doors are closing…','Pip calls from inside a painting. Follow the chimes into the Clockmaker’s room before the museum seals itself.','🕰️'],
    ['The clocks fall silent','A hidden doorway slides open. Beyond it, orange and purple potions bubble beneath a cloud of pumpkin fog.','⚗️'],
    ['The potion lights the way','The mixture glows and reveals a gallery of suspicious headlines. Pip’s story may not be what it seems.','🖼️'],
    ['The evidence changes everything','A mechanical clatter echoes down the corridor. The rescue robot is waiting in the dark, unable to find its way.','🤖'],
    ['The workshop wakes up','A beam of light reaches a forgotten portrait. Behind its frame, Pip has left a poem with one last message.','🎭'],
    ['The arcade comes alive','The portrait swings aside to reveal two sleeping security serpents. Two teammates must wake the cabinet and clear ten levels each.','🐍'],
    ['The final painting awaits','Six recovered digits shimmer on the frame. Assemble the rescue code and bring Pip home.','🖼️'],
    ['Pip is free!','The frame breaks its spell. Pip floats into the moonlight, the museum doors swing open, and your team’s rescue is complete.','👻']
  ];
  function finish(){
    const dialog=document.getElementById('cutscene');
    if(!dialog.open)return;
    dialog.close();
    if(returnFocus?.isConnected&&!returnFocus.closest('.hidden'))returnFocus.focus({preventScroll:true});
    else document.getElementById('main').focus({preventScroll:true});
  }
  function play(stage){
    finish();
    document.querySelector('.museum-portal').classList.remove('hidden');
    const dialog=document.getElementById('cutscene');
    const story=stories[stage];
    returnFocus=document.activeElement;
    document.getElementById('cutsceneTitle').textContent=story[0];
    document.getElementById('cutsceneStory').textContent=story[1];
    document.getElementById('cutsceneSymbol').textContent=story[2];
    document.getElementById('cutsceneChapter').textContent=stage===0?'Your rescue begins':stage===7?'Mission complete':`Room ${stage} cleared · digit ${rooms[stage-1].digit} recovered`;
    dialog.dataset.stage=String(stage);
    dialog.showModal();
  }
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('cutscene').addEventListener('cancel',e=>{e.preventDefault();});
  });
  return {play,finish};
})();
