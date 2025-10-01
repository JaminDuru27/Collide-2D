export function LayoutGhost(Material, Layouts){
    const res = {
        shouldUpdate: true,
        offx: 0, offy: Material.ui.dom.top.clientHeight,
        style(){return `display: none; position: absolute`},
        fullboxstyle({x = 0, y= 0,w=0,h=0, bgcolor = `#fff`}){return`position: absolute;opacity: 0.3;background: ${bgcolor};height: ${h}px;width: ${w}px;top: ${y}px; left: ${x}px;'`},
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add('all')
            this.element.setAttribute(`style`, this.style())
            Material.ui.element.append(this.element)
        },
        remove(){
            this.element.setAttribute('style', this.style())
            this.shouldUpdate = false
            this.target = undefined
            this.targetdir = undefined
            this.indx = 0
            this.indy = 0
        },
        getPosition(layout){
            if(this.targetIndex){
                this.indx= this.targetIndex.x
                this.indy= this.targetIndex.y
            }
            return(!this.target)?{indx:0, indy:0}: {target: this.target,indx: this.indx, indy:this.indy,}
        },
        mark(layout,type='fullbox'){
            this.shouldUpdate = true
            if(!this.shouldUpdate)return
            const filterinuse = Layouts.currentArray.flat().filter(e=>e)
            const offx = this.offx
            const offy = this.offy
            if(filterinuse.length <= 0){
                this.element.setAttribute(`style`,this.fullboxstyle({
                    x: 0 + Material.grid.x + offx,
                    y: 0 + Material.grid.y + offy,
                    w: layout.nx * Material.grid.cw,
                    h: layout.ny * Material.grid.ch,
                }))
                return
            }
            else if(filterinuse.length >= 1){
                Layouts.currentArray.forEach((col, y)=>{
                    if(col)
                    col.forEach((lay, x)=>{
                        if(lay)
                        if(lay.isHoveredOn()){
                            const mouse = Material.mouse
                            const w = lay.w / 3
                            const h = lay.h /3 
                            const topside = ()=> mouse.y < lay.y + h   
                            const leftside = ()=>mouse.x < lay.x + w
                            const bottomside = ()=>mouse.y > lay.y + lay.h - h
                            const rightside = ()=>mouse.x > lay.x + lay.w - w

                            
                            
                             if(rightside()){
                                this.element.setAttribute(`style`, this.fullboxstyle({
                                    x: lay.x + this.offx  + lay.w- 5,
                                    y: lay.y + this.offy,
                                    w: 5,
                                    h: lay.h,
                                    bgcolor: `red`
                                }))
                                this.target = lay
                                this.targetdir = `right`
                                this.targetIndex = {x: x + lay.nx, y}
                            }
                            else if(leftside()){
                                this.element.setAttribute(`style`, this.fullboxstyle({
                                    x: lay.x + this.offx ,
                                    y: lay.y + this.offy,
                                    w: 5,
                                    h: lay.h,
                                    bgcolor: `red`
                                }))
                                this.target = lay
                                this.targetdir = `left`
                                this.targetIndex = {x: x  - lay.nx, y}
                                
                            }else
                            if(topside()){
                                this.element.setAttribute(`style`, this.fullboxstyle({
                                    x: lay.x,
                                    y: lay.y + this.offy,
                                    w: lay.w,
                                    h: 5,
                                    bgcolor: `red`
                                }))
                                this.target = lay
                                this.targetdir = `top`
                                this.targetIndex = {x, y: y - lay.ny}
                            }
                            else if(bottomside()){
                                this.element.setAttribute(`style`, this.fullboxstyle({
                                    x: lay.x,
                                    y: lay.y + this.offy + lay.h,
                                    w: lay.w,
                                    h: 5,
                                    bgcolor: `red`
                                }))
                                this.target = lay
                                this.targetdir = `bottom`
                                this.targetIndex = {x, y: y + lay.ny}
                            }
                        }
                    })
                })
                
            }
            //if id
        },
        load(){
            this.ui()
        }
    }
    res.load()
    return res
}