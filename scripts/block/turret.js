const item = require("vne/item");
const liquid = require("vne/liquid")
const status = require("vne/status");
const effect = require("vne/effect");
const {
    ReduceArmorBulletType, PercentDamageBulletType, BounceBulletType
} = require("vne/lib/bulletType");
const {
    ToxicAbility
} = require("vne/lib/ability");

const passable = new Stat("passable", StatCat.function);
const coolingAmount = new Stat("coolingamount", StatCat.function);

const targetBullet = extend(BulletType, {
    speed: 0.01,
    damage: 0,
    collidesGround: false,
    collidesAir: false,
    collides: false,
    absorbable: false,
    hittable: false,
    lifetime: 180,
    hitEffect: Fx.none,
    despawnEffect: Fx.none,
    lightOpacity: 0,
})

const defuse = new ItemTurret("defuse");
exports.defuse = defuse;
Object.assign(defuse, {
    shoot: new ShootSpread(15, 4),

    coolantMultiplier: 45,

    inaccuracy: 0.2,
    velocityRnd: 0.02,
    shake: 1,
    ammoPerShot: 2,
    maxAmmo: 30,
    consumeAmmoOnce: true,
    targetUnderBlocks: false,

    shootSound: Sounds.shootDiffuse,

    shootY: 5,
    outlineColor: Pal.darkOutline,
    size: 3,
    reload: 90,
    recoil: 4,
    range: 125,
    shootCone: 40,
    scaledHealth: 210,
    rotateSpeed: 3,
    heatColor: Color.valueOf("8D79C8a8"),

    coolant: new ConsumeLiquid(Liquids.nitrogen, 4 / 60),

    buildVisibility: BuildVisibility.shown,
    category: Category.turret,
    requirements: ItemStack.with(
        Items.graphite, 200,
        Items.silicon, 200,
        Items.oxide, 125,
        item.siliconNitride, 100,),
})
defuse.ammo(
    Items.graphite, extend(BasicBulletType, {
        speed: 4,
        damage: 0,
        knockback: 3,
        width: 25,
        hitSize: 7,
        height: 20,
        shootEffect: Fx.shootBigColor,
        smokeEffect: Fx.shootSmokeSquareSparse,
        ammoMultiplier: 1,
        reloadMultiplier: 0.34,
        hitColor: Pal.graphiteAmmoBack,
        backColor: Pal.graphiteAmmoBack,
        trailColor: Pal.graphiteAmmoBack,
        frontColor: Pal.graphiteAmmoFront,
        trailWidth: 6,
        trailLength: 6,
        removeAfterPierce: false,
        pierce: true,
        pierceBuilding: true,
        hitEffect: Fx.hitSquaresColor,
        despawnEffect: Fx.hitSquaresColor,
        status: status.antagonistic,
        statusDuration: 300,
        update(b) {
            this.super$update(b);

            let tile = Vars.world.tileWorld(b.x, b.y);
            let puddle = Puddles.get(tile);
            if (puddle != null && puddle.liquid == Liquids.neoplasm) {
                puddle.remove();
                b.type.despawnEffect.at(b.x, b.y);
            }
        }
    }),
    Items.oxide, extend(BasicBulletType, {
        speed: 4,
        damage: 0,
        knockback: 3,
        width: 25,
        hitSize: 7,
        height: 20,
        shootEffect: Fx.shootBigColor,
        smokeEffect: Fx.shootSmokeSquareSparse,
        ammoMultiplier: 2,
        hitColor: Color.valueOf("a0b380"),
        backColor: Color.valueOf("a0b380"),
        trailColor: Color.valueOf("a0b380"),
        frontColor: Color.valueOf("e4ffd6"),
        trailWidth: 6,
        trailLength: 6,
        removeAfterPierce: false,
        pierce: true,
        pierceBuilding: true,
        hitEffect: Fx.hitSquaresColor,
        despawnEffect: Fx.hitSquaresColor,
        status: status.antagonistic,
        statusDuration: 300,
        update(b) {
            this.super$update(b);

            let tile = Vars.world.tileWorld(b.x, b.y);
            let puddle = Puddles.get(tile);
            if (puddle != null && puddle.liquid == Liquids.neoplasm) {
                puddle.remove();
                b.type.despawnEffect.at(b.x, b.y);
            }
        }
    }),
    item.siliconNitride, extend(BasicBulletType, {
        speed: 4,
        lifetime: 34,
        damage: 5,
        knockback: 8,
        width: 25,
        hitSize: 7,
        height: 20,
        rangeChange: 11,
        shootEffect: Fx.shootBigColor,
        smokeEffect: Fx.shootSmokeSquareSparse,
        ammoMultiplier: 3,
        hitColor: Color.valueOf("8D79C8"),
        backColor: Color.valueOf("8D79C8"),
        trailColor: Color.valueOf("8D79C8"),
        frontColor: Color.white,
        trailWidth: 6,
        trailLength: 6,
        removeAfterPierce: false,
        pierce: true,
        pierceBuilding: true,
        hitEffect: Fx.hitSquaresColor,
        despawnEffect: Fx.hitSquaresColor,
        status: status.antagonistic,
        statusDuration: 300,
        update(b) {
            this.super$update(b);

            let tile = Vars.world.tileWorld(b.x, b.y);
            let puddle = Puddles.get(tile);
            if (puddle != null && puddle.liquid == Liquids.neoplasm) {
                puddle.remove();
                b.type.despawnEffect.at(b.x, b.y);
            }
        }
    })
)
defuse.buildType = prov(() => extend(ItemTurret.ItemTurretBuild, defuse, {
    findTarget() {
        if (this.target == null) {
            this.tile.circle((this.block.range - 1) / 8, cons(tile => {
                let other = Puddles.get(tile);
                if (other != null && other.liquid == Liquids.neoplasm && this.target == null) {
                    this.target = targetBullet.create(this, Team.derelict, tile.worldx(), tile.worldy(), this.rotation - 180)
                }
            }))
        } else {
            this.super$findTarget()
        }
    }
}))
defuse.drawer = new DrawTurret("reinforced-");
defuse.drawer.parts.add(
    Object.assign(new RegionPart("-side"), {
        heatProgress: DrawPart.PartProgress.recoil,
        progress: DrawPart.PartProgress.warmup,
        mirror: true,
        moveX: 2,
        moveY: 0,
        moveRot: -10,
        under: true,
        heatColor: Color.valueOf("8D79C8a8")
    }))


Blocks.duo.ammoTypes.put(
    item.nickel, Object.assign(new BasicBulletType(3, 7), {
        width: 7,
        height: 9,
        lifetime: 60,
        ammoMultiplier: 3,
        reloadMultiplier: 1.2,
        hitEffect: Fx.hitBulletColor,
        despawnEffect: Fx.hitBulletColor,
        hitColor: Pal.copperAmmoBack,
        backColor: Pal.copperAmmoBack,
        trailColor: Pal.copperAmmoBack,
        frontColor: Pal.copperAmmoFront,
    }))

//撕裂
Blocks.breach.ammoTypes.put(
    item.coagulantIngot, extend(BasicBulletType, 7.5, 85, {
        width: 12,
        hitSize: 7,
        height: 20,
        shootEffect: new MultiEffect(Fx.shootBigColor, Fx.colorSparkBig),
        smokeEffect: Fx.shootBigSmoke,
        ammoMultiplier: 1,
        pierceCap: 3,
        lifetime: 27.5,
        rangeChange: 2 * 8,
        reloadMultiplier: 0.75,
        pierce: true,
        pierceBuilding: true,
        hitColor: Color.valueOf("c33e2b"),
        backColor: Color.valueOf("c33e2b"),
        trailColor: Color.valueOf("c33e2b"),
        frontColor: Color.white,
        trailWidth: 2.1,
        trailLength: 10,
        hitEffect: Fx.hitBulletColor,
        despawnEffect: Fx.hitBulletColor,
        buildingDamageMultiplier: 0.3,
        status: status.neoplasmSlow,
        statusDuration: 120,

        puddles: 1,
        puddleRange: 0,
        puddleAmount: 70,
        puddleLiquid: Liquids.neoplasm
    }))
Blocks.breach.ammoTypes.put(
    item.siliconNitride, Object.assign(new BasicBulletType(8, 60), {
        width: 12,
        hitSize: 7,
        height: 20,
        shootEffect: new MultiEffect(Fx.shootBigColor, Fx.colorSparkBig),
        smokeEffect: Fx.shootBigSmoke,
        ammoMultiplier: 4,
        pierceCap: 1,
        knockback: 6,
        lifetime: 22.5,
        rangeChange: 4 * 8,
        reloadMultiplier: 0.8,
        pierce: true,
        pierceBuilding: true,
        hitColor: Color.valueOf("8D79C8"),
        backColor: Color.valueOf("8D79C8"),
        trailColor: Color.valueOf("8D79C8"),
        frontColor: Color.white,
        trailWidth: 2.1,
        trailLength: 10,
        hitEffect: Fx.hitBulletColor,
        despawnEffect: Fx.hitBulletColor,
        buildingDamageMultiplier: 0.3,
        status: StatusEffects.slow,
        statusDuration: 10,

        fragBullets: 3,
        fragRandomSpread: 0,
        fragSpread: 30 / 2,
        fragVelocityMin: 6,
        fragVelocityMax: 6,
        fragLifeMin: 1,
        fragLifeMax: 1,
        fragBullet: Object.assign(new BasicBulletType(), {
            damage: 40,
            width: 12,
            hitSize: 7,
            height: 20,
            shootEffect: new MultiEffect(Fx.shootBigColor, Fx.colorSparkBig),
            smokeEffect: Fx.shootBigSmoke,
            lifetime: 10,
            pierce: true,
            pierceBuilding: true,
            hitColor: Color.valueOf("8D79C8"),
            backColor: Color.valueOf("8D79C8"),
            trailColor: Color.valueOf("8D79C8"),
            frontColor: Color.white,
            trailWidth: 2.1,
            trailLength: 10,
            hitEffect: Fx.hitBulletColor,
            despawnEffect: Fx.hitBulletColor,
            buildingDamageMultiplier: 0.3,
            status: StatusEffects.slow,
            statusDuration: 10,
        })
    }))
Blocks.breach.ammoTypes.put(
    item.biomassSteel, Object.assign(new ReduceArmorBulletType(8, 400, 4), {
        width: 12,
        hitSize: 12,
        height: 20,
        shootEffect: new MultiEffect(Fx.shootBigColor, Fx.colorSparkBig),
        smokeEffect: Fx.shootBigSmoke,
        ammoMultiplier: 4,
        pierceCap: 1,
        knockback: 6,
        lifetime: 32,
        rangeChange: 8 * 8,
        reloadMultiplier: 0.5,
        pierce: true,
        pierceBuilding: true,
        hitColor: Color.valueOf("7EA341"),
        backColor: Color.valueOf("7EA341"),
        trailColor: Color.valueOf("7EA341"),
        frontColor: Color.white,
        trailWidth: 2.1,
        trailLength: 10,
        hitEffect: Fx.hitBulletColor,
        despawnEffect: Fx.hitBulletColor,
        shootSound: Sounds.shootBreachCarbide,
        buildingDamageMultiplier: 0.3,
    }))

Blocks.diffuse.ammoTypes.put(
    item.cyanide, extend(BasicBulletType, {
        speed: 4,
        damage: 20,
        knockback: 3,
        width: 25,
        hitSize: 7,
        height: 20,
        shootEffect: Fx.shootBigColor,
        smokeEffect: Fx.shootSmokeSquareSparse,
        ammoMultiplier: 3,
        hitColor: Color.valueOf("89e8b6"),
        backColor: Color.valueOf("89e8b6"),
        trailColor: Color.valueOf("89e8b6"),
        frontColor: Color.valueOf("89e8b6"),

        trailEffect: effect.cyanideTail,

        removeAfterPierce: false,
        pierce: true,
        pierceBuilding: true,
        hitEffect: Fx.hitSquaresColor,
        despawnEffect: Fx.hitSquaresColor,
        status: status.poisoned,
        statusDuration: 300,
    })
)

//升华
Blocks.sublimate.ammoTypes.put(
    liquid.ammonia, Object.assign(new ContinuousFlameBulletType(), {
        damage: 960 / 12,
        rangeChange: 5.5 * 8,
        ammoMultiplier: 1,
        length: 130 + 5.5 * 8,
        knockback: 1.2,
        pierceCap: 4,
        buildingDamageMultiplier: 0.3,
        timescaleDamage: true,

        colors: [
            Color.valueOf("79CFCEE6"),
            Color.valueOf("9ADBDACC"),
            Color.valueOf("BCE7E7B3"),
            Color.valueOf("DDF3F399"),
            Color.valueOf("FFFFFF80")],

        flareColor: Color.valueOf("57c3c2"),
        lightColor: Color.valueOf("57c3c2"),
        hitColor: Color.valueOf("57c3c2"),
    })
)
Blocks.sublimate.ammoTypes.put(
    liquid.naturalGas, Object.assign(new ContinuousFlameBulletType(), {
        damage: 630 / 12,
        length: 130,
        knockback: 3,
        pierceCap: 2,
        buildingDamageMultiplier: 0.3,
        timescaleDamage: true,

        colors: [
            Color.valueOf("8ca9e6e6"),
            Color.valueOf("a9beecCC"),
            Color.valueOf("c6d4f2B3"),
            Color.valueOf("e2eaf99a"),
            Color.valueOf("FFFFFF80")],

        flareColor: Color.valueOf("a9beec"),
        lightColor: Color.valueOf("a9beec"),
        hitColor: Color.valueOf("a9beec")
    })
)

//泰坦
Blocks.titan.ammoTypes.put(
    item.coagulantIngot, extend(ArtilleryBulletType, 2.5, 240, "shell", {
        hitEffect: new MultiEffect(Fx.titanExplosionLarge, Fx.titanSmokeLarge, Fx.smokeAoeCloud),
        despawnEffect: Fx.none,
        knockback: 2,
        lifetime: 190,
        height: 19,
        width: 17,
        splashDamageRadius: 88,
        rangeChange: -8,
        splashDamage: 40,
        reloadMultiplier: 0.6,
        scaledSplashDamage: true,
        hitColor: Color.valueOf("c33e2b"),
        backColor: Color.valueOf("c33e2b"),
        trailColor: Color.valueOf("c33e2b"),
        frontColor: Color.valueOf("c33e2b"),
        ammoMultiplier: 1,
        hitSound: Sounds.explosionTitan,

        trailLength: 32,
        trailWidth: 3.35,
        trailSinScl: 2.5,
        trailSinMag: 0.5,
        trailEffect: Fx.vapor,
        trailInterval: 3,
        despawnShake: 7,

        shootEffect: Fx.shootTitan,
        smokeEffect: Fx.shootSmokeTitan,

        trailInterp: v => Math.max(Mathf.slope(v), 0.8),
        shrinkX: 0.2,
        shrinkY: 0.1,
        buildingDamageMultiplier: 0.25,
        status: status.neoplasmSlow,
        statusDuration: 300,
        despawned(b) {
            this.super$despawned(b);

            let tile = Vars.world.tileWorld(b.x, b.y);
            if (tile != null) {
                tile.circle(11, cons(other => {
                    if (Mathf.chance(0.125)) Puddles.deposit(other, Liquids.neoplasm, 20);
                }))
            }
        }
    }))

Blocks.titan.ammoTypes.put(
    item.siliconNitride, Object.assign(new ArtilleryBulletType(2.5, 200, "shell"), {
        hitEffect: new MultiEffect(Fx.titanExplosion, Fx.titanSmoke),
        despawnEffect: Fx.none,
        knockback: 2,
        lifetime: 190,
        height: 17,
        width: 15,
        splashDamageRadius: 65,
        splashDamage: 120,
        rangeChange: 12,
        reloadMultiplier: 1.25,
        scaledSplashDamage: true,
        hitColor: Color.valueOf("8D79C8"),
        backColor: Color.valueOf("8D79C8"),
        trailColor: Color.valueOf("8D79C8"),
        frontColor: Color.valueOf("8D79C8"),
        ammoMultiplier: 1,
        hitSound: Sounds.explosionTitan,

        trailLength: 32,
        trailWidth: 3.35,
        trailSinScl: 2.5,
        trailSinMag: 0.5,
        trailEffect: Fx.vapor,
        trailInterval: 3,
        despawnShake: 7,

        shootEffect: Fx.shootTitan,
        smokeEffect: Fx.shootSmokeTitan,

        trailInterp: v => Math.max(Mathf.slope(v), 0.8),
        shrinkX: 0.2,
        shrinkY: 0.1,
        buildingDamageMultiplier: 0.25,
        fragBullets: 13,
        fragBullet: Object.assign(new BasicBulletType(6, 9), {
            width: 1,
            height: 1,
            lifetime: 600,
            drag: 0.1,
            shrinkX: 0,
            shrinkY: 0,
            collidesAir: false,
            pierce: true,
            pierceBuilding: true,
            buildingDamageMultiplier: 0.25,
            hitEffect: Fx.none,
            despawnEffect: Fx.none,
            lightOpacity: 0,
            backColor: Color.valueOf("8D79C8"),
            frontColor: Color.valueOf("8D79C8"),
        })
    }))

const bottle = new UnitType("bottle");
Object.assign(bottle, {
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
    lifetime: 60 * 15,
    health: 10000,
    drawMinimap: false,
    flying: false,
    drawCell: false,
    deathSound: Sounds.none,
})
bottle.abilities.add(
    new ToxicAbility(20, 15, 96))
bottle.immunities.addAll(status.poisoned);

Blocks.titan.ammoTypes.put(
    item.cyanide, Object.assign(new ArtilleryBulletType(2.5, 200, "shell"), {
        hitEffect: new MultiEffect(Fx.titanExplosion, Fx.titanSmoke),
        despawnEffect: Fx.none,
        knockback: 2,
        lifetime: 190,
        height: 17,
        width: 15,
        splashDamageRadius: 65,
        splashDamage: 120,
        rangeChange: 12,
        reloadMultiplier: 1.25,
        scaledSplashDamage: true,
        hitColor: Color.valueOf("89e8b6"),
        backColor: Color.valueOf("89e8b6"),
        trailColor: Color.valueOf("89e8b6"),
        frontColor: Color.valueOf("89e8b6"),
        ammoMultiplier: 1,
        hitSound: Sounds.explosionTitan,

        trailLength: 32,
        trailWidth: 3.35,
        trailSinScl: 2.5,
        trailSinMag: 0.5,
        trailEffect: Fx.vapor,
        trailInterval: 3,
        despawnShake: 7,

        shootEffect: Fx.shootTitan,
        smokeEffect: Fx.shootSmokeTitan,

        trailInterp: v => Math.max(Mathf.slope(v), 0.8),
        shrinkX: 0.2,
        shrinkY: 0.1,
        buildingDamageMultiplier: 0.25,
        fragBullets: 1,
        fragBullet: Object.assign(new BasicBulletType(6, 9), {
            despawnUnit: bottle,
            lifetime: 1
        })
    }))

//驱离
Blocks.disperse.ammoTypes.put(
    item.coagulantIngot, extend(BasicBulletType, 8, 45, {
        width: 16,
        height: 16,
        shrinkY: 0.3,
        backSprite: "large-bomb-back",
        sprite: "mine-bullet",
        velocityRnd: 0.1,
        collidesGround: false,
        collidesTiles: false,
        shootEffect: Fx.shootBig2,
        smokeEffect: Fx.shootSmokeDisperse,
        frontColor: Color.white,
        backColor: Color.valueOf("c33e2b"),
        trailColor: Color.valueOf("c33e2b"),
        hitColor: Color.valueOf("c33e2b"),
        trailChance: 0.44,
        ammoMultiplier: 4,
        rangeChange: 20,
        lifetime: 44,

        rotationOffset: 90,
        trailRotation: true,
        trailEffect: Fx.disperseTrail,

        hitEffect: Fx.hitBulletColor,
        despawnEffect: Fx.hitBulletColor,
        status: status.neoplasmSlow,
        statusDuration: 120,

        puddles: 1,
        puddleRange: 0,
        puddleAmount: 70,
        puddleLiquid: Liquids.neoplasm,
        update(b) {
            this.super$update(b);

            let tile = Vars.world.tileWorld(b.x, b.y);
            if (b.time >= 12) {
                Puddles.deposit(tile, Liquids.neoplasm, 3);
            }
        }
    }))
Blocks.disperse.ammoTypes.put(
    item.siliconNitride, Object.assign(new BasicBulletType(), {
        damage: 37,
        speed: 8,
        lifetime: 48,
        rangeChange: 40,
        width: 16,
        height: 16,
        shrinkY: 0.3,
        knockback: 3,
        backSprite: "large-bomb-back",
        sprite: "mine-bullet",
        collidesGround: false,
        collidesTiles: false,
        shootEffect: Fx.shootBig2,
        smokeEffect: Fx.shootSmokeDisperse,
        frontColor: Color.valueOf("ffffff7f"),
        backColor: Color.valueOf("8D79C8ff"),
        trailColor: Color.valueOf("8D79C8ff"),
        hitColor: Color.valueOf("8D79C8ff"),
        trailChance: 0.33,
        trailRotation: true,
        trailEffect: Fx.disperseTrail,

        hitEffect: Fx.hitBulletColor,
        despawnEffect: Fx.hitBulletColor,

        status: StatusEffects.slow,
        statusDuration: 10,

        fragBullets: 3,
        fragRandomSpread: 0,
        fragSpread: 30 / 2,
        fragVelocityMin: 6,
        fragVelocityMax: 6,
        fragLifeMin: 1,
        fragLifeMax: 1,
        fragBullet: Object.assign(new BasicBulletType(), {
            damage: 15,
            width: 8,
            hitSize: 7,
            height: 8,
            backSprite: "large-bomb-back",
            sprite: "mine-bullet",
            shootEffect: new MultiEffect(Fx.shootBigColor, Fx.colorSparkBig),
            smokeEffect: Fx.shootBigSmoke,
            lifetime: 10,
            pierce: true,
            collidesGround: false,
            collidesTiles: false,
            hitColor: Color.valueOf("8D79C8"),
            backColor: Color.valueOf("8D79C8"),
            trailColor: Color.valueOf("8D79C8"),
            frontColor: Color.white,
            trailWidth: 1,
            trailLength: 10,

            hitEffect: Fx.hitBulletColor,
            despawnEffect: Fx.hitBulletColor,
            status: StatusEffects.slow,
            statusDuration: 10,
        })
    }))

//seltis
function AddCoolant(turret, amount) {
    return turret.coolant = turret.consumeCoolant(amount);
}

const skyfire = new ItemTurret("skyfire");
exports.skyfire = skyfire;
Object.assign(skyfire, {
    reload: 3 * 60,
    range: 70 * 8,
    shootCone: 10,
    unitSort: UnitSorts.farthest,
    health: 3300,
    size: 4,
    rotateSpeed: 3,
    recoil: 0.5,
    recoilTime: 30,
    shake: 5,
    maxAmmo: 40,
    ammoPerShot: 16,
    targetAir: false,
    coolantMultiplier: 0.75,
    shootSound: Sounds.explosionArtilleryShockBig,
    category: Category.turret,
    buildVisibility: BuildVisibility.shown,
    /*requirements: ItemStack.with(
        Items.graphite, 200,
        Items.silicon, 100,
        item.nickel, 450,
        item.manganese, 350,
        item.chromium, 150,
        item.organistal, 150,
    ),*/
})
skyfire.ammo(
    Items.pyratite, Object.assign(new ArtilleryBulletType(3, 160, "shell"), {
        hitEffect: new MultiEffect(
            Fx.titanExplosion,
            Fx.titanSmoke),
        despawnEffect: Fx.none,
        knockback: 2,
        lifetime: 160,
        height: 31,
        width: 17,
        splashDamageRadius: 72,
        splashDamage: 850,
        scaledSplashDamage: true,
        backColor: Color.valueOf("d9c668cd"),
        hitColor: Color.valueOf("d9c668cd"),
        trailColor: Color.valueOf("d9c668cd"),
        frontColor: Color.white,
        ammoMultiplier: 1,
        hitSound: Sounds.explosionArtilleryShockBig,

        status: StatusEffects.blasted,

        trailLength: 32,
        trailWidth: 3.35,
        trailSinScl: 2.5,
        trailSinMag: 0.5,
        trailEffect: Fx.none,
        despawnShake: 7,

        shootEffect: Fx.shootTitan,
        smokeEffect: new MultiEffect(
            Fx.shootSmokeTitan,
            Fx.shootSmokeTitan,
            Fx.shootSmokeTitan
        ),

        trailInterp: v => Math.max(Mathf.slope(v), 0.8),
        shrinkX: 0.2,
        shrinkY: 0.1,

        fragBullets: 9,
        fragRandomSpread: 5,
        fragSpread: 90 / 8,
        fragVelocityMin: 3,
        fragVelocityMax: 5,
        fragLifeMin: 4,
        fragLifeMax: 8,
        fragBullet: Object.assign(new BasicBulletType(1, 25), {
            ammoMultiplier: 1,
            width: 7,
            height: 21,
            lifetime: 1,
            hitSize: 4,
            hitColor: Pal.lightOrange,
            backColor: Pal.lightOrange,
            trailColor: Pal.lightOrange,
            frontColor: Color.white,
            trailWidth: 6,
            trailLength: 11,

            hitEffect: Fx.flakExplosionBig,

            collidesAir: false,

            status: StatusEffects.blasted,
            statusDuration: 60,
        })
    })
)

const extinction = new ItemTurret("extinction")
exports.extinction = extinction;
Object.assign(extinction, {
    category: Category.turret,
    buildVisibility: BuildVisibility.shown,
    inaccuracy: 1,
    shake: 2,
    shootY: 4,
    health: 6500,
    outlineColor: Pal.darkOutline,
    size: 5,
    reload: 60,
    cooldownTime: 40,
    recoil: 3,
    range: 350,
    shootCone: 5,
    rotateSpeed: 1.5,
    shootSound: Sounds.shootTank,
})
AddCoolant(extinction, 0.3)
extinction.ammo(
    item.biomassSteel, Object.assign(new PercentDamageBulletType(6, 270, 10), {
        shootEffect: new MultiEffect(
            Fx.shootTitan,
            Object.assign(new WaveEffect(), {
                colorTo: Color.valueOf("cc163a7f"),
                sizeTo: 26,
                lifetime: 14,
                strokeFrom: 4,
            })),
        lifetime: 66.7,
        smokeEffect: Fx.shootSmokeTitan,
        hitColor: Color.valueOf("cc163a7f"),

        //sprite: "large-orb",
        trailEffect: Fx.missileTrail,
        trailInterval: 3,
        trailParam: 4,
        pierce: true,
        fragOnHit: false,
        speed: 5,
        width: 24,
        height: 24,
        backColor: Color.valueOf("cc163a7f"),
        frontColor: Color.white,
        shrinkX: 0,
        shrinkY: 0,
        trailColor: Color.valueOf("cc163a7f"),
        trailLength: 12,
        trailWidth: 2.2,
        knockback: 5,
        despawnEffect: Object.assign(new ExplosionEffect(), {
            waveColor: Color.valueOf("cc163a7f"),
            smokeColor: Color.gray,
            sparkColor: Pal.sap,
            waveStroke: 4,
            waveRad: 40,
        }),
        hitEffect: Object.assign(new ExplosionEffect(), {
            waveColor: Color.valueOf("cc163a7f"),
            smokeColor: Color.gray,
            sparkColor: Pal.sap,
            waveStroke: 4,
            waveRad: 40,
        }),
        despawnSound: Sounds.blockExplodeFlammable,
        status: StatusEffects.sapped,

        intervalBullet: Object.assign(new BasicBulletType(3, 36), {
            width: 9,
            hitSize: 5,
            height: 15,
            pierce: true,
            lifetime: 24,
            pierceBuilding: true,
            hitColor: Color.valueOf("cc163a7f"),
            backColor: Color.valueOf("cc163a7f"),
            trailColor: Color.valueOf("cc163a7f"),
            frontColor: Color.white,
            sprite: "large-orb",
            trailWidth: 2.1,
            trailLength: 5,
            hitEffect: Object.assign(new WaveEffect(), {
                colorFrom: Color.valueOf("cc163a7f"),
                colorTo: Color.valueOf("cc163a7f"),
                sizeTo: 4,
                strokeFrom: 4,
                lifetime: 10,
            }),
            despawnEffect: Object.assign(new WaveEffect(), {
                colorFrom: Color.valueOf("cc163a7f"),
                colorTo: Color.valueOf("cc163a7f"),
                sizeTo: 4,
                strokeFrom: 4,
                lifetime: 10,
            }),
            status: StatusEffects.sapped,

            fragBullets: 1,
            fragRandomSpread: 0,
            fragSpread: 0,
            fragBullet: Object.assign(new ShrapnelBulletType(), {
                length: 24,
                damage: 8,
                width: 9,
                status: StatusEffects.sapped,
            })
        }),

        bulletInterval: 3,
        intervalRandomSpread: 0,
        intervalBullets: 2,
        intervalAngle: 180,
        intervalSpread: 90,

        fragBullets: 6,
        fragVelocityMin: 0.5,
        fragVelocityMax: 0.5,
        fragRandomSpread: 0,
        fragSpread: 60,

        fragBullet: Object.assign(new ShrapnelBulletType(), {
            length: 64,
            damage: 160,
            width: 13,
            fromColor: Color.valueOf("cc163a7f"),
            toColor: Color.valueOf("00000000"),
            pierce: true,
        })
    })
)