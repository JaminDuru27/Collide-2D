export function Sprite(player, game, image, nx, ny){
    const res = {
        nx, ny, flip: 'right',
        framex: 0, framey: 0, frame: 0,
        load(){
            this.image = image
            this.image.onload = ()=>{
                
            }
            this.loaded = true
            this.imgw = this.image.width
            this.imgh = this.image.height
            this.imgcw = this.image.width / nx
            this.imgch = this.image.height / ny

            this.delay = Delay(10, ()=>{
                ///updateclip with delay
                this?.clipping()
            })
            this.clipping = this.clipFrames(0, 3)
        },
        clip(from, to){
            this.clipping = this.clipFrames(from, to)
        },
        clipFrames(from, to){
            const fr = Math.min(from, to)
            this.frame = fr
            return ()=>{
                const fr = Math.min(from, to)
                const t = Math.max(from, to)
                this.frame = (this.frame < to)?this.frame + 1 :this.frame = fr
                this.updateFrame()
            }
        },
        updateFrame(){
            if(this.frame === 0){
                this.framex = 0
                this.framey = 0
                return
            }
            this.framey = Math.floor(this.frame / ny)
            this.framex = this.frame % nx
        },
        playclip(name){
            if(this.currentClip === name)return
            this.currentClip = name
            const obj = player.clips[name]
            this.clip(obj.sx, obj.sy)
        },
        draw(){
            if(!this.loaded)return
            game.ctx.save()
            if(this.flip===`left`){
                game.ctx.translate(player.x + player.w /2, player.y + player.h / 2)
                game.ctx.scale(-1, 1)
                game.ctx.drawImage(this.image, this.framex * this.imgcw,this.framey * this.imgch, this.imgcw, this.imgch,
            player.x, player.y, -player.w/2, -player.h/2)
            }else
            game.ctx.drawImage(this.image, this.framex * this.imgcw,this.framey * this.imgch, this.imgcw, this.imgch,
            player.x, player.y, player.w, player.h)
            
            game.ctx.restore()
        },
        update(){
            this.draw()
            this.updateFrame()
            this.delay.update()
        },
    }
    res.load()
    return res
}
export function Delay(delay, callback){
    const res = {
        inc: 0,
        load(){},
        set(d){
            delay= d
        },
        update(){
            if(this.inc >= delay){
                callback()
                this.inc = 0
            }else this.inc ++
        }
    }
    res.load()
    return res
}