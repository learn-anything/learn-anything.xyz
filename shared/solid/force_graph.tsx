import * as solid from "solid-js"
import { isServer } from "solid-js/web"
import type * as client from "./force_graph_client.jsx"

/**
 * Lazy-loaded force graph
 */
export function ForceGraph(props: client.ForceGraphProps): solid.JSX.Element {
  const [clientModule] = solid.createResource(
    !isServer,
    () => import("./force_graph_client.jsx")
  )

  return (
    <solid.Suspense>
      {(() => {
        const client_module = clientModule()
        if (!client_module) return ""
        return client_module.createForceGraph(props)
      })()}
    </solid.Suspense>
  )
}
