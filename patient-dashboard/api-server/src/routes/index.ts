import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profileRouter from "./profile";
import metricsRouter from "./metrics";
import occupationalRouter from "./occupational";
import carePlanRouter from "./carePlan";
import chatRouter from "./chat";
import socialRouter from "./social";
import clinicalRouter from "./clinical";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profileRouter);
router.use(metricsRouter);
router.use(occupationalRouter);
router.use(carePlanRouter);
router.use(chatRouter);
router.use(socialRouter);
router.use(clinicalRouter);

export default router;
