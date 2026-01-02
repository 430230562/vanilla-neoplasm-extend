const environment = require("vne/block/environment")
const status = require("vne/status")
const item = require("vne/item")

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

function NeoplasmRegenAbility(slurpSpeed,regenPerSlurp,slurpEffectChance){
    return extend(Ability,{
		wasHealed: false,
		update(unit){
			if(unit.damaged()){
				this.wasHealed = false;
				unit.tileOn().circle(unit.type.hitSize / 8,cons(tile => {
    				if(tile != null){
						let puddle = Puddles.get(tile)
						if(puddle != null && puddle.liquid == Liquids.neoplasm){
							puddle.amount -= slurpSpeed
							unit.heal(slurpSpeed * regenPerSlurp)
							this.wasHealed = true;
						}

						if(puddle.amount <= 0){
							puddle.remove()
						}
					}
    			}))
			}
			if(this.wasHealed && Mathf.chanceDelta(slurpEffectChance)){
				Fx.neoplasmHeal.at(unit)
			}
		}
	})
}

function MoveLiquidAbility(liquid,range,amount,healthPercent){
	return extend(Ability,{
		update(unit){
		    if(unit.health / unit.maxHealth <= healthPercent){
    			unit.tileOn().circle(range / 8,cons(tile => {
    				if(tile != null)Puddles.deposit(tile,liquid,amount);
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
		    if(unit.tileOn() != null)unit.tileOn().circle(range / 8,cons(tile => {
				if(tile != null)Puddles.deposit(tile,Liquids.neoplasm,amount);
			}))
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