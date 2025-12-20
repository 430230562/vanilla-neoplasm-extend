const status = require('vne/status');
const liquid = require('vne/liquid');
const {
    Acid
} = require('vne/lib/bulletType');
const {
    DeathNeoplasmAbility, MoveLiquidAbility, DamageDownAbility
} = require("vne/lib/ability")

function Insect(name) {
    return extend(UnitType, name, {
        outlineColor: Pal.neoplasmOutline,
        envDisabled: Env.none,
        healFlash: true,
        healColor: Pal.neoplasm1,
        lightRadius: 0,
        engineSize: 0,
        init() {
            this.super$init();

            this.abilities.add(
            new DeathNeoplasmAbility(this.hitSize * 2, this.health),
            Object.assign(new RegenAbility(), {
                percentAmount: 1 / (90 * 60) * 100,
            }),
            Object.assign(new LiquidRegenAbility(), {
                liquid: Liquids.neoplasm,
                slurpEffect: Fx.neoplasmHeal,
                regenPerSlurp: 3.2
            }));
            this.immunities.add(status.neoplasmSlow)
        }
    })
}
exports.Insect = Insect;

const haploid = new Insect("haploid");
exports.haploid = haploid;
Object.assign(haploid, {
    speed: 0.75,
    drag: 0.11,
    hitSize: 11,
    rotateSpeed: 3,
    health: 200,
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
    reload: 25,
    cooldownTime: 42,
    shootSound: Sounds.plantBreak,
    heatColor: Color.valueOf("84a94b"),
    bullet: Object.assign(new MissileBulletType(3, 10), {
        backColor: Color.valueOf("84a94b"),
        frontColor: Color.valueOf("84a94b"),
        hitEffect: Fx.none,
        despawnEffect: Fx.none,
        trailColor: Color.valueOf("84a94b"),

        status: status.corroding,
        statusDuration: 120,

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

const diploid = new Insect("diploid")
exports.diploid = diploid;
Object.assign(diploid, {
    constructor: () => new LegsUnit.create(),

    speed: 0.65,
    drag: 0.4,
    hitSize: 12,
    rotateSpeed: 3,
    health: 540,
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
    shootSound: Sounds.artillery,
    heatColor: Color.valueOf("84a94b"),
    bullet: Object.assign(new ArtilleryBulletType(3, 20), {
        knockback: 0.8,
        lifetime: 80,
        width: 11,
        height: 11,
        collidesTiles: false,
        splashDamageRadius: 8 * 2.25,
        splashDamage: 60,

        backColor: Color.valueOf("84a94b"),
        frontColor: Color.valueOf("84a94b"),
        trailColor: Color.valueOf("84a94b"),

        lightOpacity: 0,

        status: status.corroding,
        statusDuration: 120,

        fragBullets: 2,
        fragBullet: new Acid(18)
    }),
    shootStatus: StatusEffects.slow,
    shootStatusDuration: 130,
}))

const polarBody = extend(MissileUnitType, "polar-body", {
    update(unit) {
        this.super$update(unit);
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
    health: 35,
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
    bullet: Object.assign(new ExplosionBulletType(170, 35), {
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

const triploid = new Insect("triploid");
exports.triploid = triploid;
Object.assign(triploid, {
    speed: 0.52,
    drag: 0.1,
    hitSize: 21,
    rotateSpeed: 3,
    health: 1100,
    armor: 4,

    fogRadius: 40,
    stepShake: 0,
    legCount: 6,
    legLength: 18,
    legGroupSize: 3,
    lockLegBase: true,
    legContinuousMove: true,
    legExtension: -3,
    legBaseOffset: 7,
    legMaxLength: 1.1,
    legMinLength: 0.2,
    legLengthScl: 0.95,
    legForwardScl: 0.9,

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
    shootSound: Sounds.missileLarge,
    x: 29 / 4,
    y: -11 / 4,
    shootY: 1.5,
    reload: 120,
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

const bivalents = new Insect("bivalents");
exports.bivalents = bivalents;
Object.assign(bivalents, {
    speed: 1,
    drag: 0.1,
    hitSize: 16,
    rotateSpeed: 3,
    health: 3500,
    armor: 9,
    targetPriority: 1,

    fogRadius: 40,
    stepShake: 0,
    legCount: 4,
    legLength: 18,
    legGroupSize: 3,
    lockLegBase: true,
    legContinuousMove: true,
    legExtension: -3,
    legBaseOffset: 7,
    legMaxLength: 1.1,
    legMinLength: 0.2,
    legLengthScl: 0.95,
    legForwardScl: 0.9,

    legMoveSpace: 1,
    hovering: true,

    shadowElevation: 0.2,
    groundLayer: 74,
    constructor: () => new LegsUnit.create(),
})
bivalents.weapons.add(
Object.assign(new Weapon("vne-bivalents-weapon"), {
    mirror: true,
    x: 8,
    y: 0,
    shootY: 4,
    reload: 20,
    shoot: new ShootSpread(2, 15),
    shootCone: 60,
    cooldownTime: 42,
    shootSound: Sounds.shotgun,
    bullet: Object.assign(new ShrapnelBulletType(), {
        length: 40,
        damage: 90,
        width: 13,
        lightOpacity: 0,
    })
}))

const ribosome = new Insect("ribosome");
exports.ribosome = ribosome;
Object.assign(ribosome, {
    constructor: () => new UnitEntity.create(),
    health: 180,
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
    reload: 25,
    shootCone: 60,
    cooldownTime: 42,
    shootSound: Sounds.plantBreak,
    heatColor: Color.valueOf("84a94b"),
    bullet: Object.assign(new MissileBulletType(3, 10), {
        backColor: Color.valueOf("84a94b"),
        frontColor: Color.valueOf("84a94b"),
        hitEffect: Fx.none,
        despawnEffect: Fx.none,
        trailColor: Color.valueOf("84a94b"),

        status: status.corroding,
        statusDuration: 120,

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

const lysosome = new Insect("lysosome");
exports.lysosome = lysosome;
Object.assign(lysosome, {
    constructor: () => new UnitEntity.create(),
    health: 420,
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
    bullet: Object.assign(new BombBulletType(27, 25), {
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

const trichocyst = new Insect("trichocyst");
exports.trichocyst = trichocyst;
Object.assign(trichocyst, {
    constructor: () => new UnitEntity.create(),
    health: 900,
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
    reload: 90,
    ejectEffect: Fx.none,
    shootSound: Sounds.plantBreak,
    bullet: Object.assign(new BasicBulletType(6, 200), {
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

const centrosome = Insect("centrosome");
exports.centrosome = centrosome;
Object.assign(centrosome, {
    aiController: () => new FlyingFollowAI(),

    flying: true,
    drag: 0.06,
    speed: 1.25,
    rotateSpeed: 3.2,
    accel: 0.1,
    health: 4000,
    armor: 5,
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
    reload: 120,
    layerOffset: 0.01,
    rotate: false,
    alternate: false,
    shootCone: 180,
    baseRotation: -30,
    shoot: new ShootSpread(2, 10),
    shootSound: Sounds.plantBreak,
    bullet: Object.assign(new BasicBulletType(4, 130), {
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

const bomber = new UnitType("bomber");
exports.bomber = bomber;
Object.assign(bomber, {
    constructor: () => new MechUnit.create(),
    speed: 1.2,
    armor: 3,
    hitSize: 6,
    health: 180,
    mechSideSway: 0.25,
    range: 40,
    targetAir: false,
    outlineColor: Pal.neoplasmOutline,
    envDisabled: Env.none,
    healFlash: true,
    healColor: Pal.neoplasm1,
    lightRadius: 0,
})
bomber.abilities.add(
new DeathNeoplasmAbility(18, 400),
Object.assign(new RegenAbility(), {
    percentAmount: 1 / (90 * 60) * 100,
}), )
bomber.immunities.add(status.neoplasmSlow)
bomber.weapons.add(
Object.assign(new Weapon(), {
    shootOnDeath: true,
    reload: 24,
    shootCone: 180,
    ejectEffect: Fx.none,
    shootSound: Sounds.explosion,
    x: 0,
    shootY: 0,
    mirror: false,
    shoot: Object.assign(new ShootPattern(), {
        firstShotDelay: 7.5
    }),
    bullet: new ExplosionBulletType(90, 48),
}))

const cytoderm = new Insect("cytoderm");
exports.cytoderm = cytoderm;
Object.assign(cytoderm, {
    constructor: () => new ElevationMoveUnit.create(),
    speed: 0.62,
    armor: 12,
    hitSize: 14,
    health: 700,
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
new DamageDownAbility(18, 120),
new ForceFieldAbility(40, 0.2, 400, 60 * 6))
cytoderm.immunities.add(status.neoplasmSlow)

const neoplasmUnit1 = new UnitType("neoplasm-unit-1");
exports.neoplasmUnit1 = neoplasmUnit1;
Object.assign(neoplasmUnit1, {
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
})
neoplasmUnit1.abilities.add(
new DeathNeoplasmAbility(32, 800),
new MoveLiquidAbility(Liquids.neoplasm, 12, 5, 1))
neoplasmUnit1.immunities.add(status.neoplasmSlow)

const neoplasmUnit2 = new UnitType("neoplasm-unit-2");
exports.neoplasmUnit2 = neoplasmUnit2;
Object.assign(neoplasmUnit2, {
    constructor: () => new CrawlUnit.create(),
    speed: 0.8,
    hitSize: 14,
    targetPriority: 1,
    health: 1200,
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
})
neoplasmUnit2.abilities.add(
new DeathNeoplasmAbility(40, 2400),
new MoveLiquidAbility(Liquids.neoplasm, 16, 5, 1),
new SpawnDeathAbility(neoplasmUnit1, 3, 40)
)
neoplasmUnit2.immunities.add(status.neoplasmSlow)
neoplasmUnit2.weapons.add(
Object.assign(new Weapon(), {
    top: false,
    shootSound: Sounds.flame,
    reload: 15,
    recoil: 1,
    ejectEffect: Fx.none,
    bullet: extend(BulletType, 4, 40, {
        hitSize: 7,
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


const s = new StatusEffect("s");
s.healthMultiplier = 5;
s.show = false;

const primeFruitingBody = extend(UnitType, "prime-fruiting-body", {
    u: [bomber, bomber, haploid, haploid, haploid, ribosome, ribosome],
    update(unit) {
        unit.heal(0.2)
        if (unit.shield >= 10 || Time.time % 20 * 60 <= 2) {
            this.u[Math.floor(Math.random() * this.u.length)].spawn(unit.team, unit.x, unit.y)

            unit.remove();
        }
        if (unit.getDuration(s) <= 10) {
            unit.apply(s, 20 * 60);
        }
    }
})
exports.primeFruitingBody = primeFruitingBody;
Object.assign(primeFruitingBody, {
    drawCell: false,
    lightRadius: 0,
    envDisabled: Env.none,
    constructor: () => new MechUnit.create(),
    speed: 0,
    hitSize: 4,
    health: 120,
    armor: 20,
    targetPriority: -2,
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
primeFruitingBody.immunities.addAll(status.corroding)

const seniorFruitingBody = extend(UnitType, "senior-fruiting-body", {
    u: [diploid, diploid, diploid, lysosome, lysosome, cytoderm],
    update(unit) {
        unit.heal(0.2)
        if (unit.shield >= 10 || Time.time % 40 * 60 <= 2) {
            this.u[Math.floor(Math.random() * this.u.length)].spawn(unit.team, unit.x, unit.y)

            unit.remove();
        }
        if (unit.getDuration(s) <= 10) {
            unit.apply(s, 20 * 60);
        }
    }
})
exports.seniorFruitingBody = seniorFruitingBody;
Object.assign(seniorFruitingBody, {
    drawCell: false,
    lightRadius: 0,
    envDisabled: Env.none,
    constructor: () => new MechUnit.create(),
    speed: 0,
    hitSize: 8,
    health: 130,
    armor: 30,
    targetPriority: -2,
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
seniorFruitingBody.immunities.addAll(status.corroding);


UnitTypes.renale.hidden = false;

UnitTypes.latum.hidden = false;
UnitTypes.latum.abilities.addAll(
Object.assign(new SpawnDeathAbility(primeFruitingBody, 20, 40), {
    randAmount: 10,
}),
Object.assign(new SpawnDeathAbility(seniorFruitingBody, 8, 40), {
    randAmount: 8,
}))

/*const cancer = new UnitType("cancer");
exports.cancer = cancer;
Object.assign(cancer, {
	constructor: () => new MechUnit.create(),
	speed: 0.67,
	armor: 0,
	hitSize: 6,
	health: 500,
	mechSideSway: 0.25,
    targetPriority: 2,
	targetAir: false,
	outlineColor: Pal.neoplasmOutline,
	envDisabled: Env.none,
	healFlash: true,
	healColor: Pal.neoplasm1,
	lightRadius: 0,
})
cancer.abilities.add(
    Object.assign(new RegenAbility(), {
		percentAmount: -1 / (100 * 60) * 100,
	}),
	Object.assign(new LiquidRegenAbility(), {
		liquid: Liquids.neoplasm,
		slurpEffect: Fx.neoplasmHeal,
		slurpSpeed: 27,
		regenPerSlurp: 3.2
	}),
	extend(Ability,{
	    update(unit){
	        this.super$update(unit);
	        
	        unit.maxHealth = Math.floor(Math.min(20000,Math.max(unit.health + 10,unit.maxHealth)))
	        unit.hitSize = Math.pow(unit.maxHealth / 500, 0.5) * 8
	    },
	    death(unit){
			unit.tileOn().circle(unit.hitSize * 0.75,cons(tile => {
				if(tile != null)Puddles.deposit(tile,Liquids.neoplasm,unit.maxHealth / 10);
			}))
			
			for(let i = 0;i < unit.maxHealth / 500;i++){
    			let u = primeFruitingBody.create(unit.team);
                u.set(unit.x, unit.y);
                u.rotation = unit.rotation;
                u.maxHealth = 120
                u.add();
            }
		},
	})
)*/

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
	new UnitSpawnAbility(primeFruitingBody, 60 * 20, 0, 0),
	Object.assign(new SpawnDeathAbility(primeFruitingBody, 2, 20),{
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
	new UnitSpawnAbility(primeFruitingBody, 60 * 20, -7.5, -4),
	new UnitSpawnAbility(primeFruitingBody, 60 * 20, 7.5, -4),
	new UnitSpawnAbility(seniorFruitingBody, 60 * 40, 0, 0),
	Object.assign(new SpawnDeathAbility(primeFruitingBody, 4, 20),{
		randAmount: 4,
	}),
	Object.assign(new SpawnDeathAbility(seniorFruitingBody, 1, 20),{
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