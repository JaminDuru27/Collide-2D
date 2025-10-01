import { AABBCollision } from "../../functions.js/DRAW/AABBCollision.js"
import { EventHandler, events } from "../../functions.js/DRAW/events.js"
import { GenerateId } from "../../functions.js/DRAW/generateId.js"
import { Instance } from "../../functions.js/DRAW/instance.js"
import { draw } from "../../functions.js/DRAW/instances.js"
import { Layer } from "../../functions.js/DRAW/layer.js"
import { PopupDescription } from "../../functions.js/DRAW/popupdescription.js"
import { Sprite } from "../../functions.js/DRAW/sprite.js"
import { UpdateInstanceFromData } from "../../functions.js/DRAW/updateInstanceFromData.js"
import { domextract } from "./domextract.js"
import { feedback } from "./feedback.js"
let laste
export function Load(){
    const res = { 
        style(){return `background: black;z-index: 5; position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;`},
        topStyle(){return `height: 20vh; backround: transparent; font-size: 2rem;color: white; padding: 4rem 0 0 2rem`},
        sideStyle(){return`width: 50%; height: 100%; display: flex; overflow: hidden scroll;`},
        bottomStyle(){return `display: flex;padding: 4rem;height: 80vh; width: 100%; border-top: 2px solid grey; border-radius: 10px 10px 0 0`},
        exitstyle(){return `position: absolute; top: .5rem; left: .5rem;width: 2vw;height: 2vw;opacity: .5;`},
        cardStyle(){return `flex-shrink: 0;position:relative;max-height: 30vh; width: 17rem;  flex-direction: column;cursor:pointer;padding: 0 0 0 2rem;font-size: 2rem;justify-content: flex-start;height: fit-content; display:flex; border-radius: 5px; margin-bottom: 2rem`},
        titleStyle(){return `color: #fff;font-size: 1rem;margin-botto m: .5rem;border-left: 2px solid #ffffff4f;display: flex;justify-content: flex-start;align-items: center;padding: .2rem 0 0 .8rem;background: #ffffff12;border-radius: .3rem;`},
        imagestyle(){return `position: relative;width: 100%; height: 10rem; border: 2px solid #fff; border-radius: .5rem; background-color: #ffffff1a;`},
        optionsStyle(){return`opacity: 0;transform:translateY(-50%);display: flex; flex-direction: column; gap: .2rem; width: 2rem; position: absolute; top: 50%; left: 1rem;backdrop-filter: blur(3px); border-radius: 1rem;`},
        btnstyle(){return`margin-bottom: .2rem;font-size: 1rem;width: 1.8rem; height: 1.8rem; border-radius: 50%; flex-shrink: 1; border:1px solid grey; background-color: #00000052; backdrop-filter: blur(4px);`},
        bgimgstyle(){return `background-size: 80%; background-repeat: no-repeat; background-position: center;`},
        ui(){
            laste?.remove()
            this.element = document.createElement(`div`)
            laste = this
            this.element.classList.add(`instances`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div class='exit' style='${this.exitstyle()}'></div>
            <div class='top' style='${this.topStyle()}'>Load</div>
            <div class='bottom' style='${this.bottomStyle()}'>
            <div class='left yscroll' style='${this.sideStyle()} flex-wrap:wrap;'></div>
            <div class='right yscroll' style='${this.sideStyle()}'></div>
            </div>
            `
            document.body.append(this.element)
            domextract(this.element, `classname`, this)
        },
        events(){
            domextract(this.element, 'classname', this)
            this.dom.exit.onclick = ()=>{
                this.element.remove()
            }
            const string = localStorage.getItem('CollideData')
            if(!string)return
            const collidedata = JSON.parse(string)

            draw.array = []
            draw.instance = undefined
            collidedata.forEach((inst)=>{
                const {extract, div} = this.instui(inst)
                this.popupdescr = PopupDescription()
                this.instevents(extract, inst, div)
                this.optionsEvents(div,extract.object, inst)
            })
        },
        updateInstFromData(inst, datainst){
            // fetch('/api/endpoint',{
            //     method: 'POST',
            //     headers:{
            //         "Content-Type": 'application/json'
            //     },
            //     body: JSON.stringify(datainst)
            // })
            // .then(response => response.json())
            // .then(data=> console.log(data))
            // .catch(error=> console.error(error))
            UpdateInstanceFromData(inst, datainst).all()
        },
        parseAndAddInstanceToDraw(datainst){
            const inst = Instance(datainst.name)
            inst.setupLibraryMainFolders()
            draw.array.push(inst)
            this.updateInstFromData(inst, datainst)
            return {instance: inst}
        },
        instevents(extract, inst, div){
            EventHandler(extract.object.img, 'loaditem', 'click', ()=>{
                const {instance} = this.parseAndAddInstanceToDraw(inst)
                draw.instance = instance
                draw.open(instance)
                this.element.remove()
            })
            EventHandler(div, 'loaditem', 'mouseenter', ()=>{
                extract.object.options.style.opacity = `1`
            })
            EventHandler(div, 'loaditem', 'mouseleave', ()=>{
                extract.object.options.style.opacity = `0`
            })
        },
        instui(inst){
            const div = document.createElement(`div`)
            div.setAttribute(`style`, this.cardStyle())
            div.innerHTML += `
            <div class='title' style='${this.titleStyle()}'>${inst.name} - Session</div>
            <div class='img' style='${this.imagestyle()} ${this.bgimgstyle()}'>
            </div>
            <div class='options' style='${this.optionsStyle()}'>
                <div popupdescription='delete' popupdirection  = 'right' class='delete loadbtn' style='${this.btnstyle()} ${this.bgimgstyle()} background-image: url(./assets/icons/delete.png)'></div>
                <div popupdescription='duplicate' popupdirection  = 'right' class='duplicate loadbtn' style='${this.btnstyle()} ${this.bgimgstyle()} background-image: url(./assets/icons/copy.png)' ></div>
                <div popupdescription='rename' popupdirection  = 'right' class='rename loadbtn' style='${this.btnstyle()} ${this.bgimgstyle()} background-image: url(./assets/icons/rename.png)'></div>
                <div popupdescription='add to material' popupdirection  = 'right' class='addtomaterial loadbtn' style='${this.btnstyle()} ${this.bgimgstyle()} background-image: url(./assets/icons/add-to-photos.png)'></div>
            </div>
            `
            this.dom.left.append(div)
            const extract = domextract(div)
            extract.object.img.style.backgroundImage = `url(${inst.dataurl})`
            return {div, extract}
        },
        optionsEvents(div,dom, inst){
            function getParsedCollideData(callback){
                const instdataarray = localStorage.getItem('CollideData')
                const array = JSON.parse(instdataarray)
                const index = array.indexOf(array.find(e=>e.id ===inst.id))

                callback(array, index)
                localStorage.setItem('CollideData', JSON.stringify(array))

                return {index, array}
            }
            dom.delete.onclick = ()=>{
                feedback({message:`Are you sure?`, messageType:`warning`, placeholder:'proceed to delete',inputtype: `button`, callback:()=>{
                    draw.array.splice(draw.array.indexOf(inst), 1)
                    const instdataarray = localStorage.getItem('CollideData')
                    getParsedCollideData((array, index)=>{
                        array.splice(index, 1)
                    })
                    this.load()
                }})
                
            }
            dom.duplicate.onclick = ()=>{
                draw.array.push({...inst, name: inst.name + `Copy(${draw.array.length})`})
                getParsedCollideData((array, index)=>{
                    //operation
                    array.push({...array[index], id: GenerateId() + `Instance`})
                })
                this.load()
            }
            dom.rename.onclick = ()=>{
                dom.title.remove()
                const title = document.createElement(`input`)
                title.placeholder = `enter title`
                title.value = dom.title.textContent
                title.setAttribute(`style`, this.titleStyle())
                title.oninput = (e)=>{
                    inst.name = e.target.value
                    getParsedCollideData((array, index)=>{
                        //operation
                        array[index].name = e.target.value
                    })
                    
                    
                }
                title.onchange = (e)=>{
                    feedback({message:`Are you sure?`, messageType:`warning`, placeholder: 'proceed to rename',inputtype:`button`, callback:()=>{
                        if(e.target.value.trim(``) !== ``) dom.title.textContent = e.target.value
                        else feedback({message:`no name`, inputtype:null})
                        title.remove()
                        div.prepend(dom.title)
                    }})
                    
                }
                div.prepend(title)
                title.focus()

            }
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