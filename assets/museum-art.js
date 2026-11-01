/* Original MIS artwork. Classic scripts and inline SVG also work from an offline ZIP. */
const MuseumArt = (() => {
  const colours = { navy: '#25354a', night: '#19283a', cream: '#f7f3e8', amber: '#f2a444', mint: '#72b8a5', coral: '#e87262', lilac: '#8a83c7' };
  const props = {
    clock: '<circle cx="60" cy="61" r="44" fill="#f7f3e8" stroke="#f2a444" stroke-width="7"/><path d="M60 33V61L79 75" fill="none" stroke="#25354a" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="61" r="4" fill="#25354a"/>',
    ghost: '<path d="M30 61C30 16 91 16 91 61V111L77 101L63 113L49 101L30 111Z" fill="#f7f3e8" stroke="#25354a" stroke-width="3"/><path d="M31 68L17 56M90 68L104 55" stroke="#f7f3e8" stroke-width="9" stroke-linecap="round"/><path d="M48 58V65M73 58V65M54 78Q61 83 68 77" stroke="#25354a" stroke-width="4" stroke-linecap="round"/>',
    book: '<path d="M13 24Q36 13 60 25Q84 13 107 24V105Q83 94 60 106Q36 94 13 105Z" fill="#f7f3e8" stroke="#f2a444" stroke-width="4"/><path d="M60 25V105M26 40H46M26 53H46M26 66H42M75 40H94M75 53H94M75 66H91" stroke="#566173" stroke-width="3"/>',
    frame: '<rect x="19" y="9" width="82" height="108" rx="3" fill="#f2a444" stroke="#25354a" stroke-width="3"/><path d="M28 18H92V107H28Z" fill="#72b8a5"/><circle cx="60" cy="47" r="16" fill="#f7f3e8"/><path d="M38 94V86Q41 63 60 63Q79 63 82 86V94" fill="#25354a"/><path d="M24 14L32 22M96 14L88 22M24 112L32 104M96 112L88 104" stroke="#f7f3e8" stroke-width="2"/>',
    robot: '<path d="M38 83L27 112M84 83L96 112M60 23V10" stroke="#72b8a5" stroke-width="8" stroke-linecap="round"/><rect x="23" y="24" width="74" height="61" rx="10" fill="#a6babf" stroke="#25354a" stroke-width="3"/><path d="M34 38H86V63H34Z" fill="#25354a"/><circle cx="46" cy="51" r="5" fill="#f2a444"/><circle cx="74" cy="51" r="5" fill="#f2a444"/><path d="M44 74H76" stroke="#25354a" stroke-width="3"/><circle cx="60" cy="10" r="5" fill="#e87262"/>',
    cabinet: '<path d="M27 9H94L103 29V115H17V47L27 36Z" fill="#72b8a5" stroke="#25354a" stroke-width="3"/><path d="M31 28H87V72H31Z" fill="#19283a"/><path d="M41 57H51V41H69V52H79" fill="none" stroke="#f2a444" stroke-width="5"/><path d="M25 85H95" stroke="#25354a" stroke-width="3"/><circle cx="73" cy="97" r="5" fill="#e87262"/><path d="M40 96V108M35 96H45" stroke="#25354a" stroke-width="4"/>',
    flask: '<path d="M44 10H77V22H70V47L101 102Q108 115 92 115H29Q13 115 20 102L51 47V22H44Z" fill="#f7f3e8" fill-opacity=".12" stroke="#f7f3e8" stroke-width="4"/><path d="M36 83H85L101 108Q102 112 92 112H29Q19 112 22 108Z" fill="#8a83c7"/><circle cx="51" cy="91" r="5" fill="#f7f3e8"/><circle cx="73" cy="103" r="3" fill="#f7f3e8"/>',
    jar: '<path d="M37 21H83V31H37Z" fill="#f2a444" stroke="#25354a" stroke-width="3"/><path d="M42 31V39L29 50V107Q29 115 38 115H82Q91 115 91 107V50L78 39V31Z" fill="#f7f3e8" stroke="#25354a" stroke-width="3"/><path class="jar-liquid" d="M33 76H87V107Q87 111 80 111H40Q33 111 33 107Z" fill="#8a83c7"/><path d="M41 56V68" stroke="#b7c7c3" stroke-width="4" stroke-linecap="round"/>',
    drawer: '<rect x="11" y="43" width="98" height="65" rx="4" fill="#8d6651" stroke="#f2a444" stroke-width="3"/><rect x="22" y="55" width="76" height="41" rx="2" fill="#25354a" stroke="#c9a576" stroke-width="2"/><path d="M47 74H73" stroke="#f2a444" stroke-width="5" stroke-linecap="round"/>',
    letter: '<path d="M23 11H83L100 29V113H23Z" fill="#f7f3e8" stroke="#d7b98a" stroke-width="3"/><path d="M83 11V29H100M36 42H84M36 55H84M36 68H72M36 81H79" fill="none" stroke="#566173" stroke-width="3"/><circle cx="82" cy="97" r="9" fill="#e87262"/>',
    newspaper: '<path d="M16 20H99V109H16Z" fill="#f7f3e8" stroke="#25354a" stroke-width="3"/><path d="M28 33H86M28 43H86" stroke="#25354a" stroke-width="5"/><path d="M28 58H50V82H28Z" fill="#8a83c7"/><path d="M61 59H85M61 70H85M61 81H85M28 94H85" stroke="#566173" stroke-width="3"/>',
    camera: '<rect x="12" y="34" width="96" height="67" rx="8" fill="#a6babf" stroke="#25354a" stroke-width="3"/><path d="M29 34V23H50V34" fill="#a6babf" stroke="#25354a" stroke-width="3"/><circle cx="68" cy="68" r="25" fill="#25354a" stroke="#72b8a5" stroke-width="4"/><circle cx="68" cy="68" r="13" fill="#526b87"/><circle cx="31" cy="49" r="5" fill="#e87262"/>',
    toolbox: '<rect x="16" y="44" width="88" height="62" rx="5" fill="#e87262" stroke="#25354a" stroke-width="3"/><path d="M42 44V29H77V44M16 69H104M54 65H67V79H54Z" fill="none" stroke="#25354a" stroke-width="4"/>',
    key: '<circle cx="42" cy="45" r="23" fill="#f2a444" stroke="#25354a" stroke-width="4"/><circle cx="42" cy="45" r="8" fill="#25354a"/><path d="M58 62L98 102M83 86L96 74M95 99L108 87" stroke="#f2a444" stroke-width="12" stroke-linejoin="round"/>',
    shield: '<path d="M60 11L102 29V65Q97 95 60 115Q23 95 18 65V29Z" fill="#72b8a5" stroke="#25354a" stroke-width="4"/><path d="M38 61L54 77L84 44" fill="none" stroke="#25354a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>',
    door: '<path d="M25 115V54A35 35 0 0 1 95 54V115Z" fill="#f2a444" stroke="#25354a" stroke-width="4"/><path d="M35 115V55A25 25 0 0 1 85 55V115" fill="#25354a"/><circle cx="74" cy="78" r="4" fill="#f2a444"/>',
    trophy: '<path d="M34 17H87V48Q87 78 60 80Q34 78 34 48Z" fill="#f2a444" stroke="#25354a" stroke-width="3"/><path d="M34 27H16V39Q16 62 37 63M87 27H105V39Q105 62 83 63M60 80V103M38 112H82V103H38Z" fill="none" stroke="#f2a444" stroke-width="7" stroke-linejoin="round"/>',
    moon: '<path d="M77 13C22 12 11 73 45 100C64 116 92 106 105 84C59 100 38 48 77 13Z" fill="#f2a444" stroke="#25354a" stroke-width="3"/>',
    star: '<path d="M60 10L74 43L110 46L82 70L90 106L60 87L30 106L38 70L10 46L46 43Z" fill="#f2a444" stroke="#25354a" stroke-width="3" stroke-linejoin="round"/>',
    pumpkin: '<path d="M59 32Q65 14 78 16" stroke="#72b8a5" stroke-width="7"/><ellipse cx="39" cy="75" rx="25" ry="35" fill="#e87262"/><ellipse cx="81" cy="75" rx="25" ry="35" fill="#e87262"/><ellipse cx="60" cy="75" rx="25" ry="37" fill="#f2a444" stroke="#25354a" stroke-width="3"/><path d="M43 64L50 57L55 66M66 66L72 57L79 64M44 84Q60 98 78 83" fill="none" stroke="#25354a" stroke-width="4"/>',
    bat: '<path d="M60 50L48 35L44 53Q23 22 9 42Q10 70 21 81Q34 69 48 86Q60 101 72 86Q88 70 100 82Q111 65 111 42Q94 23 77 53L73 35Z" fill="#8a83c7" stroke="#25354a" stroke-width="3"/><path d="M54 64V68M67 64V68" stroke="#f7f3e8" stroke-width="3"/>',
    spider: '<path d="M60 4V46M42 62L22 46L12 52M42 74L14 70L8 83M42 84L21 99L22 111M78 62L98 46L108 52M78 74L106 70L112 83M78 84L99 99L98 111" fill="none" stroke="#f2a444" stroke-width="5" stroke-linecap="round"/><ellipse cx="60" cy="77" rx="23" ry="28" fill="#8a83c7" stroke="#25354a" stroke-width="3"/><circle cx="53" cy="65" r="4" fill="#f7f3e8"/><circle cx="67" cy="65" r="4" fill="#f7f3e8"/>',
    firefly: '<ellipse cx="38" cy="51" rx="23" ry="15" transform="rotate(35 38 51)" fill="#a9d5c7"/><ellipse cx="81" cy="51" rx="23" ry="15" transform="rotate(-35 81 51)" fill="#a9d5c7"/><ellipse cx="60" cy="78" rx="15" ry="25" fill="#f2a444" stroke="#25354a" stroke-width="3"/><circle cx="60" cy="49" r="13" fill="#25354a"/><path d="M54 38L48 27M65 38L72 27" stroke="#25354a" stroke-width="3" stroke-linecap="round"/>',
  };
  const roomKeys = ['clock', 'flask', 'camera', 'robot', 'letter', 'cabinet'];
  function prop(name) { return props[name] || props.key; }
  function icon(name, className = '') {
    return `<svg class="art-icon ${className}" viewBox="0 0 120 125" aria-hidden="true" focusable="false">${prop(name)}</svg>`;
  }
  function background(room) {
    const accent = [colours.amber, colours.lilac, colours.coral, colours.mint, colours.amber, colours.mint][room];
    const wall = ['#2d4056', '#30434f', '#354357', '#2a414e', '#384354', '#293b50'][room];
    const gears = [[158,90,42],[220,110,27],[800,97,36]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#a98656" stroke-width="8"/><circle cx="${x}" cy="${y}" r="${r/3}" fill="none" stroke="#a98656" stroke-width="4"/>`).join('');
    const details = [
      `${gears}<path d="M90 170H285M741 159H920" stroke="#8c7762" stroke-width="8"/><path d="M105 200H125V325H105ZM873 198H891V325H873Z" fill="#6c7c84"/><path d="M107 245H123M875 261H889" stroke="#f2a444" stroke-width="3"/>`,
      '<path d="M72 147H300M718 148H932" stroke="#8d7967" stroke-width="10"/><path d="M96 105V138H126V105M161 86V138H190V86M227 112V138H261V112M758 99V138H792V99M846 81V138H872V81" fill="#8a83c7" stroke="#bac8ca" stroke-width="3"/><path d="M91 275H286M736 270H923" stroke="#72b8a5" stroke-width="2" stroke-dasharray="8 8"/>',
      '<path d="M83 63H297V194H83ZM724 63H926V194H724Z" fill="#ba9160"/><path d="M95 75H285V182H95ZM736 75H914V182H736Z" fill="#25354a"/><path d="M110 165L153 92L197 150L235 111L271 166Z" fill="#8a83c7"/><circle cx="794" cy="111" r="21" fill="#e87262"/><path d="M749 167L788 140L825 164L885 97V170Z" fill="#72b8a5"/>',
      '<path d="M80 62H310V197H80Z" fill="#223646" stroke="#72b8a5" stroke-width="2"/><path d="M95 87H294M95 112H294M95 137H294M95 162H294M119 75V182M153 75V182M187 75V182M221 75V182M255 75V182" stroke="#486775"/><path d="M780 112H904V135H780ZM800 135V214M886 135V214" fill="#a6babf" stroke="#a6babf" stroke-width="8"/><path d="M727 263H920" stroke="#f2a444" stroke-width="2" stroke-dasharray="5 8"/>',
      '<path d="M67 62H302V210H67ZM722 62H934V210H722Z" fill="#1e3044" stroke="#8d7967" stroke-width="5"/><path d="M77 137H292M732 137H924" stroke="#8d7967" stroke-width="5"/><path d="M92 79V130M115 85V130M141 74V130M170 89V130M210 82V130M244 76V130M266 89V130M750 81V130M780 74V130M811 86V130M847 75V130M882 88V130M905 81V130" stroke="#a9b4b1" stroke-width="12"/><path d="M92 155V199M121 147V199M166 157V199M200 150V199M244 152V199M756 151V199M790 148V199M833 157V199M875 150V199M902 147V199" stroke="#bc9276" stroke-width="14"/>',
      '<path d="M76 80H295V188H76ZM728 80H925V188H728Z" fill="#19283a" stroke="#72b8a5" stroke-width="3"/><path d="M100 159H132V110H166V143H207V105H271M752 158H791V110H830V142H865V104H900" fill="none" stroke="#f2a444" stroke-width="8"/><circle cx="108" cy="244" r="14" fill="#e87262"/><circle cx="155" cy="244" r="14" fill="#72b8a5"/><circle cx="845" cy="244" r="14" fill="#8a83c7"/><circle cx="891" cy="244" r="14" fill="#f2a444"/>',
    ][room];
    return `<svg class="scene-backdrop" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><path d="M0 0H1000V500H0Z" fill="${wall}"/><path d="M0 355H1000V500H0Z" fill="#19283a"/><path d="M0 355H1000M0 500L400 355M1000 500L600 355M500 355V500M0 425H1000" stroke="#4b5b6c" stroke-width="2"/>${details}<path d="M410 208V91A90 90 0 0 1 590 91V208Z" fill="#19283a" stroke="#a6babf" stroke-width="8"/><circle cx="548" cy="76" r="25" fill="#e9d3a5"/><path d="M500 7V208M411 117H589" stroke="#a6babf" stroke-width="5"/><path d="M433 232H567" stroke="${accent}" stroke-width="3"/><path d="M78 330H922V351H78Z" fill="#a37d5d"/><path d="M110 351V449M891 351V449" stroke="#755840" stroke-width="20"/></svg>`;
  }
  function cover() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" fill="none"><path d="M0 0H960V600H0Z" fill="#25354a"/><path d="M0 448H960V600H0Z" fill="#19283a"/><path d="M0 448H960M0 600L380 448M960 600L580 448M260 600L420 448M700 600L540 448M0 516H960" stroke="#526173" stroke-width="2"/><path d="M48 0V448M912 0V448" stroke="#526173" stroke-width="2"/><path d="M94 211V131A75 75 0 0 1 244 131V211Z" fill="#19283a" stroke="#a6babf" stroke-width="8"/><circle cx="200" cy="112" r="27" fill="#e9d3a5"/><path d="M169 56V211M94 147H244" stroke="#a6babf" stroke-width="5"/><path d="M113 262H231M131 280H214" stroke="#72b8a5" stroke-width="3"/><path d="M371 448V190A109 109 0 0 1 589 190V448Z" fill="#172639" stroke="#c9a576" stroke-width="13"/><path d="M390 448V190A90 90 0 0 1 570 190V448Z" fill="#34495a"/><path d="M480 100V448M397 205H563" stroke="#9a7e60" stroke-width="3"/><circle cx="550" cy="309" r="5" fill="#f2a444"/><path d="M413 230H464V367H413ZM496 230H548V367H496Z" stroke="#65717b" stroke-width="2"/><path d="M330 448H630V462H330ZM305 462H655V477H305Z" fill="#a37d5d"/><path d="M285 59H329M307 37V81M638 109H662M650 97V121" stroke="#f2a444" stroke-width="3"/><rect x="688" y="94" width="175" height="237" rx="3" fill="#c9a576"/><path d="M700 107H851V318H700Z" fill="#19283a"/><path d="M711 118H840V307H711Z" fill="#465a68"/><g transform="translate(719 155) scale(.94)">${props.ghost}</g><path d="M720 367H834V380H720ZM738 380V451M817 380V451" stroke="#a37d5d" stroke-width="9"/><g transform="translate(121 317) scale(.7)">${props.flask}</g><path d="M89 408H252V423H89ZM109 423V490M234 423V490" fill="#a37d5d" stroke="#a37d5d" stroke-width="6"/><g transform="translate(610 354) rotate(-19) scale(.63)">${props.key}</g><path d="M272 526Q350 495 391 496" stroke="#72b8a5" stroke-width="2" stroke-dasharray="5 8"/><circle cx="277" cy="521" r="4" fill="#72b8a5"/><path d="M698 49L705 63L720 65L708 76L711 91L698 83L685 91L688 76L677 65L691 63Z" fill="#f2a444"/><circle cx="80" cy="311" r="3" fill="#72b8a5"/><circle cx="875" cy="389" r="3" fill="#e87262"/></svg>`;
  }
  function mount() {
    document.querySelectorAll('[data-art]').forEach(element => {
      element.innerHTML = icon(element.dataset.art);
      element.setAttribute('aria-hidden', 'true');
    });
  }
  function replaceSymbols(root) {
    const symbols = new Map([
      ['\u{1f47b}', 'ghost'], ['\u{1f5bc}\ufe0f', 'frame'], ['\u{1f4f8}', 'camera'],
      ['\u{1f559}', 'clock'], ['\u{1f55b}', 'clock'], ['\u{1fad9}', 'jar'],
    ]);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const replacements = [];
    while (walker.nextNode()) {
      const name = symbols.get(walker.currentNode.textContent.trim());
      if (name) replacements.push([walker.currentNode, name]);
    }
    replacements.forEach(([node, name]) => {
      const template = document.createElement('template');
      template.innerHTML = icon(name);
      node.replaceWith(template.content);
    });
  }
  return { icon, prop, background, cover, roomKeys, mount, replaceSymbols };
})();
