import { EventHandler } from "../../functions.js/DRAW/events.js"
import { draw } from "../../functions.js/DRAW/instances.js"
import { domextract } from "./domextract.js"
import { Dropdown } from "./dropdown.js"

export function FileFolder(to, name, content, type){
    const res = {
        name,
        style(){return `cursor:pointer;width: 100%;margin: .5rem 0;background-color: #3b0726;border-radius: .3rem;`},
        srcstyle(){return `background-repeat: no-repeat; background-position: center;background-size: contain; width: 1.6rem;height: 1.6rem;border-radius: .5rem;flex-shrink: 0;`},
        titleWrapstyle(){return `text-wrap: nowrap;position:relative;transition: .3s ease;background: transparent; border-radius: .3rem; height: 2.5rem; display:flex;justify-content:flex-start;align-items: center; ${(type === `Folder`)? 'border: 1px dashed #7b0b4e;padding: .3rem 2.5rem;': ''}`},
        titlestyle(){return `color: white;background: #ffffff38;margin-left: 1rem;border-radius: .5em;height: 1.4rem;padding: 0 0.5rem;font-size: .8rem;display: flex;justify-content: center;align-items: center;`},
        contentstyle(){return `width: 95%; position: relative; right: -5%; height: 100%; border-radius: .3rem; `},
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`folder`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML +=`  
            <div class = 'wrap hover ${(type === `Folder`)? 'folderwrap': ''}' style='${this.titleWrapstyle()}'>
                <div class='src' style='${this.srcstyle()}'></div>
                <div class='title' style='${this.titlestyle()}'>${name}</div>
            </div>
            <div class = 'content' style='${this.contentstyle()}'></div>
            `
            to.append(this.element)
            domextract(this.element, `classname`, this)
            this.dropevents()
            this.chooseSrc()
        },
        chooseSrc(){
            const type = content.meta.ContentType
            const style = this.dom.src.style
            if(type === `datafolder`){
                this.dom.src.style['backgroundImage'] = `url(./assets/icons/folder.png)`
            }else if(type === `datafile`){
                this.dom.src.style['backgroundImage'] = `url(./assets/icons/file.png)`
            }
            else if(type === `imagefile`){
                this.dom.src.style['backgroundImage'] = `url(./assets/icons/img.png)`
            }
            else if(type === `collisionfile`){
                this.dom.src.style['backgroundImage'] = `url(./assets/icons/piece.png)`
            }
            else if(type === `layerfile`){
                this.dom.src.style['backgroundImage'] = `url(./assets/icons/layer.png)`
            }
            else if(type === `nodefile`){
                this.dom.src.style['backgroundImage'] = `url(./assets/icons/nodes.png)`
            }
            else if(type === `worldfile`){
                this.dom.src.style['backgroundImage'] = `url(./assets/icons/worlds.png)`
            }
        },
        open(){
            this.dom.wrap.setAttribute(`open`, `true`)
            this.dom.content.setAttribute( `style`, 
            this.contentstyle())
            this.dom.content.style.display = `block`
            this.toggle = 1
        },
        dropevents(name, object, lib, dir = `right`){
            //EVENTS CALLED ON UPPATTING LIB
             if(type === `datafolder`)return
            this.dom.wrap.onclick =()=>{console.log(this)}

            this.drop = Dropdown({target: to, obj: this})
            this.drop.add('delete', ()=>{
                draw.instance.library.delete(this.name)
            })
        },
        close(){
            this.dom.wrap.setAttribute(`open`, `false`)
            this.dom.content.setAttribute( `style`, this.contentstyle())
            this.dom.content.style.display = `none`
            this.toggle = -1
        },
        events(){
            this.toggle = 1
            EventHandler(this.dom.wrap, 'filehidecont', 'click', ()=>{
                this.toggle *= -1
                if(this.toggle > 0){
                    this.open()
                }else if(this.toggle < 0){
                    this.close()
                }
            })
        },
        load(){
            if(content)this.content = content  
            this.ui()
            this.events()
        }
    }
    res.load()
    res.open()
    return res
}
