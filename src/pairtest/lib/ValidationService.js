import C from "../../constants/index.js";
import InvalidPurchaseException from "./InvalidPurchaseException.js";

export default class ValidationService {
  constructor(logger) {
    this.logger = logger;
  }

  validateAccountId(accountId) {
    this.logger.info({ accountId }, "Validating account ID");
    if (
      typeof accountId !== "number" ||
      !Number.isInteger(accountId) ||
      accountId < 1
    ) {
      this.logger.error({ accountId }, "Invalid account ID");
      throw new InvalidPurchaseException(`Invalid account ID: ${accountId}`);
    }
  }

  validateTicketTypes(accountId, ticketsRequested) {
    this.logger.info(
      { accountId, ticketsRequested },
      "Validating ticket request",
    );
    if (!ticketsRequested || ticketsRequested.TOTAL === 0) {
      this.#logError(accountId, ticketsRequested, "No tickets requested");
      throw new InvalidPurchaseException(
        `Account ID ${accountId} tried to purchase tickets with no tickets requested`,
      );
    }

    if (ticketsRequested.ADULT === 0) {
      this.#logError(
        accountId,
        ticketsRequested,
        "No adult tickets in request",
      );
      throw new InvalidPurchaseException(
        `Account ID ${accountId} tried to purchase ${ticketsRequested.CHILD} child ${this.#maybePluraliseWord("ticket", ticketsRequested.CHILD)} and ${ticketsRequested.INFANT} infant ${this.#maybePluraliseWord("ticket", ticketsRequested.INFANT)} with no adult ticket`,
      );
    }

    if (ticketsRequested.TOTAL > C.maxTickets) {
      this.#logError(accountId, ticketsRequested, "Too many tickets requested");
      throw new InvalidPurchaseException(
        `Too many tickets requested - ${ticketsRequested.TOTAL} of maximum ${C.maxTickets}`,
      );
    }

    if (ticketsRequested.INFANT > ticketsRequested.ADULT) {
      this.#logError(
        accountId,
        ticketsRequested,
        "Insufficient adult tickets in request",
      );
      throw new InvalidPurchaseException(
        `Account ID ${accountId} tried to purchase more infant tickets (${ticketsRequested.INFANT}) than adult tickets (${ticketsRequested.ADULT})`,
      );
    }
  }

  #maybePluraliseWord(word, count) {
    if (count !== 1) return `${word}s`;
    else return word;
  }

  #logError(accountId, ticketsRequested, message) {
    this.logger.error({ accountId, ticketsRequested }, message);
  }
}
