import express from "express";
import knex from "../database_client.js";

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
    const SHOW_FIRST_MEAL_QUERY =
      "SELECT * FROM meals ORDER BY `when` asc LIMIT 1";
    const firstMeal = await knex("meals")
      .select("*")
      .orderBy("when", "asc")
      .limit("1");

    if (firstMeal.length === 0) {
      res.status(404).json({ error: "No meals found." });
    } else {
      res.json(firstMeal[0]);
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
      .limit("1");

    if (lastMeal.length === 0) {
      res.status(404).json({ error: "No meals found." });
    } else {
      res.json(lastMeal[0]);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error ocurred while trying to fetch the last meal." });
  }
});

export default mealsRouter;
