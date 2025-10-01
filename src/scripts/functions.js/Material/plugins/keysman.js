import { domextract } from "../../../components/DRAW/domextract"
import { feedback } from "../../../components/DRAW/feedback"
import { KeysMan } from "../../../components/Material/plugins/keysman"
import { GenerateId } from "../../DRAW/generateId"
import { PluginLoader } from "../pluginloader"


export function KeysManObject(Material, Layout, Layers, Layer, Tile){
    const res = {
        id: GenerateId(),//important
        name: `KeysMan`,//important
        settingsoptions: [],//important
        requirement(){return Tile === Material},//important
        requirementMessage: '',//important
        variablesOfInterest: [''], //must
        fieldsUI:[],
        toggle: true,
        open(){ //must
            this.loader = PluginLoader(Material, Layout, Tile, this, this.name)
            this.ui = KeysMan().ui(domextract(this.loader.ui.element).object.main, this, Material, Layout, Layers, Layer, Tile)
            this.updateFields()
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
        updateFields(){
            this.fieldsUI.forEach(ui=>{
                console.log(ui)
                ui.load(this.ui)
            })
        },
        add(Tile){
            const fieldUI = this.ui.add({Tile, KeysManObject: this})
            fieldUI.deleteCallback =()=>{
                fieldUI.remove()
                this.fieldsUI.splice(this.fieldsUI.indexOf(fieldUI), 1)
            }
            this.fieldsUI.push(fieldUI)
        },
        remove(){//must
            this.loader.remove()
            Tile.nodes = Tile.nodes.filter(e=> e !== this) //delete this
            this.fieldsUI.forEach(ui=>ui.remove())
        },
        load(){            
            // this.settingsoptions.push({name:'', callback: callback.bind(this)})
            this.open()
            Material.optionsHandler.find(`globaltilepreviewoption`)
            .remove('Send To Keysman')
            .add({nameId: 'Send To Keysman', callback:()=>{
                this.open()
                this.add(Material.currentPreviewedTile)
            }})
        },
        update(props){
        },
    }
    if(!res.requirement()){
        return undefined
        feedback({message: res.requirementMessage || `requirements not met`})
    }else {
        res.load()
        return res
    }res.load()
    return res
}