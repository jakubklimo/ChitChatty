import { Router } from "express";
import { HelloController } from "../controllers/hello.controller";

const router = Router();

/**
 * @openapi
 * /hello:
 *   get:
 *     summary: Vrátí pozdrav
 *     tags:
 *       - Hello
 *     responses:
 *       200:
 *         description: Úspěšný pozdrav
 */
router.get("/", HelloController.getHello);

/**
 * @openapi
 * /hello/idk:
 *   get:
 *     summary: Vrátí idk
 *     tags:
 *       - Hello
 *     responses:
 *       200:
 *         description: Úspěšný požadavek
 */
router.get("/idk", HelloController.getIdk);

export default router;