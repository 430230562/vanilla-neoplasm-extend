const item = require('vne/item')
const liquid = require('vne/liquid')
const status = require('vne/status')

Attribute.add("biomass");
Attribute.add("arkycite");
Attribute.add("ammonia");

//地面挖沙机
Blocks.stone.attributes.set(Attribute.sand, 1);
Blocks.hotrock.attributes.set(Attribute.sand, 2);
Blocks.magmarock.attributes.set(Attribute.sand, 2);
Blocks.basalt.attributes.set(Attribute.sand, 2);
Blocks.darksandWater.attributes.set(Attribute.sand, 2);
Blocks.darksandTaintedWater.attributes.set(Attribute.sand, 2);
Blocks.regolith.attributes.set(Attribute.sand, 1);
Blocks.yellowStone.attributes.set(Attribute.sand, 1.5);
Blocks.slag.attributes.set(Attribute.sand, 1.5);
Blocks.yellowStonePlates.attributes.set(Attribute.sand, 1.5);
Blocks.rhyolite.attributes.set(Attribute.sand, 1);
Blocks.rhyoliteCrater.attributes.set(Attribute.sand, 1);
Blocks.roughRhyolite.attributes.set(Attribute.sand, 1);
Blocks.carbonStone.attributes.set(Attribute.sand, 0.7);
Blocks.ferricStone.attributes.set(Attribute.sand, 0.5);
Blocks.beryllicStone.attributes.set(Attribute.sand, 1.2);
Blocks.redStone.attributes.set(Attribute.sand, 1.5);
Blocks.denseRedStone.attributes.set(Attribute.sand, 1.5);
Blocks.sandWater.attributes.set(Attribute.sand, 2);
Blocks.water.attributes.set(Attribute.sand, 2);
Blocks.deepwater.attributes.set(Attribute.sand, 2);
Blocks.sand.attributes.set(Attribute.sand, 2);

//arkycite
Blocks.arkyicStone.attributes.set(Attribute.get("biomass"), 0.5)
Blocks.arkyicStone.attributes.set(Attribute.get("arkycite"), 1.5)

//neoplasm
Blocks.redStone.attributes.set(Attribute.get("biomass"), 0.75);
Blocks.redStone.attributes.set(Attribute.get("arkycite"), 1);
Blocks.denseRedStone.attributes.set(Attribute.get("biomass"), 0.75);
Blocks.denseRedStone.attributes.set(Attribute.get("arkycite"), 1);

const neoplasmWall = new StaticWall("neoplasm-wall");

const neoplasmStone = new Floor("neoplasm-stone");
neoplasmStone.variants = 5;
neoplasmStone.attributes.set(Attribute.get("biomass"), 1.25);
neoplasmStone.attributes.set(Attribute.water, -1);

const neoplasmVent = new SteamVent("neoplasm-vent");
Object.assign(neoplasmVent,{
    parent: neoplasmStone,
    blendGroup: neoplasmStone,
    effectColor: Color.valueOf("57c3c2")
})
neoplasmVent.attributes.set(Attribute.get("ammonia"), 1);

const neoplasmSand = new Floor("neoplasm-sand")
Object.assign(neoplasmSand, {
	itemDrop: Items.sand,
	playerUnmineable: true,
	speedMultiplier: 0.9,
	variants: 3,
})
neoplasmSand.attributes.set(Attribute.get("biomass"), 1.25);
neoplasmSand.attributes.set(Attribute.get("arkycite"), 0.75);
neoplasmSand.attributes.set(Attribute.water, -1);

const neoplasmShallow = new Floor("neoplasm-shallow");
Object.assign(neoplasmShallow, {
	speedMultiplier: 0.75,
	variants: 0,
	status: status.neoplasmSlow,
	statusDuration: 90,
	liquidDrop: Liquids.neoplasm,
	isLiquid: true,
	cacheLayer: CacheLayer.water,
	albedo: 0.9,
	supportsOverlay: true,
	liquidMultiplier: 0.25,
})
neoplasmShallow.attributes.set(Attribute.get("biomass"), 2);

const neoplasm = new Floor("neoplasm");
Object.assign(neoplasm, {
	speedMultiplier: 0.4,
	variants: 0,
	status: status.neoplasmSlow,
	statusDuration: 120,
	liquidDrop: Liquids.neoplasm,
	isLiquid: true,
	cacheLayer: CacheLayer.water,
	albedo: 0.9,
	supportsOverlay: true,
	liquidMultiplier: 0.5,
	damageTaken: 0.375,
})