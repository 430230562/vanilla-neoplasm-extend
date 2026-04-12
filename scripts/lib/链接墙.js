adamantaneWall.buildType = prov(() =>
 extend(Wall.WallBuild, adamantaneWall, {
  updateTile() {
   this.super$updateTile();
   let count = 0;
   this.proximity.each((other) => {
    if (other.block == this.block) {
     count++;
    }
   });
   this.armor = this.block.armor * count + this.block.armor
   this.maxHealth = this.block.health * count + this.block.health
  },
  update() {
   this.super$update();
   if (this.health > this.maxHealth * 0.1) { this.health += 0.1 }
  },
    draw() {
   // this.super$draw();
   if (!autotileRegions) {
    autotileRegions = TileBitmask.load(this.block.name); // 贴图多了-autotile，这里也写吧，按理应该删掉-autotile
   }//我受够了
   const { x, y } = this;
   let bits = 0;
   for (let i = 0; i < 8; i++) {
    let p = Geometry.d8[i];
    let other = this.nearby(p.x, p.y);
    if (other != null && other.block == this.block) {
     bits |= (1 << i);
    }
   }
   let bit = TileBitmask.values[bits];
   const region = autotileRegions[bit];
   Draw.rect(region, x, y);
  },
 }));
exports.adamantaneWall = adamantaneWall;
Object.assign(adamantaneWall, {})