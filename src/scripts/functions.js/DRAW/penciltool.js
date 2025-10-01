import { Collision } from "./collision.js"
import { EventHandler } from "./events.js"
import { draw } from "./instances.js"
import { Shortcuts } from "./shortcuts.js"
import { Sprite } from "./sprite.js"
export function Pencil(Instance, Tools, name){
    const res = {
        name,
        drawAllowed:true,
        no: 0,
        load(){
            //SINCE IT WAS ADDED IN A UI FUNC IT WILL LOAD EACH OPEN
            this.ui()
            this.events()
            this.undo()
            // sthis.reflib = draw.instance.library.find(`spriteLayers`)

        },
        enter(){
            document.body.style.cursor = `pointer`
        },
        events(){
            const short = Shortcuts()
            short.add('paint', ['b'], ()=>{
                this.drawAllowed = true
            })
            short.add('paint', ['Space'], ()=>{
                this.drawAllowed = true
            })
        },
        undo(){
            const obj  = draw.history.addInstance('tiles', Instance.layers.layer,'array', 4000)
            obj.maxlength = 10
            obj.data.id = Instance?.layers?.layer?.id
            if(!obj.data.id)return
            obj.replace = (value)=>{
                return value.filter(e=>e).map(sprite=>{
                    return {
                    src: sprite.image.src,
                    sx: sprite.sx, widthMult: sprite.widthMult,
                    sy: sprite.sy, heightMult: sprite.heightMult,
                    indx: sprite.indx, indy: sprite.indy
                    }
                })
            }
            obj.callback = (val, data)=>{
                if(!val)return
                let layer
                Instance.layers.array.forEach(arr=>{
                    if(arr.id === data.id)layer = arr
                })
                if(!layer)return
                layer.array = []
                val.forEach((spritedata)=>{
                    const sprite = Sprite({...spritedata})
                })

            }
        },
        draw(){
            const currentAssets = Instance.assets.selectedAsset
            const domobj = Instance.assets.domObj
            if(!this.drawAllowed)return
            if(currentAssets === `sprite` && domobj){
                domobj?.select?.boxes?.forEach((col,y)=>{
                    col.forEach((row,x)=>{
                        const sx = row.indx * domobj.getData().general.imgcw 
                        const sy = row.indy * domobj.getData().general.imgch 
                        const sprite = Sprite({indxInc:x,indyInc:y, sx, sy})
                    })
                })
            }
            if(currentAssets === `collision`){
                const sprite = Collision()
            }
            if(currentAssets === `terrain`){
                const domobj = Instance.assets.domObj
                domobj.terrain2dArray.forEach((col,y)=>{
                    col.forEach((row,x)=>{
                        const sx = row.sx 
                        const sy = row.sy 
                        const sprite = Sprite({indxInc:x,indyInc:y, sx, sy})
                    })
                })
            }
        },
        ui(){
            this.dom = Tools.options.add(this.name[0], ()=>{
                Tools.current = this
                this.enter()
            }, `../assets/icons/pencil.png`)
            this.dom.description = `ShortCut(B) <br> Draw Onto Canvas. Click button to draw Tiles and collision on to canvas`
            this.dom.popupdescription = `Pencil (B)`
        },
        update(){
            this.draw()
            this.drawAllowed = false
        }
    }
    res.load()
    return res
}