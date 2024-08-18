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
      return res.status(404).json({error: "Please provide a valid ID number."})
    }
    
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error ocurred while trying to fetch data." });
  }
});



export default mealsRouter;
