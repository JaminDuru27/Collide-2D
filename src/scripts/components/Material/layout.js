import { EventHandler } from "../../functions.js/DRAW/events"
import { GenerateId } from "../../functions.js/DRAW/generateId"
import { materials } from "../../functions.js/Material/materials"
import { warningscreen } from "../../functions.js/Material/warningscreen"
import { domextract } from "../DRAW/domextract"
import { Menu } from "../DRAW/menu"

export function MaterialLayout({name = `new Project`}){
    const res = {
         w: `23vw`,
        showoffset: 50,
        topMargin: 0,
        off: '-8vw',
        toggle: -1,
        devmodeoffevents: [],
        devmodeonevents: [],
        canvasstyle() { return `width: 100vw; height: calc(100vh - 2rem);position: absolute; bottom: 0; left: 0` },
        fullcanvasstyle(){return `width: 100vw;height: 100vh;position: absolute;bottom: 0;left: 0;z-index: 1;`},
        style() { return `color: white;background: #0d012d;width: 100vw;height: 100vh;position: absolute;top: 0;left: 0;` },
        topbarstyle() { return `padding: 0 .2rem ;display: flex; align-items: center;justify-content:space-between;z-index: 5;top:0;left:0;background:#091742; width: 100vw; height: 2rem; position:absolute;` },
        sidebarwrapstyle() { return `overflow-x: hidden; overflow-y:auto; padding: 3rem .3rem;bottom: 0;background:transparent; width: 100%;height: 100%; position:absolute;` },
        sidebarstyle() { return `z-index: 2;border:1px solid #463076;max-width: 20vw;transition: .3s ease;bottom: 0;background: #0f012d; width: ${this.w}; height: ${100 - this.topMargin}vh; position:absolute;` },
        exitstyle() { return `background-image: url(./assets/icons/home.png); background-size: contain; background-position: center; background-repeat: no-repeat;opacity: .5;width: 2vw;height: 2vw;` },
        settingsstyle() { return `background-image: url(./assets/icons/settings.png); background-size: contain; background-position: center; background-repeat: no-repeat;opacity: .5;width: 2vw;height: 2vw;` },
        repostyle() { return `padding-top:3rem;overflow:hidden;transition: .3s ease;z-index: 9;opacity: 0;border:2px solid; left: -${this.w}; background: black; ` + this.sidebarstyle() },
        showrepostyle() { return `opacity: 0;transition: .3s ease;border-radius: 0 50% 50% 0;z-index:8;position: absolute; left: -5rem; top: 50%; width: 5rem; height: 5rem; background: #31051f` },
        closebarstyle() { return ` width: 3rem;height: 3rem;background: #f5deb326;border-radius: 50%;top: 50%;backdrop-filter: blur(5px);position: absolute;` },
        titlestyle() { return `color: white` },
        contentstyle() { return `margin-top: .5rem;width: 100%;background: #00000030;padding: .5rem;border-radius: .5rem;` },
        sectionstyle() { return `width: 100%;color: white;background: #0f012d;padding: 1rem;border-radius: 5px;` },
        topsectionstyle(){ return` overflow: scroll hidden; width: 18vw;height: 80%;background: #0f012d;border-radius: .6rem;border: 1px solid #463076;`},
        controlsStyle(){return `width: fit-content;height: 2rem;position: absolute;top: 6%;padding: .3rem;display: flex; justify-content: center; align-items: center;z-index: 10;right: 50px;background: #011742;border-radius: .5rem;border: 1px solid #fff;`},
        playStyle(){return `background-repeat: no-repeat;width: 2rem;height: 2rem;background-position: center;background-size: 80%;cursor: pointer;border-radius: 50%;`},
        loadStyle(){return ` display: none;position: absolute;z-index: 10;background: linear-gradient(253deg, black, transparent);right: 0;top: 0;width: 30vw;height: 100%;overflow: hidden;`},
        loadItemStyle(){return`width: 80%;height: 20vh;overflow: hidden;margin: 1rem 0;border: 2px solid #dddddd7f;border-radius: 5px;background-position: center;background-size: cover;position: relative;background-repeat: no-repeat;`},
        loadItemCoverStyle(){return`   position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: flex;justify-content: center;background: radial-gradient(#00000085, transparent);align-items: center;font-size: 2rem;overflow: hidden;color: #ffffff70;`},
        mainuiok() {
            this.element = document.createElement(`div`)
            this.element.classList.add(`layout`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML = `
                <canvas class='canvas' style='${this.canvasstyle()}'></canvas>
                <div class='showrepo' style = '${this.showrepostyle()}'></div>
                <div class='top topbar' style='${this.topbarstyle()}left:0;'>
                
                <div class='exitmat' style='${this.exitstyle()}left:0;'></div>
                <div class='updates xscroll' style = '${this.topsectionstyle()}'></div>
                <div class='name'>${name} - Collision Manager (DRAW)</div>
                <div class='tabs xscroll' style = '${this.topsectionstyle()}'></div>

                <div class='settings'  style='${this.settingsstyle()}left:0;'></div>
                </div>

                <div class='controls' style='${this.controlsStyle()}'>
                    <div class='play' style='${this.playStyle() + 'background-image: url(../assets/icons/play.png)'}'></div>
                    <div class='plugins' style='${this.playStyle() +  'background-image: url(../assets/icons/plug-in.png)'}'></div>
                    <div class='mods' style='${this.playStyle() + 'background-image: url(../assets/icons/modifiers.png)'}'></div>
                    <div class='fullscreen' state ='normal' style='${this.playStyle() + 'background-image: url(../assets/icons/fullscreen.png)'}'></div>
                    <div style='width: .1rem;height: 1rem;border-radius: .5rem;cursor: pointer;background: #ffffff54;'></div>

                    <div class='pluginsfolder' style='${this.playStyle() + 'background-image: url(../assets/icons/pluginsfolder.png)'}'></div>
                    <div class='modsfolder' style='${this.playStyle() + 'background-image: url(../assets/icons/modsfolder.png)'}'></div>
                </div>

                <div class='sideleft' style='${this.sidebarstyle()}left:0;'>
                <div class='leftside yscroll' guibgcolor = '#0f012d' style='${this.sidebarwrapstyle()}'></div>
                <div class='closerepol fadeouthover' style = '${this.closebarstyle()}right: ${this.off};'></div>
                </div>
                <div class='sideright' guibgcolor = '#0f012d' style='${this.sidebarstyle()}right:0;'>
                <div class='rightside yscroll' style='${this.sidebarwrapstyle()}'></div>
                <div class='closerepor fadeouthover' style = '${this.closebarstyle()}left: ${this.off};'></div>            
                </div>
                <div class='repo' style = '${this.repostyle()}'></div>
                <div class='loads' style='${this.loadStyle()}'>
                <div class='loadsTitle' style='color: #ccc; padding:1rem 1.5rem;'>DRAW Layouts</div>
                <div class='loadsContent yscroll' style='overflow: hidden scroll;width: 100%; height: 100%; display: flex; flex-direction: column;align-items: center'></div>
                </div>
                `
            document.body.append(this.element)
            domextract(this.element, `classname`, this)
        },
        addSection(id, name) {
              const to = this.dom[id]
              const element = document.createElement(`div`)
              element.setAttribute(`style`, this.sectionstyle())
              element.innerHTML += `
                    <div class='title' style='${this.titlestyle()}'>${name}</div>
                    <div class='content' style='${this.contentstyle()}'></div>
                    `
              to.append(element)
            
              this.dom[name]  = element
              
              return {
                [name]: element,
                ...domextract(element, 'classname').object
              }
            },
        remove() {
            this.element.remove()
        },
        ondevmodeoff(callback){this.devmodeoffevents.push(callback)},
        ondevmodeon(callback){this.devmodeonevents.push(callback)},
        setToggle(){
            const a ={
                toggle: -1,
                update(){
                    this.toggle *= -1
                }
            }
            return a
        },
        setfullscreen(){
            this.dom.canvas.setAttribute(`style`, this.fullcanvasstyle())
            this.dom.sideleft.style.display = `none`
            this.dom.sideright.style.display = `none`
            this.dom.top.style.display = `none`
            this.dom.fullscreen.style.backgroundImage = `url(../assets/icons/minimize.png)`
            this.dom.fullscreen.setAttribute(`state`, `full`)
            this.fullscreen = true
        },
        setnormalscreen(){
            this.dom.canvas.setAttribute(`style`, this.canvasstyle())
            this.dom.sideleft.style.display = `block`
            this.dom.sideright.style.display = `block`
            this.dom.top.style.display = `flex`
            this.dom.fullscreen.style.backgroundImage = `url(../assets/icons/fullscreen.png)`
            this.dom.fullscreen.setAttribute(`state`, `normal`)
            this.fullscreen = false
        },
        events(){
            let toggle1 = this.setToggle()
            let toggle2 = this.setToggle()
            const update = (toggle, elem, dir)=>{
                if(toggle.toggle > 0){
                    elem.style[`${dir}`] = `-${this.w}`
                    return
                }else{
                    elem.style[`${dir}`] = `0`
                }
            }
            EventHandler(this.dom.closerepor, '', 'click', (e)=>{
                toggle1.update()
                update(toggle1, this.dom.sideright, 'right')
            })
            EventHandler(this.dom.closerepol, '', 'click', (e)=>{
                toggle2.update()
                update(toggle2, this.dom.sideleft, 'left')
            })
            EventHandler(this.dom.exitmat, '', 'click', (e)=>{
                warningscreen('Are You Sure?. Exiting without saving would lost data', ()=>{            
                    materials.material.unload()
                    Menu()
                })
            
            })
            EventHandler(window, '', 'dblclick', (e)=>{
                this.dom.loads.style.display = 'none'
            })
            EventHandler(window, '', 'mousemove', (e)=>{
                if(
                    e.clientX > window.innerWidth - 10 
                ){
                    this.dom.loads.style.display = 'block'
                }
            })
            this.toggle = -1
            this.dom.play.onclick = ()=> {
                this.toggle *=-1
                if(this.toggle > 0){
                    this.devmode= true
                    this.dom.play.style.backgroundImage = `url(./assets/icons/pause.png)`
                    this.devmodeonevents.forEach(dev=>dev())
                }
                if(this.toggle < 0){
                    this.devmode= false
                    this.dom.play.style.backgroundImage = `url(./assets/icons/play.png)`
                    this.devmodeoffevents.forEach(dev=>dev())
                }
            }
            this.dom.fullscreen.onclick = ()=>{
                if(this.dom.fullscreen.getAttribute(`state`) === `normal`){
                    this.setfullscreen()
                }else if(this.dom.fullscreen.getAttribute(`state`) === `full`){
                    this.setnormalscreen()
                } 
            }
        },
        addLoadsContent({datainst, callback}){
            const div = document.createElement(`div`)
            const cover = document.createElement(`div`)
            cover.textContent = datainst.name
            div.datainst = datainst
            div.classList.add('load')
            div.draggable = true
            this.setupDragDrop({drag: div, data: datainst, drop: this.dom.canvas, callback})
            div.setAttribute(`style`, this.loadItemStyle())
            cover.setAttribute(`style`, this.loadItemCoverStyle())
            
            div.style.backgroundImage = `url(${datainst.dataurl})` 
            div.append(cover)
            this.dom.loadsContent.append(div)
        },
        setupDragDrop({drag, drop,data, type= 'text',callback = ()=>{}}){
            const id = GenerateId()
            drag.draggable = true
            
            drag.addEventListener('dragstart',(e)=>{
                // e.preventDefault()
                e.dataTransfer.setData(`${type}/data`, (type === 'text')?JSON.stringify(data):data)
                e.dataTransfer.setData('text/id', `${id}`)
            }) 
            drop.addEventListener('dragover', (e)=>{
                e.preventDefault()
            })
            drop.addEventListener('drop', (e)=>{
                if(e.dataTransfer.getData(`text/id`) !== id)return
                if(e.dataTransfer.getData(`${type}/data`))
                callback((type === 'text')?JSON.parse(e.dataTransfer.getData(`${type}/data`)):e.dataTransfer.getData(`${type}/data`) )
                e.preventDefault()

            })
            return id
        },
        shortcuts() {
        },
        setupcanvas() {
            this.ctx = this.dom.canvas.getContext(`2d`)
            this.dom.canvas.width = this.dom.canvas.clientWidth
            this.dom.canvas.height = this.dom.canvas.clientHeight
            this.dom.canvas.x = this.dom.canvas.getBoundingClientRect().x
            this.dom.canvas.y = this.dom.canvas.getBoundingClientRect().y
            EventHandler(window, ',l', 'resize' ,()=>{
                this.dom.canvas.width = this.dom.canvas.clientWidth
                this.dom.canvas.height = this.dom.canvas.clientHeight
            })

            this.dom.canvas.focus()
        },
        clearRect(){
            this.ctx.imageSmoothingEnabled = false
            this.ctx.clearRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height)
        },
        load(){
            this.mainuiok()
            this.events()
            this.setupcanvas()
        }
    }
    res.load()
    return res
}