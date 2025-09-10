import { describe, expect, test } from "vitest";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import ValidationService from "../src/pairtest/lib/ValidationService.js";

describe("Validation Service", () => {
  const validationService = new ValidationService();
  const validAccountId = 1;
  const invalidAccountIds = [-1, 0, 1.5, "1", true];
  const validRequest = {
    ADULT: 5,
    CHILD: 1,
    INFANT: 3,
    TOTAL: 17,
  };

  describe("valididateAccountId", () => {
    test("should not throw", () => {
      expect(() =>
        validationService.validateAccountId(validAccountId, validRequest),
      ).not.toThrow();
    });

    test("should throw if account ID is invalid", () => {
      invalidAccountIds.forEach((id) => {
        expect(() => validationService.validateAccountId(id)).toThrow(
          new InvalidPurchaseException(`Invalid account ID: ${id}`),
        );
      });
    });
  });

  describe("validateTicketTypes", () => {
    test("should throw an error if more than 25 tickets are requested", () => {
      const invalidRequest = {
        ADULT: 26,
        CHILD: 0,
        INFANT: 0,
        TOTAL: 26,
      };
      expect(() =>
        validationService.validateTicketTypes(validAccountId, invalidRequest),
      ).toThrow(
        new InvalidPurchaseException(
          `Too many tickets requested - 26 of maximum 25`,
        ),
      );
    });

    test("should throw an error if no adult tickets are purchased", () => {
      const invalidRequest = {
        ...validRequest,
        ADULT: 0,
      };

      expect(() =>
        validationService.validateTicketTypes(validAccountId, invalidRequest),
      ).toThrow(
        new InvalidPurchaseException(
          "Account ID 1 tried to purchase 1 child ticket and 3 infant tickets with no adult ticket",
        ),
      );
    });
    test("should throw an error if the number of infant tickets exceeds the number of adult tickets", () => {
      const invalidRequest = {
        ...validRequest,
        INFANT: 6,
      };

      expect(() =>
        validationService.validateTicketTypes(validAccountId, invalidRequest),
      ).toThrow(
        new InvalidPurchaseException(
          "Account ID 1 tried to purchase more infant tickets (6) than adult tickets (5)",
        ),
      );
    });
    test("should throw an error if no tickets are requested", () => {
      expect(() =>
        validationService.validateTicketTypes(validAccountId),
      ).toThrow(
        "Account ID 1 tried to purchase tickets with no tickets requested",
      );
    });
  });
});
