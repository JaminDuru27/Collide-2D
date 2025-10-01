import { domextract } from "../../DRAW/domextract"
import { GenerateId } from "../../../functions.js/DRAW/generateId"
import { MaterialOptions } from "../options"

export function Animan(){
    const res= {
        name: 'Animan',
        style(){return`background: #131212;width: 100%;height: 100%;position: relative;`},
        canvasstyle(){return`margin-bottom: .4remwidth: 90%;height: 40%;border: 2px solid #ffffff1f;border-radius: .5rem;transform: translateX(-50%);position: relative;left: 50%;top: .3rem;`},
        animationsstyle(){return`position: absolute;z-index: 10;top: 0;right: 0;width: 10rem;height: 100%;backdrop-filter: blur(8px);background: #38373712;padding: .3rem;display: none;justify-content: space-around;align-items: center;flex-direction: column;gap: .4rem;overflow: hidden auto;`},
        headstyle(){return`height: 20%;border-bottom: 1px solid #ffffff30;display: flex;justify-content: center;align-items: center;gap: .9rem;`},
        timesectionstyle(){return`width: 100%;height: 50%;color: #fff;`},
        fpsstyle(){return`width: 2rem;height: 96%;border: 2px solid #ffffff26;background: #ffffff14;color: #fff;padding: .2rem;border-radius: .4rem;`},
        bfstyle(){return`width: .9rem;height: .9rem;background: #ffffff2e;`},
        playstyle(){return`width: .9rem;height: .9rem;background: #ffffff2e;`},
        addstyle(){return`width: 1.2rem;height: 0.9rem;background: #ffffff2e;display: flex;justify-content: center;align-items: center;border-radius: .5rem;cursor: pointer;`},
        bodystyle(){return`height: 80%;position: relative;background: #000;`},
        timesheetstyle(){return`overflow: scroll hidden;padding: 0 .5rem;width: 100%;height: 100%;background: transparent;position: relative;display: flex;justify-content: flex-start;align-items: center;`},
        sidebarbtnstyle(){return`position: absolute;top: .5rem;right: .5rem;width: 1rem;height: 1rem;background: #ffffff52;border-radius: 50%;cursor: pointer;`},
        titlestyle(){return`color: #fff;font-size: .7rem;margin: .7rem .2rem;`},
        contentstyle(){return `flex-direction: column;width: 100%;display: flex;justify-content: space-between;align-items: center;gap: .5rem;`},
        varcontentStyle(){return `flex-shrink:0; padding: .5rem .2rem;background: #ffffff00;border-radius: .4rem;height: 35%;overflow: hidden scroll;`},
        varnamestyle(){return `font-size: .7rem;width: 40%;height: 2rem;border-radius: .5rem;color: #fff;border: 1px solid #ffffff47;padding: .2rem;`},
        varwrapstyle(){return `display: flex;justify-content: space-between;align-items: center;width: 100%;height: fit-content;background: #ffffff1a;margin-bottom: .5rem;padding: .2rem;border-radius: .5rem;`},
        setvarstyled(){return `display: flex;justify-content: space-between;align-items: center;position: sticky;top: 0%;height: fit-content;background: #000000a3;margin-bottom: .5rem;padding: .2rem;border-radius: .5rem;left: 0;backdrop-filter: blur(8px);z-index: 1;`},
        setvarinput(){return ` width: 40%;height: 2rem;border-radius: .5rem;color: #fff;border: 1px solid #ffffff47;padding: .2rem;background: #ffffff21;`},
        astyle(){return `flex-shrink:0;width: 100%;height: 3rem;border: 2px solid #fff;padding: .2rem .3rem;display: flex;justify-content: flex-start;border-radius: .5rem;margin: .3rem 0;align-items: center;opacity: .5;color: #fff;text-transform: capitalize;font-size: 0.6rem;`},
        ss(){return `background: #3a3838;height: 100%;width: .1rem;position: absolute;z-index: 1;top: 0;left: 50px;`},
        ss(){return `background: #3a3838;height: 1rem;width: 1rem;position: absolute;z-index: 1;top: 0;left: 50%;transform: translateX(-50%);`},
        togglestyle(){return `width: .5rem;height: .5rem;outline: 2px solid grey;background: #7e779e;position: absolute;left: 0.5rem;top: .5rem;border-radius: 50%;outline-offset: .1rem;`},
        setstyle(){return`width: 1rem;height: 1.3rem;`},
        optionsId: GenerateId() + `Options`,
        timeslices: [],
        mids: [],
        timemw: 20,
        getThumbnailImage(){ //important
            const image = new Image()
            image.src = '../assets/images/animan.png'
            return image
        },
        remove(){//important
            this.element.remove()
        },
        
        checkTypeForInput(obj, prop){
            let type = typeof obj[prop] 
            let value = obj[prop]
            if(type === `boolean`){type = `checkbox`}
            if(type === `number`)value = +(obj[prop])
            if(type === `function`)type = +(button)
            return {type, value}
        },
        getinputdom({style, oninput, onmouserightclick, id}){
            const input = document.createElement(`input`)
            input.id = id
            input.placeholder = id
            input.setAttribute(`style`, this.inputstyle())
            input.oninput = (e)=>{
                oninput(e)
            }
            input.onmousedown = (e)=>{
                if(e.buttons === 2){
                    onmouserightclick(e)
                }
            }
            return input
        },
        ui(to, AnimanObject, Material, Layout, Layers, Layer, Tile){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <canvas class='preveiw' style='${this.canvasstyle()}'></canvas>
            <div class='animations' style='${this.animationsstyle()}'>
                <div style='${this.titlestyle()}'>Animations</div>
                <div class='anims yscroll' style='${this.contentstyle()} height: 35%; overflow: hidden scroll;'></div>
                
                <div class='vartitle' style='${this.titlestyle()}'>Variables</div>
                <div style='${this.varcontentStyle()}'>
                    <div class='varsec yscroll' style='${this.setvarstyled()}'></div>
                    <div class='vars ' style='${this.contentstyle()}'></div>
                </div>
            </div>
            <div class='sidebarbtn' style='${this.sidebarbtnstyle()}'></div>
            
            <div class='timesection' style='${this.timesectionstyle()}'>
                <div class='head' style='${this.headstyle()}'>
                    <input class='fps' type='number' style='${this.fpsstyle()}'/>
                    <div class='bf' style='${this.bfstyle()}'></div>
                    <div class='play' style='${this.playstyle()}'></div>
                    <div class='add' style='${this.addstyle()}'>+</div>
                </div>
                <div class='body' style='${this.bodystyle()}'>
                    <div class='timesheet xscroll' style='${this.timesheetstyle()}'></div>
                </div>
            </div>
            `
            to.append(this.element)
            domextract(this.element, 'classname',this)
            this.timepin = timepin(this, AnimanObject)
            this.events(AnimanObject, Tile)
            this.setTogglebtn(AnimanObject)
            this.updateToggle(AnimanObject)
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
        events(obj, Tile){
            const setfps = (value)=>{
                obj.fps = value
                this.dom.fps.value = value
            }
            this.dom.fps.oninput = (e)=>{
                setfps(+(e.target.value))
            }
            this.element.ondblclick = ()=>{
                this.dom.animations.style.display = `none`
            }
            this.dom.sidebarbtn.onclick = ()=>{
                this.dom.animations.style.display = `block`
            }
            this.dom.vartitle.onclick = (e)=>{
                Tile.showvariables(e, ({v})=>{
                    this.addvarset(obj, v, Tile)
                })
            }
            this.dom.fps.onmousedown = (e)=>{
                if(e.button !== 2)return
                MaterialOptions()
                .set(e, document.body)
                .add('10', ()=>{setfps(10)})
                .add('50', ()=>{setfps(50)})
                .add('100', ()=>{setfps(100)})
                .add('200', ()=>{setfps(200)})
                .add('300', ()=>{setfps(300)})
                .add('400', ()=>{setfps(400)})
                .add('500', ()=>{setfps(500)})
                .add('1000', ()=>{setfps(1000)})
            }
        },
        addvarset(obj, v, Tile){
            this.dom.varsec.innerHTML = `
            <div class='varname' style='${this.varnamestyle()}'>${v.prop}</div>
            <input  class='input' style='${this.setvarinput()}' type='${v.parseinput()}' />
            <img src='./assets/icons/download.png' class='set' style='${this.setstyle()}' />
            `
            let input  
            const dom = domextract(this.dom.varsec).object
            dom.set.onclick = ()=>{
                this.addtemp(v, (v.parseinput === `checked`)?()=>v.parseoutput(dom.input.checked): ()=>v.parseoutput(dom.input.value), obj)
                this.dom.varsec.innerHTML = ``
            }
            dom.input.onmousedown = (e)=>{
                if(e.button !== 2)return
                Tile.showvariables(e, (props)=>{
                    const vv = props.v
                    option.add(vv.prop, ()=>{
                        this.addtemp(v, ()=>vv.get(), obj, vv.prop)
                        this.dom.varsec.innerHTML = ``
                    })
                })
            }
            return {dom, v, input}
        },
        addtemp(v, getvalue, obj, name){
            const div = document.createElement(`div`)
            div.setAttribute(`style`, this.varwrapstyle ())
            div.innerHTML += `
            <div class='' style='${this.varnamestyle()} font-size: .7rem;'>${v.prop}</div>
            <div class='' style='${this.varnamestyle()} font-size: .7rem;'>${name || getvalue()}</div>
            `
            this.dom.vars.append(div)

            div.onclick = ()=>{
                obj.temp = {...v, getnewvalue: getvalue, initialvalue: v.get()} // temp
            }
        },
        updateAnimations(obj){
            this.dom.anims.innerHTML = ``
            obj.animations.forEach(ani=>{
                const div = document.createElement(`div`)
                div.classList.add(`animation`)
                div.setAttribute(`style`, this.astyle())
                div.textContent = ani.name
                div.onclick = ()=>{
                    obj.animation = ani
                }
                this.dom.anims.append(div)
            })
        },
        updateAnimation(obj){
            this.timeslices.forEach(s=>s.remove())
            this.timeslices = []
            obj?.animation?.slices?.forEach(slice=>{timeslice(this, slice, obj)})
        },
        updateCurrentTimeline(obj){
            this.dom.timesheet.querySelectorAll(`slice`).forEach(time=>time.remove())
        },
        updateSlices(obj){
            this.mids = []
            this.timeslices.forEach(slice=>slice.remove())
            this.timeslices = []
            obj.animation.slices.forEach((slice)=>{
                timeslice(this, slice, obj)
            })
        },
        update(props){
            this.timepin.update(props)
            this.timeslices.forEach(slice=>slice.update())
        }
    }

    return res
}
function timepin(Animan, obj){
    const res = {
        style(){return`background: #9f9f9f;height: 100%;width: .1rem;position: absolute;z-index: 5;top: 0;left: 0;`},
        x: 0,   
        ui(){
            this.element  = document.createElement(`div`)
            this.element.classList.add(`timepin`)
            this.element.setAttribute(`style`, this.style())
            Animan.dom.timesheet.append(this.element)
        },
        load(){
            this.ui()
        },
        update(props){
            if(obj.frameobj){

                this.element.style.left = `${obj.frame * Animan.timemw + 8}px`

            }
       }
    }
    res.load()
    return res
}
function variable (){
    const res = {
        style(){return ``},
        ui(){},
        load(){},
        load(){},
    }
    res.load()
    return res
}
function timeslice(Animan, slice, AnimanObject){
    const res ={
        style(){return `flex-shrink: 0;height: 100%;background: #000000;width: ${Animan.timesw}px;position: relative;display: flex;justify-content: flex-start;align-items: flex-end;border-left: 1px solid #00000000;`},
        headstyle(){return ` position: absolute;top: 0;left: 0;background: #0b0b0bff;font-size: .8rem;width: 100%;height: 28%;`},
        headnumberstyle(){return `padding:.2rem 0; color: rgba(255, 255, 255, 0.52);width: fit-content;position: absolute;top: 0;left: 0;transform: translateX(-50%);background: #0b0b0b;`},
        midstyle(){return `width: ${Animan.timemw}px;height: 76%;background: #f6f5f500;display: flex;align-items: flex-start;justify-content: center;position: relative;border-right: 1px solid #ffffff1f`},
        midnumberstyle(){return`padding: .1rem 0;color: #ffffff56;position: absolute;top: 0;right: 0;transform: translate(50%, -50%);background: #0b0b0b;font-size: .4rem;`},
        framestyle(){return `overflow: hidden;border: 3px solid #000000;width: ${Animan.timemw * 2.5}px;height: 1.2rem;position: absolute;top: 0;left: 0;background: #213601;font-size: .4rem;padding: .3rem;border-radius: .3rem;z-index: 3;`},
        frame: slice.frame,
        mids: [],
        ui(){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.setAttribute(`class`, `slice`)
            this.element.innerHTML += `
            <div class='head' style='${this.headstyle()}'>
                </div>
            </div>
            `
            Animan.dom.timesheet.append(this.element)
        },
        addmid(number, frame){
            const div = document.createElement(`div`)
            div.setAttribute(`style`, this.midstyle())
            div.innerHTML += `<div class='mid' style='${this.midnumberstyle()}'>${number}</div>`
            this.element.append(div)
            this.midevent(div, number, frame)
            this.updateFrameVar(div, frame)
            frame.element  = div
            return {element: div}

        },
        midevent(div, no, frame){
            div.onclick = (e)=>{
                if(AnimanObject.temp){
                    frame.addvar({...AnimanObject.temp, offy: e.offsetY})
                    this.updateFrameVar(div, frame)
                }
            }
        },
        updateFrameVar(par, frame){
            par.querySelectorAll(`.var`).forEach(v=>v.remove())
            frame.vars.forEach(v=>{
                const div = document.createElement(`div`)
                div.setAttribute(`class`, `var`)
                div.setAttribute(`style`, this.framestyle())
                par.append(div)
                div.textContent = `${v.prop} = ${v.varname} - ${v.transition}`
                div.style.top = v.offy + `px`
            })
        },
        calibrate(){
            this.element.querySelectorAll(`.mid`).forEach(mid=>mid.remove())
            slice.frames.forEach(frame=>{
                const mid = this.addmid(frame.number , frame)
            })
        },
        events(){
            this.element.onwheel = (e)=>{
                if(e.deltaY > 0) Animan.timemw ++
                if(e.deltaY < 0)Animan.timemw --
                Animan.updateAnimation(AnimanObject)
                //update all width
            }
        },
        remove(){
            this.element.remove()
            this.mids = []
        },
        load(){
            this.ui()
            this.events()
            this.calibrate()
            Animan.timeslices.push(this)
        },
        update(){

            this.element.style.width = Animan.timesw + `px` // auto update width
        },
    }
    res.load()
    return res
}
