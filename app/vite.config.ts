import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import { internalIpV4 } from "internal-ip"

// @ts-expect-error process is a nodejs global
const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM)

// https://vitejs.dev/config/
export default defineConfig(async () => {
	const host = await internalIpV4()

	return {
		plugins: [solidPlugin()],

		// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
		//
		// 1. prevent vite from obscuring rust errors
		clearScreen: false,
		// 2. tauri expects a fixed port, fail if that port is not available
		server: {
			// port: 1420,
			// strictPort: true,
			host: mobile ? "0.0.0.0" : false, // listen on all addresses
			port: 1420,
			strictPort: true,
			hmr: mobile
				? {
						protocol: "ws",
						host,
						port: 5183,
					}
				: undefined,
			watch: {
				// 3. tell vite to ignore watching `src-tauri`
				ignored: ["**/src-tauri/**"],
			},
		},
		// 3. to make use of `TAURI_DEBUG` and other env variables
		// https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
		envPrefix: ["VITE_", "TAURI_"],
	}
})
