const {test,expect}=require('@playwright/test');

test('hub introduces the museum and opens its introduction',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle('MIS Class Games · A place to learn and play');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Big ideas.Good games.');
  await expect(page.locator('.game-card')).toHaveCount(1);
  await expect(page.locator('.game-card')).toContainText('20 minutes');
  await expect(page.locator('.game-card')).toContainText('Team activity');
  expect(await page.locator('.game-art img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  await page.getByRole('link',{name:'Explore game',exact:true}).click();
  await expect(page).toHaveURL(/\/games\/midnight-museum\/index.html$/);
  await expect(page.locator('#home')).toBeVisible();
  await expect(page.locator('#enterBtn')).toHaveText('Enter the museum →');
  expect(errors).toEqual([]);
});

for(const width of [320,375,768,1366])test(`hub remains readable without horizontal overflow (${width}px)`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('/');
  await expect(page.getByRole('link',{name:'Explore game',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`artifacts/hub-${width}.png`,fullPage:true});
});

test('keyboard users can skip navigation and explore the collection',async({page})=>{
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Let’s explore'})).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Explore game',exact:true})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#home')).toBeVisible();
});
