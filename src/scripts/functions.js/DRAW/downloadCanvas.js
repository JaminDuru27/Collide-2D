import {EventHandler} from './events.js';
import {domextract} from '../../components/DRAW/domextract.js';
import {feedback} from '../../components/DRAW/feedback.js';
import {makedraggable} from '../../components/DRAW/makedraggable.js';
let last
export function downloadCanvas({canvas,
  to, allowoptions= true, w = 200, h= 200, folderaddress= null}){
  const res = {
    w,h, type: {content: 'image/png', ext: '.png' }, name: `image`,
    style(){return `    height: fit-content;width: 15vw;background: #500a34;padding: 4px 7px;border-radius: 0.3rem;position: absolute; z-index: 10;top: 262px;left: 106px;border: 1px solid #ffffff85;`},
    inputstyle(){return `    font-size: 1.2rem;width: 100%;padding: 0 .3rem;height: 2.2rem;color: #fff;margin: .2rem 0;background: #ffffff42;border: none;border-radius: 0.3rem;`},
    btnsstyle(){return `    opacity: .5;width: 100%;height: 3rem;display: flex;justify-content: space-between;align-items: center;font-size: 1.3rem;margin-top: 0.3rem;`},
    btnstyle(){return `font-size: .7rem;color: white; width: 100%; border-radius: .5rem; height: 100%; background: transparent; display: flex; justify-content: center; align-items: center; border: 2px solid white`},
    canvasStyle(){return `background: #500a34; border:1px solid #e91e63;position: absolute; top:0; left: 0;z-index: 10;`},
    gui(){
      this.addinput('name', 'input', (e)=>{this.name = e.target.value})
      this.addinput('width', 'number', (e)=>{this.w = +(e.target.value)})
      this.addinput('height', 'number', (e)=>{this.h = +(e.target.value)})
      this.addinput('format(png)', 'input', (e)=>{
        const value = e.target.value
        if(value === `png` || value === 'jpg' || value === "jpeg")
        this.type = {content: `image/${value}`, ext : `.${value}`}
      })
    },
    addinput(name,type, callback){
       const winput = document.createElement('input')
      winput.setAttribute('style', this.inputstyle())
      winput.type = type
      winput.placeholder = name
      winput.oninput = (e)=>{
        callback(e)
      }
      this.dom.gui.append(winput)
    },
    get(){
      // calc ratio based on which side is bigger then form a mini sized sreen size with it
      const cwidthheightratio = canvas.width / canvas.height
      const cheightwidthratio = canvas.height / canvas.width
      const max = Math.max(this.w, this.h)
      if(max === this.w)this.h = cheightwidthratio * this.w
      else if(max === this.h) this.w = cwidthheightratio * this.h
      //canvas
      const c = document.createElement(`canvas`)
      c.setAttribute(`style`, this.canvasStyle())
      const ctx = c.getContext(`2d`)
      c.width = this.w
      c.height = this.h
      //cctx
      ctx.save()
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.drawImage(canvas, 0, 0, c.width, c.height)
      ctx.restore()
      return {canvas: c, ctx, url: c.toDataURL()}
    },
    downloadCanvas(){
      const get = this.get()
      const c = get?.canvas
      const ctx = get?.ctx
      if(!c)return
      //draw func
      const dataURL = c.toDataURL(`${this.type.content}`)
      const a = document.createElement(`a`)
      a.href = dataURL
      a.download = `${this.name}${this.type.ext}`
      a.click()
      c.remove()
      this.element.remove()
    },
    elemevents(){
      EventHandler(this.dom.ok, '', 'click',()=>{
        this.downloadCanvas()
      } )
    },
    ui(){
      if (last) last.remove()
      last = this
      to = (!to) ? document.body : to
      this.element = document.createElement('div')
      this.element.classList.add('dc')
      this.element.setAttribute('style', this.style())
      this.element.innerHTML += `
      <div class='gui'></div>
      <div class='btns' style ='${this.btnsstyle()}'>
      <div class='ok' style = '${this.btnstyle()}'>download image</div>
      </div>
      `
      to.append(this.element)
      makedraggable(this.element)
      domextract(this.element, 'classname', this)

      
    },
    remove(){
      this.element.remove()
    },
    load(){
      this.ui()
      this.gui()
      this.elemevents()
    }
  }
  res.load()
  return res
}