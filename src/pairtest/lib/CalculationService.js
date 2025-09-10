import C from "../../constants";
import InvalidPurchaseException from "./InvalidPurchaseException.js";

export default class CalculationService {
  calculateCost(requestedTickets) {
    return (
      C.ticketPrices.adult * requestedTickets.ADULT +
      C.ticketPrices.child * requestedTickets.CHILD
    );
  }
}
