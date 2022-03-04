import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import axios from "axios"
import { withSentry } from "@sentry/nextjs"
import { TICKET_STATUS } from "../../src/services/ticket.type"

const handler = async function (req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const { id } = req.body
  console.debug(req.body)

  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/items/need/${id}`,
    {
      ticket_status: TICKET_STATUS.SOLVED,
    },
    {
      headers: {
        Authorization: `Bearer ${session?.directusAccessToken}`,
        "Content-Type": "application/json",
      },
    }
  )

  return res.status(200).json(response.data)
}

export default withSentry(handler)
