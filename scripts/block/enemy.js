const insect = require('vne/unit/insect');
const status = require('vne/status');
const item = require('vne/item');
const liquid = require('vne/liquid');
const { Acid } = require('vne/base/bulletType');
const { ToxicAbility } = require("vne/base/ability");
const { Insect } = require("vne/unit/insect");

const UnitPlan = UnitFactory.UnitPlan;
const AssemblerUnitPlan = UnitAssembler.AssemblerUnitPlan;

/*const pulseCrystal = new Block("pulse-crystal");
Object.assign(pulseCrystal,{
    buildVisibility: BuildVisibility.editorOnly,
	category: Category.effect,
	update: true,
	health: 3000,
	armor: 13,
	size: 3,
	solid: true,
	replaceable: false,
	hasShadow: true,
})
pulseCrystal.buildType = prov(() => extend(Building,{
    i:0,
    r:300 + Mathf.range(120),
	updateTile(){
		this.i += Time.delta
		
		if(this.i >= this.r){
		    Units.nearby(null,this.x,this.y,10 * 8,other => {
		        if(other != null && other.team != this.team){
    		        other.damagePierce(100);
    		        
    		        other.impulse(
    		            Math.cos(Angles.angle(this.x, this.y, other.x, other.y)* Math.PI / 180) * 64 * 16,
    					Math.sin(Angles.angle(this.x, this.y, other.x, other.y)* Math.PI / 180) * 64 * 16
    		        )
    		    }
		    })
		    
		    var seq = Groups.bullet.intersect(this.x - 80, this.y - 80, 160, 160)
            seq.each(b => {
                if(b.type.hittable && b.team != this.team){
                    b.absorb()
                }
            });
		    
		    Object.assign(new WaveEffect(), {
            	lifetime: 15,
            	sizeFrom: 0,
            	sizeTo: 80,
            	strokeFrom: 3,
            	strokeTo: 0.1,
            	colorFrom: Pal.missileYellowBack,
            	colorTo: Pal.missileYellow,
            }).at(this.x,this.y)
            
            this.i = 0
            this.r = 300 + Mathf.range(120)
		}
	}
}))

const synthesis = new GenericCrafter("synthesis");
exports.synthesis = synthesis
Object.assign(synthesis, {
	outputItem: new ItemStack(item.biomass, 1),
	craftTime: 180,
	size: 2,
	hasItems: true,
	drawer: new DrawMulti(
		new DrawRegion("-bottom"),
		new DrawLiquidTile(Liquids.water),
		Object.assign(new DrawCultivator(), {
			plantColor: Color.valueOf("9cb664"),
			plantColorLight: Color.valueOf("cbd97f"),
		}),
		new DrawDefault(),
		new DrawRegion("-top")
	),
	
	buildVisibility: BuildVisibility.shown,
	category: Category.crafting,
	requirements: ItemStack.with(
		Items.graphite, 55,
		Items.silicon, 45,
	)
})
synthesis.consumePower(210 / 60);
synthesis.consumeLiquid(Liquids.water, 36 / 60);

const prokaryote = extend(CoreBlock,"prokaryote",{
	canPlaceOn(tile,team,rotation){
		return true
	},
});
exports.prokaryote = prokaryote;
Object.assign(prokaryote,{
	update: true,
	solid: false,
	replaceable: true,
	hasShadow: false,
	size: 3,
	health: 1500,
	unitType: insect.ribosome,
	unitCapModifier: 4,
	itemCapacity: 500,
	buildVisibility: BuildVisibility.editorOnly,
	category: Category.effect,
})
prokaryote.buildType = prov(() => extend(CoreBlock.CoreBuild,prokaryote,{
	i : 0,
	updateTile(){
		this.i += Time.delta * Vars.state.rules.unitBuildSpeed(this.team)
		
		if(this.i >= 60 * 10){
			let a = Math.random() * 5
			for(let i = 0; i < a;i++){
				insect.primeFruitingBody.spawn(this.team,this.tile.worldx() + Math.random(),this.tile.worldy() + Math.random());
			}
			
			this.i = 0
		}
		this.heal(0.25);
		if(this.health < this.maxHealth && Mathf.chance(0.1)) Fx.neoplasmHeal.at(
			this.x + Mathf.range(11),
			this.y + Mathf.range(11),
		);
	}
}))

const eukaryote = extend(CoreBlock,"eukaryote",{
	canPlaceOn(tile,team,rotation){
		return true
	},
});
exports.eukaryote = eukaryote;
Object.assign(eukaryote,{
	update: true,
	solid: false,
	replaceable: true,
	hasShadow: false,
	size: 5,
	health: 5500,
	unitType: insect.ribosome,
	unitCapModifier: 8,
	itemCapacity: 1200,
	buildVisibility: BuildVisibility.editorOnly,
	category: Category.effect,
})
eukaryote.buildType = prov(() => extend(CoreBlock.CoreBuild,eukaryote,{
	i : 0,
	updateTile(){
		this.i += Time.delta * Vars.state.rules.unitBuildSpeed(this.team)
		
		if(this.i >= 60 * 20){
			let a = Math.random() * 13
			for(let i = 0; i < a;i++){
				if(i < 9){
				    insect.primeFruitingBody.spawn(this.team,this.tile.worldx() + Math.random(),this.tile.worldy() + Math.random());
				}else{
				    insect.seniorFruitingBody.spawn(this.team,this.tile.worldx() + Math.random(),this.tile.worldy() + Math.random());

				}
			}
			
			this.i = 0
		}
		this.heal(0.25);
		if(this.health < this.maxHealth && Mathf.chance(0.1)) Fx.neoplasmHeal.at(
			this.x + Mathf.range(19),
			this.y + Mathf.range(19),
		);
	}
}))*/

const sieveTube = new Duct("sieve-tube")
exports.sieveTube = sieveTube;
Object.assign(sieveTube,{
    health: 45,
    speed: 4,
    researchCostMultiplier: 0.1,
    buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		item.biomass, 1,
	)
})

const sieveJunction = new Junction("sieve-junction");
exports.sieveJunction = sieveJunction;
Object.assign(sieveJunction, {
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		item.biomass, 4,
	),
	speed: 1,
	capacity: 1,
	health: 55,
	researchCostMultiplier: 0.1,
})

const sieveBridge = new ItemBridge("sieve-bridge");
exports.sieveBridge = sieveBridge;
Object.assign(sieveBridge, {
	fadeIn: false,
	moveArrows: false,
	hasPower: false,
	range: 8,
	arrowSpacing: 6,
	researchCostMultiplier: 0.1,
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		item.biomass, 16,
	),
})

const sieveRouter = new Router("sieve-router");
exports.sieveRouter = sieveRouter;
Object.assign(sieveRouter, {
    researchCostMultiplier: 0.1,
	buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		item.biomass, 4,
	),
})

sieveTube.bridgeReplacement = sieveBridge;

const carrier = new Insect("carrier");
exports.carrier = carrier;
Object.assign(carrier, {
	constructor: () => new BuildingTetherPayloadUnit.create(),
	health: 360,
	itemCapacity: 200,
	speed: 3.5,
	drag: 0,
	flying: true,
	lowAltitude: true,
	hitSize: 12,
	engineOffset: 5.5,
	armor: 3,
	aiController: () => new CargoAI(),
    isEnemy: false,
    allowedInPayloads: false,
    logicControllable: false,
    playerControllable: false,
    hidden: true,
})

const carrierLoader = new UnitCargoLoader("carrier-loader");
exports.carrierLoader = carrierLoader;
Object.assign(carrierLoader,{
    size: 3,
    buildTime: 60 * 5,
    unitType: carrier,
    polyColor: Pal.neoplasmOutline,
    itemCapacity: 200,
    buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		item.biomass, 150,
		item.biosulfide, 25,
	),
})
carrierLoader.consumeLiquid(liquid.nutrient, 0.1);

const carrierUnloader = new UnitCargoUnloadPoint("carrier-unloader");
exports.carrierUnloader = carrierUnloader;
Object.assign(carrierUnloader,{
    size: 2,
    itemCapacity: 50,
    buildVisibility: BuildVisibility.shown,
	category: Category.distribution,
	requirements: ItemStack.with(
		item.biomass, 75,
	),
})

const vessel = new Conduit("vessel");
exports.vessel = vessel;
Object.assign(vessel,{
    health: 45,
	liquidCapacity: 5,
	liquidPressure: 1.2,
	buildVisibility: BuildVisibility.shown,
	category: Category.liquid,
	researchCostMultiplier: 0.1,
	requirements: ItemStack.with(
		item.biomass, 1,
	)
})

const stiffenVessel = new ArmoredConduit("stiffen-vessel");
exports.stiffenVessel = stiffenVessel;
Object.assign(stiffenVessel,{
    health: 220,
	liquidCapacity: 5,
	liquidPressure: 1.2,
	buildVisibility: BuildVisibility.shown,
	category: Category.liquid,
	researchCostMultiplier: 0.1,
	requirements: ItemStack.with(
		item.biomass, 4,
	)
})

const vesselJunction = new LiquidJunction("vessel-junction");
exports.vesselJunction = vesselJunction;
Object.assign(vesselJunction, {
	buildVisibility: BuildVisibility.shown,
	category: Category.liquid,
	researchCostMultiplier: 0.1,
	requirements: ItemStack.with(
		item.biomass, 6,
	),
})

const vesselBridge = new LiquidBridge("vessel-bridge");
exports.vesselBridge = vesselBridge;
Object.assign(vesselBridge,{
    fadeIn: false,
	moveArrows: false,
	hasPower: false,
	range: 8,
	arrowSpacing: 6,
	researchCostMultiplier: 0.1,
	buildVisibility: BuildVisibility.shown,
	category: Category.liquid,
	requirements: ItemStack.with(
		item.biomass, 16,
	),
})

const vesselRouter = new LiquidRouter("vessel-router");
exports.vesselRouter = vesselRouter;
Object.assign(vesselRouter, {
	buildVisibility: BuildVisibility.shown,
	category: Category.liquid,
	researchCostMultiplier: 0.1,
	requirements: ItemStack.with(
		item.biomass, 8,
	),
	liquidCapacity: 15
});

const vacuole = new LiquidRouter("vacuole");
exports.vacuole = vacuole;
Object.assign(vacuole,{
    buildVisibility: BuildVisibility.shown,
	category: Category.liquid,
	researchCostMultiplier: 0.1,
	requirements: ItemStack.with(
		item.biomass, 45,
	),
	size: 2,
	liquidCapacity: 350
})

vessel.junctionReplacement = vesselJunction;
vessel.bridgeReplacement = vesselBridge;
stiffenVessel.junctionReplacement = vesselJunction;
stiffenVessel.bridgeReplacement = vesselBridge;

const hematopoieticTissue = new GenericCrafter("hematopoietic-tissue");
exports.hematopoieticTissue = hematopoieticTissue
Object.assign(hematopoieticTissue, {
	outputLiquid: new LiquidStack(Liquids.neoplasm, 0.05),
	liquidCapacity: 30,
	craftTime: 60,
	size: 2,
	hasItems: true,
	hasLiquids: true,
	drawer: new DrawMulti(
		new DrawRegion("-bottom"),
		new DrawLiquidTile(Liquids.water),
		Object.assign(new DrawCultivator(), {
			plantColor: Color.valueOf("c33e2b"),
			plantColorLight: Color.valueOf("e8803f"),
		}),
		new DrawDefault(),
		new DrawRegion("-top")
	),
	
	researchCostMultiplier: 0.1,
	buildVisibility: BuildVisibility.shown,
	category: Category.crafting,
	requirements: ItemStack.with(
		item.biomass, 65,
	)
})
hematopoieticTissue.consumeItem(item.biomass, 1);

const respiratoryTissue = new GenericCrafter("respiratory-tissue");
exports.respiratoryTissue = respiratoryTissue
Object.assign(respiratoryTissue, {
	outputLiquid: new LiquidStack(Liquids.neoplasm, 0.4),
	liquidOutputDirections: [0],
    rotate: true,
    invertFlip: true,
    regionRotated1: 3,
	liquidCapacity: 30,
	craftTime: 60 * 4,
	size: 2,
	hasItems: true,
	hasLiquids: true,
	drawer: new DrawMulti(
		new DrawDefault(),
		new DrawLiquidOutputs(),
	),
	
	researchCostMultiplier: 0.1,
	buildVisibility: BuildVisibility.shown,
	category: Category.crafting,
	requirements: ItemStack.with(
		item.biomass, 65,
	)
})
respiratoryTissue.consumeLiquid(liquid.venous, 0.4);
respiratoryTissue.consumeItem(item.biomass, 1);

const photosyntheticTissue = new AttributeCrafter("photosynthetic-tissue");
exports.photosyntheticTissue = photosyntheticTissue
Object.assign(photosyntheticTissue, {
	outputLiquid: new LiquidStack(liquid.venous, 0.1),
	outputItem: new ItemStack(item.biomass, 1),
	liquidOutputDirections: [0],
    rotate: true,
    invertFlip: true,
    regionRotated1: 3,
	liquidCapacity: 30,
	craftTime: 40,
	size: 3,
	hasItems: true,
	hasLiquids: true,
	drawer: new DrawMulti(
		new DrawDefault(),
		new DrawLiquidOutputs(),
	),
	
	researchCostMultiplier: 0.1,
	buildVisibility: BuildVisibility.shown,
	category: Category.crafting,
	requirements: ItemStack.with(
		item.biomass, 105,
	)
})
photosyntheticTissue.consumeLiquid(Liquids.neoplasm, 0.1);

const filterTissue = new GenericCrafter("filter-tissue");
exports.filterTissue = filterTissue
Object.assign(filterTissue, {
	outputLiquids: LiquidStack.with(
	    liquid.venous, 0.1,
	    liquid.acid, 0.1
	),
    liquidOutputDirections: [1,3],
    rotate: true,
    invertFlip: true,
    regionRotated1: 3,
	liquidCapacity: 30,
	craftTime: 60,
	size: 3,
	hasItems: true,
	hasLiquids: true,
	drawer: new DrawMulti(
		new DrawDefault(),
		new DrawLiquidOutputs(),
	),
	
	researchCostMultiplier: 0.1,
	buildVisibility: BuildVisibility.shown,
	category: Category.crafting,
	requirements: ItemStack.with(
		item.biomass, 105,
	)
})
filterTissue.consumeLiquid(Liquids.neoplasm, 0.1);

const nutrientExchanger = new GenericCrafter("nutrient-exchanger");
exports.nutrientExchanger = nutrientExchanger
Object.assign(nutrientExchanger, {
	outputLiquids: LiquidStack.with(
	    liquid.venous, 0.1,
	    liquid.nutrient, 0.1
	),
    liquidOutputDirections: [1,3],
    rotate: true,
    invertFlip: true,
    regionRotated1: 3,
	liquidCapacity: 30,
	craftTime: 60,
	size: 3,
	hasItems: true,
	hasLiquids: true,
	drawer: new DrawMulti(
		new DrawDefault(),
		new DrawLiquidOutputs(),
	),
	
	researchCostMultiplier: 0.1,
	buildVisibility: BuildVisibility.shown,
	category: Category.crafting,
	requirements: ItemStack.with(
		item.biomass, 105,
	)
})
nutrientExchanger.consumeLiquid(Liquids.neoplasm, 0.1);

const incubator = new UnitFactory("insect-incubator");
exports.incubator = incubator;
Object.assign(incubator, {
	size: 3,
	researchCostMultiplier: 0.1,
	plans: Seq.with(
		new UnitPlan(insect.haploid, 60 * 5, ItemStack.with(
			item.biomass, 10,
		)),
		new UnitPlan(insect.ribosome, 60 * 6, ItemStack.with(
			item.biomass, 12,
		)),
		new UnitPlan(insect.apoptoticBody, 60 * 2.7, ItemStack.with(
			item.biomass, 5,
		)),
		new UnitPlan(insect.glycocalyx, 60 * 10, ItemStack.with(
			item.biomass, 20,
		))
	),
	buildVisibility: BuildVisibility.shown,
	category: Category.units,
	requirements: ItemStack.with(
		item.biomass, 175,
	),
})
incubator.consumeLiquid(liquid.nutrient, 0.05);

const stemCell = new BuildTurret("stem-cell");
exports.stemCell = stemCell;
Object.assign(stemCell,{
    size: 2,
    range: 20 * 8,
    buildSpeed: 0.5,
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    requirements: ItemStack.with(
		item.biomass, 225,
	),
})
stemCell.consumeLiquid(liquid.nutrient, 0.1);

const contractileVacuole = new LiquidTurret("contractile-vacuole");
exports.contractileVacuole = contractileVacuole;
Object.assign(contractileVacuole,{
	size: 2,
	recoil: 0,
	reload: 45,
	inaccuracy: 1,
	shootCone: 10,
    shootY: 0,
	liquidCapacity: 40,
	targetAir: false,
	shootEffect: Fx.shootLiquid,
	range: 25 * 8,
	scaledHealth: 250,
	category: Category.turret,
	buildVisibility: BuildVisibility.shown,
	requirements: ItemStack.with(
		item.biomass, 150
	)
})
contractileVacuole.ammo(
	liquid.acid,Object.assign(new ArtilleryBulletType(3, 120), {
		knockback: 0.8,
		lifetime: 60,
		width: 11,
		height: 11,
		collidesTiles: false,
		splashDamageRadius: 8 * 2.25,
		splashDamage: 40,
        
        ammoMultiplier: 1/2,
		
		backColor: Color.valueOf("84a94b"),
		frontColor: Color.valueOf("84a94b"),
		trailColor: Color.valueOf("84a94b"),
		
		lightOpacity: 0,
		
		status: StatusEffects.corroded,
		statusDuration: 120,
		
		homingRange: 40,
		homingPower: 0.005,
		
		fragBullets: 2,
		fragBullet:new Acid(18)
	}),
)

const acidMist = new LiquidTurret("acid-mist");
exports.acidMist = acidMist;
Object.assign(acidMist,{
    reload: 20,
	range: 220,
	targetGround: false,
	shootCone: 45,
	ammoUseEffect: Fx.casing1,
	health: 750,
	size: 2,
	rotateSpeed: 15,
	inaccuracy: 1,
	liquidCapacity: 40,
	shoot: Object.assign(new ShootAlternate(6),{
	    shots: 2,
	}),
	shootSound: Sounds.plantBreak,
	buildVisibility: BuildVisibility.shown,
	category: Category.turret,
	requirements: ItemStack.with(
		item.biomass, 170
	)
})
acidMist.ammo(
	liquid.acid, Object.assign(new MissileBulletType(5,20), {
		lifetime: 45,
		hitEffect: Fx.none,
		despawnEffect: Fx.none,
		collidesGround: false,
        
        ammoMultiplier: 1/4,
		
		backColor: Color.valueOf("84a94b"),
		frontColor: Color.valueOf("84a94b"),
		trailColor: Color.valueOf("84a94b"),
		trailWidth: 0.8,
		trailLength: 14,
		trailChance: 0,
		
		lightOpacity: 0,
		
		status: StatusEffects.corroded,
		statusDuration: 120,
		
		fragBullets: 12,
		fragBullet: Object.assign(new LiquidBulletType(),{
    		speed: 7,
    		drag: 0.3,
    		damage: 3,
    		liquid: liquid.acid,
    		lifetime: 60 * 6,
    		puddleSize: 18,
    		orbSize: 0.2,
    		
    		knockback: 0.2,
    		collidesGround: false,
    		pierce: true,
    		lightOpacity: 0,
    		hitEffect: Fx.none,
			despawnEffect: Fx.none,
    		
    		status: StatusEffects.corroded,
    		statusDuration: 120
		})
	})
)

const synapse = new LiquidTurret("synapse");
exports.synapse = synapse;
Object.assign(synapse,{
    reload: 70,
    shootCone: 40,
    rotateSpeed: 8,
    range: 120,
    shootEffect: Fx.lightningShoot,
    heatColor: Color.red,
    recoil: 1,
    size: 2,
    health: 800,
    shootSound: Sounds.spark,
    shoot: Object.assign(new ShootPattern(), {
		shots: 4,
	}),
    buildVisibility: BuildVisibility.shown,
	category: Category.turret,
    requirements: ItemStack.with(
		item.biomass, 220
	),
})
synapse.ammo(
    liquid.nutrient, Object.assign(new LightningBulletType(),{
	    damage: 10,
        lightningLength: 20,
        collidesAir: true,
        ammoMultiplier: 1,
        lightningType: Object.assign(new BulletType(0.0001, 0),{
            lifetime: Fx.lightning.lifetime,
            hitEffect: Fx.hitLancer,
            despawnEffect: Fx.none,
            status: StatusEffects.shocked,
            statusDuration: 10,
            hittable: false,
            lightColor: Color.white,
            collidesAir: true,
            buildingDamageMultiplier: 0.25,
        })
    })
)

const mineralWall = new Wall("mineral-wall");
Object.assign(mineralWall,{
    health: 320,
    variants: 3,
	armor: 1,
	size: 1,
	buildVisibility: BuildVisibility.shown,
	category: Category.defense,
})

const mineralWallLarge = new Wall("mineral-wall-large");
Object.assign(mineralWallLarge,{
    health: 320 * 4,
    variants: 2,
	armor: 1,
	size: 2,
	buildVisibility: BuildVisibility.shown,
	category: Category.defense,
})

const mineralWallHuge = new Wall("mineral-wall-huge");
Object.assign(mineralWallHuge,{
    health: 320 * 9,
    variants: 2,
	armor: 1,
	size: 3,
	buildVisibility: BuildVisibility.shown,
	category: Category.defense,
})

const acidMine = new Block("acid-mine");
exports.acidMine = acidMine;
Object.assign(acidMine,{
    update: false,
    destructible: true,
    solid: false,
    targetable: false,
    hasShadow: false,
    health: 400,
    crushDamageMultiplier: 0,
    category: Category.effect,
	buildVisibility: BuildVisibility.shown,
	requirements: ItemStack.with(
		item.biomass, 3
	)
})
acidMine.buildType = prov(() => extend(Building,{
    unitOn(unit){
        if(unit.team != this.team){
            unit.damage(Math.min(unit.type.hitSize * unit.type.hitSize * 1.6 + 160,64 * Math.log(7 * unit.type.hitSize) + 270));
            unit.apply(StatusEffects.corroded, 180);
            Puddles.deposit(unit.tileOn(),liquid.acid,100),
            this.kill();
        }
    }
}))

const bottle = new UnitType("bottle1");
Object.assign(bottle,{
	speed: 0,
	isEnemy: false,
	envDisabled: 0,
	targetable: false,
	hittable: false,
	playerControllable: false,
	createWreck: false,
	createScorch: false,
	logicControllable: false,
	useUnitCap: false,
	allowedInPayloads: false,
	constructor: () => new TimedKillUnit.create(),
	physics: false,
	bounded: false,
	hidden: true,
	lifetime: 60 * 5,
	health: 10000,
	drawMinimap: false,
	flying: false,
	drawCell: false,
	deathSound: Sounds.none,
})
bottle.abilities.add(
	new ToxicAbility(20,15,32)
)
bottle.immunities.addAll(status.poisoned)

const toxicMine = new Block("toxic-mine");
exports.toxicMine = toxicMine;
Object.assign(toxicMine,{
    update: false,
    destructible: true,
    solid: false,
    targetable: false,
    hasShadow: false,
    health: 400,
    size: 2,
    crushDamageMultiplier: 0,
    category: Category.effect,
    buildVisibility: BuildVisibility.shown,
	requirements: ItemStack.with(
		item.biomass, 12
	)
})
toxicMine.buildType = prov(() => extend(Building,{
    unitOn(unit){
        if(unit.team != this.team){
            bottle.spawn(unit.x,unit.y)
            this.kill();
        }
    }
}))