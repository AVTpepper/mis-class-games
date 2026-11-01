const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {execFileSync}=require('node:child_process');
const {skipCutscene}=require('./cutscene-helper');

test('the packaged ZIP opens offline and links between the hub and museum',async({page})=>{
  test.skip(process.platform!=='win32','The offline packaging helper uses PowerShell on Windows.');
  test.setTimeout(60000);
  const root=path.resolve(__dirname,'..');
  execFileSync('powershell.exe',['-NoProfile','-File',path.join(root,'scripts','package.ps1')],{cwd:root});
  const archive=path.join(root,'artifacts','mis-class-games.zip');
  const archiveEnv={...process.env,MIS_TEST_ARCHIVE:archive};
  const entries=JSON.parse(execFileSync('powershell.exe',['-NoProfile','-Command',
    'Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip = [System.IO.Compression.ZipFile]::OpenRead($env:MIS_TEST_ARCHIVE); try { ConvertTo-Json -InputObject @($zip.Entries | ForEach-Object { $_.FullName }) -Compress } finally { $zip.Dispose() }',
  ],{env:archiveEnv,encoding:'utf8'}));
  expect(entries).toContain('games/midnight-museum/index.html');
  expect(entries).toContain('assets/midnight-museum.svg');
  expect(entries.some(entry=>entry.includes('\\'))).toBe(false);
  const extracted=fs.mkdtempSync(path.join(root,'artifacts','offline-'));
  execFileSync('powershell.exe',['-NoProfile','-Command','Expand-Archive -LiteralPath $env:MIS_TEST_ARCHIVE -DestinationPath $env:MIS_TEST_EXTRACTED'],{
    env:{...process.env,MIS_TEST_ARCHIVE:archive,MIS_TEST_EXTRACTED:extracted},
  });
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(path.join(extracted,'index.html')).href);
  await expect(page.getByRole('heading',{name:'What will you discover?'})).toBeVisible();
  await expect(page.locator('.game-card')).toHaveCount(1);
  expect(await page.locator('.game-art img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  await page.getByRole('link',{name:'Explore game',exact:true}).click();
  await expect(page.locator('#home')).toBeVisible();
  await page.locator('#enterBtn').click();await skipCutscene(page);
  await expect(page.locator('#title')).toHaveText('The Clockmaker’s Secret');
  await page.getByRole('link',{name:'All games',exact:false}).click();
  await expect(page.locator('.game-card')).toHaveCount(1);
  expect(errors).toEqual([]);
});
