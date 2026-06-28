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
        //嘻嘻,我一定要成为解构大佬
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
                        Math.cos(Angles.angle(x, y, unit.x, unit.y) * Math.PI / 180) * unit.type.hitSize * unit.type.hitSize * 16,
                        Math.sin(Angles.angle(x, y, unit.x, unit.y) * Math.PI / 180) * unit.type.hitSize * unit.type.hitSize * 16)

                    if (Mathf.chanceDelta(0.12 * Time.delta)) {
                        Fx.circleColorSpark.at(unit.x, unit.y, team.color);
                    }
                }
            })
        }
    }
}))
reinforcedForceProjector.consumePower(2);
exports.reinforcedForceProjector = reinforcedForceProjector;

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
        //嘻嘻,我一定要成为解构大佬
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
                        Math.cos(Angles.angle(x, y, unit.x, unit.y) * Math.PI / 180) * unit.type.hitSize * unit.type.hitSize * 16,
                        Math.sin(Angles.angle(x, y, unit.x, unit.y) * Math.PI / 180) * unit.type.hitSize * unit.type.hitSize * 16)

                    if (Mathf.chanceDelta(0.12 * Time.delta)) {
                        Fx.circleColorSpark.at(unit.x, unit.y, team.color);
                    }
                }
            })
        }
    }
}))
reinforcedForceProjectorLarge.consumePower(6);
exports.reinforcedForceProjectorLarge = reinforcedForceProjectorLarge;

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
exports.forceProjectorCondenser = forceProjectorCondenser;

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
        item.coagulantIngot, 6,),
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
        item.coagulantIngot, 6 * 4,),
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
        Items.oxide, 6,),
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
        Items.oxide, 6 * 4,),
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
        item.biomassSteel, 6,),
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
        item.biomassSteel, 6 * 4,),
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
        item.nickel, 6,),
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
        item.nickel, 6 * 4,),
})

const manganeseWall = new Wall("manganese-wall");
exports.manganeseWall = manganeseWall;
Object.assign(manganeseWall, {
    health: 480,
    armor: 3,
    size: 1,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
        item.manganese, 6,),
})

const manganeseWallLarge = new Wall("manganese-wall-large");
exports.manganeseWallLarge = manganeseWallLarge;
Object.assign(manganeseWallLarge, {
    health: 480 * 4,
    armor: 3,
    size: 2,
    buildVisibility: BuildVisibility.shown,
    category: Category.defense,
    requirements: ItemStack.with(
        item.manganese, 6 * 4,),
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

        //很奇怪,即使puddle.amount为0,地块依旧判断为存在血浆
        if (this.tile != null && this.items.get(this.exploreItem) > 0) this.tile.circle(5, cons(other => {
            Puddles.deposit(other, Liquids.neoplasm, this.items.get(this.exploreItem) * 5);
        }))
    },
    onDeconstructed() {
        if (this.items.get(this.exploreItem) > 0) Puddles.deposit(this.tile, Liquids.neoplasm, 60 * this.items.get(this.exploreItem));
    }
}))
