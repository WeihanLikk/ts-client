import { Asset } from "./asset"

export class JsonAsset extends Asset<{ [key: string]: any }> {
	constructor(path: string) { super(path) }
	load(): Promise<{ [key: string]: any }> {
		return new Promise((resolve, reject) => {
			try {
				resolve(JSON.parse(this.path))
			}
			catch (err) {
				reject(err)
				console.log("Fail to open json")
			}
		})
	}
}