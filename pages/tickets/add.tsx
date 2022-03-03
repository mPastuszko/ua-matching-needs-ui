import {
  Box,
  Checkbox,
  Container,
  Heading,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import type { NextPage } from "next"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import axios from "axios"
import { getUserInfo } from "../../src/services/auth"
import { useRouter } from "next/router"
import { RouteDefinitions } from "../../src/utils/routes"
import { toast } from "react-toastify"
import dayjs from "dayjs"
import { useTranslations } from "../../src/hooks/translations"
import { useCallback, useState } from "react"
import { AddTicketButton } from "../../src/components/AddTicketButton"
import { getMainTags } from "../../src/utils/tags"
import { TicketFormData, TicketPostData } from "../../src/utils/ticket-types"
import { TagsChooseForm } from "../../src/components/TagsChooseForm"
import {
  getInitialDataFromLocalStorage,
  getPreviouslySavedTags,
  saveForFurtherUsage,
} from "../../src/utils/add-ticket"
import { AddingTicketResult } from "../../src/components/AddingTicketResult"

const AddTicket: NextPage = () => {
  console.debug("render AddTicket")
  const router = useRouter()
  const translations = useTranslations()

  const previouslySavedTags = useCallback(() => getPreviouslySavedTags(), [])
  const [tagsSelected, setTagsSelected] =
    useState<number[]>(previouslySavedTags)

  const { data: tags } = useQuery(`main-tags`, () => {
    return getMainTags()
  })

  const onSuccess = (rawResponse) => {
    console.log("onSuccess !!")
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
      const { phone, what, where, who, count, need_tag_id, phone_public } =
        newTicket
      const now = new Date()
      // @deprecated
      const expirationTimestamp = now.setHours(now.getHours() + 3)
      const expirationTimestampSane = dayjs().add(24, "hour").format()

      const newTicketData = {
        phone,
        description: what,
        what,
        where,
        who,
        phone_public,
        count: count ? count : 0,
        // @deprecated
        expirationTimestamp,
        expirationTimestampSane,
        need_tag_id,
      }

      return axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/items/need`,
        newTicketData
      )
    },
    {
      onSuccess,
    }
  )

  const savedTicketFormData = useCallback(
    () => getInitialDataFromLocalStorage(),
    []
  )

  const useFormOptions: any = {}

  if (savedTicketFormData) {
    useFormOptions.defaultValues = savedTicketFormData
  }
  const { register, handleSubmit } = useForm<TicketFormData>(useFormOptions)

  const submitNeed = async (data: TicketFormData) => {
    const userInfo = getUserInfo()
    if (!userInfo) {
      toast.error(translations["pages"]["auth"]["you-have-been-logged-out"])
      return router.push(RouteDefinitions.SignIn)
    }

    saveForFurtherUsage(data, tagsSelected)

    const tagsData = tagsSelected.map((tag) => {
      return { need_tag_id: { id: tag } }
    })

    const postData: TicketPostData = {
      ...data,
      phone: userInfo.phone,
      need_tag_id: tagsData,
    }
    addTicketMutation.mutate(postData)
  }

  const toggleTag = (tagId: number) => {
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
          <Stack>
            <Heading as="h1" size="xl">
              {translations["pages"]["add-ticket"]["add-need"]}
            </Heading>

            <Stack>
              <Heading as={"h2"} size={"l"}>
                {translations["pages"]["add-ticket"]["tags"]}
              </Heading>

              <TagsChooseForm
                tags={tags || []}
                onClickTag={toggleTag}
                tagsSelected={tagsSelected}
              />
            </Stack>
            <Stack>
              <Heading as={"h2"} size={"l"}>
                {translations["pages"]["add-ticket"]["what-do-you-need"]}
              </Heading>
              <Textarea
                rows={6}
                placeholder={
                  translations["pages"]["add-ticket"]["what-do-you-need"]
                }
                variant={"outline"}
                {...register("what")}
              />
            </Stack>
            <Stack>
              <Heading as={"h2"} size={"l"}>
                {
                  translations["pages"]["add-ticket"][
                    "where-do-you-need-it-delivered"
                  ]
                }
              </Heading>
              <Textarea
                placeholder={
                  translations["pages"]["add-ticket"]["address-or-gps"]
                }
                variant={"outline"}
                {...register("where")}
              />
            </Stack>
            <Stack>
              <Heading as={"h2"} size={"l"}>
                {translations["pages"]["add-ticket"]["who-needs-it"]}
              </Heading>
              <Text fontSize={"sm"}>
                {
                  translations["pages"]["add-ticket"][
                    "name-surname-or-org-name"
                  ]
                }
              </Text>
              <Textarea
                placeholder={
                  translations["pages"]["add-ticket"]["who-needs-it"]
                }
                variant={"outline"}
                {...register("who")}
              />
              <Checkbox
                value={1}
                defaultChecked={true}
                {...register("phone_public")}
              >
                Pokaż mój numer telefonu publicznie
              </Checkbox>
            </Stack>

            <AddingTicketResult />

            <Box
              as="button"
              type="submit"
              disabled={addTicketMutation.isLoading}
            >
              <AddTicketButton />
            </Box>
          </Stack>
        </form>
      </Container>
    </div>
  )
}

export default AddTicket
