import { domextract } from "../../../components/DRAW/domextract"
import { feedback } from "../../../components/DRAW/feedback"
import { StateMan } from "../../../components/Material/plugins/stateMan"
import { GenerateId } from "../../DRAW/generateId"
import { PluginLoader } from "../pluginloader"

export function StateManObject(Material, Layout, Layers, Layer, Tile){
    const res = {
        id: GenerateId(),//important
        name: `StateMan`,//important
        settingsoptions: [],//important
        requirement(){return Material !== Tile},//important
        requirementMessage: 'For Tiles Only',//important
        variablesOfInterest: [''], //must
        array:[],
        toggle: true,
        open(){ //must
            this.loader = PluginLoader(Material, Layout, Tile, this, this.name)
            this.ui = StateMan().ui(domextract(this.loader.ui.element).object.main, this, Material, Layout, Layers, Layer, Tile)
            this.updateDom()

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
        },
        events(){
            Material.ui.ondevmodeoff(()=>{
                this.array.forEach(arr=>arr.reset())
                console.log(`reset`)
            })
        },
        createstate(name){
            const obj =  {
                name,
                conds:[],
                vars:[],
                addcondition(text, cond){
                    const obj = {
                        text, isTrue: cond, 
                    }
                    obj.remove= ()=>{
                        this.conds.splice(this.conds.indexOf(obj), 1)
                    }
                    this.conds.push(obj)
                },
                reassignvars(){
                    this.vars.forEach(v=>{
                        v.update()
                    })
                },
                reset(){
                    this.toggle = false
                    this.vars.forEach(v=>v.reset())
                },
                isTrue(){
                    return this.conds.every(cond=>cond.isTrue())
                },
                add(v){
                    const obj = {...v, newValue: 0, call: 1, currentcallindex: 0,}
                    obj.remove = ()=>{
                        this.vars.splice(this.vars.indexOf(obj), 1)
                    }
                    obj.update=()=>{
                        obj.currentcallindex ++
                        if(obj.call === Infinity){
                            obj.set(obj.newValue)
                            return
                        }
                        if(obj.currentcallindex <= obj.call){
                            obj.set(obj.newValue)
                        }

                    }
                    obj.reset = ()=>{
                        obj.currentcallindex = 0
                    }
                    this.vars.push(obj)
                    return obj
                }
            }
            obj.delete = ()=>{
                this.array.splice(this.array.indexOf(obj), 1)
                this.updateDom()
                Tile.variables.forEach((v, x)=>{
                    if(v.name === `Set ${obj.name} State`)Tile.variables.splice(x, 1)
                })
            }
            //add tomain vars
            Tile.setVariable({set:()=>{obj.reassignvars()}, get:()=>()=>{}, prop: `Set ${obj.name} State`, nodeId: Tile})

            return obj
        },
        add(){
            feedback({message: `name`, placeholder: 'enter state name',callback:(e)=>{
                const name = e.target.value
                const obj = this.createstate(name)
                this.array.push(obj)
                this.updateDom()

                console.log(Tile.vars)
            }})
        },
        updateDom(){
            this.ui.dom.statecontent.innerHTML = ``
            this.array.forEach(state=>{
                this.ui.addState(state, Tile)
            })
        },
        
        updateStates(){
            this.array.forEach(state=>{
                if(state.isTrue() && !state.toggle){
                    this.state = state
                    this.state.toggle = true
                    console.log(this.state.name)
                    //tell others to reset and wait
                    this.array.forEach(s=>(s !== state)?s.reset():null)
                }
            })
            this?.state?.reassignvars()

        },
        update(props){
            if(!this.toggle)return
            this.updateStates()
            this.ui.updatelivestates(this.array.filter(state=>state.isTrue()))
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