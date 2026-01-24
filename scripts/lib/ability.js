const environment = require("vne/block/environment")
const status = require("vne/status")
const item = require("vne/item")

function UnlimitedPuddle(tile,liquid,amount){
    //不包括太空及液体当场蒸发的情况
    if(tile != null){
        let other = Puddles.get(tile);
        if(other != null && other.liquid == liquid){
            other.amount += amount
            if(other.lastRipple <= Time.time - 40){
                Fx.ripple.at(other.x * 8, other.y * 8, 1, liquid.color);
            }
        }else{
            let puddle = Puddle.create();
            puddle.tile = tile;
            puddle.liquid = liquid;
            puddle.amount = amount;
            puddle.set(tile.x, tile.y);
            Puddles.register(puddle);
            puddle.add();
        }
    }
    //我觉得作为一个function还是要return一下吧
    return;
}
exports.UnlimitedPuddle = UnlimitedPuddle

function MendFieldAbility(amount,reload,range){
	return extend(Ability,{
		i: 0,
		wasHealed: false,
		update(unit){
			this.i += Time.delta;
			
			if(this.i >= reload){
				this.wasHealed = false;
				
				Units.nearby(unit.team, unit.x, unit.y, range, other => {
					if(other.health < other.maxHealth){
						Fx.heal.at(other);
						this.wasHealed = true;
					}
					other.heal(amount);
				}),
				Units.nearbyBuildings(unit.x, unit.y, range, b => {
					if(b.team === unit.team && b.health < b.maxHealth){
						Fx.heal.at(b);
						this.wasHealed = true;
						b.heal(amount);
					}
				})
				if(this.wasHealed){
					Fx.healWaveDynamic.at(unit,range);
				}
				this.i = 0;
			}
		},
		localized(){
			return Core.bundle.format("ability.mendField");
		},
		addStats(t){
            this.super$addStats(t);
            t.add(Core.bundle.format("ability.stat.repairInterval", Strings.autoFixed(range / 8, 2)));
            t.row();
            t.add(Core.bundle.format("bullet.range", Strings.autoFixed(range / 8, 2)));
            t.row();
            t.add(Core.bundle.format("ability.stat.repairAmount", Strings.autoFixed(amount, 2)))
        }
	})
}
exports.MendFieldAbility = MendFieldAbility;

function MoveLiquidAbility(liquid,range,amount,healthPercent){
	return extend(Ability,{
		update(unit){
		    if(unit.health / unit.maxHealth <= healthPercent && unit.tileOn() != null && unit.getDuration(status.antagonistic) > 0){
    			unit.tileOn().circle(range / 8,cons(tile => {
    				UnlimitedPuddle(tile,liquid,amount);
    			}))
			}
		},
		localized(){
			return Core.bundle.format("ability.moveLiquid");
		},
		addStats(t){
		    this.super$addStats(t);
		    
		    t.add("" + liquid.localizedName);
		    t.row();
		    t.add(Core.bundle.format("bullet.range", Strings.autoFixed(range / 8, 2)));
		}
	})
}
exports.MoveLiquidAbility = MoveLiquidAbility;

function DeathNeoplasmAbility(range,amount){
	return extend(Ability,{
		death(unit){
		    if(unit.tileOn() != null && unit.getDuration(status.antagonistic) > 0){
			    unit.tileOn().circle(range / 8,cons(tile => {
    				UnlimitedPuddle(tile,Liquids.neoplasm,amount * Vars.state.rules.unitHealth(unit.team));
    			}))
			}
		},
		localized(){
			return Core.bundle.format("ability.deathNeoplasm");
		},
		addStats(t){
		    this.super$addStats(t);
		    t.add(Core.bundle.format("bullet.range", Strings.autoFixed(range / 8, 2)));
		}
	})
}
exports.DeathNeoplasmAbility = DeathNeoplasmAbility;

function ToxicAbility(damage, reload, range) {
	return extend(Ability, {
		i: 0,
		j: 75,
		update(unit) {
			this.i += Time.delta
			this.j += Time.delta
			if (this.i >= reload) {
				Units.nearby(null, unit.x, unit.y, range, other => {
					other.health -= damage;
					other.apply(status.poisoned, 60 * 15);
				})
				Units.nearbyBuildings(unit.x, unit.y, range, b => {
					b.health -= damage / 4
					if(b.health <= 0){b.kill()}
				})
				this.i = 0
			}
			if (this.j >= 15) {
				Fx.titanSmoke.at(
					unit.x + Mathf.range(range * 0.7071 - 20),
					unit.y + Mathf.range(range * 0.7071 - 20),
					Color.valueOf("92AB117F")
				)
				this.j -= 15
			}
		},
		/*draw(unit){
			Draw.color(Color.red)
			
			for(let i = 0; i < 2; i++){
				let rot = i * 180 + Time.time * 1;
				Lines.arc(unit.x, unit.y, range, 0.2, rot);
			}
		}*/
	})
}
exports.ToxicAbility = ToxicAbility

function DamageDownAbility(amount,range){
    return extend(Ability,{
        update(unit){
            const seq = Groups.bullet.intersect(unit.x - range, unit.y - range, range * 2, range * 2);
            seq.each(b => {
                 if(b.damage >= amount * Time.delta / 60 && b.type.hittable && b.team != unit.team){
                     b.damage -= amount * Time.delta/ 60
                 }else if(b.damage <= amount * Time.delta / 60 && b.team != unit.team){
                    b.absorb()
                 }
            })
        },
        localized(){
			return Core.bundle.format("ability.damageDown");
		},
		addStats(t){
		    this.super$addStats(t);
		    t.add(Core.bundle.format("bullet.range", Strings.autoFixed(range / 8, 2)));
		}
    })
}
exports.DamageDownAbility = DamageDownAbility;