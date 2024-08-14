//DOESN'T WORK YET 
import express from "express";
import knex from "../database_client.js";

const mealsRouter = express.Router();

mealsRouter.get("/", async (req, res) => {
  try { //added try/catch to handle errors & removed ternary operator from example as db client is always mysql
    const SHOW_ALL_MEALS_QUERY = "SELECT * FROM meals;"
    const [meals] = await knex.raw(SHOW_ALL_MEALS_QUERY); //meals in [] to avoid seeing metadata
    res.json(meals);
  } catch (error) {
    res.status(500).json({error: "An error ocurred while trying to fetch data."})
  }
});

apiRouter.get("/future", async (req, res) => {
  try {
    const SHOW_FUTURE_MEALS_QUERY = "SELECT * FROM meals WHERE `when` > NOW() ORDER BY `when` asc;";
    const [futureMeals] = await knex.raw(SHOW_FUTURE_MEALS_QUERY);
    res.json(futureMeals);
  } catch (error) {
    res.status(500).json({error: "An error ocurred while trying to fetch future meals."})
  }
})


apiRouter.get("/past", async (req, res) => {
  try {
    const SHOW_PAST_MEALS_QUERY = "SELECT * FROM meals WHERE `when` < NOW() ORDER BY `when` desc;";
    const [pastMeals] = await knex.raw(SHOW_PAST_MEALS_QUERY);
    res.json(pastMeals);
  } catch (error) {
    res.status(500).json({error: "An error ocurred while trying to fetch past meals."})
  }
})


apiRouter.get("/first", async (req, res) => {
  try {
    const SHOW_FIRST_MEAL_QUERY = "SELECT * FROM meals ORDER BY `when` asc LIMIT 1";
    const [firstMeal] = await knex.raw(SHOW_FIRST_MEAL_QUERY);

    if (firstMeal.length === 0) {
      res.status(404).json({error: "No meals found."});
    } else {
      res.json(firstMeal[0]);
    }

  } catch (error) {
    res.status(500).json({error: "An error ocurred while trying to fetch the first meal."})
  }
})

apiRouter.get("/last", async (req, res) => {
  try {
    const SHOW_LAST_MEAL_QUERY = "SELECT * FROM meals ORDER BY `when` desc LIMIT 1";
    const [lastMeal] = await knex.raw(SHOW_LAST_MEAL_QUERY);

    if (lastMeal.length === 0) {
      res.status(404).json({error: "No meals found."});
    } else {
      res.json(lastMeal[0]);
    }
    
  } catch (error) {
    res.status(500).json({error: "An error ocurred while trying to fetch the last meal."})
  }
})

export default mealsRouter;
