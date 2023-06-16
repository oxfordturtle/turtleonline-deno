import { load } from "https://deno.land/std@0.192.0/dotenv/mod.ts";
import { serve } from "http"
import router from "./server/router.ts"
import imp from "./server/imp.ts"

const env = await load()
Deno.env.set("PROD", env.PROD)
Deno.env.set("SENDGRID_KEY", env.SENDGRID_KEY)

serve((request) => router(request, imp))
