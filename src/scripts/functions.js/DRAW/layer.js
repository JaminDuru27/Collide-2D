import { draw } from "./instances.js"
import { LayersDom } from "../../components/DRAW/layers.js"
import { EventHandler, events } from "./events.js"
import { TileOption } from "../../components/DRAW/tileoptions.js"
import { CollisionLab } from "../../components/DRAW/collisionlab.js"
import { GenerateId } from "./generateId.js"
import { Sprite } from "./sprite.js"
export function Layers(Instance){
    const res =  {
        array : [],
        selected: [],
        load(){
        },
        showHoveredSprite(){
            let name = Instance?.layers?.layer?.name
            if(!name)name = Instance?.layers[0]?.name
            if(!name)return
            const array = Instance.library.find(`spriteLayer`).object.meta.array
            const layer = array.filter(e=>e.name === name)[0]?.array
            layer?.forEach(sprite=>{
                if(sprite.mouseiscolliding()){
                    sprite.highlightMe()
                    this.sprite = sprite
                }
            })
        },
        clearSpriteHovered(){
            this.sprite = undefined
            if(document.querySelector(`.tileoption`))document.querySelector(`.tileoption`).remove()
            let name = Instance?.layers?.layer?.name
            if(!name) name = Instance.layers?.array[0]?.name
            if(!name)return

            const array = Instance.library.find(`spriteLayer`).object.meta.array
            const layer = array.filter(e=>e.name === name)[0]?.array
            layer?.forEach(sprite=>{
                sprite.isselected = false
            })
        },
        events(){
            EventHandler(Instance.ui.ctx.canvas, `allowselect`, 'mousedown', (e)=>{
                this.allowselect = true
            })
            EventHandler(Instance.ui.ctx.canvas, `allowselect`, 'mouseup', (e)=>{
                this.allowselect = false
            })
            EventHandler(Instance.ui.ctx.canvas, `options`, 'mousedown', (e)=>{
                if(e.buttons === 1)this.clearSpriteHovered()
                if(e.buttons === 2){ 
                    this.clearSpriteHovered()
                    this.showHoveredSprite()
                    const option = TileOption(e, this.sprite)
                    this.opdom = option
                    option.add(`selectsprite`, ()=>{
                        const sprite = draw.instance.layers.sprite
                        const layer = draw.instance.layers.layer
                        if(!layer)return
                        if(!sprite)return
                        layer.array.forEach(s=>{
                            if(s.sx === sprite.sx && s.sy === sprite.sy){
                                const grid = draw.instance.grid.boxes
                                const indx = s.indx
                                const indy = s.indy
                                const box = grid[indy][indx]
                                draw.instance.select.boxesFlat.push(box)
                            }
                        })
                    }, `./assets/icons/selection.png`)
                    option.add(`craftcollision`, ()=>{
                        if(!draw.instance.assets.domObj)return
                        if(draw.instance.assets.selectedAsset !== `sprite`)return
                        
                        const data = draw.instance.assets?.domObj?.getData()
                        const sprite = draw.instance.layers.sprite
                        if(!data)return
                        const lab = CollisionLab({Instance: draw.instance, to: document.body, image: data.general.image, allowgui: true })
                        lab.type.sx = sprite.sx
                        lab.type.sy = sprite.sy
                        lab.type.sw = data.general.imgcw
                        lab.type.sh = data.general.imgch
                        lab.type.widthMult = sprite.widthMult
                        lab.type.heightMult = sprite.heightMult
                        option.remove()
                    }, `./assets/icons/piece.png`)
                    option.add(`rotate`, ()=>{
                    }, `./assets/icons/rotate.png`)
                    option.add(`delete`, ()=>{
                        const name = draw.instance.layers.layer.name
                        const array = draw.instance.library.find(`spriteLayer`).object.meta.array
                        const layer = array.filter(e=>e.name === name)[0]?.array
                        if(!layer)return
                        layer.splice(layer.indexOf(this.sprite), 1)
                        option.remove()
                    }, `./assets/icons/delete.png`)
                    option.add(`cut`, ()=>{
                        const data =  {
                            x: Instance.grid.x + Instance.grid.cw * this.sprite.indx,
                            y: Instance.grid.y + Instance.grid.ch * this.sprite.indy,
                            w: Instance.grid.cw, h: Instance.grid.ch,
                            indx: this.sprite.indx, indy: this.sprite.indy,
                        }
                        Instance.select.boxes = [[data]]
                        Instance.select.boxesFlat = [data]
                        Instance.select.optionCut()
                    }, `./assets/icons/cut.png`)
                    option.add(`copy`, ()=>{
                        const data =  {
                            x: Instance.grid.x + Instance.grid.cw * this.sprite.indx,
                            y: Instance.grid.y + Instance.grid.ch * this.sprite.indy,
                            w: Instance.grid.cw, h: Instance.grid.ch,
                            indx: this.sprite.indx, indy: this.sprite.indy,
                        }
                        Instance.select.boxes = [[data]]
                        Instance.select.boxesFlat = [data]
                        Instance.select.optionCopy()
                    }, `./assets/icons/copy.png`)
                    option.add(`paste`, ()=>{
                        if(!Instance.highlight.target)return
                        Instance.select.boxes = [[{...Instance.highlight.target}]]
                        Instance.select.boxesFlat = [{...Instance.highlight.target}]
                        Instance.select.optionPaste()
                    }, `./assets/icons/paste.png`)

                }
                
            })
        },
        add(){
            this.layer = Layer(this, Instance)
            this.updateDom()
            return this.layer
        },
        ui(){
            if(this.domObj)this.domObj.remove()
            this.domObj = LayersDom(Instance.ui.dom['rightside'])
            this.updateDom()
        },
        updateDom(){
            this.selected = []
            this.layersdom = []
            this.domObj.dom.layerssection.innerHTML = ``
            const layersFolder = Instance.library.find(`spriteLayer`)
            let shift
            layersFolder.object.meta.array.forEach(layer=>{
                const key  = layer.name
                const  obj = layer
                const layerui = this.domObj.add({
                    name: obj.name,
                    id: layer.id,
                    callback:()=>{
                        if(shift){
                            if(this.selected.indexOf(obj) < 0){
                                this.selected.push(obj)
                                layerui.layer.style.outline =`3px solid yellow`       
                            }
                            else if(this.selected.indexOf(obj) >= 0){
                                this.selected.splice(this.selected.indexOf(obj), 1)
                                layerui.layer.style.outline =`none`       
                            }
                            
                        }
                        this.layersdom.forEach(dom=>{dom.layer.style.opacity = `.5`})
                        this.layer = obj // set layer
                        layerui.layer.style.opacity = `1`
                    }, 
                    mouseovercallback:()=>{

                    },
                    eyecallback: (e)=>{
                        if(e.open)this.layer.show = true
                        if(!e.open)this.layer.show = false
                    }
                })
                layer.dom  = layerui
                this.layersdom.push(layerui)

            EventHandler(window, ``, `keydown`, (e)=>{
                if(e.key === `Shift`)
                shift = true
            })
            EventHandler(window, ``, `keyup`, ()=>{
                shift = false
                })
            })
        },
        shortcuts(){
            Instance.shortcuts.add('addLayer', [`Enter`],()=>{
                this.add()
            })
        },
        update(){
            const layersFolder = Instance.library.find(`spriteLayer`)

            // let shift
            layersFolder.object.meta.array.forEach(layer=>{
                layer.update()
            })
        }
    }
    res.load()
    return res
}
export function Layer(layers, Instance){
    const res =  {
        array : [],
        show: true,
        id: GenerateId(),
        load(){
            if(layers)
            layers.array.push(this)
            this.layersFolder = Instance.library.find(`spriteLayer`)
            const array = Instance.library.find(`spriteLayer`).object.meta.array
            this.name = `Layer ${array.length + 1}`
            array.push(this)
            this.undo()
        }, 
        undo(){
           
        },
        setPrevColor(){
        // layers.array.forEach(val=>{
        //     val.layerui.style.background = `transparent`
        // })
        },
        update(){
            if(this.show)
            this.array.forEach(arr=>arr.update())
        }
    }
    res.load()
    return res
}