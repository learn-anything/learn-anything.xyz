import clsx from "clsx"
import { Show, createSignal } from "solid-js"
import { Icon } from "./Icon"
import Button from "./Button"
import { Motion, Presence } from "solid-motionone"

interface Props {
	link: {
		title: string
		url: string
	}
}

export default function ProfileLink(props: Props) {
	const [hovered, setHovered] = createSignal(false)
	const [expanded, setExpanded] = createSignal(false)
	return (
		<div
			onClick={() => {
				setExpanded(true)
			}}
			onMouseEnter={() => {
				setHovered(true)
			}}
			onMouseLeave={() => {
				setHovered(false)
			}}
			class={clsx(
				"rounded-lg hover:bg-hoverDark bg-softDark p-2 pl-3 h-[54px] transition-all",
				expanded() && "h-full transition-all !bg-[#171A21]",
			)}
		>
			<div class="flex-between">
				<div class="flex gap-2 items-center">
					<div class="bg-softDark rounded-md flex-center w-[20px] h-[20px] text-softDark">.</div>
					<div>{props.link.title}</div>
					<div class="text-[14px] text-softDarkText/40 hover:text-softDarkText/70 transition-all font-light">
						{props.link.url}
					</div>
				</div>
				<div class="flex gap-2">
					<Show when={hovered() || expanded()}>
						<div class="flex-center gap-2">
							<div class="opacity-60">
								<Icon name="Heart" height="24" width="24" border="white" />
							</div>
							<Status />
						</div>
					</Show>
					<div class="px-[11px] h-[34px] flex-center rounded-[7px] bg-white bg-opacity-[0.04]">
						{props.link.title}
					</div>
				</div>
			</div>
			<Show when={expanded()}>
				<div class="w-full h-full flex flex-col justify-between">
					<div class="pl-7 flex-col flex justify-between gap-2 p-2 text-[14px]">
						<div class=" text-white/50 w-[700px]">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, officia. Delectus in
							dolor quam praesentium laborum velit iusto aut saepe quibusdam, quia, nihil omnis odit
							dignissimos tenetur incidunt placeat fuga.
						</div>
						<div class="text-white/10">2024</div>
					</div>
					<div class="w-full flex-between border-t border-[#1f222b] pt-2">
						<input
							type="text"
							placeholder="Take a note..."
							class="bg-dark/0 text-[14px] text-white/40 pl-2 outline-none"
						/>
						<div
							class="w-fit"
							onClick={() => {
								setExpanded(false)
							}}
						>
							<Button label="Done" />
						</div>
					</div>
				</div>
			</Show>
		</div>
	)
}

function Status() {
	const [expanded, setExpanded] = createSignal(false)
	const [status, setStatus] = createSignal("Learning")
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
				class={clsx(
					"text-[#D29752] h-[34px] pr-[4px] px-[11px] rounded-[7px] flex-center",
					status() === "To Learn" && "text-[#d26352]",
					status() === "Learned" && "text-[#52d274]",
				)}
				style={{
					background:
						"linear-gradient(0deg, rgba(255, 167, 64, 0.02) 0%, rgba(255, 167, 64, 0.02) 100%), rgba(255, 255, 255, 0.02)",
				}}
			>
				{status()}
				<Icon name="ArrowDown" />
			</div>
			<Presence>
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
						<div
							onClick={() => {
								setStatus("Learning")
								setExpanded(false)
							}}
							class="rounded-[7px] h-[34px] px-[11px] flex-center hover:bg-softDarkText/10 text-white/60"
						>
							Learning
						</div>
						<div
							onClick={() => {
								setStatus("To Learn")
								setExpanded(false)
							}}
							class="rounded-[7px] h-[34px] px-[11px] flex-center hover:bg-softDarkText/10 text-white/60"
						>
							To Learn
						</div>
						<div
							onClick={() => {
								setStatus("Learned")
								setExpanded(false)
							}}
							class="rounded-[7px] h-[34px] px-[11px] flex-center hover:bg-softDarkText/10 text-white/60"
						>
							Learned
						</div>
					</Motion.div>
				</Show>
			</Presence>
		</div>
	)
}
