import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

const adult = (count) => new TicketTypeRequest("ADULT", count);
const child = (count) => new TicketTypeRequest("CHILD", count);
const infant = (count) => new TicketTypeRequest("INFANT", count);

describe("Ticket Service", () => {
  let ticketService;

  let calculationMock;
  let paymentMock;
  let seatReservationMock;
  let validationMock;

  beforeEach(() => {
    calculationMock = { calculateCost: vi.fn() };
    paymentMock = { makePayment: vi.fn() };
    seatReservationMock = { reserveSeat: vi.fn() };
    validationMock = {
      validateAccountId: vi.fn(),
      validateTicketTypes: vi.fn(),
    };
    ticketService = new TicketService(
      calculationMock,
      paymentMock,
      seatReservationMock,
      validationMock,
    );
  });

  describe("valid requests", () => {
    test("should call the validation, calculation, reservation and payment services", () => {
      const accountId = 1;
      const adultTickets = adult(2);
      const childTickets = child(1);
      const infantTickets = infant(1);
      const expectedTicketRequests = {
        ADULT: 2,
        CHILD: 1,
        INFANT: 1,
        TOTAL: 4,
      };
      const expectedSeatsToReserve = 3; // infants are excluded
      const expectedPaymentAmount = 65; // 2 * 25 + 1 * 15

      ticketService.purchaseTickets(
        accountId,
        adultTickets,
        childTickets,
        infantTickets,
      );

      expect(validationMock.validateAccountId).toHaveBeenCalledWith(accountId);
      expect(validationMock.validateTicketTypes).toHaveBeenCalledWith(
        accountId,
        expectedTicketRequests,
      );
      expect(seatReservationMock.reserveSeat).toHaveBeenCalledWith(
        accountId,
        expectedSeatsToReserve,
      );
      expect(paymentMock.makePayment).toHaveBeenCalledWith(
        accountId,
        expectedPaymentAmount,
      );
    });
    test.todo(
      "should make a payment request to TicketPaymentService with the correct total amount",
      () => {
        const accountId = 1;
        const adultTickets = adult(2);
        const childTickets = child(1);
        const infantTickets = infant(1);

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

        // expect(seatReservationMock.reserveSeat).toHaveBeenCalledWith(1, 3);
        expect(paymentMock.makePayment).toHaveBeenCalledWith(1, 65);
      },
    );

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
    test("should only call validation service account validation with invalid account ID", () => {
      const invalidAccountId = 0;
      validationMock.validateAccountId.mockImplementation((accountId) => {
        if (accountId === invalidAccountId) {
          throw new InvalidPurchaseException();
        }
      });
      expect(() => ticketService.purchaseTickets(invalidAccountId)).toThrow(
        InvalidPurchaseException,
      );

      expect(validationMock.validateAccountId).toHaveBeenCalledWith(
        invalidAccountId,
      );
      expect(validationMock.validateTicketTypes).not.toHaveBeenCalled();
      expect(paymentMock.makePayment).not.toHaveBeenCalled();
      expect(seatReservationMock.reserveSeat).not.toHaveBeenCalled();
    });

    test("should not call reservation or payments services with invalid ticket request", () => {
      const validAccountId = 1;
      const adultTickets = adult(0);
      const childTickets = child(1);
      const infantTickets = infant(0);
      const invalidTicketsRequested = {
        ADULT: 0,
        CHILD: 1,
        INFANT: 0,
        TOTAL: 1,
      };
      validationMock.validateTicketTypes.mockImplementation(
        (_accountId, ticketsRequested) => {
          if (
            JSON.stringify(ticketsRequested) ===
            JSON.stringify(invalidTicketsRequested)
          )
            throw new InvalidPurchaseException();
        },
      );
      expect(() =>
        ticketService.purchaseTickets(
          validAccountId,
          adultTickets,
          childTickets,
          infantTickets,
        ),
      ).toThrow(InvalidPurchaseException);

      expect(validationMock.validateAccountId).toHaveBeenCalledWith(
        validAccountId,
      );
      expect(validationMock.validateTicketTypes).toHaveBeenCalledWith(
        validAccountId,
        invalidTicketsRequested,
      );
      expect(paymentMock.makePayment).not.toHaveBeenCalled();
      expect(seatReservationMock.reserveSeat).not.toHaveBeenCalled();
    });
  });
});
