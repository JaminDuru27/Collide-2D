import { domextract } from "../../components/DRAW/domextract"

export function warningscreen(text,callback){
    const res= {
        style(){return `position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 100;background: #00000047;width: 100%;height: 70%;display: flex;backdrop-filter: blur(13px);transition: .6s ease;color: #fff;justify-content: center;align-items: center;`},
        textStyle(){return `margin: .5rem 0;font-size: .8rem;`},
        wrapstyle(){return `width: fit-content;scale:.5;padding: .3rem .4rem;min-height: 9rem;background: #0000007a;border-radius: .5rem;border: 1px solid #ffffff14;box-shadow: 4px 4px 13px -5px #000;justify-content: space-between;align-items: center;display: flex;flex-direction: column;`},
        btnsWrapStyle(){return ` width: 100%;display: flex;justify-content: space-between;align-items: center;height: 2rem;`},
        btnStyle(){return `cursor: pointer;width: 40%;height: 100%;background: #ffffff1f;display: flex;justify-content: center;align-items: center;border-radius: .4rem;`},
        imgstyle(){return `width: 2.5rem;`},
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`warning`)
            this.element.setAttribute(`style`, this.style()) 
            this.element.innerHTML += `
            <div class='wrap' style='${this.wrapstyle()}'>
                <img style='${this.imgstyle()}' src='../assets/icons/normal.png'/>
                <div class='text' style='${this.textStyle()}'>${text}</div>
                <div class='btnswrap' style='${this.btnsWrapStyle()}'>
                    <div class='ok' style='${this.btnStyle()}'>ok</div>
                    <div class='cancel' style='${this.btnStyle()}'>exit</div>
                </div>
            </div>
            `
            document.body.append(this.element)
            domextract(this.element, `classname`, this)
            this.dom.ok.focus()
        },
        
        events(){
            this.dom.ok.onclick = ()=>{
                callback()
            }
            this.dom.cancel.onclick = ()=>{
                this.remove()
            }
        },
        remove(){
            this.element.remove()
        },
        load(){
            this.ui()
            this.events()
            setTimeout(()=>{
                this.element.style.height  = `100%`
                this.dom.wrap.style.scale  = `1`
            }, 10)
            console.log(this)
        }
    }
    res.load()
}