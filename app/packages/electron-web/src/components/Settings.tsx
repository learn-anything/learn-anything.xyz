import { createSignal } from "solid-js"
import { useWiki } from "../GlobalContext/wiki"

export default function Settings() {
  const wiki = useWiki()
  const [wikiPathInput, setWikiPathInput] = createSignal("")

  return (
    <>
      <div class="w-full flex items-center justify-center h-full">
        <div class="h-full font-bold border-r dark:border-slate-800 border-opacity-30 p-8">
          <div>Editor</div>
        </div>
        <div class="w-full flex items-start h-full p-16 gap-2">
          <div
            onClick={() => {
              wiki.setWikiFolderPath(wikiPathInput())
            }}
            class="font-semibold rounded-md border dark:border-slate-800 border-opacity-40 bg-transparent px-4 p-2 hover:bg-neutral-950 transition-all cursor-pointer"
          >
            Save
          </div>
          <input
            type="text"
            placeholder="Enter path to wiki"
            class="rounded-md p-2 font-semibold dark:bg-transparent border border-slate-800 w-64 bg-opacity-50 outline-none"
            onChange={(e) => {
              setWikiPathInput(e.target.value)
            }}
          />
        </div>
      </div>
    </>
  )
}
