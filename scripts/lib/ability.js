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

function ReflectFieldAbility(regen,max,range){
    return extend(ForceFieldAbility,{
        update(unit){
            if(unit.shield > 0 && !this.wasBroken){
                var seq = Groups.bullet.intersect(unit.x - range, unit.y - range, range * 2, range * 2)
                seq.each(b => {
                    if(b.team != unit.team){
                        this.alpha = 0.8;

                        if(b.type.hittable && b.type.absorbable){
                            b.team = unit.team;
                            
							Fx.absorb.at(b)
                            if(b.vel.x <= b.vel.y){
                                b.vel.x *= -1
                            }else{
                                b.vel.y *= -1
                            }
                            
                            unit.shield -= b.damage
                            
                        }else{
                            b.absorb();
                            Fx.absorb.at(b)
                            
                            unit.shield -= b.damage * 3
                        }
                    }
                })
            }
			this.alpha = Math.max(this.alpha - Time.delta / 10, 0);

            if(!this.wasBroken){
                unit.shield = Math.min(Time.delta * regen + unit.shield, max)
            }

			if(unit.shield <= 0 && !wasBroken){
            	unit.shield -= 40 * 60 * regen;

            	Fx.shieldBreak.at(unit.x, unit.y, range, unit.type.shieldColor(unit), this);
        	}

        	wasBroken = unit.shield <= 0;
        },

        draw(unit){
            Draw.color(Color.valueOf("7e8ae6"), unit.team.color, this.alpha);
            
            if(unit.shield >= 0 && unit.health >= unit.type.health){
                if(Vars.renderer.animateShields){
                    Draw.z(125);
                    Fill.poly(unit.x, unit.y, 4, range * 1.414, 45);
                }else{
                    Draw.z(125);
                    Lines.stroke(1.5);
                    Draw.alpha(0.09);
                    Fill.poly(unit.x, unit.y, 4, range * 1.414, 45);
                    Draw.alpha(1);
                    Lines.poly(unit.x, unit.y, 4, range * 1.414, 45);
                }
            }
        },
        localized(){
			return Core.bundle.format("ability.reflectField");
		},
		addStats(t){
            this.super$addStats(t);
            t.add(Core.bundle.format("bullet.range", Strings.autoFixed(range / 8, 2)));
            t.row();
            t.add(Core.bundle.format("ability.stat.shield", Strings.autoFixed(max, 2)));
            t.row();
            t.add(Core.bundle.format("ability.stat.repairspeed", Strings.autoFixed(regen * 60, 2)));
        },
        displayBars(unit,bars){
            bars.add(new Bar("stat.shieldhealth", unit.team.color, () => unit.shield / max)).row();
        }
    })
}
exports.ReflectFieldAbility = ReflectFieldAbility

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
		    t.add("" + liquid.localizedName));
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