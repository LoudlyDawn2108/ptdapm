import { env } from "@hrms/env";
import { app } from "./app";

export type { App } from "./app";

app.listen(env.PORT);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);
