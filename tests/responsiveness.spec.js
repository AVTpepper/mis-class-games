const {test,expect}=require('@playwright/test');

const viewports=[
  {width:320,height:568,touch:true},{width:375,height:812,touch:true},
  {width:600,height:960,touch:true},{width:768,height:1024,touch:true},
  {width:820,height:1180,touch:true},{width:900,height:600,touch:true},
  {width:844,height:390,touch:true},{width:1024,height:768,touch:true},
  {width:1024,height:600,touch:false},{width:1280,height:720,touch:false},
  {width:1440,height:900,touch:false},
];

async function showStage(page,room,stage,solved){
  await page.evaluate(({room,stage,solved})=>{
    Exploration.reset();Snake.reset();
    const publicClues=[0,1,2].filter(i=>Exploration.canInspect(room,i));
    const state=Exploration.snapshot();
    if(solved||stage==='reveal'||stage==='lock'){
      state[room]={...state[room],done:true};
      if(room===0)state[0].minute=36;
      if(room===1)Object.assign(state[1],{orange:3,purple:2});
      if(room===2)state[2].sorts=['observation','assumption','observation'];
      if(room===3)Object.assign(state[3],{module:'sensor',light:'dark',failed:true,passed:true});
      if(room===4)state[4].order=[0,1,2,3,4];
      if(room===5)state[5].power=[true,true];
    }
    Exploration.restore(state);index=room;started=true;won=false;gameOver=false;lives=5;
    code=rooms.slice(0,room).map(r=>r.digit);selected={};answers={};jars=[];activeClue=null;
    inspected=stage==='search'?[]:stage==='lock'?[0,1,2]:publicClues;
    roomFlow={room,stage,part:0};setSidebarTab('info');render();show('game');
  },{room,stage,solved});
}

async function checkActivity(page,context){
  const geometry=await page.locator('.room').evaluate(room=>{
    const bounds=room.getBoundingClientRect();
    const visible=e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';
    const elements=[...room.querySelectorAll('.scene-task button,.scene-task input,.scene-task select,.mechanism-clocks svg,#challenge button,#challenge input,#challenge select,#snakeCanvas,.room>.actions>button')].filter(visible);
    const controls=elements.map(e=>{
      const rect=e.getBoundingClientRect();
      const name=e.getAttribute('aria-label')||[...(e.labels||[])].map(label=>label.textContent).join(' ')||e.textContent;
      return {tag:e.tagName,id:e.id,name:name.trim(),left:rect.left,right:rect.right,width:rect.width,height:rect.height,svg:e.tagName.toLowerCase()==='svg'};
    });
    const nested=[room,...room.querySelectorAll('*')].filter(e=>visible(e)&&['auto','scroll'].includes(getComputedStyle(e).overflowY)).map(e=>e.id||e.className);
    const clocks=[...room.querySelectorAll('.mechanism-clocks svg')].filter(visible).map(e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height,left:r.left,right:r.right};});
    return {left:bounds.left,right:bounds.right,pageOverflow:document.documentElement.scrollWidth>innerWidth,controls,nested,clocks};
  });
  expect(geometry.pageOverflow,context+' horizontal overflow').toBe(false);
  expect(geometry.nested,context+' nested activity scroller').toEqual([]);
  for(const control of geometry.controls){
    expect(control.left,context+' '+control.id+' clipped left').toBeGreaterThanOrEqual(geometry.left);
    expect(control.right,context+' '+control.id+' clipped right').toBeLessThanOrEqual(geometry.right);
    expect(control.width,context+' '+control.id+' width').toBeGreaterThan(0);
    if(!control.svg){
      expect(control.name,context+' unnamed '+control.tag).not.toBe('');
      expect(control.height,context+' '+control.name+' target height').toBeGreaterThanOrEqual(44);
    }
  }
  if(geometry.clocks.length){
    expect(geometry.clocks).toHaveLength(2);
    expect(geometry.clocks[0].height,context+' oversized clock').toBeLessThanOrEqual(168);
    expect(geometry.clocks[1].height,context+' oversized clock').toBeLessThanOrEqual(168);
    expect(Math.abs(geometry.clocks[0].top-geometry.clocks[1].top),context+' clocks should sit together').toBeLessThan(2);
    expect(geometry.clocks[0].right).toBeLessThanOrEqual(geometry.clocks[1].left);
  }
  await page.locator('.room>.actions').scrollIntoViewIfNeeded();
  await expect(page.locator('.room>.actions')).toBeInViewport();
}

for(const viewport of viewports)test.describe(`${viewport.width}x${viewport.height} ${viewport.touch?'touch':'mouse'}`,()=>{
  test.use({viewport:{width:viewport.width,height:viewport.height},hasTouch:viewport.touch});
  test('every room and challenge fits its activity panel with usable controls',async({page})=>{
    test.setTimeout(90000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto('/games/midnight-museum/');
    for(let room=0;room<6;room++)for(const [stage,solved] of [['search',false],['mechanism',false],['mechanism',true],['reveal',true],['lock',true]]){
      await showStage(page,room,stage,solved);
      const context=`${viewport.width}px, room ${room+1}, ${stage}${solved?' solved':''}`;
      await checkActivity(page,context);
      if([375,768,1024].includes(viewport.width)&&stage==='mechanism'&&!solved){
        await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
        await page.screenshot({path:`artifacts/responsive-audit/after-${viewport.width}-room-${room+1}-${stage}.png`,fullPage:true});
      }
    }
    for(const room of [2,4])for(const solved of [false,true]){
      await page.evaluate(({room,solved})=>{
        index=room;code=rooms.slice(0,room).map(r=>r.digit);renderProgress();Interludes.reset();Interludes.begin(room);
        if(solved){const state=Interludes.snapshot();if(room===2)state.matched=[0,1,2,3,4,5];else state.caught=5;Interludes.restore(state);Interludes.render();}
        show('interlude');
      },{room,solved});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`arcade ${room} overflow`).toBe(true);
      const card=await page.locator('.break-card').boundingBox();
      const controls=await page.locator('.break-card button').evaluateAll(buttons=>buttons.filter(button=>button.getClientRects().length&&getComputedStyle(button).visibility!=='hidden').map(button=>{const r=button.getBoundingClientRect();return {name:button.getAttribute('aria-label')||button.textContent,left:r.left,right:r.right,height:r.height};}));
      for(const control of controls){expect(control.left,control.name).toBeGreaterThanOrEqual(card.x-1);expect(control.right,control.name).toBeLessThanOrEqual(card.x+card.width+1);expect(control.height,control.name).toBeGreaterThanOrEqual(44);}
      const next=page.locator(solved?'#breakContinue':'#breakSkip');await next.scrollIntoViewIfNeeded();await expect(next).toBeInViewport();
    }
    expect(errors).toEqual([]);
  });
});

test('poem reordering keeps keyboard focus on the same strip at either end',async({page})=>{
  await page.setViewportSize({width:375,height:812});await page.goto('/games/midnight-museum/');
  await showStage(page,4,'mechanism',false);
  const up=page.getByRole('button',{name:'Move strip I up',exact:true});
  await up.focus();await up.press('Space');await up.press('Space');
  await expect(up).toBeDisabled();
  const down=page.getByRole('button',{name:'Move strip I down',exact:true});
  await expect(down).toBeFocused();
  for(let step=0;step<4;step++)await down.press('Space');
  await expect(down).toBeDisabled();await expect(up).toBeFocused();
});
