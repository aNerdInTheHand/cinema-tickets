import C from "../constants";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";

export default class TicketService {
  constructor(
    ticketPaymentService = new TicketPaymentService(),
    seatReservationService = new SeatReservationService(),
  ) {
    this.ticketPaymentService = ticketPaymentService;
    this.seatReservationService = seatReservationService;
  }

  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.accountId = accountId;
    this.#validateAccountId(accountId);
    this.#validateTicketTypes(...ticketTypeRequests);
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

  #validateAccountId(accountId) {
    if (
      typeof accountId !== "number" ||
      !Number.isInteger(accountId) ||
      accountId < 1
    )
      throw new InvalidPurchaseException(`Invalid account ID: ${accountId}`);
  }

  #validateTicketTypes(...ticketTypeRequests) {
    const ticketsRequested = this.#getTicketCounts(...ticketTypeRequests);
    if (ticketsRequested.TOTAL === 0)
      throw new InvalidPurchaseException(
        `Account ID ${this.accountId} tried to purchase tickets with no tickets requested`,
      );

    if (ticketsRequested.ADULT === 0)
      throw new InvalidPurchaseException(
        `Account ID ${this.accountId} tried to purchase ${ticketsRequested.CHILD} child ${this.#maybePluraliseWord("ticket", ticketsRequested.CHILD)} and ${ticketsRequested.INFANT} infant ${this.#maybePluraliseWord("ticket", ticketsRequested.INFANT)} with no adult ticket`,
      );

    if (ticketsRequested.TOTAL > 25)
      throw new InvalidPurchaseException(
        `Too many tickets requested - ${ticketsRequested.TOTAL} of maximum ${C.maxTickets}`,
      );

    if (ticketsRequested.INFANT > ticketsRequested.ADULT)
      throw new InvalidPurchaseException(
        `Account ID ${this.accountId} tried to purchase more infant tickets (${ticketsRequested.INFANT}) than adult tickets (${ticketsRequested.ADULT})`,
      );
  }

  #maybePluraliseWord(word, count) {
    if (count > 1) return `${word}s`;
    else return word;
  }
}
