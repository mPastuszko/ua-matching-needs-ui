import {
  Container,
} from "@chakra-ui/react"
import type { NextPage } from "next"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import axios from "axios"
import { useRouter } from "next/router"
import { RouteDefinitions } from "../../src/utils/routes"
import { toast } from "react-toastify"
import dayjs from "dayjs"
import { useTranslations } from "../../src/hooks/translations"
import { useMemo, useState } from "react"
import { isJsonString } from "../../src/utils/local-storage"
import { useSession } from "next-auth/react"
import {
  TicketPostData,
  TicketFormData,
} from "../../src/services/ticket.type"
import { getRootContainer } from "../../src/services/_root-container"
import { AddNeedMobile } from "../../src/components/forms/AddNeedMobile"
import { AddNeedDesktop } from "../../src/components/forms/AddNeedDesktop"

export const LOCAL_STORAGE_KEY_TICKET_DATA = "ticket_data"
export const LOCAL_STORAGE_KEY_TAGS = "tags"

const saveNeedInfoToLocalStorage = (
  data: TicketFormData,
  tagsSelected: number[]
) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_TICKET_DATA, JSON.stringify(data))
  localStorage.setItem(LOCAL_STORAGE_KEY_TAGS, JSON.stringify(tagsSelected))
}

const getInitialDataFromLocalStorage = () => {
  if (typeof window === "undefined") {
    return
  }

  const data = localStorage.getItem(LOCAL_STORAGE_KEY_TICKET_DATA)

  if (isJsonString(data)) {
    return JSON.parse(data)
  }
}

const getPreviouslySavedTags = () => {
  if (typeof window !== "undefined") {
    const json = localStorage.getItem(LOCAL_STORAGE_KEY_TAGS)
    if (isJsonString(json)) {
      return JSON.parse(json)
    }
  }

  return []
}
const ticketService = getRootContainer().containers.ticketService
const AddTicket: NextPage = () => {
  const router = useRouter()
  const translations = useTranslations()
  const previouslySavedTags = getPreviouslySavedTags()
  const { data: authSession, status: authStatus } = useSession()
  const [tagsSelected, setTagsSelected] =
    useState<number[]>(previouslySavedTags)

  const [whereFromTag, setWhereFromTag] = useState<number | undefined>(
    undefined
  )
  const [whereToTag, setWhereToTag] = useState<number | undefined>(undefined)

  const { data: tags } = useQuery(`main-tags`, () => {
    return ticketService.mainTags()
  })
  const { data: locationTags = []} = useQuery(`location-tags`, () => {
    return ticketService.locationTags()
  })

  const mappedLocationTags = useMemo(() => {
    return locationTags.map((tag) => ({
      value: tag.id,
      label: tag.name,
    }))
  }, [locationTags])

  const onSuccess = (rawResponse) => {
    const { data } = rawResponse.data
    const id = data.id

    toast.success(translations["pages"]["add-ticket"]["need-added"])

    setTimeout(() => {
      return router.push(
        RouteDefinitions.TicketDetails.replace(":id", String(id))
      )
    }, 1000)
  }

  const addTicketMutation = useMutation<TicketPostData, Error, TicketPostData>(
    (newTicket) => {
      console.log('new ticket', newTicket)
      const {
        phone,
        what,
        where,
        who,
        count,
        need_tag_id,
        phone_public,
        adults,
        children,
        has_pets,
      } = newTicket
      const expirationTimestampSane = dayjs().add(24, "hour").format()

      let newTicketData = {
        phone,
        description: what,
        what,
        where,
        who,
        // @deprecated - I've set to 0, because it was fetched from my localStorage from the days when it was used.
        // Now it is not, but if it is set, it will be shown in ticket details view, so we don't want to set it.
        count: 0,
        expirationTimestampSane,
        phone_public,
        need_tag_id,

        // The problem that might arise is that we store data in localStorage,
        // so if we hide it somehow on the form, it might be pulled from localStorage anyway
        // so make sure it works correctly.
        adults: adults ? adults : 0,
        children: children ? children : 0,
        has_pets,
      }
      // if trip
      if (whereFromTag || whereToTag) {
        newTicketData = Object.assign(newTicketData, {
          need_type: "trip",
          where_from_tag: whereFromTag,
          where_to_tag: whereToTag,
        })
      }

      console.log(newTicketData)
      // return axios.post(`/api/add-ticket`, newTicketData)
    },
    {
      onSuccess,
    }
  )

  const savedTicketFormData = getInitialDataFromLocalStorage()
  const useFormOptions: any = {}

  if (savedTicketFormData) {
    useFormOptions.defaultValues = savedTicketFormData
  }
  const { register, handleSubmit } = useForm<TicketFormData>(useFormOptions)

  if (!tags || !locationTags) return null

  const submitNeed = async (data: TicketFormData) => {
    if (authStatus === "unauthenticated" || !authSession?.user) {
      toast.error(translations["pages"]["auth"]["you-have-been-logged-out"])
      return router.push(RouteDefinitions.SignIn)
    }

    saveNeedInfoToLocalStorage(data, tagsSelected)

    const tagsData = tagsSelected.map((tag) => {
      return { need_tag_id: { id: tag } }
    })

    const postData: TicketPostData = {
      ...data,
      phone: authSession.phoneNumber,
      need_tag_id: tagsData,
    }
    addTicketMutation.mutate(postData)
  }

  const toggleTypeTag = (tagId: number) => {
    if (tagsSelected.includes(tagId)) {
      setTagsSelected(tagsSelected.filter((id) => id !== tagId))
    } else {
      setTagsSelected([...tagsSelected, tagId])
    }
  }

  return (
    <div className="bg-white shadow rounded-lg max-w-2xl mx-auto">
      <Container className="px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmit(submitNeed)}>

          <AddNeedMobile
            typeTags={tags}
            toggleTypeTag={toggleTypeTag}
            selectedTypeTags={tagsSelected}

            locationTags={mappedLocationTags}
            setWhereToTag={setWhereToTag}
            setWhereFromTag={setWhereFromTag}

            addTicketMutation={addTicketMutation}
            register={register}
          />

          <AddNeedDesktop
            typeTags={tags}
            toggleTypeTag={toggleTypeTag}
            selectedTypeTags={tagsSelected}

            locationTags={mappedLocationTags}
            setWhereToTag={setWhereToTag}
            setWhereFromTag={setWhereFromTag}

            addTicketMutation={addTicketMutation}
            register={register}
          />

        </form>
      </Container>
    </div>
  )
}

export default AddTicket
