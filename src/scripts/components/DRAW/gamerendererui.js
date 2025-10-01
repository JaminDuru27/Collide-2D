import JSZip from "jszip"
import { EventHandler } from "../../functions.js/DRAW/events.js"
import { GUI } from "../../functions.js/DRAW/gui.js"
import { draw } from "../../functions.js/DRAW/instances.js"
import { download, fetchImageAsBuffer } from "../../functions.js/DRAW/zipper.js"
import { getExportHTML } from "../../Game/html.js"
import { domextract } from "./domextract.js"
import { getExportStyle } from "../../Game/style.js"
import { getExportMain } from "../../Game/main.js"
import { getExportLevel } from "../../Game/level.js"
import { getExportImageLayers } from "../../Game/bg.js"
import { getLevelCollision } from "../../Game/levelCollisions.js"
import { getExportWorld } from "../../Game/world.js"
import { getExportRect } from "../../Game/rect.js"
import { getExportGravity } from "../../Game/gravity.js"
import { getExportHealthBar } from "../../Game/healthbar.js"
import { getExportControls } from "../../Game/controls.js"
import { getExportSprite } from "../../Game/sprite.js"
import { getExportStateManager } from "../../Game/statemanager.js"
import { getExportPlayer } from "../../Game/player.js"
import { getExportEnemy } from "../../Game/enemy.js"
import { getExportParticle } from "../../Game/particle.js"
import { getExportAnimation } from "../../Game/animations.js"

export function GameUI(Game, to){
    const res = {
        parallaxbg: false,
        name: '',
        style(){return `transition: .3s ease;position: absolute;top:0;right: 0; background: rgb(0 0 0 / 8%);backdrop-filter: blur(16px); width: 15rem; border-radius: 5px; height: 100vh; padding: 5px `},
        titleStyle(){return `color: #fff`},
        closeStyle(){return `background: #fff; width: 5rem; height: 5rem; position: absolute; border-radius: 50%; top: 50%; left: -6rem; opacity: .5; `},
        contentStyle(){return ``},
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`gameui`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div class = 'close' style='${this.closeStyle()}'></div>
            <div class = 'content' style='${this.contentStyle()}'></div>
            `
            to.append(this.element)
            domextract(this.element, 'classname', this)
        },
        events(){
            let toggle = 1
            EventHandler(to, '', 'mousemove', (e)=>{
                if(e.clientX > window.innerWidth - 200){
                    this.element.style.opacity = `1`
                }
            })
            EventHandler(this.dom.close, 'closeopen', 'click', ()=>{
                this.element.style.opacity = `0`
            })
        },
        gui(){
            this.gui = GUI('User Options', this.element)
            this.gui.add(this, 'name', 'name')
            this.gui.add(this, 'parallaxbg', 'parallaxbg')
            .after = ()=>{
                if(this.parallaxbg)Game.bg.parallaxmode()
                if(!this.parallaxbg)Game.bg.normalmode()
            }
            this.gui.add(this, 'download', 'compile & download')
        },
        async download(){
            const zip =  new JSZip()
            const index = getExportHTML(draw.instance.name, [
                // 'player.js', 
                // 'world.js', 
                // 'controls.js', 
                // 'functions.js', 
                'player/animations.js',
                'world/particle.js',
                'world/gravity.js',
                'world/rect.js',

                'player/sprite.js',
                'player/statesManager.js',
                'player/health.js',
                'player/controls.js',
                'player/enemy.js',
                'player/player.js',

                'world/collisionDatas.js',
                'world/world.js',
                'world/background.js',
                'world/level.js', 
                'index.js', 

            ])
            const style = getExportStyle()
            const collisionData = getLevelCollision().addData('level1data', JSON.stringify(Game.world.data))
            const assets = zip.folder('assets')
            const other = zip.folder('other') //functions, utils, ui
            const world = zip.folder('world') //Level, background, world, collisionData,  gravity
            const player = zip.folder('player') //spriteHandler, Rect, Player, Controls, HealthBar, StateMan,  
            //ui
            zip.file('index.html', index)
            zip.file('style.css', style.generate())
            //animations
            player.file('animations.js', getExportAnimation())


            
            //enemy
            player.file('enemy.js', getExportEnemy())

            //player
            player.file('player.js', getExportPlayer())

            //sprite
            player.file('sprite.js', getExportSprite())

            //statemanager
            player.file('statesManager.js', getExportStateManager())

            //controls
            player.file('controls.js', getExportControls())

            //healthBar
            player.file('health.js', getExportHealthBar())
            
            //gravity
            world.file('particle.js', getExportParticle())

            //gravity
            world.file('gravity.js', getExportGravity())

            //collisionData.js
            world.file('collisionDatas.js', collisionData.generate())
            
            //rect.js
            world.file('rect.js', getExportRect())
                    
            //world.js
            world.file('world.js', getExportWorld())
            
            
            //background.js
            world.file('background.js', getExportImageLayers({
                bgs: Game.bg.backLayer.length, 
                mgs: Game.bg.middleLayer.length, 
                fgs: Game.bg.frontLayer.length
            }).generate())

            //level.js
            world.file('level.js', getExportLevel())

            //index.js
            zip.file('index.js', getExportMain(draw.instance.name, Game.w, Game.h, Game.cw, Game.ch))

            //assets
            Game.bg.backLayer.forEach(async({img}, x)=>{//backlayer
                const blob = fetchImageAsBuffer(img.src)
                assets.file(`bg${x + 1}.png`, blob)
            })
            Game.bg.middleLayer.forEach(async({img}, x)=>{//midlayer
                const blob = fetchImageAsBuffer(img.src)
                assets.file(`mg${x + 1}.png`, blob)
            })
            Game.bg.frontLayer.forEach(async({img}, x)=>{ //frontlayer
                const blob = fetchImageAsBuffer(img.src)
                assets.file(`fg${x + 1}.png`, blob)
            })
            
            assets.file('icon.png', await fetchImageAsBuffer(`./assets/icons/logo.png`)) //icon
            assets.file('player.png',await fetchImageAsBuffer(Game.player.sprite.image.src))//player 


            download(zip, draw.instance.name)
        },
        load(){
            this.ui()
            this.events()
            this.gui()
        }
    }
    res.load()
    return res
}