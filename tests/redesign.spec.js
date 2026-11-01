const {test,expect}=require('@playwright/test');
const {skipCutscene}=require('./cutscene-helper');
const {collectVisible}=require('./exploration-helper');

function luminance(rgb){
  return rgb.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
}
async function expectReadableContrast(page,selectors){
  const colours=await page.locator(selectors).evaluateAll(elements=>elements.filter(e=>e.getClientRects().length).map(element=>{
    const colour=value=>value.match(/[\d.]+/g).map(Number);
    let surface=element;
    while(surface&&colour(getComputedStyle(surface).backgroundColor)[3]===0)surface=surface.parentElement;
    return {text:element.textContent.trim().slice(0,60),foreground:colour(getComputedStyle(element).color),background:colour(getComputedStyle(surface).backgroundColor)};
  }));
  expect(colours.length).toBeGreaterThan(0);
  for(const item of colours){
    const a=luminance(item.foreground),b=luminance(item.background);
    expect((Math.max(a,b)+.05)/(Math.min(a,b)+.05),item.text+' contrast').toBeGreaterThanOrEqual(4.5);
  }
}

test('hub and museum text and primary controls have readable contrast',async({page})=>{
  await page.goto('/');
  await expectReadableContrast(page,'h1,.game-title,.game-description,.button,.game-meta,.subject-tags');
  await page.getByRole('link',{name:'Explore game',exact:true}).click();
  await expectReadableContrast(page,'#home h1,#home .lead,#enterBtn,.teacher-entry');
  await page.evaluate(()=>{
    started=true;index=2;inspected=[0,1,2];roomFlow={room:2,stage:'lock',part:0};
    Exploration.restore(Exploration.snapshot().map(s=>({...s,done:true})));render();show('game');
  });
  await expectReadableContrast(page,'#title,#activityTitle,#challenge p,#challenge .option,#checkBtn,#sidebarInfo .tag,#sidebarInfo .clock');
  await page.locator('[data-group=fact] .option').nth(1).click();
  await expectReadableContrast(page,'.option.selected');
});

for(const width of [320,375,768])test(`touch layouts retain usable controls and visible activity focus (${width}px)`,async({page})=>{
  await page.setViewportSize({width,height:812});await page.goto('/games/midnight-museum/');
  await expect(page.locator('.game-toolbar')).not.toBeVisible();
  await page.locator('#enterBtn').click();await skipCutscene(page);
  await collectVisible(page);
  await page.locator('#activityNext').click();
  await expect(page.locator('#activityTitle')).toBeFocused();
  await expect(page.locator('#activityTitle')).toBeInViewport();
  for(const selector of ['#sidebarToggle','#activityNext','.story-button']){
    const box=await page.locator(selector).boundingBox();
    expect(box.height,selector+' touch target').toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('secondary screens keep the illustrated identity and load without script errors',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/games/midnight-museum/');
  await page.evaluate(()=>{started=true;index=6;code=rooms.map(room=>room.digit);renderFinal();show('final');});
  await expect(page.locator('#final .orb svg')).toBeVisible();
  await page.screenshot({path:'artifacts/redesign-final-door.png',fullPage:true});
  await page.evaluate(()=>show('win'));await expect(page.locator('#win .orb svg')).toBeVisible();
  await page.screenshot({path:'artifacts/redesign-rescue.png',fullPage:true});
  await page.route('https://docs.google.com/**',route=>route.fulfill({body:'Voting form'}));
  await page.evaluate(()=>show('vote'));await expect(page.locator('#vote .orb svg')).toBeVisible();
  await page.screenshot({path:'artifacts/redesign-voting.png',fullPage:true});
  await page.getByRole('button',{name:'Teacher room',exact:true}).click();
  await page.locator('#teacherCode').fill('halloween123');await page.locator('#teacherCode').press('Enter');
  await expect(page.locator('#teacherInfo .teacher-stages .art-icon')).toHaveCount(6);
  await page.screenshot({path:'artifacts/redesign-teacher-guide.png',fullPage:true});
  expect(errors).toEqual([]);
});

test('the poem retains five distinct acrostic lines when text wraps on a phone',async({page})=>{
  await page.setViewportSize({width:320,height:812});await page.goto('/games/midnight-museum/');
  await page.evaluate(()=>{
    started=true;index=4;inspected=[0,1,2];roomFlow={room:4,stage:'lock',part:0};
    Exploration.restore(Exploration.snapshot().map(s=>({...s,done:true})));render();show('game');
  });
  const lines=page.locator('.poem-line');await expect(lines).toHaveCount(5);
  expect((await lines.allTextContents()).map(line=>line.trim()[0]).join('')).toBe('CHECK');
  const geometry=await lines.evaluateAll(lines=>lines.map(line=>({height:line.getBoundingClientRect().height,lineHeight:parseFloat(getComputedStyle(line).lineHeight),indent:parseFloat(getComputedStyle(line).textIndent)})));
  expect(geometry.some(line=>line.height>line.lineHeight+1)).toBe(true);
  expect(geometry.every(line=>line.indent<0)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('.poem').screenshot({path:'artifacts/redesign-poem-mobile.png'});
});
