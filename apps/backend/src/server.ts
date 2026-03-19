import { env } from "@hrms/env";
import { app } from "./app";

app.listen(env.PORT);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);
