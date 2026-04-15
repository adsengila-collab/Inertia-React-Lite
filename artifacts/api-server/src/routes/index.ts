import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import imagesRouter from "./images.js";
import keywordsRouter from "./keywords.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(imagesRouter);
router.use(keywordsRouter);

export default router;
