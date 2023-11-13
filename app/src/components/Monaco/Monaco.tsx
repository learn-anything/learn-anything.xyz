import { createEffect, createSignal } from "solid-js"
import { invoke } from "@tauri-apps/api/tauri"
import * as scheduled from "@solid-primitives/scheduled"
import { MonacoEditor } from "solid-monaco"
import { useGlobalState } from "../../GlobalContext/global"

export function Monaco() {
  const [value, setValue] = createSignal<string>("some text")
  const global = useGlobalState()

  // createEffect(() => {
  //   const localValue = editorView()?.state.doc.toString()
  //   editorView()?.dispatch({
  //     changes: {
  //       from: 0,
  //       to: localValue?.length,
  //       insert: global.state.currentlyOpenFile?.fileContent,
  //     },
  //   })
  // })

  const scheduledFileUpdate = scheduled.throttle(
    async (newFileContent: string) => {
      if (global.state.currentlyOpenFile) {
        const filePath = global.state.currentlyOpenFile.filePath
        const pathToFile = `${global.state.localFolderPath}/${filePath}`
        const indexOfCurrentlyEditedFile = global.state.files.findIndex(
          (f) => f.filePath === filePath,
        )

        global.set(
          "files",
          indexOfCurrentlyEditedFile,
          "fileContent",
          newFileContent,
        )
        await invoke("overwrite_file_content", {
          path: pathToFile,
          newContent: newFileContent,
        })
      }
    },
    1000,
  )

  createEffect(() => {
    console.log("updating the file")
    if (global.state.currentlyOpenFile?.fileContent) {
      scheduledFileUpdate(global.state.currentlyOpenFile?.fileContent)
    }
  })

  return (
    <div class="flex flex-col h-full overflow-auto">
      <MonacoEditor
        language={"markdown"}
        onChange={(text) => {
          global.set("currentlyOpenFile", "fileContent", text)
        }}
        options={{
          padding: { top: 24 },
          minimap: { enabled: false },
          wordWrap: "on",
          lineNumbers: "off",
        }}
        theme="vs-dark"
        value={global.state.currentlyOpenFile?.fileContent}
      />
    </div>
  )
}
