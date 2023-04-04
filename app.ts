import { config, serve } from "./deps.ts"
import router from "./server/router.ts"
import imp from "./server/imp.ts"

config({ export: true })

serve((request) => router(request, imp))
