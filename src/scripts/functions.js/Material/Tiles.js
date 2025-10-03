import { domextract } from "../../components/DRAW/domextract"
import { TilePreview } from "../../components/Material/tilePreview"
import { EventHandler, events } from "../DRAW/events"
import { SpriteRect } from "./spriteRect"
import * as PLUGINOBJS from './plugins/exports'
import * as MODOBJS from './mods/exports'
import { GenerateId } from "../DRAW/generateId"
import { feedback } from "../../components/DRAW/feedback"
import { NodeDom } from "../../components/Material/node"
import { GUI } from "../DRAW/gui"
import { Layer, Layers } from "./layers"
import { Options } from "../../components/DRAW/options"
import { Dropdown } from "../../components/DRAW/dropdown"
import { MaterialOptions } from "../../components/Material/options"
export function Tile(Material,Layout, Layers, Layer){
    const res= {
        color: ` #0d012d54`,
        bordercolor: ` #00179d`,
        widthMult: 1, heightMult: 1,
        nodes: [],
        indicate: false,
        modifiers: [],
        variables: [],
        events: [],
        functions: [],
        selected: false,
        showInspect: false,
        initx: 0, inity: 0,
        offx: 0, offy: 0,
        offw: 0, offh: 0,
        id: GenerateId() + `Tile`,
        
        load(){
            this.showvariables = (e, callback, x = [])=>{return this.show(e, callback, [`variables`,...add])}
            this.showevents = (e, callback, add = [])=>{return this.show(e, callback, [`events`, ...add])}
            this.showfunctions = (e, callback,add = [])=>{return this.show(e, callback, [`functions`, ...add])}
            this.setVariable = ({par, set, get, prop, nodeId,})=>{return this.setvarfuncevent({par, set, get, prop, nodeId, array:this.variables,})}
            this.setFunction = ({par, set, get, prop, nodeId,})=>{return this.setvarfuncevent({par, set, get, prop, nodeId, array:this.functions,})}
            this.setEvent = ({par, set, get, prop, nodeId,})=>{return this.setvarfuncevent({par, set, get, prop, nodeId, array:this.events,})}
            this.setVariable({prop: 'Tile', nodeId: this.id})
            this.setVariable({par: 'Tile',prop: 'x',  set:(val)=>{this.offx = val}, get: ()=>this.offx, nodeId: res.id})
            this.setVariable({par: 'Tile',prop: 'y',  set:(val)=>{this.offy = val}, get: ()=>this.offy, nodeId: res.id})
            this.setVariable({par: 'Tile',prop: 'w',  set:(val)=>{this.offw = val}, get: ()=>this.offw, nodeId: res.id})
            this.setVariable({par: 'Tile',prop: 'h',  set:(val)=>{this.offh = val}, get: ()=>this.offh, nodeId: res.id})

            Material.ui.ondevmodeoff(()=>{
                this.resetPos()
                this.resetSize()
            })
        },  
        resetPos(){
            this.offx = 0
            this.offy = 0
            this.x = this.getBox().x
            this.y = this.getBox().y
            Material.tx = 0
            Material.ty = 0
        },
        resetSize(){
            this.offw = 0
            this.offh = 0
            this.w = this.getBox().w * this.widthMult
            this.h = this.getBox().h * this.heightMult
        },
        ui(){
            this.Events()

            this.options  = Material.optionsHandler.addOption({nameId: this.id, to: Material.ui.element, condition: ()=>this.isHoveredOn()})
            .add({nameId: 'delete', src: '../assets/icons/delete.png', callback:()=>{
                this.remove()
                Material.optionsHandler.remove(this.id)
            }})
            .add({nameId: 'addtogroup', src: '../assets/icons/select.png', callback:(e)=>{
                const drop = MaterialOptions()
                .set(this.options, this.options.dom.element)
                Material.groups.array.forEach(group=>{
                    const d = drop.add(group.name, ()=>{
                        group.add(this) 
                        drop.remove()
                        Material.groups.updateDom()
                    })
                })
            }})
            
             
            EventHandler(Material.ui.ctx.canvas, '', 'mousedown', (e)=>{(e.buttons === 2)?this.options.show():null})
        },
        draw({ctx}){
            if(!this.indicate)return
            ctx.fillStyle = this.color
            ctx.strokeStyle = this.bordercolor
            ctx.fillRect(this.absx, this.absy, this.absw, this.absh)
            ctx.strokeRect(this.absx, this.absy, this.absw, this.absh)

            
        },
        findNodeById(id){
            return this.nodes.find(e=>e.id === id)
        },
        getVariables(){
            return this.variables
        },
        getEvents(){
            return this.events
        },
        setEvent({name, get}){
            const obj = {name, get}
            this.events.push(obj)
        },
        setvarfuncevent({par, set, get, prop, nodeId, array}){
            const parseoutput = (val)=>{
                if(!get)return
                let v = get()
                if(val !== undefined){
                    v = val
                }
                const type = typeof(get())
                return (type === `string`)?`${v}`:(type === `number`)?+(v):(type === `boolean`)? v : v
            }
            const parseinput = (val)=>{

                if(!get)return
                const v = (val)?val:get()
                const type = typeof(v)
                return (type === `boolean`)? 'checkbox': (type === 'function')?'button': type
            }
            const gettype = (val)=>{
                if(!get)return
                return typeof (val)? val: get()
            }
            const Set  = (val)=>{
                if(set)
                return set(parseoutput(val))
            
            }
            const Get = ()=>{
                if(get)
                return parseoutput(get())
            }
            const obj = {set:Set , get:Get, prop, nodeId, parseinput, parseoutput, gettype, subs:[]}
            if(par){
                const find = this.find(par, array) 
                if(find){
                    find.subs.push(obj)
                }
            }
            if(!par)
            array.push(obj)
            return obj
        },
        show(e, cb, listofarray){
            const options = MaterialOptions()
            const setoptions = options.set(e, document.body)
            // remobe options
            const func = ()=>{
                window.removeEventListener(`dblclick`, func)
                options.remove()
            }
            window.removeEventListener(`dblclick`, func)
            EventHandler(window, ``, `dblclick`,func)
            //
            const recall = (setoptions, array, callback)=>{
                array.forEach(v=>{
                    setoptions.add(v.prop, ()=>{
                        if(v.subs.length === 0){
                            callback({v, subs: array, options})
                        }
                        else if(v.subs.length > 0){
                            const newsetoptions = MaterialOptions().set(e, document.body)
                            const newarray = v.subs
                            recall(newsetoptions, newarray, callback)
                        }
                    })
                })
            }
            listofarray.forEach(arrayname=>{
                const arr = this[arrayname]
                if(arr.length > 0){
                    options.addlabel(arrayname)
                    recall(setoptions, arr, cb)
            
                }
            })

            
        },
        find(name, array){
            let v;
            let rescursive = (obj)=>{
                for(let x in obj){
                    if(obj[x]?.prop === name && typeof obj[x] === `object`){
                        return obj[x]
                    }
                    if(obj[x]?.prop !== name && typeof obj[x] === `object`){
                        rescursive(obj[x])
                    }
                }
            }
            rescursive = rescursive(array)
            return rescursive
        },
        drawOnSelected({ctx}){
            if(this.selected){
                ctx.strokeStyle = ` #146ddaff`
                ctx.fillStyle = ` #0e266d61`
                ctx.fillRect(this.x, this.y, this.w, this.h)
                ctx.strokeRect(this.x, this.y, this.w, this.h)
            }
            if(this.showInspect){
                ctx.strokeStyle = ` #dab914ff`
                ctx.fillStyle = ` #6d540e61`
                ctx.fillRect(this.x, this.y, this.w, this.h)
                ctx.strokeRect(this.x, this.y, this.w, this.h)
            }
        },
        bind(type,props= {}){
            if(type ==='Sprite'){
                const obj = SpriteRect(Material, this, Layer, props)
                this.sprite = obj
            }   
            return this
        },
        Events(){
            EventHandler(Material.ui.ctx.canvas, 'select', 'click', ()=>{
                if(this.isHoveredOn() && Layers.layer === Layer){
                    this.updateNodesAndModsDom()
                    this.updateTilePropsDom()
                    const e = domextract(Material.ui.dom.rightside)
                    const elem = e.object.content
                    this.preview = TilePreview(Material, this, (plugindom, name, ismod)=>{
                        if(!ismod) this.addtonodes(plugindom, name)
                        else this.addtomods(plugindom, name)
                    })
                    // TilePreview(Material.ui.dom.rightside, )
                }
            })
        },
        addtonodes(plugindom, name){
            const objectName = name + `Object`
            const pluginobj = PLUGINOBJS[objectName](Material, Layout, Layers, Layer, this)
            if(pluginobj){
                this.nodes.push(pluginobj)
                this.updateNodesAndModsDom()
                this.updateTilePropsDom()
            }
            
            else feedback({message: 'requirement not met'})
        },
        addtomods(plugindom, name){
            const objectName = name + `Object`
            const modObjs = MODOBJS[objectName](Material, Layout, Layers, Layer, this)
            if(modObjs){
                this.modifiers.push(modObjs)
                this.updateNodesAndModsDom()
                this.updateTilePropsDom()
            }
            
            else feedback({message: 'requirement not met'})
        },
        updateTilePropsDom(){
            const e = domextract(Material.ui.dom['Tile Properties']).object.content
            e.innerHTML = ``
            const gui= GUI('current tile props', e)
            gui.add(this, 'indicate', 'indicate', )
            gui.add(this, 'indx', 'indx', [0, 1000])
            .after = ()=>{
                this.resetPos()
            }
            gui.add(this, 'indy', 'indy', [0, 1000])
            .after = ()=>{
                this.resetPos()
            }
            gui.add(this, 'widthMult', 'wm', [0, 1000])
            .after = ()=>{
                this.resetSize()
            }
            gui.add(this, 'heightMult', 'hm', [0, 1000])
            .after = ()=>{
                this.resetSize()
            }
        },
        updateNodesAndModsDom(){
            const nodeE = domextract(Material.ui.dom['Tile Plugins']).object.content
            const modE = domextract(Material.ui.dom['Tile Modifiers']).object.content
            const style = (v)=>{
                v.style.overflow = `hidden`
                v.style.height = `20vh`
                v.style.position = `relative`
                v.classList.add(`yscroll`)
                v.overflow= `hidden scroll`
                v.innerHTML = ``
            }
            style(nodeE)
            style(modE)

            this.nodes.forEach(node=>{
                const nodesDom = NodeDom(nodeE,node, this, 'nodes')
            })
            this.modifiers.forEach(mod=>{
                const nodesDom = NodeDom(modE,mod, this, 'modifiers')
            })
        },
        updateSelectOptions(){
            if(this.selected){
                this.options.remove(`add selected to group`)
                .add({nameId:`add selected to group`,src: '', callback:()=>{
                    const drop = MaterialOptions()
                    .set(this.options, this.options.dom.element)
                    Material.groups.array.forEach(group=>{
                        const d = drop.add(group.name, ()=>{
                            const selected = Material.layouts.getselectedtiles()
                            selected.forEach(tile=>{
                                group.add(tile) 
                                drop.remove()
                                Material.groups.updateDom()
                            })
                        })
                    })
                }})
            }else{
                this.options.remove(`add selected to group`)
            }
        },
        isHoveredOn(){
            return  (
                Layers.layer === Layer &&
                Material.mouse.x >= this.x &&
                Material.mouse.y >= this.y &&
                Material.mouse.x <= this.x + this.w &&
                Material.mouse.y <= this.y + this.h
            )
        },
        getBox(){
            if(!this.indx && this.indx !== 0)return false
            if(!this.indy && this.indy !== 0)return false
            const row = Material.grid?.boxes[this.indy + Layout.indy]
            if(!row)return false
            const box = row[this.indx + Layout.indx]  
            if(!box)return false
            return box
        },
        updateDim(){
            const box = this.getBox()
            if(box && this.x === undefined && this.y === undefined && this.w === undefined && this.h === undefined){
                this.x = box.x + this.offx
                this.y = box.y + this.offy
                this.w = (box.w  * this.widthMult) + this.offw
                this.h = (box.h * this.heightMult) + this.offh
                //for reset
                this.initx = this.x
                this.inity = this.y
                this.initw = this.w
                this.inith = this.h
            }
            // for image
            this.absx = this.x + this.offx
            this.absy = this.y + this.offy
            this.absw = this.w + this.offw
            this.absh = this.h + this.offh
            this.dimentionInitiated = true
                
        },
        remove(){
            this.nodes.forEach(node=>node.remove())
            this.modifiers.forEach(node=>node.remove())
            Layer.tiles.splice(Layer.tiles.indexOf(this), 1)
        },
        handleSelect(){
            if(Material.select.startChecking){
                if(this.isHoveredOn()){
                    this.selected = true
                }
            }
            if(Material.select.cancelCheck){
                this.selected = false
            }
        },
        update(p){
            const box = this.getBox()
            if(!box)return
            this?.preview?.update()
            this.updateDim()
            
            this?.sprite?.update({...p, tile: this})
            this?.collision?.update({...p, tile: this})
            this.draw(p)
            if(Material.ui.devmode){
                this.nodes.forEach(node=>(node.id === this?.sprite?.id)?null:(node.id === this?.collision?.id)?null:node.update({...p, tile: this}))
                this.modifiers.forEach(mod=>mod.update({...p, tile: this}))
            }

            this.drawOnSelected(p)
            this.handleSelect()
            this.updateSelectOptions()
        }
    }
    res.load()
    return res

}