import { EventHandler } from "../../functions.js/DRAW/events"
import { domextract } from "../DRAW/domextract"
let e
export function PluginsUI(to){
    const res = {
        pluginsAvailable: [],
        style(){return `position: absolute;top: 0;left: 0;width: 25vh;background: #00000030;height: 100%;position: relative;z-index: 10;backdrop-filter: blur(13px);border: 1px solid;`},
        pluginstyle(){return `flex-shrink: 0;cursor: pointer;width: 100%;height: 20vh;overflow: hidden;padding: .5rem;border-radius: .5rem;border: 1px solid #ffffff14;background: #ffffff14;box-shadow: 1px 2px 12px #1d1c1cf5;`},
        titlestyle(){return ` width: 100%;height: 20vh;overflow: hidden;padding: .5rem;border-radius: .5rem;border: 1px solid #ffffff14;background: #ffffff14;box-shadow: 1px 2px 12px #1d1c1cf5;`},
        thumbstyle(){return `width: 100%;height: 75%;outline: 1px solid #ffffff3b;border-radius: .5rem;outline-offset: .2rem;`},
        inputStyle(){return `width: 100%;background: transparent;border: 2px solid #ddd;border-radius: 20px;padding: .2rem;color: #ddd;height: 100%;`},
        labelStyle(){return `display: flex;margin-top: 1rem;width: 100%; padding: 0 .5rem;gap: .5rem;justify-content: space-between;align-items: center;`},
        contentStyle(){return `overflow: hidden scroll;padding: .5rem;width: 100%;height: 80%;position: relative;display: flex;flex-direction: column;justify-content: flex-start;align-items: center;gap: 1rem; margin: 1rem 0`},
        exitstyle() { return `position: absolute;top: 1rem;right: 1rem;width: 1vw;height: 1vw;opacity: .5;` },
        resultcontentstyle(){return`overflow: hidden scroll;width: 100%;display: flex;height: 90%;flex-direction: column;gap: 1rem;justify-content: flex-start;align-items: flex-start;padding: .5rem;margin-top: 1rem;`},
        resulttitlestyle(){return` color: #fff;height: 7%;padding: .5rem;font-size: .7rem;`},
        searchresultstyle(){return`position: fixed;width: 100%;height: 100%;backdrop-filter: blur(17px);background: #000000cc;`},
        ui(){
            if(e)e.remove
            e = this
            this.element = document.createElement(`div`)
            this.element.classList.add(`plugins`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML = `
            <div class='title' style='padding: .5rem;color: #fff;'></div>
            <label for='plugsearch' style='${this.labelStyle()}'>
            <input id='plugsearch' class='search' type='input' style='${this.inputStyle()}'/>
            <img  class='plugbtn' src='../assets/icons/search.png' style='width:1rem' />
            </label>
            </div>
            <div class='content yscroll' style='${this.contentStyle()}'></div>
            `
            to.append(this.element)
            domextract(this.element, `classname`, this)
        },
        
        add(pluginObj, callback=()=>{}, add = true){
            pluginObj.cc = callback
            if(add)            
            this.pluginsAvailable.push(pluginObj)
            const div = document.createElement(`div`)
            div.onclick = (e)=>{
                callback()
            }
            div.classList.add(`plugin`)
            div.setAttribute(`style`, this.pluginstyle())
            div.innerHTML = `
            <div class='title' style='font-size: .7rem; width: 100%; height: 20%; color: #fff'>${pluginObj.name}</div>
            <img src='${pluginObj.getThumbnailImage().src}' style='${this.thumbstyle()}'>
            `
            if(add)
            this.dom.content.append(div)
            return {element: div, ...domextract(div).object}
        },
        findinplugins(name){
            const names = [...this.pluginsAvailable.map(plug=>plug.name.toLowerCase())]
            let is = false
            let resultsnames = []
            names.forEach((pname)=>{
                if(pname.includes(name)){
                    is = true
                    if(!resultsnames.includes(pname))resultsnames.push(pname)
                }
            })
            if(is){
                //gather results
                const results = [...this.pluginsAvailable.map(plug=>{
                    const n = plug.name.toLowerCase()
                    return (resultsnames.includes(n))?plug: undefined
                })]
                this.createSearchResult(results.filter(e=>e !== undefined))
            }
        },
        createSearchResult(results = []){
            if(this.resulte)this.resulte.remove()
            const element = document.createElement(`div`)
            this.resulte = element
            element.setAttribute(`style`, this.searchresultstyle())
            element.classList.add(`searchResults`)
            element.innerHTML = `
            <div class='title' style='${this.resulttitlestyle()}'>Result${(results.length > 1)?'s':''} (${results.length})</div>
            <div class='content yscroll' style='${this.resultcontentstyle()}'></div>
            <div class='exit' style='${this.exitstyle()}'></div>
            `
            this.dom.content.append(element)
            const dom = domextract(element).object
            dom.exit.onclick = ()=> {
                element.remove()
            }
            results.forEach(obj=>{
                if(obj){
                    const elemobj = this.add(obj,obj.cc, false) 
                    dom.content.append(elemobj.element)
                }
            })
        },
        events(){
            EventHandler(this.dom.plugbtn, '', 'click', ()=>{
                this.findinplugins(this.dom.search.value.toLowerCase())
            })
            EventHandler(this.dom.search, '', 'input', ()=>{
                this.findinplugins(this.dom.search.value.toLowerCase())
            })
            EventHandler(window, '', 'dblclick', ()=>{
                this.remove()
            })
        },
        remove(){
            this.element.remove()
        },
        load(){
            this.ui()
            this.events()
        }
    }
    res.load()
    return res
}