import { load, serve } from "./deps.ts"
import router from "./server/router.ts"
import imp from "./server/imp.ts"

await load()

serve((request) => router(request, imp))
