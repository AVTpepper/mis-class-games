const {test,expect}=require('@playwright/test');
const {skipCutscene}=require('./cutscene-helper');
const {collectVisible,solveMechanism,investigateRoom}=require('./exploration-helper');
test('all scene objects and labels stay separate at desktop tablet and phone widths',async({page})=>{
  await page.goto('/games/midnight-museum/');
  for(const width of [320,375,768,1280]){
    await page.setViewportSize({width,height:900});
    for(let room=0;room<6;room++){
      await page.evaluate(room=>{Exploration.restore(Exploration.snapshot().map(s=>({...s,done:true,failed:true,passed:true})));index=room;roomFlow={room,stage:'reveal',part:0};started=true;inspected=[0,1,2];render();show('game');},room);
      const geometry=await page.locator('.room-scene').evaluate(scene=>({
        captionTop:scene.querySelector('.scene-caption').getBoundingClientRect().top,
        objects:Array.from(scene.querySelectorAll('.scene-object')).filter(e=>!e.classList.contains('hidden')).map(e=>{const r=e.getBoundingClientRect();return {label:e.textContent,left:r.left,top:r.top,right:r.right,bottom:r.bottom};})
      }));
      expect(geometry.objects).toHaveLength(3);
      for(let i=0;i<geometry.objects.length;i++){
        const a=geometry.objects[i];expect(a.bottom,`Room ${room+1}, ${width}px: caption must not cover ${a.label}`).toBeLessThanOrEqual(geometry.captionTop);
        for(let j=i+1;j<geometry.objects.length;j++){const b=geometry.objects[j],overlaps=Math.min(a.right,b.right)>Math.max(a.left,b.left)&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top);expect(overlaps,`Room ${room+1}, ${width}px: ${a.label} overlaps ${b.label}`).toBe(false);}
      }
      if(room===1&&(width===375||width===1280))await page.locator('.room-scene').screenshot({path:`artifacts/potion-spaced-${width}.png`});
    }
  }
});
test('hidden compartments require experimentation and collected clues survive refresh',async({page})=>{
  await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);
  await expect(page.locator('.object').nth(2)).not.toBeVisible();
  await collectVisible(page);
  await expect(page.locator('#challenge')).not.toBeVisible();
  await expect(page.locator('#checkBtn')).toBeDisabled();
  await solveMechanism(page);
  await expect(page.locator('#sceneMinute')).toBeFocused();await page.locator('#activityNext').click();
  await expect(page.locator('.object').nth(2)).toBeVisible();
  await expect(page.locator('#checkBtn')).toBeDisabled();
  await page.reload();await page.locator('#enterBtn').click();
  expect(await page.evaluate(()=>Exploration.snapshot()[0].minute)).toBe(36);
  await expect(page.locator('.object').nth(2)).toBeVisible();
  await expect(page.locator('.object.found')).toHaveCount(2);
  await page.locator('.room-scene').screenshot({path:'artifacts/exploration-clock-desktop.png'});
  await page.setViewportSize({width:375,height:812});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('.room-scene').screenshot({path:'artifacts/exploration-clock-mobile.png'});
  await collectVisible(page);await page.locator('#activityNext').click();await expect(page.locator('#checkBtn')).toBeEnabled();
  await expect(page.locator('#lives')).toHaveText('5 / 5 lives');
});
test('mixing experiments are free and persist without revealing the lock early',async({page})=>{
  await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);
  await investigateRoom(page);await page.locator('#value1').fill('36');await page.locator('#checkBtn').click();await skipCutscene(page);
  await expect(page.locator('.object').first()).not.toBeVisible();
  await collectVisible(page);await page.locator('#activityNext').click();
  await page.getByRole('button',{name:/^Add orange drop/}).click();
  for(let i=0;i<4;i++)await page.getByRole('button',{name:/^Add purple drop/}).click();
  await expect(page.locator('#lives')).toHaveText('5 / 5 lives');
  await expect(page.locator('#challenge')).not.toBeVisible();
  await page.reload();await page.locator('#enterBtn').click();
  await expect(page.getByRole('button',{name:/^Add orange drop/})).toContainText('1');
  await expect(page.getByRole('button',{name:/^Add purple drop/})).toContainText('4');
  await page.getByRole('button',{name:'Empty the beaker',exact:true}).click();
  await solveMechanism(page);await page.locator('#activityNext').click();await expect(page.locator('.object').first()).toBeVisible();
  await collectVisible(page);await page.locator('.room-scene').screenshot({path:'artifacts/exploration-potion.png'});await page.locator('#activityNext').click();await expect(page.locator('#challenge')).toBeVisible();
});
