const {skipCutscene}=require('./cutscene-helper');
const {investigateRoom}=require('./exploration-helper');
const {test,expect}=require('@playwright/test');
test('cutscenes stay open until Continue while the countdown keeps running',async({page})=>{
  await page.clock.install({time:new Date('2026-10-21T12:00:00Z')});await page.clock.pauseAt(new Date('2026-10-21T12:00:01Z'));await page.goto('/games/midnight-museum/');
  await expect(page.getByRole('button',{name:'Teacher room',exact:true})).toBeVisible();
  await page.locator('#enterBtn').click();
  await expect(page.locator('#cutscene')).toBeVisible();
  await expect(page.locator('#cutsceneTitle')).toHaveText('The doors are closing…');
  await page.clock.runFor(4000);await expect(page.locator('#clock')).toHaveText('19:56');
  await page.keyboard.press('Escape');await expect(page.locator('#cutscene')).toBeVisible();
  await page.mouse.click(5,5);await expect(page.locator('#cutscene')).toBeVisible();
  await skipCutscene(page);await expect(page.locator('#cutscene')).not.toBeVisible();
  await page.clock.runFor(1000);await expect(page.locator('#clock')).toHaveText('19:55');
  await investigateRoom(page);
  await page.locator('#value1').fill('36');await page.locator('#checkBtn').click();
  await expect(page.locator('#cutsceneChapter')).toHaveText('Room 1 cleared · digit 6 recovered');
  await page.clock.runFor(30000);await expect(page.locator('#cutscene')).toBeVisible();
  await expect(page.locator('#clock')).toHaveText('19:25');
  await skipCutscene(page);await expect(page.locator('#cutscene')).not.toBeVisible();
  await expect(page.locator('#title')).toHaveText('The Potion of Proportions');
});
test('home actions have space and teacher access is prominent on desktop and mobile',async({page})=>{
  await page.goto('/games/midnight-museum/');
  for(const width of [1280,375]) {
    await page.setViewportSize({width,height:850});
    const teacher=page.getByRole('button',{name:'Teacher room',exact:true});
    await expect(teacher).toBeVisible();
    expect(await teacher.evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(255, 209, 147)');
    const a=await page.locator('#enterBtn').boundingBox();
    const b=await page.locator('.hero-actions button').nth(1).boundingBox();
    expect(Math.max(b.x-(a.x+a.width),b.y-(a.y+a.height))).toBeGreaterThanOrEqual(13);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`artifacts/home-${width}.png`,fullPage:true});
  }
  await page.getByRole('button',{name:'Teacher room',exact:true}).click();
  await expect(page.locator('#teacherGate')).toBeVisible();
});
