const {test,expect}=require('@playwright/test');
const {skipCutscene}=require('./cutscene-helper');
const {investigateRoom}=require('./exploration-helper');
const {catchFirefly}=require('./interlude-helper');
async function begin(page){await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);}
async function choose(page,group,value){await page.locator(`[data-group="${group}"] .option`).filter({hasText:new RegExp('^'+value+' ')}).click();}
async function solveClock(page){await investigateRoom(page);await page.locator('#value1').fill('36');await page.locator('#checkBtn').click();await skipCutscene(page);}

test('related questions and earlier clues stay available together',async({page})=>{
  await begin(page);await investigateRoom(page);
  await expect(page.locator('#clockMultiplesA')).toBeVisible();await expect(page.locator('#value1')).toBeVisible();
  await page.locator('#value1').fill('36');await page.locator('#checkBtn').click();await skipCutscene(page);
  await page.locator('#cluesTab').click();await page.locator('#journalRoom').selectOption('0');
  await expect(page.locator('#clueChips button')).toHaveCount(3);
  await page.locator('#clueChips button').first().click();await expect(page.locator('#objectClue')).toContainText('every 9 minutes');
  await investigateRoom(page);
  await expect(page.locator('#value2a')).toBeVisible();await expect(page.locator('#value2b')).toBeVisible();
  await page.locator('#value2a').fill('8');await page.locator('#value2b').fill('9');
  await page.reload();await page.locator('#enterBtn').click();
  await expect(page.locator('#value2a')).toHaveValue('8');await expect(page.locator('#value2b')).toHaveValue('9');
  await page.locator('#cluesTab').click();await page.locator('#journalRoom').selectOption('0');
  await expect(page.locator('#clueChips button')).toHaveCount(3);
});

test('two distinct arcade breaks appear between rooms, save progress, and cost no lives',async({page})=>{
  test.setTimeout(90000);await page.addInitScript(()=>Math.random=()=>0);
  await begin(page);await solveClock(page);await investigateRoom(page);
  await page.locator('#value2a').fill('8');await page.locator('#value2b').fill('9');await page.locator('#checkBtn').click();await skipCutscene(page);
  await expect(page.locator('#interlude')).toBeVisible();await expect(page.locator('#breakTitle')).toHaveText('The lantern alcove');
  const lives=await page.locator('#lives').textContent();
  for(const i of [0,2])await page.locator('.lantern-card').nth(i).click();
  await expect(page.locator('#breakStatus')).toContainText('1 / 6');
  await page.reload();await page.locator('#enterBtn').click();
  await expect(page.locator('#interlude')).toBeVisible();await expect(page.locator('.lantern-card:disabled')).toHaveCount(2);
  const cards=await page.evaluate(()=>Interludes.snapshot().cards);
  for(let value=0;value<6;value++){
    if(value===cards[0])continue;
    for(let i=0;i<cards.length;i++)if(cards[i]===value)await page.locator('.lantern-card').nth(i).click();
  }
  await expect(page.locator('#breakContinue')).toBeEnabled();await page.locator('#breakContinue').click();
  await expect(page.locator('#title')).toContainText('Gallery');
  await investigateRoom(page);await choose(page,'fact','B');await choose(page,'headline','B');await page.locator('#checkBtn').click();await skipCutscene(page);
  await investigateRoom(page);await choose(page,'step','B');await choose(page,'upgrade','C');await page.locator('#checkBtn').click();await skipCutscene(page);
  await expect(page.locator('#interlude')).toBeVisible();await expect(page.locator('#breakTitle')).toHaveText('The firefly corridor');
  await catchFirefly(page);await catchFirefly(page);
  await page.reload();await page.locator('#enterBtn').click();await expect(page.locator('#breakStatus')).toContainText('2 / 5');
  for(let i=0;i<3;i++)await catchFirefly(page);
  await page.locator('#breakContinue').click();await expect(page.locator('#title')).toContainText('Poet');
  await expect(page.locator('#lives')).toHaveText(lives);
  expect(await page.evaluate(()=>Interludes.snapshot().completed)).toEqual([2,4]);
});

test('countdown can be hidden and audio is silent until explicitly enabled',async({page})=>{
  await page.clock.install({time:new Date('2026-10-22T12:00:00Z')});await page.clock.pauseAt(new Date('2026-10-22T12:00:01Z'));await begin(page);
  expect(await page.evaluate(()=>MuseumAudio.status())).toEqual({effects:false,music:false,contextState:'not-created',musicVoices:0});
  await page.locator('#timerToggle').click();await expect(page.locator('#clock')).not.toBeVisible();
  await page.clock.runFor(5000);await expect(page.locator('#clock')).toHaveText('19:55');
  await page.reload();await page.locator('#enterBtn').click();await expect(page.locator('#clock')).not.toBeVisible();
  await page.locator('#timerToggle').click();await expect(page.locator('#clock')).toBeVisible();
  await page.locator('#soundToggle').click();await expect(page.locator('#soundToggle')).toHaveAttribute('aria-pressed','true');
  await expect.poll(()=>page.evaluate(()=>MuseumAudio.status().contextState)).toBe('running');
  await page.locator('#musicToggle').click();expect(await page.evaluate(()=>MuseumAudio.status().musicVoices)).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Home',exact:true}).click();
  expect(await page.evaluate(()=>MuseumAudio.status().musicVoices)).toBe(0);
  await page.locator('#enterBtn').click();
  expect(await page.evaluate(()=>MuseumAudio.status().musicVoices)).toBeGreaterThan(0);
  await page.locator('#musicToggle').click();await page.locator('#soundToggle').click();
  expect(await page.evaluate(()=>MuseumAudio.status().musicVoices)).toBe(0);
  await page.reload();expect((await page.evaluate(()=>MuseumAudio.status())).effects).toBe(false);
});
for(const viewport of [{width:1024,height:600},{width:375,height:812}])test(`arcade breaks fit and can be skipped at ${viewport.width}px`,async({page})=>{
  await page.setViewportSize(viewport);await page.goto('/games/midnight-museum/');
  for(const room of [2,4]){
    await page.evaluate(room=>{index=room;code=rooms.slice(0,room).map(r=>r.digit);started=true;inspected=[];selected={};answers={};jars=[];Interludes.reset();Interludes.begin(room);show('interlude');},room);
    await expect(page.locator('#interlude')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.locator('#breakSkip').scrollIntoViewIfNeeded();
    await expect(page.locator('#breakSkip')).toBeInViewport();
    expect(await page.locator('#breakInstructions').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
    await page.screenshot({path:`artifacts/break-${room}-${viewport.width}.png`,fullPage:true});
    const lives=await page.locator('#lives').textContent();
    await page.locator('#breakSkip').click();await expect(page.locator('#game')).toBeVisible();
    await expect(page.locator('#lives')).toHaveText(lives);
    expect(await page.evaluate(()=>Interludes.pending())).toBe(null);
  }
});
