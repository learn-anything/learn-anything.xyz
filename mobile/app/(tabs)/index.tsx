import React, { useState } from "react"
import {
	View,
	FlatList,
	Text,
	TouchableOpacity,
	Image,
	StyleSheet,
	Dimensions,
} from "react-native"
import Svg, { Path } from "react-native-svg"
import { Octicons, Ionicons, AntDesign } from "@expo/vector-icons"
import solidjsIcon from "../../assets/solidjs.png"
import graphqlIcon from "../../assets/favicon.png"
import figmaIcon from "../../assets/figma-icon.jpg"
// import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
// import { Link } from "expo-router"

const { width } = Dimensions.get("window")

type ProfileData = {
	links: { title: string; url: string; id: string }[]
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

export default function Home() {
	const [selectedTab, setSelectedTab] = useState("links")
	const [data, setData] = useState<ProfileData>({
		links: [
			{ id: "1", title: "Solid", url: "https://solidjs.com" },
			{ id: "2", title: "GraphQL", url: "https://graphql.org" },
			{ id: "3", title: "Figma", url: "https://figma.com" },
			{ id: "4", title: "Solid", url: "https://solidjs.com" },
			{ id: "5", title: "Solid", url: "https://solidjs.com" },
			{ id: "6", title: "Figma", url: "https://figma.com" },
			{ id: "7", title: "GraphQL", url: "https://graphql.org" },
			{ id: "8", title: "Solid", url: "https://solidjs.com" },
		],
		showLinksStatus: "Learning",
		filterOrder: "Custom",
		filter: "None",
		userTopics: ["Solid", "GraphQL"],
		user: {
			email: "github@nikiv.dev",
			name: "Nikita",
		},
	})

	const getLinkIcon = (url: string) => {
		if (url.includes("solidjs")) {
			return solidjsIcon
		} else if (url.includes("graphql")) {
			return graphqlIcon
		} else {
			return figmaIcon
		}
	}

	const renderItem = ({ item }: { item: { title: string; url: string } }) => (
		<TouchableOpacity style={styles.itemContainer}>
			<Image source={getLinkIcon(item.url)} style={styles.itemImage} />
			<Text style={styles.itemTitle}>{item.title}</Text>
			<TouchableOpacity style={{ marginLeft: 20 }}>
				<LinkIcon />
			</TouchableOpacity>
		</TouchableOpacity>
	)

	const FilterIcon = () => (
		<Svg height="100" width="100" viewBox="0 0 100 100">
			<Path
				d="M10.6087 12.3272C10.8248 12.4993 11 12.861 11 13.1393V18.8843L13 17.8018V13.1338C13 12.8604 13.173 12.501 13.3913 12.3272L17.5707 9H6.42931L10.6087 12.3272ZM20 7L20 4.99791L4.00001 5L4.00003 7H20ZM15 18.0027C15 18.5535 14.6063 19.2126 14.1211 19.4747L10.7597 21.2904C9.78783 21.8154 9 21.3499 9 20.2429V13.6L2.78468 8.62775C2.35131 8.28105 2 7.54902 2 6.99573V4.99791C2 3.8945 2.89821 3 4.00001 3H20C21.1046 3 22 3.89826 22 4.99791V6.99573C22 7.55037 21.65 8.28003 21.2153 8.62775L15 13.6V18.0027Z"
				fill="grey"
				strokeWidth="2"
			/>
		</Svg>
	)

	const LinkIcon = () => (
		<Svg height="100" width="100" viewBox="0 0 100 100">
			<Path
				d="M12.6592 7.18364C12.9846 7.50908 12.9838 8.03753 12.6619 8.35944L7.94245 13.0789C7.61851 13.4028 7.09435 13.4039 6.76665 13.0762C6.44121 12.7508 6.44203 12.2223 6.76393 11.9004L11.4834 7.18093C11.8073 6.85699 12.3315 6.85593 12.6592 7.18364ZM6.76666 16.6117C5.79136 17.587 4.20579 17.5864 3.23111 16.6117C2.25561 15.6362 2.25611 14.0512 3.23112 13.0762L5.58813 10.7192C5.91357 10.3937 5.91357 9.8661 5.58813 9.54066C5.2627 9.21522 4.73506 9.21522 4.40962 9.54066L2.05261 11.8977C0.426886 13.5234 0.426063 16.1637 2.0526 17.7902C3.67795 19.4156 6.31879 19.4166 7.94517 17.7902L10.3022 15.4332C10.6276 15.1078 10.6276 14.5801 10.3022 14.2547C9.97674 13.9293 9.44911 13.9293 9.12367 14.2547L6.76666 16.6117ZM17.3732 8.36216C18.9996 6.73578 18.9986 4.09494 17.3732 2.46959C15.7467 0.843055 13.1064 0.843878 11.4807 2.46961L9.12367 4.82662C8.79823 5.15205 8.79823 5.67969 9.12367 6.00513C9.44911 6.33056 9.97674 6.33056 10.3022 6.00513L12.6592 3.64812C13.6342 2.6731 15.2192 2.6726 16.1947 3.6481C17.1694 4.62278 17.17 6.20835 16.1947 7.18365L13.8377 9.54066C13.5123 9.8661 13.5123 10.3937 13.8377 10.7192C14.1631 11.0446 14.6908 11.0446 15.0162 10.7192L17.3732 8.36216Z"
				fill-rule="evenodd"
				fill="grey"
				strokeWidth="2"
			/>
		</Svg>
	)

	const ArrowIcon = () => (
		<Svg width="15" height="12">
			<Path
				d="M12.613 4.79031C12.9303 4.48656 13.4447 4.48656 13.762 4.79031C14.0793 5.09405 14.0793 5.58651 13.762 5.89025L8.07452 11.3347C7.75722 11.6384 7.24278 11.6384 6.92548 11.3347L1.23798 5.89025C0.920674 5.58651 0.920674 5.09405 1.23798 4.79031C1.55528 4.48656 2.06972 4.48656 2.38702 4.79031L7.5 9.68478L12.613 4.79031Z"
				fill="grey"
			/>
		</Svg>
	)

	return (
		<>
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.tabContainer}>
						<TouchableOpacity
							style={[
								styles.tab,
								selectedTab === "links"
									? styles.selectedTab
									: styles.unselectedTab,
							]}
							onPress={() => setSelectedTab("links")}
						>
							<Text style={styles.tabText}>Links</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.tab,
								selectedTab === "topics"
									? styles.selectedTab
									: styles.unselectedTab,
							]}
							onPress={() => setSelectedTab("topics")}
						>
							<Text style={styles.tabText}>Topics</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.optionsContainer}>
						<TouchableOpacity style={styles.optionsButton}>
							<Text style={styles.optionText}>Learning</Text>
							<ArrowIcon />
						</TouchableOpacity>
						<TouchableOpacity style={styles.optionIcon}>
							<FilterIcon />
						</TouchableOpacity>
					</View>
				</View>
				<FlatList
					data={data.links}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					style={styles.list}
				/>
			</View>
			<View style={styles.bottomBar}>
				<View style={styles.bottomFrame}>
					<Octicons name="list-unordered" size={24} color="grey" />
					<AntDesign name="search1" size={24} color="grey" />
					<AntDesign name="pluscircleo" size={24} color="grey" />
					<Ionicons name="person-outline" size={24} color="grey" />
				</View>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#0F0F0F",
		flex: 1,
		margin: "auto",
	},
	header: {
		marginVertical: 10,
		marginHorizontal: 10,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		width: width,
	},
	tabContainer: {
		flexDirection: "row",
	},
	tab: {
		backgroundColor: "#222222",
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 8,
	},
	selectedTab: {
		backgroundColor: "rgba(255, 255, 255, 0.04)",
		height: 34,
	},
	unselectedTab: {
		backgroundColor: "rgba(255, 255, 255, 0.0)",
		height: 34,
	},
	tabText: {
		color: "white",
		opacity: 0.7,
	},
	optionsContainer: {
		flexDirection: "row",
	},
	optionsButton: {
		borderRadius: 7,
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
		maxHeight: 34,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
		marginRight: 8,
	},
	optionText: {
		color: "white",
		opacity: 0.7,
		paddingRight: 5,
	},
	optionIcon: {
		width: 16,
		height: 16,
	},
	list: {
		flex: 1,
		margin: "auto",
	},
	itemContainer: {
		padding: 8,
		marginHorizontal: 5,
		flexDirection: "row",
		backgroundColor: "#121212",
		borderRadius: 8,
		marginBottom: 2,
		justifyContent: "space-between",
		alignItems: "center",
		height: 40,
	},
	itemImage: {
		width: 16,
		height: 16,
		marginRight: 8,
	},
	itemTitle: {
		color: "white",
		fontSize: 16,
		fontWeight: "500",
		width: 280, // ?
	},
	bottomBar: {
		backgroundColor: "#151515",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		width: width,
		height: 82,
		paddingHorizontal: 15,
	},
	bottomFrame: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		width: "100%",
		height: "100%",
	},
})
