import express from "express";
import knex from "../database_client.js";

const reservationsRouter = express.Router();

reservationsRouter.get("/", async (req, res) => {
  try {
    const reservations = await knex("reservations");
    res.json(reservations);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error ocurred while trying to fetch data." });
  }
});

reservationsRouter.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const reservation = await knex("reservations").where("id", "=", id).first();

    if (isNaN(id)) {
      res
        .status(400)
        .json({ error: "Please provide a reservation ID number." });
    }

    if (!reservation) {
      res.status(404).json({ error: "Reservation not found." });
    }

    res.json(reservation);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error ocurred while trying to fetch data." });
  }
});

export default reservationsRouter;
