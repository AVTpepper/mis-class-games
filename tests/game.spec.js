const {skipCutscene}=require('./cutscene-helper');
const {test,expect}=require('@playwright/test');
const {playTurn}=require('./snake-helper');
const {investigateRoom}=require('./exploration-helper');
async function inspect(page) {
  await investigateRoom(page);
}
async function choice(page,group,letter) {
  await page.locator(`[data-group="${group}"] button`).filter({hasText:new RegExp(`^${letter} ·`)}).click();
}
test('team explores every room, recovers progress, and rescues Pip',async({page})=>{
  test.setTimeout(90000);
  // Predictable food placement keeps the test navigator from randomly trapping itself.
  await page.addInitScript(()=>{Math.random=()=>0;});
  await page.clock.install({time:new Date('2026-10-21T12:00:00Z')});await page.clock.pauseAt(new Date('2026-10-21T12:00:01Z'));
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/games/midnight-museum/');
  await page.getByRole('button',{name:'Escape room',exact:true}).click();await skipCutscene(page);
  await expect(page.locator('#title')).toHaveText('The Clockmaker’s Secret');
  await expect(page.locator('#checkBtn')).toBeDisabled();
  await inspect(page);await page.locator('#value1').fill('12');await page.locator('#checkBtn').click();await skipCutscene(page);
  await expect(page.locator('#feedback')).toContainText('lock stays closed');
  await expect(page.locator('.lock-effect')).toHaveAttribute('data-outcome','failure');
  await page.clock.runFor(250);
  await page.screenshot({path:'artifacts/lock-failure.png'});
  await page.locator('#value1').fill('36');await page.locator('#checkBtn').click();await skipCutscene(page);
  await page.clock.runFor(500);
  await page.screenshot({path:'artifacts/lock-success.png'});
  await inspect(page);await page.locator('#value2a').fill('8');
  for(let i=0;i<9;i++)await page.locator('.jar').nth(i).click();
  await expect(page.locator('#jarCount')).toContainText('9 of 12');
  await page.reload();await page.locator('#enterBtn').click();await skipCutscene(page);
  await expect(page.locator('#value2a')).toHaveValue('8');await expect(page.locator('.jar.filled')).toHaveCount(9);
  await page.locator('#value2b').fill('9');await page.locator('#checkBtn').click();await skipCutscene(page);
  await inspect(page);await choice(page,'fact','B');await choice(page,'headline','B');await page.locator('#checkBtn').click();await skipCutscene(page);
  await inspect(page);await choice(page,'step','B');await choice(page,'upgrade','C');await page.locator('#checkBtn').click();await skipCutscene(page);
  await inspect(page);await choice(page,'claim','B');await page.locator('#value5').fill('check');await page.locator('#checkBtn').click();await skipCutscene(page);
  await expect(page.locator('#title')).toHaveText('The Serpent Arcade');
  await inspect(page);await expect(page.locator('#checkBtn')).toBeDisabled();
  await page.setViewportSize({width:375,height:812});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:'artifacts/arcade-mobile.png',fullPage:true});
  await page.locator('#snakeToggle').click();
  await page.getByRole('button',{name:'Steer up',exact:true}).click();await page.clock.runFor(320);
  expect(await page.evaluate(()=>Snake.snapshot().body[0])).toEqual({x:3,y:4});
  await page.locator('#snakeToggle').click();
  const paused=await page.evaluate(()=>Snake.snapshot());
  await page.clock.runFor(2000);expect(await page.evaluate(()=>Snake.snapshot())).toEqual(paused);
  await page.setViewportSize({width:1280,height:960});
  await page.screenshot({path:'artifacts/arcade-desktop.png',fullPage:true});
  await playTurn(page);await expect(page.locator('#playerOne')).toContainText('10 / 10');
  await expect(page.locator('#checkBtn')).toBeDisabled();
  await page.reload();await page.locator('#enterBtn').click();await skipCutscene(page);
  await expect(page.locator('#playerOne')).toContainText('10 / 10');
  await page.locator('#snakeToggle').click();await page.clock.runFor(2400);
  await expect(page.locator('#snakeMessage')).toContainText('crashed');
  await expect(page.locator('#lives')).toHaveText('3 / 5 lives');
  await expect(page.locator('#playerOne')).toContainText('10 / 10');
  await expect(page.locator('#playerTwo')).toContainText('0 / 10');
  await playTurn(page);await expect(page.locator('#playerTwo')).toContainText('10 / 10');
  await page.locator('#checkBtn').click();await skipCutscene(page);
  await expect(page.locator('#final')).toBeVisible();
  await page.getByRole('button',{name:'Home',exact:true}).click();await page.getByRole('button',{name:'Escape room',exact:true}).click();await skipCutscene(page);
  await expect(page.locator('#final')).toBeVisible();
  await page.locator('#finalCode').fill('11111');await page.getByRole('button',{name:'Unlock the painting'}).click();
  await expect(page.locator('#finalFeedback')).toContainText('remains shut');
  await expect(page.locator('#lives')).toHaveText('2 / 5 lives');
  await page.locator('#finalCode').fill('692457');await page.locator('#finalCode').press('Enter');await skipCutscene(page);
  await expect(page.locator('#win')).toBeVisible();
  await page.reload();await page.locator('#enterBtn').click();await skipCutscene(page);await expect(page.locator('#win')).toBeVisible();
  expect(errors).toEqual([]);
});
test('cutscenes respect reduced motion and can be skipped for the next puzzle',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);
  await inspect(page);await page.locator('#value1').fill('36');await page.locator('#checkBtn').click();await skipCutscene(page);
  expect(await page.locator('.portal-door').first().evaluate(e=>getComputedStyle(e).display)).toBe('none');
  expect(await page.locator('#cutsceneTitle').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
  await inspect(page);await page.locator('#value2a').fill('8');
  await expect(page.locator('#value2a')).toHaveValue('8');
  await expect(page.locator('.footer p')).toHaveText('pyp 6 - classroom halloween escape room');
});
test('last team life resets all earned progress and persists the fresh game',async({page})=>{
  await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);
  await inspect(page);await page.locator('#value1').fill('36');await page.locator('#checkBtn').click();await skipCutscene(page);
  await inspect(page);
  await page.locator('#value2a').fill('1');await page.locator('#value2b').fill('1');
  for(let remaining=4;remaining>=1;remaining--) {
    await page.locator('#checkBtn').click();await skipCutscene(page);await expect(page.locator('#lives')).toHaveText(`${remaining} / 5 lives`);
  }
  await page.reload();await page.locator('#enterBtn').click();await skipCutscene(page);
  await expect(page.locator('#lives')).toHaveText('1 / 5 lives');
  await expect(page.locator('#codeSoFar')).toHaveText('6');
  await page.locator('#checkBtn').click();await skipCutscene(page);
  await expect(page.getByRole('dialog',{name:'Game over',exact:true})).toBeVisible();
  await expect(page.locator('#lives')).toHaveText('0 / 5 lives');
  await expect(page.locator('#gameOverHelp')).toContainText('start over from Room 1');
  await page.getByRole('button',{name:'Start again',exact:false}).click();
  await expect(page.locator('#title')).toContainText('Clockmaker');
  await expect(page.locator('#lives')).toHaveText('5 / 5 lives');
  await expect(page.locator('#codeSoFar')).toHaveText('None yet');
  await expect(page.locator('#checkBtn')).toBeDisabled();
  expect(await page.evaluate(()=>Snake.snapshot().cleared)).toEqual([0,0]);
  expect(await page.evaluate(()=>Exploration.snapshot().every(s=>!s.done))).toBe(true);
  await page.reload();await page.locator('#enterBtn').click();await skipCutscene(page);
  await expect(page.locator('#title')).toContainText('Clockmaker');
  await expect(page.locator('#lives')).toHaveText('5 / 5 lives');
});
test('continuous timer, refresh, timeout, restart and mobile layout',async({page})=>{
  await page.setViewportSize({width:375,height:812});await page.clock.install({time:new Date('2026-10-22T12:00:00Z')});await page.clock.pauseAt(new Date('2026-10-22T12:00:01Z'));await page.goto('/games/midnight-museum/');
  await page.locator('#enterBtn').click();await skipCutscene(page);await page.clock.fastForward(5000);await expect(page.locator('#clock')).toHaveText('19:55');
  await expect(page.locator('#pauseBtn')).toHaveCount(0);await page.locator('#sidebarToggle').click();await page.getByRole('button',{name:'Home',exact:true}).click();await page.clock.fastForward(60000);
  await page.reload();await page.clock.fastForward(60000);await page.locator('#enterBtn').click();await skipCutscene(page);await expect(page.locator('#clock')).toHaveText('17:55');
  await page.clock.fastForward(1200000);await expect(page.locator('#clock')).toHaveText('00:00');
  await expect(page.locator('#pauseBtn')).toHaveCount(0);
  await inspect(page);await page.locator('#value1').fill('36');await page.locator('#checkBtn').click();await skipCutscene(page);
  await expect(page.locator('#title')).toContainText('Potion');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('#sidebarToggle').click();page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'Start a new team game'}).click();await expect(page.locator('#title')).toContainText('Potion');
  page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Start a new team game'}).click();await skipCutscene(page);await expect(page.locator('#clock')).toHaveText('20:00');
  await expect(page.locator('#title')).toContainText('Clockmaker');await expect(page.locator('#pauseBtn')).toHaveCount(0);
});
test('costume voting uses configured form and accessible empty state',async({page})=>{
  await page.route('https://docs.google.com/**',r=>r.fulfill({body:'Voting form'}));
  await page.goto('/games/midnight-museum/');await page.locator('.nav').getByRole('button',{name:'Costume awards',exact:true}).click();
  await expect(page.locator('#formShell iframe')).toHaveAttribute('src','https://docs.google.com/forms/d/e/1FAIpQLSc4OojxYbd5VzChovNeGCGnjMCrabJye-ya-9DLnqHuXAny9w/viewform?usp=dialog&embedded=true');
  await expect(page.locator('#formShell a')).toHaveAttribute('href','https://docs.google.com/forms/d/e/1FAIpQLSc4OojxYbd5VzChovNeGCGnjMCrabJye-ya-9DLnqHuXAny9w/viewform?usp=dialog');
  await expect(page.locator('#formShell a')).toHaveAttribute('target','_blank');
  await expect(page.locator('.teacher')).toHaveCount(0);
  await page.route('**/game.js*',async route=>{
    const response=await route.fetch();const body=(await response.text()).replace(/const GOOGLE_FORM_URL='[^']*';/,"const GOOGLE_FORM_URL='';");
    await route.fulfill({response,body});
  });
  await page.reload();
  await expect(page.locator('#formShell')).toContainText('teacher connects');
  await expect(page.locator('#formShell iframe')).toHaveCount(0);
});
