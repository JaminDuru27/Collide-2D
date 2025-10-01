import { GUI } from "./gui.js"

export function Highlight(Instance){
    const res = {
        boxes: [],
        nx: 1, ny: 1,
        rows: 0,
        cols: 0,
        load(){
        },
        gui(){
            const gui = GUI('Highlight', Instance.ui.dom.leftside)
            gui.add(this, `nx`, `nx`, [1, 10, 1])
            gui.add(this, `ny`, `ny`, [1, 10, 1])

            // Instance.updates.record(this, `rows`, (v)=>`${v} rows`)
            // Instance.updates.record(this, `cols`,(v)=>`${v} cols`)
        },
        checkTarget(bx){
            const cond = (bx)=>{
                return (
                    Instance.mouse.x > bx.x && Instance.mouse.y > bx.y&&
                    Instance.mouse.x < bx.x + bx.w && Instance.mouse.y < bx.y + bx.h
                )
            }
            if(cond(bx))return {box: bx}
            
        },
        shortcuts(){
            Instance.shortcuts.add(`inccellno`, [`n`,`=`, Instance.ui.ctx.canvas],()=>{
                this.nx = Math.max(1, Math.min(5, this.nx + 1))
                this.ny = Math.max(1, Math.min(5, this.ny + 1))
            })
            Instance.shortcuts.add(`deccellno`, [`n`,`-`, Instance.ui.ctx.canvas],()=>{
                this.nx = Math.max(1, Math.min(5, this.nx - 1))
                this.ny = Math.max(1, Math.min(5, this.ny - 1))
            })
        },
        populate(){
            if(!this.target)return
            this.boxes = []
            const target = this.target

            this.w = this.nx * target.w
            this.h = this.ny * target.h
            for(let y = 0; y< this.ny; y++){
                let array = []
                for(let x = 0; x< this.nx; x++){
                    const grid = Instance.grid
                    if(target.x + (target.w * x) > grid.x + ((grid.cw * grid.nx) -grid.cw)) continue
                    if(target.y + (target.h * y) > grid.y + ((grid.ch * grid.ny) - grid.ch)) continue
                    const bx = {
                        x: target.x + (target.w * x), 
                        y: target.y + (target.h * y),
                        w: target.w, h: target.h,
                        indx : target.indx + x, 
                        indy: target.indy + y
                    }
                    array.push(bx)
                }
                if(array.length > 0){
                    this.boxes.push(array)
                    array = []
                }
            }



            this.boxesFlat = this.boxes.flat()
        },
        getTarget(){
            let target
            Instance.grid.boxesFlat.forEach(bx=>{
                let cond = this.checkTarget(bx)
                if(cond)
                target  = cond.box
            })
            return target
        },
        draw(ctx){
             if(!this.target)return
            this.boxesFlat.forEach((bx)=>{
                ctx.strokeStyle = `#cc1281e8`
                ctx.fillStyle = `#cc12813d  `
                ctx.beginPath()
                ctx.rect(bx.x, bx.y, bx.w, bx.h)
                ctx.stroke()
                ctx.fill()
                ctx.closePath()
            })
        },
        calcDirection(){
            if(!this.target)return  
            this.rows = this.target.indx
            this.cols = this.target.indy
            this.nowx = this.target.indx
            this.nowy = this.target.indy
            const dx = this.nowx - this.prevx
            const dy = this.nowy - this.prevy
            this.prevx = this.target.indx
            this.prevy = this.target.indy
            if(dx > 0)this.dir = `right`
            if(dy > 0)this.dir = `down`
            if(dx < 0)this.dir = `left`
            if(dy < 0)this.dir = `up`
            // if(dx === 0 && dy === 0)this.dir = `none`

            
        },
        update({ctx}){
            this.target = this.getTarget()
            this.populate()
            this.draw(ctx)

            this.calcDirection()
        }
    }
    res.load()
    return res
}