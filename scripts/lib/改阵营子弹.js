const bullet1 = extend(BasicBulletType, {
    hitEntity(b, entity, health) {
        if (entity instanceof Unit) {
            if (entity.health <= 100) {
                entity.remove();

                let u = entity.type.spawn(unit.team, entity.x, entity.y, entity.rotation);
                u.health = u.maxHealth / 4
            }
        }

        this.super$hitEntity(b, entity, health);
    },
    hitTile(b, build, x, y, initialHealth, direct) {
        if (build.team != b.team && build.health <= 100) {
            build.changeTeam(b.team)

            build.heal(build.maxHealth / 4)
        }

        this.super$hitTile(b, build, x, y, initialHealth, direct);
    }
})