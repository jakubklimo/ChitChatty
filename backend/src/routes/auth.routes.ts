import { Router } from "express";
import { register, login, logout, refresh, logoutAll } from "../controllers";
import { authMiddleware, validate } from "../middleware";
import { RegisterSchema, LoginSchema } from "../schemas";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registrace nového uživatele
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - passwordConfirm
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jan.novak@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SuperHeslo123!"
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: "SuperHeslo123!"
 *               name:
 *                 type: string
 *                 example: "Jan Novák"
 *     responses:
 *       200:
 *         description: Uživatelský účet úspěšně vytvořen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "jan.novak@example.com"
 *                     name:
 *                       type: string
 *                       example: "Jan Novák"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "d3b07384d113edec49eaa6238ad5ff00"
 *       400:
 *         description: Chyba validace vstupu (např. slabé heslo nebo nesouhlas hesel)
 *       500:
 *         description: Interní chyba serveru
 */
router.post("/register", validate(RegisterSchema), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Přihlášení uživatele
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jan.novak@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SuperHeslo123!"
 *     responses:
 *       200:
 *         description: Přihlášení úspěšné, vrací uživatele a tokeny
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "jan.novak@example.com"
 *                     name:
 *                       type: string
 *                       example: "Jan Novák"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "d3b07384d113edec49eaa6238ad5ff00"
 *       400:
 *         description: Neplatný email nebo heslo
 *       500:
 *         description: Interní chyba serveru
 */
router.post("/login", validate(LoginSchema), login);

router.post("/logout", authMiddleware, logout);

router.post("/logout-all", authMiddleware, logoutAll);

router.post("/refresh", refresh);

export default router;