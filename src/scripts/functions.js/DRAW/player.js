import { Sprite } from "./spriteHandler.js"
import { Rect } from "./rect.js"
import { Controls } from "../../components/DRAW/controls.js"
import { HealthBar } from "./healthbar.js"
import { StatesManager } from "./statesManager.js"

export function Player(Game){
    const res = {
        dead: false,
        hit:false,
        load(){
            
            this.spriteBox = Rect(Game, this)
            .$name('player')
            .$enablePanningOnOverflow(false)
            .$x(60)
            .$color(`#ff000070`)
            .exception(['enemybox'])
            .$enableOverflow(true)
            this.gravity = Gravity(this.spriteBox)
            this.cameraBox = this.spriteBox.join({offsetx: -500, offsety: -350, offsetw: 1000, offseth: 600})
            .$name('camerabox')
            // .$enablePanningYOnOverflow(true)
            // .$enablePanningXOnOverflow(false)
            .$enableOverflow(true)
            .$enablePanningOnOverflow(true) 
            .$color(`rgba(115, 0, 0, 0.4)`)
            .exception(['enemybox'])
            .onWindowLeft(()=>{
                Game.bg.moveLeft([0, 1],[0, this.spriteBox.vx])
            })
            .onWindowRight(()=>{
                Game.bg.moveRight([0, 1], [0, this.spriteBox.vx],)
            })
            this.sprite = Sprite(this.spriteBox, Game, `./assets/images/player.png`,8, 8)
            .$offsetx(-10)
            .$offsety(-12)
            .$offsetw(20)
            .$offseth(20)
            
            const clips = [
            this.sprite.addClip({name: `Idle`,from:0, to: 3,}).loop().play().delay(4),
            this.sprite.addClip({name: `Run`,from:17, to: 31,}).loop().delay(2),
            this.sprite.addClip({name: `Jump`,from:17, to: 18,}).delay(10),
            this.sprite.addClip({name: `Roll`,from:39, to: 45,}).loop().delay(2),
            this.sprite.addClip({name: `Hit`,from:47, to: 51,}).loop().delay(9),
            this.sprite.addClip({name: `Death`,from:54, to: 59,}).delay(6),
            ]

            this.controls(this.spriteBox,this.cameraBox,this.sprite)
            this.healthBar = HealthBar(this.spriteBox)
            .addbar()
            .addbar('yellow')
            .addbar('purple', 70)
            .$offsety(-10)

            this.statesManager = StatesManager()
            // this.statesManager.addState('IdleState', {rect: this.spriteBox}, ({rect})=>rect.vx === 0, 
            // ()=>{
                // clips[0].play()
            // })
            const idle = this.statesManager.addState('IdleState', {rect: this.spriteBox, player: this}, ({rect, player})=>rect.vx === 0 && !rect.attack && !player.dead && !player.hit, 
            ()=>{
                clips[0].play()
            })
            this.statesManager.addState('RunRightState', {rect: this.spriteBox, player:this}, ({rect, player})=>rect.vx > 0 && !rect.attack && !player.dead && !player.hit, 
            ()=>{
                clips[1].play()
                this.sprite.flipX = 'right'  
            })
            this.statesManager.addState('RunLeftState', {rect: this.spriteBox, player: this}, ({rect, player})=>rect.vx < 0 && !rect.attack && !player.dead && !player.hit, 
            ()=>{
                clips[1].play()
                this.sprite.flipX = 'left'  
            })
            this.statesManager.addState('JumpState', {rect: this.spriteBox, player: this}, ({rect, player})=>rect.vy > 0 && !rect.attack && !player.dead && !player.hit, 
            ()=>{
                clips[2].play()
            })
            this.statesManager.addState('FallState', {rect: this.spriteBox, player: this}, ({rect, player})=>rect.vy < 0 && !rect.attack && !player.dead && !player.hit, 
            ()=>{
                clips[2].play()
            })
            this.statesManager.addState('HitState', {rect: this.spriteBox, player: this}, ({rect, player})=> false, 
            ({player})=>{
                if(!this.hit)return
                clips[4].play()
                const m = Math.random()
                player.spriteBox.x += (m > .5)? 10:-15 
            })
            .onupdate = ({rect})=>{
                if(this.sprite.frame >= clips[4].to){
                    this.hit = false
                }
            }
            this.statesManager.addState('AttackState', {rect: this.spriteBox, player: this}, ({rect, player})=>rect.attack && !player.dead && !player.hit, 
            ({rect})=>{
                rect.vx = (this.sprite.flipX === 'right')?15: -15
                clips[3].play()
            })
            .onupdate = ({rect})=>{
                if(this.sprite.frame >= clips[3].to){
                    rect.attack = false
                    rect.vx = 0
                }
            }
            this.statesManager.addState('DeadState', {rect: this.spriteBox}, ({rect})=>this.healthBar.bars.length <= 0, 
            ()=>{
                this.dead = true
                clips[5].play()
            })

            this.nodes = [this.sprite,this.healthBar,this.spriteBox,this.cameraBox,this.statesManager,this.gravity, ]
        },
        controls(spriteBox, cameraBox, sprite){
            Game.keybinder.bind({name: 'd', key: 'ArrowLeft', callback:  ()=>{
                if(!this.spriteBox.attack && !this.dead)
                spriteBox.vx = -4
            }})
            Game.keybinder.bind({name:'u', key:'ArrowUp', callback:  ()=>{
                if(!this.spriteBox.attack && !this.dead)
                spriteBox.vy = -8
            }})
            Game.keybinder.bind({name:'d', key: 'ArrowRight', callback: ()=>{
                if(!this.spriteBox.attack && !this.dead)
                spriteBox.vx = 4
            }})
            Game.keybinder.bind({name:'a', key: 'a',callback: ()=>{
                spriteBox.attack = true
            }})
            Game.keybinder.bind({name:'d', type: 'keyup',callback: ()=>{
                spriteBox.friction = 0.1
                spriteBox.attack = false
            }})
        },
        update(props){
            this?.nodes?.forEach(node=>{
                node.update(props)
            })
        }
    }
    res.load()
    return res
}

export function Gravity(rect){
    const res = {
        friction: .95,
        load(){
        },
        update({ctx}){            
            rect.vy += rect.weight
            rect.vy *= this.friction
        }
    }

    res.load()
    return res
}
