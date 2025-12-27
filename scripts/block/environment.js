const item = require('vne/item')
const liquid = require('vne/liquid')
const status = require('vne/status')

Attribute.add("biomass");
Attribute.add("arkycite");
Attribute.add("ammonia");

//arkycite
Blocks.arkyicStone.attributes.set(Attribute.get("biomass"), 0.05)
Blocks.arkyicStone.attributes.set(Attribute.get("arkycite"), 1.5)

//neoplasm
Blocks.redStone.attributes.set(Attribute.get("biomass"), 0.06);
Blocks.redStone.attributes.set(Attribute.get("arkycite"), 1);
Blocks.denseRedStone.attributes.set(Attribute.get("biomass"), 0.07);
Blocks.denseRedStone.attributes.set(Attribute.get("arkycite"), 1.1);

const neoplasmWall = new StaticWall("neoplasm-wall");

const neoplasmStone = new Floor("neoplasm-stone");
neoplasmStone.variants = 5;

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
neoplasmSand.attributes.set(Attribute.get("biomass"), 0.08);
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