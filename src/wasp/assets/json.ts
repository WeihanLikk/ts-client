import { Asset } from "./asset"
import * as FS from "fs"

export class JsonAsset extends Asset<{ [key: string]: any }> {
	constructor(path: string) { super(path) }
	load(): Promise<{ [key: string]: any }> {
		return new Promise((resolve, reject) => {
			const file = FS.readFile(this.path, (err, data) => {
				if (err) {
					reject(err)
					console.log("Failed to open json")
				}
				resolve(JSON.parse(data.toString()))
			})
		})
	}
}