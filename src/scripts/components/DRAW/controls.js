import { EventHandler } from "../../functions.js/DRAW/events.js"

export function Controls(){
    const res = {
        ui(data){},
        load(){},
        unload(){},
        add(key = '', src='', position = {},callback = ()=>{}, endcallback = ()=>{}){
            const data = {
                key, src, callback,
                ...position, endcallback
            }
            this.events(data)
            this.ui(data)
        },
        events(data){
            if(data.key && data.key !== '' && data.callback)
            EventHandler(window,'', 'keydown', (e)=>{
                if(e.key === data.key)data.callback(e)
            })
            if(data.key && data.key !== '' && data.endcallback)
            EventHandler(window,'', 'keyup', (e)=>{
                if(e.key === data.key)data.endcallback(e)
            })
        },
        update(){},

    }
    res.load()
    return res
}