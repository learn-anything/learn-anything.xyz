import { ErrorBoundary, Suspense } from "solid-js"

export default function Pricing() {
	// const [links] = gql.createQuery<gql.Value_routesProfile>(
	// 	gql.query_body_routesProfile(),
	// )

	return (
		<Suspense fallback={<>Loading...</>}>
			<h1>Pricing</h1>
			<ErrorBoundary fallback={<>error</>}>
				<div>pricing</div>
				{/* <For each={links()?.routesProfile ?? []}>
					{(link) => (
						<>
							<div>
								<a href={link.url}>{link.title}</a>
							</div>
						</>
					)}
				</For> */}
			</ErrorBoundary>
		</Suspense>
	)
}
