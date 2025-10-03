import { Tile } from "./Tiles"
import { domextract } from "../../components/DRAW/domextract"
import { LayerDom } from "../../components/Material/layer"
import { Dropdown } from "../../components/DRAW/dropdown"
import { feedback } from "../../components/DRAW/feedback"
import { EventHandler } from "../DRAW/events"
import { TileInspector } from "./tileInspector"
export function Layers(Material, Layout){
    const res = {
        array: [],
        load(){
        },
        ui(){
            this.updateDom()
        },
        add(name, id){
            const layer = Layer(Material,Layout, this,name, id)
            this.layer = layer
            this.updateDom()
            this.array.push(layer)
            return layer
        },
        updateDom(){
            const e =  domextract(Material.ui.dom[`Layers`]).object.content
            e.innerHTML = ``
            this.array.forEach((layer, x)=>{
                const lay = LayerDom({
                    Layer: layer,
                    Layers: this,
                    to: e,
                    callback: (e)=>{
                        this.layer = layer
                        e.showoutline()
                        this.array.filter(e=>e!==this.layer).forEach(e=>e?.dom?.hideoutline())

                    }, 
                    eyecallback:(open)=>{
                        layer.hide = (open)? true : false  
                    }
                })  
                
                layer.dom = lay
                const drop = Dropdown({target: lay.element, color: `#1e31e6`, bgcolor: `#090430`})

                EventHandler(lay.element, '', 'mouseenter', ()=>{
                    this.preview = layer
                })
                EventHandler(lay.element, '', 'mouseleave', ()=>{
                    this.preview = undefined
                })

                drop.add('solo', ()=>{
                    layer.solo()
                })
                drop.add('inspect', ()=>{
                    layer.inspect()
                })
                drop.add('del', ()=>{
                    layer.remove()
                    this.updateDom()
                })

            })
        },
        update(props){
            this.array.forEach(layer=>{
                layer.update(props)
            })
            
            props.ctx.fillStyle= ` #00000071`
            if(this.preview){
                props.ctx.fillRect(0, 0, Material.ui.ctx.canvas.width, Material.ui.ctx.canvas.height )
            }
            if(this.preview){
                this.preview.update(props)
            }
        }
    }
    res.load()
    return res
}

export function Layer(Material, Layout, Layers, name, id){
    const res = {
        name, id,
        hide: false,
        tiles: [],
        load(){
        },
        add(){
            const tile = Tile(Material, Layout , Layers, this)
            tile.ui()
            this.tiles.push(tile)
            return tile
        },
        getSelected(){
            const array = []
            this.tiles.forEach(tile=>{
                if(tile.selected)array.push(tile)
            })
            return array
        },
        inspect(){
            TileInspector(Material)
            .showTiles(this.tiles)
        },
        solo(){},
        remove(){
            Layers.array.splice(Layers.array.indexOf(this), 1)
        },
        update(props){
            if(this.hide)return
            this.tiles.forEach(tile=>tile.update(props))
        }
    }
    res.load()
    return res
}