import { Layouts } from "./DrawLayouts.js"
import { MaterialLayout } from "../../components/Material/layout.js"
import { Grid } from "../DRAW/grid.js"
import { Highlight } from "../DRAW/highlight.js"
import { GetInstanceCopyData } from "../DRAW/instancecopydata.js"
import { draw } from "../DRAW/instances.js"
import { Layers } from "../DRAW/layer.js"
import { Library } from "../DRAW/library.js"
import { Mouse } from "../DRAW/mouse.js"
import { materials } from "./materials.js"
import { Plugins } from "./plugins.js"
import { Select } from "./select.js"
import { Groups } from "./Groups.js"
import { Options } from "../../components/DRAW/options.js"
import * as PLUGINOBJS from './plugins/exports'
import * as MODOBJS from './mods/exports'
import { EventHandler } from "../DRAW/events.js"
import { MaterialOptionsHandler } from "./options.js"
import { Selection } from "./selection.js"
import { TileInspector } from "./tileInspector.js"
import { MaterialOptions } from "../../components/Material/options.js"
import { warningscreen } from "./warningscreen.js"

export function Material(){
    const res= {
        load(){
            this.nodes = []
            this.modifiers = []
            this.plugins = Plugins(this)
            this.library = Library('.repo')
            this.setupLibrary()
            this.grid = Grid(this)
            this.mouse = Mouse(this)
            this.highlight = Highlight(this)
            this.select  = Select(this)
            this.layouts = Layouts(this)
            this.groups = Groups(this) 
            this.selected = Selection(this)
            this.tx = 0
            this.ty = 0
            this.sx = 1
            this.sy = 1
            return this
        },
        loadUI(){
            this.ui = MaterialLayout({})
            this.pluginsadd()
            this.modsadd()
            this.updateUis()
            this.updateGuis()
            this.updateEvents()
            this.updateDRAWListDom()
            this.optionsHandler = MaterialOptionsHandler(this)
            this.tileInspector = TileInspector(this)
            this.showOptions()
            return this
        },
        pluginsadd(){
            this.ui.dom.plugins.onclick = ()=>{
                this.plugins.open((pluginobj, name)=>{
                    const obj  = PLUGINOBJS[name+`Object`](this, undefined, this)
                    if(obj)
                    this.nodes.push(obj)
                })
            }
        },
        modsadd(){
            this.ui.dom.mods.onclick = ()=>{
                this.plugins.open((pluginobj, name)=>{
                    console.log(name)
                    const obj  = MODOBJS[name +`Object`](this, undefined, this)
                    if(obj)
                    this.nodes.push(obj)
                }, true)
            }
        },
        setupLibrary(){
            this.library.addFolder('spriteLayer', '')
            this.library.writeFolder('spriteLayer','array',[])
        },
        addDRAWLayout(){

        },
        removeDRAWLayout(){
            
        },
        setDevMode(){
            if(this.ui.devmode){
                this.grid.allowtranslate = false
            }else{
                this.grid.allowtranslate = true
            }
        },
        updateDRAWListDom(){
            draw.array.forEach(inst=>{
                this.ui.addLoadsContent({
                    datainst: GetInstanceCopyData(inst),
                    callback:(data)=>{
                        this.processDRAW(data)
                    }})
            })
        },
        processDRAW(data){
            this.layouts.addLayout(data)

        },
        unload(){
            warningscreen('Are You Sure?. Exiting without saving would lost data', ()=>{
                this.ui.element.remove()
                materials.materials = undefined
            })
        },
        updateUis(){
            for(let x in this){
                if(this[x].ui)this[x]?.ui()
            }
        },
        updateEvents(){
            for(let x in this){
                if(this[x].events)this[x]?.events()
            }
        },
        updateGuis(){
            for(let x in this){
                if(this[x].gui)this[x]?.gui()
            }
        },
        showOptions(){
            EventHandler(window, '', 'keydown', (e)=>{
                if(e.key ==='ContextMenu'){
                    const options = Options({to: this.ui.element})
                    options.add('delete', ()=>{
                        Layouts.currentArray.splice(Layouts.array.indexOf(this), 1)
                        Layouts.array.push(data)
                        Layouts.updateDom()
                    })
                    options.add('addplugin', ()=>{
                        this.plugins.open((plugindom, name)=>{
                            const objectName = name + `Object`
                            const pluginobj = PLUGINOBJS[objectName](this, Layout, this)
                            if(pluginobj){
                                this.nodes.push(pluginobj)
                            }
                            else feedback({message: 'requirement not met'})
                        
                        })
                    })
                    options.add('showmodsandplugins', ()=>{
                        console.log(`showmodsandplugins`)
                    })
                }
                
            })
        },
        calcSize(){
            this.w = this?.ui?.ctx.canvas?.width
            this.h = this?.ui?.ctx.canvas?.height
        },
        render(delta){
            this.calcSize()
            if(!this.ui)return
            this.ui.clearRect()
            this.ui.ctx.save()
            this.ui.ctx.scale(this.sx, this.sy)
            this.ui.ctx.translate(this.tx, this.ty)
            for(let x in this){
                if(this[x]?.update)this[x]?.update({ctx: this.ui.ctx, delta: +(delta)})
            }
            this.setDevMode()
            this.nodes.forEach(node=>node.update({ctx:this.ctx, delta: +(delta)}))
            this.modifiers.forEach(mod=>mod.update({ctx:this.ctx, delta: +(delta)}))
            this.ui.ctx.restore()

        }
    }
    return res
}