import { parseURL } from "ufo"

export function removeTrailingSlash(str: string) {
  if (str.endsWith("/")) {
    return str.slice(0, -1)
  }
  return str
}

export function splitUrlByProtocol(url: string) {
  const parsedUrl = parseURL(url)
  let host = parsedUrl.host
  if (host?.includes("www")) {
    host = host?.replace("www.", "")
  }
  let urlWithoutProtocol = host + parsedUrl.pathname + parsedUrl.search

  let protocol = parsedUrl.protocol
  if (protocol) {
    protocol = protocol.replace(":", "")
  }

  urlWithoutProtocol = removeTrailingSlash(urlWithoutProtocol)
  return [urlWithoutProtocol, protocol]
}
