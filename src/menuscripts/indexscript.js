import { Game } from "./game.js"

const game = Game()
function animate(){
    game.render()
    requestAnimationFrame(animate)
}
animate(0)


function screefadein(){
    return{
        load(){
            this.element = document.createElement(`div`)
            this.element.classList.add('fadeintro')
            this.element.classList.add('fadeout')
            this.element.addEventListener('animationend', ()=>{
                this.element.remove()
            })
            document.body.append(this.element)
            return this
        }
    }
}
screefadein().load()

window.scrollTo(0, 0)
const showfooter= document.querySelector(`.showfooter`)
let footer = `notshowing`
showfooter.onclick = ()=>{
    const a = document.createElement(`a`)
    if(footer === `notshowing`){
        document.querySelector(`footer`).style.display = `flex`
        a.href = `#footer`
        footer = `showing`
    }
    else if(footer === `showing`){
        setTimeout(()=>{
            document.querySelector(`footer`).style.display = `none`
        }, 1000)
        a.href = `#header`
        footer = `notshowing`
    }
    a.click()
}