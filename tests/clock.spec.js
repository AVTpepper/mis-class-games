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
