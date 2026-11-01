const {test,expect}=require('@playwright/test');
const {collectVisible,solveMechanism}=require('./exploration-helper');
for(const viewport of [{width:1024,height:600},{width:375,height:812}])test(`review real room states at ${viewport.width}px`,async({page})=>{
  test.setTimeout(120000);await page.setViewportSize(viewport);await page.goto('/games/midnight-museum/');
  async function inspectStage(room,name){
    await page.screenshot({path:`artifacts/review-${viewport.width}-${room+1}-${name}.png`,fullPage:true});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${room+1} ${name} horizontal overflow`).toBe(true);
    if(viewport.width===1024)expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight),`${room+1} ${name} vertical overflow`).toBe(true);
    expect(await page.locator('.room').evaluate(room=>[...room.querySelectorAll('*')].filter(e=>e.getClientRects().length&&['auto','scroll'].includes(getComputedStyle(e).overflowY)).map(e=>e.id||e.className))).toEqual([]);
    if(room===3&&name==='solved'){
      const messages=await page.locator('.mechanism-3>p[role=status]').evaluateAll(elements=>elements.map(e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};}));
      expect(messages).toHaveLength(2);
      const [a,b]=messages;
      expect(Math.min(a.right,b.right)>Math.max(a.left,b.left)&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top),'robot result overlaps completion message').toBe(false);
    }
  }
  for(let room=0;room<6;room++){
    await page.evaluate(room=>{Exploration.reset();index=room;code=rooms.slice(0,room).map(r=>r.digit);started=true;inspected=[];selected={};answers={};jars=[];activeClue=null;roomFlow={room,stage:'search',part:0};render();show('game');},room);
    await inspectStage(room,'search');await collectVisible(page);await inspectStage(room,'clues');
    await page.locator('#activityNext').click();await inspectStage(room,'mechanism');
    await solveMechanism(page);await inspectStage(room,'solved');
    if(room===3){
      await page.reload();await page.locator('#enterBtn').click();
      await expect(page.locator('.mechanism-3>p[role=status]').first()).toContainText('robot reaches the painting');
      await inspectStage(room,'solved');
    }
    await page.locator('#activityNext').click();await collectVisible(page);await inspectStage(room,'hidden');
    await page.locator('#activityNext').click();await inspectStage(room,'lock-a');
    if(room!==5){
      await expect(page.locator('.lock-question')).toHaveCount(2);
      for(const question of await page.locator('.lock-question').all())await expect(question).toBeVisible();
      if(room===2)await expect(page.locator('.lock-context')).toContainText('No recording shows anyone');
      if(room===3)await expect(page.locator('.lock-context')).toContainText('4 Improve');
    }
  }
});
