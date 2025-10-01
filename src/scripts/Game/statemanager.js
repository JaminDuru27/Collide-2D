export function getExportStateManager(){
    
return `

function StatesManager(){
    const res = {
        load(){},
        states : [],
        addState(name = GenerateId(), targets = {}, conditioner = ()=>{}, callback = ()=>{}){
            const obj = State(this,name, targets, conditioner, callback)
            this.states.push(obj)
            return obj
        },
        play(name){
            const find =  this.states.find(state=>state.name === name)
            if(find) find.play()
        },
        update(props){
            this.states.forEach(state=>state.update(props))
        }
    }
    res.load()
    return res
}



function State(states,name, targets, conditioner, callback){
    const res = {
        name,
        call: true,
        load(){
            this.execute = this.play
        },
        onupdate: ()=>{},
        play(){
            states.states.forEach(state=>{ //set all to call = true
                state.call = false
            })
            this.call = true
            conditioner = ()=>true
        },
        update(){
            if(conditioner(targets)){
                if(this.call)
                callback(targets)
                this.onupdate(targets)//on update
                states.states.forEach(state=>{ //set all to call = true
                    state.call = true
                })
                this.call = false // set this.call to false
            }
        },
    }
    res.load()
    return res
}
`
}