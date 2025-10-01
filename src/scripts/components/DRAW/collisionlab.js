import { EventHandler } from "../../functions.js/DRAW/events.js"
import { GenerateId } from "../../functions.js/DRAW/generateId.js"
import { getCanvas } from "../../functions.js/DRAW/getCanvas.js"
import { GUI } from "../../functions.js/DRAW/gui.js"
import { draw } from "../../functions.js/DRAW/instances.js"
import { AABBLab } from "./AABBLab.js"
import { domextract } from "./domextract.js"
import { SATLab } from "./SATlab.js"
export function CollisionLab({ Instance, to, image, allowgui, mode = 'lab', collisionType = 'SAT', verticesArray, folder }) {
  const res = {
    image,
    mx: 0,
    my: 0,
    allowMx: true,
    allowMy: true,
    name: '',
    collisionLabTypes: { SAT: SATLab, AABB: AABBLab },
    presetStyle() { return `background: #ffffff29; border-radius: 8px; margin: 1rem 0` },
    exitstyle() { return `position: absolute; top: .5rem; left: .5rem;width: 2vw;height: 2vw;opacity: .5;` },
    style() { return `z-index:9;width: 100vw; height: 100vh; background: black; position: absolute; top: 0; left: 0; display:flex; justify-content: space-between; align-items:center; ` },
    leftstyle() { return `overflow-y: scroll;position: relative;width: 30%; height: 100%; background: #2b041c;border: 2px solid #48092f;padding: 2rem 1em;align-items: center` },
    rightstyle() { return `position: relative;width: 70%; height: 100%; background: #48092fa3;` },
    canvasstyle() { return `width: 100%; height: 100%;position:absolute;top: 0; left: 0;` },
    submitstyle() { return `bottom: 2rem; right: 2rem; border: 2px solid #770c4d;width: 5rem; height: 2rem; border-radius: .4rem; background: #48082f; display: flex; justify-content: center; align-items: center; color: white; position: absolute;` },
    load() {
      this.ui()
      this.setupmouse()
      this.gui(allowgui)
      this.setType()

    },
    setType(){
      this.type = this.collisionLabTypes[draw.instance.library.find(`collision`).object.meta.type](this, image)
    },
    presets() {},
    ui() {
      this.element = document.createElement(`div`)
      this.element.classList.add(`collisionlab`)
      this.element.setAttribute(`style`, this.style())
      this.element.innerHTML += `
            <div class='exit' style='${this.exitstyle()}'></div>
            <div class='left yscroll' style='${this.leftstyle()}'>
            </div>
            <div class='right' style='${this.rightstyle()}'>
            <canvas class='canvas' style='${this.canvasstyle()}'></canvas>
            <div class='submit' style='${this.submitstyle()}'>Done</div>
            </div>
            `
      to.append(this.element)
      domextract(this.element, `classname`, this)
      this.canvasfunc = getCanvas(this.dom.canvas, this)

    },
    setupmouse() {
      EventHandler(this.dom.exit, 'startcolmouse', 'click', (e) => {
        this.remove()
      })
      EventHandler(this.dom.submit, 'startcolmouse', 'click', (e) => {
        this.type.save()
      })
      EventHandler(this.canvas, 'startcolmouse', 'mousedown', (e) => {
        if(this.allowMx)
        this.mx = e.clientX - e.target.getBoundingClientRect().x
        if(this.allowMy)
        this.my = e.clientY - e.target.getBoundingClientRect().y
      })
      EventHandler(this.canvas, 'startcolmouse', 'mousemove', (e) => {
        if(this.allowMx)
        this.mx = e.clientX - e.target.getBoundingClientRect().x
        if(this.allowMy)
        this.my = e.clientY - e.target.getBoundingClientRect().y
      })
      EventHandler(this.canvas, 'startcolmouse', 'mouseup', () => {})
    },
    gui() {
      if (!allowgui) return
      const gui = GUI(draw.instance.library.find(`collision`).object.meta.type, this.dom.left)
      const options = gui.addFolder(`options`)
      options.add(this, 'name', 'Title')
      const no = Object.keys(draw.instance.library.find(`shapes`).object).length
      this.title = `collision ${no}`
      options.element.querySelector(`input`).value = this.title


    },
    drawPointer() {
      this.ctx.beginPath()
      this.ctx.fillStyle = `gold`
      this.ctx.arc(this.mx, this.my, this.radius, 0, Math.PI * 2)
      this.ctx.closePath()
    },
    remove() {
      clearInterval(this.interval)
      this.element.remove()
    },
    update() {
      this.canvasfunc.clear()
      this.type.update({ ...this })
      this.drawPointer()
    },
    startInterval() {
      this.interval = setInterval(() => {
        this.update()
      }, 50);
    },
  }
  res.load()
  res.startInterval()
  return res
}


