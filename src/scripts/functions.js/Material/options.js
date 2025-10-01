import { Options } from "../../components/DRAW/options"
import { MaterialOptions } from "../../components/Material/options"
import { EventHandler } from "../DRAW/events"

export function MaterialOptionsHandler(Material){
    const res = {
        array:[],
        load(){
            this.addOption({nameId:'globalvariablesoption', to: Material.ui.element, condition:()=>true})
            this.addOption({nameId:'globaltilepreviewoption', to: Material.ui.element, condition:()=>true})
            this.addOption({nameId:'globalpresetoption', to: Material.ui.element, condition:()=>true})
        },
        addOption({nameId, to, condition = ()=>false}){
            to.optionId = nameId
            const data = {
                array: [],
                nameId,
                condition,
                show(e){
                    if(!this.condition())return
                    // const options = Options({to,name: nameId, x: Material.mouse.x + `px`, y: Material.mouse.y + `px`})
                    // this.dom= options
                    // this.array.forEach(arr=>options.add(arr.nameId, arr.callback, arr.src, arr.arguements))

                    const dom = MaterialOptions()
                    this.dom = dom
                    const options = dom.set((e)?e: {clientX: Material.mouse.x, clientY: Material.mouse.y}, to)
                    this.array.forEach(arr=>options.add(arr.nameId, arr.callback, arr.src, arr.arguements))
                    
                    return this
                },
                remove(...nameIds){
                    nameIds.forEach(nameId=>{
                        const find =this.array.find(e=>e.nameId === nameId)
                        if(find){
                            this.array.splice(this.array.indexOf(find), 1)
                            return this
                        }
                    })
                    return this
                },
                removeOptions(){this.dom?.remove()},
                add({nameId, src, callback}){
                    this.array.push({nameId, src, callback, arguements: ()=>{return {e: to}}})
                    return this
                },
            }
            this.array.push(data)
            EventHandler(window, '', 'dblclick', (e)=>{data.remove()})
            return data
        },
        find(byNameIdOrElement){
            return (typeof byNameIdOrElement === `string`)
            ?this.array.find(e=>e.nameId === byNameIdOrElement)
            :this.array.find(e=>e.nameId === byNameIdOrElement.optionId)
        },
        remove(nameId){
            const find = this.find(nameId)
            if(find){
                this.array.splice(this.array.indexOf(find))
            }
        },
        assignOptionToElement(nameId, element){
            const find = this.find(nameId)
            if(!find)return
            element.optionId = nameId
            EventHandler(element, '', 'mousedown', (e)=>{(e.buttons === 2)?find.show():null})
            return find

        },
        default(){},
    }
    res.load()
    return res
}