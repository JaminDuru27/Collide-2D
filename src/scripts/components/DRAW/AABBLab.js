import { EventHandler } from "../../functions.js/DRAW/events.js"
import { GenerateId } from "../../functions.js/DRAW/generateId.js"
import { GUI } from "../../functions.js/DRAW/gui.js"
import { draw } from "../../functions.js/DRAW/instances.js"
export function AABBLab(Lab, image,) {
  const res = {
    radius: 10,
    color: `gold`,
    sx: 0,
    sy: 0,
    sw: 0,
    sh: 0,
    x: 0,
    y: 0,
    w: 200,
    h: 200,
    initx: 0,
    inity: 0,
    initw: 200,
    inith: 200,
    widthMult: 1,
    heightMult: 1,
    points: [],
    targetpoint: null,
    load() {
      this.center()
      this.getImage()
      this.event()
      this.gui()
      this.shortcuts()
      this.focus()
    },
    cursoronpoint(vertex, mouse) {
      const m = (mouse)? mouse: {x:Lab.mx,y:Lab.my}
      const distance = Math.sqrt((m.x - vertex.x) ** 2 - (m.y - vertex.y) ** 2)
      return distance <= this.radius
    },
    focus(){
      Lab.canvas.focus()
    },
    event() {
      function mouse(e){
        return {
        x:  e.clientX - Lab.canvas.getBoundingClientRect().x,
        y: e.clientY - Lab.canvas.getBoundingClientRect().y }
      }
      let sx , sy , sw , sh
      this.start = function(e){
        const x = mouse(e).x
        const y = mouse(e).y
        sx = x
        sy = y
        sw = this.w
        sh = this.h
        this.points.forEach(v => {
          if (this.cursoronpoint(v, {x, y})){
            sx = v.x
            sy = v.y
            this.targetpoint = v

          }
        })
      }
      this.end = function(){
        this.targetpoint = null
        sx = null
        sy = null
        sw = null
        sh = null
      }
      this.move = function (e){
        if (!this.targetpoint) return
        const x = mouse(e).x
        const y = mouse(e).y
        if(this.targetpoint.name === `move`){
          this.x = x - this.w/2
          this.y = y - this.h/2
        }else if (this.targetpoint.name === `width`){
          this.w = x - sx + sw
        }else if (this.targetpoint.name === `height`){
          this.h = y - sy + sh
        }
        
      }
      EventHandler(Lab.canvas, 'tm', 'touchstart', (e) => {
        this.start(e.touches[0])
      })
      EventHandler(Lab.canvas, 'tm', 'touchup', () => {
        this.end()
      })
      EventHandler(Lab.canvas, 'tm', 'mousedown', (e) => {
        this.start(e)
      })
      EventHandler(Lab.canvas, 'tm', 'mouseup', () => {
        this.end()
      })
      EventHandler(Lab.canvas, '', 'touchmove', (e) => {
        this.move(e.touches[0])
      })
      EventHandler(Lab.canvas, '', 'mousemove', (e) => {
        this.move(e)
      })
    },
    reset(){
      this.center()
      this.w = this.initw
      this.h = this.inith
    },
    gui() {
      const gui = GUI('oo', Lab.dom.left)
      gui.add(this, 'radius', 'Radius')
      gui.add(this, 'x', 'x', [0, window.innerWidth - 200])
      gui.add(this, 'y', 'y', [0, window.innerWidth - 200])
      gui.add(this, 'w', 'w', [0, window.innerWidth - 200])
      gui.add(this, 'h', 'h', [0, window.innerWidth - 200])
      gui.add(this, 'widthMult', 'width multiplier', [0, window.innerWidth - 200])
      gui.add(this, 'heightMult', 'height multipier', [0, window.innerWidth - 200])
      gui.add(this, 'reset', 'Reset').after = () => {
        this.center()
      }

    },
    shortcuts() {},
    loadImage() {
      if (imageadress) {
        const obj = draw.instance.library.find(imageadress).object
        this.image = obj.content.general.img
        this.imgw = obj.content.general.imgw
        this.imgh = obj.content.general.imgh
        this.loaded = true
      }
    },
    getImage() {
      if(!image)return
      this.image = image
      this.imgw = image.width
      this.imgh = image.height
      this.sw = this.imgw
      this.sh = this.imgh
      this.loaded = true
    },
    updateInteractionPoint() {
      this.points = []
      //TOPLEFT
      this.points.push({
        x: this.x + this.w /2,
        y: this.y + this.h,
        name: 'height'
      })
      //BOTTOMLEFT
      this.points.push({
        x: this.x + this.w,
        y: this.y ,
        name: 'width'
      })
      //center
      this.points.push({
        x: this.x + this.w /2,
        y: this.y  +
          this.h  /2,
        name: 'move'
      })
    },
    drawbox() {
      const ctx = this.ctx
      ctx.fillStyle = 'gold'
      ctx.strokeStyle = 'gold'
      ctx.strokeRect(this.x, this.y, this.w, this.h)
      ctx.strokeStyle = 'black'
      ctx.strokeRect(this.initx, this.inity, this.initw, this.inith)
    },
    drawImage() {
      this.ctx.imageSmoothingEnabled = false
      if (this.loaded) {
        this.ctx.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, this.initx, this.inity, this.initw, this.inith)
      }
    },
    save() {
      //LOCATE SAVE ADRESS AND SAVE WITH TITLE GIVEN
      const saveAddress = (Lab.saveAddress) ? Lib.saveAddress : `shapes`
      const content = {
        ratio: {
          x: this.x / this.initx,
          y: this.y / this.inity,
          w: this.w / this.initw,
          h: this.h / this.inith,
        },
        id: GenerateId()
      }
      content.ratio.w *= this.widthMult
      content.ratio.h *= this.heightMult
      draw.instance.library.addFile(Lab.title, `shapes`, `collisionfile`)
      draw.instance.library.writeFile(Lab.title, `content`, content)
      //RESET FOR DRAWING AGAIN
      this.reset()
      Lab.remove()
    },
    center() {
      this.x = (Lab.canvas.width / 2) - (this.w / 2)
      this.y = (Lab.canvas.height / 2) - (this.h / 2)
      this.initx = this.x
      this.inity = this.y
    },
    draw() {
      this.drawImage()
      this.drawbox()
      this.drawPoints()
    },
    drawPoints() {
      if (!this.points.length) return

      this.points.forEach((vertex) => {
        this.ctx.beginPath()
        this.ctx.fillStyle = this.color
        this.ctx.arc(vertex.x, vertex.y, this.radius, 0, Math.PI * 2)
        this.ctx.fill()
        this.ctx.closePath()
      })
    },
    
    update({ ctx }) {
      this.ctx = ctx
      this.updateInteractionPoint()
      this.draw()
    },
  }
  res.load()
  return res
}