const liquid = require("vne/liquid");
const item = require("vne/item");

/*const coagulantIngotWall = new Wall("coagulant-ingot-wall");
exports.coagulantIngotWall = coagulantIngotWall;
Object.assign(coagulantIngotWall,{
    health: 720,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    buildVisibility: BuildVisibility.shown,
	category: Category.defense,
	requirements: ItemStack.with(
	    Items.tungsten, 2,
		item.coagulantIngot, 4,
	),
})
coagulantIngotWall.buildType = prov(() => extend(Building,{
    collision(bullet){
        this.super$collision(bullet);
        
        if(this.tile != null)Puddles.deposit(this.tile,Liquids.neoplasm,bullet.damage);
        
        return true
    }
}))

const coagulantIngotWallLarge = new Wall("coagulant-ingot-wall-large");
exports.coagulantIngotWallLarge = coagulantIngotWallLarge;
Object.assign(coagulantIngotWallLarge,{
    health: 720 * 4,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    size:2,
    buildVisibility: BuildVisibility.shown,
	category: Category.defense,
	requirements: ItemStack.with(
	    Items.tungsten, 2 * 4,
		item.coagulantIngot, 4 * 4,
	),
})
coagulantIngotWallLarge.buildType = prov(() => extend(Building,{
    collision(bullet){
        this.super$collision(bullet);
        
        if(this.tile != null)this.tile.getLinkedTiles(cons(tile => {
            Puddles.deposit(tile,Liquids.neoplasm,bullet.damage * 1/4);
        }))
        
        return true
    }
}))*/

const oxideWall = new Wall("oxide-wall");
exports.oxideWall = oxideWall;
Object.assign(oxideWall,{
    health: 900,
    insulated: true,
    absorbLasers: true,
    schematicPriority: 10,
    update: true,
    buildVisibility: BuildVisibility.shown,
	category: Category.defense,
	requirements: ItemStack.with(
	    Items.tungsten, 2,
		Items.oxide, 4,
	),
})

const oxideWallLarge = new Wall("oxide-wall-large");
exports.oxideWallLarge = oxideWallLarge;
Object.assign(oxideWallLarge,{
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
		Items.oxide, 4 * 4,
	),
})

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
            Color.valueOf("FFFFFF80")
        ],

        flareColor: Color.valueOf("57c3c2"),
        lightColor: Color.valueOf("57c3c2"),
        hitColor: Color.valueOf("57c3c2"),
    }),
)