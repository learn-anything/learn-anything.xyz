import * as edgedb from "edgedb"

export const client = edgedb.createHttpClient({
	tlsSecurity: process.env.LOCAL ? "insecure" : "strict",
})
