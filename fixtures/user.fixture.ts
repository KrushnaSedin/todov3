import{test as base} from '@playwright/test'
import { login, loginWithConfigUser } from '../testData/user'
import { AuthenticatedRequest } from './authenticatedRequest'
 export const test = base.extend<{authenticatedRequest:AuthenticatedRequest}>({
    authenticatedRequest:async({request},use)=>{
        const token=await loginWithConfigUser()
        const ar = new AuthenticatedRequest(request,token)
        use(ar)
    }
 })