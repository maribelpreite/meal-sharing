import express from "express";
import knex from "../database_client.js";
import { getValidColumns } from "../get-valid-columns.js";

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

reservationsRouter.post("/", async (req, res) => {
  try {
    const {
      number_of_guests,
      meal_id,
      created_date,
      contact_phonenumber,
      contact_name,
      contact_email,
    } = req.body;

    if (
      !number_of_guests ||
      !meal_id ||
      !created_date ||
      !contact_phonenumber ||
      !contact_name ||
      !contact_email
    ) {
      res.status(400).json({ error: "Please provide all fields." });
    }

    const [newResId] = await knex("reservations").insert({
      number_of_guests,
      meal_id,
      created_date,
      contact_phonenumber,
      contact_name,
      contact_email,
    });

    const newRes = await knex("reservations")
      .where("id", "=", newResId)
      .first();
    res.status(201).json(newRes);
  } catch (error) {
    console.error("Error inserting new reservation:", error);
    res.status(500).json({ error: "Error inserting new reservation." });
  }
});

reservationsRouter.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const fieldsToUpdate = req.body;

    if (isNaN(id) || Object.keys(fieldsToUpdate).length === 0) {
      return res
        .status(400)
        .json({
          error:
            "Please provide a reservation ID number and the fields you wish to update.",
        });
    }

    const resToUpdate = await knex("reservations").where("id", "=", id).first();
    if (!resToUpdate) {
      return res.status(404).json({ error: "Reservation not found." });
    }

    const resColumns = await getValidColumns("reservations");
    const invalidFields = Object.keys(fieldsToUpdate).filter(
      (key) => !resColumns.includes(key),
    );

    if (invalidFields > 0) {
      return res
        .status(400)
        .json({ error: `Invalid column names: ${invalidFields}` });
    }

    await knex("reservations").where("id", "=", id).update(fieldsToUpdate);
    const updatedRes = await knex("reservations").where("id", "=", id).first();
    res.status(200).json(updatedRes);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: "Error updating reservation." });
  }
});

reservationsRouter.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const reservation = await knex("reservations").where("id", "=", id).first();

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "Please provide a reservation ID number." });
    }

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }

    await knex("reservations").where("id", "=", id).delete();
    return res
      .status(200)
      .json({ success: `You have successfully deleted meal no. ${id}` });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ error: "Error deleting reservation." });
  }
});

export default reservationsRouter;
