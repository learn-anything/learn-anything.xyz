import { GraphQLError } from "graphql"
import {
  likeOrUnlikeGlobalLink,
  updateGlobalLinkProgress
} from "../edgedb/crud/global-link"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Resolver } from "@grafbase/generated"

const updatePersonalLinkStatusResolver: Resolver["Mutation.updatePersonalLinkStatus"] =
  async (parent, args, context, info) => {
    try {
      const hankoId = await hankoIdFromToken(context)
      if (hankoId) {
        if (args.action === "like" || args.action === "unlike") {
          const res = await likeOrUnlikeGlobalLink(
            hankoId,
            args.personalLinkId,
            args.action
          )
          if (res === null) {
            throw new GraphQLError("cannot-update-global-link-status")
          }
          return "ok"
        }
        const res = await updateGlobalLinkProgress(
          hankoId,
          args.personalLinkId,
          args.action
        )
        if (res === null) {
          throw new GraphQLError("cannot-update-global-link-status")
        }
        return "ok"
      } else {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default updatePersonalLinkStatusResolver
