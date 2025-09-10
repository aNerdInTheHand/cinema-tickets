import C from "../constants";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketTypeRequest from "./lib/TicketTypeRequest.js";

export default class TicketService {
  constructor(
    calculationService,
    seatReservationService,
    ticketPaymentService,
    validationService,
  ) {
    this.calculationService = calculationService;
    this.seatReservationService = seatReservationService;
    this.ticketPaymentService = ticketPaymentService;
    this.validationService = validationService;
  }

  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.accountId = accountId;
    this.#validateRequest(accountId, ...ticketTypeRequests);
  }

  #getTicketCounts(...ticketTypeRequests) {
    const ticketsRequested = {
      ADULT: 0,
      CHILD: 0,
      INFANT: 0,
      TOTAL: 0,
    };

    ticketTypeRequests.forEach((request) => {
      ticketsRequested[request.getTicketType()] += request.getNoOfTickets();
      ticketsRequested.TOTAL += request.getNoOfTickets();
    });

    return ticketsRequested;
  }

  #validateRequest(accountId, ...ticketTypeRequests) {
    const ticketsRequested = this.#getTicketCounts(...ticketTypeRequests);

    this.validationService.validateAccountId(accountId);
    this.validationService.validateTicketTypes(accountId, ticketsRequested);
  }
}
