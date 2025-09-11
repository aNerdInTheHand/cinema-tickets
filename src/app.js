import express from "express";
import pino from "pino";
import InvalidPurchaseException from "./pairtest/lib/InvalidPurchaseException.js";
import CalculationService from "./pairtest/lib/CalculationService.js";
import SeatReservationService from "./thirdparty/seatbooking/SeatReservationService.js";
import TicketPaymentService from "./thirdparty/paymentgateway/TicketPaymentService.js";
import TicketService from "./pairtest/TicketService.js";
import ValidationService from "./pairtest/lib/ValidationService.js";
import TicketTypeRequest from "./pairtest/lib/TicketTypeRequest.js";

const app = express();
const port = 3000;
const logger = pino({});

app.use(express.json());

const ticketService = new TicketService(
  logger,
  new CalculationService(),
  new TicketPaymentService(),
  new SeatReservationService(),
  new ValidationService(logger),
);

app.get("/healthcheck", (req, res) => {
  res.send("Service running");
});

app.post("/purchase-tickets", (req, res) => {
  const { accountId, ticketRequests } = req.body;

  try {
    const ticketTypeRequests = ticketRequests.map(
      (request) =>
        new TicketTypeRequest(request.ticketType, request.noOfTickets),
    );
    ticketService.purchaseTickets(accountId, ...ticketTypeRequests);
    res
      .status(200)
      .json({ success: true, message: "Tickets purchased successfully." });
  } catch (error) {
    if (error instanceof InvalidPurchaseException) {
      logger.warn(
        { accountId, error: error.message },
        "Invalid purchase request",
      );
      res.status(422).json({ success: false, error: error.message });
    } else {
      logger.error({ accountId, err: error }, "An unexpected error occurred.");
      res
        .status(500)
        .json({ success: false, error: "An internal server error occurred." });
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
