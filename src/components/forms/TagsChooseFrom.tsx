import { NeedTagType } from "../../services/ticket.type"
import { useTagTranslation } from "../../hooks/useTagTranslation"
import { Box, Tag } from "@chakra-ui/react"


export const TagsChooseForm = (props: {
  tags: NeedTagType[]
  tagsSelected: number[] | number | undefined
  onClickTag: (tagId: number) => void
}) => {
  const { getTranslation } = useTagTranslation()

  function isTagIdSelected(tagId: number): boolean {
    if (props.tagsSelected === tagId) return true
    if (props.tagsSelected && typeof props.tagsSelected !== "number") {
      return props.tagsSelected && props.tagsSelected.includes(tagId)
    }
    return false
  }

  return (
    <Box>
      {props.tags.map((tag) => {
        return (
          <Tag
            key={tag.id}
            mr={2}
            mb={2}
            variant={isTagIdSelected(tag.id) ? "solid" : "outline"}
            onClick={() => props.onClickTag(tag.id)}
            className={"cursor-pointer "}
            colorScheme={"blue"}
          >
            {getTranslation(tag)}
          </Tag>
        )
      })}
    </Box>
  )
}