const {test,expect}=require('@playwright/test');
const {skipCutscene}=require('./cutscene-helper');
const {collectVisible,solveMechanism}=require('./exploration-helper');

test('one full activity fits desktop viewports without nested scrolling in every room',async({page})=>{
  test.setTimeout(90000);
  await page.goto('/games/midnight-museum/');
  for(const viewport of [{width:1366,height:768},{width:1280,height:720},{width:1024,height:600}]){
    await page.setViewportSize(viewport);
    for(let room=0;room<6;room++){
      for(const stage of ['search','mechanism','reveal','lock']){
        for(let part=0;part<1;part++){
          await page.evaluate(({room,stage,part})=>{
            Exploration.restore(Exploration.snapshot().map(s=>({...s,done:true,failed:true,passed:true})));
            index=room;started=true;inspected=[0,1,2];activeClue=2;roomFlow={room,stage,part};render();show('game');
          },{room,stage,part});
          const context=`${viewport.width}x${viewport.height}, room ${room+1}, ${stage} ${part}`;
          for(const selector of ['.top','#teamStatus','.status','#title','#activityTitle','.room>.actions','#sidebarInfo>.row','.footer',stage==='lock'?'#challenge':'#exploration']){
            const box=await page.locator(selector).boundingBox();
            expect(box.y,context+' '+selector).toBeGreaterThanOrEqual(0);
            expect(box.y+box.height,context+' '+selector).toBeLessThanOrEqual(viewport.height);
          }
          expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight),context).toBe(true);
          const activity=await page.locator('.room').boundingBox();
          expect(activity.width,context+' activity width').toBeGreaterThan(viewport.width*.7);
          expect(activity.height,context+' activity height').toBeGreaterThan(viewport.height*.9);
          expect(await page.locator('.room').evaluate(room=>[room,...room.querySelectorAll('*')].filter(e=>e.getClientRects().length&&['auto','scroll'].includes(getComputedStyle(e).overflowY)).map(e=>e.id||e.className)),context).toEqual([]);
          if(stage==='mechanism'){
            await expect(page.locator('.room-scene')).not.toBeVisible();
            await expect(page.locator('.scene-task')).toBeVisible();
          }
          if(stage==='lock')await expect(page.locator('#exploration')).not.toBeVisible();
          if(viewport.width===1366&&room===0)await page.screenshot({path:`artifacts/activity-${stage}-${part}.png`});
        }
      }
    }
  }
});

for(const width of [1280,375])test(`activities require completion and resume after refresh (${width}px)`,async({page})=>{
  await page.setViewportSize({width,height:812});
  await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);
  await expect(page.locator('#activityNext')).toBeDisabled();
  await expect(page.locator('.scene-task')).not.toBeVisible();
  await collectVisible(page);
  await expect(page.locator('#objectClue')).toContainText('every 12 minutes');
  await page.locator('#activityNext').click();
  await expect(page.locator('.room-scene')).not.toBeVisible();
  await expect(page.locator('#activityNext')).toBeDisabled();
  await solveMechanism(page);
  await expect(page.locator('.scene-task')).toBeVisible();
  await page.locator('#activityNext').click();
  await expect(page.locator('#activityNext')).toBeDisabled();
  await collectVisible(page);await page.locator('#activityNext').click();
  await page.locator('#clockMultiplesA').fill('9,18,27,36');
  await page.locator('#value1').fill('36');
  await page.reload();await page.locator('#enterBtn').click();
  await expect(page.locator('#activityTitle')).toContainText('Solve the lock');
  await expect(page.locator('#value1')).toHaveValue('36');
  await page.locator('#activityBack').click();await expect(page.locator('.room-scene')).toBeVisible();await page.locator('#activityNext').click();
  await expect(page.locator('#clockMultiplesA')).toHaveValue('9,18,27,36');
  await page.locator('#checkBtn').click();await skipCutscene(page);
  await expect(page.locator('#title')).toContainText('Potion');
  await expect(page.locator('#activityTitle')).toContainText('1 / 4');
});
