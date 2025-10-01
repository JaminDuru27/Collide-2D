import { domextract } from "../../../components/DRAW/domextract"
import { feedback } from "../../../components/DRAW/feedback"
import { Panman } from "../../../components/Material/plugins/panman"
import { EventHandler } from "../../DRAW/events"
import { GenerateId } from "../../DRAW/generateId"
import { PluginLoader } from "../pluginloader"

export function PanmanObject(Material, Layout, Tile){
    const res = {
        id: GenerateId(),//important
        name: `Panman`,//important
        settingsoptions: [],//important
        requirement(){return Tile !== Material && Tile.collision},//important
        requirementMessage: 'for tiles only, needs a collision body!!!',//important
        toggle: true, // important
        offsetx: -(Tile.w / 2),
        offsety: -(Tile.h / 2),
        offsetw: Tile.w * 2,
        offseth: Tile.h * 2,
        autopan: true,
        variablesOfInterest: ['offsetx','offsety', 'offsetw', 'offseth', 'autopan', 'restrictToWindow', 'restrictToLayout'], //must, string, number, non-return function, boolean
        eventsOfInterest: [''],//must , function, only returns boolean
        left: [],
        top: [],
        bottom: [],
        right: [],
        restrictToWindow: false,
        restrictToLayout: false,
        color: ` #ff000023`,
        open(){ //must
            this.loader = PluginLoader(Material, Layout, Tile, this, this.name)
            this.ui = Panman().ui(domextract(this.loader.ui.element).object.main, this, Material, Layout, Tile)
            this.ui.updateBundle(this)

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
            this.updateTileVars()
            this.open()
            EventHandler(window, '', 'keydown', (e)=>{
                if(e.key === `ArrowUp`)Tile.collision.vy =-8
                if(e.key === `ArrowLeft`)Tile.collision.vx =-4
                if(e.key === `ArrowRight`)Tile.collision.vx = 4
            })
            EventHandler(window, '', 'keyup', (e)=>{
                Tile.collision.vx = 0
            })
        },
        updateTileVars(){
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
        lerp(from , to, index){return from + (to - from) * index},
        createBundle(name ='', tilestochangearray = [], arrayname='left', vars=[]){
            const obj = {
                name,
                tilestochangearray, 
                arrayname,
                vars,
                mode: `inc`,
                inc:0,
                addvar(vv){
                    const v = {...vv}
                    v.getinc = ()=> 0 //init inc
                    v.remove = ()=>{
                        this.vars.splice(this.vars.indexOf(v), 1)
                    }
                    this.vars.push(v)
                    return v
                },
                call(){
                    this.vars.forEach(v=>{
                        if(this.mode === `inc`){
                            this.inc += v.getinc() 
                            // console.log(v.prop, this.inc, v.getinc())
                            this.tilestochangearray.forEach(t=>{
                                const arr = t.find('Tile', t.variables).subs
                                arr.forEach(vv=>{
                                    if(vv.prop === v.prop){
                                        vv.set(v.get() + v.getinc())
                                    }
                                })
                            })
                        }
                    })
                },
            }
            obj.set = ()=>{
                if(this[obj.arrayname].indexOf(obj) < 0) //not existing
                this[obj.arrayname].push(obj)
            }
            this.ui.updateBundle(this, Tile)
            return obj
        },
        //for this
        onwindowcollide(){
            return (
                this.onwindowright() ||
                this.onwindowbottom() ||
                this.onwindowtop() ||
                this.onwindowleft()
            )
        },
         
        onwindowright(){return (this.x + this.w) - Material.tx > Material.w + Material.tx},
        onwindowbottom(){return (this.y + this.h) - Material.ty  > Material.h},
        onwindowtop(){return this.y  + Material.ty < Material.tx},
        onwindowleft(){return this.x + Material.tx < Material.ty},

        getOverlap(){
            if(!this.onwindowcollide())return{overlapx:0, overlapy:0}
            let overlapx = 0
            let overlapy = 0
            if((this.x + this.w) + Material.tx > Material.w){
                overlapx = ((this.x + this.w) - Material.tx) - Material.w
            }
            if((this.y + this.h) - Material.ty > Material.h){
                overlapy = ((this.y + this.h) - Material.ty) - Material.h
            }
            if(this.x + Material.tx < Material.w){
                overlapx = this.x - Material.tx
            }
            if(this.y + Material.ty < Material.h){
                overlapy = this.y - Material.ty
            }
            return {overlapx, overlapy}
        },
        draw({ctx}){
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.w, this.h)
        },
        resolveleft(){
            Material.tx = ((Material.w - this.x) - Material.w) 
        },
        resolvetop(){
            // console.log(this.getOverlap())
            Material.ty = (Material.h - this.y) - Material.h 
        },
        resolveright(){
            Material.tx = ((Material.w - this.x) - Material.w) + (Material.w - this.w)
        },
        resolvebottom(){
            Material.ty = ((Material.h - this.y) - Material.h) + (Material.h - this.h)

            // if(this.getOverlap().overlapy > 0)
            // Material.ty -= 1
        },
        updateautopan(){
            if(!this.autopan)return
            if(!this.onwindowcollide())return
            // this.resolvetop()
            // this.resolvebottom()
        },
        updateDim(){
            this.x = Tile.absx + this.offsetx
            this.y = Tile.absy + this.offsety
            this.w = this.offsetw
            this.h = this.offseth
        },
        
        /////////
        resolvetowindowright(){
            console.log((this.x  + this.w) - Material.tx, window.innerWidth + Material.tx)
            if(!this.onwindowright())return
            this.callarray('right')
            Material.tx -= 5

        },
        resolvetowindowleft(){
            if(!this.onwindowleft())return
            this.callarray('left')
        },
        resolvetowindowtop(){
            if(!this.onwindowtop())return
            this.callarray('top')
        },
        resolvetowindowbottom(){
            if(!this.onwindowbottom())return
            this.callarray('bottom')
            
        },
        callarray(name){
            this[name].forEach(bundle=>{
                bundle.call()
            })
        },
        assigntiles(){
            this.resolvetowindowtop()
            this.resolvetowindowbottom()
            this.resolvetowindowleft()
            this.resolvetowindowright()
        },
        update(props){
            this.updateDim()
            this.draw(props)
            this?.ui?.update({...this, ...props})
            this.updateautopan()
            this.assigntiles()
            // console.log(this.onveiwportcollide(), this.getOverlap())
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