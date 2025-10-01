export const events = {
    array:[],
    clear(){
        this.array.forEach(arr=>{
            if(arr.element)
            arr.element.removeEventListener(arr.type,arr.callback)
        })
        this.array = []
    }
}
export function EventHandler(element, name, type, callback){
    const res = {
        events: [],
        load(){
            if(type && callback){
                this.addevent(name, type, callback)
            }
        },
        addevent(name, type, callback){
            const ev = {element, name, type, callback}
            if(!element)return
            events.array.push(ev)

            this.events.push(ev)
            element.addEventListener(type, (e)=>{
                callback(e)
            })

        },
        removeevent(name){
            this.events.forEach(ev=>{
                if(ev.name === name){
                    ev.element.removeEventListener(ev.type,ev.callback)
                    events.array.splice(events.array.indexOf(ev), 1)
                }
            })
        },
       
    }
    res.load()
    return res
}