export function getExportAnimation(){
    return `
function Animations(target){
    const res ={
        array : [],
        load(){

        },
        addAnimation({name,delay = 10, keyValueArray = [],}){ 
            const animation = Animation({name, keyValueArray, target, animations: this})
            animation.delaying = delay
            this.array.push(animation)
            return animation
        },
        playAnimation(name){
            this.array.forEach(anim=>{
                if(anim.name === name){
                    this.currentAnim
                    return anim.play()
                }
            })
            return this?.currentAnim
        },
        update(props){
            this.array.forEach(arr=>{
                arr.update(props)
            })
            if(this.currentAnim)
            this.isPlaying  = this.currentAnim.isPlaying
            else this.isPlaying = false
        }
    }
    res.load()
    return res
}


function Animation({animations, target, keyValueArray, name}){
    const res = {
        delaying: 3,
        name, 
        keyValueArray,
        timer: 0,
        index: -1   ,
        looping: false,
        isPlaying: false,
        rename(val){
            return this.call('name', val)
        },
        delay(val){
            return this.call('delaying', val)
        },
        loop(val){
            return this.call('looping', val)
        },
        call(key,val){
            if(!val)
            this[key] = true
            else this[key] = val
            return this
        },
        timeInterval(callback){
            if(this.timer >=this.delaying){
                callback()
                this.timer = 0
            }else
            this.timer ++
        },
        load(){

        },
        updateLoop(){
            if(this.looping){
                this.index = (this.index + 1) % this.keyValueArray.length;
                return
            }
            if(!this.looping){
                this.index = (this.index + 1)
                if(this.index > this.keyValueArray.length)
                this.pause()
            }
        },
        rewind(){
            this.index = 0
            this.timer = 0
        },
        delete(){
            const index = animations.array.indexOf(this)
            animations.array.splice(index, 1)
            animations.currentAnim = undefined
        },
        play(rewind = false){
            if(rewind)this.rewind()
            this.isPlaying = true
            animations.currentAnim = this
            this.timer = this.delaying
            return this
        },
        pause(){
            this.isPlaying = false
            animations.currentAnim = undefined
            return this
        },
        update(props){
            if(!this.isPlaying)return
            this.timeInterval(()=>{
                this.updateLoop()
                if(this.lastObj)if(this.lastObj.end)this.lastObj.end({animation: this, target})//call end
                
                const obj  = this.keyValueArray[this.index]   
                this.lastObj = obj             
                
                for(let x in obj){
                    const type = typeof obj[x]
                    if(x ==='end')continue // end reservef for function on enfof this process
                    if(type === 'function'){
                        obj[x]({animation: this, target})
                        continue
                    }
                    if(type === 'number'){
                        obj[x + ' dist'] = (obj[x] - target[x]) + target[x]                            
                        obj[x + ' step'] = obj[x +  ' dist'] / this.delaying 
                        if(obj[x + ' step'] === Infinity)obj[x + ' step'] = 0                        
                        obj[x + ' dir'] = Math.sign(obj[x + ' dist'])
                        continue
                    }
                    
                    if(type !== 'function' && type !== 'number'){
                        target[x] = obj [x]
                    }
                }    
            })
            const obj  = this.keyValueArray[this.index]                
            for(let x in obj){
                const type = typeof obj[x]
                if(x.split(' ').length > 1)continue//cancel out dist set dir
                if(type === 'number'){
                    const step = obj[x + ' step']   
                    const dir = obj[x + ' dir']   
                    const dist = obj[x + ' dist']
                    if(!step && !dir && !dist)return
                    target[x] += step

                }
            }
        }

    }

    res.load()
    return res
}
    `
}