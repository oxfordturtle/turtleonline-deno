import { load } from "dotenv";
import router from "./server/router.ts";
import imp from "./server/imp.ts";

const env = await load();
Deno.env.set("PROD", env.PROD);
Deno.env.set("SENDGRID_KEY", env.SENDGRID_KEY);

Deno.serve((request) => router(request, imp));
