import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { projectRouter } from "./routers/project";
import { templateRouter } from "./routers/template";
import { guestRouter } from "./routers/guest";
import { billingRouter } from "./routers/billing";
import { mediaRouter } from "./routers/media";

export const appRouter = router({
    auth: authRouter,
    project: projectRouter,
    template: templateRouter,
    guest: guestRouter,
    billing: billingRouter,
    media: mediaRouter,
});

export type AppRouter = typeof appRouter;

