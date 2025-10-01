import { EventHandler } from "../../functions.js/DRAW/events.js"
import { draw } from "../../functions.js/DRAW/instances.js"

export function History(parobject, value){
    const res =  {
        array:[],
        load(){this.events()},
        events(){
            let key
            EventHandler(window, 'undo', 'keydown', (e)=>{
                if(e.key === `z`)
                this.undo()
                if(e.key === `y`)
                this.redo()
            })
        },
        save(){
          this.add(parobject[value])  
        },
        addInstance(name, object, key, time = 4000){
            const data = {
                name, object,history:[], data: {},
                time, key, index: null, maxLength: 10,
            }
            data.callback = (val, variable)=>{}
            data.clearAfter = ()=>{
                if(data.index < data.history.length-1)
                    data.history = data.history.slice(0, data.index)
            }
            data.replace = (val)=>{
                return val
            }
            
            this.array.push(data)
            return data
        },
        update(){
            this.array.forEach(data=>{
                const clone = data.object[data.key]
                data.clearAfter()
                data.history.push(data.replace(clone)) 
                data.index = data.history.length -1
                if(data.history.length > data.maxLength -1)data.history.shift()

            })
        },
        undo(){
            this.array.forEach(data=>{
                data.index --
                if(data.index < 0 )data.index = 0
                data.callback(data.history[data.index], data.data)
            })
        },
        redo(){
             this.array.forEach(data=>{
                data.index ++
                if(data.index > data.history.length - 1 )data.index = data.history.length -1
                data.callback(data.history[data.index], data.data)
                
            })
           
            
        },
    }
    res.load()
    return res
}
function  UndoInstance(){
    return {

    }
}