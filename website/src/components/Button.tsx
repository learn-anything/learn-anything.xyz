interface Props {
	label: string
}

export default function Button(props: Props) {
	return (
		<div
			style={{
				background: "linear-gradient(180deg, #232323 0%, #222 100%), rgba(255, 255, 255, 0.04)",
				"box-shadow":
					"0px 1px 1px 0px rgba(0, 0, 0, 0.55), 0px 1px 1px 0px rgba(255, 255, 255, 0.05) inset",
			}}
			class="inline-flex w-full cursor-pointer active:scale-[0.9] transition-all h-[34px] px-[11px] items-center gap-[6px] shrink-0 rounded-[7px] dark:text-white/70"
		>
			{props.label}
		</div>
	)
}
