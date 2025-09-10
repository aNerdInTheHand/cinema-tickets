import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

const adult = (count) => new TicketTypeRequest("ADULT", count);
const child = (count) => new TicketTypeRequest("CHILD", count);
const infant = (count) => new TicketTypeRequest("INFANT", count);

describe("Ticket Service", () => {
  let ticketService;

  let logMock;
  let calculationMock;
  let paymentMock;
  let seatReservationMock;
  let validationMock;

  beforeEach(() => {
    logMock = { info: vi.fn() };
    calculationMock = { calculateCost: vi.fn() };
    paymentMock = { makePayment: vi.fn() };
    seatReservationMock = { reserveSeat: vi.fn() };
    validationMock = {
      validateAccountId: vi.fn(),
      validateTicketTypes: vi.fn(),
    };
    ticketService = new TicketService(
      logMock,
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

      calculationMock.calculateCost.mockImplementation(
        () => expectedPaymentAmount,
      );

      ticketService.purchaseTickets(
        accountId,
        adultTickets,
        childTickets,
        infantTickets,
      );

      const expectedLogs = [
        "Ticket purchase process started",
        "Making payment",
        "Payment successful",
        "Reserving seats",
        "Seats successfully reserved",
        "Booking complete",
      ];

      expect(validationMock.validateAccountId).toHaveBeenCalledWith(accountId);
      expect(validationMock.validateTicketTypes).toHaveBeenCalledWith(
        accountId,
        expectedTicketRequests,
      );
      expect(calculationMock.calculateCost).toHaveBeenCalledWith(
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
      expectedLogs.forEach((logMessage) => {
        expect(logMock.info).toHaveBeenCalledWith({ accountId }, logMessage);
      });
    });
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
