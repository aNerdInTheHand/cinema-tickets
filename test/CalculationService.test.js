import { describe, expect, test } from "vitest";
import C from "../src/constants";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import CalculationService from "../src/pairtest/lib/CalculationService.js";

describe("Calculation Service", () => {
  const ticketPrices = C.ticketPrices;
  const calculationService = new CalculationService();

  describe("calculateCost", () => {
    test("correctly calculates ticket costs", () => {
      const testCases = [
        {
          requestedTickets: { ADULT: 1, CHILD: 0, INFANT: 0, TOTAL: 0 },
          expectedTotal: ticketPrices.adult * 1,
        },
        {
          requestedTickets: { ADULT: 25, CHILD: 0, INFANT: 0, TOTAL: 25 },
          expectedTotal: ticketPrices.adult * 25,
        },
        {
          requestedTickets: { ADULT: 13, CHILD: 0, INFANT: 12, TOTAL: 25 },
          expectedTotal: ticketPrices.adult * 13, // infants don't pay
        },
        {
          requestedTickets: { ADULT: 13, CHILD: 12, INFANT: 0, TOTAL: 25 },
          expectedTotal: ticketPrices.adult * 13 + ticketPrices.child * 12,
        },
      ];
      testCases.forEach((testCase) => {
        const total = calculationService.calculateCost(
          testCase.requestedTickets,
        );
        expect(testCase.expectedTotal).toBe(total);
      });
    });
  });
});
