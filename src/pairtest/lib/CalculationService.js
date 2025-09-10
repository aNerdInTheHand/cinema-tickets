import C from "../../constants";

export default class CalculationService {
  calculateCost(ticketsRequested) {
    return (
      C.ticketPrices.adult * ticketsRequested.ADULT +
      C.ticketPrices.child * ticketsRequested.CHILD
    );
  }
}
