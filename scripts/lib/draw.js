function DrawMultiRotationRegion(suffix, firSpeed, radius, secSpeed, i, spinSprite) {
    return extend(DrawRegion, suffix, {
        draw(build) {
            let z = Draw.z();

            for (let j = 0; j < i; j++) {
                if (spinSprite) {
                    Drawf.spinSprite(
                    this.region,
                    build.x + Angles.trnsx(build.totalProgress * firSpeed + (360 / i) * j, 0, radius),
                    build.y + Angles.trnsy(build.totalProgress * firSpeed + (360 / i) * j, 0, radius),
                    build.totalProgress * secSpeed);
                } else {
                    Draw.rect(
                    this.region,
                    build.x + Angles.trnsx(build.totalProgress * firSpeed + (360 / i) * j, 0, radius),
                    build.y + Angles.trnsy(build.totalProgress * firSpeed + (360 / i) * j, 0, radius),
                    build.totalProgress * secSpeed);
                }
            }
            Draw.z(z);
        },
        drawPlan(block, plan, list) {
            for (let j = 0; j < i; j++) {
                if (spinSprite) {
                    Drawf.spinSprite(
                    this.region,
                    plan.drawx() + Angles.trnsx((360 / i) * j, 0, radius),
                    plan.drawy() + Angles.trnsy((360 / i) * j, 0, radius),
                    0);
                } else {
                    Draw.rect(
                    this.region,
                    plan.drawx() + Angles.trnsx((360 / i) * j, 0, radius),
                    plan.drawy() + Angles.trnsy((360 / i) * j, 0, radius),
                    0);
                }
            }
        }
    })
}
exports.DrawMultiRotationRegion = DrawMultiRotationRegion