exports.ammoniaTurbine = new Effect(100, e => {
    Draw.color(Color.valueOf("57c3c2"));
    Draw.z(Layer.bullet - 1)
    Draw.alpha(e.fslope() * 0.8);

    Fx.rand.setSeed(e.id);
    for (let i = 0; i < 3; i++) {
        Fx.v.trns(Fx.rand.random(360), Fx.rand.random(e.finpow() * 14))
            .add(e.x, e.y);
        Fill.circle(Fx.v.x, Fx.v.y, Fx.rand.random(1.4, 3.4));
    }
})