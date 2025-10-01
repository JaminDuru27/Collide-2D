import { Imglab } from "../../components/DRAW/imglab.js"
import { EventHandler } from "./events.js"
import { draw } from "./instances.js"
import { Shortcuts } from "./shortcuts.js"
import { Sprite } from "./sprite.js"
export function Inspect(Instance, Tools, name){
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
            document.body.style.cursor = `eyedrop`
        },
        events(){
            const short = Shortcuts()
            short.add('paint', ['i'], ()=>{
                this.drawAllowed = true
            })
            short.add('paint', ['Space'], ()=>{
                this.drawAllowed = true
            })
        },
        draw(){
            if(!this.drawAllowed)return
            const sprite = this.getSprite()
            if(!sprite)return
            const src = sprite.image.src
            const imglab = Imglab({to: document.querySelector(`.output`),allowgui:false,src,showtitle:false})
            Instance.assets.selectedAsset = `sprite`
            Instance.assets.domObj = imglab
            imglab.grid.nx = sprite.data.general.nx
            imglab.grid.ny = sprite.data.general.ny
            const data = sprite.data
            const indx = data.selectBox.indx
            const indy = data.selectBox.indy
            const cw = data.general.cw
            const ch = data.general.ch
            const box = {
                x: cw * indx + imglab.grid.x,
                y: ch * indy + imglab.grid.y,
                w: cw, h: ch,
                indx,indy,
            }
            imglab.select.boxes = [[box]]
            imglab.select.boxesFlat = [box]
        },
        getSprite(){
            const target = Instance.highlight.target
            if(!target)return
            const id = draw.instance.layers?.layer?.id
            if(!id)return
            const array = draw.instance.library.find(`spriteLayer`).object.meta.array
            if(!array)return
            const layer = array.filter(e=>e.id === id)[0]?.array
            const filter = layer.filter((sprite)=>sprite.indx === target.indx && sprite.indy === target.indy)
            return filter[0]
        },
        ui(){
            this.dom = Tools.options.add(this.name[0], ()=>{
                Tools.current = this
                this.enter()
            },  `./assets/icons/eye2.png`)
            this.dom.description = `Inspect(P) <br> Inspect Tile in Canvas. Click button to Inspect Tiles and collision on to canvas`
            this.dom.popupdescription = `Inspect (I)`
        },
        update(){
            this.draw()
            this.drawAllowed = false
        }
    }
    res.load()
    return res
}