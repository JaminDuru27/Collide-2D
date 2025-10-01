import { AABBCollision } from "./AABBCollision.js"
import { draw } from "./instances.js"
import { Layer } from "./layer.js"
import { Sprite } from "./sprite.js"
export function UpdateInstanceFromData(inst, datainst){
    const res = {
        init(){
            inst.name = datainst.name
            inst.dataurl = datainst.dataurl 
            inst.id = datainst.id 
            inst.load()
            draw.instance = inst
        },
        grid(){
            inst.grid.nx = datainst.grid.nx
            inst.grid.ny = datainst.grid.ny
            inst.grid.populate()
        },
        images(){
            datainst.images.forEach(imgobj=>{
                inst.library.addFile(imgobj.name,'images','images')
                inst.library.writeFile(imgobj.name, imgobj.name, imgobj.object)
            })
        },
        layers(){
            datainst.layers.forEach((lyrobj, x)=>{
                // spriteLayer
                const obj = inst.layers.add(inst.layers, inst)
                lyrobj.forEach(props=>{
                    //i added layer info in the sprite data
                    obj.id = props?.layerId
                    obj.name = props?.layername
                    const sprite = Sprite({
                        indxInc:props.indxInc,
                        indyInc: props.indyInc,
                        indx: props.indx,
                        indy: props.indy,
                        widthMult: props.widthMult,
                        heightMult: props.heightMult,
                        sx:props.sx,
                        sy: props.sy,
                        sw: props.sw,
                        sh: props.sh,
                        src: props.src,
                        layerid: props.layerid
                    })
                    sprite.data = props.data
                    obj.array.push(sprite)
                })
            })
            inst.layers.updateDom()
        },
        shapes(){
            datainst.collisions.forEach(shapesobj=>{
                inst.library.addFile(shapesobj.name,'shapes','collisionfile',)
                inst.library.writeFile(shapesobj.name, `content`, shapesobj.object)
            })
        },
        
        groups(){
            datainst.collisiongroups.forEach(groupdata=>{
                inst.collisiongroups.group = inst.collisiongroups.addGroup()
                groupdata.forEach((col)=>{
                    inst.collisiongroups.group.color = col.color
                    if(!col.indx && !col.indy)return
                    const c = AABBCollision({inst, indx: col.indx, indy: col.indy})
                    c.color = col.color
                    c.bordercolor = col.bordercolor
                    c.w = col.w
                    c.h = col.h
                    c.x = col.x
                    c.y = col.y
                    c.data = col.data
                    inst.collisiongroups.group.array.push(c)
                })
            })
            setTimeout(()=>{inst.collisiongroups.updateDom()}, 200)
        },
        all(){
        //inst name & dataurl
            this.init() 
        //grid
            this.grid()
        //images
            this.images()
        //layers
            this.layers()
        //shapes
            this.shapes()
        //groups
            this.groups()
        }
    }
    return res
}