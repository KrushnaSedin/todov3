import { deleteUser, login } from "./user"

(async()=>{
    const token=await login()
    await deleteUser(token)
})()