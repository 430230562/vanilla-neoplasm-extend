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
        despawnHit: true,
        length: 160,
        lightningColor: Color.red,
        speed: 1,
        update(b){
            let {length, pierceCap, lightningColor} = this;
            
            b.fdata = length;
            Damage.collideLine(b, b.team, b.x, b.y, b.rotation(), length, false, true, pierceCap);
            let resultLen = b.fdata;
            
            //方向向量
            let DirVec = Vec2(b.vel.x, b.vel.y);
            //单位法向量
            let UnitVec = getUnitNormal(DirVec);
            
            var office = [], sum = 0, 
            px = 0, py = 0, 
            lx = 0, ly = 0;
            
            Draw.reset();
            
            for(let i = 0; i < resultLen / 2;i++){
                office[i] = Mathf.range(2);
                sum += office[i]
            }
            
            sum /= office.length
            
            for(let i = 0; i < resultLen / 2;i++){
                office[i] += sum
                
                lx = px,
                ly = py,
                px = b.x + DirVec.x / DirVec.len() * i * 2 + UnitVec.x * office[i];
                py = b.y + DirVec.y / DirVec.len() * i * 2 + UnitVec.y * office[i];
                
                
                Drawf.line(lightningColor,px,py,lx,ly)
            }
            
            Draw.reset();
            b.remove();
        }
    })
}))