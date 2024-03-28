import { defineConfig } from "@solidjs/start/config"

export default defineConfig({
	ssr: false,
	server: {
		preset: "cloudflare_pages",
		rollupConfig: {
			external: ["node:async_hooks"],
		},
	},
})