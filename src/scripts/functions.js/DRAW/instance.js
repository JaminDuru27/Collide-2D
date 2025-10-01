import { CollisionLab } from "../../components/DRAW/collisionlab.js"
import { AABBDisplay, CollisionDisplay } from "../../components/DRAW/collisionsDisplay.js"
import { Dropdown } from "../../components/DRAW/dropdown.js"
import { Imglab } from "../../components/DRAW/imglab.js"
import { drawlayout } from "../../components/DRAW/layout.js"
import { Menu } from "../../components/DRAW/menu.js"
import { Preview } from "../../components/DRAW/preview.js"
import { Updates } from "../../components/DRAW/updates.js"
import { Assets } from "./assets.js"
import { CollisionGroup, CollisionGroups } from "./collision.js"
import { Description } from "./decription.js"
import { downloadCanvas } from "./downloadCanvas.js"
import { EventHandler, events } from "./events.js"
import { ExportOptions } from "./exportOptions.js"
import { GenerateId } from "./generateId.js"
import { Grid } from "./grid.js"
import { Highlight } from "./highlight.js"
import { GetInstanceCopyData, SaveInstanceCopyData } from "./instancecopydata.js"
import { draw } from "./instances.js"
import { Layers } from "./layer.js"
import { Library } from "./library.js"
import { Mouse } from "./mouse.js"
import { PopupDescription } from "./popupdescription.js"
import { Select } from "./select.js"
import { Settings } from "./settings.js"
import { Shortcuts } from "./shortcuts.js"
import { Terrain } from "./terrain.js"
import { Tools } from "./tools.js"


export function Instance(name){
    let no = 0
    const res = {
        name,
        shortcuts: Shortcuts(),
        library: Library(`repo`),
        id: GenerateId() + `Instance`,
        loadObjects(){
            this.ui = drawlayout(this)
            this.settings = Settings(this)
            this.layers = Layers(this)
            this.grid = Grid(this)
            this.mouse = Mouse(this)
            this.tools = Tools(this)
            this.terrain = Terrain(this)

            this.preview = Preview({Instance: this, to: document.body, canvas: this.ui.ctx.canvas, appendList:[this.ui.dom.rightside]})
            this.collisiongroups = CollisionGroups(this)
            this.select = Select(this)
            this.highlight = Highlight(this)
            this.description = Description(this)
            this.popupdescription = PopupDescription(this)
            this.updates = Updates(this)
        },
        load(){
            this.setupLibraryMainFolders()
            this.loadObjects()
        },
        open(){
            this.loadUI()
            this.loadEvents()
            this.loadShortcuts()
        },
        createCopyData(){
            const data = GetInstanceCopyData(this)
            return data
        },
        loadShortcuts(){
            this.shortcuts.add('escapetoemnu', ['Escape'], ()=>{
                this.unload()
            })
            //LOAD THE COMPONENTS UI
            const keys = Object.keys(this)
            for(let x in keys){
                const v = keys[x]
                if(this[v].shortcuts){
                    this[v].shortcuts({ui: this.ui})
                    continue
                }
            }
        },
        loadEvents(){
            //LOAD MAIN UI~~~~~~~~~~~A~QZQA
            if(!this.ui)
            this.ui = drawlayout(this)
            //LOAD THE COMPONENTS UI
            const keys = Object.keys(this)
            for(let x in keys){
                const v = keys[x]
                if(this[v].events){
                    this[v].events({ui: this.ui})
                    continue
                }else if(v.event){
                    this[v].event({ui: this.ui})
                }
            }
        },
        setupLibraryMainFolders(){

            this.assetsFolder = this.library.addFolder('assets', '')
            this.imagesFolder = this.library.addFolder('images', '')
            this.spriteFolder = this.library.addFolder('sprite',``)
            this.collisionFolder = this.library.addFolder('collision',``)
            this.collisionShapesFolder = this.library.addFolder('shapes',`collision`)
            this.worldDataFolder = this.library.addFolder('world', '')
            this.sprites = this.library.addFolder('spriteLayer', 'world')
            this.library.writeFolder(`spriteLayer`, 'array', [])
            this.collisions = this.library.addFolder('collisionGroup', 'world')
            this.library.writeFolder('collisionGroup', 'array', [])
            this.terrains = this.library.addFolder('terrains', 'world')
        },
        setAssetsHead(){
            const spritebtn = this.assets.add({address: this.imagesFolder, domObj: Imglab, 
            arguements:({name, object})=>{
                object = object[name]
                return {
                src: object.general.src, showtitle: false, 
                file: object.general.filename, 
                set:[
                    {name: 'grid',var: `nx`, val: object.selectBox.nx},
                    {name: 'grid',var: `ny`, val: object.selectBox.ny},
                    {name: 'grid',var: `zoom`, val: 1.2},
                    {name: 'sx', val: object.selectBox.indx * object.general.imgcw},
                    {name: 'sy', val: object.selectBox.indy * object.general.imgch},
                    {name: 'w', val: object.selectBox.nx * object.general.cw},
                    {name: 'h', val: object.selectBox.ny * object.general.ch},
                    {name: 'sw', val: object.selectBox.nx * object.general.imgcw},
                    {name: 'sh', val: object.selectBox.ny * object.general.imgch},
                    {name: 'imgsw', val: object.general.imgcw},
                    {name: 'imgsh', val: object.general.imgch},
                    {name: 'grid', var:'x', val: 0},
                    {name: 'grid', var:'y',val: 0},
                ] 
            }}, name: `sprite`})
            const collisionbtn = this.assets.add({address: this.collisionShapesFolder, domObj: CollisionDisplay,
            arguements:({name, object})=>{return{data: object}}, name: 'collision',})

            const terrainbtn = this.assets.add({address: this.terrains, domObj: Imglab, 
            arguements:({name, object})=>{
                object = object[name]
                return {
                src: object.general.src, showtitle: false, 
                file: object.general.filename, 
                set:[
                    {name: 'grid',var: `nx`, val: object.selectBox.nx},
                    {name: 'grid',var: `ny`, val: object.selectBox.ny},
                    {name: 'grid',var: `zoom`, val: 1.2},
                    {name: 'sx', val: object.selectBox.indx * object.general.imgcw},
                    {name: 'sy', val: object.selectBox.indy * object.general.imgch},
                    {name: 'w', val: object.selectBox.nx * object.general.cw},
                    {name: 'h', val: object.selectBox.ny * object.general.ch},
                    {name: 'sw', val: object.selectBox.nx * object.general.imgcw},
                    {name: 'sh', val: object.selectBox.ny * object.general.imgch},
                    {name: 'imgsw', val: object.general.imgcw},
                    {name: 'imgsh', val: object.general.imgch},
                ] 
            }}, name: `terrain`})
            const dropspr = Dropdown({target: spritebtn})
            dropspr.add('add', ()=>{Imglab({to: document.body, allowgui:true, folder: 'images'})})
            const dropcol = Dropdown({target: collisionbtn})
            dropcol.add('add', ()=>{CollisionLab({Instance: this,to: document.body, allowgui:true, folder:null})})
            const dropter = Dropdown({target: terrainbtn})
            dropter.add('add Terrain', ()=>{Imglab({to: document.body, allowgui:true, folder: 'terrains'})})
        },
        loadUI(){
            //RELOAD SHORCUTS
            //this.shorcuts = new Shortcuts()
            //LOAD MAIN UI
            if(!this.ui)
            this.ui = drawlayout(this)
            //LOAD THE COMPONENTS UI
            const keys = Object.keys(this)
            for(let x in keys){
                const v = keys[x]
                if(this[v].gui){
                    this[v].gui({ui: this.ui})
                }else if(this[v].ui){
                    if(v !== `ui`)
                    this[v].ui({ui: this.ui})
                }
            }
            //EACH TIME OPENED , UPDATE DOM
            this.library.domRef = this.ui.dom.repo
            //AND GENERATE ASSETS FOLDERS AGAIN
            this.assets = Assets(this)
            this.setAssetsHead()

        },
        save(){
            SaveInstanceCopyData(this.createCopyData())
        },
        unload(){
            //save data url for previe when loading
            this.savedataurl()
            //save to cc
            // this.save()
            //REMOVE FROM DRAW
            draw.instance = null
            //CLEAR EVENTS
            events.clear()
            //REMOVE DOM
            this?.ui?.remove()
            delete this.ui
            //SHOW MENU
            Menu()

            
        },
        savedataurl(){
            if(this?.ui?.ctx)
            this.dataurl = this.ui.ctx.canvas.toDataURL()
            return this.dataurl
        },
        delete(){},
        rename(name){
            this.name = name
            this.ui.dom.title.textContent = name
        },
        render(){
          
            this.ui.ctx.clearRect(0, 0,this.ui.dom.canvas.width, this.ui.dom.canvas.height)
            for(let x of Object.keys(this)){
                if(this[x].update)
                this[x].update({ctx: this.ui.ctx, ui: this.ui})
            }
            if(this.gameRenderer)this.gameRenderer.render(this)
        }
    }
    //res.load()
    return res
}