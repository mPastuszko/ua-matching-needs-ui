import { TicketFormData } from "./ticket-types"

export const LOCAL_STORAGE_KEY_TICKET_DATA = "ticket_data"
export const LOCAL_STORAGE_KEY_TAGS = "tags"

export const saveForFurtherUsage = (
  data: TicketFormData,
  tagsSelected: number[]
) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_TICKET_DATA, JSON.stringify(data))
  localStorage.setItem(LOCAL_STORAGE_KEY_TAGS, JSON.stringify(tagsSelected))
}

export const getInitialDataFromLocalStorage = () => {
  if (typeof window === "undefined") {
    return
  }

  const data = localStorage.getItem(LOCAL_STORAGE_KEY_TICKET_DATA)

  if (data) {
    return JSON.parse(data)
  }
}

export const getPreviouslySavedTags = () => {
  if (typeof window !== "undefined") {
    const json = localStorage.getItem(LOCAL_STORAGE_KEY_TAGS)
    if (json) {
      return JSON.parse(json)
    }
  }

  return []
}
