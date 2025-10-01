import { Options } from "../../components/DRAW/options.js"
import * as TOOLS from './toolsExport.js'
export function Tools(Instance){
    const res ={
        tools: {},
        current: null,
        load(){
            //WILL BE LOADED ONCE
            
        },
        ui(){
            //WILL BE LOADED EACH OPEN
            this.options = Options({to: Instance.ui.element, name: 'Tools', x: `60vw`,
             appends: [
                {element: Instance.ui.dom.sideleft, direction: 'right'},
                {element: Instance.ui.dom.sideright, direction: 'left'},
                {element: Instance.ui.dom.top, direction: 'up'}
             ]})
            this.addTools()
        },
        shortcuts(){
            Instance.shortcuts.add(`toglepencil`, ['b'], ()=>{
                this.current = this.tools.Pencil
                if(this.current.enter)this.current?.enter()
            })
            Instance.shortcuts.add(`toglepencil`, ['e'], ()=>{
                this.current = this.tools.Eraser
                if(this.current.enter)this.current?.enter()
            })
            Instance.shortcuts.add(`toglepencil`, ['d'], ()=>{
                this.current = this.tools.Select
                if(this.current.enter)this.current?.enter()
            })
            Instance.shortcuts.add(`toglepencil`, ['i'], ()=>{
                this.current = this.tools.Inspect
                if(this.current.enter)this.current?.enter()
            })
            Instance.shortcuts.add(`toglepencil`, ['f'], ()=>{
                this.current = this.tools.Fill
                if(this.current.enter)this.current?.enter()
            })
        },
        events(){
            //WILL BE LOADED EACH OPEN
        },
        addTools(){
            for(let x in TOOLS){
                this.tools[x] = TOOLS[x](Instance, this, x)
            }
        },
        highlighCurrentTool(){
            for(let x in this.tools){
                const v = this.tools[x]
                v.dom.style.backgroundColor = `#2d012d`
                if(this.current)
                this.current.dom.style.backgroundColor = `#650567`
            }
        },
        update(){
            this.highlighCurrentTool()
            if(this.current)this.current.update()
        }
    }
    res.load()
    return res
}

