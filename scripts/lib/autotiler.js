const fluxRail = extend(Duct, "flux-rail", {
    health: 200,
    armor: 2,
    size: 1,
    speed: 60 / 30,
    itemCapacity: 1,
    placeableLiquid: true,
    update: true,
    buildVisibility: BuildVisibility.shown,
    category: Category.distribution,
    requirements: ItemStack.with(
        // items.glassSteel, 1,
        Items.graphite,
        1,
        Items.silicon,
        1,
    ),
});
fluxRail.buildType = () =>
    extend(Duct.DuctBuild, fluxRail, {
        progress: 0,

        draw() {
            const {x, y, rotation, current: item, block, progress} = this;

            const lastZ = Draw.z();
            Draw.z(lastZ - 0.1);

            if (rotation == 2 || rotation == 0) {
                //左和右
                Draw.rect(Core.atlas.find(block.name + "-x"), x, y);
            } else {
                Draw.rect(Core.atlas.find(block.name + "-y"), x, y);
            }

            Draw.z(lastZ - 0.09);
            if(item != null){
                const itemSize = 4;
                const padding = itemSize;
                if (item != null) {
                    const dir = Geometry.d4[Mathf.mod(rotation, 4)];
                    const offset = Tmp.v1.set(dir.x, dir.y).scl(block.size * Vars.tilesize / 2)
                    .add(padding * dir.x, padding * dir.y).scl(Mathf.clamp(progress) - 0.5);

                    Draw.rect(item.fullIcon, x + offset.x, y + offset.y, itemSize, itemSize);
                }
            }

            Draw.rect(Core.atlas.find(block.name + "-top"), x, y, rotation * 90);
            Draw.reset();

            Draw.z(lastZ);
        },

        acceptItem(source, item){
            const {current, items, rotation} = this;
            return current == null && items.total() == 0 && source.relativeTo(this) == rotation;
        },

        updateTile(){
            const {block, items} = this;
            const {speed} = block;
            this.progress += this.edelta() / speed * 2;
            
            if(this.current == null && items.total() > 0){
                this.current = items.first();
            }

            const {current, progress, next} = this;
            if(current != null && next != null){
                if(progress >= (1 - 1/speed) && this.moveForward(current)){
                    items.remove(current, 1);
                    this.current = null;
                    this.progress %= (1 - 1/speed);

                    if(next.block === block){
                        next.progress = this.progress;
                        this.progress = 0;
                    }
                }
            }
        }
    });

exports.fluxRail = fluxRail;
