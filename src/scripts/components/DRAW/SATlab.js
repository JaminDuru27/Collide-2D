import { EventHandler } from "../../functions.js/DRAW/events.js"
import { Shortcuts } from "../../functions.js/DRAW/shortcuts.js"
import { GUI } from "../../functions.js/DRAW/gui.js"
import { GenerateId } from "../../functions.js/DRAW/generateId.js"
import { calcRatio } from "../../functions.js/DRAW/ratio.js"
import { draw } from "../../functions.js/DRAW/instances.js"
export function SATLab(Lab, imageadress) {
  const res = {
    vertices: [],
    presets: [],
    radius: 5,
    color: `gold`,
    sx: 0,
    sy: 0,
    sw: 0,
    sh: 0,
    x: 0,
    y: 0,
    w: 200,
    h: 200,
    load() {
      this.getImage()
      this.center()
      this.events()
      this.shortcuts()
      this.gui()
      this.loadpresets()
    },
    loadpresets() {
      this.presets.push([{"x":319,"y":269,"ratio":{"x":1.5961874389648438,"y":1.345}},{"x":520,"y":269,"ratio":{"x":2.601187438964844,"y":1.345}},{"x":520,"y":468,"ratio":{"x":2.601187438964844,"y":2.34}},{"x":318,"y":468,"ratio":{"x":1.5911874389648437,"y":2.34}},{"x":318,"y":273,"ratio":{"x":1.5911874389648437,"y":1.365}},{"x":318,"y":268,"ratio":{"x":1.5911874389648437,"y":1.34}}])
      this.presets.push([{"x":421,"y":271,"ratio":{"x":2.106187438964844,"y":1.355}},{"x":519,"y":468,"ratio":{"x":2.5961874389648436,"y":2.34}},{"x":321,"y":468,"ratio":{"x":1.6061874389648438,"y":2.34}},{"x":421,"y":269,"ratio":{"x":2.106187438964844,"y":1.345}},{"x":421,"y":269,"ratio":{"x":2.106187438964844,"y":1.345}}])
      this.presetsGUI()

    },
    presetsGUI() {
      this.presets.forEach(preset => {
        const canvas = document.createElement(`canvas`)
        const ctx = canvas.getContext(`2d`)
        canvas.setAttribute(`style`, Lab.presetStyle())
        canvas.width = Lab.dom.left.clientWidth - 50
        canvas.height = Lab.dom.left.clientWidth - 50
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const array = [...preset.map(e => ({ x: e.x, y: e.y, rx: e.ratio.x, ry: e.ratio.y }))]
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = `gold`
        ctx.strokeStyle = `gold`
        ctx.moveTo(array[0].vx * canvas.width, array.vy * canvas.height)
        array.forEach((v, x) => {
          if (x === 0) return
          ctx.lineTo(canvas.width * v.rx, canvas.height * v.ry)
        })
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
        //ctx.closePath()
        Lab.dom.left.append(canvas)
        canvas.onclick = () => {
          this.vertices = array.map(e => ({ x: Lab.canvas.width * e.rx, y: Lab.canvas.height * e.ry }))
          this.finalized = true
        }
      })
    },
    gui(allowgui) {
      const gui = GUI('options', Lab.dom.left)
      gui.add(this, 'radius', 'Radius', [1, 10, 0.2])
      gui.add(this, 'w', 'width', [100, 500, 0.2]).after = () => {
        this.center()
      }
      gui.add(this, 'h', 'height', [100, 500, 0.2]).after = () => {
        this.center()
      }
      gui.add(this, 'reset', 'Reset').after = () => {
        this.center()
      }
    },
    save() {
      if (!this.finalizeShape) return
      this.calcVerticesRatio()
      //LOCATE SAVE ADRESS AND SAVE WITH TITLE GIVEN
      const saveAddress = (Lab.saveAddress) ? Lib.saveAddress : `shapes`
      const saveLoc = draw.instance.library.find(saveAddress)
      const content = {
        vertices: this.vertices,
        id: GenerateId()
      }
      content.vertices.map(e=>{
        e.x = Math.round(e.x)
        e.y = Math.round(e.y)
      })
      draw.instance.library.addFile(Lab.title, `shapes`, 'collisionfile')
      draw.instance.library.writeFile(Lab.title,'content', content)
      //RESET FOR DRAWING AGAIN
      this.reset()
      Lab.remove()
    },
    reset() {
      this.vertices = []
      this.finalized = false
      Lab.allowMx = true
      Lab.allowMy = true
    },
    calcVerticesRatio() {
      this.vertices.forEach(v => {
        const ratio = calcRatio({ x: v.x, y: v.y, W: this.w, H: this.h }).ratio
        v.ratio = { x: ratio.x, y: ratio.y }
      })
    },
    center() {
      this.x = (Lab.canvas.width / 2) - (this.w / 2)
      this.y = (Lab.canvas.height / 2) - (this.h / 2)
    },
    events() {
      EventHandler(Lab.canvas, 'startcolmouse', 'mousedown', (e) => {
        if(e.button !== 0)return
        if (!this.finalized)
          this.addpoint()
        this.finalizeShape()
      })
      EventHandler(Lab.canvas, 'startcolmouse', 'mousedown', (e) => {
        if(e.button !== 2)return
        Lab.mx = this.vertices[this.vertices.length-1].x
        Lab.my = this.vertices[this.vertices.length-1].y
      })
      const shortcut = Shortcuts()
      let currentAxis = ``
      shortcut.add('snaptox', ['x', Lab.canvas], ()=>{
        //reset on clickagain
        if(!(Lab.allowMx && Lab.allowMy) && currentAxis === `x`){
            Lab.allowMx = true
            Lab.allowMy = true
            return
        }
        Lab.allowMx = true
        Lab.allowMy = false
        currentAxis = `x`
      })
      shortcut.add('snaptox', ['y', Lab.canvas], ()=>{
        //reset on click again
        if(!(Lab.allowMx && Lab.allowMy) && currentAxis === `y`){
            Lab.allowMx = true
            Lab.allowMy = true
            return
        }
        Lab.allowMy = true
        Lab.allowMx = false
        currentAxis = `y`
      })

    },
    getImage() {
      if (!imageadress) return
      const mainobj = draw.instance.library.find({ name: '/libs/assets/Images/img' })
      const content = mainobj.object.content.general
      this.image = content.img
      this.imgw = content.imgw
      this.imgh = content.imgh
      this.sw = this.imgw
      this.sh = this.imgh
      this.loaded = true
    },
    addpoint() {
      if (this.vertices.filter(v => (v.mx === Lab.mx && v.my === Lab.my)).length <= 0) {
        this.vertices.push({ x: Lab.mx, y: Lab.my })
      }
    },
    shortcuts() {},
    remove() {
      clearInterval(this.interval)
      this.element.remove()
    },
    drawPoints(array) {
      if (this.finalized) return
      if (!array.length) return
      array.forEach((vertex) => {
        this.ctx.beginPath()
        this.ctx.fillStyle = this.color
        this.ctx.arc(vertex.x, vertex.y, this.radius, 0, Math.PI * 2)
        this.ctx.fill()
        this.ctx.closePath()
      })
    },
    drawVertices(array, ctx) {
      if (!ctx) ctx = this.ctx
      if (!array.length) return
      ctx.beginPath()
      ctx.fillStyle = (this.finalized) ? `#ffd7006e` : this.color
      ctx.strokeStyle = (this.finalized) ? `transparent` : this.color
      ctx.moveTo(array[0].x, array[0].y)
      array.forEach((vertex, x) => {
        if (x === 0) return
        ctx.lineTo(vertex.x, vertex.y)
      })
      if (this.finalized) ctx.fill()
      ctx.stroke()
      ctx.closePath()

    },
    drawTargetImage() {
      this.ctx.strokeRect(this.x, this.y, this.w, this.h)
      if (!this.loaded) return
      this.ctx.strokeStyle = `red`
      this.ctx.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h)
    },
    drawGhost() {
      if (this.finalized) return
      if (!this.vertices.length) return
      const lastvertex = this.vertices[this.vertices.length - 1]
      this.ctx.beginPath()
      this.ctx.strokeStyle = `#48092f`
      this.ctx.moveTo(lastvertex.x, lastvertex.y)
      this.ctx.lineTo(Lab.mx, Lab.my)
      this.ctx.stroke()
      this.ctx.closePath()
    },
    cursoronpoint(vertex) {
      const distance = Math.sqrt((Lab.mx - vertex.x) ** 2 - (Lab.my - vertex.y) ** 2)
      return distance <= this.radius
    },
    finalizeShape() {
      const array = this.vertices
      if (array.length <= 1) return
      array.forEach((vertex, x) => {
        if (x === array.length - 1) return
        if (this.cursoronpoint(vertex)) {
          this.finalized = true
        }

      })
    },
    draw() {
      this.drawTargetImage()
      this.drawVertices(this.vertices)
      this.drawGhost()
      this.drawPoints(this.vertices)

    },
    update({ ctx }) {
      this.ctx = ctx
      this.draw()
    },

  }
  res.load()
  return res
}