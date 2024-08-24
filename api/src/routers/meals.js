import express from "express";
import knex from "../database_client.js";
import { getValidColumns } from "../get-valid-columns.js";

const mealsRouter = express.Router();

mealsRouter.get("/", async (req, res) => {
  try {
    const meals = await knex("meals").select("*");
    res.json(meals);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error ocurred while trying to fetch data." });
  }
});

mealsRouter.get("/future", async (req, res) => {
  try {
    const futureMeals = await knex("meals")
      .select("*")
      .where("when", ">", knex.fn.now())
      .orderBy("when", "asc");
    res.json(futureMeals);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error ocurred while trying to fetch future meals." });
  }
});

mealsRouter.get("/past", async (req, res) => {
  try {
    const pastMeals = await knex("meals")
      .select("*")
      .where("when", "<", knex.fn.now())
      .orderBy("when", "desc");
    res.json(pastMeals);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error ocurred while trying to fetch past meals." });
  }
});

mealsRouter.get("/first", async (req, res) => {
  try {
    const firstMeal = await knex("meals")
      .select("*")
      .orderBy("when", "asc")
      .first();

    if (firstMeal.length === 0) {
      res.status(404).json({ error: "No meals found." });
    } else {
      res.json(firstMeal);
    }
  } catch (error) {
    res.status(500).json({
      error: "An error ocurred while trying to fetch the first meal.",
    });
  }
});

mealsRouter.get("/last", async (req, res) => {
  try {
    const lastMeal = await knex("meals")
      .select("*")
      .orderBy("when", "desc")
      .first();

    if (lastMeal.length === 0) {
      res.status(404).json({ error: "No meals found." });
    } else {
      res.json(lastMeal);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error ocurred while trying to fetch the last meal." });
  }
});

mealsRouter.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const idMeal = await knex("meals").where("id", "=", id).first();

    if (idMeal) {
      return res.json(idMeal);
    } else {
      return res
        .status(404)
        .json({ error: "Please provide a valid ID number." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error ocurred while trying to fetch data." });
  }
});

mealsRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      when,
      max_reservations,
      price,
      created_date,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !when ||
      !max_reservations ||
      !price ||
      !created_date
    ) {
      return res.status(400).json({ error: "Please provide all fields." });
    }

    const [newMealId] = await knex("meals").insert({
      title,
      description,
      location,
      when,
      max_reservations,
      price,
      created_date,
    });

    const newMeal = await knex("meals").where("id", "=", newMealId).first();
    res.status(201).json(newMeal);
  } catch (error) {
    console.error("Error inserting new meal:", error);
    res.status(500).json({ error: "Error inserting new meal." });
  }
});

mealsRouter.put("/:id", async (req, res) => {
  try {
    const mealId = Number(req.params.id);
    const updatedField = req.body;

    if (isNaN(mealId) || Object.keys(updatedField).length === 0) {
      return res
        .status(400)
        .json({
          error:
            "Please provide both a meal ID and the fields you wish to update.",
        });
    }

    const mealToUpdate = await knex("meals").where("id", "=", mealId).first();
    if (!mealToUpdate) {
      return res.status(404).json({ error: "Meal not found." });
    }

    const mealsColumns = await getValidColumns("meals");
    const invalidFields = Object.keys(updatedField).filter(
      (key) => !mealsColumns.includes(key),
    );

    if (invalidFields.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid column names: ${invalidFields}` });
    }

    await knex("meals").where("id", "=", mealId).update(updatedField);
    const updatedMeal = await knex("meals").where("id", "=", mealId).first();
    res.status(200).json(updatedMeal);
  } catch (error) {
    console.error("Error updating meal:", error);
    res.status(500).json({ error: "Error updating meal." });
  }
});

export default mealsRouter;
