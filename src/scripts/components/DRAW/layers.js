import { downloadLayer } from "../../functions.js/DRAW/downloadLayer.js"
import { EventHandler } from "../../functions.js/DRAW/events.js"
import { draw } from "../../functions.js/DRAW/instances.js"
import { Layer } from "../../functions.js/DRAW/layer.js"
import { domextract } from "./domextract.js"
import { Dropdown } from "./dropdown.js"
import { feedback } from "./feedback.js"

export function LayersDom(to,){
    let toggle = -1
    let no = 0
    const res = {
        style(){return `width: 100%; color: white;background: #48092f;padding: 1rem;border-radius: 5px; margin-top:.5rem;`},
        layerstyle(){return `outline-offset: -6px;opacity: 0.5;margin-bottom: .5rem;width: 100%;height: 2rem;border-radius: .3rem;border: 2px solid #e91e63;display: flex;justify-content: space-between;align-items: center;padding: .5rem;color: pink;`},
        eyestyle(){return ` width: .7rem;height: .7rem;border-radius: 50%;border: 2px solid #ec1860;; transition: .3s ease`},
        addstyle(){return ` padding: .5rem 0; border-radius: 5px;border: 2px solid #500a34;margin: 1rem 0;background: #3a0726;color: #fff;width: 100%; margin: .5rem 0; background: #48092f; display: flex; justify-content:center; align-items: center;`},
        ui(){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.classList.add(`layers`)
            this.element.innerHTML += `
            <div class='title'>Sprite Layers</div>
            <div class='layerssection yscroll' style='margin-top: .5rem; overflow: hidden scroll;max-height: 13rem'></div>
            <div class='add' style='${this.addstyle()}'> + add</div>
            `
            to.append(this.element)
            domextract(this.element, `classname`, this)
        },
        
        events(){
            
            EventHandler(this.dom.add, ``, `click`, ()=>{
                draw.instance.layers.selected = []
                draw.instance.layers.add()
                
            })
        },
        layerui(name, callback, eyecallback){
            const layer = document.createElement(`div`)
            layer.setAttribute(`style`, this.layerstyle())
            layer.onmousedown = ()=>{callback()}
            layer.ontouchstart = ()=>{callback()}
            this.dom.layerssection.append(layer)

            const title = document.createElement(`div`)
            title.classList.add(`title`)
            title.textContent = name
            layer.append(title)

            const eye = document.createElement(`div`)
            eye.classList.add(`eye`)
            eye.setAttribute(`style`, this.eyestyle())
            eye.toggle = -1
            eye.style.background = `#ec1860`
            eye.open = function(){
                eye.style.background = `#ec1860`
                eyecallback({...eye, open: true})
                eye.toggle = -1
            }
            eye.close = function(){
                eye.style.background = `transparent`
                eyecallback({...eye, open: false})
                eye.toggle = 1
            }

            eye.onclick = (e)=>{
                this.handleEye(e, eyecallback)
            }
            layer.append(eye)

            return {layer, title, eye}
        },
        handleEye(e, callback){
            let toggle = e.target.toggle
            if(toggle < 0){
                e.target.close()
            }else if(toggle > 0){
                e.target.open()
            }
        },
        add({name, callback, id, eyecallback}){
            
            const {layer, title, eye} = this.layerui(name, callback, eyecallback)            

            // domextract(layer, `classname`, this)

            this.setDrop(layer, name, id, eye)
            return {layer, eye}
        },
        setDrop(layer, name, id, eye){
            const drop = Dropdown({target: layer,})
            this.drop = drop
            drop.add('solo', ()=>{
                const array = draw.instance.library.find(`spriteLayer`).object.meta.array
                array.map(e=>{
                    e.show = false
                    e.solo = false
                    e.dom.eye.close()
                })
                array.map(e=>{
                    if (e.id === id){
                        e.dom.eye.open()
                        e.show = true
                        e.solo = true
                    }
                })
            })
            drop.add('merge', ()=>{
                if(draw.instance.layers.selected.length < 2)return
                no ++
                //get all sprites in an array
                let allSprites = []
                draw.instance.layers.selected.forEach(layer=>{
                    allSprites.push(layer.array)
                })
                draw.instance.layers.selected.forEach(layer=>{
                    const array = draw.instance.library.find(`spriteLayer`).object.meta.array
                    array.forEach((e, x)=>{
                        if(e.name === layer.name){
                            array.splice(x, 1)
                        }
                    })
                })
                allSprites = allSprites.flat() // flatten it
                // state names and layer object
                const foldername = `spriteLayer`
                const filename = `merge (${no})`
                const layersObj = Layer(draw.instance.layers, draw.instance)
                layersObj.name = filename
                layersObj.array = allSprites
                //clear selected
                draw.instance.layers.selected = []
                //update dom
                draw.instance.layers.updateDom()
                
            })
            drop.add('delete', ()=>{
                const array = draw.instance.library.find(`spriteLayer`).object.meta.array
                array.forEach((e,x)=>{
                    if(e.name === name)
                    array.splice(x,1)
                })
                //delete from layers as well
                 //clear selected
                draw.instance.layers.selected = []
                draw.instance.layers.updateDom()
            })
            drop.add('moveup', ()=>{
                 //clear selected
                const array = draw.instance.library.find(`spriteLayer`).object.meta.array
                const layer = array.filter(e=>e.name === name)[0]
                if(!layer)return
                const index = array.indexOf(layer)
                const prevIndex = index - 1
                if(prevIndex < 0)return
                const temp = array[prevIndex]
                array[prevIndex] = array[index]
                array[index] = temp
                draw.instance.layers.updateDom()
            })
            drop.add('movedown', ()=>{
                  //clear selected
                const array = draw.instance.library.find(`spriteLayer`).object.meta.array
                const layer = array.filter(e=>e.name === name)[0]
                if(!layer)return
                const index = array.indexOf(layer)
                const nextIndex = index + 1
                if(nextIndex > array.length -1 )return
                const temp = array[nextIndex]
                array[nextIndex] = array[index]
                array[index] = temp
                draw.instance.layers.updateDom()
            })
            drop.add('rename', ()=>{
                 //clear selected
                const array = draw.instance.library.find(`spriteLayer`).object.meta.array
                const filter = array.filter(e=>e.name === name)[0]
                if(filter)
                feedback({message: `rename to: `, placeholder:'name', callback:(e)=>{
                    filter.name = e.target.value
                    draw.instance.layers.updateDom()
                }})
            })
            drop.add('duplicate', ()=>{
                const array = draw.instance.library.find(`spriteLayer`).object.meta.array
                const filter = array.filter(e=>e.name === name)[0]
                if(!filter)return
                const duplicate = {...filter}
                array.push(duplicate)
                draw.instance.layers.updateDom()
            })
            drop.add('download (.png)', ()=>{
                 //clear selected
                draw.instance.layers.selected = []  
                const download = downloadLayer(name).download()
            })
            drop.add('opacity', ()=>{})
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