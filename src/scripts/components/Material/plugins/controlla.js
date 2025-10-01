import { domextract } from "../../DRAW/domextract"

export function Controlla(){
    const res= {
        name: 'controlla',
        leftstyle(){return` width: 70%;height: 100%;color: #000;position: relative;overflow: hidde`},
        imgstyle(){return` width: 100%;height: 100%;`},
        keypressstyle(){return` position: absolute;top: .1rem;text-transform: capitalize;font-size: .7rem;left: .4rem;color: #527734;border-radius: .3em;padding: .2rem;background: #e1d9d970;`},
        padtypestyle(){return` position: absolute;bottom: .1rem;text-transform: capitalize;font-size: .7rem;left: .4rem;color: #527734;border-radius: .3em;padding: .2rem;background: #e1d9d970;`},
        connectedstyle(){return` position: absolute;top: .1rem;text-transform: capitalize;font-size: .7rem;right: .4rem;color: #527734;`},
        titlestyle(){return`font-size: .7rem;`},
        dropstyle(){return``},
        keypresssectiontitlestyle(){return`font-size: .7rem`},
        keypresssectionstyle(){return``},
        keypresssectioncontentstyle(){return`gap: .6rem;overflow:hidden scroll;margin: .4rem 0;border-top: 1px solid #000000;padding: .4rem .2rem;display: flex;flex-direction: column;justify-content: space-between;align-items: center;`},
        rightstyle(){return`width: 30%;height: 100%;padding: .3rem;background: #ffffff;border-left: 1px solid #b2b5b2;color: #000;`},
        style(){return`width: 100%;height: 100%;position: absolute;color: #fff;display: flex;justify-content: space-between;align-items: center;`},
        padstyle(){return`width: 100%;height: fit-content;padding: .4rem;border-radius: .4rem;border: 1px solid #000;position: relative;`},
        padtitlestyle(){return `overflow: hidden;max-width: 6rem;max-height: 1rem;font-size: .7rem;color: #171616;background: #fff;padding: .1rem .2rem;position: absolute;top: -7px;left: 4px;`},
        btnnamestyle(){return`text-transform: capitalize;`},
        btnswrapstyle(){return`margin-top: .5rem;width: 100%;height: fit-content;flex-direction: column;gap: .4rem;overflow:hidden scroll;max-height: 10rem;position: relative;display: flex;justify-content: space-between;align-items: center;`},
        btnpressstyle(){return``},
        padbtnstyle(){return`width: 100%;font-size: .5rem;display: flex;justify-content: space-between;background: #00000029;border-radius: .3rem;padding: .3rem;`},
        indicatorstyle(){return `width: 30px;height: 30px;background: #ff0000;filter: blur(5px);position: absolute;top: 16%;left: 22%;border-radius: 50%;`},
        togglestyle(){return `width: .5rem;height: .5rem;outline: 2px solid grey;background: #7e779e;position: absolute;left: 0.5rem;top: .5rem;border-radius: 50%;outline-offset: .1rem;`},

        getThumbnailImage(){ //important
            const image = new Image()
            image.src = '../assets/images/controlla.jpg'
            return image
        },
        remove(){//important
            this.element.remove()
        },
        ui(to, ControllaObject, Material, Layout, Tile){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div class='left' style='${this.leftstyle()}'>
            <img class ='image' style='${this.imgstyle()}' src='${this.getThumbnailImage().src}' />
            <div class='connected' style='${this.connectedstyle()}'></div>
            <div class='keypress' style='${this.keypressstyle()}'></div>
            <div class='padtype' style='${this.padtypestyle()}'></div>
            <div class='indicator' style='${this.indicatorstyle()}'></div>
            </div>
            <div class='right' style='${this.rightstyle()}'>
            <div class='title' style='${this.titlestyle()}'>options</div>
            <select class='padselect'>
            <option value ='xbox'>Xbox</option>
            <option value ='ps4'>Ps4</option>
            <option value ='psp'>PsP</option>
            </select>
            <div class='keypresssection' style='${this.keypresssectionstyle()}'>
            <div class='keytitle' style='${this.keypresssectiontitlestyle()}'>Keypresses</div>
            <div class='keycontent yscroll' style='${this.keypresssectioncontentstyle()}'></div>
            </div>
            </div>
            `
            to.append(this.element)
            domextract(this.element, 'classname',this)

            this.disconnected()
            this.setTogglebtn(ControllaObject)
            this.updateToggle(ControllaObject)
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
        updatePads(obj){
            this.dom.keycontent.innerHTML = ``
            obj?.pads?.forEach(pad=>{
                const div = document.createElement(`div`)
                div.setAttribute(`style`, this.padstyle())
                div.innerHTML += `
                <div class='title' style='${this.padtitlestyle()}'>${pad.id}</div>
                <div class='btns' style='${this.btnswrapstyle()}'></div>
                `
                const dom= domextract(div).object
                pad.buttons.forEach((button, x)=>{
                    const btn  = document.createElement(`div`)
                    btn.setAttribute(`style`, this.padbtnstyle())
                    btn.classList.add(`yscroll`)
                    btn.innerHTML  += `
                    <div class='btnname' style='${this.btnnamestyle()}'>button ${x}</div>
                    <div class='btnpress' style='${this.btnpressstyle()}'>${button.pressed}</div>
                    `
                    dom.btns.append(btn)
                })
                this.dom.keycontent.append(div)
            })
        },
        setIndicatorPos({x, y}){
            this.dom.indicator.style.top = y
            this.dom.indicator.style.left = x
        },
        updateName(obj){
            let name = ``
            obj.pads.forEach((pad, x)=>{
                if(x > 0) name += ` / `
                name += `${pad.id}`
            })
            this.dom.padtype.textContent = name
        },
        setButtonPressed(text){
            this.dom.keypress.textContent = text
        },
        connected(){
            this.dom.connected.textContent = `connected`
            this.dom.connected.style.color = `green`
        },
        disconnected(){
            this.dom.connected.textContent = `disconnected`
            this.dom.connected.style.color = `red`

        }
    }

    return res
}