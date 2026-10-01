const wideLightning = new Effect(10, 500, e => {
    if (!(e.data instanceof Seq)) return;
    let lines = e.data;

    Lines.stroke(2 * e.fout());
    //2为线宽
    Draw.color(e.color, Color.white, e.fin());

    for (let i = 0; i < lines.size - 1; i++) {
        let cur = lines.get(i);
        let next = lines.get(i + 1);

        Lines.line(cur.x, cur.y, next.x, next.y, false);
        Fill.circle(cur.x, cur.y, Lines.getStroke() / 2);
    }
});

function ArcNode(name, obj) {

    var {
        interval, insideBullet, drawBeam
    } = obj;

    const arcNode = extend(PowerNode, name, {
        update: true,
        category: Category.effect,

        setStats() {
            this.super$setStats();
            this.stats.add(new Stat("damage", StatCat.function), insideBullet.damage, StatUnit.perShot);
            this.stats.add(new Stat("reload", StatCat.function), 60 / interval, StatUnit.perSecond);
        }
    });
    arcNode.buildType = prov(() => extend(PowerNode.PowerNodeBuild, arcNode, {
        t: 0,
        shocked: false,
        updateTile() {

            this.t += Time.delta*this.efficiency

            const {
                laserColor1,
            } = this.block;
            const {
                team, x, y, power
            } = this;

            for (let i = 0; i < this.power.links.size; i++) {
                let link = Vars.world.build(this.power.links.get(i));

                if (link.block == this.block) {
                    let angle = Angles.angle(x, y, link.x, link.y),
                    dst = Mathf.dst(link.x, link.y, x, y);

                    if (power.graph.getSatisfaction() > 0 && this.t >= interval) {
                        //这里控制闪电频率
                        let b = insideBullet.create(this, team, x, y, angle)
                        /*逃不出的莫比乌斯环*/
                        this.shocked = true;
                        
                        Sounds.shootArc.at(x,y,1,0.1)

                        Damage.collideLine(b, team, x, y, angle, dst, false, true, -1);
                        
                        const vec = Tmp.v1.set(b.vel)
                            .setLength(dst);
                        const offsetVec = Tmp.v2.set(vec)
                            .rotate90(1)
                            .nor();

                        const lines = new Seq();

                        lines.add(new Vec2(x, y));

                        const fract = [];
                        for (let i = 0; i < dst / 8; i++) {
                            //8这个值可以调节
                            fract.push(Mathf.random(0, 1));
                        }
                        fract.sort((a, b) => a - b);

                        for (let i = 0; i < fract.length; i++) {
                            let posFraction = fract[i];

                            lines.add(new Vec2(
                            x + vec.x * posFraction + offsetVec.x * Mathf.random(-1, 1) * 4,
                            y + vec.y * posFraction + offsetVec.y * Mathf.random(-1, 1) * 4)); //4为随机偏移量
                        }

                        lines.add(new Vec2(x, y)
                            .add(vec));

                        wideLightning.at(x, b.y, vec.angle(), laserColor1, lines);
                    }
                }
            }

            if (this.shocked) {
                this.t %= interval
                this.shocked = false
            }
        },
        draw() {
            if (drawBeam) {
                this.super$draw();
            } else {
                for (let i = 0; i < this.power.links.size; i++) {
                    let link = Vars.world.build(this.power.links.get(i));
                    if (link.block != this.block || this.power.graph.getSatisfaction() == 0) {
                        this.block.setupColor(this.power.graph.getSatisfaction());
                        this.block.drawLaser(this.x, this.y, link.x, link.y, this.block.size, link.block.size);
                        Draw.reset();
                    }
                }
            }
        }

    }))
    return arcNode
}

const 电弧节点 = new ArcNode("电弧节点", {
    interval: 10,
    drawBeam: false,
    insideBullet: Object.assign(new BulletType(), {
        collidesAir: true,
        collidesGround: true,
        damage: 40,
        
        /*这四个尽量不要改*/
        lifetime: 1,
        speed: 1,
        hitEffect: Fx.circleColorSpark,
        despawnEffect: Fx.none,
    }),
});
电弧节点.consumePower(1)
电弧节点.consumesPower = true;