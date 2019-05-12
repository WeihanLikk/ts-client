import * as THREE from "three"
import { w3cwebsocket } from "websocket";
import { Basemap } from "./basemap";
import BasemapRoadItem from "./basemap/roadItem";
import { BuildingManager } from "./building/manager";
import BasemapBuildingItem from "./basemap/buildingItem";

class Var {
    static id: number = 0
    public ID = Var.id++
    constructor(public done: boolean = false) { }
}
let last = new Var(true)

const basemap = new Basemap<{}, {}>()
const manager = new BuildingManager()
class WebSocket {
    public readonly socket: w3cwebsocket
    readonly host: string
    readonly port: number

    constructor(host: string, port: number) {
        this.host = host
        this.port = port

        const conn = `ws://${this.host}:${this.port}/`

        this.socket = new w3cwebsocket(conn)

        this.socket.onopen = () => {
            console.log("[Socket] connection established.")
            this.socket.send(JSON.stringify({
                type: "Message",
                data: {
                    info: "__ts_client"
                }
            }, null, 4))
        }


        this.socket.onmessage = (msg) => {
            const msgData = JSON.parse(msg.data)
            console.log(`[Socket] receive ${msg.data}.`)
            const { type, data } = msgData

            if (type == "Synchronization Data") {
                const lastVar = last
                const selfVar = new Var()
                last = selfVar

                const triggerMainLoop = () => {
                    if (!lastVar.done) setTimeout(triggerMainLoop, 0)
                    else {
                        console.log(`begin to resolve msg ${data.info}`)
                        const resolve = (): Promise<boolean> => {
                            return new Promise((resolve, reject) => {
                                if (data.roads != null) {
                                    const { from, to, width } = data.roads[0]
                                    const fromVec = new THREE.Vector2(from.x, from.y)
                                    const toVec = new THREE.Vector2(to.x, to.y)
                                    const roadItem: BasemapRoadItem<{}> = new BasemapRoadItem<{}>(width, fromVec, toVec)
                                    const valid = basemap.alignRoad(roadItem)
                                    if (valid) basemap.addRoad(width, fromVec, toVec)
                                    resolve(valid)
                                }
                                else if (data.buildings != null) {
                                    const { prototype, center } = data.buildings[0]
                                    const proto = manager.get(prototype)
                                    const pos = new THREE.Vector2(center.x, center.y)
                                    const modelInfo = basemap.alignBuilding(pos, proto.placeholder)
                                    const { road, angle, valid, offset } = modelInfo
                                    // component.locateBuilding()
                                    if (valid) basemap.addBuilding(new BasemapBuildingItem(proto, center, angle, road, offset))
                                    resolve(valid)
                                }
                            })
                        }
                        resolve().then((valid: boolean) => {
                            const DATA = {
                                type: "Message",
                                data: {
                                    info: "State check",
                                    valid: valid,
                                    roads: data.roads,
                                    buildings: data.buildings
                                }
                            }
                            this.socket.send(JSON.stringify(DATA, null, 4))
                            console.log(`resolve ${data.info} done`)
                            selfVar.done = true
                        })
                    }
                }
                triggerMainLoop()
            }
        }

        this.socket.onclose = () => {
            console.log("[Socket] connection closed.")
        }
    }
}


const ws = new WebSocket("pi.koishi.top", 8899)

