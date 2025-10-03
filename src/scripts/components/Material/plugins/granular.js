import { domextract } from "../../DRAW/domextract"
import { GenerateId } from "../../../functions.js/DRAW/generateId"
import { MaterialOptions } from "../options"
import { feedback } from "../../DRAW/feedback"

export function Granular(){
    const res= {
        name: 'Granular',
        style(){return`width: 100%;height: 100%;background: #070011;`},
        togglestyle(){return `width: .5rem;height: .5rem;outline: 2px solid grey;background: #7e779e;position: absolute;left: 0.5rem;top: .5rem;border-radius: 50%;outline-offset: .1rem;`},
        inputstyle(){return`width: 50%;color: #fff;background: #ffffff21;border: 1px solid #ffffff21;border-radius: .5rem;margin-left: .5rem;padding: .1rem;`},
        groupsstyle(){return `gap: .4rem;width: 100%;height: 15%;padding: .3rem .5rem;background: #000;display: flex;justify-content: flex-start;align-items: center;overflow: scroll hidden;`},
        canvaswrapstyle(){return `position: relative; height: 85%;border: 1px solid #fff;border-radius: .5rem;display: flex;justify-content: space-between;align-items: center;`},
        optionswrapstyle(){return `gap: .5rem;flex-direction: column;width: 30%;display: flex;height: 100%;border: 1px solid #ffffff2b;border-radius: .5rem;justify-content: space-between;align-items: center;gap: .5rem;overflow: hidden scroll;`},
        optionswraptitlestyle(){return `z-index: 1,color: #fff;left: 0;position: absolute;padding: .3rem;top: 0;backdrop-filter: blur(7px);border-radius: .2rem;display: flex;font-size: .5rem;text-transform: capitalize;`},
        optionsstyle(){return ``},
        vwrapstyle(){return `width: 100%;height: 3rem;background: #8a77ad2e;border-radius: .5rem;display: flex;justify-content: space-between;font-size: .7rem;position: relative;align-items: center;color: #fff;padding: 0 0 0 .5rem;`},
        vstyle(){return `width: 50%;padding: .5rem;height: 100%;color: #fff;font-size: .7rem; background: #ffffff24;border: none;`},
        groupstyle(){return `color: #fff;background: #ffffff1f;padding: .3rem .5rem;font-size: .7rem;border-radius: 1rem;`},
        canvasstyle(){return `width: 70%;height: 100%;border-radius: .5rem;border: 1px solid #ffffff21`},
        triggerstyle(){return `position: absolute;top: .5rem;right: .5rem;width: 1rem;cursor: pointer;height: 1rem;border-radius: 50%;background: #fff;opacity: .5;`},
        optionsId: GenerateId() + `Options`,
        groups: [],
        getThumbnailImage(){ //important
            const image = new Image()
            image.src = '../assets/images/granular.jpg'
            return image
        },
        remove(){//important
            this.element.remove()
        },
        updateVars({to, GranularObject, inputstyle,Material}){
           to.innerHTML = ``
           SpriteManObject.variablesOfInterest.forEach((v)=>{
                const input = this.getinputdom({inputstyle, v ,to,})
                input.onmousedown = (e)=>{
                    if(e.buttons === 2)
                    Material.optionsHandler.find('globalvariablesoption').show(e)
                }
                input.oninput  = (e)=>{
                    if(v.parseinput() === `number` || v.parseinput() === `string`)
                    v.set(e.target.value)
                }
                input.onchange  = (e)=>{
                    if(v.parseinput() === `checkbox`)
                    v.set(e.target.checked)
                }

          })
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
        getinputdom({v, to}){
            const div = document.createElement(`div`)
            div.textContent = v.prop
            div.setAttribute(`style`, `display: flex; justify-content: center; align-items: center; font-size: .6rem;`)
            const input = document.createElement(`input`)
            input.placeholder = v.prop
            input.value = v.get()
            input.type = v.parseinput()
            input.setAttribute(`style`, this.inputstyle())
            div.append(input)
            to.append(div)  

            return input
        },
        ui(to, GranularObject, Material, Layout, Layers, Layer, Tile){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div class='groups xscroll' style='${this.groupsstyle()}'></div>
            <div class='wrap' style='${this.canvaswrapstyle()}'>
                <div class ='options yscroll' style='${this.optionswrapstyle()}'>
                    <div class='title' style='${this.optionswraptitlestyle()}'></div>
                </div>
                <canvas class='canvas' style='${this.canvasstyle()}'></canvas>
                <div class='trigger' style='${this.triggerstyle()}'></div>

            </div>
            `
            to.append(this.element)
            domextract(this.element, 'classname',this)
            this.setTogglebtn(GranularObject)
            this.updateToggle(GranularObject)

            this.setupcanvas()
            this.events(Tile, GranularObject)
            return this
        },
        events(Tile, GranularObject){
            this.dom.canvas.onmousedown = (e)=>{
                if(e.button !== 2)return
                MaterialOptions()
                .set(e, document.body)
                .add(`add`, ()=>{
                    feedback({message: ``, callback:(e)=>{
                        const obj = GranularObject.addGroup(e.target.value)
                    }})
                })
            }
            this.dom.trigger.onclick = ()=>{
                GranularObject.currentgroup.generate()
            }
        },
        updateGroups(GranularObject){
            this.dom.groups.innerHTML  = ``
            this.groups = []
            GranularObject.groups.forEach(g=>{
                const div = document.createElement(`div`)
                div.setAttribute(`style`, this.groupstyle())
                div.textContent = `${g.name}`
                div.onmousedown = (e)=>{
                    if(e.button === 2){
                        MaterialOptions()
                        .set(e, document.body)
                        .add('delete', ()=>{
                            g.remove()
                            this.updateGroups(GranularObject)
                            this.dom.options.innerHTML = ``
                        })
                    }
                    else {
                        GranularObject.currentgroup = g
                        this.updateoptions(GranularObject)
                    }
                }
                this.dom.groups.append(div)

                this.groups.push(Group(g))
            })
        },
        updateoptions(GranularObject){
            const g = GranularObject.currentgroup
            this.dom.title.textContent = g.name
            this.dom.options.innerHTML = `
                    <div class='title' style='${this.optionswraptitlestyle()}'>${g.name}</div>
            `
            for(let x in g.vars){
                this.addvar(g, g.vars, x)
            }
        },
        addvar(Group, obj, name){
            const div = document.createElement(`div`)
            div.setAttribute(`style`, this.vwrapstyle())
            div.innerHTML = `
                ${name}
                <input 
                    class='input' 
                    style='${this.vstyle()}'  
                    value = '${obj[name]}' 
                    type='${(name.startsWith(`color`))?'color':(name.startsWith(`set`))?'checkbox':'number'}' 
                    step = '10'
                />
            `
            this.dom.options.append(div)
            const dom = domextract(div).object
            dom.input.oninput = (e) =>{
                obj[name] = +(e.target.value)
                this.updateRatio(Group)
                if(!name.startsWith(`color`))Group.populate()
            }
            dom.input.onchange = (e) =>{
                if(name.startsWith(`set`))
                obj[name] = e.target.checked
            }
        },
        updateRatio(Group){
            //get ratio from this dim
            const ratio = {
                x: this.w / Group.vars.x,
                y: this.h / Group.vars.y,
                w: (this.w - Group.vars.w) / Group.vars.w,
                h: this.h / Group.vars.h,
            } 
            //use to get dim from Tile dim
            Group.ratio= ratio
        },
        setupcanvas(){
            this.canvas = this.dom.canvas
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
            this.ctx = this.canvas.getContext(`2d`)
            this.clear = ()=>this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.w = 50
            this.h = 50
            this.x = this.canvas.width / 2 - (this.w /2)
            this.y = this.canvas.height / 2 - (this.h /2)
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
        update(props){
            this.clear()
            this.ctx.fillStyle = `red`
            this.ctx.fillRect(this.x, this.y, this.w, this.h)
            this.groups.forEach(g=>g.update({ctx: this.ctx}))
        }
    }

    return res
}


function Group(g){
    const res = {
        load(){},
        draw({ctx}){
            ctx.globalAlpha = 0.4
            ctx.fillStyle = g.color
            ctx.fillRect(g.vars.x, g.vars.y, g.vars.w, g.vars.h)
            ctx.globalAlpha = 1
        },
        update(props){
            this.draw(props)
        }
    }
    res.load()
    return res
}