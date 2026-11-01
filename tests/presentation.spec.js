const {test,expect}=require('@playwright/test');
const {skipCutscene}=require('./cutscene-helper');

test('the whole illustration fits above its caption in every room and aspect ratio',async({page})=>{
  test.setTimeout(60000);await page.goto('/games/midnight-museum/');
  for(const viewport of [{width:1600,height:900},{width:1366,height:768},{width:1024,height:600},{width:375,height:812}]){
    await page.setViewportSize(viewport);
    for(let room=0;room<6;room++){
      await page.evaluate(room=>{index=room;started=true;inspected=[];activeClue=null;roomFlow={room,stage:'search',part:0};Exploration.reset();render();show('game');},room);
      const geometry=await page.locator('.room-scene').evaluate(scene=>{
        const svg=scene.querySelector('.scene-backdrop'),matrix=svg.getScreenCTM(),rect=scene.getBoundingClientRect(),caption=scene.querySelector('.scene-caption').getBoundingClientRect();
        const corners=[[0,0],[1000,0],[0,500],[1000,500]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(matrix));
        return {left:rect.left,right:rect.right,top:rect.top,captionTop:caption.top,corners:corners.map(p=>({x:p.x,y:p.y})),scaleX:matrix.a,scaleY:matrix.d};
      });
      for(const corner of geometry.corners){
        expect(corner.x,`${viewport.width}px room ${room+1}: drawing cropped on left`).toBeGreaterThanOrEqual(geometry.left);
        expect(corner.x).toBeLessThanOrEqual(geometry.right);
        expect(corner.y,`${viewport.width}px room ${room+1}: drawing cropped on top`).toBeGreaterThanOrEqual(geometry.top);
        expect(corner.y,`${viewport.width}px room ${room+1}: caption covers drawing`).toBeLessThanOrEqual(geometry.captionTop+.5);
      }
      expect(geometry.scaleX).toBeCloseTo(geometry.scaleY,5);
      if(room===1)await page.locator('.room-scene').screenshot({path:`artifacts/full-illustration-${viewport.width}.png`});
    }
  }
});

test('the collected clue table has a visible heading inside its border',async({page})=>{
  await page.setViewportSize({width:1024,height:600});await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);
  await page.locator('.object').first().click();
  const table=page.locator('.clue-table'),heading=table.getByRole('heading',{name:'Clues',exact:true});
  await expect(heading).toBeVisible();await expect(table.locator('button')).toHaveCount(1);
  const geometry=await table.evaluate(table=>{
    const a=table.getBoundingClientRect(),b=table.querySelector('h4').getBoundingClientRect();
    return {top:a.top,bottom:a.bottom,headingTop:b.top,headingBottom:b.bottom};
  });
  expect(geometry.headingTop).toBeGreaterThan(geometry.top);expect(geometry.headingBottom).toBeLessThan(geometry.bottom);
  await page.screenshot({path:'artifacts/clue-table-heading.png'});
});

test('Halloween music plays changing timed notes and stops completely when muted',async({page})=>{
  await page.addInitScript(()=>{
    window.__musicNotes=[];
    const create=AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator=function(){
      const oscillator=create.call(this),start=oscillator.start.bind(oscillator),stop=oscillator.stop.bind(oscillator);let note;
      oscillator.start=(time=0)=>{note={frequency:oscillator.frequency.value,type:oscillator.type,start:time,stop:null};window.__musicNotes.push(note);start(time);};
      oscillator.stop=(time=0)=>{if(note)note.stop=time;stop(time);};
      return oscillator;
    };
  });
  await page.goto('/games/midnight-museum/');await page.locator('#enterBtn').click();await skipCutscene(page);
  expect(await page.evaluate(()=>MuseumAudio.status().contextState)).toBe('not-created');
  await page.locator('#musicToggle').click();
  await expect.poll(()=>page.evaluate(()=>window.__musicNotes.length)).toBeGreaterThan(18);
  const notes=await page.evaluate(()=>window.__musicNotes);
  expect(new Set(notes.map(n=>Math.round(n.frequency))).size).toBeGreaterThan(6);
  expect(new Set(notes.map(n=>n.start)).size).toBeGreaterThan(3);
  expect(notes.some(n=>n.type==='triangle')).toBe(true);
  expect(notes.some(n=>Math.abs(n.frequency-830.609)<.1)).toBe(true);
  expect(notes.every(n=>n.stop>n.start&&n.stop-n.start<1)).toBe(true);
  await page.locator('#musicToggle').click();
  expect(await page.evaluate(()=>MuseumAudio.status().musicVoices)).toBe(0);
  const count=await page.evaluate(()=>window.__musicNotes.length);
  await page.waitForTimeout(400);
  expect(await page.evaluate(()=>window.__musicNotes.length)).toBe(count);
});
