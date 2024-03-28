import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function getUsers() {
	const res = await e
		.select(e.User, () => ({
			name: true,
			email: true,
			id: true,
		}))
		.run(client)
	return res
}
