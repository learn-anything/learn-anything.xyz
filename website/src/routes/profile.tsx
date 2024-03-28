import { For, Show, Suspense, createEffect, createSignal } from "solid-js"
import ProfileLink from "~/components/ProfileLink"
import Topbar from "~/components/Topbar"
import * as gql from "../../../shared/graphql_client"
import Button from "~/components/Button"
import Search from "~/components/Search"

// TODO: here for reference, resolver returns the same structure now, remove after route works
export type ProfileData = {
	links: { title: string; url: string }[]
	showLinksStatus: "Learning" | "To Learn" | "Learned"
	filterOrder: "Custom" | "RecentlyAdded"
	filter: "Liked" | "None" | "Topic"
	filterTopic?: string // used when filter is set to "Topic"
	userTopics: string[]
	user: {
		email: string
		name: string
	}
	editingLink?: {
		title: string
		url: string
		description?: string
		status?: "Learning" | "To Learn" | "Learned"
		topic?: string
		note?: string
		year?: number
		addedAt?: string
	}
	linkToEdit?: string // TODO: id of link? how to know what link is opened for editing
	searchQuery?: string // what is typed in the search input on bottom
}

export default function Profile() {
	const [route, actions] = gql.useResource(gql.query_routesProfile, {})
	const [editingLink, setEditingLink] = createSignal()
	// const [local, setLocal] = createSignal({
	// 	editingLinkId: "1",
	// })
	const updateLearningStatus = gql.useRequest(gql.mutation_updateTopicLearningStatus)
	// createEffect(() => {
	// 	console.log(route())
	// })

	return (
		<div class=" w-full h-screen">
			<Sidebar topics={route().userTopics} />
			{/* <Sidebar topics={store.userTopics} /> */}
			<div class="ml-[200px] h-full p-2 relative">
				<div class="border-[#191919] h-full border rounded-[7px]">
					<Topbar
						changeLearningStatus={async (status) => {
							const res = await updateLearningStatus({ topicName: "Solid", learningStatus: status })
							if (res instanceof Error) return
							actions.mutate((p) => ({
								...p,
								showLinksStatus: status,
							}))
							console.log(res, "res")
						}}
						showLinksStatus={route().showLinksStatus}
						// showLinksStatus={"Learning"}
						// filterOrder={routeData()?.filterOrder}
						// filter={routeData()?.filter}
					/>
					<div class=" px-5 w-full bg-gray-200 col-gap-[4px]">
						<For each={route().links}>{(link) => <ProfileLink link={link} />}</For>
					</div>
				</div>
				<Search />
			</div>
		</div>
	)
}

function Sidebar(props: { topics?: string[] }) {
	return (
		<div class="fixed top-0 left-0 h-screen min-w-[200px] bg-dark text-textGray ">
			<div class="h-[40px] w-[40px] rounded-full bg-white m-[20px]"></div>
			<div class="col-gap-[8px] pl-2">
				<div class="w-full">
					<Button label="My Links" />
				</div>
				<div class="">
					<div class="text-white/20 text-[14px] px-3 p-2">My Topics</div>
					<For each={props.topics}>
						{(topic) => {
							return (
								<div class="text-white/60 px-3 p-2 cursor-pointer hover:bg-hoverDark rounded-[7px] transition-all">
									{topic}
								</div>
							)
						}}
					</For>
				</div>
			</div>
		</div>
	)
}
