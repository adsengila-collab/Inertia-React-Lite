import { Router, type IRouter } from "express";
import healthRouter from "./health";
import imagesRouter from "./images";
import keywordsRouter from "./keywords";

const router: IRouter = Router();

router.use(healthRouter);
router.use(imagesRouter);
router.use(keywordsRouter);

export default router;
