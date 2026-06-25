//浪涌弹
//这几个参数分别是 type, speed, damage, sprite(贴图)
const bullet1 = extend(ArtilleryBulletType, 3.4, 40, "shell", {
    hitEffect: new MultiEffect(Fx.plasticExplosion, Fx.shockwave),
    knockback: 1,
    lifetime: 80,
    width: 13,
    height: 15,
    collidesTiles: false,
    splashDamageRadius: 40 * 0.75,
    splashDamage: 90,
    fragBullet: Object.assign(new BasicBulletType(2.5, 14, "bullet"), {
        width: 10,
        height: 12,
        shrinkY: 1,
        lifetime: 15,
        backColor: Pal.plastaniumBack,
        frontColor: Pal.plastaniumFront,
        despawnEffect: Fx.none,
        collidesAir: false,
    }),
    fragBullets: 15,
    backColor: Pal.plastaniumBack,
    frontColor: Pal.plastaniumFront,
    lifeScaleRandMax: 1.08,
    lifeScaleRandMin: 0.92,
    shootPattern: extend(ShootPattern, {
        shoot(totalShots, handler, barrelIncrementer) {
            //for循环看不懂的话就废了喵
            for (let i = 0; i < 4; i++) {
                /*这几个参数分别是x,y,角度,发射延迟,对子弹的操作
                x,y是相对于炮台坐标,所以不要改
                好像子弹没有inaccuracy这个东西,所以我用随机正负7以内来近似拟合

                试试把b.moveRelative(0,0)改成b.moveRelative(0,Math.sin(b.time))看看会发生什么吧(busi)

                */
                handler.shoot(0, 0, Mathf.range(7), 0, b => b.moveRelative(0, 0))
            }
        }
    })
});

const testTurret = extend(PowerTurret, "test-turret", {
    shootType: extend(ShrapnelBulletType, {
        length: 100,
        damage: 105,
        ammoMultiplier: 5,
        toColor: Pal.thoriumPink,
        shootEffect: Fx.thoriumShoot,
        smokeEffect: Fx.thoriumShoot,
        shootPattern: new ShootSpread(3, 20),
    }),
    reload: 30,
    range: 300,
    category: Category.turret,
    buildVisibility: BuildVisibility.shown,
})
testTurret.buildType = prov(() => extend(PowerTurret.PowerTurretBuild, testTurret, {
    updateShooting() {
        //解构是对的
        let { reload, minWarmup, shootType } = this.block;

        if (this.reloadCounter >= reload && this.shootWarmup >= minWarmup) {

            if (this.target && this.target.within(this, 90)) {
                //近距离发射shootType里的子弹
                this.shoot(shootType);
                //重置冷却
                this.reloadCounter -= reload;
            } else {
                //远距离发射另一个子弹
                this.shoot(bullet1);
                //重置冷却,因为原版浪涌冷却是雷光3倍,所以*3
                this.reloadCounter -= reload * 3;
            }
        }
    }
}))