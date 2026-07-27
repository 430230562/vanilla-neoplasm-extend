const status = require('vne/status');
const liquid = require('vne/liquid');
const item = require("vne/item");
const {
    Acid, ReduceArmorBulletType, BounceBulletType
} = require('vne/lib/bulletType');
const {
    DeathNeoplasmAbility, MoveLiquidAbility, DamageDownAbility
} = require("vne/lib/ability")

function StatWeapon(name, stat, num) {
    return extend(Weapon, {
        name: name,
        addStats(u, t) {
            this.super$addStats(u, t);
            t.row();
            t.add(Core.bundle.format(stat, num));
        }
    });
}

function Insect(name) {
    return extend(UnitType, name, {
        outlineColor: Pal.neoplasmOutline, //想不到吧,其实这个是瘤液单位的标记Color.valueOf("2e191d")
        envDisabled: Env.none,
        healFlash: true,
        healColor: Pal.neoplasm1,
        lightRadius: 0,
        engineSize: 0,
        researchCostMultiplier: 0,
        init() {
            this.super$init();

            this.abilities.add(
                new DeathNeoplasmAbility(this.hitSize * 1.25, this.health * 0.75),
                Object.assign(new RegenAbility(), {
                    percentAmount: 1 / (90 * 60) * 100,
                }),
                Object.assign(new LiquidRegenAbility(), {
                    liquid: Liquids.neoplasm,
                    slurpEffect: Fx.neoplasmHeal,
                    regenPerSlurp: 18,
                    slurpSpeed: 2.5
                }));
            this.immunities.add(status.neoplasmSlow)
        }
    })
}
exports.Insect = Insect;

const adventitiousRoot = new Insect("adventitious-root");
exports.adventitiousRoot = adventitiousRoot;
Object.assign(adventitiousRoot, {
    targetPriority: -0.5,

    speed: 12 * 8 / 60,
    accel: 0.06,
    drag: 0.017,

    health: 100,
    armor: 2,
    hitSize: 8,
    itemCapacity: 40,
    mineTier: 5,
    mineSpeed: 4,
    mineRange: 24,
    engineSize: 0,
    engineOffset: 0,
    mineWalls: true,
    buildSpeed: 0.25,
    controller: UnitTypes.mono.controller,
    defaultCommand: UnitTypes.mono.defaultCommand,
    flying: true,
    constructor: () => new UnitEntity.create()
})
adventitiousRoot.mineItems.addAll(
    Items.graphite,
    Items.beryllium,
    Items.tungsten,
    Items.oxide,
    item.nickel,
    item.manganese,);

const midrib = new Insect("midrib");
exports.midrib = midrib;
Object.assign(midrib, {
    targetPriority: -0.5,

    speed: 15 * 8 / 60,
    accel: 0.06,
    drag: 0.017,
    engineOffset: 5,

    health: 100,
    armor: 2,
    hitSize: 8,
    itemCapacity: 30,
    mineTier: 5,
    mineSpeed: 1,
    mineWalls: true,
    buildSpeed: 1,
    controller: UnitTypes.poly.controller,
    defaultCommand: UnitTypes.poly.defaultCommand,
    flying: true,
    constructor: () => new UnitEntity.create()
})
midrib.mineItems.addAll(
    Items.graphite,
    Items.beryllium,
    Items.tungsten,
    Items.oxide,
    item.nickel,
    item.manganese);
midrib.abilities.add(
    new RepairFieldAbility(15, 60 * 10, 8 * 10))

/*
const alter = new UnitType("alter");
exports.alter = alter;
Object.assign(alter, {
    targetPriority: -1.5,
    outlineColor: Color.valueOf("464a59"),
    outlineRadius: 3,
    envDisabled: Env.none,
    healFlash: true,
    squareShape: true,
    omniMovement: false,
    rotateMoveFirst: true,
    speed: 0.9,
    hitSize: 11,
    treadRects: [new Rect(4, -20, 21, 80)],
    treadFrames: 8,
    treadPullOffset: 3,
    rotateSpeed: 3.3,
    health: 420,
    armor: 1,
    itemCapacity: 0,
    constructor: () => new TankUnit.create()
})
alter.weapons.add(
Object.assign(new StatWeapon("vne-alter-weapon","alter",100), {
    layerOffset: 0.0001,
    reload: 60,
    shootY: 2,
    recoil: 0,
    rotate: true,
    rotateSpeed: 5.7,
    mirror: false,
    x: 0,
    y: 0,
    heatColor: Color.valueOf("f9350f"),
    cooldownTime: 90,
    shootSound: Sounds.lasershoot,
	
    bullet: extend(BasicBulletType, {
        hitEntity(b, entity, health) {
            if(entity instanceof Unit) {
                if (entity.health <= 100) {
                    entity.remove();
                	
                let u = entity.type.spawn(unit.team, entity.x,entity.y,entity.rotation);
                u.health = u.maxHealth / 4
            }
                }
            }
        	
            this.super$hitEntity(b, entity, health);
        },
        hitTile(b,build,x,y,initialHealth,direct){
            if(build.team != b.team && build.health <= 100){
                build.changeTeam(b.team)
            	
                build.heal(build.maxHealth / 4)
            }
        	
            this.super$hitTile(b,build,x,y,initialHealth,direct);
        },
        speed: 3.5,
        damage: 50,
        sprite: "vne-wave",
        width: 10,
        height: 13,
        lifetime: 52,
        despawnEffect: Ef.interfere,
        hitEffect: Ef.interfere,
        backColor: Color.valueOf("bf92f9"),
        frontColor: Color.valueOf("ffffff"),
        hittable: false,
        pierceArmor: true,
        homingRange: 60,
        homingPower: 0.1,
    })
})
)
*/

//陆军T1
const haploid = new Insect("haploid");
exports.haploid = haploid;
Object.assign(haploid, {
    speed: 0.75,
    drag: 0.11,
    hitSize: 11,
    rotateSpeed: 3,
    health: 160,
    armor: 1,
    legStraightness: 0.3,
    stepShake: 0,

    legCount: 6,
    legLength: 8,
    lockLegBase: true,
    legContinuousMove: true,
    legExtension: -2,
    legBaseOffset: 3,
    legMaxLength: 1.1,
    legMinLength: 0.2,
    legLengthScl: 0.96,
    legForwardScl: 1.1,
    legGroupSize: 3,
    rippleScale: 0.2,

    legMoveSpace: 1,
    allowLegStep: true,
    hovering: true,
    legPhysicsLayer: false,

    shadowElevation: 0.1,
    groundLayer: 74,

    constructor: () => new LegsUnit.create()
})
haploid.weapons.add(
    Object.assign(new Weapon("vne-haploid-weapon"), {
        mirror: false,
        x: 0,
        y: 1,
        shootY: 4,
        reload: 20,
        cooldownTime: 42,
        shootSound: Sounds.plantBreak,
        heatColor: Color.valueOf("84a94b"),
        bullet: Object.assign(new MissileBulletType(3, 17), {
            backColor: Color.valueOf("84a94b"),
            frontColor: Color.valueOf("84a94b"),
            hitEffect: Fx.none,
            despawnEffect: Fx.none,
            trailColor: Color.valueOf("84a94b"),

            status: StatusEffects.corroded,
            statusDuration: 40,

            recoil: 0.8,
            lifetime: 45,
            homingRange: 80,
            homingPower: 0.05,
            trailWidth: 0.8,
            trailLength: 14,
            trailChance: 0,

            lightOpacity: 0,

            fragBullets: 2,
            fragBullet: new Acid(18)
        })
    }))

//陆军T2
const diploid = new Insect("diploid")
exports.diploid = diploid;
Object.assign(diploid, {
    constructor: () => new LegsUnit.create(),

    speed: 0.65,
    drag: 0.4,
    hitSize: 12,
    rotateSpeed: 3,
    health: 500,
    legCount: 6,
    legLength: 13,
    legMoveSpace: 1.4,
    legBaseOffset: 2,
    legContinuousMove: true,
    hovering: true,
    armor: 3,
    targetAir: false,

    range: 8 * 28,
})
diploid.weapons.add(
    Object.assign(new Weapon(), {
        mirror: false,
        x: 0,
        y: 1,
        shootY: 4,
        reload: 100,
        cooldownTime: 42,
        shoot: Object.assign(new ShootPattern(), {
            shots: 3,
            shotDelay: 4,
        }),
        inaccuracy: 1,
        shootSound: Sounds.shootArtillerySmall,
        heatColor: Color.valueOf("84a94b"),
        bullet: Object.assign(new ArtilleryBulletType(3, 30), {
            knockback: 0.8,
            lifetime: 80,
            width: 11,
            height: 11,
            collidesTiles: false,
            splashDamageRadius: 8 * 2.75,
            splashDamage: 60,

            backColor: Color.valueOf("84a94b"),
            frontColor: Color.valueOf("84a94b"),
            trailColor: Color.valueOf("84a94b"),

            lightOpacity: 0,

            status: StatusEffects.corroded,
            statusDuration: 60,

            fragBullets: 2,
            fragBullet: new Acid(18)
        }),
        shootStatus: StatusEffects.slow,
        shootStatusDuration: 130,
    }))

const polarBody = extend(MissileUnitType, "polar-body", {
    update(unit) {
        this.super$update(unit);

        if (unit.getDuration(status.antagonistic) > 0) {
            Object.assign(new WaveEffect(), {
                colorFrom: Color.valueOf("e05438"),
                colorTo: Color.valueOf("e05438"),
                sizeTo: 40,
                lifetime: 12,
                strokeFrom: 4,
            }).at(unit.x, unit.y)

            unit.remove();
        }
    }
})
Object.assign(polarBody, {
    hitSize: 4,
    constructor: () => new TimedKillUnit.create(),
    trailColor: Color.valueOf("e05438"),
    engineColor: Color.valueOf("e05438"),
    engineSize: 1.75,
    engineLayer: Layer.effect,
    speed: 4,
    lightOpacity: 0,
    maxRange: 6,
    lifetime: 95,
    outlineColor: Pal.neoplasmOutline,
    health: 85,
    lowAltitude: true,
})
polarBody.parts.add(
    Object.assign(new RegionPart("-wing"), {
        mirror: true,
        x: 0,
        y: 0,
        rotation: -45,
        moveX: 0,
        moveY: 0,
        moveRot: 30,
        progress: DrawPart.PartProgress.smoothReload.sin(1, 5)
    }))
polarBody.weapons.add(
    Object.assign(new Weapon(), {
        shootCone: 360,
        mirror: false,
        reload: 1,
        shootOnDeath: true,
        bullet: Object.assign(new ExplosionBulletType(200, 35), {
            shootEffect: new MultiEffect(
                Fx.massiveExplosion,
                new WrapEffect(
                    Fx.dynamicSpikes,
                    Color.valueOf("e05438"), 24),
                Object.assign(new WaveEffect(), {
                    colorFrom: Color.valueOf("e05438"),
                    colorTo: Color.valueOf("e05438"),
                    sizeTo: 40,
                    lifetime: 12,
                    strokeFrom: 4,
                }))
        })
    }))
polarBody.abilities.add(
    new DeathNeoplasmAbility(16, 150))

//陆军T3
const triploid = new Insect("triploid");
exports.triploid = triploid;
Object.assign(triploid, {
    speed: 0.45,
    drag: 0.1,
    hitSize: 17.8,
    rotateSpeed: 2.3,
    health: 960,
    armor: 5,

    fogRadius: 45,
    stepShake: 0,
    legCount: 6,
    legLength: 18,
    legGroupSize: 3,
    lockLegBase: true,
    legContinuousMove: true,
    legExtension: -2.23,
    legBaseOffset: 8.2,
    legMaxLength: 1.1,
    legMinLength: 0.2,
    legLengthScl: 0.95,
    legForwardScl: 0.8,

    legMoveSpace: 1,
    hovering: true,

    shadowElevation: 0.2,
    groundLayer: 74,
    constructor: () => new LegsUnit.create(),
})
for (let i = 0; i < 3; i++) {
    triploid.parts.add(
        Object.assign(new RegionPart("-blade"), {
            layerOffset: -0.001,
            x: 2,
            moveX: 6 + i * 1.9,
            moveY: 8 + -4 * i,
            moveRot: 40 - i * 25,
            mirror: true,
            progress: DrawPart.PartProgress.warmup.delay(i * 0.2)
        }))
}
triploid.weapons.add(Object.assign(
    new Weapon("vne-triploid-weapon"), {
    shootSound: Sounds.shootMissileLarge,
    x: 29 / 4,
    y: -11 / 4,
    shootY: 1.5,
    reload: 100,
    layerOffset: 0.01,
    rotateSpeed: 2,
    rotate: true,
    bullet: Object.assign(new BulletType(), {
        spawnUnit: polarBody,
        smokeEffect: Fx.shootBigSmoke2,
        speed: 0,
        keepVelocity: false,
    }),
    shootStatus: StatusEffects.slow,
    shootStatusDuration: 130,
}))

//陆军T4
const bivalents = new Insect("bivalents");
exports.bivalents = bivalents;
Object.assign(bivalents, {
    speed: 1,
    drag: 0.1,
    hitSize: 26,
    rotateSpeed: 3,
    health: 5000,
    armor: 6,
    targetPriority: 1,

    fogRadius: 40,

    stepShake: 0.75,
    mechFrontSway: 1.9,
    mechSideSway: 0.6,
    stepSound: Sounds.mechStepHeavy,
    stepSoundPitch: 0.9,
    stepSoundVolume: 0.45,

    hovering: true,
    canDrown: false,

    constructor: () => new MechUnit.create(),
})
bivalents.weapons.add(
    Object.assign(new Weapon("vne-bivalents-weapon"), {
        mirror: true,
        top: false,
        x: 14,
        y: 0,
        shootY: 16,
        shootSound: Sounds.shootFlame,
        reload: 10,
        recoil: 1,
        rotate: false,
        ejectEffect: Fx.none,
        bullet: extend(BulletType, 8, 80, {
            hitSize: 11,
            lifetime: 8,
            pierce: true,
            pierceBuilding: true,
            pierceCap: 2,
            shootEffect: new Effect(32, 80, e => {
                Draw.color(Color.valueOf("e8803f"), Color.valueOf("c33e2b"), Color.gray, e.fin());

                Angles.randLenVectors(e.id, 16, e.finpow() * 60, e.rotation, 10, (x, y) => {
                    Fill.circle(e.x + x, e.y + y, 0.65 + e.fout() * 1.5);
                })
            }),
            hitEffect: new Effect(14, e => {
                Draw.color(Color.valueOf("e8803f"), Color.valueOf("c33e2b"), e.fin());
                Lines.stroke(0.5 + e.fout());

                Angles.randLenVectors(e.id, 2, 1 + e.fin() * 15, e.rotation, 50, (x, y) => {
                    let ang = Mathf.angle(x, y);
                    Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 3 + 1);
                })
            }),
            despawnEffect: Fx.none,
            statusDuration: 60 * 2,
            status: status.neoplasmSlow,
            keepVelocity: false,
            hittable: false,
            update(b) {
                this.super$update(b);

                let tile = Vars.world.tileWorld(b.x, b.y);
                if (tile != null) {
                    Puddles.deposit(tile, Liquids.neoplasm, 20);
                }
            }
        })
    }))

//陆军T5
const tetraploid = new Insect("tetraploid");
exports.tetraploid = tetraploid;
Object.assign(tetraploid, {
    speed: 0.7,
    drag: 0.08,
    hitSize: 38,
    rotateSpeed: 2.5,
    health: 8000,
    armor: 10,
    targetPriority: 2,

    fogRadius: 60,
    stepShake: 1.5,
    mechFrontSway: 2.5,
    mechSideSway: 1.0,
    stepSound: Sounds.mechStepHeavy,
    stepSoundPitch: 0.7,
    stepSoundVolume: 0.5,

    hovering: true,
    canDrown: false,
    constructor: () => new MechUnit.create(),
})
tetraploid.weapons.add(
    Object.assign(new Weapon("vne-tetraploid-weapon0"), {
        mirror: true,
        top: false,
        x: 18,
        y: -6,
        shootY: 20,
        shootSound: Sounds.shootSalvo,
        reload: 60,
        shoot: Object.assign(new ShootPattern(), {
            shots: 4,
            shotDelay: 3
        }),
        recoil: 2,
        rotate: false,
        ejectEffect: Fx.none,
        bullet: Object.assign(new ReduceArmorBulletType(8, 120, 1), {
            width: 6,
            hitSize: 7,
            height: 20,
            shootEffect: new MultiEffect(Fx.shootBigColor, Fx.colorSparkBig),
            hitEffect: Fx.hitBulletColor,
            despawnEffect: Fx.hitBulletColor,
            smokeEffect: Fx.shootBigSmoke,
            knockback: 2,
            lifetime: 40,
            hitColor: Color.valueOf("84a94b"),
            backColor: Color.valueOf("84a94b"),
            frontColor: Pal.plastaniumFront,

            trailEffect: Fx.colorSpark,
            trailRotation: true,
            trailInterval: 5,
            rotationOffset: 180,

            shieldDamageMultiplier: 2,
            status: StatusEffects.slow,
            statusDuration: 10,

            fragBullets: 2,
            fragBullet: new Acid(18)
        })
    }),
    Object.assign(
        new Weapon("vne-tetraploid-weapon1"), {
        shootSound: Sounds.shootMissileLarge,
        x: 29 / 4,
        y: -11 / 4,
        shootY: 1.5,
        reload: 100,
        layerOffset: 0.01,
        rotateSpeed: 2,
        rotate: true,
        shoot: Object.assign(new ShootPattern(), {
            shots: 3,
            shotDelay: 7
        }),
        bullet: Object.assign(new BulletType(), {
            spawnUnit: polarBody,
            smokeEffect: Fx.shootBigSmoke2,
            speed: 0,
            keepVelocity: false,
        }),
    }))
//死亡时分裂为2个T4
tetraploid.abilities.add(
    new SpawnDeathAbility(bivalents, 2, 30))

//空军T1
const ribosome = new Insect("ribosome");
exports.ribosome = ribosome;
Object.assign(ribosome, {
    constructor: () => new UnitEntity.create(),
    health: 120,
    speed: 3.5,
    flying: true,
    lowAltitude: true,
    hitSize: 8,
    engineOffset: 5.5,
    armor: 1,
    aiController: () => new FlyingFollowAI()
})
ribosome.weapons.add(
    Object.assign(new Weapon("vne-ribosome-weapon"), {
        mirror: false,
        x: 0,
        y: 1,
        shootY: 4,
        reload: 20,
        shootCone: 60,
        cooldownTime: 42,
        shootSound: Sounds.plantBreak,
        heatColor: Color.valueOf("84a94b"),
        bullet: Object.assign(new MissileBulletType(3, 19), {
            backColor: Color.valueOf("84a94b"),
            frontColor: Color.valueOf("84a94b"),
            hitEffect: Fx.none,
            despawnEffect: Fx.none,
            trailColor: Color.valueOf("84a94b"),

            status: StatusEffects.corroded,
            statusDuration: 40,

            recoil: 0.8,
            lifetime: 45,
            homingRange: 80,
            homingPower: 0.05,
            trailWidth: 0.8,
            trailLength: 14,
            trailChance: 0,

            lightOpacity: 0,

            fragBullets: 2,
            fragBullet: new Acid(18)
        })
    }))
ribosome.parts.add(
    Object.assign(new RegionPart("-wing"), {
        mirror: true,
        x: 1.5,
        y: 0,
        rotation: -45,
        moveX: 0,
        moveY: 0,
        moveRot: 30,
        progress: DrawPart.PartProgress.smoothReload.sin(1, 5)
    }))

//空军T2
const lysosome = new Insect("lysosome");
exports.lysosome = lysosome;
Object.assign(lysosome, {
    constructor: () => new UnitEntity.create(),
    health: 440,
    speed: 2,
    accel: 0.08,
    drag: 0.016,
    flying: true,
    hitSize: 10,
    targetAir: false,
    range: 140,
    faceTarget: false,
    armor: 3,
    itemCapacity: 0,
    circleTarget: true,
    targetFlags: [BlockFlag.drill, BlockFlag.battery, null],
    engineOffset: 7.8,
})
lysosome.weapons.add(
    Object.assign(new Weapon(), {
        x: 0,
        y: 0,
        mirror: false,
        shootCone: 360,
        shootY: 0,
        reload: 60,
        minShootVelocity: 0.55,
        ignoreRotation: true,
        ejectEffect: Fx.none,
        shootSound: Sounds.none,
        shoot: Object.assign(new ShootPattern(), {
            shots: 3,
            shotDelay: 7.5,
        }),
        bullet: Object.assign(new BombBulletType(40, 28), {
            width: 10,
            height: 14,
            hitEffect: Fx.flakExplosion,
            shootEffect: Fx.none,
            smokeEffect: Fx.none,
            backColor: Color.valueOf("84a94b"),
            frontColor: Color.valueOf("84a94b"),

            lightOpacity: 0,

            fragBullets: 4,
            fragBullet: new Acid(18)
        })
    }))
lysosome.parts.add(
    Object.assign(new RegionPart("-wing"), {
        mirror: true,
        x: 2.5,
        y: 0,
        rotation: -45,
        moveX: 0,
        moveY: 0,
        moveRot: 30,
        progress: DrawPart.PartProgress.smoothReload.sin(1, 5)
    }))

//空军T3
const trichocyst = new Insect("trichocyst");
exports.trichocyst = trichocyst;
Object.assign(trichocyst, {
    constructor: () => new UnitEntity.create(),
    health: 880,
    speed: 1.667,
    accel: 0.08,
    drag: 0.016,
    flying: true,
    hitSize: 16,
    targetAir: true,
    range: 140,
    faceTarget: true,
    armor: 6,
    itemCapacity: 0,
    engineOffset: 7.8,
})
trichocyst.weapons.add(
    Object.assign(new Weapon("vne-trichocyst-weapon"), {
        x: 0,
        y: 4,
        mirror: false,
        shootCone: 15,
        shootY: 0,
        reload: 100,
        ejectEffect: Fx.none,
        shootSound: Sounds.plantBreak,
        bullet: Object.assign(new BasicBulletType(6, 250), {
            ammoMultiplier: 1,
            width: 7,
            height: 21,
            lifetime: 33.4,
            hitSize: 4,
            hitColor: Color.valueOf("84a94b"),
            backColor: Color.valueOf("84a94b"),
            trailColor: Color.valueOf("84a94b"),
            frontColor: Color.white,
            trailWidth: 2,
            trailLength: 5,

            hitEffect: Fx.flakExplosionBig,

            pierce: true,
            pierceBuilding: true,
            collidesAir: true,
            pierceCap: 2,

            knockback: 12,
            recoil: 2,

            intervalBullets: 3,
            bulletInterval: 1,
            intervalBullet: new Acid(18),
            fragBullets: 13,
            fragBullet: new Acid(18)
        })
    }))
trichocyst.parts.add(
    Object.assign(new RegionPart("-wing"), {
        mirror: true,
        x: 0.5,
        y: 0,
        rotation: -45,
        moveX: 0,
        moveY: 0,
        moveRot: 30,
        progress: DrawPart.PartProgress.smoothReload.sin(1, 5)
    }))

//空军T4
const centrosome = Insect("centrosome");
exports.centrosome = centrosome;
Object.assign(centrosome, {
    aiController: () => new FlyingFollowAI(),

    flying: true,
    drag: 0.06,
    speed: 1.25,
    rotateSpeed: 3.2,
    accel: 0.1,
    health: 3500,
    armor: 4,
    hitSize: 20,

    engineSize: 4.8,
    engineOffset: 12,
    constructor: () => new UnitEntity.create(),
    targetFlags: [BlockFlag.turret, null],
})
centrosome.parts.add(
    Object.assign(new RegionPart("-wing"), {
        mirror: true,
        x: 0.5,
        y: 1,
        rotation: -45,
        moveX: 0,
        moveY: 0,
        moveRot: 30,
        progress: DrawPart.PartProgress.smoothReload.sin(1, 5)
    }))
centrosome.weapons.add(Object.assign(new Weapon("vne-centrosome-weapon"), {
    x: 29 / 4,
    y: -11 / 4,
    shootY: 1.5,
    reload: 90,
    layerOffset: 0.01,
    rotate: false,
    alternate: false,
    shootCone: 180,
    baseRotation: -30,
    shoot: new ShootSpread(2, 10),
    shootSound: Sounds.plantBreak,
    bullet: Object.assign(new BasicBulletType(4, 210), {
        lifetime: 60,
        width: 16,
        height: 16,
        shrinkY: 0.3,
        homingPower: 0.1,
        homingDelay: 4,
        backSprite: "large-bomb-back",
        sprite: "mine-bullet",
        collidesGround: true,
        shootEffect: Fx.shootBig2,
        smokeEffect: Fx.shootSmokeDisperse,
        frontColor: Color.valueOf("84a94b7f"),
        backColor: Color.valueOf("84a94bff"),
        trailColor: Color.valueOf("84a94bff"),
        hitColor: Color.valueOf("84a94bff"),
        trailChance: 0.25,
        trailWidth: 3,
        trailLength: 5,
        trailRotation: true,
        trailEffect: Fx.disperseTrail,

        hitEffect: Fx.hitBulletColor,
        despawnEffect: Fx.hitBulletColor,

        fragBullets: 1,
        fragRandomSpread: 0,
        fragSpread: 0,
        fragVelocityMin: 1,
        fragVelocityMax: 1,
        fragLifeMin: 1,
        fragLifeMax: 1,
        fragBullet: Object.assign(new BasicBulletType(6, 66), {
            ammoMultiplier: 1,
            width: 7,
            height: 21,
            lifetime: 10,
            hitSize: 4,
            hitColor: Color.valueOf("84a94b"),
            backColor: Color.valueOf("84a94b"),
            trailColor: Color.valueOf("84a94b"),
            frontColor: Color.white,
            trailWidth: 2,
            trailLength: 5,

            hitEffect: Fx.flakExplosionBig,

            pierce: true,
            pierceBuilding: true,
            collidesAir: true,
            pierceCap: 2,

            knockback: 12,

            intervalBullets: 3,
            bulletInterval: 1,
            intervalBullet: new Acid(18),
            fragBullets: 13,
            fragBullet: new Acid(18)
        })
    })
}))

const nucleus = new Insect("nucleus");
exports.nucleus = nucleus;
Object.assign(nucleus, {
    aiController: () => new FlyingFollowAI(),
    flying: true,
    drag: 0.04,
    speed: 1.0,
    rotateSpeed: 2.8,
    accel: 0.08,
    health: 7000,
    armor: 6,
    hitSize: 28,
    engineSize: 6.5,
    engineOffset: 16,
    constructor: () => new UnitEntity.create(),
    targetFlags: [BlockFlag.turret, BlockFlag.core, null],
    range: 200,
})
nucleus.parts.add(
    Object.assign(new RegionPart("-wing"), {
        mirror: true,
        x: 2,
        y: 0,
        rotation: -45,
        moveX: 0,
        moveY: 0,
        moveRot: 30,
        progress: DrawPart.PartProgress.smoothReload.sin(1, 5)
    }),
    Object.assign(new RegionPart("-wing"), {
        mirror: true,
        x: -2,
        y: 4,
        rotation: 45,
        moveX: 0,
        moveY: 0,
        moveRot: -30,
        progress: DrawPart.PartProgress.smoothReload.sin(1, 5)
    }))
nucleus.weapons.add(
    Object.assign(new Weapon("vne-nucleus-weapon"), {
        x: 0,
        y: 0,
        shootY: 0,
        reload: 180,
        layerOffset: 0.01,
        rotate: true,
        rotateSpeed: 2.5,
        shootCone: 10,
        shootSound: Sounds.plantBreak,
        bullet: Object.assign(new BounceBulletType(8, 900, 40), {
            ammoMultiplier: 1,
            width: 7,
            height: 21,
            lifetime: 33.4,
            hitSize: 4,
            hitColor: Color.valueOf("84a94b"),
            backColor: Color.valueOf("84a94b"),
            trailColor: Color.valueOf("84a94b"),
            frontColor: Color.white,
            trailWidth: 2,
            trailLength: 5,

            hitEffect: Fx.flakExplosionBig,

            pierce: true,
            pierceBuilding: true,
            collidesAir: true,
            pierceCap: 4,

            knockback: 12,
            recoil: 2,

            intervalBullets: 3,
            bulletInterval: 1,
            intervalBullet: new Acid(18),
            fragBullets: 13,
            fragBullet: new Acid(18)
        })
    }),
    Object.assign(new PointDefenseWeapon("vne-nucleus-pd"), {
        mirror: true,
        x: 8,
        y: -6,
        reload: 4,
        targetInterval: 8,
        targetSwitchInterval: 10,
        shootSound: Sounds.shootMerui,
        bullet: Object.assign(new BulletType(), {
            shootEffect: Fx.shootSmall,
            hitEffect: Fx.pointHit,
            despawnEffect: Fx.none,
            maxRange: 120,
            damage: 8,
            pierce: false,
        })
    }))

//辅助T1
const bomber = new UnitType("bomber");
exports.bomber = bomber;
Object.assign(bomber, {
    constructor: () => new MechUnit.create(),
    speed: 1.2,
    armor: 3,
    hitSize: 6,
    health: 300,
    mechSideSway: 0.25,
    range: 40,
    targetAir: false,
    outlineColor: Pal.neoplasmOutline,
    envDisabled: Env.none,
    healFlash: true,
    healColor: Pal.neoplasm1,
    lightRadius: 0,
    researchCostMultiplier: 0,
})
bomber.abilities.add(
    new DeathNeoplasmAbility(18, 400),
    Object.assign(new RegenAbility(), {
        percentAmount: 1 / (90 * 60) * 100,
    }),)
bomber.immunities.add(status.neoplasmSlow)
bomber.weapons.add(
    Object.assign(new Weapon(), {
        shootOnDeath: true,
        reload: 24,
        shootCone: 180,
        ejectEffect: Fx.none,
        shootSound: Sounds.blockExplodeFlammable,
        x: 0,
        shootY: 0,
        mirror: false,
        minWarmup: 0.95,
        shootWarmupSpeed: 0.05,
        bullet: new ExplosionBulletType(110, 48),
    }))

//辅助T2
const cytoderm = new Insect("cytoderm");
exports.cytoderm = cytoderm;
Object.assign(cytoderm, {
    constructor: () => new ElevationMoveUnit.create(),
    speed: 0.62,
    armor: 13,
    hitSize: 14,
    health: 800,
    hovering: true,
    canDrown: false,
    omniMovement: false,
    rotateMoveFirst: true,
    shadowElevation: 0.1,

    drag: 0.07,
    rotateSpeed: 5,

    accel: 0.09,
    engineSize: 0,
})
cytoderm.weapons.add(
    Object.assign(new PointDefenseWeapon("vne-cytoderm-weapon"), {
        mirror: false,
        x: 0,
        y: 1,
        reload: 6,
        targetInterval: 10,
        targetSwitchInterval: 15,
        shootSound: Sounds.shootMerui,

        bullet: Object.assign(new BulletType(), {
            shootEffect: new Effect(32, 80, e => {
                Draw.color(Color.valueOf("befa9b"), Color.valueOf("8cca7e"), Color.gray, e.fin());

                Angles.randLenVectors(e.id, 8, e.finpow() * 60, e.rotation, 10, (x, y) => {
                    Fill.circle(e.x + x, e.y + y, 0.65 + e.fout() * 1.5);
                })
            }),
            hitEffect: new Effect(14, e => {
                Draw.color(Color.valueOf("befa9b"), Color.valueOf("8cca7e"), e.fin());
                Lines.stroke(0.5 + e.fout());

                Angles.randLenVectors(e.id, 2, 1 + e.fin() * 15, e.rotation, 50, (x, y) => {
                    let ang = Mathf.angle(x, y);
                    Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 3 + 1);
                })
            }),
            despawnEffect: Fx.none,
            maxRange: 100,
            damage: 10,
        })
    }))
cytoderm.abilities.add(
    new DamageDownAbility(24, 120),
    new ForceFieldAbility(40, 0.2, 400, 60 * 6))

//unit.vne-adenoma.name = 腺瘤
//辅助T3
const adenoma = new Insect("adenoma");
exports.adenoma = adenoma;
Object.assign(adenoma, {
    health: 980,
    speed: 2.5,
    flying: true,
    hitSize: 16,
    engineOffset: 11,
    armor: 4,
    accel: 0.08,
    drag: 0.016,
    itemCapacity: 0,
    constructor: () => new UnitEntity.create(),
    aiController: () => new extend(FlyingFollowAI, {

        updateMovement() {
            this.unloadPayloads();

            //moveTo前面加this
            //lookAt前面加this.unit
            if (this.target != null && this.unit.within(this.target, this.unit.type.range)) {
                this.unit.lookAt(this.target);
            } else if (this.following != null) {
                this.unit.lookAt(this.following);
            }

            if (Mathf.chance(1 / 60)) {
                this.following = Units.closest(
                    this.unit.team,
                    this.unit.x,
                    this.unit.y,
                    Math.max(this.unit.type.range, 400),
                    u => (!u.dead && u.type != this.unit.type), (u, x, y) => {
                        if (u.type.outlineColor == Pal.neoplasmOutline) {
                            return u.maxHealth + Mathf.dst2(u.x, u.y, x, y) / 6400 + u.getDuration(status.stimulated) * 100
                        } else {
                            return 4294967296
                            //好像是越小越优先
                        }
                    }
                    //先找血量最低且没状态的瘤液单位
                );
                //很奇怪,原版没有unit.dead()这个function
            }

            if (this.following != null) {
                this.moveTo(this.following, 40);
            } else if (this.target != null && this.unit.hasWeapons()) {
                this.moveTo(this.target, 80);
            }
        }
    })
})
adenoma.weapons.add(
    Object.assign(new Weapon("vne-adenoma-weapon"), {
        mirror: false,
        x: 0,
        y: 1,
        shootY: 4,
        reload: 30,
        cooldownTime: 40,
        heatColor: Color.valueOf("c33e2b"),
        shootSound: Sounds.shootScatter,
        bullet: extend(FlakBulletType, 4, 17, {
            lifetime: 48,
            recoil: 1.2,
            shootEffect: Fx.shootSmall,
            collidesGround: true,
            width: 6,
            height: 8,
            hitEffect: Fx.flakExplosion,
            splashDamage: 31,
            splashDamageRadius: 24,
            backColor: Color.valueOf("c33e2b"),
            trailColor: Color.valueOf("c33e2b"),
            trailWidth: 2,
            trailLength: 5,
            frontColor: Color.white,
            lightOpacity: 0.3,
            fragBullets: 5,
            fragBullet: Object.assign(new BasicBulletType(3, 7, "bullet"), {
                width: 5,
                height: 12,
                shrinkY: 1,
                lifetime: 20,
                backColor: Color.valueOf("c33e2b"),
                frontColor: Color.white,
                lightOpacity: 0.3,
                despawnEffect: Fx.none,
            }),
            puddles: 1,
            puddleRange: 0,
            puddleAmount: 70,
            puddleLiquid: Liquids.neoplasm,
            status: status.neoplasmSlow,
            statusDuration: 120,
        })
    }))
adenoma.abilities.add(
    new StatusFieldAbility(status.stimulated, 450, 300, 60))

const papilloma = new Insect("papilloma");
exports.papilloma = papilloma;
Object.assign(papilloma, {
    health: 1600,
    speed: 2.2,
    flying: true,
    hitSize: 18,
    engineOffset: 12,
    armor: 4,
    accel: 0.07,
    drag: 0.014,
    constructor: () => new UnitEntity.create(),
    aiController: () => new FlyingFollowAI(),
})
papilloma.abilities.add(
    new ForceFieldAbility(120, 0.25, 700, 60 * 8),
    extend(Ability, {
        update(unit) {
            Units.nearby(unit.team, unit.x, unit.y, 120, u => {
                if (u != unit && u.type.outlineColor == Pal.neoplasmOutline) {
                    Puddles.deposit(u.tileOn(), Liquids.neoplasm, 0.15)
                }
            });
        }
    }),
    new DeathNeoplasmAbility(30, 1500))
papilloma.immunities.add(status.neoplasmSlow)

const boltBrain = new MissileUnitType("bolt-brain");
exports.boltBrain = boltBrain;
Object.assign(boltBrain, {
    hitSize: 4,
    constructor: () => new TimedKillUnit.create(),
    trailColor: Color.valueOf("e05438"),
    engineColor: Color.valueOf("e05438"),
    engineSize: 1.75,
    engineLayer: Layer.effect,
    healColor: Color.valueOf("00000000"),
    speed: 2,
    lightOpacity: 0,
    maxRange: 6,
    lifetime: 160,
    outlineColor: Pal.neoplasmOutline,
    health: 1000,
    lowAltitude: true,
})
boltBrain.abilities.add(
    Object.assign(new RegenAbility(), {
        amount: -1 / 60,
    }),
    Object.assign(new EnergyFieldAbility(50, 20, 80), {
        status: StatusEffects.shocked,
        healEffect: Fx.none,
        healPercent: 0,
        displayHeal: false,
        color: Pal.lancerLaser,
    }))
boltBrain.weapons.add(
    Object.assign(new Weapon(), {
        shootCone: 360,
        mirror: false,
        reload: 1,
        shootOnDeath: true,
        bullet: Object.assign(new ExplosionBulletType(400, 35), {
            shootEffect: new MultiEffect(
                Fx.massiveExplosion,
                new WrapEffect(
                    Fx.dynamicSpikes,
                    Pal.lancerLaser, 24),
                Object.assign(new WaveEffect(), {
                    colorFrom: Pal.lancerLaser,
                    colorTo: Pal.lancerLaser,
                    sizeTo: 40,
                    lifetime: 12,
                    strokeFrom: 4,
                }))
        })
    }))

const carcinoma = new Insect("carcinoma");
exports.carcinoma = carcinoma;
Object.assign(carcinoma, {
    health: 2500,
    speed: 2.0,
    flying: true,
    hitSize: 24,
    engineOffset: 14,
    armor: 5,
    accel: 0.06,
    drag: 0.012,
    itemCapacity: 0,
    constructor: () => new UnitEntity.create(),

})
carcinoma.weapons.add(
    Object.assign(new Weapon(), {
        shootSound: Sounds.shootMissileLarge,
        x: 4,
        y: -11 / 4,
        mirror: true,
        alternate: false,
        shootY: 1.5,
        reload: 150,
        layerOffset: 0.01,
        rotate: false,
        bullet: Object.assign(new BulletType(), {
            spawnUnit: boltBrain,
            smokeEffect: Fx.shootBigSmoke2,
            speed: 0,
            keepVelocity: false,
        }),
        shootStatus: StatusEffects.slow,
        shootStatusDuration: 180,
    }))
carcinoma.immunities.add(status.neoplasmSlow);
//unit.vne-polyp.name = 息肉
//爬爬T1
const polyp = new UnitType("polyp");
exports.polyp = polyp;
Object.assign(polyp, {
    constructor: () => new CrawlUnit.create(),
    speed: 1,
    hitSize: 8,
    targetPriority: 1,
    health: 400,
    omniMovement: false,
    rotateSpeed: 2.5,
    segments: 3,
    drawBody: false,
    aiController: () => new HugAI(),

    segmentScl: 3,
    segmentPhase: 5,
    segmentMag: 0.5,
    outlineColor: Pal.neoplasmOutline,
    envDisabled: Env.none,
    healFlash: true,
    healColor: Pal.neoplasm1,
    lightRadius: 0,

    playerControllable: false,
    logicControllable: false,
    allowedInPayloads: false,
    useUnitCap: false,
    researchCostMultiplier: 0,
})
polyp.abilities.add(
    new DeathNeoplasmAbility(32, 800),
    new MoveLiquidAbility(Liquids.neoplasm, 12, 5, 1))
polyp.immunities.add(status.neoplasmSlow)

//unit.vne-sarcoma.name = 肉瘤
//爬爬T2
const sarcoma = new UnitType("sarcoma");
exports.sarcoma = sarcoma;
Object.assign(sarcoma, {
    constructor: () => new CrawlUnit.create(),
    speed: 0.8,
    hitSize: 14,
    targetPriority: 1,
    health: 1300,
    omniMovement: false,
    rotateSpeed: 2,
    segments: 3,
    drawBody: false,
    aiController: () => new HugAI(),

    segmentScl: 3,
    segmentPhase: 5,
    segmentMag: 0.5,
    outlineColor: Pal.neoplasmOutline,
    envDisabled: Env.none,
    healFlash: true,
    healColor: Pal.neoplasm1,
    lightRadius: 0,

    playerControllable: false,
    logicControllable: false,
    allowedInPayloads: false,
    useUnitCap: false,
    researchCostMultiplier: 0,
})
sarcoma.abilities.add(
    new DeathNeoplasmAbility(40, 2400),
    new MoveLiquidAbility(Liquids.neoplasm, 16, 5, 1),
    new SpawnDeathAbility(polyp, 3, 12))
sarcoma.immunities.add(status.neoplasmSlow)
sarcoma.weapons.add(
    Object.assign(new Weapon(), {
        top: false,
        mirror: false,
        shootSound: Sounds.shootFlame,
        reload: 15,
        recoil: 1,
        rotate: true,
        ejectEffect: Fx.none,
        bullet: extend(BulletType, 4, 40, {
            hitSize: 11,
            lifetime: 12,
            pierce: true,
            pierceBuilding: true,
            pierceCap: 2,
            shootEffect: new Effect(32, 80, e => {
                Draw.color(Color.valueOf("e8803f"), Color.valueOf("c33e2b"), Color.gray, e.fin());

                Angles.randLenVectors(e.id, 8, e.finpow() * 60, e.rotation, 10, (x, y) => {
                    Fill.circle(e.x + x, e.y + y, 0.65 + e.fout() * 1.5);
                })
            }),
            hitEffect: new Effect(14, e => {
                Draw.color(Color.valueOf("e8803f"), Color.valueOf("c33e2b"), e.fin());
                Lines.stroke(0.5 + e.fout());

                Angles.randLenVectors(e.id, 2, 1 + e.fin() * 15, e.rotation, 50, (x, y) => {
                    let ang = Mathf.angle(x, y);
                    Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 3 + 1);
                })
            }),
            despawnEffect: Fx.none,
            statusDuration: 60 * 2,
            status: status.neoplasmSlow,
            keepVelocity: false,
            hittable: false,
            update(b) {
                this.super$update(b);

                let tile = Vars.world.tileWorld(b.x, b.y);
                if (tile != null) {
                    Puddles.deposit(tile, Liquids.neoplasm, 12);
                }
            }
        })
    }))
/*
unit.vne-spore.name = 芽孢
unit.vne-mycelium.name = 菌丝体
unit.vne-sac.name = 瘤变囊
cocoon茧
*/
const spore = extend(UnitType, "spore", {
    u: [bomber, bomber, haploid, haploid, haploid, ribosome, ribosome, UnitTypes.renale, UnitTypes.renale],
    update(unit) {
        unit.heal(0.2);
        if (unit.getDuration(status.stimulated) > 1 || Time.time % 20 * 60 <= 1 || Time.delta >= 4 /*防卡顿*/) {
            let preSpawn = this.u[Math.floor(Math.random() * this.u.length)];

            if (Units.canCreate(unit.team, preSpawn)) {
                let spawnedUnit = preSpawn.spawn(unit.team, unit.x, unit.y);
                //继承状态
                spawnedUnit.apply(status.stimulated, unit.getDuration(status.stimulated))
            } else {
                mycelium.spawn(unit.team, unit.x, unit.y);
            }
            unit.remove();
        }
        if (unit.healthMultiplier < 8) {
            unit.healthMultiplier = 8
            //折合约960血,其实不算硬
        }
    }
})
exports.spore = spore;
Object.assign(spore, {
    drawCell: false,
    lightRadius: 0,
    envDisabled: Env.none,
    constructor: () => new UnitEntity.create(),
    flying: false,
    speed: 0,
    hitSize: 8,
    health: 120,
    armor: 20,
    targetPriority: -2,
    outlineColor: Pal.neoplasmOutline,
    healColor: Pal.neoplasm1,
    targetable: true,
    hittable: true,
    canAttack: false,
    hidden: false,
    isEnemy: false,
    playerControllable: false,
    logicControllable: false,
    allowedInPayloads: false,
})
spore.immunities.addAll(StatusEffects.corroded)

const mycelium = extend(UnitType, "mycelium", {
    u: [diploid, diploid, diploid, lysosome, lysosome, cytoderm],
    update(unit) {
        unit.heal(0.2)
        if (unit.getDuration(status.stimulated) > 1 || Time.time % 20 * 60 <= 1 || Time.delta >= 4 /*防卡顿*/) {
            let preSpawn = this.u[Math.floor(Math.random() * this.u.length)];

            if (Units.canCreate(unit.team, preSpawn)) {
                let spawnedUnit = preSpawn.spawn(unit.team, unit.x, unit.y);
                //继承状态
                spawnedUnit.apply(status.stimulated, unit.getDuration(status.stimulated))

                unit.remove();
            }
        }
        if (unit.healthMultiplier < 12) {
            unit.healthMultiplier = 12
            //折合约1200血,其实不算硬
        }
    }
})
exports.mycelium = mycelium;
Object.assign(mycelium, {
    drawCell: false,
    lightRadius: 0,
    envDisabled: Env.none,
    constructor: () => new UnitEntity.create(),
    flying: false,
    speed: 0,
    hitSize: 12,
    health: 100,
    armor: 30,
    targetPriority: -2,
    outlineColor: Pal.neoplasmOutline,
    healColor: Pal.neoplasm1,
    targetable: true,
    hittable: true,
    canAttack: false,
    hidden: false,
    isEnemy: false,
    playerControllable: false,
    logicControllable: false,
    allowedInPayloads: false,
})
mycelium.immunities.addAll(StatusEffects.corroded);

const sac = new extend(UnitType, "sac", {
    u: [triploid, triploid, triploid, trichocyst, trichocyst, adenoma, adenoma],
    update(unit) {
        unit.heal(0.2)
        if (unit.getDuration(status.stimulated) > 1 || Time.time % 60 * 60 <= 1 || Time.delta >= 4 /*防卡顿*/) {
            let preSpawn = this.u[Math.floor(Math.random() * this.u.length)];

            if (Units.canCreate(unit.team, preSpawn)) {
                let spawnedUnit = preSpawn.spawn(unit.team, unit.x, unit.y);
                //继承状态
                spawnedUnit.apply(status.stimulated, unit.getDuration(status.stimulated))

                unit.remove();
            }
        }
        if (unit.healthMultiplier < 20) {
            unit.healthMultiplier = 20
            //折合约1800血,其实不算硬
        }

    }
})
exports.sac = sac;
Object.assign(sac, {
    drawCell: false,
    lightRadius: 0,
    envDisabled: Env.none,
    constructor: () => new UnitEntity.create(),
    flying: false,
    speed: 0,
    hitSize: 16,
    health: 90,
    armor: 35,
    targetPriority: -2,
    outlineColor: Pal.neoplasmOutline,
    healColor: Pal.neoplasm1,
    targetable: true,
    hittable: true,
    canAttack: false,
    hidden: false,
    isEnemy: false,
    playerControllable: false,
    logicControllable: false,
    allowedInPayloads: false,
})
sac.immunities.addAll(StatusEffects.corroded);

//爬爬T3
const metastasis = new UnitType("metastasis");
exports.metastasis = metastasis;
Object.assign(metastasis, {
    constructor: () => new CrawlUnit.create(),
    speed: 0.67,
    hitSize: 16,
    targetPriority: 2,
    health: 1500,
    omniMovement: false,
    rotateSpeed: 2,
    segments: 3,
    drawBody: false,
    aiController: () => new HugAI(),

    segmentScl: 3,
    segmentPhase: 5,
    segmentMag: 1.5,
    crushDamage: 0.75,
    outlineColor: Pal.neoplasmOutline,
    envDisabled: Env.none,
    healFlash: true,
    healColor: Pal.neoplasm1,
    lightRadius: 0,
    researchCostMultiplier: 0,

    playerControllable: false,
    logicControllable: false,
    allowedInPayloads: false,
    useUnitCap: false,
})
metastasis.abilities.add(
    Object.assign(new LiquidRegenAbility(), {
        liquid: Liquids.neoplasm,
        slurpEffect: Fx.neoplasmHeal,
        slurpSpeed: 10,
        regenPerSlurp: 24,
    }),
    extend(Ability, {
        update(unit) {
            this.super$update(unit);

            unit.heal(0.5)
            if (unit.maxHealth < 6000) {
                unit.maxHealth = Math.min(6000, unit.maxHealth + 10);
            } else {
                unit.kill()
            }
        },
        death(unit) {
            unit.tileOn()
                .circle(unit.hitSize * 0.1875, cons(tile => {
                    if (tile != null) Puddles.deposit(tile, Liquids.neoplasm, 70);
                }))

            for (let i = 0; i < unit.maxHealth / 500; i++) {
                if (i <= 6) {
                    spore.spawn(unit.team, unit.x, unit.y);
                    if (Mathf.chance(0.5)) polyp.spawn(unit.team, unit.x, unit.y)
                } else {
                    mycelium.spawn(unit.team, unit.x, unit.y);
                    if (Mathf.chance(0.4)) sarcoma.spawn(unit.team, unit.x, unit.y)
                }
            }
        },
        localized() {
            return Core.bundle.format("ability.infinityGrowth");
        },
    }))
metastasis.immunities.add(status.neoplasmSlow)

const invasive = new UnitType("invasive");
exports.invasive = invasive;
Object.assign(invasive, {
    constructor: () => new CrawlUnit.create(),
    speed: 0.75,
    hitSize: 18,
    targetPriority: 2,
    health: 2000,
    omniMovement: false,
    rotateSpeed: 2.0,
    segments: 4,
    drawBody: false,
    aiController: () => new HugAI(),
    segmentScl: 3.5,
    segmentPhase: 5,
    segmentMag: 1.2,
    crushDamage: 1.0,
    outlineColor: Pal.neoplasmOutline,
    envDisabled: Env.none,
    healFlash: true,
    healColor: Pal.neoplasm1,
    lightRadius: 0,
    researchCostMultiplier: 0,
    playerControllable: false,
    logicControllable: false,
    allowedInPayloads: false,
    useUnitCap: false,
})
invasive.abilities.add(
    Object.assign(new LiquidRegenAbility(), {
        liquid: Liquids.neoplasm,
        slurpEffect: Fx.neoplasmHeal,
        slurpSpeed: 15,
        regenPerSlurp: 30,
    }),
    extend(Ability, {
        update(unit) {
            unit.heal(0.5);
            if (unit.maxHealth < 8000) {
                unit.maxHealth = Math.min(8000, unit.maxHealth + 10);
            } else {
                unit.kill()
            }
        },
        death(unit) {
            unit.tileOn()
                .circle(unit.hitSize * 0.1875, cons(tile => {
                    if (tile != null) Puddles.deposit(tile, Liquids.neoplasm, 70);
                }))

            for (let i = 0; i < unit.maxHealth / 2000; i++) {
                metastasis.spawn(unit.team, unit.x, unit.y);
            }
        },
        localized() {
            return Core.bundle.format("ability.infinityGrowth");
        }
    }))
invasive.immunities.add(status.neoplasmSlow)

UnitTypes.renale.hidden = false;
UnitTypes.renale.outlineColor = Pal.neoplasmOutline;
UnitTypes.renale.playerControllable = false;
UnitTypes.renale.logicControllable = false;
UnitTypes.renale.allowedInPayloads = false;
UnitTypes.renale.useUnitCap = false;
UnitTypes.renale.immunities.add(status.neoplasmSlow)

UnitTypes.latum.hidden = false;
UnitTypes.latum.outlineColor = Pal.neoplasmOutline;
UnitTypes.latum.immunities.add(status.neoplasmSlow)
UnitTypes.latum.abilities.addAll(
    Object.assign(new SpawnDeathAbility(metastasis, 4, 40), {
        randAmount: 8,
    }))


/*const mitosis = new extend(UnitType,"mitosis",{
    update(unit){
        if(Vars.state.rules.waveTeam != null && unit.team != Vars.state.rules.waveTeam){
            unit.team = Vars.state.rules.waveTeam
            unit.kill()
        }
    }
});
exports.mitosis = mitosis;
Object.assign(mitosis, {
    targetPriority: -1,
    speed: 0.4,
    drag: 0.1,
    hitSize: 15,
    rotateSpeed: 3,
    health: 450,
    armor: 1,
    stepShake: 0,
	
    legCount: 4,
    legLength: 14,
    lockLegBase: true,
    legContinuousMove: true,
    legExtension: -3,
    legBaseOffset: 5,
    legMaxLength: 1.1,
    legMinLength: 0.2,
    legLengthScl: 0.95,
    legForwardScl: 0.7,

    legMoveSpace: 1,
    hovering: true,
    allowLegStep: false,
    outlineColor: Pal.neoplasmOutline,
    envDisabled: Env.none,
    healFlash: true,
    healColor: Pal.neoplasm1,
    lightRadius: 0,

    shadowElevation: 0.2,
    groundLayer: 74,
    constructor: () => new LegsUnit.create()
})
mitosis.abilities.addAll(
    new UnitSpawnAbility(spore, 60 * 20, 0, 0),
    Object.assign(new SpawnDeathAbility(spore, 2, 20),{
        randAmount: 4,
    }),
    new DeathNeoplasmAbility(30, 1350),
    Object.assign(new RegenAbility(), {
        percentAmount: 1 / (90 * 60) * 100,
    }),
    Object.assign(new LiquidRegenAbility(), {
        liquid: Liquids.neoplasm,
        slurpEffect: Fx.neoplasmHeal,
        regenPerSlurp: 3.2
    })
);

const meiosis = new extend(UnitType,"meiosis",{
    update(unit){
        if(Vars.state.rules.waveTeam != null && unit.team != Vars.state.rules.waveTeam){
            unit.team = Vars.state.rules.waveTeam
            unit.kill()
        }
    }
});
exports.meiosis = meiosis;
Object.assign(meiosis, {
    targetPriority: -1,
    speed: 0.35,
    drag: 0.1,
    hitSize: 24,
    rotateSpeed: 3,
    health: 750,
    armor: 1,
    stepShake: 0,
	
    legCount: 4,
    legLength: 14,
    lockLegBase: true,
    legContinuousMove: true,
    legExtension: -3,
    legBaseOffset: 5,
    legMaxLength: 1.1,
    legMinLength: 0.2,
    legLengthScl: 0.95,
    legForwardScl: 0.7,

    legMoveSpace: 1,
    hovering: true,
    allowLegStep: false,
    outlineColor: Pal.neoplasmOutline,
    envDisabled: Env.none,
    healFlash: true,
    healColor: Pal.neoplasm1,
    lightRadius: 0,

    shadowElevation: 0.2,
    groundLayer: 74,
    constructor: () => new LegsUnit.create()
})
meiosis.abilities.addAll(
    new UnitSpawnAbility(spore, 60 * 20, -7.5, -4),
    new UnitSpawnAbility(spore, 60 * 20, 7.5, -4),
    new UnitSpawnAbility(mycelium, 60 * 40, 0, 0),
    Object.assign(new SpawnDeathAbility(spore, 4, 20),{
        randAmount: 4,
    }),
    Object.assign(new SpawnDeathAbility(mycelium, 1, 20),{
        randAmount: 2,
    }),
    new DeathNeoplasmAbility(48, 2250),
    Object.assign(new RegenAbility(), {
        percentAmount: 1 / (90 * 60) * 100,
    }),
    Object.assign(new LiquidRegenAbility(), {
        liquid: Liquids.neoplasm,
        slurpEffect: Fx.neoplasmHeal,
        regenPerSlurp: 3.2
    })
);*/