import { Request, Response } from "express";

export class HelloController {
    static getHello(_req: Request, res: Response){
        res.json({ message: "Hello world from controller" })
    }

    static getIdk(_req: Request, res: Response){
        res.json({ message: "Idk what" })
    }
}