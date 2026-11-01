const {test,expect}=require('@playwright/test');
const {skipCutscene}=require('./cutscene-helper');
const {investigateRoom}=require('./exploration-helper');

test('hub introduces the museum and opens its introduction',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle('MIS Class Games · Choose your next adventure');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Choose your next adventure.');
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
  await expect(page.getByRole('link',{name:'Explore game',exact:true})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#home')).toBeVisible();
});

test('catalogue entries create distinct cards without changing the homepage',async({page})=>{
  await page.route('**/catalogue.js*',async route=>{
    const response=await route.fetch();
    const body=await response.text();
    await route.fulfill({response,body:body+"\nactivities.push({...activities[0],id:'another-adventure',title:'Another adventure'});"});
  });
  await page.goto('/');
  await expect(page.locator('.game-card')).toHaveCount(2);
  await expect(page.getByRole('article',{name:'The Midnight Museum',exact:true})).toBeVisible();
  await expect(page.getByRole('article',{name:'Another adventure',exact:true})).toBeVisible();
});

test('hub supports browser back, refresh, and the GitHub Pages repository prefix',async({page})=>{
  const failures=[];page.on('response',response=>{if(response.status()>=400)failures.push(response.url());});
  await page.goto('/mis-class-games/');
  await page.getByRole('link',{name:'Explore game',exact:true}).click();
  await expect(page).toHaveURL(/\/mis-class-games\/games\/midnight-museum\/index.html$/);
  await page.reload();await expect(page.locator('#home')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/mis-class-games\/$/);
  await page.getByRole('link',{name:'Explore game',exact:true}).click();
  await page.getByRole('link',{name:'All games',exact:false}).click();
  await expect(page).toHaveURL(/\/mis-class-games\/index.html$/);
  await expect(page.getByRole('heading',{name:'Choose your next adventure.'})).toBeVisible();
  expect(failures).toEqual([]);
});

for(const width of [375,1024])test(`leaving for the hub retains the team save and does not pause the countdown (${width}px)`,async({page})=>{
  await page.setViewportSize({width,height:812});
  await page.clock.install({time:new Date('2026-11-01T09:00:00Z')});
  await page.clock.pauseAt(new Date('2026-11-01T09:00:00Z'));
  await page.goto('/');
  await page.getByRole('link',{name:'Explore game',exact:true}).click();
  await page.locator('#enterBtn').click();await skipCutscene(page);
  await investigateRoom(page);
  await page.locator('#clockMultiplesA').fill('9, 18, 27, 36');
  await page.locator('#value1').fill('36');
  const save=await page.evaluate(()=>localStorage.getItem('midnight-museum-v2'));
  await page.getByRole('link',{name:'All games',exact:false}).click();
  await expect(page).toHaveTitle('MIS Class Games · Choose your next adventure');
  expect(await page.evaluate(()=>localStorage.getItem('midnight-museum-v2'))).toBe(save);
  await page.clock.fastForward(60000);
  await page.getByRole('link',{name:'Explore game',exact:true}).click();
  await expect(page.locator('#enterBtn')).toHaveText('Continue your rescue →');
  await page.locator('#enterBtn').click();
  await expect(page.locator('#clock')).toHaveText('19:00');
  await expect(page.locator('#clockMultiplesA')).toHaveValue('9, 18, 27, 36');
  await expect(page.locator('#value1')).toHaveValue('36');
});

test('a save already present on the origin is restored at the museum address',async({page})=>{
  await page.goto('/');
  await page.evaluate(()=>localStorage.setItem('midnight-museum-v2',JSON.stringify({
    index:1,code:['6'],remaining:1200,running:true,deadline:Date.now()+1200000,
    lives:4,started:true,won:false,selected:{},inspected:[],answers:{value2a:'8'},
    jars:[0,1,2],roomFlow:{room:1,stage:'search',part:0}
  })));
  await page.getByRole('link',{name:'Explore game',exact:true}).click();
  await page.locator('#enterBtn').click();
  await expect(page.locator('#title')).toHaveText('The Potion of Proportions');
  await expect(page.locator('#codeSoFar')).toHaveText('6');
  await expect(page.locator('#lives')).toHaveText('4 / 5 lives');
});

test('hub still opens the museum when browser storage is unavailable',async({page})=>{
  await page.addInitScript(()=>{
    Storage.prototype.getItem=Storage.prototype.setItem=()=>{throw new Error('Storage unavailable');};
  });
  await page.goto('/');
  await page.getByRole('link',{name:'Explore game',exact:true}).click();
  await expect(page.locator('#home')).toBeVisible();
  await page.locator('#enterBtn').click();await skipCutscene(page);
  await expect(page.locator('#title')).toHaveText('The Clockmaker’s Secret');
});

for(const viewport of [{width:1024,height:600},{width:375,height:812}])test(`the playable adventure is in the first viewport (${viewport.width}px)`,async({page})=>{
  await page.setViewportSize(viewport);await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  for(const selector of ['.game-art img','.game-title','.game-card .button']){
    const box=await page.locator(selector).boundingBox();
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y+box.height,selector+' should not require scrolling').toBeLessThanOrEqual(viewport.height);
  }
});

test('fonts load locally and reduced motion disables the cover transition',async({page})=>{
  const fonts=[];page.on('request',request=>{if(request.resourceType()==='font')fonts.push(request.url());});
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  expect(await page.evaluate(()=>document.fonts.check('600 30px Fraunces')&&document.fonts.check('400 16px "DM Sans"'))).toBe(true);
  expect(fonts).toHaveLength(2);
  expect(fonts.every(url=>url.startsWith('http://127.0.0.1:4173/assets/fonts/'))).toBe(true);
  await expect(page.locator('.game-art img')).toHaveCSS('transition-duration','0s');
});

test('returning visitors bypass the old unversioned hub assets',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/hub.js',route=>route.fulfill({contentType:'text/javascript',body:"throw new Error('Stale hub script');"}));
  await page.route('**/styles.css',route=>route.fulfill({contentType:'text/css',body:'body { display: none; }'}));
  await page.goto('/');
  await expect(page.locator('.game-card')).toBeVisible();
  await page.getByRole('link',{name:'Explore game',exact:true}).click();
  await expect(page.locator('#home')).toBeVisible();
  expect(errors).toEqual([]);
});
