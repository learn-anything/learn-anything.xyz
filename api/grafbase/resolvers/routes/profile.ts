import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"

// const routeResolver: Resolver["Mutation.createUser"] = async (
const routeResolver = async (parent: unknown, args: unknown, context: unknown, info: unknown) => {
	try {
		// const email = await emailFromHankoToken(context)
		const email = "nikita@nikiv.dev"
		if (email) {
			return {
				links: [
					{ title: "Solid", url: "https://solidjs.com" },
					{ title: "GraphQL", url: "https://graphql.org" },
				],
				showLinksStatus: "Learning",
				filterOrder: "Custom",
				filter: "None",
				userTopics: ["Solid", "GraphQL"],
				user: {
					email: "github@nikiv.dev",
					name: "Nikita",
				},
			}
		}
	} catch (err) {
		console.error(err)
		throw new GraphQLError(JSON.stringify(err))
	}
}

export default routeResolver
