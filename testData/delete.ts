import { deleteUser,loginWithConfigUser } from "./user"

(async()=>{
    const token=await loginWithConfigUser()
    await deleteUser(token)
})()