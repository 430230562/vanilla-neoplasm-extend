const applystatus = new Stat('applystatus', StatCat.function),
applyduring = new Stat('applyduring', StatCat.function),
shieldamount = new Stat('shieldamount', StatCat.function),
shieldmax = new Stat('shieldamount', StatCat.function);

function StatusShieldProjector(name, abilities) {
    const projector = extend(Block, name, {
        setStats() {
            this.super$setStats();

            this.stats.add(Stat.range, abilities.range);

            if (abilities.applyDuring > 0) {
                this.stats.add(applystatus, abilities.applyStatus);
                this.stats.add(applyduring, abilities.applyDuring);
            }

            if (abilities.shieldAmount > 0) {
                this.stats.add(shieldamount, abilities.shieldAmount);
                this.stats.add(shieldmax, abilities.shieldMax);
            }
        },
        update: true,
        consumesPower: true,
    })
    projector.buildType = prov(() => extend(Building, {
        t: 0,
        updateTile() {
            this.t += Time.delta

            let {
                x, y, team, block
            } = this

            let {
                range, reload, applyDuring, applyStatus, shieldAmount, shieldMax
            } = abilities

            Units.nearby(team, x, y, range, unit => {
                if (this.t > reload) {
                    if (applyDuring > 0) {
                        unit.apply(applyStatus, applyDuring);
                    }
                    if (shieldAmount > 0) {
                        unit.shield = Math.min(shieldMax, unit.shield + shieldAmount)
                    }
                    Fx.overdriveWave.at(x, y, range, Pal.accent, null);
                    this.t %= reload
                }
            })
        }
    }))
    return projector
}

const block = StatusShieldProjector('sfxg-projector', {
    range: 80, //范围

    reload: 60, //加盾和状态的间隔

    applyStatus: StatusEffects.burning,
    applyDuring: 120, // -1 为禁用

    shieldAmount: 50, // -1 为禁用
    shieldMax: 100

})