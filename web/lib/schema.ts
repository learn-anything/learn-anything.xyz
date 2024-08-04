// Jazz schema for LA
// if field does not have `co.optional` it is required
// rule: list all required fields first, then optional fields
// TODO: move more fields from old edgedb schema to jazz (where it makes sense): https://github.com/learn-anything/explore/blob/main/archive/api/edgedb/dbschema/default-latest.esdl
// TODO: all instances of (unique) should be enforced by jazz itself, it means that only one instance with that name of field can exist
// sadly jazz does not allow enforcing that, so solutions for (unique) fields is: ignore duplicates or create a supporting look up structure (CoMap.Record from url to GlobalLink) and then I’ll let you know once the better way exists
// open issue about it: https://github.com/gardencmp/jazz/issues/44
import { CoMap, CoList, co, Account, Group, Encoders } from "jazz-tools"
import { nullable, nullableJson } from "./types"

// PersonalPage is page of content that user can write to. Similar to Notion/Reflect page. It holds ProseMirror editor content + metadata.
// if public, certain members (can do read/write access accordingly), personal (end to end encrypted, only accessed by user)
// TODO: how to do optional/required fields
export class PersonalPage extends CoMap {
  content = co.string // TODO: ask anselm how to best hold editor state of ProseMirror editor
  publicName = co.optional.string // with it, PersonalPage can be accessed from learn-anything.xyz/@user/publicName) (unique)
  globalMainTopic = co.optional.ref(GlobalTopic)
  // backlinks = co.optional.ref() // other PersonalPages linking to this page TODO: add, think through how to do it well, efficiently
}
// GlobalLink is a link with unique URL that holds some useful metadata. Can be used to do queries like `most popular links added by users` etc.
export class GlobalLink extends CoMap {
  url = co.string // url without the protocol (e.g. "learn-anything.xyz") (unique)
  urlTitle = co.string // title of the page
  protocol = co.string // e.g. "https"
  description = co.optional.string // description of the link
  title = co.optional.string // human readable title of the link (simplified, cleaner)
  urlWasCreatedOnInternetAt = co.optional.encoded(Encoders.Date) // date url was created on internet at (can pass just year or year+month or year+month+day)
  aiSummary = co.optional.ref(GlobalLinkAiSummary) // high quality summary of a link (generated by AI)
  globalMainTopic = co.optional.ref(GlobalTopic) // each global link can have one main topic (to closest approximation)
  public = co.optional.boolean // if true, link is accessible from global search
  processed = co.optional.encoded(Encoders.Date) // date link was processed at by LA (update metadata etc.)
  // websiteDown = co.boolean // if website is 404 or down TODO: add it later when we have service to check for dead links
}
// GlobalLinkAiSummary is high quality summary of a link (generated by AI)
export class GlobalLinkAiSummary extends CoMap {
  link = co.ref(GlobalLink)
  aiModelUsed = co.string
  summary = co.string
}
// PersonalLink is link user added, it wraps over GlobalLink and lets user add notes and other things to it
export class PersonalLink extends CoMap {
  globalLink = co.ref(GlobalLink) // each personal link wraps over unique global link
  learningState = co.optional.literal("wantToLearn", "learning", "learned") // learning state of personal link
  notes = co.optional.string // notes for a link as set by user
  globalMainTopic = co.optional.ref(GlobalTopic) // each personal link can have one main topic (to closest approximation) (as set by user)
}
// GlobalTopic is a topic that is accessible from `learn-anything.xyz/name`
export class GlobalTopic extends CoMap {
  name = co.string // name of topic, used for url `learn-anything.xyz/name` (unique)
  public = co.optional.boolean // if true, topic is accessible from global search
}
// class ListOfGlobalTopics extends CoList.Of(co.ref(GlobalTopic)) {}
class Section extends CoMap {
  title = co.string
  links = co.ref(ListOfGlobalLinks)
}
class ListOfSections extends CoList.Of(co.ref(() => Section)) {}
export class Page extends CoMap {
  title = co.string
  content = nullableJson()
}
export class UserLink extends CoMap {
  url = co.string
  title = co.string
  image = nullable(co.string)
  favicon = co.string
  description = nullable(co.string)
}
export class TodoItem extends CoMap {
  title = co.string
  description = nullable(co.string)
  topic? = co.ref(GlobalTopic)
  completed = co.boolean
  sequence = co.number
  isLink = co.boolean
  meta? = co.ref(UserLink)
}
export class ListOfPersonalTodoItems extends CoList.Of(co.ref(TodoItem)) {}
class ListOfGlobalLinks extends CoList.Of(co.ref(GlobalLink)) {}
class ListOfPersonalLinks extends CoList.Of(co.ref(PersonalLink)) {}
class ListOfPages extends CoList.Of(co.ref(Page)) {}
class ListOfTopics extends CoList.Of(co.ref(GlobalTopic)) {}
class UserProfile extends CoMap {
  name = co.string
  // TODO: avatar
}
export class UserRoot extends CoMap {
  name = co.string
  username = co.string
  website = co.string
  bio = co.string
  todos = co.ref(ListOfPersonalTodoItems)

  // not implemented yet
  topicsWantToLearn = co.ref(ListOfTopics)
  topicsLearning = co.ref(ListOfTopics)
  topicsLearned = co.ref(ListOfTopics)
  personalLinks = co.ref(ListOfPersonalLinks)
  pages = co.ref(ListOfPages)
}
export class LaAccount extends Account {
  profile = co.ref(UserProfile)
  root = co.ref(UserRoot)
  async migrate(
    this: LaAccount,
    creationProps?:
      | { name: string; username: string; website: string; bio: string }
      | undefined
  ): Promise<void> {
    if (!this._refs.root && creationProps) {
      const profileGroup = Group.create({ owner: this })
      profileGroup.addMember("everyone", "reader")
      this.profile = UserProfile.create(
        { name: creationProps.name },
        { owner: profileGroup }
      )
      this.root = UserRoot.create(
        {
          name: creationProps.name,
          username: creationProps.username,
          website: creationProps.website,
          bio: creationProps.bio,
          todos: ListOfPersonalTodoItems.create([], { owner: this }),
          // not implemented yet
          topicsWantToLearn: ListOfTopics.create([], { owner: this }),
          topicsLearning: ListOfTopics.create([], { owner: this }),
          topicsLearned: ListOfTopics.create([], { owner: this }),
          personalLinks: ListOfPersonalLinks.create([], { owner: this }),
          pages: ListOfPages.create([], { owner: this })
        },
        { owner: this }
      )
    }
  }
}
