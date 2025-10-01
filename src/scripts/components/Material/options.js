import { EventHandler } from "../../functions.js/DRAW/events"

export function MaterialOptions(){
    const style= ()=>{return `z-index: 10;width: 10rem;position: absolute;background: #170745;padding: .5rem;box-shadow: 2px 3px 14px #00000059;border-radius: .4rem;color: #c8c6c6;font-size: .7rem;text-transform: capitalize;`}
    const optionstyle = ()=>{return `cursor:pointer;width: 100%;height: 1.2rem;margin-bottom: .3rem;`}
    const res = {
        dom(e, to){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`isdropdown`, `true`)
            this.element.setAttribute(`style`, style())
                
            if(to.getAttribute('isdropdown')){
                this.element.style.top = `${0}px`
                this.element.style.right = `-105%`
            }else{
                this.element.style.top = `${e.clientY || 0}px`
                this.element.style.left = `${e.clientX || 0}px`

            }
            
            to.append(this.element)
            return this.element
        },
        addlabel(name, src = '../assets/icons/options.png'){
            let url = 
            (name === `variables`)?'../assets/icons/variables.png'
            :(name === `functions`)?'../assets/icons/functions.png'
            :(name === `events`)? '../assets/icons/events.png'
            : src
            const element = document.createElement(`div`)
            element.setAttribute(`style`, `cursor: pointer;width: 100%;height: fit-content;font-size: .5rem;position: relative;border-top: .1px solid #0800163d;margin: .9rem 0 .3rem;`)
            element.innerHTML += 
            `
            <div style='width: 100%;font-size: .6rem; display: flex; align-items: center; justify-content: space-between;background: #180644;margin-top: .3rem;text-transform: uppercase;'>
            ${name}
            <img src='${url}' style='width: 1rem; height: 1rem;'/>
            </div>
            <div style='width: 100%;position: relative;height: 3px;background: #ffffff61;margin: .3rem 0;border-radius: .5rem;'></div>
            `
            this.element.append(element)
            return this
        },
        optionui(e, text, callback){
            const div = document.createElement(`div`)
            div.setAttribute(`style`, optionstyle())
            div.textContent = text
            div.addEventListener(`click`, (e)=>{
                callback(e)
            })

            div.textContent
            e.append(div)
        },

        remove(){
            if(this.element)this.element.remove()
        },
        event(){
            EventHandler(window, '', 'dblclick', ()=>{this.remove()})
        },
        set(e, to){
            const dom = res.dom(e, to)
            const obj = {
                element: dom,
                add(text, callback = ()=>{}){
                    res.optionui(dom, text, callback)
                    return this
                },
                remove(){
                    res.remove()
                }

            }
            return obj
        },
        load(){
            this.event()
        },

    }
    res.load()
    return res 
}