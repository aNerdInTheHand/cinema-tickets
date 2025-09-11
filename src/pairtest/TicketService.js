import TicketTypeRequest from "./lib/TicketTypeRequest.js";

export default class TicketService {
  constructor(
    logger,
    calculationService,
    ticketPaymentService,
    seatReservationService,
    validationService,
  ) {
    this.logger = logger;
    this.calculationService = calculationService;
    this.seatReservationService = seatReservationService;
    this.ticketPaymentService = ticketPaymentService;
    this.validationService = validationService;
  }

  /**
   * Should only have private methods other than the one below.
   */

  /**
   * Orchestrates calls to the validation, seat reservation and payment services
   * @param {Number} accountId
   * @param  {...TicketTypeRequest} ticketTypeRequests
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.logger.info({ ...ticketTypeRequests }, "Ticket Type Requests");
    this.logger.info({ accountId }, "Ticket purchase process started");

    this.#validateAccount(accountId);
    const ticketsRequested = this.#getTicketCounts(...ticketTypeRequests);
    this.#validateRequest(accountId, ticketsRequested);
    this.#makePayment(accountId, ticketsRequested);
    this.#reserveSeats(accountId, ticketsRequested);

    this.logger.info({ accountId }, "Booking complete");
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
    this.logger.info({ accountId }, "Making payment");
    const paymentAmount =
      this.calculationService.calculateCost(ticketsRequested);
    this.ticketPaymentService.makePayment(accountId, paymentAmount);
    this.logger.info({ accountId }, "Payment successful");
  }

  #reserveSeats(accountId, ticketsRequested) {
    this.logger.info({ accountId }, "Reserving seats");
    const seatsExcludingInfants =
      ticketsRequested.TOTAL - ticketsRequested.INFANT;
    this.seatReservationService.reserveSeat(accountId, seatsExcludingInfants);
    this.logger.info({ accountId }, "Seats successfully reserved");
  }
}
