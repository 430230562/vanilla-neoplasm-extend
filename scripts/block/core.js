const item = require("vne/item");
const {
    MendFieldAbility
} = require("vne/lib/ability")

const election = new UnitType("election");
Object.assign(election, {
    aiController: UnitTypes.alpha.aiController,
    isEnemy: false,

    lowAltitude: true,
    flying: true,
    mineSpeed: 6,
    mineHardnessScaling: false,
    mineTier: 2,
    buildSpeed: 0.75,
    drag: 0.05,
    speed: 3,
    rotateSpeed: 15,
    accel: 0.1,
    itemCapacity: 30,
    health: 150,
    targetPriority: -1,
    engineOffset: 4,
    hitSize: 8,
    alwaysUnlocked: true,
    constructor: () => new UnitEntity.create(),
})
election.weapons.add(
Object.assign(new Weapon("vne-election-weapon"), {
    top: false,
    y: 5 / 4,
    x: 10 / 4,
    reload: 30,
    ejectEffect: Fx.none,
    recoil: 2,
    shootSound: Sounds.shootMissile,
    inaccuracy: 3,
    alternate: true,
    bullet: Object.assign(new MissileBulletType(4, 17), {
        homingPower: 0.08,
        lifetime: 50,
        keepVelocity: false,
        hitSound: Sounds.none,
        shootEffect: Fx.sparkShoot,
        smokeEffect: Fx.shootBigSmoke,
        frontColor: Color.white,
        buildingDamageMultiplier: 0.001,
    })
}))
election.abilities.add(
new MendFieldAbility(75, 300, 8 * 6))

const atom = new UnitType("atom");
Object.assign(atom, {
    aiController: UnitTypes.alpha.aiController,
    isEnemy: false,

    lowAltitude: true,
    flying: true,
    mineSpeed: 8,
    mineHardnessScaling: false,
    mineTier: 2,
    buildSpeed: 1.25,
    drag: 0.05,
    speed: 3.3,
    rotateSpeed: 17,
    accel: 0.1,
    itemCapacity: 50,
    health: 170,
    targetPriority: -1,
    engineOffset: 6,
    hitSize: 9,
    alwaysUnlocked: true,
    constructor: () => new UnitEntity.create(),
})
atom.weapons.add(
Object.assign(new Weapon("vne-atom-weapon"), {
    reload: 60,
    x: 0,
    y: 0,
    shootY: 5,
    recoil: 1,
    top: false,
    layerOffset: -0.01,
    rotate: false,
    mirror: false,
    shoot: new ShootHelix(),
    shootSound: Sounds.shootAvert,

    bullet: Object.assign(new BasicBulletType(5, 42), {
        width: 7,
        height: 12,
        lifetime: 25,
        shootEffect: Fx.sparkShoot,
        smokeEffect: Fx.shootBigSmoke,
        frontColor: Color.white,
        trailWidth: 1.5,
        trailLength: 5,
        buildingDamageMultiplier: 0.001,
    })
}))
atom.abilities.add(
MendFieldAbility(100, 300, 8 * 7))

const molecule = new UnitType("molecule");
Object.assign(molecule, {
    aiController: UnitTypes.alpha.aiController,
    isEnemy: false,

    lowAltitude: true,
    flying: true,
    mineSpeed: 12,
    mineHardnessScaling: false,
    mineTier: 2,
    buildSpeed: 1.75,
    drag: 0.05,
    speed: 3.4,
    rotateSpeed: 22,
    accel: 0.1,
    itemCapacity: 50,
    health: 220,
    targetPriority: -1,
    engineOffset: 7,
    hitSize: 11,
    alwaysUnlocked: true,
    constructor: () => new UnitEntity.create(),
})
molecule.weapons.add(
Object.assign(new Weapon("vne-molecule-weapon"), {
    top: false,
    mirror: false,
    rotate: true,
    y: -10 / 4,
    x: 0,
    reload: 50,
    ejectEffect: Fx.none,
    recoil: 2,
    shootSound: Sounds.shootMissile,
    inaccuracy: 3,
    shoot: Object.assign(new ShootPattern(), {
        shots: 3,
        shotDelay: 5,
    }),
    bullet: Object.assign(new MissileBulletType(4, 9), {
        homingPower: 0.08,
        lifetime: 50,
        keepVelocity: false,
        smokeEffect: Fx.none,
        frontColor: Color.white,
        hitSound: Sounds.none,
        buildingDamageMultiplier: 0.001,
    })
}))
molecule.abilities.add(
new MendFieldAbility(125, 300, 8 * 8))

function PowerCore(name, powerProduction) {
    const core = extend(CoreBlock, name, {
        setStats() {
            this.super$setStats();

            this.stats.add(Stat.basePowerGeneration, powerProduction * 60.0, StatUnit.powerSecond);
        },
        setBars() {
            this.super$setBars();

            this.addBar("power", func(e => new Bar(
            prov(() => Core.bundle.format("bar.poweroutput")),
            prov(() => Pal.powerBar),
            floatp(() => powerProduction))))
            //这里是否可以不需要prov()?
        }
    })
    core.buildType = prov(() => extend(CoreBlock.CoreBuild, core, {
        getPowerProduction() {
            return powerProduction
        }
    }))

    return core
}

const ash = new PowerCore("ash", 5);
exports.ash = ash
Object.assign(ash, {
    alwaysUnlocked: false,
    isFirstTier: true,
    unitType: election,
    health: 1200,
    itemCapacity: 5000,
    size: 3,
    unitCapModifier: 10,
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    requirements: ItemStack.with(
    Items.copper, 1000,
    item.nickel, 500
    )
})

/*const albus = CoreBlock("albus");
exports.albus = albus;
Object.assign(albus, {
	unitType: atom,
	health: 5500,
	armor: 3,
	itemCapacity: 12000,
	size: 4,
	
	unitCapModifier: 18,
	researchCostMultiplier: 0.05,
	
	buildVisibility: BuildVisibility.shown,
	category: Category.effect,
	requirements: ItemStack.with(
		item.nickel, 5000,
		Items.graphite, 2000,
		Items.silicon, 2000,
	)
})

const annular = new CoreBlock("annular");
exports.annular = annular
Object.assign(annular, {
	unitType: molecule,
	size: 5,
	health: 8800,
	armor: 5,
	itemCapacity: 15000,
	
	unitCapModifier: 24,
	researchCostMultiplier: 0.05,
	
	buildVisibility: BuildVisibility.shown,
	category: Category.effect,
	requirements: ItemStack.with(
		item.nickel, 12000,
		Items.silicon, 5000,
		item.chromium, 4000,
	)
})*/

/*const coreFix = new Block("core-fix");
Object.assign(coreFix,{
	buildVisibility: BuildVisibility.editorOnly,
	category: Category.effect,
	update: true,
	alwaysUnlocked: true,
})
coreFix.buildType = prov(() => extend(Building,{
	updateTile(){
		this.tile.circle(5, cons(tile => {
			if(tile.block() == Blocks.coreShard){
				tile.setBlock(ash,this.team);
			}
		}))
		this.team.core().items.add(item.nickel, 200)
		this.team.core().items.add(Items.graphite, 100)
		
		this.tile.setBlock(Blocks.air)
	}
}))*/