import C from "../constants";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketTypeRequest from "./lib/TicketTypeRequest.js";

export default class TicketService {
  constructor(
    calculationService,
    ticketPaymentService,
    seatReservationService,
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
    this.#validateAccount(accountId);
    const ticketsRequested = this.#getTicketCounts(...ticketTypeRequests);
    this.#validateRequest(accountId, ticketsRequested);
    this.#makePayment(accountId, ticketsRequested);
    this.#reserveSeats(accountId, ticketsRequested);
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

  #validateAccount(accountId) {
    this.validationService.validateAccountId(accountId);
  }

  #validateRequest(accountId, ticketsRequested) {
    this.validationService.validateTicketTypes(accountId, ticketsRequested);
  }

  #makePayment(accountId, ticketsRequested) {
    const paymentAmount =
      this.calculationService.calculateCost(ticketsRequested);
    this.ticketPaymentService.makePayment(accountId, paymentAmount);
  }

  #reserveSeats(accountId, ticketsRequested) {
    const seatsExcludingInfants =
      ticketsRequested.TOTAL - ticketsRequested.INFANT;
    this.seatReservationService.reserveSeat(accountId, seatsExcludingInfants);
  }
}
