import { DistUnit } from "../basemap";
import { JsonAsset } from "../wasp";
import * as THREE from "three"

interface TransformStep {
	rotate?: number[],
	translate?: number[]
}

interface BuildingDefination {
	name: string,
	model: string,
	scale?: number[] | number,
	transform?: TransformStep[],
	placeholder: number[]
}

export class BuildingPrototype {



	readonly object: {
		model: THREE.Object3D,
		floor: THREE.Object3D,
		frame: THREE.Object3D
	} = <any>{}

	constructor(readonly name: string,
		readonly placeholder: THREE.Vector2
	) { }

	private static transformObject(obj: THREE.Object3D, trans: TransformStep[]) {
		for (let tr of trans) {
			if (tr.rotate) {
				obj.rotateX(tr.rotate[0])
				obj.rotateY(tr.rotate[1])
				obj.rotateZ(tr.rotate[2])
			}
			if (tr.translate) {
				obj.translateX(tr.translate[0])
				obj.translateY(tr.translate[1])
				obj.translateZ(tr.translate[2])
			}
		}
	}

	private static scaleObject(obj: THREE.Object3D, scale: number[] | number) {
		if (typeof scale == "number") {
			obj.scale.set(scale, scale, scale)
		} else {
			obj.scale.set(scale[0], scale[1], scale[2])
		}
	}

	private static adjustObject(obj: THREE.Object3D, def: BuildingDefination) {
		!def.transform || BuildingPrototype.transformObject(obj, def.transform)
		!def.scale || BuildingPrototype.scaleObject(obj, def.scale)
		obj.scale.multiplyScalar(DistUnit)
		obj.translateY(-new THREE.Box3().setFromObject(obj).min.y)
	}

	private static frameMaterial = new THREE.MeshPhongMaterial({
		color: 0xeeeeee,
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 0.3,
		displacementScale: 1e-4,
		flatShading: true		// hard edges
	})
	private static planeMaterial = new THREE.MeshPhongMaterial({
		color: 0x156289,
		side: THREE.DoubleSide,
		displacementScale: 1e-4,
		flatShading: true		// hard edges
	})

	static async load(path: string): Promise<BuildingPrototype> {

		return new Promise((resolve, reject) => {
			new JsonAsset(path).load().then(json => {
				const def = <BuildingDefination>json
				const proto = new BuildingPrototype(def.name, new THREE.Vector2(def.placeholder[0], def.placeholder[1]))
				resolve(proto)
			})
		})
	}
}

export class BuildingManager {

	private readonly createdTime = new Date().getTime()

	constructor(assets: string[] = []) {
		// console.log("%cnew BuildingManager()", "background: #000; color: #ffffff")
		// console.log(this)
		this.load(assets)
	}

	private readonly resources = new Map<string, BuildingPrototype>()
	private _ready: boolean = false

	private _requests: number = 0
	private _finishedRequests: number = 0

	get ready() { return this._ready }

	get requests() { return this._requests }
	get finishedRequests() { return this._finishedRequests }

	private clear() {
		this.resources.clear()
	}

	load(path: string[] | string): Promise<(BuildingPrototype | undefined)[]> {

		console.log("%c[Building Manager] Loading buildings...", "background: #00cc00; color: #fff")
		// console.log(path)

		const paths = (typeof path == "string") ? [path] : path
		this._requests = paths.length
		this._finishedRequests = 0

		this._ready = false

		return new Promise((resolve, reject) => {

			const RES = (protos: (BuildingPrototype | undefined)[]) => {

				for (let proto of protos) {
					if (proto) {
						if (this.resources.has(proto.name)) {
							console.warn(`Prototype with name ${proto.name} already exists.`)
						} else {
							this.resources.set(proto.name, proto)
						}
					}
				}
				this._ready = true

				resolve(protos)
			}

			let jobs = paths.length
			const buildings: (BuildingPrototype | undefined)[] = []
			const res = (e: BuildingPrototype, idx: number) => {
				this._finishedRequests++
				buildings[idx] = e;
				(--jobs == 0) && RES(buildings)
			}
			const rej = (e: any, idx: number) => {
				this._finishedRequests++
				buildings[idx] = undefined;
				(--jobs == 0) && RES(buildings)
			}
			paths.forEach((path: string, idx: number) =>
				BuildingPrototype.load(path.match(/\/index.json$/i) ?
					path : path + "/index.json")
					.then(e => res(e, idx), e => rej(e, idx)))

			console.log("%c[Building Manager] Buildings all loaded.", "background: #00cc00; color: #fff")
		})
	}

	get(name: string): BuildingPrototype | undefined {
		return this.resources.get(name)
	}

}
