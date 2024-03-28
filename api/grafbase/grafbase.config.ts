import { config, graph } from "@grafbase/sdk"

const g = graph.Standalone()

export default config({
	graph: g,
	experimental: {
		kv: true,
		codegen: true,
	},
	auth: {
		rules: (rules) => {
			rules.public()
		},
	},
})

// definitions
// TODO: maybe can be improved
const LearningStatus = g.enum("learningStatus", ["Learn", "Learning", "Learned"])
// const LearningStatusNullable = g.enum("learningStatus", ["Learn", "Learning", "Learned", "None"])
const FilterOrder = g.enum("FilterOrder", ["custom", "recently_added", "none"])
const Filter = g.enum("filter", ["liked", "none", "topic"])
const Link = g.type("Link", {
	title: g.string(),
	url: g.string(),
})
const User = g.type("User", {
	email: g.string(),
	name: g.string(),
})
const EditingLink = g.type("EditingLink", {
	title: g.string(),
	url: g.string(),
	description: g.string().optional(),
	status: g.enumRef(LearningStatus),
	topic: g.string().optional(),
	note: g.string().optional(),
	year: g.int().optional(),
	addedAt: g.string().optional(),
})

// route queries
// /profile
const routesProfile = g.type("routesProfileOutput", {
	links: g.ref(Link).list(),
	showLinksStatus: g.enumRef(LearningStatus),
	filterOrder: g.enumRef(FilterOrder),
	filter: g.enumRef(Filter),
	filterTopic: g.string().optional(),
	userTopics: g.string().list(),
	user: g.ref(User),
	editingLink: g.ref(EditingLink).optional(),
	linkToEdit: g.string().optional(),
	searchQuery: g.string().optional(),
})
g.query("routesProfile", {
	args: {},
	returns: g.ref(routesProfile),
	resolver: "routes/profile",
})

// mutations (return `true` on success)
g.mutation("updateTopicLearningStatus", {
	args: {
		topicName: g.string(),
		learningStatus: g.enumRef(LearningStatus),
	},
	returns: g.boolean(), // true = success
	resolver: "updateTopicLearningStatus",
})
