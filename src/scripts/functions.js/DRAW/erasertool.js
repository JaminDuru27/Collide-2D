import { EventHandler } from "./events.js"
import { draw } from "./instances.js"
import { Shortcuts } from "./shortcuts.js"
import { Sprite } from "./sprite.js"
export function Eraser(Instance, Tools, name){
    const res = {
        name,
        drawAllowed:true,
        load(){
            //SINCE IT WAS ADDED IN A UI FUNC IT WILL LOAD EACH OPEN
            this.ui()
            this.events()
            // sthis.reflib = draw.instance.library.find(`spriteLayers`)

        },
        enter(){
            document.body.style.cursor = `crosshair`
        },
        events(){
            const short = Shortcuts()
            short.add('paint', ['e'], ()=>{
                this.drawAllowed = true
            })
            short.add('paint', ['Space'], ()=>{
                this.drawAllowed = true
            })
        },
        draw(){
            const currentAssets = Instance.assets.selectedAsset
            const domobj = Instance.assets.domObj
            
            if(currentAssets === `sprite`){
                if(!this.drawAllowed)return
                const id = draw.instance.layers?.layer?.id
                if(!id)return
                const array = draw.instance.library.find(`spriteLayer`).object.meta.array
                const layer = array.filter(e=>e.id === id)[0]?.array
                const boxes = Instance.highlight.boxesFlat
                boxes.forEach(box=>{
                    if(box && layer)
                    layer?.forEach((sprite,x)=>{
                        if(sprite.indx === box.indx && sprite.indy === box.indy)layer.splice(x, 1)
                    })
                })
                    
            }else if( currentAssets === `collision`){
                if(!this.drawAllowed)return
                draw.instance.library.find('collisionGroup').object.meta.array.forEach(group=>{
                    const target = draw.instance.highlight.target
                    const groups = draw.instance.library.find('collisionGroup').object
                    const array = groups.meta.array.find(arr=>arr.id === group.id)?.array
                    if(!target)return
                    array.forEach((col,x)=>{
                        if(col.indx === target.indx && col.indy === target.indy){
                            array.splice(x, 1)
                        }
                    })
                })
            }
            this.drawAllowed = false
        },
        ui(){
            this.dom = Tools.options.add(this.name[0], ()=>{
                Tools.current = this
                this.enter()
            }, `../assets/icons/eraser.png`)
            this.dom.description = `ShortCut(E) <br> Erase Canvas Elements Canvas. Click button to erase Tiles and Collision on to canvas`
            this.dom.popupdescription = `Eraser (E)`
        },
        update(){
            this.draw()
            this.drawAllowed = false
            
        }
    }
    res.load()
    return res
}
