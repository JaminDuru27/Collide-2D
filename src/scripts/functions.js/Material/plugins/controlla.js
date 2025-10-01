import { domextract } from "../../../components/DRAW/domextract"
import { feedback } from "../../../components/DRAW/feedback"
import { Controlla } from "../../../components/Material/plugins/controlla"
import { EventHandler } from "../../DRAW/events"
import { GenerateId } from "../../DRAW/generateId"
import { PluginLoader } from "../pluginloader"

export function ControllaObject(Material, Layout, Layers, Layer, Tile){
    const res = {
        id: GenerateId(),//important
        name: `Controlla`,//important
        settingsoptions: [],//important
        requirement(){return Tile === Material},//important
        requirementMessage: '',//important
        variablesOfInterest: [''], //must
        pads: [],
        toggle: true,
        xboxindex: {
            2: {name: '', y: `17%`, x: `60%`},
            0: {name: '', y: `25%`, x: `66%`},
            3: {name: '', y: `9%`, x: `66%`},
            1: {name: '', y: `18%`, x: `72%`},
            10: {name: '', y: `16%`, x: `22%`,},
            11: {name: '', y: `30%`, x: `56%`,},
            15: {name: '', y: `33%`, x: `39%`,},
            13: {name: '', y: `40%`, x: `33%`,},
            14: {name: '', y: `34%`, x: `27%`,},
            12: {name: '', y: `26%`, x: `32%`,},
            9: {name: '', y: `19%`, x: `53%`,},
            8: {name: '', y: `19%`, x: `36%`,},
            4: {name: '', y: `4%`, x: `26%`,},
            6: {name: '', y: `0%`, x: `26%`,},
            5: {name: '', y: `4%`, x: `66%`,},
            7: {name: '', y: `0%`, x: `66%`,},
        },
        open(){ //must
            this.loader = PluginLoader(Material, Layout, Tile, this, this.name)
            this.ui = Controlla().ui(domextract(this.loader.ui.element).object.main, this, Material, Layout, Layers, Layer, Tile)
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
            // this.settingsoptions.push({name:'', callback: callback.bind(this)})
            this.open()
            this.events()
        },
        events(){
            EventHandler(window, '', 'gamepadconnected', (e)=>{
                this.connected = true
                this.ui.connected()
                this.getGamePads()
                this.ui.updatePads(this)
                this.ui.updateName(this)
            })
            EventHandler(window, '', 'gamepaddisconnected', (e)=>{
                this.connected = false
                this.ui.disconnected()
                this.getGamePads()
                this.ui.updatePads(this)
                this.ui.updateName(this)

            })
        },
        getGamePads(){
            const gamepads = navigator.getGamepads()
            this.pads = []
            gamepads.forEach(gamepad=>{
                if(!gamepad)return
                const axis = gamepad.axes
                const buttons = gamepad.buttons
                this.pads.push(gamepad)
            })
        },
        detectButtonPress(){
            this?.pads?.forEach(pad=>{
                const findpressed  = pad.buttons.find(e=>e.pressed === true)
                if(findpressed){
                    this.ui.updatePads(this)
                    this.ui.setButtonPressed(`button ${pad.buttons.indexOf(findpressed)}`)
                    console.log(this.xboxindex[pad.buttons.indexOf(findpressed)])
                    if(this.xboxindex[pad.buttons.indexOf(findpressed)])
                    this.ui.setIndicatorPos(this.xboxindex[pad.buttons.indexOf(findpressed)])
                }
            })
        },
        update(props){
            if(!this.toggle)return
            if(!this.connected)return
            this.getGamePads()
            this.detectButtonPress()
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