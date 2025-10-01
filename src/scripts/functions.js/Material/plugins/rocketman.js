import { domextract } from "../../../components/DRAW/domextract"
import { feedback } from "../../../components/DRAW/feedback"
import { RocketMan } from "../../../components/Material/plugins/rocketman"
import { GenerateId } from "../../DRAW/generateId"
import { PluginLoader } from "../pluginloader"


export function RocketManObject(Material, Layout, Tile){
    const res = {
        id: GenerateId(),//important
        name: `RocketMan`,//important
        settingsoptions: [],//important
        requirement(){return Tile.collision && Tile !== Material},//important
        requirementMessage: 'needs collision rect',//important
        variablesOfInterest: ['index', `friction`], //must
        friction: 0.2,
        index: 0.2,
        toggle: true,
        open(){ //must
            this.loader = PluginLoader(Material, Layout, Tile, this, this.name)
            this.ui = RocketMan().ui(domextract(this.loader.ui.element).object.main, this, Material, Layout, Tile)
            this.index= Tile.collision.weight
            //set the vars
            return true
        },
        getpreset(){ // must
            const data = {
                pluginName: this.name,
                name: 'ddd',
                object: {}
            }
            this.variablesOfInterest.forEach(x=>data.object[x] = this[x])
            return data
        },
        remove(){//must
            this.loader.remove()
            Tile.nodes = Tile.nodes.filter(e=> e !== this) //delete this
        },
        load(){
            this.open()
            this.events()
            this.updateTileVars()
        },
        updateTileVars(name){
            Tile.setVariable({prop: this.name, nodeId: Tile.id})
            Tile.setFunction({prop: this.name, nodeId: Tile.id})
            Tile.setEvent({prop: this.name, nodeId: Tile.id})
            const v = Tile.setVariable({par: this.name,prop:`Toggle ${this.name}: ${this.toggle}`, set:(val)=>{
                this.toggle = val
                v.prop = `Toggle ${this.name}: ${this.toggle}`
            }, get: ()=>this.toggle})
            const newvars = []
            this.variablesOfInterest.map(key=>{
                const data = {
                    prop: key,
                    nodeId: Tile.id
                }
                data.get = ()=>{
                    return this[data.prop]
                }
                data.set = (value)=>{
                    return this[data.prop] = value
                }
                const variable = Tile.setVariable({...data, par: this.name})  
                newvars.push(variable)
            })
            this.variablesOfInterest = newvars

        },
        events(){
            Material.ui.ondevmodeoff(()=>{
                Tile.collision.vy = 0
                this.ui.y = 0
                this.ui.vy = 0
            })
            
        },
        setIndex(val){
            this.index = val
        },
        updateIndex(obj){
            if(obj)
            obj.vy += this.index
            
        },
        update(){
            if(!this.toggle)return
            if(!Tile.collision)this.remove()
            Tile.collision.weight = this.index
            this.updateIndex(Tile.collision)
            this.ui.update(Material, Tile)
        },
    }
    if(!res.requirement()){
        return undefined
        feedback({message: res.requirementMessage || `requirements not met`})
    }else {
        res.load()
        return res
    }
}