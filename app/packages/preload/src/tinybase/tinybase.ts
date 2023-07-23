import { createStore } from "tinybase/cjs"
import { createSqlite3Persister } from "tinybase/cjs/persisters/persister-sqlite3"
import { Database } from "sqlite3"

// creates tinybase store
// in-memory javascript store persisted to sqlite
// https://tinybase.org
export function setupTinybaseStore() {
  // define the schema
  const store = createStore().setTablesSchema({
    wiki: {
      wikiFolderPath: { type: "string" }, // path to wiki folder connected to the wiki
      openTopic: { type: "string" }, // topicName of open topic
      sidebarTopics: { type: "string" }, // JSON.stringify of SidebarTopic[]
    },
    topics: {
      topicName: { type: "string" }, // unique
      filePath: { type: "string" },
      fileContent: { type: "string" },
      topicContent: { type: "string" }, // markdown content of topic
      prettyName: { type: "string" },
      parentTopic: { type: "string" }, // topicName of parent topic
    },
    notes: {
      topicId: { type: "string" }, // topic this note is attached to
      content: { type: "string" },
      url: { type: "string" },
      public: { type: "boolean" },
    },
    links: {
      topicId: { type: "string" }, // topic this link is attached to
      title: { type: "string" },
      url: { type: "string" },
      public: { type: "boolean" },
    },
  })
  const db = new Database("learn-anything")
  // sets what tables get saved in sqlite
  const persister = createSqlite3Persister(store, db, {
    mode: "tabular",
    tables: {
      load: {
        wiki: "wiki",
        topics: "topics",
        notes: "notes",
        links: "links",
      },
      save: {
        wiki: "wiki",
        topics: "topics",
        notes: "notes",
        links: "links",
      },
    },
  })
  // load things into tinybase js store from sqlite
  // persister.load()
  // TODO: ok not to await? I can't really await
  // as this function runs in top level of preload/index.ts
  // no top level await available there
  // persister.startAutoSave()
  return persister
}
