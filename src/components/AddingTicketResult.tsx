import { useTranslations } from "../hooks/translations"
import { Box, Text } from "@chakra-ui/react"

export const AddingTicketResult = (addTicketMutation) => {
  const translations = useTranslations()

  return (
    <Box>
      {addTicketMutation.isError ? (
        <Text color={"red"}>
          {translations["errors"]["error-occured-while-adding"]}
          {addTicketMutation.error.message}
        </Text>
      ) : null}

      {addTicketMutation.isSuccess ? (
        <Text>{translations["pages"]["add-ticket"]["request-added"]}</Text>
      ) : null}
    </Box>
  )
}