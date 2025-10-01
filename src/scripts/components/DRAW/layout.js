import { EventHandler } from "../../functions.js/DRAW/events.js"
import { draw } from "../../functions.js/DRAW/instances.js"
import { domextract } from "./domextract.js"
export function drawlayout(Instance) {
  const res = {
    w: `25vw`,
    showoffset: 50,
    topMargin: 0,
    off: '-8vw',
    canvasstyle() { return `width: 100vw; height: calc(100vh - 2rem);position: absolute; bottom: 0; left: 0` },
    style() { return `color: white;background: #2d012d;width: 100vw;height: 100vh;position: absolute;top: 0;left: 0;` },
    topbarstyle() { return `padding: 0 .2rem ;display: flex; align-items: center;justify-content:space-between;z-index: 5;top:0;left:0;background:#42092b; width: 100vw; height: 2rem; position:absolute;` },
    sidebarwrapstyle() { return `overflow-x: hidden; overflow-y:auto; padding: 3rem .3rem;bottom: 0;background:transparent; width: 100%;height: 100%; position:absolute;` },
    sidebarstyle() { return `z-index: 2;border:1px solid #e91e63;max-width: 20vw;transition: .3s ease;bottom: 0;background:#500a34; width: ${this.w}; height: ${100 - this.topMargin}vh; position:absolute;` },
    exitstyle() { return `background-image: url(./assets/icons/home.png); background-size: contain; background-position: center; background-repeat: no-repeat;opacity: .5;width: 2vw;height: 2vw;` },
    settingsstyle() { return `background-image: url(./assets/icons/settings.png); background-size: contain; background-position: center; background-repeat: no-repeat;opacity: .5;width: 2vw;height: 2vw;` },
    repostyle() { return `padding-top:3rem;overflow:hidden;transition: .3s ease;z-index: 9;opacity: 0;border:2px solid; left: -${this.w}; background: black; ` + this.sidebarstyle() },
    showrepostyle() { return `opacity: 0;transition: .3s ease;border-radius: 0 50% 50% 0;z-index:8;position: absolute; left: -5rem; top: 50%; width: 5rem; height: 5rem; background: #31051f` },
    closebarstyle() { return `transition: .3s ease; width: 3rem;height: 3rem;opacity:0;background: #f5deb326;border-radius: 50%;top: 50%;backdrop-filter: blur(5px);position: absolute;` },
    titlestyle() { return `color: white` },
    contentstyle() { return `margin-top: .5rem;width: 100%;background: #00000030;padding: .5rem;border-radius: .5rem;` },
    sectionstyle() { return `width: 100%;color: white;background: #48092f;padding: 1rem;border-radius: 5px;` },
    topsectionstyle(){ return` overflow: scroll hidden; width: 18vw;height: 80%;background: #29031a;border-radius: .6rem;border: 1px solid #e91e6385;`},
    setValsForPhone() {

    if ('ontouchstart' in window) {
      this.off = '-8vw'
    }
    },
    setEventsForPhone() {
      const closel = () => res.dom.closerepol.style.opacity = `0`
      const closer = () => res.dom.closerepor.style.opacity = `0`
      let firstdbl

      if ('ontouchstart' in window) {
        this.off = '-8vw'
        EventHandler(this.dom.canvas, '', 'click', () => {
          this.dom.sideright.style.display = `none`
          this.dom.sideleft.style.left = `-${this.dom.sideleft.clientWidth}px`
        })
       
        
        EventHandler(this.dom.canvas, '', 'dblclick', () => {
          this.dom.sideright.style.display = 'block'
          this.dom.sideleft.style.left = `-${0}px`
        })
      }

    },
    ui() {
      this.element = document.createElement(`div`)
      this.element.classList.add(`layout`)
      this.element.setAttribute(`style`, this.style())
      this.element.innerHTML = `
        <canvas class='canvas' style='${this.canvasstyle()}'></canvas>
        <div class='showrepo' style = '${this.showrepostyle()}'></div>
        <div class='top topbar' style='${this.topbarstyle()}left:0;'>
        <div class='exitdraw' style='${this.exitstyle()}left:0;'></div>
        <div class='updates xscroll' style = '${this.topsectionstyle()}'></div>
        <div class='name'>${Instance.name} - Collision Manager (DRAW)</div>
        <div class='tabs xscroll' style = '${this.topsectionstyle()}'></div>

        <div class='settings'  style='${this.settingsstyle()}left:0;'></div>
        </div>
        <div class='sideleft' style='${this.sidebarstyle()}left:0;'>
        <div class='leftside yscroll' style='${this.sidebarwrapstyle()}'></div>
        <div class='closerepol fadeouthover' style = '${this.closebarstyle()}right: ${this.off};'></div>
        </div>
        <div class='sideright' style='${this.sidebarstyle()}right:0;'>
        <div class='rightside yscroll' style='${this.sidebarwrapstyle()}'></div>
        <div class='closerepor fadeouthover' style = '${this.closebarstyle()}left: ${this.off};'></div>            
        </div>
        <div class='repo' style = '${this.repostyle()}'></div>
        `
      document.body.append(this.element)

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

      domextract(this.element, 'classname', this)
      return {
        [name]: element,
        ...domextract(element, 'classname').object
      }
    },
    remove() {
      this.element.remove()
    },
    shortcuts() {
      Instance.shortcuts.add('side short', [`ArrowLeft`, `Shift`], () => {
        this.dom.sideleft.style.left = `-${this.dom.sideleft.clientWidth}px`
      })
      Instance.shortcuts.add('side short', [`ArrowRight`, `Shift`], () => {
        this.dom.sideright.style.right = `-${this.dom.sideleft.clientWidth}px`
      })
    },
    event() {
      const openl = () => res.dom.closerepol.style.opacity = `1`
      const openr = () => res.dom.closerepor.style.opacity = `1`
      const closel = () => res.dom.closerepol.style.opacity = `0`
      const closer = () => res.dom.closerepor.style.opacity = `0`
      let tr = 1
      let tl = 1
      const minl = () => {
        if (tl > 0) this.dom.sideleft.style.left = `-${this.dom.sideleft.clientWidth}px`
        else if (tl < 0) this.dom.sideleft.style.left = `0`
        tl *= -1
      }
      const minr = () => {
        if (tr > 0) this.dom.sideright.style.right = `-${this.dom.sideright.clientWidth}px`
        else if (tr < 0) this.dom.sideright.style.right = `0`
        tr *= -1
      }
      EventHandler(this.dom.closerepol, '', 'click', () => { minl() })
      EventHandler(this.dom.closerepor, '', 'click', () => { minr() })
      EventHandler(this.dom.closerepol, '', 'mouseenter', () => { openl() })
      EventHandler(this.dom.closerepol, '', 'touchstart', () => { openl() })
      EventHandler(this.dom.closerepol, '', 'mouseleave', () => { closel() })
      EventHandler(this.dom.closerepol, '', 'touchend', () => { closel() })
      EventHandler(this.dom.closerepor, '', 'mouseenter', () => { openr() })
      EventHandler(this.dom.closerepor, '', 'touchstart', () => { openr() })
      EventHandler(this.dom.closerepor, '', 'mouseleave', () => { closer() })
      EventHandler(this.dom.closerepor, '', 'touchend', () => { closer() })
      EventHandler(this.dom.showrepo, 'show', 'click', () => {
        this.dom.repo.style.opacity = `1`
        this.dom.repo.style.left = `0`
      })
      EventHandler(this.dom.exitdraw, 'exitdraw', 'click', () => {
        draw.remove()
      })
      EventHandler(this.element, 'showreposhow', 'dblclick', (e) => {
        this.dom.repo.style.opacity = `0`
        this.dom.repo.style.left = `-${this.w}`
      })

      EventHandler(window, 'showreposhowphone', 'touchmove', (e) => {
        showfunc(e.touches[0].clientX)

      })
      EventHandler(this.element, 'showreposhow', 'mousemove', (e) => {
        showfunc(e.clientX)
      })
      const showfunc = (x) => {
        //UNDER THE CONDITION THAT SIDE LEFT IS SHOWING
        if (tl < 0) return
        if (x < 50) {
          if (this.dom.showrepo.open) return
          this.dom.showrepo.style.opacity = `1`
          this.dom.showrepo.style.left = `0`
          this.dom.showrepo.setAttribute(`open`, `true`)
          this.dom.showrepo.open = true
        }
        else {
          if (!this.dom.showrepo.open) return
          this.dom.showrepo.style.opacity = `0`
          this.dom.showrepo.style.left = `0`
          this.dom.showrepo.setAttribute(`open`, `false`)
          this.dom.showrepo.open = false
        }
      }

    },
    remove() {
      this.element.remove()
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
    load() {
      this.setValsForPhone()
      this.ui()
      domextract(this.element, 'classname', this)
      this.setEventsForPhone()
      this.setupcanvas()
      this.event()
      this.shortcuts()
      this.dom.canvas.description = `ShortCuts , ( A - SelectAll,Escape - Exit , Ctrl + S - Save ,RightClick - select , LeftClick - drag , Z + I - Zoom In , Z + O - Zoom Out , Wheel Up / Down - TranslateY , X + Wheel Up/Dwn - TranslateX)
      S - save, Del - Delete, LeftClick - SelectTile, D + Q - Select Selected Edges, C - Copy, X - Cut,V - Paste, Alt - consolidate`
      this.dom.exitdraw.description = `Exit DRAW`
      this.dom.settings.description = `Settings`
      this.dom.leftside.description = `ShortCuts <br> ( ArrowLeft + Shift - Close <br> )`
      this.dom.rightside.description = `ShortCuts <br> ( ArrowRight + Shift - Close <br> )`
    }
  }
  res.load()
  return res
}