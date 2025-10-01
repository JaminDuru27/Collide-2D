import { domextract } from "../../../components/DRAW/domextract"
import { Sine } from "../../../components/Material/mods/sine"
import { PluginLoader } from "../pluginloader"

export function SineObject(Material, Layout, Layers, Layer, Tile){
    const res = {
        name: `Sine`,
        globalspeeddelay: 1,
        oscillations:[],
        variables: [],
        variablesOfInterest:['globalspeeddelay'],
        toggle: true, //important
        updateTileVars(){
            Tile.setVariable({prop: this.name, nodeId: Tile.id})
            Tile.setFunction({prop: this.name, nodeId: Tile.id})
            Tile.setEvent({prop: this.name, nodeId: Tile.id})
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
        remove(){
            this.loader.remove()
            Tile.modifiers = Tile.modifiers.filter(e=> e !== this) //delete this
        },
        open(){
            this.loader = PluginLoader(Material, Layout, Tile, this, this.name, true)
            this.ui = Sine().ui(domextract(this.loader.ui.element).object.main, this, Material, Layout, Layers, Layer, Tile)
            this.ui.updateosc(this)
            this.ui.updatevars(this)
        }, 
        updatevar(){
            if(this.mainsinx)
            this.variables.forEach(v=>{
                v.set(this.mainsinx)
                // console.log(v.get())
            })
        },
        addvar(v){
            const vv ={...v}
            vv.remove = ()=>{
                this.variables.splice(this.variables.indexOf(vv), 1)
            }
            this.variables.push(vv)
            this.ui.updatevars(this)
        },
        load(){
            this.updateTileVars()
            this.open()
            this.osc1 = this.addosc(`osc1`)
            this.osc2 = this.addosc(`osc2`).$ref(this?.osc1)
            this.ui.updateosc(this)

        },
        addosc(name){
            const s = osc(name)
            this.oscillations.push(s)
            this.ui.updateosc(this)
            return s
        },
        draw({ctx}){
            if(!ctx)return
            ctx.fillStyle = `red`
            ctx.fillRect(this.sinx, 0, 50, 50)
        },
        lerp(a, b, t) {return (a)? a + (b - a) * t: b},

        blendosc(){
            if(this.osc2){
                return this.lerp(this.osc1.sinx, this.osc2.sinx, 0.5)
            }
            else return(this.lerp(this.mainsinx,this.osc1.sinx, 0.1))
        },
        update(props){
            if(!this.toggle)return
            this.draw(props)
            // console.log(this.sinx, this.time)
            this?.osc1?.update(props)
            this?.osc2?.update(props)
            this.mainsinx = this.blendosc()
            this.updatevar()
            this?.ui?.update(this)
        }
    }
    res.load()
    return res
}

function osc(name){
    const res = {
        name,
        offset: 0, 
        amplitude: 0,
        frequency: 0,
        time: 0,
        speed: 0,
        $ref(osc){
            this.ref = osc
            return this
        },
        update(props){
            if(this.speed === 0 || this.speed === undefined)
            this.time = performance.now() /1000
            else this.time += this.speed
            const value = this.offset + this.amplitude * Math.sin(this.frequency * this.time)
            this.sinx = value

        }
    }
    return res
}