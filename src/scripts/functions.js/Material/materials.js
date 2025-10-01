import { Material } from "./material.js"

export function Materials(){
    const res  = {
        load(){},
        array:[],
        add(what = `new` , object = {}){
            if(what === `new`){
                this.material = Material().load().loadUI()
                this.array.push(this.material)
            }else if(what === `old`){

            }
        },
        update(delta){
            if(this.material)
            this.material.render(delta)
        }
 
    }
    return res
}



export const materials = Materials() 