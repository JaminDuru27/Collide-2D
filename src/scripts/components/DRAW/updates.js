export function Updates(Instance){
    const res = {
        array: [],
        style(){return `padding:.2rem .5rem; font-size: .5rem; color: grey; display: flex; gap: .5rem`},
        load(){
            this.ui()
        },
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`updatevalues`)
            this.element.setAttribute(`style`, this.style())
            Instance.ui.dom.updates.append(this.element)
        },
        record(object, key, replacer = (value)=> value){
            const data = {object, key, replacer}
            this.array.push(data)
            return data
        },
        update(){
            if(!this.element)return
            this.element.innerHTML = ``
            this.array.forEach(arr=>{
                this.element.innerHTML += `<div style='flex-shrink:0;'>${arr.key} : ${arr.replacer(arr.object[arr.key])}</div>`
            })
        }
    }
    return res
}