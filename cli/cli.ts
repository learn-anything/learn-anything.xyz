import { getUsers } from "../api/edgedb/crud/user"

async function cli() {
	const users = await getUsers()
	console.log(users)
}

cli()
