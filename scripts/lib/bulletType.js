const status = require('vne/status');
const liquid = require('vne/liquid');

function Acid(puddleSize) {
    return extend(LiquidBulletType, {
        speed: 0.1,
        damage: 0,
        liquid: liquid.acid,
        lifetime: 1,
        puddleSize: puddleSize,

        knockback: 0,

        status: StatusEffects.corroded,
        statusDuration: 40,
    })
}
exports.Acid = Acid

function ReduceArmorBulletType(speed, damage, amount) {
    return extend(BasicBulletType, speed, damage, {
        hitEntity(b, entity, health) {
            this.super$hitEntity(b, entity, health);
            if (entity instanceof Unit) {
                var unit = entity;
                unit.armor -= amount;
            }
        },
        pierceCap: 2,
        pierce: true,
        pierceBuilding: true,

        buildingDamageMultiplier: 1.5,

        smokeEffect: Fx.shootBigSmoke,
        shootEffect: Fx.shootBigColor,
        despawnEffect: Fx.hitBulletColor,
        hitEffect: Fx.hitBulletColor,

        shrinkX: 0,
        shrinkY: 0,

        ammoMultiplier: 2,
    });
}
exports.ReduceArmorBulletType = ReduceArmorBulletType;

function BounceBulletType(speed, damage, range) {
    return extend(BasicBulletType, speed, damage, {
        pierceCap: 12,
        pierceDamageFactor: 0.9,

        trailLength: 24,
        trailChance: 0.5,
        trailInterval: 10,

        hitEntity(b, entity, health) {
            this.super$hitEntity(b, entity, health);

            let {
                team, x, y, vel
            } = b;
            let target = null;
            if (entity instanceof Unit) {
                target = Units.closestEnemy(team, x, y, range, unit => !b.hasCollided(unit.id));
            } else {
                target = Units.findEnemyTile(team, x, y, range, build => !b.hasCollided(build.id));
            }

            if (target != null) {
                vel.setAngle(Angles.angle(x, y, target.x, target.y));
            }
        },
    });
}