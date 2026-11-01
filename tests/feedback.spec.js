const {test,expect}=require('@playwright/test');
const {skipCutscene}=require('./cutscene-helper');
const {investigateRoom,collectVisible}=require('./exploration-helper');

async function begin(page){await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);}

test('wrong answers show the lives left and explain when the team must restart',async({page})=>{
  await begin(page);await investigateRoom(page);
  await page.locator('#value1').fill('1');await page.locator('#value1').press('Enter');
  await expect(page.locator('#lifeNotice')).toBeVisible();
  await expect(page.locator('#lifeNoticeTitle')).toHaveText('Life lost! 4 lives left.');
  await expect(page.locator('#lifeNotice')).toContainText('If you lose your last life, you must start over from Room 1.');
  await expect(page.locator('#feedback')).toContainText('Life lost! 4 lives left.');
  await page.getByRole('button',{name:'Keep playing',exact:true}).click();
  await expect(page.locator('#lifeNotice')).toBeHidden();
  for(let i=0;i<3;i++)await page.locator('#value1').press('Enter');
  await expect(page.locator('#lifeNoticeTitle')).toHaveText('Life lost! 1 life left.');
});

test('game over stops play, survives refresh and waits for a keyboard restart',async({page})=>{
  await page.clock.install();await page.clock.pauseAt(new Date());await begin(page);await investigateRoom(page);
  await page.evaluate(()=>{lives=1;updateLives();});
  await page.locator('#value1').fill('1');await page.locator('#value1').press('Enter');
  const dialog=page.getByRole('dialog',{name:'Game over',exact:true});
  await expect(dialog).toBeVisible();await expect(page.locator('#lives')).toHaveText('0 / 5 lives');
  await expect(dialog).toContainText('Your answers, clues, code digits and Snake levels will reset.');
  await page.keyboard.press('Escape');await expect(dialog).toBeVisible();
  const clock=await page.locator('#clock').textContent();await page.clock.runFor(5000);
  await expect(page.locator('#clock')).toHaveText(clock);
  await page.reload();await expect(dialog).toBeVisible();
  await page.getByRole('button',{name:'Start again',exact:false}).press('Enter');
  await expect(dialog).toBeHidden();await expect(page.locator('#title')).toContainText('Clockmaker');
  await expect(page.locator('#lives')).toHaveText('5 / 5 lives');await expect(page.locator('#clock')).toHaveText('20:00');
  expect(await page.evaluate(()=>({code,answers,inspected,gameOver}))).toEqual({code:[],answers:{},inspected:[],gameOver:false});
  expect(await page.evaluate(()=>Exploration.snapshot().every(room=>!room.done))).toBe(true);
});

test('Snake crashes and final code errors use the same clear life warnings',async({page})=>{
  await page.clock.install();await page.clock.pauseAt(new Date());await page.goto('/games/midnight-museum/');
  await page.evaluate(()=>{started=true;index=5;render();show('game');});await investigateRoom(page);
  await page.locator('#snakeToggle').click();await page.clock.runFor(3000);
  await expect(page.locator('#lifeNoticeTitle')).toHaveText('Life lost! 4 lives left.');
  await expect(page.locator('#lifeNoticeReason')).toContainText('crashed');
  await page.evaluate(()=>{index=rooms.length;code=rooms.map(room=>room.digit);lives=1;renderFinal();show('final');});
  await page.locator('#finalCode').fill('000000');await page.locator('#finalCode').press('Enter');
  await expect(page.getByRole('dialog',{name:'Game over',exact:true})).toBeVisible();
  await expect(page.locator('#gameOverReason')).toContainText('painting remains shut');
  await page.getByRole('button',{name:'Start again',exact:false}).click();await expect(page.locator('#game')).toBeVisible();
});

test('Continue glows only after its task is ready, including with reduced motion',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await begin(page);
  const next=page.locator('#activityNext');await expect(next).toBeDisabled();
  expect(await next.evaluate(button=>getComputedStyle(button).boxShadow)).toBe('none');
  await collectVisible(page);await expect(next).toBeEnabled();
  expect(await next.evaluate(button=>getComputedStyle(button).boxShadow)).not.toBe('none');
  await next.focus();await page.screenshot({path:'artifacts/continue-ready.png'});
});

for(const width of [1024,375])test(`life notices and Game over fit at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:width===1024?600:812});await begin(page);
  await page.evaluate(()=>loseLife('The lock stays closed. Read the clues and try again.'));
  for(const selector of ['#lifeNotice','#lifeNotice button'])await expect(page.locator(selector)).toBeInViewport();
  await page.screenshot({path:`artifacts/life-notice-${width}.png`,fullPage:true});
  await page.evaluate(()=>{lives=1;loseLife('The lock stays closed. Read the clues and try again.');});
  await expect(page.locator('#gameOverDialog .primary')).toBeInViewport();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`artifacts/game-over-${width}.png`,fullPage:true});
});
