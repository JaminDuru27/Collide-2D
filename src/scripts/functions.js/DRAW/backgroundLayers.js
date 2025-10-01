import { downloadLayer } from "./downloadLayer.js"
import { draw } from "./instances.js"

export function ImageLayers(Game){
    const res= {
        images : [],
        backLayer: [],
        middleLayer: [],
        frontLayer: [],
        w: 200, h: 200,
        speed:1, dir :'none',
        normalmode(){
            this.draw = this.drawNormal
        },
        parallaxmode(affectedlayers = []){
            this.draw = this.drawParallax
        },
        moveRight(indexesArray, velocitiesArray = []){
            if(this.dir === `right`)return
            this.dir = 'right'
            if(!indexesArray)indexesArray = [...this.images.map((x, i)=>i)]
            indexesArray.forEach(index=>{this?.images[index]?.moveRight()})
            velocitiesArray.forEach((velocity,i)=>{ if(this.images[indexesArray[i]])this.images[indexesArray[i]].vx = velocity})
        },
        stop(){
            this.images.forEach(img=>{
                img.stop()
            })
        },
        moveLeft(indexesArray, velocitiesArray = []){
            // if(this.dir === `left`)return
            this.dir = 'left'
            if(!indexesArray)indexesArray = [...this.images.map((x, i)=>i)]
            indexesArray.forEach(index=>{this?.images[index]?.moveLeft()})
            velocitiesArray.forEach((velocity,i)=>{ if(this.images[indexesArray[i]])this.images[indexesArray[i]].vx = velocity})
        },
        load(){
            this.updateCellSize()
            this.updateUrls()
            this.normalmode()
        },
        updateUrls(){
            // const name = draw.instance?.layers?.layer?.name
            // if(!name)return
            const array = draw.instance.library.find(`spriteLayer`).object.meta.array
            array.forEach((obj, i)=>{
                const name = obj.name
                const image = new Image()
                image.onload = ()=>{
                    image.width = 150
                    image.height = 100
                }
                image.src = downloadLayer(name, this.w, this.h).get().url
                this[`layer${i}`] = {
                    img:image, 
                    vx: 0, x: 0,
                    dir: 'static',
                    moveRight(value = i){
                        if(this.dir === `right`)return 
                        if(value < 0)value *= -1
                        this.vx = value
                        this.dir= `right`
                        return this
                    },
                    stop(){
                        this.vx = 0
                        this.dir = `static`
                        return this
                    },
                    moveLeft(value = i){
                        if(this.dir === `left`)return 
                        if(value < 0)value *= -1
                        this.vx = -value
                        this.dir = `left`
                        return this
                    }
                }
                this.images.push(this[`layer${i}`])
                this.backLayer.push(this[`layer${i}`])
            })
        },
        updateCellSize(){
            const grid = draw.instance.grid
            this.w = Game.w
            this.h = Game.h
        },
        drawNormal(ctx){
            this.images.forEach((obj)=>{
                const img = obj.img
                if(img.src)
                ctx.drawImage(img, 0, 0, this.w, this.h)
            })
        },
        updateparralaxvelocity(obj){
            if(obj.dir === `right`){
                obj.x -= (obj.vx * this.speed)
                // if(obj.vx < 0 && obj.x < -window.innerWidth)obj.x = 0    
                // if(obj.x > window.innerWidth)obj.x = 0  
            }  
            if(obj.dir === `left`){
                obj.x += (obj.vx * this.speed)
            }
        },
        drawParallax(ctx){
            this.images.forEach((obj)=>{
                this.updateparralaxvelocity(obj)
                const img = obj.img
                if(img.src){
                    ctx.drawImage(img, -this.w  + obj.x, 0, this.w, this.h)
                    ctx.drawImage(img, obj.x, 0, this.w, this.h)
                    ctx.drawImage(img, this.w + obj.x, 0, this.w, this.h)
                }
            })
        },

        update({ctx}){
            this?.draw(ctx)
        }
    }
    res.load()
    return res
}