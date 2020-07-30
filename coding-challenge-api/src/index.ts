import express from "express";
import morgan from "morgan";
import cors from "cors";

// routes
import userRouter from "./routes/user";
import salesRouter from "./routes/sales";

const app = express();
const port = 8080;

app.use(cors());
app.use(morgan("dev"));

app.use("/api", userRouter);
app.use("/api", salesRouter);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
