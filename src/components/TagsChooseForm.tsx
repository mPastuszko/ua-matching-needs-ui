import { NeedTagType } from "../utils/ticket-types"
import { Box, Tag } from "@chakra-ui/react"

export const TagsChooseForm = (props: {
  tags: NeedTagType[]
  tagsSelected: number[]
  onClickTag: (tagId: number) => void
}) => (
  <Box>
    {props.tags.map((tag) => (
      <Tag
        key={tag.id}
        mr={2}
        mb={2}
        variant={props.tagsSelected.includes(tag.id) ? "solid" : "outline"}
        onClick={() => props.onClickTag(tag.id)}
        className={"cursor-pointer "}
        colorScheme={"blue"}
      >
        {tag.name}
      </Tag>
    ))}
  </Box>
)