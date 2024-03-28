import {isServer} from "./platform"

class UnknownError extends Error {
	constructor() {
		void super("Unknown Error")
	}
}

export function open(
	name: string,
): Promise<IDBDatabase | DOMException | UnknownError> {
	const version = 1
	const request = indexedDB.open(name, version)

	request.onupgradeneeded = () => {
		request.result.createObjectStore(name)
	}

	return new Promise(resolve => {
		request.onsuccess = () => {
			resolve(request.result)
		}
		request.onerror = () => {
			resolve(request.error || new UnknownError())
		}
	})
}

export function close(
	db: IDBDatabase,
): void {
	db.close()
}

export function store(
	db: IDBDatabase,
	name: string,
): IDBObjectStore {
	return db.transaction([name], "readwrite").objectStore(name)
}

export function put(
	db   : IDBDatabase,
	name : string,
	key  : string,
	value: unknown,
): Promise<null | DOMException | UnknownError> {
	const result = db.transaction([name], "readwrite").objectStore(name).put(value, key)

	return new Promise(resolve => {
		result.onsuccess = () => {
			resolve(null)
		}
		result.onerror = () => {
			resolve(result.error || new UnknownError())
		}
	})
}

export function get(
	db  : IDBDatabase,
	name: string,
	key : string,
) {
	const result = db.transaction([name]).objectStore(name).get(key)

	return new Promise(resolve => {
		result.onsuccess = () => {
			resolve(result.result)
		}
		result.onerror = () => {
			resolve(result.error || new UnknownError())
		}
	})
}

const IDB_NAME = "graphql_cache"
const IDB_VERSION = 1
const IDB_STORE_NAME = "cache"

let object_store: IDBObjectStore | null = null

export function setupIDB(onError: (err: Error) => void): void {
	if (isServer) return

	if (!("indexedDB" in window)) {
		console.warn("IndexedDB is not supported")
		return
	}

	const request = indexedDB.open(IDB_NAME, IDB_VERSION)

	request.onupgradeneeded = () => {
		request.result.createObjectStore(IDB_STORE_NAME)
	}
	request.onsuccess = () => {
		object_store = request.result.transaction(IDB_STORE_NAME, "readwrite").objectStore(IDB_STORE_NAME)
	}
	request.onerror = () => {
		onError(new Error("Couldn't open the indexedDB"))
	}
}