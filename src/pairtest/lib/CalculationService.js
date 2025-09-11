import C from "../../constants/index.js";

export default class CalculationService {
  calculateCost(ticketsRequested) {
    return (
      C.ticketPrices.adult * ticketsRequested.ADULT +
      C.ticketPrices.child * ticketsRequested.CHILD
    );
  }
}
