import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
import { authRoutes } from "@/auth/routes";
import { urlRoutes } from "@/url/routes";
import pinoHttp from "pino-http";
import logger from "@/config/logger";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url.includes("/api-docs"),
    },
  })
);
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/auth", authRoutes);
app.use(urlRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(
    `API Documentation available at http://localhost:${port}/api-docs`
  );
});
