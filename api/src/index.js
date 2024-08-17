import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

app.use("/api", apiRouter);
apiRouter.use("/meals", mealsRouter);
apiRouter.use("/reservations", reservationsRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
