import { domextract } from "../../DRAW/domextract"
import { feedback } from "../../DRAW/feedback"

export function SpriteMan(){
    const res= {
        name: `SpriteMan`,
        style(){return `color: #fff; position: relative;width: 100%;height: 100%;background: linear-gradient(180deg, #060841 10%, #0f012d 80%);`},
        label1style(){return`gap: .5rem;position: absolute;top: 17%;left: 2%;height: 5rem;display: flex;flex-direction: column;overflow: hidden scroll;width: 93px;`},
        label2style(){return`left: 2%;position: absolute;top: 27%;`},
        label3style(){return`top: 38%;left: 2%;position: absolute;`},
        canvasstyle(){return`width: 40%;height: 40%;background: #05011b;position: absolute;top: 10%;border-radius: .5rem;left: 57%;border: 1px solid #ffffff3d;`},
        clipscontentstyle(){return`width: 100%;height: 100%;background: #ffffff05;margin-top: .2rem;border-radius: .5rem;border: 1px solid #ffffff26;padding: .3rem;display: flex;overflow: scroll hidden;gap: .5rem;justify-content: flex-start;align-items: center;`},
        titlestyle(){return`position: absolute;top: 4%;left: 4%;color: #fff;`},
        inputstyle(){return`width: 50%;color: #fff;background: #ffffff21;border: 1px solid #ffffff21;border-radius: .5rem;margin-left: .5rem;padding: .1rem;`},
        addstyle(){return`background: #ffffff1a;border-radius: .5rem;color: #fff;border: 2px solid #fff;padding: .2rem .3rem;cursor: pointer;`},
        addclipstyle(){return`z-index: 10;top: 17%;left: 25%;width: 30%;position: absolute;`},
        clipstyle(){return` flex-direction: column;gap: .2rem; cursor:pointer;width: 20%;height: 100%;border-radius: .5rem;border: 1px solid #ffffff3b;background: #ffffff17;display: flex;justify-content: flex-start;align-items: flex-start;position: relative;margin-right: .5rem;padding: .1rem;`},
        clipdeletestyle(){return `z-index: 1; backdrop-filter: blur(5px);width: 20%;height: 20%;position: absolute;border-radius: .5rem;background: #ffffff17;display: flex;justify-content: center;align-items: center;top: 3%;margin-right: .5rem;right: -7%;`},
        cliptxtwrap(){return` backdrop-filter: blur(5px);width: 100%;height: 20%;border-radius: .5rem;padding: 2px;font-size: 0.5rem;background: #ffffff17;display: flex;justify-content: flex-start;align-items: center;margin-right: .5rem;`},
        cliphead(){return `backdrop-filter: blur(5px);width: fit-content;padding: 0 3px;height: 100%;color: #000;border-radius: .5rem;background: #ffffff17;display: flex;justify-content: center;align-items: center;margin-right: .5rem;`},
        togglestyle(){return `width: .5rem;height: .5rem;outline: 2px solid grey;background: #7e779e;position: absolute;left: 0.5rem;top: .5rem;border-radius: 50%;outline-offset: .1rem;`},
        getThumbnailImage(){ //important
            const image = new Image()
            image.src = '../assets/images/spritemantemp.png'
            return image
        }, 
        remove(){//important
            this.element.remove()
        },
        ui(to,SpriteManObject, Material, Layout, Tile){ //important
            this.element = document.createElement(`div`)
            this.element.classList.add(`SPRITEMAN`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div class='title' style='${this.titlestyle()}'>SpriteMAN</div>
            <div class='vars yscroll' style='${this.label1style()}'></div>
            <canvas class='canvas' style='${this.canvasstyle()}'></canvas>
            
            <div class='addclip' style='${this.addclipstyle()}'>from
            <input class='from' value='0' type='number' style='${this.inputstyle()} width: 50%;' /> to
            <input class='to' value='0' type='number'  style='${this.inputstyle()} width: 50%;' /> loop
            <input class='loop' type='checkbox'  style='${this.inputstyle()} width: 50%;' />
            <button class='addbtn' style='${this.addstyle()}'>add</button>
            </div>
            
            <div class='clips' style='position: absolute;top: 54%;left: 2%; width: 96%;height: 33%;'>
            <div style=''>Clips</div>
            <div class='clipscontent xscroll' style='${this.clipscontentstyle()}'></div>
            </div>
            `
            to.append(this.element)
            domextract(this.element, 'classname', this)           
            this.updateVars({to: this.dom.vars, SpriteManObject, inputstyle: this.inputstyle(), Material})
            domextract(this.element, 'classname', this)           
            this.canvas = this.dom.canvas
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
            this.ctx = this.canvas.getContext(`2d`)
            this.events(SpriteManObject, Tile)
            this.updateclipsdom(SpriteManObject)
            
            this.setTogglebtn(SpriteManObject)
            this.updateToggle(SpriteManObject)
            return this
        },
        setTogglebtn(obj){
            if(this.togglebtn)this.togglebtn.remove()
            this.togglebtn = document.createElement(`div`)
            this.togglebtn.setAttribute(`style`, this.togglestyle())
            const setbtncolor = ()=>this.togglebtn.style.background = (obj.toggle)?'#432aaa':'#2c2938'
            setbtncolor()
            this.togglebtn.onclick = ()=>{
                obj.toggle = (obj.toggle)?false:true
                this.updateToggle(obj)
                setbtncolor()
            }
            this.element.append(this.togglebtn)
        },
        updateToggle(obj){
            if(!obj.toggle){
                if(this.togglediv)this.togglediv.remove()
                this.togglediv = document.createElement(`div`)
                this.togglediv.setAttribute(`style`, `z-index: 20; opacity: 0.4;width: 100%; height: 100%; position: absolute; top: 0; left: 0; background: #000`)
                this.togglediv.ondblclick = ()=>{
                    obj.toggle = true
                    this.setTogglebtn(obj)
                    this.updateToggle(obj)
                }
                this.element.append(this.togglediv)
            }else{
                this?.togglediv?.remove()
            }
        },
        updateVars({to, SpriteManObject, inputstyle,Material}){
           to.innerHTML = ``
           SpriteManObject.variablesOfInterest.forEach((v)=>{
                const input = this.getinputdom({inputstyle, v ,to,})
                input.value = v.get()
                input.checked = v.get()
                input.onmousedown = (e)=>{
                    if(e.buttons === 2)
                    Material.optionsHandler.find('globalvariablesoption').show(e)
                }
                input.oninput  = (e)=>{
                    if(v.parseinput() === `number` || v.parseinput() === `string`)
                    v.set(e.target.value)
                }
                input.onchange  = (e)=>{
                    if(v.parseinput() === `checkbox`){
                        v.set(e.target.checked) 
                    }
                }

          })
        },
        getinputdom({v, to}){
            const div = document.createElement(`div`)
            div.textContent = v.prop
            div.setAttribute(`style`, `display: flex; justify-content: center; align-items: center; font-size: .6rem;`)
            const input = document.createElement(`input`)
            input.placeholder = v.prop
            input.type = v.parseinput()
            input.setAttribute(`style`, this.inputstyle())
            div.append(input)
            to.append(div)  

            return input
        },
        getClipDom({name, from, to, shouldloop, framedelay}){
            console.log({name, from, to, shouldloop, framedelay},` clip`)
            const div = document.createElement(`div`)
            div.classList.add(`clip`)
            div.innerHTML += `
            <div class='delete' style='${this.clipdeletestyle()}'></div>
            <div class='name' style='${this.cliptxtwrap()}'>
            <div class='nametitle' style='${this.cliphead()}'>name</div>${name}
            </div>
            <div class='frame' style='${this.cliptxtwrap()}'>
            <div class='frametitle' style='${this.cliphead()}'>frame</div>${from} - ${to}
            </div>
            <div class='loop' style='${this.cliptxtwrap()}'>
            <div class='looptitle' style='${this.cliphead()}'>loop</div>${shouldloop}
            </div>
            <div class='fps' style='${this.cliptxtwrap()}'>
            <div class='fpstitle' style='${this.cliphead()}'>fps</div>${framedelay}
            </div>
            `
            this.dom.clipscontent.append(div)
            div.setAttribute(`style`, this.clipstyle())
            return div
        },
        clearCtx(){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.imageSmoothingEnabled = false
        },
        events(SpriteManObject, Tile){
            this.dom.from.oninput = (e)=>{SpriteManObject.clip(+(e.target.value), +(this.dom.to.value))}
            this.dom.to.oninput = (e)=>{SpriteManObject.clip(+(this.dom.from.value), +(e.target.value))}
            this.dom.addbtn.onclick = (e)=>{
                const from = (+(this.dom.from.value) > 0)? +(this.dom.from.value) : 0
                const to = (+(this.dom.to.value) > 0)? +(this.dom.to.value) : 0
                feedback({message: `enter clip name`, callback:(e)=>{
                    const name= e.target.value
                    console.log(SpriteManObject)
                    const clip= SpriteManObject.addClip({name, from, to})

                    if(SpriteManObject.loop)clip.loop()
                    clip.delay(+(SpriteManObject.framedelay))
                    // this.dom.from.value = ``
                    // this.dom.to.value = ``
                    this.updateclipsdom(SpriteManObject, Tile)
                }})
            }
        },
        updateclipsdom(SpriteManObject, Tile){
            this.dom.clipscontent.innerHTML = ``
            SpriteManObject.clips.forEach(clip=>{
                const div = this.getClipDom(clip)
                const dom = domextract(div).object
                dom.delete.onclick = ()=>{
                    SpriteManObject.clips.splice(SpriteManObject.clips.indexOf(clip), 1)
                    SpriteManObject.framedelay = clip.framedelay
                    SpriteManObject.loop = clip.shouldloop
                    this.updateclipsdom(SpriteManObject)
                }
                div.onclick = ()=>{
                    SpriteManObject.playclip(clip.name)
                    console.log(`playclip`, clip.name)
                }
            })
        },
        load(){}
    }
    res.load()
    return res
}