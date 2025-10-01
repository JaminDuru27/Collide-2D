import {draw} from '../../functions.js/DRAW/instances.js';
import {EventHandler} from '../../functions.js/DRAW/events.js';
import { domextract } from './domextract.js';


export function CollisionDisplay({data}){
  const res = {
    load(){
      const type = this.getColType()
      if(type === `AABB`){
        this.collisionDisplay = AABBDisplay({data})
      }
      else if(type === `SAT`){
        this.collisionDisplay = SATDisplay({data})
      }
    },
    getColType(){
      const folder = draw.instance.library.find(`collision`,(object, key)=>{},).object
      return folder.meta.type
    }
  }
  res.load()
  return res.collisionDisplay
}
export function AABBDisplay({data}){
  const res = {
    data: data.content,
    style(){return `width: 100%; height: 100%; background: #3a0726; position: relative; border: 2px solid #560c39;`},
    parstyle(){return`width: 3rem; height: 3rem; border: 2px solid white; position: absolute; top: 50%; left: 50%; border-radius: .2rem;transform: translate(-50%, -50%)`},
    colstyle(){return`width: 3rem; height: 3rem; background: #e91e63;position: absolute; top: 0; left: 0; opacity: 0.5;border-radius: .2rem;`},
    ui(){
      this.element = document.createElement(`div`)
      this.element.classList.add(`aaabbdisp`)
      this.element.setAttribute(`style`, this.style())
      this.element.innerHTML += `
      <div class = 'par' style='${this.parstyle()}'></div>
      `
      document.body.querySelector(`.output`).append(this.element)
      domextract(this.element, `classname`, this)
      this.updateCollisionBox()
    },
    updateCollisionBox(){
      const ratio = this.data.ratio
      const b = this.dom.par.getBoundingClientRect()
      const B = this.element.getBoundingClientRect()
      const div = document.createElement(`div`)
      div.setAttribute(`style`, this.colstyle())
      div.style.top = ratio.y * (b.y- B.y) + `px` 
      div.style.left = ratio.x * (b.x - B.x) + `px` 
      div.style.width = ratio.w * b.width + `px` 
      div.style.height = ratio.h * b.height + `px` 
      this.element.append(div)
    },
    load(){
      this.ui()
    },
  }
  res.load()
  return res
}

export function SATDisplay({data}){
  const res = {
    data: data.content,
    ratio: {},
    style(){return `width: 100%; height: 100%; background: #3a0726; position: relative; border: 2px solid #560c39;`},
    parstyle(){return`width: 3rem; height: 3rem; border: 2px solid white; position: absolute; top: 50%; left: 50%; border-radius: .2rem;transform: translate(-50%, -50%)`},
    colstyle(){return`width: 3rem; height: 3rem; background: #e91e63;position: absolute; top: 0; left: 0; opacity: 0.5;border-radius: 0px;`},
    load(){
      this.calcSizeRatio()
      this.ui()
    },
    ui(){
      this.element = document.createElement(`div`)
      this.element.classList.add(`satdisp`)
      this.element.setAttribute(`style`, this.style())
      this.element.innerHTML += `
      <div class = 'par' style='${this.parstyle()}'></div>
      `
      document.body.querySelector(`.output`).append(this.element)
      domextract(this.element, `classname`, this)
      this.updateCollisionBox()
    },
    updateCollisionBox(){
      const ratio = this.ratio
      const b = this.dom.par.getBoundingClientRect()
      const B = this.element.getBoundingClientRect()
      const div = document.createElement(`div`)
      div.setAttribute(`style`, this.colstyle())
      div.style.top = ratio.y * (b.y- B.y) + `px` 
      div.style.left = ratio.x * (b.x - B.x) + `px` 
      div.style.width = ratio.w * b.width + `px` 
      div.style.height = ratio.h * b.height + `px` 
      this.element.append(div)
      this.addClipPath(div)
    },
    addClipPath(div){
      // const b = div.getBoundingClientRect()
      // v.x / (b.width / 100)
      const w = Math.max(...this.data.vertices.map(obj=> obj.x)) 
      const h = Math.max(...this.data.vertices.map(obj=> obj.y)) 
      const f = this.data.vertices[0]
      const l  = this.data.vertices.length - 1
      // x + w / 100 * v.x
      let path = [...this.data.vertices.map((v, x)=>`${Math.round(v.x /(w /100))}% ${Math.round(v.y /(h /100))}%${(x !== l)?` ,`:''}`)]
      path = path.join(``)
      div.setAttribute(`style`, this.colstyle() + `clip-path: polygon(${path})`)
      
    },
    calcSizeRatio(){
      const data = this.data
      this.ratio.x = Math.min(...data.vertices.map(obj=> obj.ratio.x))
      this.ratio.y = Math.min(...data.vertices.map(obj=> obj.ratio.y))
      this.ratio.w = Math.max(...data.vertices.map(obj=> obj.ratio.x)) - this.ratio.x
      this.ratio.h = Math.max(...data.vertices.map(obj=> obj.ratio.y)) - this.ratio.y
    }
  }
  res.load()
  return res
}




















// export function SATDisplay({to}){
//   const res = {
//     style(){return ` display: flex; justify-content: space-between; align-items: center; overflow-x:scroll; overflow-y: hidden`},
//     canvasstyle(){return `margin-right: .2rem; background: black; border-radius: .2rem`},
//     load(){
//       this.ui()
//     },
//     ui(){
//       to.innerHTML = ''
//       this.element = document.createElement('div')
//       this.element.classList.add('SATDisplay')
//       this.element.classList.add('xscroll')
//       this.element.setAttribute('style', this.style())
//       to.append(this.element)
//       this.element.style.width = to.clientWidth + 'px'
//       this.element.style.height = to.clientHeight + 'px'
//       this.updateCanvas()
//     },
//     canvasUI(data){
//       //INITIALIZE CANVAS
//       const canvas = document.createElement('canvas')
//       const ctx = canvas.getContext('2d')
//       canvas.setAttribute('style', this.canvasstyle())
//       this.element.append(canvas)
//       // SET CLEAR SIZE
//       canvas.width = this.element.clientWidth
//       canvas.height = this.element.clientHeight
      
//       // DRAW
//       const array = [...data.vertices.map(e => ({ x: e.x, y: e.y, rx: e.ratio.x, ry: e.ratio.y }))]
//       ctx.clearRect(0,0,canvas.width, canvas.height)
//       ctx.save()
//       ctx.beginPath()
//       ctx.fillStyle = `gold`
//       ctx.strokeStyle = `gold`
//       ctx.moveTo(array[0].vx * canvas.width, array.vy * canvas.height)
//       array.forEach((v, x) => {
//         if (x === 0) return
//         ctx.lineTo(canvas.width * v.rx, canvas.height * v.ry)
//       })
//       ctx.fill()
//       ctx.stroke()
//       ctx.closePath()
//       ctx.restore()
//       //EVENTS
//       EventHandler(canvas, '', 'click', ()=>{
//       })
//     },
//     updateCanvas(){
//       const shapes = draw.instance.library.find({name: `/libs/collision/shapes`}).object
//       const keys = Object.keys(shapes)
//       for(let key of keys){
//         const obj = shapes[key]
//         const ui = this.canvasUI(obj)
//       }
//     }
//   }
//   res.load()
//   return res
// }