import type { NextPage } from "next"
import { Tickets } from "../../../src/components/Tickets"
import { TICKET_STATUS } from "../../../src/utils/ticket-types"

const MineInactiveTickets: NextPage = () => {
  return <Tickets mineOnly={true} status={TICKET_STATUS.EXPIRED} />
}

export default MineInactiveTickets
