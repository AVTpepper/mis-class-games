const {test,expect}=require('@playwright/test');
const {skipCutscene}=require('./cutscene-helper');
const {investigateRoom,collectVisible}=require('./exploration-helper');
test('only the long minute hand turns as museum time advances',async({page})=>{
  await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);
  await collectVisible(page);await page.locator('#activityNext').click();
  const hourPositions=()=>page.locator('.mechanism-clocks .hour-hand').evaluateAll(hands=>hands.map(h=>{const m=h.getCTM();return [h.getAttribute('d'),m.a,m.b,m.c,m.d,m.e,m.f];}));
  const original=await hourPositions();expect(original).toHaveLength(2);
  await expect(page.locator('.mechanism-clocks .minute-hand').first()).toHaveAttribute('transform','rotate(0 60 57)');
  await page.locator('#sceneMinute').focus();for(let i=0;i<9;i++)await page.locator('#sceneMinute').press('ArrowRight');
  await expect(page.locator('#sceneMinute')).toHaveValue('9');
  await expect(page.locator('.mechanism-clocks .minute-hand').first()).toHaveAttribute('transform','rotate(54 60 57)');
  expect(await hourPositions()).toEqual(original);
  await page.locator('#sceneMinute').press('End');
  await expect(page.locator('.mechanism-clocks .minute-hand').nth(1)).toHaveAttribute('transform','rotate(288 60 57)');
  expect(await hourPositions()).toEqual(original);
});
test('multiples begin blank and retain only the students own working after refresh',async({page})=>{
  await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);await investigateRoom(page);
  await expect(page.locator('#clockMultiplesA')).toHaveValue('');await expect(page.locator('#clockMultiplesB')).toHaveValue('');
  await expect(page.locator('.multiples-workspace')).not.toContainText('36');
  await page.locator('#clockMultiplesA').fill('9, 18, 27, 36');await page.locator('#clockMultiplesB').fill('12, 24, 36');
  await page.reload();await page.locator('#enterBtn').click();
  await expect(page.locator('#clockMultiplesA')).toHaveValue('9, 18, 27, 36');
  await expect(page.locator('#clockMultiplesB')).toHaveValue('12, 24, 36');
  await page.locator('#value1').fill('36');await page.locator('#checkBtn').click();await skipCutscene(page);
  await expect(page.locator('#title')).toHaveText('The Potion of Proportions');
});

test('each clock hand jumps only at its own chime interval',async({page})=>{
  await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);await collectVisible(page);await page.locator('#activityNext').click();
  for(const [minute,brass,silver] of [[8,0,0],[9,54,0],[11,54,0],[12,54,72],[18,108,72],[24,108,144],[36,216,216]]){
    await page.locator('#sceneMinute').fill(String(minute));
    await expect(page.locator('.mechanism-clocks .minute-hand').nth(0)).toHaveAttribute('transform',`rotate(${brass} 60 57)`);
    await expect(page.locator('.mechanism-clocks .minute-hand').nth(1)).toHaveAttribute('transform',`rotate(${silver} 60 57)`);
  }
});

async function openClockSlider(page){
  await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);
  await collectVisible(page);await page.locator('#activityNext').click();
  const slider=page.getByRole('slider',{name:'Minutes after midnight',exact:true});
  await slider.scrollIntoViewIfNeeded();return slider;
}

test('the clock slider supports a continuous mouse drag without replacing the control',async({page})=>{
  await page.setViewportSize({width:1280,height:800});
  const slider=await openClockSlider(page),original=await slider.elementHandle(),box=await slider.boundingBox();
  const x=value=>box.x+14+(box.width-28)*value/48,y=box.y+box.height/2;
  await page.mouse.move(x(0),y);await page.mouse.down();
  try{
    for(const value of [9,18,36]){
      await page.mouse.move(x(value),y,{steps:10});
      await expect(slider).toHaveValue(String(value));
      await expect(page.locator('#sceneMinuteValue')).toHaveText(String(value));
      expect(await original.evaluate(input=>input.isConnected)).toBe(true);
    }
  }finally{await page.mouse.up();}
  await expect(page.locator('.chime-lights .lit')).toHaveCount(2);
  await expect(slider).toHaveAttribute('aria-valuetext',/Brass clock and Silver clock chiming/);
  await expect(page.locator('#activityNext')).toBeEnabled();
  await expect(slider).toBeFocused();
  await page.mouse.move(x(36),y);await page.mouse.down();
  await page.mouse.move(x(24),y,{steps:12});await page.mouse.up();
  await expect(slider).toHaveValue('24');
  await expect(page.locator('.chime-lights .lit')).toHaveCount(1);
  // Opening the compartment is permanent even when the student experiments further.
  await expect(page.locator('#activityNext')).toBeEnabled();
  await page.reload();await page.locator('#enterBtn').click();
  await expect(page.locator('#sceneMinute')).toHaveValue('24');
});

test.describe('touch clock slider',()=>{
  test.use({hasTouch:true});
  for(const width of [375,768])test(`a finger can drag the slider continuously (${width}px)`,async({page})=>{
    await page.setViewportSize({width,height:900});
    const slider=await openClockSlider(page),original=await slider.elementHandle(),box=await slider.boundingBox();
    const x=value=>box.x+14+(box.width-28)*value/48,y=box.y+box.height/2;
    const session=await page.context().newCDPSession(page),scroll=await page.evaluate(()=>scrollY);
    const point=value=>({x:x(value),y,id:1,radiusX:6,radiusY:6,force:1});
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(0)]});
    let previous=0;
    try{
      for(const value of [9,18,36]){
        for(let step=1;step<=10;step++)await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(previous+(value-previous)*step/10)]});
        await expect(slider).toHaveValue(String(value));
        expect(await original.evaluate(input=>input.isConnected)).toBe(true);
        previous=value;
      }
    }finally{await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();}
    expect(await page.evaluate(()=>scrollY)).toBeCloseTo(scroll,0);
    await expect(page.locator('.chime-lights .lit')).toHaveCount(2);
    await expect(page.locator('#activityNext')).toBeEnabled();
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:`artifacts/responsive-audit/clock-touch-${width}.png`,fullPage:true});
  });
});
