import { serve } from "./deps.ts"
import router from "./server/router.ts"
import imp from "./server/imp.ts"

serve((request) => router(request, imp))
