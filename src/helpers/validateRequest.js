export default ({
  C
}) => ({
  accountId,
  ticketRequest
}) => {
  const errorMessages = C.tickets.responses.error
  const errors = []

  // handle accountId === 0 differently to no accountId provided
  if (accountId !== 0 && !accountId) errors.push(errorMessages.noAccountId)

  else {
    if (!Number.isInteger(accountId) || (Number.isInteger(accountId) && accountId <= 0)) errors.push(errorMessages.invalidAccountId)

    if (!ticketRequest || (ticketRequest.adult + ticketRequest.child + ticketRequest.infant === 0)) errors.push(errorMessages.noTicketsRequested)
    if (Object.keys(ticketRequest).length === 0) errors.push(errorMessages.invalidTicketType)
    if (ticketRequest.adult === 0) errors.push(errorMessages.adultTicketRequired)

    const invalidRequestKeys = Object.keys(ticketRequest)
      .filter(key => !C.tickets.allowedTypes.includes(key.toUpperCase()))

    if (invalidRequestKeys.length > 0) errors.push(errorMessages.invalidTicketType)
    if (
      typeof ticketRequest.adult !== 'number' ||
        typeof ticketRequest.child !== 'number' ||
        typeof ticketRequest.infant !== 'number'
    ) errors.push(errorMessages.invalidTicketNumber)
    if (ticketRequest.adult + ticketRequest.child + ticketRequest.infant > 20) errors.push(errorMessages.maxTicketsExceeded)
    if (ticketRequest.infant > ticketRequest.adult) errors.push(errorMessages.insufficientAdultTickets)
  }

  if (errors.length > 0) throw new Error(errors)
}
