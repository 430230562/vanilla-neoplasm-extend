//Liquids.neoplasm
const {
    Acid
} = require('vne/lib/bulletType');
const status = require("vne/status");
const unit = require("vne/unit");

const
oppositeRotationArr = [2, 3, 0, 1],//0,1,2,3的反方向
posArr = [
{x:-1, y:2}, {x:0, y:2}, {x:1, y:2},
{x:2, y:1}, {x:2, y:0}, {x:2, y:-1},
{x:1, y:-2}, {x:0, y:-2}, {x:-1, y:-2},
{x:-2, y:-1}, {x:-2, y:0}, {x:-2, y:1}
],
toPosArr = [1,4,7,10], arr3 = [
{x:-1, y:1}, {x:0, y:1}, {x:1, y:1},
{x:-1, y:0}, {x:0, y:0}, {x:1, y:0},
{x:-1, y:-1}, {x:0, y:-1}, {x:1, y:-1},
];

var nodeConsume = 20, turretConsume = 30;

function ConveyNeoplasm(giver, receiver, amount) {
    if(!giver && !receiver)return false
    let conveyAmount = Math.min(amount, giver.liquids.get(Liquids.neoplasm), receiver.block.liquidCapacity - receiver.liquids.get(Liquids.neoplasm))

    if (conveyAmount >= 0) {
        giver.liquids.remove(Liquids.neoplasm, conveyAmount);
        receiver.liquids.add(Liquids.neoplasm, conveyAmount);
        return true
    } else {
        return false
    }
}

function CanSpawnSize3(x, y) {
  for (let pos of arr3) {
    let tile = Vars.world.tile(x + pos.x, y + pos.y);
    if (!tile) return false; // 超出地图边界视为不可建造
    let block = tile.block();
    if (block != Blocks.air && block != neopNode) {
      return false; // 遇到不允许的方块立即返回false
    }
  }
  return true; // 全部符合
}

var neopCore = extend(CoreBlock, "neop-core", {
    buildVisibility: BuildVisibility.editorOnly,
    category: Category.effect,
    update: true,
    health: 4000,
    armor: 9,
    size: 1,
    solid: true,
    replaceable: false,
    hasShadow: true,
    hasLiquids: true,
    liquidCapacity: 900,
    itemCapacity: 100,
    unitCapModifier: 25,
    canPlaceOn(tile,team,rotation){
		return true
	},
})

var neopNode = extend(Block, "neop-node", {
    update: true,
    rotate: true,
    //rotateDraw: false,
    health: 180,
    size: 1,
    solid: false,
    replaceable: false,
    hasShadow: true,
    hasLiquids: true,
    liquidCapacity: 60,
})

var neopTurret = extend(LiquidTurret, "neop-turret", {
    health: 1080,
    size: 3,
    reload: 90,
    targetAir: true,
    range: 8 * 25,
    maxAmmo: 50,
    shootCone: 5,
    rotateSpeed: 4.5,
    recoil: 4,
    ammoPerShot: 5,
    shootSound: Sounds.shootTank,
})
neopTurret.ammo(
Liquids.neoplasm, Object.assign(new BasicBulletType(8, 100), {
    ammoMultiplier: 1,
    width: 7,
    height: 21,
    lifetime: 26,
    hitSize: 8,
    hitColor: Color.valueOf("84a94b"),
    backColor: Color.valueOf("84a94b"),
    trailColor: Color.valueOf("84a94b"),
    frontColor: Color.white,
    trailWidth: 2,
    trailLength: 5,

    hitEffect: Fx.flakExplosionBig,

    pierce: true,
    pierceBuilding: true,
    collidesAir: true,
    pierceCap: 2,

    knockback: 12,
    recoil: 2,

    intervalBullets: 3,
    bulletInterval: 1,
    intervalBullet: new Acid(18),
    fragBullets: 2,
    fragBullet: new Acid(18)
}))

var spawner = new Block("spawner");
exports.spawner = spawner;
Object.assign(spawner,{
    update: true,
    health: 400,
    size: 3,
    solid: false,
    replaceable: false,
    hasShadow: true,
    hasLiquids: true,
    liquidCapacity: 90,
})

neopCore.buildType = prov(() => extend(CoreBlock.CoreBuild, neopCore, {
    child: [null, null, null, null],
    readPos: [-1, -1, -1, -1],
    _needsResolve: false,
    updateTile() {
        // 1. 原有的防原型链污染初始化
        if (!this.child) this.child = [null, null, null, null];

        if (this._needsResolve && this.readPos) {
            for (let j = 0; j < 4; j++) {
                if (this.readPos[j] != -1) {
                    this.child[j] = Vars.world.build(this.readPos[j]);
                } else {
                    this.child[j] = null;
                }
            }
            this._needsResolve = false; // 只执行一次，随后关闭
        }


        if (this.liquids.get(Liquids.neoplasm) <= this.block.liquidCapacity) {
            this.liquids.add(Liquids.neoplasm, 2 / 6);
        }

        if (this.damaged()) {
            this.heal(0.2)
            this.liquids.remove(Liquids.neoplasm, 0.1)
            if (Mathf.chance(0.1)) {
                Fx.neoplasmHeal.at(this.x + Mathf.range(3), this.y + Mathf.range(3));
            }
        }

        //每秒一次
        if (Time.time % 60 < 1) {
            //i 为旋转方位
            for (let i = 0; i < 4; i++) {
                let PosTile = this.tile.nearby(i);
                //ai指导: 蒙特卡洛
                if (Mathf.chance(0.25) && PosTile != null && PosTile.block() == Blocks.air  && this.liquids.get(Liquids.neoplasm) >= nodeConsume) {
                    PosTile.setBlock(neopNode, this.team, i);
                    this.liquids.remove(Liquids.neoplasm, nodeConsume);

                    this.child[i] = PosTile.build
                    //this.child[i].parent = this
                }

                if (this.child[i] != null) {
                    if (!this.child[i].dead) {
                        ConveyNeoplasm(this, this.child[i], 30)
                    } else {
                        this.child[i] = null
                    }
                }
            }
        }
        
        this.super$updateTile();
        //Vars.ui.showLabel("" + this.child[0] + "\n" + this.child[1] + "\n" + this.child[2] + "\n" + this.child[3], 0.01, this.x, this.y);
    },
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
    },
    //很重要的这个东西
    //i hope帮助
    write(write) {
        this.super$write(write);

        if (!this.child) this.child = [null, null, null, null];
        for (let j = 0; j < 4; j++) {
            if (this.child[j] != null) {
                // 保存方块的整数坐标
                write.i(this.child[j].pos());
            } else {
                write.i(-1);
            }
        }
    },

    read(read, revision) {
        this.super$read(read, revision);

        if (!this.readPos) this.readPos = [-1, -1, -1, -1];
        for (let j = 0; j < 4; j++) {
            // 只把整型坐标读到缓存数组里，绝对不要在这里调 world.build()
            this.readPos[j] = read.i();
        }
        // 标记：通知 updateTile 有未解析的读档数据
        this._needsResolve = true;
    }

}))


neopNode.buildType = prov(() => extend(Building, {
    //虽然但是，其实child[4]是parent
    child: [null, null, null, null, null],
    parent: null,
    readPos: [-1, -1, -1, -1, -1],
    _needsResolve: false,
    unitOn(unit){
        if(unit.team != this.team){
            unit.apply(status.neoplasmSlow, 30)
        }
    },
    updateTile() {
        // 1. 原有的防原型链污染初始化
        if (!this.child) this.child = [null, null, null, null, null];

        if (this._needsResolve && this.readPos) {
            for (let j = 0; j < 5; j++) {
                if (this.readPos[j] != -1) {
                    this.child[j] = Vars.world.build(this.readPos[j]);
                } else {
                    this.child[j] = null;
                }
            }
            this.parent = this.child[4]
            this._needsResolve = false; // 只执行一次，随后关闭
        }

        if (this.damaged() && this.parent != null && !this.parent.dead) {
            this.heal(0.1)
            this.liquids.remove(Liquids.neoplasm, 0.025)
            if (Mathf.chance(0.1)) {
                Fx.neoplasmHeal.at(this.x + Mathf.range(3), this.y + Mathf.range(3));
            }
        }

        //每秒一次
        if (Time.time % 60 < 1) {
            //i 为旋转方位
            for (let i = 0; i < 4; i++) {
                let PosTile = this.tile.nearby(i);

                //以自身旋转方向的反方向的建筑为parent
                //感觉不会太稳定
                if (i == oppositeRotationArr[this.rotation]) {
                    this.parent = PosTile.build
                    this.child[4] = this.parent

                    continue
                }
                //ai指导: 蒙特卡洛
                if (this.parent != null && PosTile != null && PosTile.block() == Blocks.air){
                    if(Mathf.chance(0.25) && this.liquids.get(Liquids.neoplasm) >= nodeConsume) {
                        PosTile.setBlock(neopNode, this.team, i);
                        this.liquids.remove(Liquids.neoplasm, nodeConsume);
    
                        this.child[i] = PosTile.build
                    }else if(Mathf.chance(0.05) && CanSpawnSize3(this.tile.x + posArr[toPosArr[i]].x,this.tile.y + posArr[toPosArr[i]].y) && this.liquids.get(Liquids.neoplasm) >= turretConsume){
                        Vars.world.tile(this.tile.x + posArr[toPosArr[i]].x,this.tile.y + posArr[toPosArr[i]].y).setBlock(spawner, this.team);
                        this.liquids.remove(Liquids.neoplasm, turretConsume);
                    }else if(Mathf.chance(0.05) && CanSpawnSize3(this.tile.x + posArr[toPosArr[i]].x,this.tile.y + posArr[toPosArr[i]].y) && this.liquids.get(Liquids.neoplasm) >= turretConsume){
                        Vars.world.tile(this.tile.x + posArr[toPosArr[i]].x,this.tile.y + posArr[toPosArr[i]].y).setBlock(neopTurret, this.team);
                        this.liquids.remove(Liquids.neoplasm, turretConsume);
                    }
                }
                
                if(this.liquids.get(Liquids.neoplasm) == NaN)this.liquids.reset(Liquids.neoplasm,0)

                if (this.child[i] != null) {
                    if (!this.child[i].dead) {
                        ConveyNeoplasm(this, this.child[i], this.liquids.get(Liquids.neoplasm) / 2)
                    } else {
                        this.child[i] = null
                    }
                }
            }
        }

        if (this.parent == null || this.parent.dead) {
            this.damage(1.5)
        }
    },
    //这才是最折磨的一部分
    draw(){
        this.super$draw()
        
        for(let i = 0; i < 4; i++){
            if(i == oppositeRotationArr[this.rotation] || this.child[i] != null){
                Draw.rect(Core.atlas.find("vne-neop-node-edge1"),this.x,this.y, i * 90)
            }else{
                Draw.rect(Core.atlas.find("vne-neop-node-edge2"),this.x,this.y, i * 90)
            }
        }
    },
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
    },

    //很重要的这个东西
    //i hope帮助
    write(write) {
        this.super$write(write);

        if (!this.child) this.child = [null, null, null, null, null];
        for (let j = 0; j < 5; j++) {
            if (this.child[j] != null) {
                // 保存方块的整数坐标
                write.i(this.child[j].pos());
            } else {
                write.i(-1);
            }
        }
    },

    read(read, revision) {
        this.super$read(read, revision);

        if (!this.readPos) this.readPos = [-1, -1, -1, -1, -1];
        for (let j = 0; j < 5; j++) {
            // 只把整型坐标读到缓存数组里，绝对不要在这里调 world.build()
            this.readPos[j] = read.i();
        }
        // 标记：通知 updateTile 有未解析的读档数据
        this._needsResolve = true;
    }
}))


neopTurret.buildType = prov(() => extend(LiquidTurret.LiquidTurretBuild, neopTurret, {
    parent: null,
    readPos: -1,
    _needsResolve: false,
    updateTile() {
        this.super$updateTile();
        
        if (this._needsResolve && this.readPos) {
            if (this.readPos != null) {
                this.parent = Vars.world.build(this.readPos);
            } else {
                this.parent = null;
            }

            this._needsResolve = false; // 只执行一次，随后关闭
        }
        
        this.parent = this.findParent();

        if (this.parent != null && !this.parent.dead) {
            ConveyNeoplasm(this.parent, this, 2);
            if(this.damaged()){
                this.heal(0.2)
                this.liquids.remove(Liquids.neoplasm, 0.05)
                if (Mathf.chance(0.1)) {
                    Fx.neoplasmHeal.at(this.x + Mathf.range(11), this.y + Mathf.range(11));
                }
            }
        }

        

        if (this.parent == null || this.parent.dead) {
            this.damage(4.5)
        }
    },
    findParent() {
        let par = null
        for (let pos of posArr) {
            par = Vars.world.tile(this.tile.x + pos.x, this.tile.y + pos.y).build;
            if(par != null) break
        }
        return par
    },
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
    },

    //很重要的这个东西
    //i hope帮助
    write(write) {
        this.super$write(write);

        if (!this.parent) this.parent = null;
        if (this.parent != null) {
            write.i(this.parent.pos());
        } else {
            write.i(-1);
        }
    },

    read(read, revision) {
        this.super$read(read, revision);

        if (!this.readPos) this.readPos = -1;

        this.readPos = read.i();

        this._needsResolve = true;
    }
}))

spawner.buildType = prov(() => extend(Building, {
    parent: null,
    readPos: -1,
    _needsResolve: false,
    plan: -2,
    prog: 0,//progress
    working: false,
    list: [unit.spore, 20, unit.mycelium, 35, unit.sac, 50],
    updateTile() {
        this.super$updateTile();
        
        if (this._needsResolve && this.readPos) {
            if (this.readPos != null) {
                this.parent = Vars.world.build(this.readPos);
            } else {
                this.parent = null;
            }

            this._needsResolve = false; // 只执行一次，随后关闭
        }
        
        this.parent = this.findParent();
        
        if (this.parent != null && !this.parent.dead) {
            ConveyNeoplasm(this.parent, this, 2);
            if(this.damaged()){
                this.heal(0.2)
                this.liquids.remove(Liquids.neoplasm, 0.05)
                if (Mathf.chance(0.1)) {
                    Fx.neoplasmHeal.at(this.x + Mathf.range(11), this.y + Mathf.range(11));
                }
            }
        }
        
        this.initPlan();

        if(this.working){
            this.prog += Time.delta * Vars.state.rules.unitBuildSpeed(this.team)
            if(this.prog >= 12 * 60){
                this.prog = 0;
                this.working = false;//有力气
                this.list[this.plan].spawn(this.team,this.x,this.y);
                this.plan = this.randomValue();
            }
        }

        if (this.parent == null || this.parent.dead) {
            this.damage(2)
        }
    },
    draw(){
        this.super$draw()
        
        if(this.working){
            //construct(Building t, TextureRegion region, Color color, float rotation, float progress, float alpha, float time, float size){
            Draw.reset();
            Draw.draw(Layer.blockOver, () => Drawf.construct(this, Core.atlas.find("vne-spawner-ball"), Color.valueOf("c33e2b"), 0, this.prog / (12 * 20), 1, Time.time, 20));
        }
        Draw.rect(Core.atlas.find("vne-spawner-top"),this.x,this.y, 0)
    },
    findParent() {
        let par = null
        for (let pos of posArr) {
            par = Vars.world.tile(this.tile.x + pos.x, this.tile.y + pos.y).build;
            if(par != null) break
        }
        return par
    },
    initPlan(){
        if(this.list[this.plan + 1] != null){
            if(this.liquids.get(Liquids.neoplasm) > this.list[this.plan + 1] && !this.working){
                this.working = true
                this.liquids.remove(Liquids.neoplasm, this.list[this.plan + 1])
            }
        }else{
            this.plan = this.randomValue();
        }
    },
    randomValue(){
        /* 以 4:2:1 的概率返回 0、2 或 4。
        @return 0（概率 4/7）、2（概率 2/7）或 4（概率 1/7）*/
        let r = Math.random() * 7; // 生成 0 到 6 的随机数
        if (r <= 4) {
            return 0;
        } else if (r <= 6) {
            return 2;
        } else {
            return 4;
        }
    },
    collision(bullet) {
        this.super$collision(bullet);

        Puddles.deposit(this.tile, Liquids.neoplasm, bullet.damage);

        return true
    },
    onDestroyed() {
        Puddles.deposit(this.tile, Liquids.neoplasm, 70);
    },
    onDeconstructed() {
        Puddles.deposit(this.tile, Liquids.neoplasm, 70);
    },
    write(write) {
        this.super$write(write);

        if (!this.parent) this.parent = null;
        if (this.parent != null) {
            write.i(this.parent.pos());
        } else {
            write.i(-1);
        }
        
        write.f(this.prog);
        write.bool(this.working);
        write.i(this.plan)
    },

    read(read, revision) {
        this.super$read(read, revision);

        if (!this.readPos) this.readPos = -1;

        this.readPos = read.i();
        this.prog = read.f();
        this.working = read.bool();
        this.plan = read.i();

        this._needsResolve = true;
    }
}))