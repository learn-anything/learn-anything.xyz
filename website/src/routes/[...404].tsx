import { useNavigate } from "@solidjs/router"
import { onMount } from "solid-js"

export default function NotFound() {
  const navigate = useNavigate()

  onMount(() => {
    navigate("/")
  })
  return <></>
}
