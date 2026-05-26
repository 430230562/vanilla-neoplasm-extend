const item = require("vne/item");
const liquid = require("vne/liquid")
const status = require("vne/status");
const {
    ReduceArmorBulletType
} = require("vne/lib/bulletType");
const {
    ToxicAbility
} = require("vne/lib/ability");

const passable = new Stat("passable", StatCat.function);
const coolingAmount = new Stat("coolingamount", StatCat.function);

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
    item.siliconNitride, 10),
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
    updateTile() {
        this.super$updateTile();

        this.dumpLiquid(Liquids.neoplasm);

        this.tile.circle(this.fogRadius(), cons(tile => {
            let other = Puddles.get(tile);
            if (other != null && other.liquid == Liquids.neoplasm && this.liquids.get(Liquids.neoplasm) < this.block.liquidCapacity) {
                if (other.amount >= 1 * this.power.status) {
                    this.liquids.add(Liquids.neoplasm, 1 * this.power.status);
                    other.amount -= 1 * this.power.status
                } else {
                    this.liquids.add(Liquids.neoplasm, other.amount);
                    other.remove();
                }
            }
        }))
    }
}))

const reinforcedForceProjector = extend(ForceProjector, "reinforced-force-projector", {
    radius: 70.34,
    sides: 4,
    shieldRotation: 45,
    shieldHealth: 1600,
    consumeCoolant: false,
    hasLiquids: false,
    cooldownNormal: 10 / 60,
    cooldownBrokenBase: 20 / 60,
    size: 1,
    phaseRadiusBoost: 0,
    //phaseShieldBoost: 1200,
    //phaseUseTime: 300,
    //itemConsumer: new ConsumeItems([new ItemStack(item.siliconNitride, 1)]),
    //coolantConsumer: new ConsumeLiquid(liquid.naturalGas, 0.1),
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    requirements: ItemStack.with(
    Items.silicon, 75,
    Items.tungsten, 45,
    Items.oxide, 80,
    item.siliconNitride, 120),

    setStats() {
        this.super$setStats();

        this.stats.add(passable, false);

        this.stats.remove(Stat.booster);

        
    },
    setBars() {
        this.super$setBars();

        this.removeBar("liquid")
    }
});
reinforcedForceProjector.buildType = prov(() => extend(ForceProjector.ForceBuild, reinforcedForceProjector, {
    updateTile() {
        this.super$updateTile();

        let realRadius = this.realRadius();
        //嘻嘻，我一定要成为解构大佬
        let {
            x, y, broken, team, block, buildup, hit
        } = this

        if (realRadius > 0 && !broken) {
            Units.nearbyEnemies(null, x, y, realRadius, unit => {
                if (unit.team != team && Intersector.isInRegularPolygon(block.sides, x, y, realRadius, block.shieldRotation, unit.x, unit.y)) {
                    if (unit.isMissile()) {
                        unit.kill()

                        buildup += unit.health * 2 * Vars.state.rules.unitDamage(unit.team)
                        block.hitSound.at(unit.x, unit.y, 1 + Mathf.range(0.1), block.hitSoundVolume);
                        block.absorbEffect.at(unit);
                        hit = 1
                    }
                    //stop
                    unit.vel.setZero();
                    //get out
                    unit.impulse(
                    Math.cos(Angles.angle(x, y, unit.x, unit.y) * Math.PI / 180) * unit.type.hitSize * unit.type.hitSize,
                    Math.sin(Angles.angle(x, y, unit.x, unit.y) * Math.PI / 180) * unit.type.hitSize * unit.type.hitSize)

                    if (Mathf.chanceDelta(0.12 * Time.delta)) {
                        Fx.circleColorSpark.at(unit.x, unit.y, team.color);
                    }
                }
            })
        }
    }
}))
reinforcedForceProjector.consumePower(2);

const reinforcedForceProjectorLarge = extend(ForceProjector, "reinforced-force-projector-large", {
    radius: 70.34 * 1.7725,
    sides: 8,
    shieldRotation: 22.5,
    shieldHealth: 8000,
    consumeCoolant: false,
    hasLiquids: false,
    cooldownNormal: 20 / 60,
    cooldownBrokenBase: 40 / 60,
    phaseRadiusBoost: 0,
    //phaseShieldBoost: 2400,
    //phaseUseTime: 150,
    size: 3,
    //itemConsumer: new ConsumeItems([new ItemStack(item.siliconNitride, 1)]),
    //coolantConsumer: new ConsumeLiquid(liquid.naturalGas, 0.1),
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,
    requirements: ItemStack.with(
    Items.silicon, 275,
    Items.oxide, 175,
    Items.carbide, 135,
    item.siliconNitride, 300),

    setStats() {
        this.super$setStats();

        this.stats.add(passable, false);

        this.stats.remove(Stat.booster);

        
    },
    setBars() {
        this.super$setBars();

        this.removeBar("liquid")
    }
});
reinforcedForceProjectorLarge.buildType = prov(() => extend(ForceProjector.ForceBuild, reinforcedForceProjectorLarge, {
    updateTile() {
        this.super$updateTile();

        let realRadius = this.realRadius();
        //嘻嘻，我一定要成为解构大佬
        let {
            x, y, broken, team, block, buildup, hit
        } = this

        if (realRadius > 0 && !broken) {
            Units.nearbyEnemies(null, x, y, realRadius, unit => {
                if (unit.team != team && Intersector.isInRegularPolygon(block.sides, x, y, realRadius, block.shieldRotation, unit.x, unit.y)) {
                    if (unit.isMissile()) {
                        unit.kill()

                        buildup += unit.health * 2 * Vars.state.rules.unitDamage(unit.team)
                        block.hitSound.at(unit.x, unit.y, 1 + Mathf.range(0.1), block.hitSoundVolume);
                        block.absorbEffect.at(unit);
                        hit = 1
                    }
                    //stop
                    unit.vel.setZero();
                    //get out
                    unit.impulse(
                    Math.cos(Angles.angle(x, y, unit.x, unit.y) * Math.PI / 180) * unit.type.hitSize * unit.type.hitSize,
                    Math.sin(Angles.angle(x, y, unit.x, unit.y) * Math.PI / 180) * unit.type.hitSize * unit.type.hitSize)

                    if (Mathf.chanceDelta(0.12 * Time.delta)) {
                        Fx.circleColorSpark.at(unit.x, unit.y, team.color);
                    }
                }
            })
        }
    }
}))
reinforcedForceProjectorLarge.consumePower(6);

const forceProjectorCondenser = extend(Block, "force-projector-condenser", {
    update: true,
    health: 240,
    size: 1,
    solid: true,
    replaceable: false,
    hasShadow: true,
    hasLiquids: true,
    hasItems: true,
    hasPower: true,
    conductivePower: true,
    liquidCapacity: 15,
    coolingAmount: 20,
    buildVisibility: BuildVisibility.shown,
    category: Category.effect,

    setStats() {
        this.super$setStats();

        //this.stats.remove(Stat.booster);

        this.stats.add(coolingAmount, this.coolingAmount, StatUnit.perSecond);

        /*if(this.itemConsumer && this.itemConsumer instanceof ConsumeItems){
        this.stats.add(Stat.booster, StatValues.itemBoosters("+{0} " + StatUnit.shieldHealth.localized(), this.stats.timePeriod, this.phaseShieldBoost, this.phaseRadiusBoost, this.itemConsumer.items));
        }*/
    },
    setBars() {
        this.super$setBars();

        //this.removeBar("liquid")
    }
})
forceProjectorCondenser.buildType = prov(() => extend(Building, {
    updateTile() {
        // 提前检查并确定倍率
        let hasHydrogen = this.liquids.get(Liquids.hydrogen) > 0.0001;
        let mul = hasHydrogen ? 2.5 : 1;
        let cooldown = (20 / 60) * mul;

        let shouldConsume = false;
        let hasProcessedProjector = false;

        for (let i = 0; i < 4; i++) {
            const p = Geometry.d4[i];
            const other = this.nearby(p.x, p.y);

            // 提前退出条件
            if (!other || !(other.block instanceof ForceProjector)) continue;

            hasProcessedProjector = true;

            if (other.buildup >= cooldown) {
                other.buildup = Math.max(0, other.buildup - cooldown);
                shouldConsume = true;
            }
        }

        // 只在找到力场投影器且满足条件时消耗氢气
        if (hasProcessedProjector && shouldConsume && hasHydrogen) {
            this.liquids.remove(Liquids.hydrogen, 1.5 / 60);
        }
    },
    acceptLiquid(source, liquid) {
        return (liquid == Liquids.hydrogen && this.liquids.get(Liquids.hydrogen) < 15)
    }
}))

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

        Puddles.deposit(this.tile, Liquids.neoplasm, bullet.damage);

        return true
    },
    onDestroyed() {
        Puddles.deposit(this.tile, Liquids.neoplasm, this.maxHealth);
    },
    onDeconstructed() {
        Puddles.deposit(this.tile, Liquids.neoplasm, this.maxHealth);
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
            Puddles.deposit(tile, Liquids.neoplasm, bullet.damage * 1 / 4);
        }))

        return true
    },
    onDestroyed() {
        Puddles.deposit(this.tile, Liquids.neoplasm, this.maxHealth);
    },
    onDeconstructed() {
        Puddles.deposit(this.tile, Liquids.neoplasm, this.maxHealth);
    }
}))

const oxideWall = new Wall("oxide-wall");
exports.oxideWall = oxideWall;
Object.assign(oxideWall, {
    health: 900,
    armor: 5,
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
        Puddles.deposit(this.tile, Liquids.neoplasm, this.neop);
    },
    onDeconstructed() {
        Puddles.deposit(this.tile, Liquids.neoplasm, this.neop);
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
    armor: 5,
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
        Puddles.deposit(this.tile, Liquids.neoplasm, this.neop);
    },
    onDeconstructed() {
        Puddles.deposit(this.tile, Liquids.neoplasm, this.neop);
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
Object.assign(siliconNitrideWall, {
    health: 960,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    update: false,
    size: 1,
    buildCostMultiplier: 24,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
    item.siliconNitride, 6),
})

const siliconNitrideWallLarge = new Wall("silicon-nitride-wall-large");
exports.siliconNitrideWallLarge = siliconNitrideWallLarge;
Object.assign(siliconNitrideWallLarge, {
    health: 960 * 4,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    update: false,
    size: 2,
    buildCostMultiplier: 24,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
    item.siliconNitride, 6 * 4),
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

        if (bullet.type.speed >= 0.1) {
            bullet.remove()

            bullet.type.hitEffect.at(bullet.x, bullet.y)

            let eventuallyDamage = Math.max(bullet.damage * bullet.type.buildingDamageMultiplier - this.block.armor, 0)
            this.damage(eventuallyDamage * Vars.state.rules.blockDamage(bullet.team))
        } else {
            //激光电弧
            this.super$collision(bullet)
        }

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
        if (bullet.type.speed >= 0.1) {
            bullet.remove()
            bullet.type.hitEffect.at(bullet.x, bullet.y)

            let eventuallyDamage = Math.max(bullet.damage * bullet.type.buildingDamageMultiplier - this.block.armor, 0)
            this.damage(eventuallyDamage * Vars.state.rules.blockDamage(bullet.team))
        } else {
            //激光电弧
            this.super$collision(bullet)
        }

        return true
    }
}))

const nickelWall = new Wall("nickel-wall");
exports.nickelWall = nickelWall;
Object.assign(nickelWall, {
    health: 360,
    armor: 1,
    size: 1,
    alwaysUnlocked: true,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
    item.nickel, 6, ),
})

const nickelWallLarge = new Wall("nickel-wall-large");
exports.nickelWallLarge = nickelWallLarge;
Object.assign(nickelWallLarge, {
    health: 360 * 4,
    armor: 1,
    size: 2,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
    item.nickel, 6 * 4, ),
})

Blocks.constructor.filter.add(siliconNitrideWallLarge, biomassWallLarge)

const explosive = new Wall("explosive");
exports.explosive = explosive;
Object.assign(explosive, {
    health: 240,
    baseExplosiveness: 160,
    size: 1,
    buildCostMultiplier: 12,
    configurable: true,
    hasItems: true,
    itemCapacity: 15,
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
            Puddles.deposit(other, Liquids.neoplasm, this.items.get(this.exploreItem) * 5);
        }))
    },
    onDeconstructed() {
        if (this.items.get(this.exploreItem) > 0) Puddles.deposit(this.tile, Liquids.neoplasm, 60 * this.items.get(this.exploreItem));
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
    item.siliconNitride, 100, ),
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
            //b.type.despawnEffect.at(b.x, b.y);
        }
    }
}))
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
/*drawer = new DrawTurret("reinforced-"){{
    parts.add(new RegionPart("-front"){{
        progress = PartProgress.warmup;
        moveRot = -10f;
        mirror = true;
        moves.add(new PartMove(PartProgress.recoil, 0f, -3f, -5f));
        heatColor = Color.red;
    }});
}};*/

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