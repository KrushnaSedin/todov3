import { createConfigUser, createUser, deleteUser, login, loginWithConfigUser } from "./user"

(async () => {
    try {
        const token = await loginWithConfigUser()
        await deleteUser(token)
    }
    catch (e) {
        console.log("This is OK")
    }
    await createConfigUser()
})()