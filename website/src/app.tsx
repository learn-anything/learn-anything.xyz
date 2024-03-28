import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { ErrorBoundary, For, Suspense, createSignal } from "solid-js"
import "./app.css"
import * as gql from "../../shared/graphql_client"

export default function App() {
	const [errors, setErrors] = createSignal<Error[]>([])

	function addError(err: Error) {
		setErrors((prev) => [...prev, err])
		setTimeout(() => {
			setErrors((prev) => prev.filter((e) => e !== err))
		}, 2000)
	}

	const gql_client: gql.GraphQLClient = {
		onError: addError,
	}
	gql.set_request_url("http://127.0.0.1:4000/graphql")

	return (
		<ErrorBoundary fallback={(err, reset) => (
			<div>
				<h1>Error</h1>
				<pre style={"color: red"}>{err.message}</pre>
				<button type="button" onClick={reset}>Reset</button>
			</div>
		)}>
			<Router
				root={(props) => (
					<gql.GraphQLClientContext.Provider value={gql_client}>
						<div class="fixed top-0 right-0">
							<For each={errors()}>
								{(err) => <div class="bg-red-500 text-white p-2 m-2 rounded">{err.message}</div>}
							</For>
						</div>
						<Suspense>{props.children}</Suspense>
					</gql.GraphQLClientContext.Provider>
				)}
			>
				<FileRoutes />
			</Router>
		</ErrorBoundary>
	)
}
