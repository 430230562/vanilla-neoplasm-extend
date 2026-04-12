/**
    author: miner
*/

const JavaBoolean = java.lang.Boolean;
const Integer = java.lang.Integer;
const Comparator = java.util.Comparator;
const DrillBuild = Drill.DrillBuild;
const comparator = (method) => new Comparator(){
    compare: method,
};

var tilesize = Vars.tilesize;
const tmpTiles = new Seq();

var block;
var itemIconSize = Vars.iconSmall / 4;

var drillAreaSize = 5;
let drill = extend(Drill, "激光钻头", {
    tier: 5,
    drillTime: 250,
    liquidBoostIntensity: 1.8,
    drillEffectChance: 0,
    
    laser: null,
    laserEnd: null,
    laserWidth: 0.35,
    
    size: 3,
    rotate: true,
    hasPower: true,
    configurable: true,
    
    // 我使用oreCount纯纯是为了适配原版或其他mod
    drillTileMap: new ObjectMap(),
    
    init(){
        block = this;
                        
        this.super$init();
    },
    
    load(){
        this.super$load();
        
        let {name} = this;
        this.laser = Core.atlas.find(name + "-laser");
        this.laserEnd = Core.atlas.find(name + "-laser-end");
    },
    
    canPlaceOn(tile, team, rotation){
        if(this.isMultiblock()){
            return this.getAreaTiles(tile, rotation).contains(boolf(t => this.canMine(t)));
        }else{
            return this.canMine(tile);
        }
    },
    
    countOre(tile){},
    
    customCountOre(tile, rotation){
        this.returnItem = null;
        this.returnCount = 0;

        let {drillTileMap, oreCount, itemArray} = this;
        
        drillTileMap.clear();
        oreCount.clear();
        itemArray.clear();

        this.getAreaTiles(tile, rotation).each(other => {
            if(this.canMine(other)){
                let ore = this.getDrop(other);
                
                drillTileMap.get(ore, prov(() => new Seq())).add(other);
                oreCount.increment(ore);
            }
        });
        
        if(oreCount.size == 0){
            return;
        }

        oreCount.keys().toArray(itemArray);
        
        itemArray.sort(comparator((item1, item2) => {
            let type = JavaBoolean.compare(!item1.lowPriority, !item2.lowPriority);
            if(type != 0) return type;
            let amounts = Integer.compare(oreCount.get(item1, 0), oreCount.get(item2, 0));
            if(amounts != 0) return amounts;
            return Integer.compare(item1.id, item2.id);
        }));
        
        let drillItem = itemArray.peek(); // 获取最优矿物 稍后可以自己选择
        this.returnItem = drillItem;
        this.returnCount = oreCount.get(drillItem, 0);
    },

    drawPlace(x, y, rotation, valid){
        let tile = Vars.world.tile(x, y);
        
        if(tile == null) return;
        
        this.customCountOre(tile, rotation);
            
        let {returnItem, drillTileMap, offset} = this;
        
        x *= tilesize;
        y *= tilesize;
        x += offset;
        y += offset;
        
        this.drawDrillInfo(returnItem, drillTileMap, x, y, rotation, valid);

        this.drawAreaOres(drillTileMap, x, y, rotation, valid);
    },
    
    // 自定义的drawPlace
    drawDrillInfo(item, drillTileMap, x, y, rotation, valid){
        let {drawMineItem} = this;
        
        if(drillTileMap.size == 0){
            return;
        }
        
        if(drawMineItem){
            Draw.color(item.color);
            Draw.rect(this.itemRegion, x, y);
            Draw.color();
        }
        
        x -= this.size * tilesize / 2 - 5;
        y += this.size * tilesize / 2;
        
        let font = Fonts.outline;
        let fx = x + itemIconSize;
        let fcolor = valid ? Pal.accent : Pal.remove;
        let fscale = 1 / 4 / Scl.scl(1);
        drillTileMap.each((item, seq) => {
            let count = seq.size;
            this.drawDrillSpeedInfo(item, count, x, y, font, fx, y, fcolor, fscale);
            
            y += itemIconSize;
        });
    },
    
    drawDrillSpeedInfo(item, count, dx, dy, font, fx, fy, fcolor, fscale){
        let speed = 60 / this.getDrillTime(item) * count;
                
        Draw.mixcol(Color.darkGray, 1);
        Draw.rect(item.fullIcon, dx, dy - 1, itemIconSize, itemIconSize);
        Draw.reset();
        Draw.rect(item.fullIcon, dx, dy, itemIconSize, itemIconSize);
        
        font.draw(Core.bundle.formatFloat("bar.drillspeed", speed, 2), 
            fx, fy, fcolor, fscale, false, Align.left);
    },
    
    drawAreaOres(drillTileMap, x, y, rotation, valid){
        let rect = this.getRect(Tmp.r1, x, y, rotation);
        let color = valid ? Pal.accent : Pal.remove;

        Drawf.dashRect(color, rect);
        
        let mix = 0.8 + Mathf.absin(Time.globalTime, 12, 0.6);
        drillTileMap.each((item, tiles) => {
            Draw.color(Color.white, 0.5);
            Draw.mixcol(item.color, mix);
            
            tiles.each(tiled => {
                let dx = tiled.worldx(), dy = tiled.worldy();
                
                Fill.rect(dx, dy, tilesize, tilesize);
            });
        });
    },
    
    drawPlanConfigTop(plan, list){
        if(!plan.worldContext) return;
        
        let tile = plan.tile();
        
        if(tile == null) return;
        
        this.customCountOre(tile, plan.rotation);
        
        this.super$drawPlanConfigTop(plan, list);
    },
    
    canMine(tile){
        return tile != null && tile.build == null && this.super$canMine(tile);
    },
        
    getRect(rect, x, y, rotation){
        rect.setCentered(x, y, drillAreaSize * tilesize);
        let len = tilesize * (drillAreaSize + this.size)/2;

        rect.x += Geometry.d4x[rotation] * len;
        rect.y += Geometry.d4y[rotation] * len;

        return rect;
    },
    
    getAreaTiles(buildTile, rotation){
        tmpTiles.clear();
        
        let offset = this.offset;
            
        let x = buildTile.worldx(), y = buildTile.worldy();
        
        x += offset;
        y += offset;
        
        let len = tilesize * (drillAreaSize + this.size) / 2;
        
        x += Geometry.d4x[rotation] * len;
        y += Geometry.d4y[rotation] * len;
        
        let areaX = x - drillAreaSize * tilesize / 2,
            areaY = y - drillAreaSize * tilesize / 2;
        
        let areaTileX = World.toTile(areaX),
            areaTileY = World.toTile(areaY);
        
        let world = Vars.world;
        for(let wx = 0; wx < drillAreaSize; wx++){
            for(let wy = 0; wy < drillAreaSize; wy++){
                let tile = world.tile(areaTileX + wx, areaTileY + wy);
                if(tile != null){
                    tmpTiles.add(tile);
                }
            }
        }
        
        return tmpTiles;
    },
    
    getReturnItem(){
        return this.returnItem;
    },
    
    getItemArray(){
        return this.itemArray;
    },
    
    getReturnCount(){
        return this.returnCount;
    },
});

drill.setupRequirements(
    Category.production,
    BuildVisibility.shown,
    ItemStack.with(Items.copper, 200, Items.lead, 150)
);

drill.consumePower(6);
drill.consumeLiquid(Liquids.water, 0.15).boost();

drill.config(Item, (build, item) => build.setDrillItem(item));

drill.buildType = () => {
    let tilesize = Vars.tilesize;
    let world = Vars.world;
    
    let lastChange = 0;
    
    let drillItems = new Seq();
    let drillTileMap = null;
        
    return extend(DrillBuild, block, {        
        // Building.onProximityUpdate();
        onProximityUpdate(){
            this.noSleep();
        },
        
        updateTile(){
            if(lastChange != world.tileChanges){
                lastChange = world.tileChanges;
                this.updateDrillTiles();
            }
            
            this.super$updateTile();
        },
        
        updateDrillTiles(){
            let {tile, rotation, dominantItem, dominantItems} = this;
            
            block.customCountOre(tile, rotation);
            
            drillItems.set(block.getItemArray());
            drillTileMap = new ObjectMap(block.drillTileMap);
            
            if(dominantItem == null){
                this.setDrillItem(block.getReturnItem());
            }
            
            if(dominantItems == 0){
                this.dominantItems = drillTileMap.get(this.dominantItem).size;
            }
        },
        
        buildConfiguration(table){
            table.defaults().width(150);
            
            let build = this;
            let liquidBoostIntensity = block.liquidBoostIntensity;
            
            drillTileMap.each((item, seq) => {
                let count = seq.size;
                let speed = 60 / block.getDrillTime(item) * count;
                
                table.button(cons(button => {
                    button.image(item.uiIcon).size(48);
                    button.label(() => {
                        let {optionalEfficiency, efficiency, warmup} = build;
                        let drillEfficiency = Mathf.lerp(1, liquidBoostIntensity, optionalEfficiency) * efficiency * warmup;
                        return "[accent]" + Strings.autoFixed(speed * drillEfficiency, 2) + StatUnit.perSecond.localized();
                    }).style(Styles.outlineLabel).padLeft(8).growX().left();
                }), Styles.clearTogglei, () => {
                    this.configure(item);
                }).checked(b => this.dominantItem == item).row();
            });
        },
        
        draw(){
            this.super$draw();
            
            let seq = drillTileMap.get(this.dominantItem);
            
            if(seq.isEmpty()){
                return;
            }
            
            let {x, y, rotation} = this;
            let {size, laser, laserCenter, laserEnd, laserWidth} = block;
            
            let len = tilesize * size / 2;
            
            let laserStartX = x + Geometry.d4x[rotation] * len;
            let laserStartY = y + Geometry.d4y[rotation] * len;
            
            seq.each(tile => {
                let tx = tile.worldx(), ty = tile.worldy();
                
                // TODO 动态激光
                
                Drawf.laser(laser, laserEnd, laserStartX, laserStartY, tx, ty, laserWidth);
            });
        },
        
        drawSelect(){
            let {x, y, rotation, dominantItem} = this;
            
            // block.drawDrillInfo(dominantItem, drillTileMap, x, y, rotation, true);
            block.drawAreaOres(drillTileMap, x, y, rotation, true);
        },
        
        setDrillItem(item){
            this.dominantItem = item;
            
            if(drillTileMap != null){
                this.dominantItems = drillTileMap.get(item).size;
            }
        },
        
        write(write){
            this.super$write(write);
            
            write.i(this.dominantItem.id);
        },
        
        read(read, revision){
            this.super$read(read, revision);
            
            let item = Vars.content.item(read.i());
            this.setDrillItem(item);
        },
    });
}