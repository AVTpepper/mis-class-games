const {test,expect}=require('@playwright/test');
const {skipCutscene}=require('./cutscene-helper');

test('sidebar contains information and leaves the activity most of the screen',async({page})=>{
  await page.setViewportSize({width:1024,height:600});await page.goto('/games/midnight-museum/');
  await page.locator('#enterBtn').click();await skipCutscene(page);
  for(const selector of ['.top','#teamStatus','.status','.footer','#codeSoFar'])await expect(page.locator('#gameSidebar').locator(selector)).toHaveCount(1);
  const sidebar=await page.locator('#gameSidebar').boundingBox(),activity=await page.locator('.room').boundingBox();
  expect(sidebar.x+sidebar.width).toBeLessThan(activity.x);
  expect(activity.height).toBeGreaterThan(540);expect(activity.width).toBeGreaterThan(716);
  for(const selector of ['.top','#teamStatus','.status','.footer','#codeSoFar']){
    const box=await page.locator(selector).boundingBox();expect(box.y).toBeGreaterThanOrEqual(sidebar.y);expect(box.y+box.height).toBeLessThanOrEqual(sidebar.y+sidebar.height);
  }
  await page.screenshot({path:'artifacts/sidebar-desktop.png'});
  if(await page.locator('#infoTab').isVisible())await page.locator('#infoTab').click();
  await page.getByRole('button',{name:'Home',exact:true}).click();
  await expect(page.locator('#gameSidebar')).not.toBeVisible();
  await expect(page.locator('.wrap>.top')).toBeVisible();
  await expect(page.locator('.wrap>.footer')).toBeVisible();
  await expect(page.getByRole('button',{name:'Escape room',exact:true})).toHaveCount(1);
});

test('mobile information drawer keeps progress, counts down, and closes with Escape',async({page})=>{
  await page.setViewportSize({width:375,height:812});await page.clock.install({time:new Date('2026-10-22T12:00:00Z')});await page.clock.pauseAt(new Date('2026-10-22T12:00:01Z'));await page.goto('/games/midnight-museum/');
  await page.locator('#enterBtn').click();await skipCutscene(page);
  await expect(page.locator('#gameSidebar')).not.toBeVisible();
  await expect(page.locator('#mobileClock')).toHaveText('20:00');
  await page.locator('.object').first().click();
  await expect(page.locator('#gameSidebar')).toBeVisible();
  await expect(page.locator('#main')).toHaveAttribute('inert','');
  await page.clock.runFor(2000);await expect(page.locator('#mobileClock')).toHaveText('19:58');
  await page.screenshot({path:'artifacts/sidebar-mobile-open.png'});
  await page.keyboard.press('Escape');
  await expect(page.locator('#gameSidebar')).not.toBeVisible();
  await expect(page.locator('#sidebarToggle')).toBeFocused();
  await expect(page.locator('#main')).not.toHaveAttribute('inert','');
  await expect(page.locator('#objectClue')).toContainText('brass clock');
  await page.screenshot({path:'artifacts/sidebar-mobile-activity.png'});
  await page.locator('#sidebarToggle').click();await page.locator('#infoTab').click();
  await page.getByRole('button',{name:'Home',exact:true}).click();
  await page.locator('#enterBtn').click();
  await expect(page.locator('.object.found')).toHaveCount(1);
  await page.locator('#sidebarToggle').click();await page.setViewportSize({width:1280,height:720});
  await expect(page.locator('#main')).not.toHaveAttribute('inert','');
  await expect(page.locator('#gameSidebar')).toBeVisible();
});
