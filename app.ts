import { load } from "https://deno.land/std@0.192.0/dotenv/mod.ts";
import { serve } from "http"
import router from "./server/router.ts"
import imp from "./server/imp.ts"

await load()

serve((request) => router(request, imp))
