import { draw } from "./instances.js"

export function Sprite({indxInc = 0, indyInc = 0, indx = 0, indy = 0,widthMult = 1,heightMult = 1, sx, sy, sw, sh, src, layerid}){
    let founddom
    const res = {
        sx, sy, sw, sh,
        widthMult, heightMult,
        indx, indy,
        isselected: false,
        load(){
            const process1 = this.addToCurrentLayer()
            this.loadImage(this.process1)    
        },
        highlightMe(){
            //set on/off for checking and highlighting if its colliding
                this.isselected = true
                draw.instance.layers.sprite = this
        },
        mouseiscolliding(){
            const mouse = draw.instance.highlight.target
            if(!mouse)return    
            if(!this.validateIndex())return
            const grid = draw.instance.grid
            
            const box = grid.boxes[this.indy][this.indx]
            return (
                mouse.indx === box.indx &&
                mouse.indy === box.indy
            )
        },
        addToCurrentLayer(){
            const dom = draw?.instance?.assets?.domObj
            if(!dom)return
            const data = dom.getData()
            this.data  = data
            if(!sx)this.sx = 0 
            if(!sy)this.sy = 0 
            if(!this.sw)this.sw = data.general.imgcw 
            if(!this.sh)this.sh = data.general.imgch 
            if(draw.instance.highlight.target){
                let name = draw.instance?.layers?.layer?.name
                if(!name) name = draw.instance?.layers[0]?.name
                if(!name)return
                const array = draw.instance.library.find(`spriteLayer`).object.meta.array
                let layer = array.filter(e=>e.name === name)[0]?.array
                if(layerid) layer  = array.filter(e=>e.id === id)[0]?.array
                if(layer){
                    if(!this.indx) this.indx = (draw.instance.highlight.target.indx) || 0
                    if(!this.indy) this.indy = (draw.instance.highlight.target.indy) || 0
                    this.indx += indxInc
                    this.indy += indyInc
                    const cond = (obj) => this.indx === obj.indx && this.indy === obj.indy
                    const filter = layer.map((col, x)=>{
                        if(cond(col)){
                            layer.splice(x, 1)
                        }
                    })
                    layer.push(this)
                    this.process1 = `complete`
                }
                
            }
        },
        loadImage(process){
            const dom = draw?.instance?.assets?.domObj
            this.image = new Image()
            this.image.onload = ()=>{
                this.loaded = true
            }
            if(dom)this.image.src = dom.src
            if (src) this.image.src = src
        },
        validateIndex(){
            const grid = draw.instance.grid.boxes
            if(!this.indy && this.indy !== 0)return false
            if(!this.indx && this.indx !== 0)return false
            if(this.indy > grid.length - 1)return false
            if(this.indy < 0)return false
            if(this.indx > grid[this.indy].length -1)return false
            if(this.indx < 0)return false
            return true
        },
        resizedsource(){
            const data = {
                x: (Math.floor(this.sx / this.sw) * this.sw),
                y: (Math.floor(this.sy / this.sh) * this.sh),
            }
            return data
        },
        draw(){
            if(this.loaded && this.indy >= 0 && this.indy >= 0){
                const ctx = draw.instance.ui.ctx
                const grid = draw.instance.grid
                if(this.validateIndex()){
                    const gridBox = grid.boxes[this.indy][this.indx]
                    const s = this.resizedsource() 
                    ctx.imageSmoothingEnabled = false
                    ctx.drawImage(this.image, s.x, s.y, this.sw , this.sh , gridBox.x , gridBox.y ,gridBox.w * widthMult, gridBox.h * heightMult)
                    if(this.isselected){
                        ctx.save()
                        ctx.strokeStyle = `red`
                        ctx.lineWidth = 4
                        ctx.setLineDash([])
                        ctx.strokeRect(gridBox.x, gridBox.y, gridBox.w * widthMult, gridBox.h * heightMult)
                        ctx.restore()
                    }
                }
               
            }
        },
        update(){
            this.draw()
        }
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
        update(sprite){
            if(this.inc >= sprite.framedelay){
                callback()
                this.inc = 0
            }else this.inc ++
        }
    }
    res.load()
    return res
}