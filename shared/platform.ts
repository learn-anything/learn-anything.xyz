import * as sweb from "solid-js/web"

export const isServer = sweb.isServer
export const isClient = !isServer

export const isDev = sweb.isDev
export const isProd = !isDev