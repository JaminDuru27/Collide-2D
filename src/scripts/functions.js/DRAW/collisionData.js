import { draw } from "./instances.js"

export function collisionData(){
    const res = {
        load(){},
        download(){
            const replacer = (key, value)=>{
                if(Array.isArray(value)){
                    return JSON.stringify(value, null, 0)
                }
                return value
            }
            const string = `${draw.instance.name} = ` + JSON.stringify(this.get(), replacer, 2)
            log(string)
            const blob = new Blob([string], {
                'type': 'application/javascript'
            })
            const a = document.createElement(`a`)
            a.href= URL.createObjectURL(blob)

            a.download = `${draw.instance.name}-CollisionDatascript.js`
            a.click()
        },
        get(){
            const instance = draw.instance
            const data = {
                collision1d:this.getCOllision1D(),
                collision2d: this.getCOllision2D(),
                groupsId: {
                    ...this.getSpriteId(),
                },
                ratioId: {
                    ...this.getRatioId(),
                },
                griddata:{
                    rows: instance.grid.nx,
                    cols: instance.grid.ny, 
                    width: instance.grid.w ,
                    height: instance.grid.h,
                    x: instance.grid.x,
                    y: instance.grid.y,
                } 
            }
            return data
        },
        rand(){
            return Math.floor(Math.random() * (225 - 2) + 2)
        },
        getRatioId(){
            
        },
        getSpriteId(){
            const data = {}
            draw.instance.library.find(`collisionGroup`, (object, key)=>{
                for(let x in object){
                    if(x === `meta`)continue
                    data[x] = {id: x, index: object[x].index, color: `rgba(${this.rand()}, ${this.rand()}, ${this.rand()}, .4)`}
                }
            })
            return data
        },
        getCOllision2D(){
            const boxes = draw.instance.grid.boxes
            const collisionLayers = this.getCollisionLayersData()
            const collision2d = []
            boxes.forEach((col, y)=>{
                const arr = []
                col.forEach((row, x)=>{
                    const filter = collisionLayers.filter(collision=>collision.indx === row.indx && collision.indy === row.indy)
                    if(filter.length > 0){
                        arr.push({index: filter[0].index, ratio: filter[0].ratio})
                    }else{
                        arr.push(0)
                    }
                })
                if(arr.length > 0){
                    collision2d.push(arr)
                }
            })
            return collision2d
        },
        getCollisionLayersData(){
            const collisionLayers = []
            
            draw.instance.library.find(`collisionGroup`, (object, key)=>{
                object.meta.array.forEach(grup=>{
                    grup.array.forEach(col=>{
                        collisionLayers.push({indx:col.indx, indy: col.indy, index: col.index, ratio: col.data.ratio})
                    })
                })
            })
            return collisionLayers
        },
        getCOllision1D(){
            return this.getCOllision2D().flat()
        },
    }
    res.load()
    return res
}