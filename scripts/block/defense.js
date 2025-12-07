const lib = require("vne/lib/researchlib");

const liquid = require("vne/liquid");
const item = require("vne/item");
const status = require("vne/status");

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
    item.coagulantIngot, 4, ),
})
coagulantIngotWall.buildType = prov(() => extend(Building, {
    collision(bullet) {
        this.super$collision(bullet);

        if (this.tile != null) Puddles.deposit(this.tile, Liquids.neoplasm, bullet.damage);

        return true
    },
    onDestroyed() {
        if (this.tile != null) Puddles.deposit(this.tile, Liquids.neoplasm, this.maxHealth);
    },
    onDeconstructed() {
        if (this.tile != null) Puddles.deposit(this.tile, Liquids.neoplasm, this.maxHealth);
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
    item.coagulantIngot, 4 * 4, ),
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
        if (this.tile != null) Puddles.deposit(this.tile, Liquids.neoplasm, this.maxHealth);
    },
    onDeconstructed() {
        if (this.tile != null) Puddles.deposit(this.tile, Liquids.neoplasm, this.maxHealth);
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
    Items.oxide, 4, ),
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
        if (this.tile != null) Puddles.deposit(this.tile, Liquids.neoplasm, this.noep);
    },
    onDeconstructed() {
        if (this.tile != null) Puddles.deposit(this.tile, Liquids.neoplasm, this.noep);
        this.neop = 0
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
    Items.oxide, 4 * 4, ),
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
        if (this.tile != null) Puddles.deposit(this.tile, Liquids.neoplasm, this.noep);
    },
    onDeconstructed() {
        if (this.tile != null) Puddles.deposit(this.tile, Liquids.neoplasm, this.noep);
        this.neop = 0
    }
}))

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
        this.super$collision(bullet);

        //神秘的抗穿透方法
        bullet.remove();

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
        this.super$collision(bullet);

        //神秘的抗穿透方法
        bullet.remove();

        return true
    }
}))

lib.addResearch(oxideWall, {
    parent: "beryllium-wall",
}, () => {
    TechTree.node(oxideWallLarge, () => {
        TechTree.node(biomassWall, () => {
            TechTree.node(biomassWallLarge, () => {})
        })
    })
});

//撕裂
Blocks.breach.ammoTypes.put(
item.coagulantIngot, extend(BasicBulletType, 7.5, 72, {
    width: 12,
    hitSize: 7,
    height: 20,
    shootEffect: new MultiEffect(Fx.shootBigColor, Fx.colorSparkBig),
    smokeEffect: Fx.shootBigSmoke,
    ammoMultiplier: 1,
    pierceCap: 3,
    lifetime: 27.5,
    rangeChange: 2 * 8,
    pierce: true,
    pierceBuilding: true,
    hitColor: Color.valueOf("D6A17C"),
    backColor: Color.valueOf("D6A17C"),
    trailColor: Color.valueOf("D6A17C"),
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
        if (tile != null) {
            Puddles.deposit(tile, Liquids.neoplasm, b.damage);
        }
    },
    hit(b, x, y) {
        this.super$hit(b, x, y);

        //记忆中这样写会爆栈，其实不会
        let tile = Vars.world.tileWorld(x, y);
        if (tile != null) {
            Puddles.deposit(tile, Liquids.neoplasm, b.damage);
        }
    }
}))

//升华
Blocks.sublimate.ammoTypes.put(
liquid.ammonia, Object.assign(new ContinuousFlameBulletType(), {
    damage: 960 / 12,
    rangeChange: 7.5 * 8,
    ammoMultiplier: 15 / 12,
    length: 130 + 7.5 * 8,
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
    reloadMultiplier: 0.65,
    splashDamageRadius: 110,
    rangeChange: -8,
    splashDamage: 40,
    scaledSplashDamage: true,
    hitColor: Color.valueOf("D6A17C"),
    backColor: Color.valueOf("D6A17C"),
    trailColor: Color.valueOf("D6A17C"),
    frontColor: Color.valueOf("D6A17C"),
    ammoMultiplier: 1,
    hitSound: Sounds.titanExplosion,

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
                if (other != null) Puddles.deposit(other, Liquids.neoplasm, 40);
            }))
        }
    }
}))