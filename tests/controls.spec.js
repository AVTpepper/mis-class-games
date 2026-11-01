const {test,expect}=require('@playwright/test');
const {skipCutscene}=require('./cutscene-helper');
const {investigateRoom}=require('./exploration-helper');
const {catchFirefly}=require('./interlude-helper');

async function openBreak(page,room){
  await page.evaluate(room=>{index=room;started=true;Interludes.reset();Interludes.begin(room);show('interlude');},room);
}
async function openSnake(page){
  await page.goto('/games/midnight-museum/');
  await page.evaluate(()=>{started=true;index=5;render();show('game');});
  await investigateRoom(page);
}

test('Enter submits typed lock answers once and leaves working fields alone',async({page})=>{
  await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);await investigateRoom(page);
  await page.locator('#clockMultiplesA').fill('9,18,27,36');await page.locator('#clockMultiplesA').press('Enter');
  await expect(page.locator('#lives')).toHaveText('5 / 5 lives');
  await page.locator('#value1').fill('12');await page.locator('#value1').press('Enter');
  await expect(page.locator('#lives')).toHaveText('4 / 5 lives');
  await page.locator('#value1').fill('36');await page.locator('#value1').press('Enter');await skipCutscene(page);
  await expect(page.locator('#title')).toContainText('Potion');await investigateRoom(page);
  await page.locator('#value2a').fill('8');await page.locator('#value2b').fill('9');await page.locator('#value2b').press('Enter');await skipCutscene(page);
  await expect(page.locator('#interlude')).toBeVisible();
  await expect(page.locator('#lives')).toHaveText('4 / 5 lives');
});

test('snake accepts arrows and uppercase WASD and renders between simulation ticks',async({page})=>{
  await page.clock.install();await page.clock.pauseAt(new Date());await openSnake(page);
  await page.locator('#snakeToggle').click();await page.locator('#snakeCanvas').press('W');await page.clock.runFor(320);
  expect(await page.evaluate(()=>Snake.snapshot().body[0])).toEqual({x:3,y:4});
  const before=await page.locator('#snakeCanvas').evaluate(canvas=>canvas.toDataURL());
  await page.clock.runFor(100);
  const after=await page.locator('#snakeCanvas').evaluate(canvas=>canvas.toDataURL());
  expect(after).not.toBe(before);expect(await page.evaluate(()=>Snake.snapshot().body[0])).toEqual({x:3,y:4});
  await page.locator('#snakeCanvas').press('ArrowLeft');await page.clock.runFor(220);
  expect(await page.evaluate(()=>Snake.snapshot().body[0])).toEqual({x:2,y:4});
  await page.locator('#snakeCanvas').press('s');await page.clock.runFor(320);
  expect(await page.evaluate(()=>Snake.snapshot().body[0])).toEqual({x:2,y:5});
  await page.locator('#snakeCanvas').press('Space');const paused=await page.evaluate(()=>Snake.snapshot());
  await page.clock.runFor(1000);expect(await page.evaluate(()=>Snake.snapshot())).toEqual(paused);
});

test('memory has six pairs and upgrades a saved six-card game without losing matches',async({page})=>{
  await page.goto('/games/midnight-museum/');await openBreak(page,2);await expect(page.locator('.lantern-card')).toHaveCount(12);
  expect(await page.evaluate(()=>Interludes.snapshot().cards.filter(c=>c===5))).toHaveLength(2);
  await page.evaluate(()=>{Interludes.restore({pending:2,cards:[0,1,2,1,0,2],matched:[0],open:[1],moves:2});Interludes.render();});
  await expect(page.locator('.lantern-card')).toHaveCount(12);await expect(page.locator('.lantern-card:disabled')).toHaveCount(2);
  await expect(page.locator('#breakStatus')).toContainText('1 / 6');
  expect(await page.evaluate(()=>Interludes.snapshot().open)).toEqual([1]);
});

test('flashlight wanders, hides bugs and rejects catches until they are lit',async({page})=>{
  await page.addInitScript(()=>Math.random=()=>0);
  await page.clock.install();await page.clock.pauseAt(new Date());await page.goto('/games/midnight-museum/');await openBreak(page,4);
  await expect(page.locator('#firefly')).toBeDisabled();await expect(page.locator('#firefly')).toBeHidden();
  await page.evaluate(()=>Interludes.catchOne());expect(await page.evaluate(()=>Interludes.snapshot().caught)).toBe(0);
  const before=await page.locator('.firefly-field').getAttribute('style');await page.clock.runFor(1000);
  expect(await page.locator('.firefly-field').getAttribute('style')).not.toBe(before);
  await catchFirefly(page);await expect(page.locator('#breakStatus')).toContainText('1 / 5');
  // Keyboard users can aim without ever focusing an invisible bug.
  const field=page.locator('.firefly-field');await field.focus();
  await field.press('Enter');await expect(page.locator('#breakStatus')).toContainText('1 / 5');
  for(let i=0;i<6;i++)await field.press('a');for(let i=0;i<6;i++)await field.press('ArrowUp');
  await expect(page.locator('#firefly')).toBeEnabled();await expect(page.locator('#firefly')).toBeVisible();
  await field.press('Space');await expect(page.locator('#breakStatus')).toContainText('2 / 5');
});

test('reduced motion keeps the flashlight still and manual aiming available',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.clock.install();await page.clock.pauseAt(new Date());
  await page.goto('/games/midnight-museum/');await openBreak(page,4);const before=await page.locator('.firefly-field').getAttribute('style');
  await page.clock.runFor(3000);expect(await page.locator('.firefly-field').getAttribute('style')).toBe(before);
  await catchFirefly(page);await expect(page.locator('#breakStatus')).toContainText('1 / 5');
});
