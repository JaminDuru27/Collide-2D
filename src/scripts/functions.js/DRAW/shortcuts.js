import { EventHandler } from "./events.js"

export function Shortcuts(){
    const res ={
        keys:[],
        array: [],
        load(){
            this.events()
        },
        add(name, combination = [], callback, condition = ()=>(true)){
            this.array.push({name, combination, callback, condition})
        },
        events(){
            EventHandler(window,'windowev', 'keydown', (e)=>{
                if(!this.keys.includes(e.key)){
                    this.keys.push(e.key)
                }
                    this.updatecombo()
                if((e.ctrlKey || e.metaKey) && ['s', 'c','x','v'].includes(e.key.toLowerCase())){
                    e.preventDefault()
                }
            })
            EventHandler(window,'windowev', 'keyup', (e)=>{
                if(this.keys.includes(e.key)) this.keys.splice(this.keys.indexOf(e.key),1)
            })
            EventHandler(document, `hoveredelement`, 'mouseover', (e)=>{
                this.target = e.target
            })
            //for android phines detect swipe
            EventHandler(window,'windowev', 'touchmove', (e)=>{})
            EventHandler(window,'windowev', 'touchend', (e)=>{})
        },
        updatecombo(){
            this.array.forEach(obj=>{
                const f = obj.combination.filter(comb=>(typeof comb === `object`))
                const filtertargetelement = (f.length) ? f[0] : null
                const filterstring = obj.combination.filter(comb=>(typeof comb === `string`))
                const combocond = filterstring.every(comb=> (typeof comb === `string` && this.keys.includes(comb)))

                const condition = obj.combination
                if( typeof obj.condition === `boolean`) obj.condition = ()=>{return condition}
                if(filtertargetelement && this.target === filtertargetelement && combocond){
                    if(obj.condition){
                        obj.callback()
                    }
                }else if(!filtertargetelement  && combocond){
                    if(obj.condition){
                        obj.callback()
                    }
                }

            })
        },
        update(){
            // this.updatecombination()
        }
    }
    res.load()
    
    return res
}