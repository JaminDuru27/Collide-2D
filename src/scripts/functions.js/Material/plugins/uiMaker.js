import { UIMaker } from "../../../components/Material/plugins/uiMaker"
import { events } from "../../DRAW/events"
import { domextract } from "../../../components/DRAW/domextract"
import { feedback } from "../../../components/DRAW/feedback"
import { RocketMan } from "../../../components/Material/plugins/rocketman"
import { GenerateId } from "../../DRAW/generateId"
import { PluginLoader } from "../pluginloader"
export function UIMakerObject(Material, Layout, Layers, Layer, Tile){
    const res = {
        name: `UIMaker`,
        elements : [],
        id: GenerateId(),//important
        settingsoptions: [],//important
        requirement(){return Material === Tile},//important
        requirementMessage: '',//important
        variablesOfInterest: [''], //must
        toggle: true,
        open(){ //must
            this.loader = PluginLoader(Material, Layout, Tile, this, this.name)
            this.ui = UIMaker().ui(domextract(this.loader.ui.element).object.main, this, Material, Layout, Layers, Layer, Tile)
            this.DOM = this.ui
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
            
        },
        load(){
            this.open()
            this.events()
        },
        events(){
            
        },
        update(){
            if(!this.toggle)return
            if(!this.current)return
            this?.current?.update()
        },
        update(props){},
    }
    if(!res.requirement()){
        return undefined
        feedback({message: res.requirementMessage || `requirements not met`})
    }else {
        res.load()
        return res
    }
}

