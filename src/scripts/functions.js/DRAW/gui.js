import { domextract } from "../../components/DRAW/domextract.js"
import { EventHandler } from "./events.js"

export function GUI(name,to){
    const bgcolor = (to.getAttribute(`guibgcolor`))?to.getAttribute(`guibgcolor`):`#48092f`
    const res ={
        name,
        array: [],
        style(){return `border-radius: 5px;padding: .5rem; overflow-x: hidden;background: ${bgcolor}; width: 100%; height: fit-content;`},
        inputstyle(){return `font-size: .8rem; padding: 0 .5rem;background: #ffffff59; color: white; border: none;height: 1.5rem; width: 50%; border-radius: 31px; `},
        wrapstyle(s){return `border-radius: 8px;background: #ffffff3d;padding: .5rem .9rem; margin: .5rem 0;text-transform: capitalize;display: flex; width: 100%; justify-content: space-between; align-items: center;height: 100% ;color: white;`},
        titlestyle(){return `color: white; font-size:1.2rem;`},
        inputinputstyle(){return `width: 60%;border-radius: 15px;background: #754662;padding: .2rem .3rem;border: 2px solid #ffffff47;color: white;`},
        optionsstyle(){return `display: flex; width: 100%; justify-content: space-between; align-items: center; margin: .3rem 0; `},
        selectstyle(){return `border-radius: 5px;padding: 3px 0;background: #670e43;border: 2px solid #350522;color: white;`},
        checkboxstyle(){return ``},
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`gui`)
            this.element.setAttribute('guibgcolor', bgcolor)
            this.element.innerHTML += `
            <div style='${this.titlestyle()}'>${name}</div>
            `
            this.element.setAttribute(`style`, this.style())
            to.append(this.element)
        },
        load(){
            this.ui()
        },
        add(object, propertyname, name, range = [0,0,0]){
            let before = ()=>{}
            let after = ()=>{}
            const bx ={
                object, name, range, className: '',
                propertyname, after, before,
            }
            this.array.push(bx)
            this.update()

            return bx
        },
        addFolder(name){
            return GUI(name, this.element)
        },
        inputUI(arr){
            const div = document.createElement(`div`)
            const input = document.createElement(`input`)
            if(arr.className)input.classList.add(arr.className)
            input.value = arr.object[arr.propertyname]
            input.setAttribute(`placeholder`, arr.name)
            input.setAttribute(`min`, `${arr.range[0]}`)
            input.setAttribute(`max`, `${arr.range[1]}`)
            input.setAttribute(`step`, `${arr.range[2]}`)
            div.setAttribute(`style`, this.wrapstyle(this.element.getBoundingClientRect().height - 5))
            input.classList.add(`guiinput`)
            div.append(arr.name, input)
            this.element.append(div)
            return {div, input}
        },
        functionUI(arr){
            const div = document.createElement(`div`)
            if(arr.className)div.classList.add(arr.className)
            div.setAttribute(`style`, this.wrapstyle(this.element.getBoundingClientRect().height - 5))
            this.element.append(div)
            div.textContent = arr.name
            return div
        },
        optionsui(arr){
            let value = arr.object[arr.propertyname]
            const div = document.createElement(`div`)
            div.setAttribute(`style`, this.optionsstyle())
            div.innerHTML += `
            <div style=''>${arr.name}</div>
            <select class = 'select ${arr.className}'  value='${value}'
            style='${this.selectstyle()}'>${arr.name}</select>
            `
            const dom = domextract(div).object
            arr.range.forEach(range=>{
                const content = (range.content)?range.content:range.name
                dom.select.innerHTML += `
                <option value = '${content}'>${range.name}</option>
                `
            })
            
            EventHandler(dom.select, 'select', 'input', (e)=>{
                arr.before(e)
                arr.object[arr.propertyname] = e.target.value
                //LOOP THROUGH ARR>RANGE AND FILTRER THE ONES THAT MATCH THE VALUE
                const obj = arr.range.map((obj)=>{if(obj.name === e.target.value)return obj}).filter((b)=>b)[0]
                obj.callback(e)
                arr.after(e)
            })
            this.element.append(div)
        },
        update(){
            //RESETDOM
            this.element.innerHTML = `<div style='${this.titlestyle()}'>${name}</div>`
            //LOOP
            this.array.forEach(arr=>{
                let value = arr.object[arr.propertyname]
                let type = typeof value

                //IF A FUNCTION
                if(type === `function`){
                    const ui = this.functionUI(arr)
                    EventHandler(ui,  'funcgui', 'click', ()=>{
                        arr.before({...this, targetiv:ui})
                        arr.object[arr.propertyname](arr.args)
                        arr.after({...this, target:ui}) 
                    })
                    return
                }
                //CHECK IF OPTIONS
                if(arr.range.length){
                    if(typeof arr.range[0] === `object`){
                        const ui = this.optionsui(arr)
                        return
                    }
                }


                //IF NOT A FUNCTION
                const ui = this.inputUI(arr)
                const input = ui.input
                const div = ui.div
                function ev(){
                    EventHandler(input, 'inputinput', 'input', (e)=>{
                        arr.before({...this, target: input, value: input.value})
                        let value 
                        if(type === `number`)  value = +(e.target.value)
                        if(type === `color`) value = e.target.value
                        if(type === `boolean`) value = e.target.checked
                        arr.object[arr.propertyname] = value
                        arr.after({...this, target: input, value})
                    })
                }
                
                if(value[0] === `#`){
                    input.setAttribute(`style`, this.inputstyle())
                    input.setAttribute(`type`, `color`)
                    type = `color`
                    ev()
                    return
                }
                else if(type === `boolean`){
                    input.checked = value
                    input.setAttribute(`style`, this.inputstyle())
                    input.setAttribute(`type`, `checkbox`)
                    ev()
                    return
                }
                //TURN STRING INT TO INT
                if(type === `string`){
                    input.setAttribute(`style`, this.inputinputstyle())
                    input.setAttribute(`type`, `input`)
                    ev()
                }
                if(type === `number`){
                    input.setAttribute(`style`, this.inputstyle())
                    input.setAttribute(`type`, `number`)
                    EventHandler(input, 'numbergui', 'dblclick', ()=>{
                        (input.getAttribute(`type`) === `input`) ? input.setAttribute(`type`, `range`):
                        input.setAttribute(`type`, `input`)
                    })
                    ev()
                    return
                }
                
                
                
            })
        },

    }
    res.load()
    return res
}