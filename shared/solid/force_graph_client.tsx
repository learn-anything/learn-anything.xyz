import * as s from "solid-js"
import * as fg from "@nothing-but/force-graph"
import { Ease, Trig } from "@nothing-but/utils"
import { useWindowSize } from "@solid-primitives/resize-observer"
import * as schedule from "@solid-primitives/scheduled"

export type RawNode = {
  name: string
  prettyName: string
  connections: string[]
}

type HSL = [hue: number, saturation: number, lightness: number]

const COLORS: readonly HSL[] = [
  [3, 86, 64],
  [31, 90, 69],
  [15, 87, 66]
]

/* use a plain object instead of Map for faster lookups */
type ColorMap = { [key: string]: string }
type HSLMap = Map<fg.graph.Node, HSL>

const MAX_COLOR_ITERATIONS = 10

/**
 * Add a color to a node and all its connected nodes.
 */
const visitColorNode = (
  prev: fg.graph.Node,
  node: fg.graph.Node,
  hsl_map: HSLMap,
  add: HSL,
  iteration: number = 1
): void => {
  if (iteration > MAX_COLOR_ITERATIONS) return

  const color = hsl_map.get(node)

  if (!color) {
    hsl_map.set(node, [...add])
  } else {
    const add_strength = MAX_COLOR_ITERATIONS / iteration
    color[0] = (color[0] + add[0] * add_strength) / (1 + add_strength)
    color[1] = (color[1] + add[1] * add_strength) / (1 + add_strength)
    color[2] = (color[2] + add[2] * add_strength) / (1 + add_strength)
  }

  for (const edge of node.edges) {
    const other_node = edge.a === node ? edge.b : edge.a
    if (other_node === prev) continue
    visitColorNode(node, other_node, hsl_map, add, iteration + 1)
  }
}

const generateColorMap = (nodes: readonly fg.graph.Node[]): ColorMap => {
  const hls_map: HSLMap = new Map()

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!
    const color = COLORS[i % COLORS.length]!
    visitColorNode(node, node, hls_map, color)
  }

  const color_map: ColorMap = {}
  for (const [node, [hue, saturation, lightness]] of hls_map.entries()) {
    color_map[node.key as string] = `${hue} ${saturation}% ${lightness}%`
  }

  return color_map
}

const generateNodesFromRawData = (
  raw_data: RawNode[]
): [fg.graph.Node[], fg.graph.Edge[]] => {
  const nodes_map = new Map<string, fg.graph.Node>()
  const edges: fg.graph.Edge[] = []

  for (const raw of raw_data) {
    const node = fg.graph.zeroNode()
    node.key = raw.name
    node.label = raw.prettyName
    nodes_map.set(raw.name, node)
  }

  for (const raw of raw_data) {
    const node_a = nodes_map.get(raw.name)!

    for (const name_b of raw.connections) {
      const node_b = nodes_map.get(name_b)!
      const edge = fg.graph.connect(node_a, node_b)
      edges.push(edge)
    }
  }

  const nodes = Array.from(nodes_map.values())

  fg.graph.randomizeNodePositions(nodes, graph_options.grid_size)

  return [nodes, edges]
}

const filterNodes = (
  graph: fg.graph.Graph,
  nodes: readonly fg.graph.Node[],
  edges: readonly fg.graph.Edge[],
  filter: string
): void => {
  if (filter === "") {
    graph.nodes = nodes.slice()
    graph.edges = edges.slice()
    fg.graph.resetGraphGrid(graph.grid, graph.nodes)
    return
  }

  // regex matching all letters of the filter (out of order)
  const regex = new RegExp(filter.split("").join(".*"), "i")

  graph.nodes = nodes.filter((node) => regex.test(node.label))
  graph.edges = edges.filter(
    (edge) => regex.test(edge.a.label) && regex.test(edge.b.label)
  )

  fg.graph.resetGraphGrid(graph.grid, graph.nodes)
}

const graph_options: fg.graph.Options = {
  min_move: 0.001,
  inertia_strength: 0.3,
  origin_strength: 0.01,
  repel_distance: 40,
  repel_strength: 2,
  link_strength: 0.015,
  grid_size: 500
}

const TITLE_SIZE_PX = 400

const simulateGraph = (
  alpha: number,
  graph: fg.graph.Graph,
  canvas: fg.canvas.CanvasState,
  vw: number,
  vh: number
): void => {
  alpha = alpha / 10 // slow things down a bit

  fg.graph.simulate(graph, alpha)

  /*
    Push nodes away from the center (the title)
  */
  const grid_radius = graph.grid.size / 2
  const origin_x = grid_radius + canvas.translate.x
  const origin_y = grid_radius + canvas.translate.y
  const vmax = Math.max(vw, vh)
  const push_radius =
    (Math.min(TITLE_SIZE_PX, vw / 2, vh / 2) / vmax) *
      (graph.grid.size / canvas.scale) +
    80 /* additional margin for when scrolled in */

  for (const node of graph.nodes) {
    const dist_x = node.position.x - origin_x
    const dist_y = (node.position.y - origin_y) * 2
    const dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y)
    if (dist > push_radius) continue

    const strength = Ease.in_expo((push_radius - dist) / push_radius)

    node.velocity.x += strength * (node.position.x - origin_x) * 10 * alpha
    node.velocity.y += strength * (node.position.y - origin_y) * 10 * alpha
  }
}

const drawGraph = (
  canvas: fg.canvas.CanvasState,
  color_map: ColorMap
): void => {
  fg.canvas.resetFrame(canvas)
  fg.canvas.drawEdges(canvas)

  /*
    Draw text nodes
  */
  const { ctx, graph } = canvas.options

  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  for (const node of graph.nodes) {
    const { x, y } = node.position
    const opacity = 0.6 + ((node.mass - 1) / 50) * 4

    ctx.font = `${
      canvas.max_size / 200 +
      (((node.mass - 1) / 5) * (canvas.max_size / 100)) / canvas.scale
    }px sans-serif`

    ctx.fillStyle =
      node.anchor || canvas.hovered_node === node
        ? `rgba(129, 140, 248, ${opacity})`
        : `hsl(${color_map[node.key as string]} / ${opacity})`

    ctx.fillText(
      node.label,
      (x / graph.grid.size) * canvas.max_size,
      (y / graph.grid.size) * canvas.max_size
    )
  }
}

export type ForceGraphProps = {
  onNodeClick: (name: string) => void
  /**
   * Filter the displayed nodes by name.
   *
   * `""` means no filter
   */
  filterQuery: s.Accessor<string>
  raw_nodes: RawNode[]
}

export const createForceGraph = (props: ForceGraphProps): s.JSXElement => {
  if (props.raw_nodes.length === 0) return

  const [nodes, edges] = generateNodesFromRawData(props.raw_nodes)

  const color_map = generateColorMap(nodes)

  const graph = fg.graph.makeGraph(graph_options, nodes.slice(), edges.slice())

  /*
    Filter nodes when the filter query changes
  */
  const scheduleFilterNodes = schedule.scheduleIdle(filterNodes)
  s.createEffect(() => {
    const query = props.filterQuery()

    scheduleFilterNodes(graph, nodes, edges, query)
    bump_end = fg.anim.bump(bump_end)
  })

  let canvas_el!: HTMLCanvasElement
  const root_el = (
    <div class="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvas_el}
        style={`
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 120%;
        `}
      />
    </div>
  )

  const ctx = canvas_el.getContext("2d")
  if (!ctx) throw new Error("no context")

  const canvas = fg.canvas.canvasState({
    el: canvas_el,
    ctx,
    graph,
    max_scale: 3,
    init_scale: 1.7,
    init_grid_pos: Trig.ZERO
  })

  const window_size = useWindowSize()

  let alpha = 0 // 0 - 1
  let bump_end = fg.anim.bump(0)
  const frame_iter_limit = fg.anim.frameIterationsLimit()

  const loop = fg.anim.animationLoop((time) => {
    const is_active = gestures.mode.type === fg.canvas.Mode.DraggingNode
    const iterations = fg.anim.calcIterations(frame_iter_limit, time)

    for (let i = Math.min(iterations, 2); i >= 0; i--) {
      alpha = fg.anim.updateAlpha(alpha, is_active || time < bump_end)
      simulateGraph(alpha, graph, canvas, window_size.width, window_size.height)
    }
    drawGraph(canvas, color_map)
  })
  fg.anim.loopStart(loop)
  s.onCleanup(() => fg.anim.loopClear(loop))

  const ro = fg.canvas.resizeObserver(canvas_el, (size) => {
    fg.canvas.updateCanvasSize(canvas, size)
  })
  s.onCleanup(() => ro.disconnect())

  const gestures = fg.canvas.canvasGestures({
    canvas,
    onGesture: (e) => {
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (e.type) {
        case fg.canvas.GestureEventType.Translate:
          bump_end = fg.anim.bump(bump_end)
          break
        case fg.canvas.GestureEventType.NodeClick:
          props.onNodeClick(e.node.key as string)
          break
        case fg.canvas.GestureEventType.NodeDrag:
          fg.graph.changeNodePosition(
            canvas.options.graph.grid,
            e.node,
            e.pos.x,
            e.pos.y
          )
          break
      }
    }
  })
  s.onCleanup(() => fg.canvas.cleanupCanvasGestures(gestures))

  return root_el
}
