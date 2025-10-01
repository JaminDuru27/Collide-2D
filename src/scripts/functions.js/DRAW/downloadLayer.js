import { draw } from "./instances.js"

export function downloadLayer(filename, w= 400, h = 200){
    const res = {
        load(){
            this.ui()
            this.get()
        },
        ui(){
            this.canvas = document.createElement(`canvas`)
            this.ctx = this.canvas.getContext(`2d`)
            this.canvas.width = w
            this.canvas.height = h
        },
        getSprites(){
            const array = []
            draw.instance.library.find(`spriteLayer`, (object, key)=>{
                const layers = object.meta.array
                const filter = layers.filter(e=>e.name === filename)
                const layer = filter[0]
                if(layer)
                layer.array.forEach(sprite=>{
                    array.push(sprite)
                })
            })
            return array
        },
        download(){
            const sprites  = this.getSprites()
            const sprite2d = this.getSprites2d(sprites)
            this.draw(sprite2d)
            const url = this.canvas.toDataURL()
            const  a = document.createElement(`a`)
            a.href = url
            a.download = `${filename}.png`
            a.click()
        },
        getSprites2d(array){
            const array2d = []
            const minIndx = Math.min(...array.map(spr=>spr.indx))
            const minIndy = Math.min(...array.map(spr=>spr.indy))
            const maxIndx = Math.max(...array.map(spr=>spr.indx))
            const maxIndy = Math.max(...array.map(spr=>spr.indy))
            const windx =  maxIndx - minIndx
            const hindx =  maxIndy - minIndy

            const cw = w / (windx + 1)
            const ch = h / (hindx + 1)

            const boxes = []
            for(let y = 0; y<=hindx; y++){
                const yindx = minIndy + y
                const filter = array.filter((e)=>e.indy === yindx)
                if(filter.length > 0)boxes.push(filter)
            }
            const data = {
                indx: minIndx, indy: minIndy,
                indw: windx, indh: hindx,
                boxes, cw, ch
            }
            return data
        },
        draw(sprite2d){
            const cw = w / draw.instance.grid.nx 
            const ch = h / draw.instance.grid.ny 
            this.ctx.imageSmoothingEnabled = false
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            
            sprite2d.boxes.forEach((col)=>{
                col.forEach((row)=>{
                    let absw= cw * row.widthMult
                    let absh= ch * row.heightMult
                    if(absw > this.canvas.width)
                    this.canvas.width = absw
                    if(absh > this.canvas.height)
                    this.canvas.height = absh
                })
            })
            sprite2d.boxes.forEach((col)=>{
                col.forEach((row)=>{
                    let indx = row.indx
                    let indy = row.indy
                    if(indx < 0)indx *= -1
                    if(indy < 0)indy *= -1
                    const x = indx * cw
                    const y = indy * ch
                    this.ctx.drawImage(row.image, row.sx, row.sy, row.sw, row.sh, x, y, 
                        cw  * row.widthMult,  ch  * row.heightMult
                    )
                })
            })
        },
        get(){
            const sprites  = this.getSprites()
            const sprite2d = this.getSprites2d(sprites)
            this.draw(sprite2d)
            const url = this.canvas.toDataURL('image/png')
            this.url = url
            return {url}
        }
    }
    res.load()
    return res
}