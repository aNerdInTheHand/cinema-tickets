import { beforeEach, describe, expect, test, vi } from "vitest";
import C from "../src/constants";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import ValidationService from "../src/pairtest/lib/ValidationService.js";

describe("Validation Service", () => {
  let logMock;
  let validationService;
  beforeEach(() => {
    logMock = { info: vi.fn(), error: vi.fn() };
    validationService = new ValidationService(logMock);
  });
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
      expect(logMock.info).toHaveBeenCalledExactlyOnceWith(
        { accountId: validAccountId },
        "Validating account ID",
      );
      expect(logMock.error).not.toHaveBeenCalled();
    });

    test("should throw if account ID is invalid", () => {
      invalidAccountIds.forEach((id) => {
        expect(() => validationService.validateAccountId(id)).toThrow(
          new InvalidPurchaseException(`Invalid account ID: ${id}`),
        );
        expect(logMock.error).toHaveBeenCalledWith(
          { accountId: id },
          "Invalid account ID",
        );
      });
    });
  });

  describe("validateTicketTypes", () => {
    test("should not throw", () => {
      const edgeCaseValidRequest = {
        ADULT: 10,
        CHILD: 5,
        INFANT: 10,
      };
      expect(() =>
        validationService.validateTicketTypes(
          validAccountId,
          edgeCaseValidRequest,
        ),
      ).not.toThrow();
      expect(logMock.info).toHaveBeenCalledExactlyOnceWith(
        { ticketsRequested: edgeCaseValidRequest },
        "Validating ticket request",
      );
      expect(logMock.error).not.toHaveBeenCalled();
    });
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
          `Too many tickets requested - 26 of maximum ${C.maxTickets}`,
        ),
      );
    });

    test("should throw an error if no adult tickets are purchased", () => {
      const invalidRequestChildAndInfant = {
        ...validRequest,
        ADULT: 0,
      };
      const invalidRequestChildOnly = {
        ...validRequest,
        ADULT: 0,
        INFANT: 0,
      };
      const invalidRequestInfantOnly = {
        ...validRequest,
        ADULT: 0,
        CHILD: 0,
      };

      expect(() =>
        validationService.validateTicketTypes(
          validAccountId,
          invalidRequestChildAndInfant,
        ),
      ).toThrow(
        new InvalidPurchaseException(
          "Account ID 1 tried to purchase 1 child ticket and 3 infant tickets with no adult ticket",
        ),
      );
      expect(() =>
        validationService.validateTicketTypes(
          validAccountId,
          invalidRequestChildOnly,
        ),
      ).toThrow(
        new InvalidPurchaseException(
          "Account ID 1 tried to purchase 1 child ticket and 0 infant tickets with no adult ticket",
        ),
      );
      expect(() =>
        validationService.validateTicketTypes(
          validAccountId,
          invalidRequestInfantOnly,
        ),
      ).toThrow(
        new InvalidPurchaseException(
          "Account ID 1 tried to purchase 0 child tickets and 3 infant tickets with no adult ticket",
        ),
      );
      expect(logMock.error).toHaveBeenCalledWith(
        /Account ID 1 tried to purchase/g,
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
      expect(logMock.error).toHaveBeenCalledWith(
        "Account ID 1 tried to purchase more infant tickets (6) than adult tickets (5)",
      );
    });
    test("should throw an error if no tickets are requested", () => {
      expect(() =>
        validationService.validateTicketTypes(validAccountId),
      ).toThrow(
        "Account ID 1 tried to purchase tickets with no tickets requested",
      );
      expect(logMock.error).toHaveBeenCalledWith(
        "Account ID 1 tried to purchase tickets with no tickets requested",
      );
    });
  });
});
