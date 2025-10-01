import { History } from "../../components/DRAW/undo.js"
import { Instance } from "./instance.js"
import { GetInstanceCopyData, SaveInstanceCopyData } from "./instancecopydata.js"
import { Library } from "./library.js"

export function DRAWInstances(){
    const res = {
        library: Library,
        array: [],
        load(){
            this.history =  History(res, `instance`)
        },
        getAllStored(){
            
        },
        add(name = 'draw'){
            //AutoLOAD ON ADDING
            const inst = Instance((name==='')?`draw`:name)
            inst.load()
            inst.open()
            this.instance = inst
            this.array.push(inst)
        },
        open(instance, shouldLoad){
            //ONLY UI LOADS
            let inst = (instance) ? instance : this.array[this.array.length-1]
            inst.open()
            this.instance =  inst
        },
        remove(){
            this.instance.unload()
            this.instance = undefined
            const data = JSON.parse(localStorage.getItem('CollideData'))
            setTimeout(()=>{
                // this.add(data[0].name)
            }, 30)
        },
        update(){
            if(this.instance)
            this.instance.render()
            Delay(()=>{
                if(this.instance)
                this.array.forEach((inst)=>{
                    // SaveInstanceCopyData(GetInstanceCopyData(inst))
                })
            }, 500)
        }
    }
    res.load()
    return res
}
let xtime = 500 - 1
const Delay = (callback, time = 100)=>{
    xtime ++
    if(xtime >= time){
        callback()
        xtime = 0
    }
}
export let draw = DRAWInstances()