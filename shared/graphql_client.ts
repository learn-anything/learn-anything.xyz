import * as s from "solid-js"

import * as gql from "./graphql_queries.js"

export * from "./graphql_queries.js"

/**
 * GLOBAL URL
 */
let request_url = ""

export function set_request_url(url: string): void {
	request_url = url
}

async function raw_request<T = never>(query: string): Promise<T | Error> {
	try {
		const res = await fetch(request_url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: '{"query":'+JSON.stringify(query)+'}',
		})
		const json = await res.json()
		if (json.errors) {
			return new Error(json.errors[0].message)
		}
		return json.data
	} catch (err) {
		if (err instanceof Error) {
			return err
		}
		if (typeof err === "string") {
			return new Error(err)
		}
		return new Error("Unknown error")
	}
}

export type GraphQLClient = {
	onError: (err: Error) => void
}

const graphql_client_fallback: GraphQLClient = {
	onError: (err: Error) => {
		console.error(err)
	},
}
export const GraphQLClientContext = s.createContext<GraphQLClient>(graphql_client_fallback)

const cache = new Map<string, any>()

type Operation = {
	name   : string,
	kind   : gql.Operation_Kind,
	query  : string,
	resolve: (res: any) => void,
}

const operations_pending = new Map<string, Operation[]>()
let operations_scheduled = false

async function flush_operations(): Promise<void> {
	operations_scheduled = false

	const body = {
		query   : "",
		mutation: "",
	}
	const operations_copy: Operation[] = []

	for (const operations of operations_pending.values()) {
		if (operations.length === 1) {
			const operation = operations[0]!
			body[operation.kind] += operation.query + "\n"
			operations_copy.push(operation)
		} else {
			/*
			Operations of the same name need to be renamed to avoid conflicts
			e.g.
			foo_bar:   foo_bar(){...}
			foo_bar_1: foo_bar(){...}
			foo_bar_2: foo_bar(){...}
			*/
			for (const operation of operations) {
				body[operation.kind] += operation.name + ":" + operation.query + "\n"
				operations_copy.push(operation)
			}
		}
	}
	operations_pending.clear()

	let query = ""
	if (body.query)    query += "query"   +"{"+body.query   +"}"
	if (body.mutation) query += "mutation"+"{"+body.mutation+"}"
	
	const res = await raw_request<Record<string, any>>(query)
	if (res instanceof Error) {
		for (const operation of operations_copy) {
			operation.resolve(res)
		}
	} else {
		for (const operation of operations_copy) {
			const value = res[operation.name]
			operation.resolve(value)
		}
	}
}

function schedule_operation<TValue>(
	name   : string,
	kind   : gql.Operation_Kind,
	query  : string,
): Promise<TValue> {
	let resolve!: (res: TValue) => void
	const promise = new Promise<TValue>((res) => resolve = res)

	const operation: Operation = {name, kind, query, resolve}

	const pending = operations_pending.get(name)
	if (pending) {
		operation.name = name + "_" + pending.length
		pending.push(operation)
	} else {
		operations_pending.set(name, [operation])
	}

	if (!operations_scheduled) {
		operations_scheduled = true
		queueMicrotask(flush_operations)
	}

	return promise
}

/**
 * @example
 * ```tsx
 * const [links] = gql.useResource(gql.query_routesProfile, {email: "example@fake.com"})
 *
 * <For each={links()}>
 *     {(link) => <a href={link.url}>{link.title}</a>}
 * </For>
 * ```
 */
export function useResource<TVars, TValue>(
	query_data: gql.Query_Data<TVars, TValue>,
	vars: TVars, // Vars cannot be reactive, because they are used as a cache key
): s.InitializedResourceReturn<TValue>
{
	const client = s.useContext(GraphQLClientContext)

	const query  = query_data.get_body(vars)
	const cached = cache.get(query) as TValue | undefined
	const initial_value = cached ?? query_data.initial_value

	return s.createResource(async () => {
		const res = await schedule_operation<TValue>(query_data.name, query_data.kind, query)
		if (res instanceof Error) {
			client.onError(res)
			throw res
		}
		cache.set(query, res)
		return res
	}, {
		initialValue: initial_value,
	}) as any
}

export async function request<TVars, TValue>(
	client: GraphQLClient,
	query_data: gql.Query_Data<TVars, TValue>,
	vars: TVars,
): Promise<TValue | Error> {
	const res = await schedule_operation<TValue>(query_data.name, query_data.kind, query_data.get_body(vars))
	if (res instanceof Error) {
		client.onError(res)
	}
	return res
}

/**
 * @example
 * ```tsx
 * const createUser = gql.useRequest(gql.mutation_createUser)
 *
 * const res = await createUser({email: "example@fake.com"})
 * if (res instanceof Error) {
 *     console.error("Couldn't create a user:", res)
 * } else {
 *     console.log("New user:", res)
 * }
 * ```
 */
export function useRequest<TVars, TValue>(
	query_data: gql.Query_Data<TVars, TValue>,
): (vars: TVars) => Promise<TValue | Error> {
	const client = s.useContext(GraphQLClientContext)
	return (vars) => request(client, query_data, vars)
}
