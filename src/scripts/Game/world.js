export function getExportWorld(){
    return`

function World(Game){
    const res = {
        load(){},
        array: [],
        show: false,
        loadLevel(obj){
            obj.collision2d.forEach((col, y)=>{
                col.forEach((row,x)=>{
                    if(row){
                        const rect = Rect(Game)
                        rect.shouldCheckForCollision = false
                        rect.x =  x * Game.cw + ((Game.cw * row.ratio.x)) - Game.cw
                        rect.y =  y * Game.ch + ((Game.ch * row.ratio.y)) - Game.ch
                        rect.w =  (Game.cw * row.ratio.w)
                        rect.h =  (Game.ch * row.ratio.h)
                        for(let x in obj.groupsId){
                            const index = obj.groupsId[x].index
                            const id = obj.groupsId[x].id
                            if(row.index === index) {
                                rect.id = id
                                rect.color = obj.groupsId[x].color
                            }                            
                        }
                        this.array.push(rect)
                    }
                })
            })
            return this
        },
        draw({ctx}){
            if(!this.show)return
            ctx.save()
            this.array.forEach(rect=>{
                ctx.fillStyle = 'rgba(115, 0, 0, 0.4)'
                ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
            })
            ctx.restore()
        },
        update(props){
            this.draw(props)
        }
    }
    res.load()
    return res
    
}

`
}