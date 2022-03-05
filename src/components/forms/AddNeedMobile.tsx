import { Checkbox, Heading, Input, Stack, Text, Textarea } from "@chakra-ui/react"
import Select from "react-select"
import { PlusSVG } from "../../assets/styled-svgs/plus"
import { useTranslations } from "../../hooks/translations"
import { TagsChooseForm } from "./TagsChooseFrom"

type AddNeedMobileProps = {
  typeTags: any
  toggleTypeTag: any
  selectedTypeTags: any
  locationTags: any
  register: any
  addTicketMutation: any
  setWhereFromTag: any
  setWhereToTag: any
}

export const AddNeedMobile = (props: AddNeedMobileProps) => {
  const {
    typeTags,
    toggleTypeTag,
    selectedTypeTags,
    register,
    addTicketMutation,
    locationTags,
    setWhereFromTag,
    setWhereToTag
  } = props
  const translations = useTranslations()

  return (
    <div className="block md:hidden">
      <Stack>
        <Heading as="h3" size="xl">
          {translations["pages"]["add-ticket"]["add-need"]}
        </Heading>

        <Stack>
          <Heading as={"h2"} size={"l"}>
            {translations["pages"]["add-ticket"]["tags"]}
          </Heading>

          <TagsChooseForm
            tags={typeTags || []}
            onClickTag={toggleTypeTag}
            tagsSelected={selectedTypeTags}
          />
        </Stack>

        <div>
          <Stack marginBottom="16px">
            <div className="flex justify-between">
              <Heading as={"h2"} size={"l"}>
                {translations["pages"]["add-ticket"]["adults"]}
              </Heading>
              {translations["pages"]["add-ticket"]["adultsAge"]}
            </div>
            <Input
              min={0}
              type={"number"}
              placeholder={translations["pages"]["add-ticket"]["adultsHint"]}
              variant={"outline"}
              {...register("adults")}
            />
          </Stack>

          <Stack marginBottom="16px">
            <div className="flex justify-between">
              <Heading as={"h2"} size={"l"}>
                {translations["pages"]["add-ticket"]["children"]}
              </Heading>
              {translations["pages"]["add-ticket"]["childrenAge"]}
            </div>
            <Input
              min={0}
              type={"number"}
              placeholder={
                translations["pages"]["add-ticket"]["childrenHint"]
              }
              variant={"outline"}
              {...register("children")}
            />
          </Stack>

          <Checkbox
            value={1}
            defaultChecked={false}
            {...register("has_pets")}
          >
            {translations["pages"]["add-ticket"]["has-pets"]}
          </Checkbox>
        </div>

        <Stack marginBottom="16px">
          <Heading as={"h2"} size={"l"}>
            {translations["pages"]["add-ticket"].whereFrom}
          </Heading>
          <Select
            options={locationTags}
            onChange={(tag: any) => setWhereFromTag(tag.value)}
            placeholder={translations["pages"]["add-ticket"]["chooseLocation"]}
          />
        </Stack>

        <Stack marginBottom="16px">
          <Heading as={"h2"} size={"l"}>
            {translations["pages"]["add-ticket"].whereTo}
          </Heading>
          <Select
            options={locationTags}
            onChange={(tag: any) => setWhereToTag(tag.value)}
            placeholder={translations["pages"]["add-ticket"]["chooseLocation"]}
          />
        </Stack>

        <Stack marginBottom="16px">
          <Heading as={"h2"} size={"l"}>
            {translations["pages"]["add-ticket"]["what-do-you-need"]}
          </Heading>
          <Textarea
            rows={6}
            placeholder={
              translations["pages"]["add-ticket"]["what-do-you-need-hint"]
            }
            variant={"outline"}
            {...register("what")}
          />
        </Stack>

        <Stack marginBottom="16px">
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

        <Stack marginBottom="16px">
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
        </Stack>

        {addTicketMutation.isError ? (
          <Text color={"red"}>
            {translations["errors"]["error-occured-while-adding"]}
            {addTicketMutation.error.message}
          </Text>
        ) : null}

        {addTicketMutation.isSuccess ? (
          <Text>
            {translations["pages"]["add-ticket"]["request-added"]}
          </Text>
        ) : null}

        <Checkbox
          value={1}
          defaultChecked={true}
          {...register("phone_public")}
        >
          {translations["pages"]["add-ticket"].show_phone_public}
        </Checkbox>

        <button
          type="submit"
          disabled={addTicketMutation.isLoading}
          className="w-full relative inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-amber-300 shadow-sm hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusSVG />
          <span>{translations["/tickets/add"]}</span>
        </button>
      </Stack>
    </div>
  )
}