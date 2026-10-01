function getUnitNormal(self) {
    let length = self.len()

    if (length == 0) {
        return Vec2.ZERO
    } else {
        return new Vec2(-self.y / length, self.x / length)
    }
}

const arc = new UnitType("弧电");
arc.constructor = () => new TankUnit.create();
arc.weapons.add(
Object.assign(new Weapon("改进工业-弧电1"), {
    x: 0,
    y: 1,
    recoil: 3,
    mirror: false,
    shake: 3,
    shootY: 9,
    reload: 160,
    inaccuracy: 1,
    rotate: true,
    rotateSpeed: 0.73,
    cooldownTime: 155,
    shootSound: Vars.tree.loadSound("1010"),
    ejectEffect: Fx.casing4,
    bullet: extend(RailBulletType, {
        length: 160,
        lightningColor: Color.valueOf("f97171aa"),
        speed:1,//千万不要改成0
        
        init(b) {
            // init(); here
            if (!b) {
                this.super$init();
                return;
            }

            // init(Bullet b); here
            let {
                length, pierceCap, lightningColor
            } = this;

            Damage.collideLine(b, b.team, b.x, b.y, b.rotation(), length, false, true, pierceCap);
            const resultLen = b.fdata = Damage.findLength(b, length, true, pierceCap);

            const vec = Tmp.v1.set(b.vel)
                .setLength(resultLen);
            const offsetVec = Tmp.v2.set(vec)
                .rotate90(1)
                .nor();

            const lines = new Seq();
            lines.add(new Vec2(b.x, b.y));

            const fract = [];
            for (let i = 0; i < resultLen / 8; i++) {
                fract.push(Mathf.random(0, 1));
            }
            fract.sort((a, b) => a - b);

            for (let i = 0; i < fract.length; i++) {
                let posFraction = fract[i];

                lines.add(new Vec2(
                b.x + vec.x * posFraction + offsetVec.x * Mathf.random(-1, 1) * 4,
                b.y + vec.y * posFraction + offsetVec.y * Mathf.random(-1, 1) * 4));
            }

            lines.add(new Vec2(b.x, b.y)
                .add(vec));

            Fx.chainLightning.at(b.x, b.y, vec.angle(), lightningColor, lines);
        }
    })
}))