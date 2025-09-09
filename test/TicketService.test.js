import { describe, expect, test } from "vitest";

describe("Ticket Service", () => {
  describe("valid requests", () => {
    test("placeholder test", () => {
      expect(1 + 1).toBe(2);
    });

    test.todo("should calculate the correct price for a single adult ticket");
    test.todo("should calculate the correct price for multiple ticket types");
    test.todo("should not include infant tickets in the seat reservation");
    test.todo("should allow purchasing up to the maximum of 25 tickets");
    test.todo(
      "should make a payment request to TicketPaymentService with the correct total amount",
    );
    test.todo(
      "should make a seat reservation request to SeatReservationService with the correct number of seats",
    );
    test.todo("should handle a purchase with only adult tickets");
    test.todo("should handle a purchase with adult and child tickets");
    test.todo("should handle a purchase with adult and infant tickets");
    test.todo("should handle a purchase with adult, child, and infant tickets");
  });

  describe("invalid requests", () => {
    test("should throw an error", () => {
      expect(1 + 1).toBe(2);
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
    test.todo("should throw an error for an invalid account ID");
    test.todo(
      "should throw an error if the ticket type request contains no adult tickets",
    );
    test.todo(
      "should throw an error if the number of tickets is not an integer",
    );
  });
});
