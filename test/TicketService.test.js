import { beforeEach, describe, expect, test, vi } from "vitest";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

describe("Ticket Service", () => {
  let ticketService;

  let seatReservationMock;
  let paymentMock;

  beforeEach(() => {
    seatReservationMock = { reserveSeat: vi.fn() };
    paymentMock = { makePayment: vi.fn() };
    ticketService = new TicketService(paymentMock, seatReservationMock);
  });

  describe("valid requests", () => {
    test("should make a payment request to TicketPaymentService with the correct total amount", () => {
      const accountId = 1;
      const adultTickets = new TicketTypeRequest("ADULT", 2);
      const childTickets = new TicketTypeRequest("CHILD", 1);
      const infantTickets = new TicketTypeRequest("INFANT", 1);

      // // ADULT: 2 * 25 = 50
      // // CHILD: 1 * 15 = 15
      // // INFANT: 1 * 0 = 0
      // // Total = 65

      ticketService.purchaseTickets(
        accountId,
        adultTickets,
        childTickets,
        infantTickets,
      );

      expect(seatReservationMock.reserveSeat).toHaveBeenCalledWith(1, 3);
      expect(paymentMock.makePayment).toHaveBeenCalledWith(1, 65);
    });

    test.todo("should calculate the correct price for a single adult ticket");
    test.todo("should calculate the correct price for multiple ticket types");
    test.todo("should not include infant tickets in the seat reservation");
    test.todo("should allow purchasing up to the maximum of 25 tickets");
    test.todo(
      "should make a seat reservation request to SeatReservationService with the correct number of seats",
    );
    test.todo("should handle a purchase with only adult tickets");
    test.todo("should handle a purchase with adult and child tickets");
    test.todo("should handle a purchase with adult and infant tickets");
    test.todo("should handle a purchase with adult, child, and infant tickets");
  });

  describe("invalid requests", () => {
    test("should throw if account ID is invalid (<= 0)", () => {
      const adults = new TicketTypeRequest("ADULT", 1);

      expect(() => ticketService.purchaseTickets(0, adults)).toThrow(
        InvalidPurchaseException,
      );
    });

    test.todo("should throw an error if more than 25 tickets are requested");
    test.todo(
      "should throw an error if child tickets are purchased without an adult ticket",
    );
    test.todo(
      "should throw an error if infant tickets are purchased without an adult ticket",
    );
    test.todo(
      "should throw an error if the number of infant tickets exceeds the number of adult tickets",
    );
    test.todo("should throw an error if no tickets are requested");
    test.todo(
      "should throw an error if the ticket type request contains no adult tickets",
    );
    test.todo(
      "should throw an error if the number of tickets is not an integer",
    );
  });
});
