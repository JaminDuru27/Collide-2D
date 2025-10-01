import { draw } from "../../functions.js/DRAW/instances.js"
import { Library } from "../../functions.js/DRAW/library.js"
import { domextract } from "./domextract.js"
import { makedraggable } from "./makedraggable.js"

export function AssetsLib({to, Instance, Assets}){
    const res = {
        style(){return `width: 100%; position: relative; height: ${to.getBoundingClientRect().width}px; background: transparent; overflow: hidden; border-radius: .3rem`},
        mainStyle(){return `background: transparent;width: 100%; height: 100%; display: flex; flex-direction: column;justify-content: flex-start; align-items: center`},
        navStyle(){return `padding: 0 .4rem;overflow-x: scroll;background: #ffffff59;width: 100%; height: calc(20% + .6rem); display: flex; justify-content: flex-start; align-items:center;`},
        navbtnStyle(){return `cursor:pointer;flex-shrink: 0;padding: .3rem .6rem; height: 2rem; background: #4e0732; color: white;border-radius: 1rem; margin: 0 .5rem 0 0; display: flex; justify-content: center; align-items: center `},
        outputPropStyle(){return `cursor:pointer;color: black; padding: .2rem .3rem;background: #f5deb3; border-bottom: 1px solid #3b0726`},
        outputStyle(){return `overflow:scroll;position: relative;width: 100%; height: calc(80% - .6rem); background: #ffffff38;`},
        assetscanvasStyle(){return `width: 100%; height: 100%; position: absolute; top: 0; left: 0`},
        expandstyle(){return `cursor:pointer;position: absolute;top: -2%;right: -2%;width: 1rem;height: 1rem;background-color: #3a0726;border-radius: 50%;`},
        load(){
            this.ui()
            this.events()
        },
        ui(){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.classList.add(`assets`)
            this.element.innerHTML += `
            <div class='main' style='${this.mainStyle()}'>
            <div class='expand' popupdescription = 'float assets' style='${this.expandstyle()}'></div>
            <div class='nav xscroll' style='${this.navStyle()}'>

            </div>
            <div class='output hidescroll' style='${this.outputStyle()}'>

            </div>
            </div>
            `
            to.append(this.element)
            domextract(this.element, 'classname',this)
        },
        events(){
            let toggle =  -1
            this.dom.expand.onclick = ()=>{
                toggle *= -1
                if(toggle > 0){
                    const w = this.element.clientWidth
                    const h = this.element.clientHeight
                    document.body.append(this.element)
                    this.element.style.top = 100 + `px`
                    this.element.style.left = 300 + `px`
                    this.element.style.width = w + `px`
                    this.element.style.height = h + `px`
                    this.element.style.border = `2px solid #e91e63`
                    this.drag = makedraggable(this.element.querySelector(`.nav`), this.element)
                    this.drag.drag = true
                    this.dom.expand.setAttribute(`popupdescription`, `unfloat assets`)
                }else if (toggle < 0){
                    this.element.style.top = `0px`
                    this.element.style.left = `0px`
                    const w = this.element.clientWidth
                    const h = this.element.clientHeight
                    to.append(this.element)
                    this.element.style.border = `none`
                    this.dom.expand.setAttribute(`popupdescription`, `float assets`)
                    if(this.drag){
                        this.drag.drag = false
                    }
                    
                }
            }
        },
        navbtnui(name, callback){
            const div = document.createElement(`div`)
            div.setAttribute(`style`, this.navbtnStyle())
            div.classList.add(name)
            div.classList.add(`navbtn`)
            div.onclick = ()=>{callback()}
            div.textContent = name
            this.dom.nav.append(div)
            domextract(this.element, 'classname',this)
            return div
        },
        addnavnbtn(name, callback){
            const div = document.createElement(`div`)
            div.setAttribute(`style`, this.navbtnStyle())
            div.classList.add(name)
            div.classList.add(`navbtn`)
            div.textContent = name
            div.onclick = ()=>{callback()}
            this.dom.nav.append(div)
            domextract(this.element, 'classname',this)
            return div
        },
        propertiesUI(name, callback){
            const div = document.createElement(`div`)
            div.setAttribute(`style`, this.outputPropStyle())
            div.textContent = name
            div.classList.add(`prop`)
            div.onclick = ()=>{callback()}
            this.dom.output.append(div)
        },
        add({address, domObj, arguements, name}){
            const library = Instance.library
            const f = library.find(address)
            const btn = this.navbtnui(f.name, ()=>{
                //CHECK EACH FILE
                this.dom.output.innerHTML = ``

                for(let x in f.object){
                    if(x === `meta`)continue
                    const name = x
                    const object = f.object[x]
                    this.propertiesUI(x, ()=>{
                        this.dom.output.innerHTML = ``
                        //THE DOM FACTORY FUNCTION U SPECIFED IS CALLED HERE
                        const arg = arguements({name, object}) //MUST RETURN AN OBJECT ARGUMENTS
                        Assets.domObj = domObj({...arg, to: this.dom.output})
                    })
                }
                Assets.selectedAsset =  name
            })
            return btn
            //THE ARRAY SHOULD LOOK LIKE {collision: {address:`libs/collision`, dom: CollisionDomFactory}}
            
        }
    }
    res.load()
    return res
}