import { jwtVerify, createRemoteJWKSet } from "jose"
import { GraphQLError } from "graphql"
import { Context } from "@grafbase/sdk"

// validates that the token in `authorization` header is correct
// if it is valid, returns hanko id of the user
export async function hankoIdFromToken(context: Context) {
  if (process.env.GRAFBASE_ENV === "dev") {
    return process.env.LOCAL_USER_HANKO_ID
  }
  const authHeader = context.request.headers["authorization"]
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new GraphQLError("Missing or invalid Authorization header")
  }
  const JWKS = createRemoteJWKSet(
    new URL(`${process.env.PUBLIC_HANKO_API_URL}/.well-known/jwks.json`)
  )
  const hankoToken = authHeader.split(" ")[1]
  try {
    const verifiedJWT = await jwtVerify(hankoToken ?? "", JWKS)
    const hankoId = verifiedJWT.payload.sub

    // Check if the token is expired
    const currentUnixTimestamp = Math.floor(Date.now() / 1000)
    console.log(currentUnixTimestamp, "current")

    if (
      verifiedJWT.payload.exp &&
      verifiedJWT.payload.exp < currentUnixTimestamp
    ) {
      throw new Error("Token expired")
    }

    return hankoId
  } catch (err) {
    console.log(err, "err")
    if (err instanceof Error && err.message.includes("Token expired")) {
      throw new GraphQLError("Token expired")
    } else {
      throw new GraphQLError("Verification failed")
    }
  }
}
