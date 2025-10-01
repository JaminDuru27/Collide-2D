import { collisionData } from "./collisionData.js"
import { Rect } from "./rect.js"

export function World(game){
    const res = {
        load(){
            this.data = collisionData().get()
            game.nx = this.data.collision2d[0].length
            game.ny = this.data.collision2d.length
            game.updateSize()
            this.populate()
        },
        populate(){
            this.blockwidth = game.w / this.data.collision2d[0].length
            this.blockheight= game.h / this.data.collision2d.length
            this.array = []
            this.data.collision2d.forEach((col, y)=>{
                col.forEach((row, x)=>{
                    if(row === 0)return
                    const data = Rect(game)
                    data.shouldCheckForCollision = false
                    data.x =  x * this.blockwidth + ((this.blockwidth * row.ratio.x)) - this.blockwidth
                    data.y =  y * this.blockheight + ((this.blockheight * row.ratio.y)) - this.blockheight
                    data.w =  (this.blockwidth * row.ratio.w)
                    data.h =  (this.blockheight * row.ratio.h) 
                    for(let x in this.data.groupsId){
                        const index = this.data.groupsId[x].index
                        const id = this.data.groupsId[x].id
                        if(row.index === index) {
                            data.id = id
                            data.color = this.data.groupsId[x].color
                        }
                    }
                    this.array.push(data)
                })
            })
        },
        draw(ctx){
            this.array.forEach(box=>{
                ctx.fillStyle = box.color
                ctx.fillRect(box.x, box.y, box.w, box.h)
            })
        },
        update({ctx}){
            this.draw(ctx)
        }
    }
    res.load()
    return res
}