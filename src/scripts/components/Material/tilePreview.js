import { EventHandler } from "../../functions.js/DRAW/events"
import { domextract } from "../DRAW/domextract"
import { Dropdown } from "../DRAW/dropdown"
import { MaterialOptions } from "./options"
import { PluginsUI } from "./ui"
let e
export function TilePreview(Material,Tile, callback){
    const to = domextract(Material.ui.dom[`Tile`]).object.content
    const res = {
        style(){return `overflow: hidden;background: #0000001f;width: 100%; height: ${to.clientWidth}px;position:relative;border-radius: .5rem;`},
        canvasstyle(){return ` width: 80%;position: absolute;height: 80%;top: 50%;left: 50%;transform:translate(-50%, -50%)`},
        ui(){
            if(e)e.remove()
            e = this
            this.element = document.createElement(`div`)
            this.element.setAttribute(`class`, `prevTile`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML = `
            <canvas class='canvas' style='${this.canvasstyle()}'></canvas>
            `
            to.append(this.element)
            domextract(this.element, `classname`, this)
            this.canvas = this.dom.canvas
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
            this.ctx = this.canvas.getContext(`2d`)

            

        },
        draw(){
            this.ctx.imageSmoothingEnabled = false
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(Tile.sprite.image,
                Tile.sprite.sx, 
                Tile.sprite.sy, 
                Tile.sprite.sw, 
                Tile.sprite.sh, 
                0, 0, this.canvas.width, this.canvas.height)
        },
        events(){
            EventHandler(this.element, '', 'mousedown', (e)=>{
                if(e.button !== 2)return
                Material.optionsHandler.find(`globaltilepreviewoption`)
                ?.remove(`Add Plugin`, "Add Mods")
                ?.add({nameId: 'Add Plugin', callback: ()=>{
                    Material.plugins.open(callback)
                }})
                ?.add({nameId: 'Add Mods', callback: ()=>{
                    Material.plugins.open(callback, true)
                }})
                .show(e)
            })

        },
        remove(){
            this.element.remove()
        },
        load(){
            this.ui()
            this.events()
            this.draw()
            Material.currentPreviewedTile = Tile
        },
        update(){
            if(!Tile.sprite)return
            this.draw()
        },
    }
    res.load()
    return res
}