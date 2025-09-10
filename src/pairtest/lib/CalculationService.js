import C from "../../constants";
import InvalidPurchaseException from "./InvalidPurchaseException.js";

export default class CalculationService {
  calculateCost(ticketsRequested) {
    return (
      C.ticketPrices.adult * ticketsRequested.ADULT +
      C.ticketPrices.child * ticketsRequested.CHILD
    );
  }
}
