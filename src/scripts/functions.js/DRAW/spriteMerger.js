function SpriteMerger(){
    const res = {
        array: [],
        style(){return `display: flex;position: relative; flex-direction: column; color: #Ffd;position: absolute;top: 0;left: 0;width: 15rem;height: 15rem;border-radius: .5rem;border: 1px solid #ffffff70;backdrop-filter: blur(10px);background-image: linear-gradient(157deg, #0000004f, #04030369);`},
        titlestyle(){return `height: 19.5%;background: transparent;display: flex;justify-content: flex-start;align-items: center;padding: 0 .5rem;text-transform: uppercase;border-bottom: 1px solid #7b7878;`},
        contentstyle(){return `height: 80%; width: 100%;position: relative;`},
        addstyle(){return ` position: absolute;background: #ffffff0f;width: 6rem;height: 6rem;border: 2px solid #ffffff30;top: 50%;left: 50%;transform: translate(-50%, -50%);`},
        exitstyle(){return `position: absolute; background: #fff;width: 1rem; height: 1rem; top: .5rem; right: .5rem; clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);`},
        addTextStyle(){return`color: #ffffff26;font-weight: 500;font-size: 2rem;text-transform: uppercase;text-align: center;top: 50%;width: 100%;left: 50%;position: absolute;transform: translate(-50%, -50%);`},
        ui(){
            this.element = document.createElement(`div`)
            this.element.setAttribute('style', this.style())
            this.element.innerHTML =`
            <div class='title' style='${this.titlestyle()}'>SheetMerger</div>
            <div class='content' style ='${this.contentstyle()}'>
            <div class='addText' style='${this.addTextStyle()}'> Drop Image
            </div>
            <div class='add' style='${this.addstyle()}'>
            </div>
            
            <div class='exit' style='${this.exitstyle()}'>
            `
            document.body.append(this.element)
            this.content = this.element.querySelector('.content')
            this.addText = this.element.querySelector('.addText')
            this.add = this.element.querySelector('.add')
        },
        events(){
            this.add.addEventListener('dragover', (e)=>{
                e.preventDefault()
            })
            this.add.addEventListener('drop', (e)=>{
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                readFile(file, (image)=>{
                    if(!this.spriteLab){
                        this.spriteLab = SpriteLab()
                    }
                    this.spriteLab.addImage(image, file.name)
                })
                
                
            })
        },
        load(){
            this.ui()
            this.events()
        }
    }
    res.load()
    return res
}
function readFile(file, callback=()=>{}){
    if(!file)return
    if(file?.type?.startsWith('image/')){
        const reader = new FileReader()
        reader.onload = ()=>{
            const image = new Image()
            image.onload = ()=>{
                callback(image, file.name)
            }
            image.src = reader.result
            

        }
        reader.readAsDataURL(file)
    }
}

function SpriteLab(){
    const res = {
        titlestyle(){return ` height: 10%;width: 100%;justify-content: space-between;display: flex;align-items: center;background: #00000036;font-size: 1.2rem;border-bottom: 1px solid #000;color: #988;`},
        style(){return `width: 80vw;height: 80vh;background: #0000005e;z-index: 100;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);border: 1px solid #00000094;backdrop-filter: blur(17px);border-radius: 8px;color: #fff;`},
        exitstyle(){return `position: absolute; background: #fff;width: 1rem; height: 1rem; top: .5rem; right: .5rem; clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);`},
        contentstyle(){return `width: 100%;height: 80%;display: flex;flex-direction: column;position: absolute;overflow: hidden scroll;justify-content: flex-start;align-items: center;`},
        imagestyle(){return ``},
        inputstyle(){return ``},
        generatestyle(){return `position: absolute; bottom: 1rem;background: #0000009c;right: 1rem;padding: .5rem;border: 1px solid #000;border-radius: .5rem;color: #ccc;`},

        images: [],
        ui(){
            this.element = document.createElement('div')
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div style='${this.titlestyle()}'>
                <div style=''>Sprite lab</div>
                <div class ='exit' style='${this.exitstyle()}'></div>
            </div>
            <div class = 'content' style='${this.contentstyle()}'></div>
            <div class='generate' style='${this.generatestyle()}'>Generate</div>
            `
            document.body.append(this.element)
            this.content = this.element.querySelector('.content')
            this.generate = this.element.querySelector('.generate')
            this.exit = this.element.querySelector('.exit')
        },
        events(){
            this.exit.onclick =()=>{
                this.element.remove()
            }
            this.generate.onclick = ()=>{
                if(this.cw&& this.ch)
                FormationLab(this, this.cw, this.ch)
            }
            this.content.addEventListener('dragover', (e)=>{
                e.preventDefault()
            })
            this.content.addEventListener('drop', (e)=>{
                e.preventDefault()
                const files = e.dataTransfer.files
                for(let x in files){
                    let file = files[x]
                    readFile(file, (image)=>{
                        this.addImage(image, file.name)
                        this.updateImagesDom()
                    })
                }
                
                
            })
        },
        load(){
            this.ui()
            this.events()
        },
        updateImagesDom(){
            this.content.innerHTML = ''
            this.images.forEach(image=>{
                const imageinst = ImageInst(image, this)
            })
        },
        addImage(image, name){
            const img = SpriteImage({image, name})
            this.images.push(img)
            img.getFrames((images)=>{
            })
            this.updateImagesDom()
        }
    }
    res.load()

    return res
}
function FormationLab(spritelab, cw, ch){
    const res = {
        style(){return `width: 80vw;height: 80vh;background: #0000005e;z-index: 100;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);border: 1px solid #00000094;backdrop-filter: blur(17px);border-radius: 8px;color: #fff;`},
        titlestyle(){return `height: 10%;width: 100%; display: flex; justify-content: space-between; align-items: center;background: #00000036;padding: 1rem 2rem;font-size: 1.2rem;border-bottom: 1px solid #000;color: #988;`},
        exitstyle(){return `position: absolute; background: #fff;width: 1rem; height: 1rem; top: .5rem; right: .5rem; clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);`},
        contentstyle(){return `position: relative;width: 100%;height: 80%;display: flex;flex-direction: column;position: absolute;overflow: scroll;justify-content: flex-start;align-items: center;`},
        downloadstyle(){return `position: absolute; bottom: 1rem;background: #0000009c;right: 1rem;padding: .5rem;border: 1px solid #000;border-radius: .5rem;color: #ccc;`},
        scalestyle(){return `overflow: hidden;position: absolute; bottom: 1rem;background: #ffffff1a;color: #cccccc40; cursor: pointer;left: 1rem;padding: .5rem 1rem;border: 1px solid #000;border-radius: 1rem;color: #ccc;`},
        formsstyle(){return `display: flex;justify-content: space-between;align-items: center;width: 200px;overflow:scroll hidden;`},
        formbtnstyle(){return `background: #00000047;height: 2.5rem;display: flex;justify-content: center;align-items: center;margin: 0 .5rem;padding: 0 1.5rem;border-radius: 2rem;border: 1px solid #ffffff3d;`},
        scalebtnstyle(){return`position: absolute;background: #ffffff00;width: 50%;height: 100%;top: 0;`},
        images: [],
        formationArray2d:[],
        cw,
        ch,
        increasing: true,
        title: 'merge',
        ui(){
            this.element = document.createElement('div')
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div style='${this.titlestyle()}'>
                <div style='' class='title'>Form lab - ${this.title}.png</div>
                <div style='${this.formsstyle()}'>
                    <div class='horizontal' style='${this.formbtnstyle()}'>horiontal</div>
                    <div class='vertical' style='${this.formbtnstyle()}'>vertical</div>
                    <div class='x' style='${this.formbtnstyle()}'>x</div>
                    <div class='y' style='${this.formbtnstyle()}'>y</div>
                    <div class='compact' style='${this.formbtnstyle()}'>compact</div>
                </div>
                <div class='exit'style='${this.exitstyle()}'></div>
            </div>
            <div class = 'content' style='${this.contentstyle()}'>
            <canvas class='canvas' style='height: 100%; width: 100%; position: absolute; top: 0; left: 0; background: #000'></canvas>
            </div>
            <div class='download' style='${this.downloadstyle()}'>download(PNG)</div>
            <div class='scale' style='${this.scalestyle()}'>
            <div class='scaletitle'>cw: ${this.cw} ch: ${this.ch}</div>
            <div class='scaledown' style='${this.scalebtnstyle()} left: 0;'></div>
            <div class='scaleup' style='${this.scalebtnstyle()} right: 0;'></div>
            </div>
            `
            document.body.append(this.element)
            this.content = this.element.querySelector('.content')
            this.canvas = this.element.querySelector('.canvas')
            this.canvas.width = 0
            this.canvas.height = 0
            this.ctx = this.canvas.getContext(`2d`)
            this.exit = this.element.querySelector('.exit')
            this.download = this.element.querySelector('.download')
            this.horizontal = this.element.querySelector('.horizontal')
            this.vertical = this.element.querySelector('.vertical')
            this.compact = this.element.querySelector('.compact')
            this.x = this.element.querySelector('.x')
            this.y = this.element.querySelector('.y')
            this.scaleup = this.element.querySelector('.scaleup')
            this.scaledown = this.element.querySelector('.scaledown')
            this.scaletitle = this.element.querySelector('.scaletitle')
            this.titleDiv = this.element.querySelector('.title')
        },
        draw(){
            const {cw, ch} = this.reAssignCanvasSizeToForm2dArray()
            this.ctx.clearRect(0, 0,this.canvas.width, this.canvas.height)
            this.ctx.imageSmoothingEnabled = false
            this.ctx.save()
            this.formationArray2d.forEach((col, y)=>{
                col.forEach((row, x)=>{
                    this.ctx.drawImage(row,x * cw, y * ch, cw ,ch)
                })
            })
            this.ctx.restore()

        },
        downloadCanvas(){
            const a = document.createElement(`a`)
            a.href = this.canvas.toDataURL('image/png')
            a.download = `${this.title}(${this.cw} x ${this.ch}).png`
            a.click()
        },
        reAssignCanvasSizeToForm2dArray(){
            const cw = this.cw
            const ch = this.ch
            const maxX = Math.max(...this.formationArray2d.map(e=>e.length)) 

            if(this.increasing)
            if((maxX * cw) > this.canvas.width)this.canvas.width = maxX * cw
            
            if(!this.increasing)
            this.canvas.width = maxX * cw

            this.canvas.height = this.formationArray2d.length * cw
            //update style
            this.canvas.style.width = this.canvas.width + 'px'
            this.canvas.style.height = this.canvas.height + 'px'

            this.ctx.clearRect(0, 0,this.canvas.width, this.canvas.height)

            return {cw, ch}
        },
        events(){
            this.scaleup.onclick = ()=>{
                this.cw *= 1.2
                this.ch *= 1.2
                this.cw = Math.floor(this.cw)
                this.ch = Math.floor(this.ch)
                this.scaletitle.textContent = `cw: ${this.cw} ch: ${this.ch}`
                this.increasing  = true
                this.draw()
            }
            this.scaledown.onclick = ()=>{
                this.cw /= 1.2 
                this.ch /= 1.2
                this.cw = Math.floor(this.cw)
                this.ch = Math.floor(this.ch)
                this.increasing = false
                this.scaletitle.textContent = `cw: ${this.cw} ch: ${this.ch}`
                this.draw()
            }
            this.exit.onclick =()=>{
                this.element.remove()
            }
            this.titleDiv.onclick  = ()=>{
                feedback(this.element, 'name', (val)=>{
                    this.title= val
                    this.titleDiv.textContent = `Form lab - ${this.title}.png`
                }, 'input')
            }
            this.download.onclick = ()=>{
                this.downloadCanvas()
            }
            this.x.onclick = ()=>{
                this.formationArray2d = []
                for(let y = 0; y< spritelab.images.length; y++){
                    const imageObj = spritelab.images[y]
                    imageObj.getFrames((images)=>{
                        this.formationArray2d.push([...images])
                        if(y === spritelab.images.length -1)this.draw()
                    })
                }
            }
        },
        load(){
            this.ui()
            this.events()
        }
    }
    res.load()
    return res
}
function  ImageInst(imageObj, images){
    const res  ={
        style(){return `position: relative;flex-shrink: 0;width: 98%;height: 5rem;background: #00000063;border: 1px solid #000;border-radius: 10px;margin: .5rem 0;display: flex;justify-content: space-between;align-items: center;padding: 0 .5rem`},
        imagestyle(){return ``},
        nwrapstyle(){return `position: absolute;top: -.2rem;left: 50%;display: flex;gap: .5rem;transform: translateX(-50%);background: transparent;padding: 0.2rem .1px;border-radius: .5rem;backdrop-filter: blur(15px);`},
        nstyle(){return `background: #ffffff1d;border-radius: 22px;`},
        clickstyle(){return `color: #888;font-size: 1rem;text-transform: uppercase;`},
        ui(){
            this.element = document.createElement('div')
            this.element.setAttribute(`style`, this.style())
            this.image = document.createElement('img')
            this.image.setAttribute(`style`, this.imagestyle())
            this.image.src = imageObj.image.src 
            this.click = document.createElement(`div`)
            this.click.textContent = 'input cell size'
            this.click.setAttribute(`style`, this.clickstyle())
            this.element.append(this.image, this.click)
            this.element.innerHTML += `
            <div style='${this.nwrapstyle()}' class='n'>
            <div style='${this.nstyle()}'>nx:${imageObj.nx}</div>
            <div style="${this.nstyle()}">ny:${imageObj.ny}</div>
            <div style="${this.nstyle()}">width:${imageObj.image.width}</div>
            <div style="${this.nstyle()}">height:${imageObj.image.height}</div>
            <div style="${this.nstyle()}">name:${imageObj.name}</div>
            </div>

            `
            images.content.append(this.element)

            this.n = this.element.querySelector('.n')
        },
        events(){
            this.n.onclick = ()=>{
                let cw = 0
                feedback(images.content,'set global cw (look at the image sprite number along x-axis, divide height by it image width)',(val)=>{
                    cw = val
                })
                .after(()=>{
                    feedback(images.content,'set global ch (look at the image sprite number along y-axis, divide height by it image height)',(val)=>{
                        images.images.forEach(image=>{
                            image.nx = Math.floor(image.image.width / cw)
                            image.ny = Math.floor(image.image.height / val)
                            images.cw = cw
                            images.ch = val
                        })
                        images.updateImagesDom()
                    })
                })
            }
            this.click.onclick = ()=>{
                let nx
                feedback(images.content,'set nx',(val)=>{
                    nx = val;
                })
                .after(()=>{
                    feedback(images.content,'set ny', (val)=>{
                        imageObj.ny = val
                        imageObj.nx = nx
                        images.updateImagesDom()
                    })
                })
            }
        },
        load(){
            this.ui()
            this.events()
        }
    }
    res.load()
    return res
}
let e
let b
function feedback(to, message, callback, type='number',placeholder = 'here'){
    const res ={
        style(){return`flex-direction: column;position: fixed;top: 0;left: 50%;padding: .5rem;width: 40%;transform: translateX(-50%);background: #00000024;display: flex;border: 1px solid #ffffff4d;z-index: 100;border-radius: 5px;backdrop-filter: blur(12px);justify-content: space-between;align-items: center;gap: .5rem;`},
        titlestyle(){return`width: 100%;text-align: center;font-size: 1.2rem;color: #ccc; text-transform: capitalize`},
        inputstyle(){return`width: 80%; background: #f7f7f714;border: 1px solid #fff;height: 2rem;border-radius: 1rem;padding: .2rem;color: #fff;`},
        bgstyle(){return `position: absolute;top: 0;left: 0;width: 100%;height: 100%;`},
        ui(){
            if(e)e.remove()
            this.element = document.createElement(`div`)
            e = this.element
            this.title  = document.createElement(`div`)
            this.title.textContent = message
            this.input  = document.createElement(`input`)
            this.input.type = type
            this.input.placeholder = placeholder
            if(b)to.querySelectorAll('.bg').forEach(bg=>(bg)?bg.remove():null)
            this.bg  = document.createElement(`div`)
            this.bg.classList.add('bg')
            b = this.bg
            this.bg.setAttribute(`style`, this.bgstyle())
            this.title.setAttribute(`style`, this.titlestyle())
            this.input.setAttribute(`style`, this.inputstyle())
            this.element.setAttribute(`style`, this.style())
            this.element.append(this.title, this.input)
            to.append(this.bg,this.element)
            this.input.focus()
        },
        remove(){
            // to.querySelectorAll('.bg').forEach(bg=>bg.remove())
            this.element.remove()
        },
        events(){
            this.bg.onclick = ()=> {
                if(this.input.value.trim('') !== '')
                callback((type === 'number')?+(this.input.value): this.input.value)
                if(this.aftercallback)this.aftercallback()
                this.remove()
            }
        },
        after(callback){
            this.aftercallback = callback
        },
        load(){
            this.ui()
            this.events()
        }
    }
    res.load()
    return res
}
function SpriteImage({image, name}){
    const res = {
        image, 
        name,
        nx: 5, ny: 1,
        getFrames(callback = ()=>{}){
            const images = []
            const urls = []
            const sw = image.width / this.nx
            const sh = image.height/ this.ny
            for(let y = 0; y < this.ny; y++){
                for(let x= 0; x< this.nx; x++){
                    const sx = sw * x
                    const sy = sh * y
                    const canvas = document.createElement('canvas')
                    canvas.width = image.width
                    canvas.height = image.height
                    const ctx = canvas.getContext('2d')
                    ctx.imageSmoothingEnabled = false
                    ctx.drawImage(
                        this.image,
                        sx, sy,
                        sw, sh,
                        0, 0,
                        image.width, image.height
                    )
                    const url = canvas.toDataURL('image/png')
                    urls.push(url)
                }
            }
            let imgs = 0
            urls.forEach(url=>{
                const image = new Image()
                image.onload = ()=>{
                    imgs ++
                    if(imgs === urls.length){
                        callback(images, this)
                    }
                }
                image.src = url
                images.push(image)
            })
            return images
        },
    }
    return res
}

// setInterval(())