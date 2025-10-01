import { FileFolder } from "../../components/DRAW/folder.js"

export function Library(domRefObj = null, val){
    const res = {
        domRefObj,
        libs: {},
        paths: [],//SHOWS THAT IS A REPO AND NOT A FOLDER
        clipboard: {},
        paste(foldername){
            const keys = Object.keys(this.clipboard)
            keys.forEach(key =>{
                this.writeFolder(foldername, key, this.clipboard[key])
            })
            this.clipboard = {}
        },
        cut(name){
            this.find(name, (obj, name)=>{
                this.clipboard[name] = obj
                this.delete(name)
            })
        },
        copy(name){
            this.find(name, (obj, name)=>{
                this.clipboard[name + `(copy)`] = obj
            })
        },
        moveup(){},
        movedown(){},
        duplicate(name){
            const find = this.find(name, (object, key)=>{
                
            })
            const obj = find.object
            const newname = find.name + `(copy)`
            find.object.meta.Parent[newname] = {...obj}
            find.object.meta.Parent[newname].meta.name = newname
        },
        addFolder(name, foldername,){
            let obj
            const func = function(libs){
                for(let x in libs){
                    if(x === `meta`)continue
                    if(!Object.keys(libs[x]).includes(`meta`))continue // IF DOESNT CONTAIN META
                    if(typeof libs[x] === `object`){
                        if(x === foldername)
                        obj = libs[x]
                        func(libs[x])
                    }
                }
            } 
            if(foldername === `` || foldername ==='/')obj = this.libs
            else func(this.libs)

            if(obj){
                obj[name] = {}
                obj[name][`meta`] = {
                    'Type' : 'Folder', name,
                    'Parent': this.find(foldername).object,
                    'ContentType': `datafolder`,
                }
            }
            this.updateDom()
            return  name
        },
        addFile(name, foldername, type = `datafile`){
             let obj
            const func = function(libs){
                for(let x in libs){
                    if(x === `meta`)continue
                    if(!libs[x])break
                    if(!Object.keys(libs[x]).includes(`meta`))continue // IF DOESNT CONTAIN META
                    if(typeof libs[x] === `object`){
                        if(x === foldername)
                        obj = libs[x]
                        func(libs[x])
                    }
                }
            } 
            if(foldername === `` || foldername ==='/')obj = this.libs
            else func(this.libs)

            if(obj){
                obj[name] = {}
                obj[name][`meta`] = {
                    'Type' : 'File', name,
                    'Parent': this.find(foldername).object,
                    'ContentType': type
                }
            }
            this.updateDom()
            return foldername
        },
        writeFolder(name, key, content, ){
            const write =  this.find(name).object
            write.meta[key] = content
        },
        writeFile(name, key, content, ){
            const write =  this.find(name, (object, k)=>{
                object[key] = content
            })
        },
        updateDom(dom){
            if(!dom) dom = document.querySelector(`.repo`)
            if(!dom)return
            dom.innerHTML =    ``
            let domObjs = []
            const update = (obj, dom)=>{
                for(let x in obj){
                    if(x === `meta`)continue
                    if(!obj[x])return
                    if(!Object.keys(obj[x]).includes(`meta`))continue // IF DOESNT CONTAIN META
                    if(typeof obj[x] === `object`){
                        const domObj = FileFolder(dom, x, obj[x], obj[x].meta['Type'])
                        domObjs.push(domObj)
                        update(obj[x], domObj.dom.content)
                    }
                }
            }
            update(this.libs, dom)
            domObjs.forEach(domObj=>{
                domObj.close()
            })
        },
        delete(name){
            const find = this.find(name,(object, key, )=>{
                delete object.meta.Parent[key]
            })
            this.updateDom()
        },
        rename(name, to){
            const find = this.find(name,(object, key,)=>{
                const obj = object
                obj.meta.name = to
                delete object.meta.Parent[key]
                object.meta.Parent[to] = obj
            })
            this.updateDom()
        },
        find(name, call = ()=>{}){
            
                //FIND BY NAME
                //SELECT OBJ IF OBJ IS ABSENCE, OBJ = LIBS
                let object, key
                //LOOP THROUGH OBJ RECURSIVELY WITH NEW OBJ USED EACH INSTANCE
                //ENCLOSED IN ANOTHER OBJECT SO THAT FIND `f` WILL BE AVAILBLE AT THE END OF RECURSION
                const find = (libs)=>{
                    for(let x in libs){
                        if(x === `meta`)continue
                        if(!libs[x])break
                        if(!Object.keys(libs[x]).includes(`meta`))continue // IF DOESNT CONTAIN META
                        if(typeof libs[x] === `object`){
                            if(x === name){
                                object = libs[x]
                                key = x
                                call(libs[x], x)
                                break
                            }
                            find(libs[x])
                        }
                    }
                }
                //CALL
                find(this.libs)
                //RETURN FIND `F`
                return {object, name: key} 

        },
        load(){}
    }
    res.load()
    return res
}
