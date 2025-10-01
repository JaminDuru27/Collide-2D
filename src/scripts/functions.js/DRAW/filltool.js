import { Collision } from "./collision.js"
import { EventHandler } from "./events.js"
import { draw } from "./instances.js"
import { Shortcuts } from "./shortcuts.js"
import { Sprite } from "./sprite.js"
export function Fill(Instance, Tools, name){
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
            document.body.style.cursor = `pointer`
        },
        events(){
            const short = Shortcuts()
            short.add('paint', ['f'], ()=>{
                this.drawAllowed = true
            })
            short.add('paint', ['Space'], ()=>{
                this.drawAllowed = true
            })
        },
        check(){
            const currentAssets = Instance.assets.selectedAsset
            const domobj = Instance.assets.domObj
            const name = draw.instance.layers.layer.name
            const object = draw.instance.library.find(name, ).object
            const layer = object.array
            const boxes = draw.instance.grid.boxes
            const target = draw.instance.highlight.target
            if(!target)return
            const update = (indx, indy)=>{
                if(!domobj)return
                if(!domobj.select)return
                const search = (box)=>layer.filter(sprite=>sprite.indx === box.indx && sprite.indy === box.indy)
                const draw = ({indxInc, indyInc, indx, indy})=>{
                    if(domobj.select.boxesFlat.length > 0){
                        const sx = domobj.select.boxesFlat[0].indx * domobj.getData().general.imgcw  
                        const sy = domobj.select.boxesFlat[0].indy * domobj.getData().general.imgch  
                        const Tile = Sprite({
                            indxInc,indyInc,indx, indy,sx, sy
                        })
                    }
                }
                //stop if no available block
                if(!boxes[indy][indx])return

                //drawfirstbox
                draw({indx, indy})
                //boxes
                const rightBox = boxes[indy][indx + 1]
                const leftBox = boxes[indy][indx - 1]
                if(indy -1 < 0) return
                const topBox = boxes[indy - 1][indx]
                if(indy + 1 > boxes.length -1) return
                const bottomBox = boxes[indy + 1][indx]
                
                if(rightBox && search(rightBox).length <= 0){   
                    draw({indx:rightBox.indx, indy: rightBox.indy})
                    update(rightBox.indx, rightBox.indy)
                }
                if(leftBox && search(leftBox).length <= 0){
                    draw({indx:leftBox.indx,indy: leftBox.indy})
                    update(leftBox.indx, leftBox.indy)
                }
                if(topBox && search(topBox).length <= 0){
                    draw({indx:topBox.indx,indy: topBox.indy})
                    update(topBox.indx, topBox.indy)
                }
                if(bottomBox && search(bottomBox).length <= 0){
                    draw({indx:bottomBox.indx,indy: bottomBox.indy})
                    update(bottomBox.indx, bottomBox.indy)
                }

            }
            update(target.indx, target.indy)
        },
        draw(){
            if(!this.drawAllowed)return
            const boxes = Instance.select.boxesFlat
            if(boxes.length <= 0){
                // this.check()    

            }else{
                const currentAssets = Instance.assets.selectedAsset
                const domobj = Instance.assets.domObj
                if(currentAssets === `sprite`){
                    if(boxes.length <= 0)return
                    Instance.highlight.target = boxes[0]
                    boxes.forEach((row, y)=>{
                        if(domobj.select.boxesFlat.length <= 0)return
                        const sx = domobj.select.boxesFlat[0].indx * domobj.getData().general.imgcw  
                        const sy = domobj.select.boxesFlat[0].indy * domobj.getData().general.imgch  
                        const Tile = Sprite({
                            indx:row.indx, indy:row.indy,
                            indxInc: 0, indyInc: 0,
                            sx, sy})
                    })                    
                }
                if(currentAssets === `collision`){
                    if(boxes.length <= 0)return
                    Instance.highlight.target = boxes[0]
                    boxes.forEach((row, y)=>{
                        const collision = Collision({indx: row.indx, indy: row.indy})
                        // if(!collision.type)return
                    })    
                    const collision = Collision({indx: boxes[0].indx, indy: boxes[0].indy})
                    // if(!collision.type)return
                }

            }
        },
        ui(){
            this.dom = Tools.options.add(this.name[0], ()=>{
                this.enter()
                Tools.current = this
            }, `../assets/icons/paint-bucket.png`)
            this.dom.description = `Fill(F) <br> Fill Selectect and None Selected Spaces. Click button to Fill Grid Boxes with Tiles and collision on to canvas`
            this.dom.popupdescription = `Fill (F)`
        },
        update(){
            this.draw()
            this.drawAllowed = false
        }
    }
    res.load()
    return res
}