export function TextHandler(game){
    const res ={
        load(){
            this.temps = document.querySelectorAll(`.temp`)
            
        },
        getTempStyle(x){
            const data = (this.temps[x].getAttribute(`setStyle`))? this.temps[x].getAttribute(`setStyle`) :  ''
            return data
        },
        getHref(x){
            const data = (this.temps[x].getAttribute(`href`))? this.temps[x].getAttribute(`href`) :  ''
            return data
        },
        add(tempno,  timeout = 9000){
            if(this.prevdiv){
                this.prevdiv.remove()
            }

            const par = document.body.querySelector(`.text`)
            const div = document.createElement(`div`)
            this.tempno = tempno
            const temp = this.temps[this.tempno]
            temp.style.display = `flex`
            div.append(temp)
            par.append(div)

            this.prevdiv = div
            div.classList.add(`card`)
            // div.style.top = 0 + `px`
            div.setAttribute(`style`, this.getTempStyle(tempno))
            const href = this.getHref(tempno)
            if(href){
                const a = document.createElement(`a`)
                a.href = href
                setTimeout(()=>{a.click()}, 4000)
            }
            
            let count = 0
            div.onanimationend = ()=>{
                div.classList.add(`fadeout`)
                if(count === 2){
                    div.remove()
                }
            }
        }
    }
    res.load()
    return res
}