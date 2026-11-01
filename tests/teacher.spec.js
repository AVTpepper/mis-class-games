const {skipCutscene}=require('./cutscene-helper');
const {test,expect}=require('@playwright/test');
const {investigateRoom}=require('./exploration-helper');

async function unlockGuide(page){
  await page.getByRole('button',{name:'Teacher room',exact:true}).click();
  await page.locator('#teacherCode').fill('halloween123');await page.locator('#teacherCode').press('Enter');
}

test('teacher can test every room and lock in separate tabs without changing a team save',async({page})=>{
  test.setTimeout(90000);
  await page.clock.install();await page.clock.pauseAt(new Date());
  await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);
  await investigateRoom(page);await page.locator('#value1').fill('36');await page.locator('#checkBtn').click();await skipCutscene(page);
  const saved=await page.evaluate(()=>localStorage.getItem(SAVE_KEY));
  await unlockGuide(page);
  await expect(page.locator('.teacher-test-actions button')).toHaveCount(12);
  for(let room=0;room<6;room++)for(const stage of ['search','lock']){
    const popup=page.waitForEvent('popup');
    await page.getByRole('button',{name:new RegExp(`^Test ${stage==='search'?'room':'lock'} ${room+1}:`)}).click();
    const preview=await popup;await preview.waitForLoadState('domcontentloaded');
    await expect(preview.locator('#roomNo')).toHaveText(`Room ${room+1} of 6`);
    await expect(preview.locator('#activityTitle')).toContainText(stage==='search'?'1 / 4':'4 / 4');
    await expect(preview.locator('#teacherTestBanner')).toBeVisible();
    await expect(preview.locator('#lives')).toHaveText('5 / 5 lives');
    await expect(page.locator('#teacherInfo')).toBeVisible();
    if(stage==='search'){
      await investigateRoom(preview);await expect(preview.locator('#activityTitle')).toContainText('4 / 4');
    }
    if(room===5){
      await expect(preview.locator('#snakeCanvas')).toBeVisible();await expect(preview.locator('#snakeToggle')).toBeEnabled();
      await preview.setViewportSize({width:375,height:812});
      expect(await preview.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await preview.screenshot({path:'artifacts/teacher-snake-test-mobile.png',fullPage:true});
    }
    else{
      await preview.locator('#checkBtn').click();await expect(preview.locator('#lives')).toHaveText('4 / 5 lives');
    }
    expect(await preview.evaluate(()=>localStorage.getItem(SAVE_KEY))).toBe(saved);
    await preview.close();
  }
  expect(await page.evaluate(()=>localStorage.getItem(SAVE_KEY))).toBe(saved);
});

test('teacher tests reset on refresh and cannot be launched from the locked teacher gate',async({page})=>{
  await page.goto('/games/midnight-museum/');
  await page.evaluate(()=>{window.testOpened=false;window.open=()=>{window.testOpened=true;};launchTeacherTest(3);});
  expect(await page.evaluate(()=>window.testOpened)).toBe(false);
  await page.reload();await unlockGuide(page);
  await page.setViewportSize({width:375,height:812});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const popup=page.waitForEvent('popup');await page.getByRole('button',{name:/^Test lock 4:/}).click();
  const preview=await popup;await preview.waitForLoadState('domcontentloaded');
  await preview.locator('#checkBtn').click();await expect(preview.locator('#lives')).toHaveText('4 / 5 lives');
  await preview.reload();await expect(preview.locator('#roomNo')).toHaveText('Room 4 of 6');
  await expect(preview.locator('#lives')).toHaveText('5 / 5 lives');
  await expect(preview.locator('#activityTitle')).toContainText('4 / 4');
  await preview.close();
  await page.evaluate(()=>window.open=()=>null);
  await page.getByRole('button',{name:/^Test room 1:/}).click();
  await expect(page.locator('#teacherTestFeedback')).toContainText('Allow pop-ups');
});
test('teacher gate protects the normal view, keeps time running and relocks on exit',async({page})=>{
  await page.clock.install({time:new Date('2026-10-22T12:00:00Z')});await page.clock.pauseAt(new Date('2026-10-22T12:00:01Z'));await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);
  await page.clock.fastForward(5000);
  if(await page.locator('#sidebarToggle').isVisible())await page.locator('#sidebarToggle').click();
  await page.getByRole('button',{name:'Teacher room',exact:true}).click();
  await expect(page.locator('#teacherGate')).toBeVisible();
  await expect(page.locator('#teacherInfo')).toBeEmpty();
  await page.locator('#teacherCode').fill('incorrect');await page.getByRole('button',{name:'Unlock teacher room',exact:true}).click();
  await expect(page.locator('#teacherFeedback')).toContainText('incorrect');
  await expect(page.locator('#teacherInfo')).toBeEmpty();
  await expect(page.locator('#lives')).toHaveText('5 / 5 lives');
  await page.locator('#teacherCode').fill('halloween123');await page.locator('#teacherCode').press('Enter');
  await expect(page.locator('#teacherInfo')).toBeVisible();
  await expect(page.locator('.teacher-stages article')).toHaveCount(6);
  await expect(page.locator('.teacher-rescue-code')).toHaveText('692457');
  await expect(page.locator('#teacherInfo')).toContainText('Costume awards setup');
  await expect(page.locator('#teacherInfo')).toContainText('10 gold sparks');
  await page.setViewportSize({width:375,height:812});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.clock.fastForward(60000);
  await page.getByRole('button',{name:'Escape room',exact:true}).click();await skipCutscene(page);
  await expect(page.locator('#clock')).toHaveText('18:55');
  await expect(page.locator('#pauseBtn')).toHaveCount(0);
  await expect(page.locator('#teacherInfo')).toBeEmpty();
  if(await page.locator('#sidebarToggle').isVisible())await page.locator('#sidebarToggle').click();
  await page.getByRole('button',{name:'Teacher room',exact:true}).click();
  await expect(page.locator('#teacherGate')).toBeVisible();
  await page.locator('#teacherCode').fill('halloween123');await page.locator('#teacherCode').press('Enter');
  await page.getByRole('button',{name:'Lock teacher room',exact:true}).click();
  await expect(page.locator('#teacherInfo')).toBeEmpty();
  await page.locator('#teacherCode').fill('halloween123');await page.locator('#teacherCode').press('Enter');
  await page.reload();
  if(await page.locator('#sidebarToggle').isVisible())await page.locator('#sidebarToggle').click();
  await page.getByRole('button',{name:'Teacher room',exact:true}).click();
  await expect(page.locator('#teacherGate')).toBeVisible();
  await expect(page.locator('#teacherInfo')).toBeEmpty();
});
