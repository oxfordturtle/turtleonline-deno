import { config } from "dotenv"
import { serve } from "http"
import router from "./server/router.ts"
import imp from "./server/imp.ts"

config({ export: true })

serve((request) => router(request, imp))
