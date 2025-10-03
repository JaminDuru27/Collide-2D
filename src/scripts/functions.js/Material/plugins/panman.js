import { domextract } from "../../../components/DRAW/domextract"
import { feedback } from "../../../components/DRAW/feedback"
import { Panman } from "../../../components/Material/plugins/panman"
import { EventHandler } from "../../DRAW/events"
import { GenerateId } from "../../DRAW/generateId"
import { PluginLoader } from "../pluginloader"
import { TileSelector } from "../tileselector"

export function PanmanObject(Material, Layout, Layers, Layer, Tile){
    const res = {
        id: GenerateId(),//important
        name: `Panman`,//important
        settingsoptions: [],//important
        requirement(){return Tile !== Material && Tile.collision && Tile.sprite},//important
        requirementMessage: 'for tiles only, needs a sprite & collision body!!!',//important
        toggle: true, // important
        offsetx: -(Tile.w / 2),
        offsety: -(Tile.h / 2),
        offsetw: Tile.w * 2,
        offseth: Tile.h * 2,
        inc: 2,
        allowx: true,
        allowy: true,
        variablesOfInterest: ['offsetx','offsety', 'offsetw', 'offseth', 'autopan', 'restrictToWindow', 'restrictToLayout'], //must, string, number, non-return function, boolean
        eventsOfInterest: [''],//must , function, only returns boolean
        left: [],
        top: [],
        bottom: [],
        right: [],
        parallaxBundle: [],
        restrictToWindow: false,
        restrictToLayout: false,
        color: ` #ff000023`,
        mode: `input`,

        //IMPORTANT
        open(){ //must
            this.loader = PluginLoader(Material, Layout, Tile, this, this.name)
            this.ui = Panman().ui(domextract(this.loader.ui.element).object.main, this, Material, Layout, Layers, Layer, Tile)
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
        //Templates
        createParallaxBundle(){
            const obj = {
                name,
                tilestochangearray, 
                multiplier: 1,
            }
            obj.set = ()=>{
                if(this.mode === `input`){
                    if(this[obj.arrayname].indexOf(obj) < 0) //not existing
                    this[obj.arrayname].push(obj)
                }else if(this.mode === `parallax`){
                    if(this[`parallaxBundle`].indexOf(obj) < 0) //not existing
                    this[`parallaxBundle`].push(obj)
                }

            }
            this.ui.updateBundle()
        },
        createBundle(name ='', tilestochangearray = [], arrayname='left', vars=[]){
            const obj = {
                name,
                tilestochangearray, 
                arrayname,
                vars,
                mode: `inc`,
                inc:0, multiplier: 1,
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
                        this.inc += v.getinc()
                        console.log(v.get() + this.inc)
                        v.set(v.get() + this.inc)
                    })
                },
            }
            obj.set = ()=>{
                if(this.mode === `input`){
                    if(this[obj.arrayname].indexOf(obj) < 0) //not existing
                    this[obj.arrayname].push(obj)
                }else if(this.mode === `parallax`){
                    if(this[`parallaxBundle`].indexOf(obj) < 0) //not existing
                    this[`parallaxBundle`].push(obj)
                }

            }
            this.ui.updateBundle(this, Tile)
            return obj
        },
        //EVENTS
        onwindowcollide(){
            return (
                this.onwindowright() ||
                this.onwindowbottom() ||
                this.onwindowtop() ||
                this.onwindowleft()
            )
        },
         
        onwindowright(){return ((this.x + Material.tx) + this.w) - Material.tx > Material.w - Material.tx},
        onwindowbottom(){return ((this.y + Material.ty) + this.h) - Material.ty  > Material.h - Material.ty},
        onwindowtop(){return (this.y + Material.ty)  + Material.ty < Material.ty},
        onwindowleft(){return (this.x + Material.tx) + Material.tx < Material.tx},

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

        //DRAW
        drawnormal({ctx}){
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.w, this.h)
        },
        drawparallax({ctx,}){
            // if(this.allowx){
                this.parallaxBundle.forEach(Bundle=>{
                    Bundle.tilestochangearray.forEach(tile=>{
                        const t = tile.sprite
                        ctx.drawImage(t.image, t.sx, t.sy, t.sw, t.sh, tile.x + tile.w , tile.y, tile.w, tile.h)
                    })
                })
                this.drawnormal({ctx})
                ctx.fillStyle = this.color
                ctx.fillRect(this.x, this.y, this.w, this.h)
                
            // }
        },
        //OFFSETS AND RESOLVES
        offsetleft(){
            Tile.x = (Tile.absx - this.x) - Material.tx

        },
        offsettop(){
            // Tile.collision.vy = 0
            Tile.y = (Tile.absy - this.y) - Material.ty
        },
        offsetright(){
            Tile.x = Material.w - (Tile.w + (Tile.absx - this.x)) + Material.tx
        },
        offsetbottom(){
            Tile.y = Material.h - (Tile.h + (Tile.absy - this.y)) + Material.ty
        },
        
        resolvetop(){
            if(!this.allowy)return
            if(!this.onwindowtop())return
            this.offsettop()
            this.inc = -Tile.collision.vy
            this.changeallvars('y')
        },
        
        resolveleft(){ 
            if(!this.allowx)return
            if(!this.onwindowleft())return
            this.offsetleft()
            this.inc = -Tile.collision.vx
            this.changeallvars('x')
        },
        resolvebottom(){
            if(!this.allowy)return
            if(!this.onwindowbottom())return
            this.offsetbottom()
            this.inc = -Tile.collision.vy
            this.changeallvars('y')
        },
        resolveright(){
            if(!this.allowx)return
            if(!this.onwindowright())return
            this.offsetright()
            this.inc = -Tile.collision.vx
            this.changeallvars('x')
        },
        
        updateDim(){
            this.x = Tile.absx + this.offsetx
            this.y = Tile.absy + this.offsety
            this.w = this.offsetw
            this.h = this.offseth
        },
        
        /////////
        resolvetoright(){
            if(!this.onwindowright())return
            this.callarray('right')

        },
        resolvetoleft(){
            if(!this.onwindowleft())return
            this.callarray('left')

        },
        resolvetotop(){
            if(!this.onwindowtop())return
            this.callarray('top')
        },
        resolvetobottom(){
            if(!this.onwindowbottom())return
            this.callarray('bottom')
            
        },
        
        // update modes
        updateautopan(){
            if(this.mode !== `auto`)return
            if(!this.onwindowcollide())return
            this.resolveleft()
            this.resolvetop()
            this.resolvebottom()
            this.resolveright()
            this.draw = (props)=>{return this.drawnormal(props)}
        },
        updateparallax(){
            if(this.mode !== `parallax`)return
            if(!this.onwindowcollide())return
            this.resolveleft()
            this.resolvetop()
            this.resolvebottom()
            this.resolveright()

            if(this.onwindowright()){
                this.parallaxBundle.forEach(bundle=>{
                    bundle.tilestochangearray.forEach(tile=>{
                        if(tile.absx < -tile.absw){
                            tile.absx = 0
                            tile.x = 0
                        }else
                        tile.x += -Tile.collision.vx * bundle.multiplier
                    
                    })
                })

            }
            if(this.onwindowleft()){
                this.parallaxBundle.forEach(bundle=>{
                    bundle.tilestochangearray.forEach(tile=>{
                        if(tile.absx < -tile.absw){
                            tile.absx = 0
                            tile.x = 0
                        }else
                        tile.x += -Tile.collision.vx * bundle.multiplier
                    
                    })
                })

            }

        },
        assigntiles(){
            if(this.mode === `input`){
                this.resolvetotop()
                this.resolvetobottom()
                this.resolvetoleft()
                this.resolvetoright()

            }
            
        },

        //LOAD
        remove(){//must
            this.loader.remove()
            Tile.nodes = Tile.nodes.filter(e=> e !== this) //delete this
        },
        load(){       
            this.updateTileVars()
            this.open()
            this.draw = this.drawnormal
            EventHandler(window, '', 'keydown', (e)=>{
                if(e.key === `ArrowUp`)Tile.collision.vy =-8
                if(e.key === `ArrowLeft`)Tile.collision.vx =-4
                if(e.key === `ArrowRight`)Tile.collision.vx = 4
            })
            EventHandler(window, '', 'keyup', (e)=>{
                Tile.collision.vx = 0
            })
        },


        //UPDATES
        update(props){
            this.updateDim()
            this.draw = (this.mode === `parallax`)?this.drawparallax : this.drawnormal
            this?.draw(props) 
            this?.ui?.update({...this, ...props})
            this.assigntiles()
            this.updateautopan()
            this.updateparallax()
        },



        //UTILS
        callarray(name){
            this[name].forEach(bundle=>{
                bundle.call()
            })
        },
        changeallvars(prop){
            Material.layouts.currentArray.flat().forEach(layout=>{
                layout.layers.array.forEach(layer=>{
                    layer.tiles.forEach(tile=>{
                        if(tile.id !== Tile.id)
                        tile[prop] += this.inc
                    })
                })
            })
        },
        lerp(from , to, index){return from + (to - from) * index},


    }
    if(!res.requirement()){
        return undefined
        feedback({message: res.requirementMessage || `requirements not met`})
    }else {
        res.load()
        return res
    }
}