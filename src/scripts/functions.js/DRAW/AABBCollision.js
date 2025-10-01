import { draw } from "./instances.js"

export function AABBCollision({inst, indx, indy}){
    const res = {
        color: `#e91e634d`,
        bordercolor: `white`,
        indx, indy,
        load(){
        if(!inst)inst = draw.instance
        this.calcratio()
        this.pushThis()
        },
        calcratio(){
            const dom = inst?.assets?.domObj
            if(!dom)return
            this.data = dom.data
            const target = inst.highlight.target
            if(target){
                this.x = target.x *  dom.data.ratio.x
                this.y = target.y * dom.data.ratio.y
                this.w = target.w * dom.data.ratio.w
                this.h = target.h * dom.data.ratio.h
                if(!this.indx)
                this.indx = target.indx
                if(!this.indy)
                this.indy = target.indy
            }
        },
        deleteDuplicate(){
            inst.collisiongroups.array.forEach(group=>{
                const name = group.name
                this.color = group.color || `#e91e634d`
                const groups = inst.library.find('collisionGroup').object
                const array = groups.meta.array
                if(!array)return
                array.map((group) => {
                    group.array.map((col, x)=>{
                        if(col.indx === this.indx && col.indy === this.indy)group.array.splice(x, 1)
                    })
                });
            })
        },
        pushThis(){
            if(!inst?.collisiongroups)return
            ///CLEAR DUPLICATE
            this.deleteDuplicate()
            //PUSH COL
            const group = inst.collisiongroups.group 
            if(!group)return
            const name = group.name
            this.color = group.color || `#e91e634d`
            const groups = inst.library.find('collisionGroup').object
            const array = groups.meta.array.find(arr=>arr.id === group.id)?.array
            if(array)
            array.push(this)

        },
        draw(){
            if(!this.data)return
            if(this.x && this.y && this.w && this.h){
                const ctx = inst.ui.ctx
                const grid = inst.grid
                if(!grid.boxes)return
                if(!grid.boxes[this.indy])return
                if(!grid.boxes[this.indy][this.indx])return
                if(grid.boxes.length <= 0)return
                const box = grid.boxes[this.indy][this.indx]
                if(!box)return
                ctx.save()
                ctx.setLineDash([])
                ctx.strokeStyle = this.bordercolor
                ctx.fillStyle = this.color
                this.x = (box.x - (box.x - (this.data.ratio.x * box.w)  + box.w)) + box.x
                this.y = (box.y - (box.y - (this.data.ratio.y * box.h)  + box.h)) + box.y
                this.w = this.data.ratio.w * box.w
                this.h = this.data.ratio.h * box.h
                ctx.fillRect(this.x, this.y, this.w,this.h)    
                ctx.strokeRect(this.x, this.y, this.w,this.h)    
                
                ctx.restore()    
            }
        },
        update(){
            this.draw()
        }
    }
    res.load()
    return res
}