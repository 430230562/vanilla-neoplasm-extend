const item = require('vne/item')
const liquid = require('vne/liquid')
const status = require('vne/status')

Attribute.add("ammonia");//氨气
Attribute.add("biomass");//生物质
Attribute.add("floor-sand");//地面沙

//地面挖沙机
Blocks.stone.attributes.set(Attribute.get("floor-sand"), 1);
Blocks.hotrock.attributes.set(Attribute.get("floor-sand"), 2);
Blocks.magmarock.attributes.set(Attribute.get("floor-sand"), 2);
Blocks.basalt.attributes.set(Attribute.get("floor-sand"), 2);
Blocks.darksandWater.attributes.set(Attribute.get("floor-sand"), 2);
Blocks.darksandTaintedWater.attributes.set(Attribute.get("floor-sand"), 2);
Blocks.regolith.attributes.set(Attribute.get("floor-sand"), 1);
Blocks.yellowStone.attributes.set(Attribute.get("floor-sand"), 1.5);
Blocks.slag.attributes.set(Attribute.get("floor-sand"), 1.5);
Blocks.yellowStonePlates.attributes.set(Attribute.get("floor-sand"), 1.5);
Blocks.rhyolite.attributes.set(Attribute.get("floor-sand"), 1);
Blocks.rhyoliteCrater.attributes.set(Attribute.get("floor-sand"), 1);
Blocks.roughRhyolite.attributes.set(Attribute.get("floor-sand"), 1);
Blocks.carbonStone.attributes.set(Attribute.get("floor-sand"), 0.7);
Blocks.ferricStone.attributes.set(Attribute.get("floor-sand"), 0.5);
Blocks.beryllicStone.attributes.set(Attribute.get("floor-sand"), 1.2);
Blocks.redStone.attributes.set(Attribute.get("floor-sand"), 1.5);
Blocks.denseRedStone.attributes.set(Attribute.get("floor-sand"), 1.5);
Blocks.sandWater.attributes.set(Attribute.get("floor-sand"), 2);
Blocks.water.attributes.set(Attribute.get("floor-sand"), 2);
Blocks.deepwater.attributes.set(Attribute.get("floor-sand"), 2);
Blocks.sand.attributes.set(Attribute.get("floor-sand"), 2);

//arkycite
Blocks.arkyicStone.attributes.set(Attribute.get("biomass"), 0.5)

//盐水
const brineFloorShallow = new Floor("brine-floor-shallow");
exports.brineFloorShallow = brineFloorShallow;
Object.assign(brineFloorShallow,{
    speedMultiplier: 0.8,
	variants: 0,
	status: StatusEffects.wet,
	statusDuration: 60,
	liquidDrop: liquid.brine,
	isLiquid: true,
	cacheLayer: CacheLayer.water,
	supportsOverlay: true,
	liquidMultiplier: 0.75,
})

const brineFloor = new Floor("brine-floor");
exports.brineFloor = brineFloor;
Object.assign(brineFloor,{
    speedMultiplier: 0.5,
	variants: 0,
	status: StatusEffects.wet,
	statusDuration: 90,
	liquidDrop: liquid.brine,
	isLiquid: true,
	cacheLayer: CacheLayer.water,
	supportsOverlay: true,
	liquidMultiplier: 1,
})

const brineFloorDeep = new Floor("brine-floor-deep");
exports.brineFloorDeep = brineFloorDeep;
Object.assign(brineFloorDeep,{
    speedMultiplier: 0.2,
	variants: 0,
	status: StatusEffects.wet,
	statusDuration: 120,
	liquidDrop: liquid.brine,
	isLiquid: true,
	cacheLayer: CacheLayer.water,
	supportsOverlay: true,
	liquidMultiplier: 1.5,
	drownTime:240
})

//草
const redGrassWall = new StaticWall("red-grass-wall");

const redGrass = new Floor("red-grass");
redGrass.attributes.set(Attribute.water, 0.1);

const yellowGrassWall = new StaticWall("yellow-grass-wall");

const yellowGrass = new Floor("yellow-grass");
yellowGrass.attributes.set(Attribute.water, 0.1);

const flower = new Prop("flower");
Object.assign(flower,{
	variants: 6,
	hasShadow: false,
})

const darkSalt = new Floor("dark-salt");
darkSalt.variants = 0;

//neoplasm
Blocks.redStone.attributes.set(Attribute.get("biomass"), 0.75);
Blocks.denseRedStone.attributes.set(Attribute.get("biomass"), 0.75);

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

new OreBlock("ore-nickel",item.nickel);//2
new OreBlock("ore-manganese",item.manganese);//3
//new OreBlock("ore-chromium", item.chromium);//4
//new OreBlock("ore-iridium",item.iridium);//5