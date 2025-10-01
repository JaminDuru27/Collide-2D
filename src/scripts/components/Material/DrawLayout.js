export function LayoutCard(to,name, src, onclick=()=>{}, ondragstart=()=>{},ondragend=()=>{},){
    const res = {
        style(){return `width: 100%;height: 7rem;border: 1px solid #ffffff24;border-radius: .5rem;position:relative;display: flex; justify-content: center; align-items: center;background: #ffffff12;margin: .5rem 0`},
        cardstyle(){return `background-color: #00000017;width: 80%;height: 65%;border-radius: .5rem;border: 1px solid #fff;background-size: cover;background-position: center;background-repeat: no-repeat;`},
        titlestyle(){return `max-width: 85%;position: absolute;top: .5rem;left: .5rem;height: 1.5rem;padding: 0 .3rem;overflow: hidden;display: flex;justify-content: center;align-items: center;border-radius: 1rem;border: 1px solid #ffffff75;background: #00000038;backdrop-filter: blur(2px);`},
        ui(){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.onclick = ()=>{onclick()}
            this.element.innerHTML += `
            <div class='title' style="${this.titlestyle()}">${name}</div>
            <div style='${this.cardstyle()}background-image: url(${src})'></div>
            `
            this.element.draggable = true
            // this.element.ondragstart = ondragstart
            // this.element.ondragend = ondragend
            to.append(this.element)
        },
        load(){
            this.ui()
        },

    }
    res.load()
    return res
}