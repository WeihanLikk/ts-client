import { BuildingManager, BuildingPrototype } from "./manager";
import * as THREE from "three"

export class BuildingManagerComponent {

	public readonly manager: BuildingManager = new BuildingManager()

	load(...path: string[]) {
		; (<any>this).finish = false
		this.manager.load(path)
			.then(() => { ; (<any>this).finish = true })
	}
}
const manager = new BuildingManagerComponent()

export class BuildingComponent {


	private static readonly validColor = new THREE.Color(0.44, 0.52, 0.84).multiplyScalar(2)
	private static readonly invalidColor = new THREE.Color(0.8, 0.3, 0.2).multiplyScalar(2)

	public readonly proto: BuildingPrototype

	constructor(public readonly name: string) { }
	init() {
		; (<any>this).proto = manager.manager.get(this.name)

		if (this.proto) {

			const mat =
				new THREE.MeshPhongMaterial({
					side: THREE.DoubleSide,
					color: BuildingComponent.invalidColor,
					opacity: 0.6,
					transparent: true,
				})
			// new THREE.MeshBasicMaterial({ color: 0xff0000 })
			const ind = this.proto.object.model.clone()
			ind.traverse(e => {
				const f = <THREE.Mesh>e
				if (f.isMesh) {
					f.material = mat
				}
			})

		} else {
			console.error(`invalid building type: ${this.name}`)
		}
	}

}