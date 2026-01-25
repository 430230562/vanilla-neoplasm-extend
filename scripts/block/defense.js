const item = require("vne/item");
const liquid = require("vne/liquid")
const status = require("vne/status");
const { UnlimitedPuddle } = require("vne/lib/ability");

const neoplasmCollecter = extend(Radar, "neoplasm-collecter", {
    outlineColor: Color.valueOf("4a4b53"),
    fogRadius: 14,
    hasLiquids: true,
    liquidCapacity: 300,
    hasPower: true,
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    requirements: ItemStack.with(
        Items.silicon, 40,
        item.siliconNitride, 10
    ),
    setBars() {
        this.super$setBars();

        this.addBar("liquid", func(e => new Bar(
        prov(() => {
            if (e.getLiquid() != null) {
                return e.getLiquid()
                    .liquid.localizedName
            } else {
                return Core.bundle.get("bar.liquid")
            }
        }),
        prov(() => {
            if (e.getLiquid() != null) {
                return e.getLiquid()
                    .liquid.color
            } else {
                return Color.white
            }
        }),
        floatp(() => {
            if (e.getLiquid() != null) {
                return e.getLiquid()
                    .amount / this.liquidCapacity
            } else {
                return 0
            }
        })

        )))
    }
});
exports.neoplasmCollecter = neoplasmCollecter;
neoplasmCollecter.consumePower(1);
neoplasmCollecter.buildType = prov(() => extend(Radar.RadarBuild, neoplasmCollecter, {
    getLiquid() {
        return {
            liquid: Liquids.neoplasm,
            amount: this.liquids.get(Liquids.neoplasm)
        }
    },
    updateTile(){
        this.super$updateTile();
        
        this.dumpLiquid(Liquids.neoplasm);
        
        this.tile.circle(this.fogRadius(),cons(tile => {
            let other = Puddles.get(tile);
            if (other != null && other.liquid == Liquids.neoplasm && this.liquids.get(Liquids.neoplasm) < this.block.liquidCapacity) {
                if(other.amount >= 1 * this.power.status){
                    this.liquids.add(Liquids.neoplasm, 1 * this.power.status);
                    other.amount -= 1 * this.power.status
                }else{
                    this.liquids.add(Liquids.neoplasm, other.amount);
                    other.remove();
                }
            }
        }))
    }
}))

const reinforcedForceProjector = new ForceProjector("reinforced-force-projector");
exports.reinforcedForceProjector = reinforcedForceProjector;
Object.assign(reinforcedForceProjector, {
    radius: 70.34,
    sides: 4,
    shieldRotation: 45,
    shieldHealth: 1200,
    consumeCoolant: false,
    hasLiquids: false,
    cooldownNormal: 40 / 60,
    cooldownBrokenBase: 50 / 60,
    phaseRadiusBoost: 0,
    phaseShieldBoost: 400,
    phaseUseTime: 600,
    size: 1,
    itemConsumer: new ConsumeItems([new ItemStack(item.siliconNitride, 1)]),
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    requirements: ItemStack.with(
    Items.silicon, 120,
    Items.oxide, 80,
    item.siliconNitride, 120, )
})
reinforcedForceProjector.consumePower(2);

const reinforcedForceProjectorLarge = new ForceProjector("reinforced-force-projector-large");
exports.reinforcedForceProjectorLarge = reinforcedForceProjectorLarge;
Object.assign(reinforcedForceProjectorLarge, {
    radius: 70.34 * 1.7725,
    sides: 8,
    shieldRotation: 22.5,
    shieldHealth: 3600,
    consumeCoolant: false,
    hasLiquids: false,
    cooldownNormal: 80 / 60,
    cooldownBrokenBase: 100 / 60,
    phaseRadiusBoost: 0,
    phaseShieldBoost: 800,
    phaseUseTime: 400,
    itemConsumer: new ConsumeItems([new ItemStack(item.siliconNitride, 1)]),
    size: 3,
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    requirements: ItemStack.with(
    Items.silicon, 250,
    Items.oxide, 175,
    Items.carbide, 105,
    item.siliconNitride, 230, )
})
reinforcedForceProjectorLarge.consumePower(6);

const coagulantIngotWall = new Wall("coagulant-ingot-wall");
exports.coagulantIngotWall = coagulantIngotWall;
Object.assign(coagulantIngotWall, {
    health: 720,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    buildVisibility: BuildVisibility.sandboxOnly,
    category: Category.defense,
    requirements: ItemStack.with(
    Items.tungsten, 2,
    item.coagulantIngot, 6, ),
})
coagulantIngotWall.buildType = prov(() => extend(Building, {
    collision(bullet) {
        this.super$collision(bullet);
        
        UnlimitedPuddle(this.tile, Liquids.neoplasm, bullet.damage);

        return true
    },
    onDestroyed() {
        UnlimitedPuddle(this.tile, Liquids.neoplasm, this.maxHealth);
    },
    onDeconstructed() {
        UnlimitedPuddle(this.tile, Liquids.neoplasm, this.maxHealth);
    }
}))

const coagulantIngotWallLarge = new Wall("coagulant-ingot-wall-large");
exports.coagulantIngotWallLarge = coagulantIngotWallLarge;
Object.assign(coagulantIngotWallLarge, {
    health: 720 * 4,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    size: 2,
    buildVisibility: BuildVisibility.sandboxOnly,
    category: Category.defense,
    requirements: ItemStack.with(
    Items.tungsten, 2 * 4,
    item.coagulantIngot, 6 * 4, ),
})
coagulantIngotWallLarge.buildType = prov(() => extend(Building, {
    collision(bullet) {
        this.super$collision(bullet);

        if (this.tile != null) this.tile.getLinkedTiles(cons(tile => {
            UnlimitedPuddle(tile, Liquids.neoplasm, bullet.damage * 1 / 4);
        }))

        return true
    },
    onDestroyed() {
        UnlimitedPuddle(this.tile, Liquids.neoplasm, this.maxHealth);
    },
    onDeconstructed() {
        UnlimitedPuddle(this.tile, Liquids.neoplasm, this.maxHealth);
    }
}))

const oxideWall = new Wall("oxide-wall");
exports.oxideWall = oxideWall;
Object.assign(oxideWall, {
    health: 900,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    update: true,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
    Items.tungsten, 2,
    Items.oxide, 6, ),
})
oxideWall.buildType = prov(() => extend(Building, {
    neop: 0,
    updateTile() {
        if (this.tile != null) {
            let puddle = Puddles.get(this.tile);

            if (puddle != null && puddle.liquid == Liquids.neoplasm) {
                if (puddle.amount > 0.01) {
                    puddle.amount -= 0.5
                    this.neop += 0.5
                } else {
                    puddle.remove();
                    this.neop += puddle.amount
                }
            }

            if (this.neop > this.maxHealth) {
                this.tile.setBlock(coagulantIngotWall, this.team)
            }
        }
    },
    //想卡掉血浆？没门!
    onDestroyed() {
        UnlimitedPuddle(this.tile, Liquids.neoplasm, this.neop);
    },
    onDeconstructed() {
        UnlimitedPuddle(this.tile, Liquids.neoplasm, this.neop);
        this.neop = 0
    },
    write(write) {
        this.super$write(write);
        write.f(this.neop);
    },
    read(read, revision) {
        this.super$read(read, revision);
        this.neop = read.f();
    }
}))

const oxideWallLarge = new Wall("oxide-wall-large");
exports.oxideWallLarge = oxideWallLarge;
Object.assign(oxideWallLarge, {
    health: 900 * 4,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    update: true,
    size: 2,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
    Items.tungsten, 2 * 4,
    Items.oxide, 6 * 4, ),
})
oxideWallLarge.buildType = prov(() => extend(Building, {
    neop: 0,
    updateTile() {
        if (this.tile != null) {
            this.tile.getLinkedTiles(cons(tile => {
                let puddle = Puddles.get(tile);

                if (puddle != null && puddle.liquid == Liquids.neoplasm) {
                    if (puddle.amount > 0.01) {
                        puddle.amount -= 0.5
                        this.neop += 0.5
                    } else {
                        puddle.remove();
                        this.neop += puddle.amount
                    }
                }


            }))
            if (this.neop > this.maxHealth) {
                this.tile.setBlock(coagulantIngotWallLarge, this.team)
            }
        }
    },
    //想卡掉血浆？没门!
    onDestroyed() {
        UnlimitedPuddle(this.tile, Liquids.neoplasm, this.neop);
    },
    onDeconstructed() {
        UnlimitedPuddle(this.tile, Liquids.neoplasm, this.neop);
        this.neop = 0
    },
    write(write) {
        this.super$write(write);
        write.f(this.neop);
    },
    read(read, revision) {
        this.super$read(read, revision);
        this.neop = read.f();
    }
}))

const siliconNitrideWall = new Wall("silicon-nitride-wall");
exports.siliconNitrideWall = siliconNitrideWall;
Object.assign(siliconNitrideWall,{
    health: 920,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    update: false,
    size: 1,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
        item.siliconNitride, 6
    ),
})

const siliconNitrideWallLarge = new Wall("silicon-nitride-wall-large");
exports.siliconNitrideWallLarge = siliconNitrideWallLarge;
Object.assign(siliconNitrideWallLarge,{
    health: 920 * 4,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    update: false,
    size: 2,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
        item.siliconNitride, 6 * 4
    ),
})

const biomassWall = new Wall("biomass-wall");
exports.biomassWall = biomassWall;
Object.assign(biomassWall, {
    health: 1200,
    armor: 20,
    size: 1,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
    item.biomassSteel, 6, ),
})
biomassWall.buildType = prov(() => extend(Building, {
    collision(bullet) {
        bullet.type.pierce = false;
        bullet.type.pierceBuilding = false;
        bullet.type.pierceDamageFactor = 0

        this.super$collision(bullet)

        return true
    }
}))

const biomassWallLarge = new Wall("biomass-wall-large");
exports.biomassWallLarge = biomassWallLarge;
Object.assign(biomassWallLarge, {
    health: 1200 * 4,
    armor: 20,
    size: 2,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
    item.biomassSteel, 6 * 4, ),
})
biomassWallLarge.buildType = prov(() => extend(Building, {
    collision(bullet) {
        bullet.type.pierce = false;
        bullet.type.pierceBuilding = false;
        bullet.type.pierceDamageFactor = 0

        this.super$collision(bullet)

        return true
    }
}))

const explosive = new Wall("explosive");
exports.explosive = explosive;
Object.assign(explosive, {
    health: 240,
    baseExplosiveness: 160,
    size: 1,
    buildCostMultiplier: 12,
    configurable: true,
    hasItems: true,
    itemCapacity: 36,
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    requirements: ItemStack.with(
    Items.beryllium, 10,
    Items.oxide, 5),
})
explosive.buildType = prov(() => extend(Building, {
    exploreItem: item.coagulantIngot,
    buildConfiguration(table) {
        table.button(Icon.upOpen, Styles.cleari, run(() => {
            this.kill()
        }))
    },
    drawSelect() {
        this.super$drawSelect();
        Drawf.dashCircle(this.x, this.y, 39, Color.red);
    },
    acceptItem(source, item) {
        return (item == this.exploreItem && this.items.get(this.exploreItem) < 36)
    },
    onDestroyed() {
        this.super$onDestroyed();

        //很奇怪，即使puddle.amount为0，地块依旧判断为存在血浆
        if (this.tile != null && this.items.get(this.exploreItem) > 0) this.tile.circle(5, cons(other => {
            UnlimitedPuddle(other, Liquids.neoplasm, this.items.get(this.exploreItem) * 5);
        }))
    },
    onDeconstructed() {
        if (this.items.get(this.exploreItem) > 0) UnlimitedPuddle(this.tile, Liquids.neoplasm, 60 * this.items.get(this.exploreItem));
    }
}))

const targetBullet = extend(BulletType, {
    speed: 0.01,
    damage: 0,
    collidesGround: false,
    collidesAir: false,
    collides: false,
    absorbable: false,
    hittable: false,
    lifetime: 60,
    hitEffect: Fx.none,
    despawnEffect: Fx.none,
    lightOpacity: 0,
})

const defuse = new ItemTurret("defuse");
exports.defuse = defuse;
Object.assign(defuse,{
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
    recoil: 2,
    range: 125,
    shootCone: 40,
    scaledHealth: 210,
    rotateSpeed: 3,

    coolant: new ConsumeLiquid(Liquids.nitrogen, 4 / 60),
    
    buildVisibility: BuildVisibility.shown,
    category: Category.turret,
    requirements: ItemStack.with(
    Items.graphite, 200,
    Items.silicon, 200,
    Items.oxide, 125,
    item.siliconNitride, 100,
    ),
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
        hitEffect: Fx.hitSquaresColor,
        despawnEffect: Fx.hitSquaresColor,
        status: status.antagonistic,
        statusDuration: 300,
        update(b) {
            this.super$update(b);

            let tile = Vars.world.tileWorld(b.x, b.y);
            let puddle = Puddles.get(tile);
            if(puddle != null && puddle.liquid == Liquids.neoplasm){
                puddle.remove();
                b.type.despawnEffect.at(b.x,b.y);
            }
        }
    }),
    Items.oxide, extend(BasicBulletType,{
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
        hitEffect: Fx.hitSquaresColor,
        despawnEffect: Fx.hitSquaresColor,
        status: status.antagonistic,
        statusDuration: 300,
        update(b) {
            this.super$update(b);

            let tile = Vars.world.tileWorld(b.x, b.y);
            let puddle = Puddles.get(tile);
            if(puddle != null && puddle.liquid == Liquids.neoplasm){
                puddle.remove();
                b.type.despawnEffect.at(b.x,b.y);
            }
        }
    })
)
defuse.buildType = prov(() => extend(ItemTurret.ItemTurretBuild, defuse, {
    findTarget() {
        this.super$findTarget()

        if (this.target == null) {
            this.tile.circle((this.block.range - 1) / 8, cons(tile => {
                let other = Puddles.get(tile);
                if (other != null && other.liquid == Liquids.neoplasm && this.target == null) {
                    this.target = targetBullet.create(this, Team.derelict, tile.worldx(), tile.worldy(), this.rotation - 180)
                }
            }))
        }
    }
}))
defuse.drawer = new DrawTurret("reinforced-");
//defuse.drawer.parts.add();
/*drawer = new DrawTurret("reinforced-"){{
    parts.add(new RegionPart("-front"){{
        progress = PartProgress.warmup;
        moveRot = -10f;
        mirror = true;
        moves.add(new PartMove(PartProgress.recoil, 0f, -3f, -5f));
        heatColor = Color.red;
    }});
}};*/

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
    despawned(b) {
        this.super$despawned(b);

        let tile = Vars.world.tileWorld(b.x, b.y);
        UnlimitedPuddle(tile, Liquids.neoplasm, b.damage * 0.5);
    },
    hit(b, x, y) {
        this.super$hit(b, x, y);

        //记忆中这样写会爆栈，其实不会
        let tile = Vars.world.tileWorld(x, y);
        UnlimitedPuddle(tile, Liquids.neoplasm, b.damage * 0.5);
    }
}))

//升华
Blocks.sublimate.ammoTypes.put(
liquid.ammonia, Object.assign(new ContinuousFlameBulletType(), {
    damage: 960 / 12,
    rangeChange: 5.5 * 8,
    ammoMultiplier: 15 / 18,
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
}))

//泰坦
Blocks.titan.ammoTypes.put(
item.coagulantIngot, extend(ArtilleryBulletType, 2.5, 240, "shell", {
    hitEffect: new MultiEffect(Fx.titanExplosionLarge, Fx.titanSmokeLarge, Fx.smokeAoeCloud),
    despawnEffect: Fx.none,
    knockback: 2,
    lifetime: 190,
    height: 19,
    width: 17,
    splashDamageRadius: 110,
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
                UnlimitedPuddle(other, Liquids.neoplasm, 30);
            }))
        }
    }
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
    despawned(b) {
        this.super$despawned(b);

        let tile = Vars.world.tileWorld(b.x, b.y);
        UnlimitedPuddle(tile, Liquids.neoplasm, b.damage);
    },
    hit(b, x, y) {
        this.super$hit(b, x, y);

        //记忆中这样写会爆栈，其实不会
        let tile = Vars.world.tileWorld(x, y);
        UnlimitedPuddle(tile, Liquids.neoplasm, b.damage);
    },
    update(b) {
        this.super$update(b);

        let tile = Vars.world.tileWorld(b.x, b.y);
        if (b.time >= 12) {
            UnlimitedPuddle(tile, Liquids.neoplasm, 5);
        }
    }
}))