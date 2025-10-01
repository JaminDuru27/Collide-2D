import { domextract } from "../../../components/DRAW/domextract"
import { feedback } from "../../../components/DRAW/feedback"
import { Animan } from "../../../components/Material/plugins/animan"
import { GenerateId } from "../../DRAW/generateId"
import { PluginLoader } from "../pluginloader"


export function AnimanObject(Material, Layout, Tile){
    const res = {
        id: GenerateId(),//important
        name: `Animan`,//important
        settingsoptions: [],//important
        requirement(){return true},//important
        requirementMessage: '',//important
        variablesOfInterest: [], //must, string, number, non-return function, boolean
        eventsOfInterest: [],//must , function, only returns boolean
        fps: 1,
        frame: 0,
        animations: [],
        signature:5,
        toggle: true,
        open(){ //must
            this.loader = PluginLoader(Material, Layout, Tile, this, this.name)
            this.ui = Animan().ui(domextract(this.loader.ui.element).object.main, this, Material, Layout, Tile)
            this.ui.updateAnimations(this)
            this.ui.updateAnimation(this)
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
            this.updateTileVars()
            Material.ui.ondevmodeoff(()=>{
                this.frame = 0
                this.frameobj.reset()
            })
            this.addAnimation('dd')
            
        },
        
        createframes(number){
            const obj = {
                number: number + 1,
                vars:[],
                initvalues:[],
                addvar(v){
                    const vv = {...v, transition: `linear`,}
                    vv.remove = ()=>{
                        this.vars.splice(this.vars.indexOf(vv), 1)
                    }
                    this.vars.push(vv)
                },
                callvars(){
                    this.vars.forEach(v=>v.set(v.getnewvalue()))
                },
                reset(){
                    console.log(`reset`)
                    this.vars.forEach(v=>{
                        v.set(v.initialvalue)
                    })
                },
            }
            return obj
        },
        createslice({frame}){
            const obj = {
                frame,
                frames:[],
            }
            obj.calibrate = ()=>{
                for(let x = 0; x< this.signature -1; x++){
                    obj.frames.push(this.createframes(  x + (frame * this.signature)))
                }
            }
            obj.calibrate()
            return obj
        },
        
        createAnimation(name){
            const obj = {
                name,
                slices: [],
            }
            obj.addslice = (frame)=>{
                obj.slices.push(this.createslice({frame}))
            }
            for(let x = 0; x<= 5; x++){
                obj.addslice(x)
            }
            return obj
        },
        addAnimation(name){
            this.animation = this.createAnimation(name||`animation1`)
            this.animations.push(this.animation)
            this.ui.updateAnimations(this)
            this.ui.updateAnimation(this)
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
        deltaInc:0,
        calcFrame({delta}){
            if(this.deltaInc > (1000 /this.fps)){
                this.calcTiming()
                this.deltaInc = 0
            }
            else this.deltaInc += delta 
        },
        calcTiming(){
            const frameArray = [...this.animation.slices.map(slice=>slice.frames)].flat()
            this.frame = (this.frame + 1) % frameArray.length 
            this.frameobj = frameArray[this.frame]

            this.frameobj.callvars()
            if(this.frameobj.vars.length > 0)
            console.log(this.frame.vars)
        },
        update(props){
            if(!this.toggle)return
            this.ui.update(props)
            this.calcFrame(props)
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