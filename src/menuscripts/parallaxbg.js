export function ParralaxBG(imageArray, game, initpos){
    const res = {
        speed : .5,
        angle: 0,
        imageArray: [...imageArray.map((e, vx)=>{return {img: e, x: initpos.x, y: initpos.y,vx, vy: 0}})],
        load(){
            this.prepC()
            this.stop()
        },
        prepC(){
            this.canvas = document.querySelector(`.bgs`)
            this.ctx = this.canvas.getContext(`2d`)
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
        },
        scrollRight(){
            this.imageArray.forEach(obj=>{
                obj.vx = (obj.vx > 0)? obj.vx *= -1 : obj.vx
            })
            this.scroll = this.updateVelocity
        },
        stop(){
            this.scroll = ()=>{}
        },
        scrollLeft(){
            this.imageArray.forEach(obj=>{
                obj.vx = (obj.vx < 0)? obj.vx *= -1 : obj.vx
            })
            this.scroll = this.updateVelocity
        },
        updateVelocity(){
            this.imageArray.forEach(obj=>{
                if(obj.vx === 0)return //for main bg
                if(obj.vx < 0 && obj.x < -window.innerWidth)obj.x = 0    
                obj.x += obj.vx * this.speed //right
                if(obj.vx > 0 && obj.x > window.innerWidth)obj.x = 0    
                obj.x += obj.vx * this.speed //left
                obj.y += obj.vy
                const div = game.textHandler.prevdiv
                if(!div)return
                const b = div.getBoundingClientRect()
                div.style.top = b.y - 1 + `px`
                // div.style.left = b.x - 1 + `px`
            })
        },
        draw(){
            this.imageArray.forEach((obj, x)=>{
                let ctx = this.ctx
                if(x > 1)ctx = game.ctx
                ctx.drawImage(obj.img, obj.x, obj.y, game.canvas.width, game.canvas.height)
                ctx.drawImage(obj.img, obj.x + game.canvas.width, obj.y, game.canvas.width, game.canvas.height)
                ctx.drawImage(obj.img, obj.x - game.canvas.width, obj.y, game.canvas.width, game.canvas.height)
            })
        },
        update(){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.fillRect(0, 0, 300, 300)
            this.draw()
            this?.scroll()
        }
    }

    res.load()
    return res
}