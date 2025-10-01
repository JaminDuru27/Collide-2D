export function getExportPlayer(){
    return `


function Player (Game){
    const res ={
        dead: false,
        hit: false,
        load(){
            //boxes
            this.spriteBox = Rect(Game, this)
            .$x(100)
            .$y(100)
            .$color('rgba(29, 142, 142, 0)')
            .exception(['enemybox'])
            .$name('player')
            .onExceptionCollision((col, player)=>{
                if(this.dead)return
                if(this.spriteBox.attack){
                    //player is enemy
                    if(player.dead){
                        player.spriteBox.$friction(.3)
                        col.setVx((this.sprite.flipX ==='right')?15:-15)

                        return
                    }
                    col.setVx((this.sprite.flipX ==='right')?15:-15)
                    player.spriteBox.$friction(.3)
                    col.setVy(-8)
                    player.sprite.playclip('Hit')
                    player.healthBar.decrement = 5
                    player.healthBar.decrease()
                }
            })
            //animation

            this.animations= Animations(this.spriteBox)
            this.animations.addAnimation({
                name: 'intro',
                delay:5,
                keyValueArray: [
                    {callback:()=>{
                        this.spriteBox.setVx(5.5)
                    }},
                    {callback:()=>{
                        this.spriteBox.$friction(.15)
                    }}
                ]
            }).play()
            this.deadAnimation = this.animations.addAnimation({
                name: 'intro',
                delay:100,
                keyValueArray: [
                    {callback:({animation})=>{
                        animation.delay(10)
                        this.spriteBox.setVx(0)
                        this.sprite.flipX = (this.sprite.flipX === 'right')?'left':'right'
                    }},
                    {callback:({animation})=>{
                        animation.delay(140)
                        this.spriteBox.setVx(1.5)
                        this.spriteBox.$friction(.01)
                        this.sprite.flipX = (this.sprite.flipX === 'right')?'left':'right'
                    }},
                    {callback:()=>{
                        this.spriteBox.$friction(.5)
                        this.dead = true
                        this.statesManager.play('DeadState')
                        clips[5].play()
                    }}
                ]
            })
            this.cameraBox = this.spriteBox.join({offsetx: -400, offsety: -350, offsetw: 800, offseth: 600})
            .$name('camerabox')
            .$enableOverflow(true)
            .$enablePanningOnOverflow(true) 
            .$color('rgba(115, 0, 0, 0)')
            //healthbar
            let called
            this.healthBar = HealthBar(this.spriteBox)
            .$offsety(-10)
            .addbar('red', 100)
            .addbar('green', 100)
            .addbar('yellow', 100)
            .onEmptyBar(()=>{
                this.deadAnimation.play()
                if(called)return  
                
                called = true
            })
            //gravity            
            this.gravity = Gravity(this.spriteBox)
            .setFriction(.99)
            //sprite
            this.sprite = Sprite(this.spriteBox, Game, './assets/player.png',8, 8)
            .$offsetx(-20)
            .$offsety(-28)
            .$offsetw(40)
            .$offseth(40)
            const clips = [
            this.sprite.addClip({name: 'Idle',from:0, to: 3,}).loop().play().delay(8),
            this.sprite.addClip({name: 'Run',from:17, to: 31,}).loop().delay(2),
            this.sprite.addClip({name: 'Jump',from:17, to: 18,}).delay(10),
            this.sprite.addClip({name: 'Roll',from:40, to: 45,}).loop().delay(2),
            this.sprite.addClip({name: 'Hit',from:47, to: 51,}).delay(4),
            this.sprite.addClip({name: 'Death',from:54, to: 59,}).delay(6),
            ]
            clips[0].play()
            //statesManager
            this.statesManager = StatesManager()
            const idle = this.statesManager.addState('IdleState', {rect: this.spriteBox, player: this}, ({rect, player})=>rect.vx === 0 && !rect.attack && !player.dead && !player.hit, 
            ()=>{
                clips[0].play()
            })
            this.statesManager.addState('RunRightState', {rect: this.spriteBox, player:this}, ({rect, player})=>rect.vx > 0 && !rect.attack && !player.dead && !player.hit, 
            ()=>{
                clips[1].play()
                this.sprite.flipX = 'right'  
            })
            .onupdate = ()=>{
                this.particles.generate({dir: 'bottomleft', number: 5,})
            }
            this.statesManager.addState('RunLeftState', {rect: this.spriteBox, player: this}, ({rect, player})=>rect.vx < 0 && !rect.attack && !player.dead && !player.hit, 
            ()=>{
                clips[1].play()
                this.sprite.flipX = 'left'  
            })
            .onupdate = ()=>{
                this.particles.generate({dir: 'bottomright', number: 2,})
            }
            this.statesManager.addState('FallState', {rect: this.spriteBox, player: this}, ({rect, player})=>rect.vy > 0 && !rect.attack && !player.dead && !player.hit, 
            ()=>{
                clips[2].play()
            })
            this.statesManager.addState('JumpState', {rect: this.spriteBox, player: this}, ({rect, player})=>rect.vy < 0 && !rect.attack && !player.dead && !player.hit, 
            ()=>{
                clips[2].play()
                this.particles.generate({dir: 'bottom', number: 2,})
            })
            this.statesManager.addState('HitState', {rect: this.spriteBox, player: this}, ({rect, player})=> false & !player.dead, 
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
                rect.setVx((this.sprite.flipX === 'right')?15: -15)
                rect.$friction(.3)
                clips[3].play()
            })
            .onupdate = ({rect})=>{
                if(this.sprite.frame >= clips[3].to){
                    rect.attack = false
                    rect.$friction(.2)
                    this.particles.generate({dir: 'bottom', number: 50})
                }
            }
            this.statesManager.addState('DeadState', {rect: this.spriteBox}, ({rect})=>false, 
            ()=>{
                // clips[5].play()
                // console.log('player is dead')
            })
            //particles
            this.particles = Particles(this.spriteBox)
            //nodes
            this.nodes = [this.animations,this.particles,this.sprite,this.healthBar,this.spriteBox, this.cameraBox,this.statesManager,this.gravity]

             //controls
            this.keys = KeyBinder()
            this.keys.bind({name: 'jump', key: 'ArrowUp', callback:()=>{
                if(!this.spriteBox.attack && !this.dead){
                    this.spriteBox.setVy(-8)
                }
            }})
            this.keys.bind({name: 'walkleft', key: 'ArrowLeft', callback:()=>{
                if(!this.spriteBox.attack && !this.dead){
                    this.spriteBox.$friction(0)
                    this.spriteBox.setVx(-4)
                }
            }})
            this.keys.bind({name: 'walkright', key: 'ArrowRight', callback:()=>{
                if(!this.spriteBox.attack && !this.dead){
                    this.spriteBox.$friction(0)
                    this.spriteBox.setVx(4)
                }

            }})
            this.keys.bind({name: 'attack', key: 'a', callback:()=>{
                this.spriteBox.attack = true
            }})
            this.keys.bind({name: 'walkright', type: 'keyup', callback:()=>{
                this.spriteBox.$friction(.2)
            }})
        },

        update(props){

            this.nodes.forEach(node=>{
                if(node.update)node.update(props)
            })
        }
    }
    res.load()
    return res
}           
                  
                     
    `
}