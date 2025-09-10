import C from "../../constants";
import InvalidPurchaseException from "./InvalidPurchaseException.js";

export default class TicketService {
  validateAccountId(accountId) {
    if (
      typeof accountId !== "number" ||
      !Number.isInteger(accountId) ||
      accountId < 1
    )
      throw new InvalidPurchaseException(`Invalid account ID: ${accountId}`);
  }

  validateTicketTypes(accountId, ticketsRequested) {
    if (!ticketsRequested || ticketsRequested.TOTAL === 0)
      throw new InvalidPurchaseException(
        `Account ID ${accountId} tried to purchase tickets with no tickets requested`,
      );

    if (ticketsRequested.ADULT === 0)
      throw new InvalidPurchaseException(
        `Account ID ${accountId} tried to purchase ${ticketsRequested.CHILD} child ${this.#maybePluraliseWord("ticket", ticketsRequested.CHILD)} and ${ticketsRequested.INFANT} infant ${this.#maybePluraliseWord("ticket", ticketsRequested.INFANT)} with no adult ticket`,
      );

    if (ticketsRequested.TOTAL > 25)
      throw new InvalidPurchaseException(
        `Too many tickets requested - ${ticketsRequested.TOTAL} of maximum ${C.maxTickets}`,
      );

    if (ticketsRequested.INFANT > ticketsRequested.ADULT)
      throw new InvalidPurchaseException(
        `Account ID ${accountId} tried to purchase more infant tickets (${ticketsRequested.INFANT}) than adult tickets (${ticketsRequested.ADULT})`,
      );
  }

  #maybePluraliseWord(word, count) {
    if (count > 1) return `${word}s`;
    else return word;
  }
}
