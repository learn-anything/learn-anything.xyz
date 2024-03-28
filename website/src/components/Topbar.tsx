import Button from "./Button"
import clsx from "clsx"
import { Icon } from "./Icon"
import { For, Show, createSignal } from "solid-js"
import { Motion, Presence } from "solid-motionone"

export default function Topbar(props: {
	changeLearningStatus: (status: "Learn" | "Learning" | "Learned") => void
	showLinksStatus: "Learn" | "Learning" | "Learned"
	filterOrder?: "Custom" | "RecentlyAdded"
	filter?: string[]
}) {
	return (
		<div class="flex-between p-5">
			<div class="flex [&>*]:h-full bg-hoverDark [&>*]:flex-center h-[34px] items-center">
				<div
					class={clsx("px-[11px]", props.showLinksStatus === "Learning", "button")}
					onClick={() => {}}
				>
					Learning
				</div>
				<div
					class={clsx("px-[11px]", props.showLinksStatus === "Learn", "button")}
					onClick={() => {}}
				>
					To Learn
				</div>
				<button
					class={clsx("px-[11px]", props.showLinksStatus === "Learned", "button")}
					onClick={() => {
						props.changeLearningStatus("Learned")
					}}
				>
					Learned
				</button>
			</div>
			<div class="flex gap-2">
				<Filter filter={props.filter} />
				<LinkOrder filter={props.filterOrder} />
			</div>
		</div>
	)
}

function LinkOrder(props: {
	filterOrder?: "Custom" | "RecentlyAdded"
}) {
	const [expanded, setExpanded] = createSignal(false)
	const [filterOrder, setFilterOrder] = createSignal("Recently Added")
	const [expandTimer, setExpandTimer] = createSignal(false)
	return (
		<div
			class="relative"
			onMouseLeave={() => {
				setExpandTimer(true)
				setTimeout(() => {
					if (expandTimer()) {
						setExpanded(false)
					}
				}, 500)
			}}
			onMouseEnter={() => {
				setExpandTimer(false)
			}}
		>
			<div
				onClick={() => {
					setExpanded(!expanded())
				}}
				class="button px-[11px] pr-[4px] text-white/60 h-[34px] flex-center gap-1"
			>
				{filterOrder()}
				<Icon name="ArrowDown" />
			</div>
			<Presence exitBeforeEnter>
				<Show when={expanded()}>
					<Motion.div
						exit={{ opacity: 0, scale: 0.8 }}
						animate={{ scale: [0.8, 1.1, 1], opacity: [0, 1] }}
						transition={{ duration: 0.2, easing: "ease-in" }}
						class="absolute top-10 inline-flex right-0 bg-hoverDark p-1 flex-col gap-[2px] min-w-fit rounded-[7px]"
						style={{
							border: "1px solid #1E1E1E",
							background: "rgba(55, 55, 55, 0.40)",
							"backdrop-filter": "blur(8.5px)",
						}}
					>
						<div
							onClick={() => {
								setFilterOrder("Custom")
								setExpanded(false)
							}}
							class="rounded-[7px] h-[34px] cursor-pointer px-[11px] flex items-center hover:bg-softDarkText/10 text-white/60"
						>
							Custom
						</div>
						<div
							onClick={() => {
								setFilterOrder("Recently Added")
								setExpanded(false)
							}}
							class="rounded-[7px] h-[34px] cursor-pointer whitespace-nowrap px-[11px] flex items-center hover:bg-softDarkText/10 text-white/60"
						>
							Recently Added
						</div>
					</Motion.div>
				</Show>
			</Presence>
		</div>
	)
}

function Filter(props: {
	filter?: string[]
}) {
	const [filters, setFilters] = createSignal(["Liked", "Topic"])
	const [appliedFilters, setAppliedFilters] = createSignal([])
	const [expanded, setExpanded] = createSignal(false)
	const [expandTimer, setExpandTimer] = createSignal(false)

	return (
		<div
			class="flex gap-2 w-fit"
			onMouseLeave={() => {
				setExpandTimer(true)
				setTimeout(() => {
					if (expandTimer()) {
						setExpanded(false)
					}
				}, 500)
			}}
			onMouseEnter={() => {
				setExpandTimer(false)
			}}
		>
			<div class="relative">
				<div
					style={{
						border: "1px dashed rgba(255, 255, 255, 0.10)",
						background: "rgba(255, 255, 255, 0.02)",
					}}
					class="h-[34px] px-[11px] pl-[9px] rounded-[7px] shrink-0 flex-center dark:text-white/50"
					onClick={() => {
						setExpanded(!expanded())
					}}
				>
					<Icon name="Plus" />
					Filter
				</div>
				<Presence exitBeforeEnter>
					<Show when={expanded()}>
						<Motion.div
							exit={{ opacity: 0, scale: 0.8 }}
							animate={{ scale: [0.8, 1.1, 1], opacity: [0, 1] }}
							transition={{ duration: 0.2, easing: "ease-in" }}
							class="absolute top-10 w-full min-w-fit left-0 bg-hoverDark p-1 rounded-[7px]"
							style={{
								border: "1px solid #1E1E1E",
								background: "rgba(55, 55, 55, 0.40)",
								"backdrop-filter": "blur(8.5px)",
							}}
						>
							<For each={filters()}>
								{(filter: string) => {
									return (
										<div
											onClick={() => {
												if (!appliedFilters().includes(filter)) {
													setAppliedFilters([filter, ...appliedFilters()])
												}
												setExpanded(false)
											}}
											class="rounded-[7px] h-[34px] px-[11px] flex-center hover:bg-softDarkText/10 text-white/60"
										>
											{filter}
										</div>
									)
								}}
							</For>
						</Motion.div>
					</Show>
				</Presence>
			</div>

			<For each={appliedFilters()}>
				{(filter) => {
					return (
						<div class="bg-hoverDark rounded-[7px]  px-[11px] flex-center text-white/60">
							{filter}
						</div>
					)
				}}
			</For>
		</div>
	)
}
