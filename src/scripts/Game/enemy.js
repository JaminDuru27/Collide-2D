export function getExportEnemy(){
    return`

function Enemy(Game){
    const res = {
        dead: false,
        load(){
            let n = 100
            this.spriteBox = Rect(Game, this)
            .$x(Math.floor(Math.random() * ((Game.w - 100) - 100)-1000))
            .$y(200)
            .$color('rgba(214, 24, 24, 0)')
            .$enablePanningOnOverflow(false)
            .exception(['player','camerabox','enemybox'])
            .$name('enemybox')
            .onExceptionCollision((rect, player)=>{
                if(this.dead || player.dead)return
                if(rect.name !== 'player')return
                if(n > 100){
                    if(player.dead)return
                    clips[3].play()
                    player.healthBar.decrement = 10
                    player.healthBar.decrease()
                    player.hit = true
                    player.statesManager.
                    play('HitState')

                    n = 0
                }else n++
            })
            //healthbar
            this.healthBar = HealthBar(this.spriteBox)
            .$offsety(-5)
            .addbar('red', 100)
            .addbar('green', 100)
            .onEmpty(()=>{
                this.dead = true
                this.spriteBox.$friction(.9)
            })
            //gravity            
            this.gravity = Gravity(this.spriteBox)
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
            this.sprite.addClip({name: 'Roll',from:39, to: 45,}).loop().delay(5),
            this.sprite.addClip({name: 'Hit',from:47, to: 51,}).loop().delay(9),
            this.sprite.addClip({name: 'Death',from:54, to: 59,}).delay(6),
            ]
            clips[0].play()

            this.nodes = [this.spriteBox, this.healthBar, this.sprite,this.gravity]
            clips[0].play()
            setInterval(()=>{
                if(this.dead){
                    clips[5].play()
                    return
                }
                const i = Math.floor(Math.random() * (clips.length - 1- 0) + 0)
                const clip = clips[i]
                if(clip.name === 'Idle'){
                    this.spriteBox.vx = 0
                }
                else if(clip.name ==='Run'){
                    const m = Math.random()
                    if(m < .5){
                        this.spriteBox.vx = 5
                        this.sprite.flipX = 'right'                   
                    }else{
                        this.spriteBox.vx = -5
                        this.sprite.flipX = 'left'                   
                    }
                    clip.play()
                }
                else if(clip.name ==='Jump'){
                    this.spriteBox.vy = -15
                    clip.play()
                }
                else if(clip.name ==='Roll'){
                    this.spriteBox.vx = (this.sprite.flipX ==='right')?4:-4
                    this.spriteBox.attack = true
                    clip.play()
                }
                else if(clip.name !=='Roll'){
                    this.spriteBox.attack = false
                }
                
            }, 1000)
        },
        update(props){
            this.nodes.forEach(node=>{
                if(node.update)node.update(props)
            })
        }
    }
    res.load()
    return res
}`

}