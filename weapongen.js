/* ---------- CONSTANT DATA ------------------------------------------------- */
const tagData = {
  // skill / characteristic tags
  "Quick":          {cat:"skill",   tip:"Speed is a weapon skill for this weapon."},
  "Ergonomic":      {cat:"skill",   tip:"Precision is a weapon skill for this weapon."},
  "Unruly":         {cat:"skill",   tip:"Might is a weapon skill for this weapon."},
  "Technical":      {cat:"skill",   tip:"Tech is a weapon skill for this weapon."},
  "Scoped":         {cat:"skill",   tip:"Awareness is a weapon Skill for this weapon."},
  "Multipurpose":   {cat:"utility", tip:"Useful as a tool outside combat; treat as an item."},

  // range tags (mutually exclusive)
  "Melee":          {cat:"range",   tip:"Attack targets in your zone."},
  "Near-range":     {cat:"range",   tip:"Attack same or adjacent zone; step down a die at same zone."},
  "Long-range":     {cat:"range",   tip:"Attack up to 3 zones; step down all dice at same zone."},
  "Far-range":      {cat:"range",   tip:"Attack any visible target; step down all dice at same zone."},

  // ammo / firing economy
  "Ammo":           {cat:"utility", tip:"Complication may force extra shots and expend 1 ammo."},
  "Loading":        {cat:"utility", tip:"Must expend 1 ammo to attack; complications may expend more."},
  "Energized":      {cat:"utility", tip:"Uses no ammo; may overheat on complications."},
  "Missile":        {cat:"utility", tip:"Uses special missile ammo; implies Loading; can hit starships."},
  "Ammo-Optimizer": {cat:"utility", tip:"50% chance to not consume ammo when it would."},

  // normal utility / damage mods
  "Throwable":      {cat:"utility", tip:"Can be thrown; gains Near-range tag while thrown."},
  "Forceful":       {cat:"utility", tip:"Pushes target 5 ft on hit; you may be pushed on complication."},
  "Cycling":        {cat:"damage",  tip:"Expend 1 ammo when you damage to step up all dice."},
  "Consistent":     {cat:"damage",  tip:"Re-roll one ‘1’ when you damage."},
  "Potent":         {cat:"damageP", tip:"When you damage, add extra weapon dice."},
  "Piercing":       {cat:"damageP", tip:"Ignores damage reduction equal to parameter."},
  "Accurate":       {cat:"damageP", tip:"When you damage, step up parameter dice."},

  // area / control
  "Covering":       {cat:"damageP", tip:"Targets & nearby allies step down next ranged attack dice."},
  "Shredding":      {cat:"damageP", tip:"Remove smallest armor dice from defender's pool."},
  "Suppressed":     {cat:"utility", tip:"Weapon is quiet; unheard beyond 2 zones or through doors."},
  "Explosive":      {cat:"utility", tip:"Contest vs each creature in zone; damage all that fail."},
  "Brutal":         {cat:"utility", tip:"On hit, also damage nearest creature to target."},
  "Volatile":       {cat:"utility", tip:"Step up attack die; you take rolled weapon die as self-damage."},
  "Violent":        {cat:"damageP", tip:"Count extra dice when totaling damage."},

  // consumable
  "Consumable":     {cat:"utility", tip:"Single-use; destroyed on activation."}
};

/* ------------- UTILITY HELPERS ------------------------------------------- */
function rand(min, max){return Math.floor(Math.random()*(max-min+1))+min;}
function weightedRandom(arr){
  let total=arr.reduce((s,o)=>s+o.weight,0), r=Math.random()*total;
  for(const o of arr){if(r<o.weight)return o.value!==undefined?o.value:o; r-=o.weight;}
}

/* ----------- BASE WEAPONS & ARCHETYPES ----------------------------------- */
const baseWeapons = [
  {type:"Rifle",    range:"Long-range", skill:["Ergonomic","Scoped"],   extra:{tag:"Piercing",param:true}},
  {type:"Handgun",  range:"Near-range", skill:["Quick","Ergonomic"]},
  {type:"Shotgun",  range:"Near-range", skill:["Unruly","Quick"]},
  {type:"Blade",    range:"Melee",      skill:["Ergonomic","Quick"]},
  {type:"Bludgeon", range:"Melee",      skill:["Quick","Unruly"]},
  {type:"Tesla",    range:"Near-range", skill:["Technical","Unruly"]},
  {type:"Repeater", range:"Long-range", skill:["Ergonomic","Technical"]},

  /* special archetype: Grenade */
  {type:"Grenade",  range:"Near-range", skill:["Throwable"], preset:["Explosive","Consumable 1"]}
];

/* ------------- TAG TABLES ------------------------------------------------ */
const normalTags = [
  {tag:"Throwable",   weight:10},
  {tag:"Forceful",    weight: 9},
  {tag:"Energized",   weight: 7, conflicts:["Ammo","Loading","Missile","Ammo-Optimizer"]},
  {tag:"Loading",     weight: 9, conflicts:["Energized"]},
  {tag:"Piercing",    weight: 8, param:true},
  {tag:"Cycling",     weight: 8, conflicts:["Energized"]},
  {tag:"Accurate",    weight: 8, param:true},
  {tag:"Potent",      weight: 6, param:true},
  {tag:"Consistent",  weight: 9},
  {tag:"Consumable",  weight: 4,  param:true}
];

const rareTags = [
  {tag:"Missile",         weight: 4, conflicts:["Energized","Ammo-Optimizer"], implies:["Loading"]},
  {tag:"Ammo-Optimizer",  weight: 3, conflicts:["Energized","Missile"], requires:["Ammo","Loading"]},
  {tag:"Volatile",        weight: 2},
  {tag:"Shredding",       weight: 2, param:true},
  {tag:"Covering",        weight: 2, param:true},
  {tag:"Suppressed",      weight: 3},
  {tag:"Explosive",       weight: 2},
  {tag:"Brutal",          weight: 2},
  {tag:"Violent",         weight: 2, param:true},
  {tag:"Far-range",       weight: 4} // far-range set here; weight lower than others
];

/* ------------ NAME GENERATION ------------------------------------------- */
const pfx=["Nova","Stellar","Nebula","Celestial","Hyper","Astral","Eclipse","Zenith","Blitz","Quantum","Ion","Pulsar","Comet","Fusion","Warp","Quasar","Horizon","Vector","Singularity","Aegis","Crimson","Obsidian","Aurora","Chrome"];
const core=["Viper","Raven","Phantom","Specter","Marauder","Stryker","Vanguard","Oracle","Wraith","Tempest","Nemesis","Raptor","Harbinger","Predator","Centurion","Vortex","Sentinel","Reaver","Scythe","Drifter","Gladiator","Interceptor","Phalanx","Corsair","Crusader","Watchman","Bulwark"];
const sfx=["X","Prime","Omega","Zero","Alpha","Delta","MK-II","MK-III","MK-IV","EX","Ultra","Max","Elite","Sigma","Vector","Edge","Pulse","Titan","Torque","Matrix","Echelon","Echo","Nyx","Auric"];
const colors=["Crimson","Ivory","Azure","Emerald","Onyx","Amber","Silver","Cobalt","Vermilion","Viridian"];
const animals=["Falcon","Wolf","Tiger","Dragon","Jackal","Panther","Hawk","Hydra","Mantis","Viper"];
const greek=["Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Theta","Sigma","Omega","Lambda"];
const roman=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"];

function pick(arr){return arr[rand(0,arr.length-1)];}

function nameFromTraits(traits){
  // simple fragment extraction based on common modifiers
  const map={Accurate:"Deadeye",Piercing:"Penetrator",Forceful:"Ram",Explosive:"Burst",Suppress:"Ghost",Energized:"Pulse",Quick:"Swift",Scoped:"Longshot"};
  const matches=traits.map(t=>map[t.split(" ")[0]]).filter(Boolean);
  return matches.length?pick(matches):"";
}
function generateName(w){
  const frag=nameFromTraits(w.tags);
  const pattern=rand(1,8); // 8 distinct schemes
  switch(pattern){
    case 1: return `${pick(pfx)} ${frag?frag+" ":""}${pick(core)} ${pick(roman)}`;
    case 2: return `${colors[rand(0,colors.length-1)]} ${animals[rand(0,animals.length-1)]} ${pick(sfx)}`;
    case 3: return `${pick(core)}-${rand(100,999)}/${rand(10,99)}`;
    case 4: return `Project “${pick(core)}”`;
    case 5: return `${pick(pfx)}-${pick(core)} Series ${rand(1,7)}`;
    case 6: return `${pick(core)} of the ${pick(sfx)} ${pick(pfx)}`;
    case 7: return `${pick(colors)} ${frag?frag+" ":""}${w.baseType} Mk-${rand(2,7)}`;
    default:return `${pick(pfx)} ${w.baseType} ${pick(sfx)}`;
  }
}

/* ------------- TAG SELECTION ENGINE ------------------------------------- */
function getRandomParameter(){
  const dist=[{value:1,weight:50},{value:2,weight:40},{value:3,weight:30},{value:4,weight:20},{value:5,weight:10}];
  return weightedRandom(dist);
}

function chooseTag(pool){
  const choice=weightedRandom(pool);
  const tagObj=typeof choice==="string"?{tag:choice}:choice;
  return {...tagObj}; // clone
}

function buildTagSet(base){
  let set=new Set(base.preset||[]);
  // helper to check presence ignoring param
  const hasTag=(t)=>[...set].some(x=>x.startsWith(t));

  // number of extra tags
  const count=weightedRandom([{value:1,weight:40},{value:2,weight:30},{value:3,weight:20},{value:4,weight:7},{value:5,weight:3}]);

  while(set.size<count+ (base.preset?base.preset.length:0)){
    const pool=Math.random()<5/6?normalTags:rareTags;
    let tagObj=chooseTag(pool);

    // parameter handling
    let tagStr=tagObj.tag + (tagObj.param?(" "+getRandomParameter()):"");

    // conflict checks
    if(tagObj.conflicts && tagObj.conflicts.some(c=>hasTag(c))) continue;
    if(tagObj.requires && !tagObj.requires.some(r=>hasTag(r))) continue;
    if(tagObj.tag==="Ammo-Optimizer" && !(hasTag("Ammo")||hasTag("Loading"))) continue;

    // exclusivity: range tags
    if(tagData[tagObj.tag]?.cat==="range"){
      if(["Melee","Near-range","Long-range","Far-range"].some(r=>hasTag(r))) continue;
    }
    set.add(tagStr);

    // implied tags
    if(tagObj.implies){
      tagObj.implies.forEach(i=>!hasTag(i)&&set.add(i));
    }
  }

  // default Ammo insertion (non-melee)
  if(!base.range.match(/^Melee$/) && !["Energized","Loading","Missile"].some(t=>hasTag(t))){
    set.add("Ammo");
  }

  // ensure a single range tag
  const ranges=[..."Melee Near-range Long-range Far-range".split(" ")].filter(r=>hasTag(r));
  if(ranges.length>1){
    // keep first inserted, remove others
    const keep=ranges[0];
    [...set].forEach(t=>{const root=t.split(" ")[0]; if(root!==keep && ranges.includes(root)) set.delete(t);});
  }

  return [...set];
}

/* ------------- GROUPING FOR DISPLAY ------------------------------------- */
function formatTags(tagArr){
  const groups={skill:[],range:[],damage:[],damageP:[],utility:[]};
  tagArr.forEach(t=>{
    const root=t.split(" ")[0];
    const info=tagData[root]||{cat:"utility"};
    groups[info.cat].push(t);
  });
  return ["skill","range","damage","damageP","utility"]
          .map(k=>groups[k].join(", "))
          .filter(s=>s).join(" | ");
}

/* ------------- WEAPON GENERATION ---------------------------------------- */
function generateWeapon(){
  const base=baseWeapons[rand(0,baseWeapons.length-1)];
  const w={
    baseType:base.type,
    range:base.range,
    skill:[...base.skill],
    tags:[],
    preset:base.preset||[]
  };

  // base extra like Piercing X
  if(base.extra){
    const param=base.extra.param?(" "+getRandomParameter()):"";
    w.preset.push(base.extra.tag+param);
  }

  // build full tag list
  const tagList=[...w.skill,w.range,...buildTagSet(base)];
  w.tags=tagList;

  return {
    name:generateName({tags:tagList,baseType:base.type}),
    damage:`1d${weightedRandom([{value:4,weight:40},{value:6,weight:30},{value:8,weight:20},{value:10,weight:8},{value:12,weight:2}])}`,
    tagDisplay:formatTags(tagList),
    rawTags:tagList
  };
}

/* -------------- RENDERING ----------------------------------------------- */
let verbose=false;
function renderWeapon(w){
  if(!verbose){
    return `<div class="weapon-line"><strong>${w.name}</strong> | ${w.damage} | ${
      w.rawTags.map(t=>{
        const root=t.split(" ")[0];
        const tip=tagData[root]?.tip||"";
        return `<span class="tag" data-tip="${tip}">${t}</span>`;
      }).join(", ")
    }</div>`;
  }
  // verbose block format
  return `<div class="weapon-item">
            <div class="weapon-name">${w.name}</div>
            <div class="weapon-stats">
              <strong>Damage:</strong> ${w.damage}<br>
              <strong>Traits:</strong> ${
                w.rawTags.map(t=>{
                  const root=t.split(" ")[0];
                  const tip=tagData[root]?.tip||"";
                  return `<span class="tag" data-tip="${tip}">${t}</span>`;
                }).join(", ")
              }
            </div>
          </div>`;
}

function generateWeapons(){
  const count=parseInt(document.getElementById("weaponCount").value);
  document.getElementById("weaponCountDisplay").textContent=count;
  const list=Array.from({length:count},generateWeapon);
  document.getElementById("weaponOutput").innerHTML=list.map(renderWeapon).join("");
}
function toggleView(){
  verbose=!verbose;
  document.querySelector(".toggle-btn").textContent=verbose?"Compact View":"Verbose View";
  generateWeapons();
}

export { generateWeapon };
