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
    console.log(...ticketTypeRequests);
    this.#validateAccountId(accountId);
    this.#validateTicketTypes(...ticketTypeRequests);
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
    let totalTickets = 0;
    ticketTypeRequests.forEach((request) => {
      totalTickets += request.getNoOfTickets();
    });
    if (totalTickets > 25)
      throw new InvalidPurchaseException(
        `Too many tickets requested - ${totalTickets} of maximum ${C.maxTickets}`,
      );
  }
}
