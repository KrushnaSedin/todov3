import { createUser, deleteUser, login } from "./user"

(async () => {
    try {
        const token = await login()
        await deleteUser(token)
    }
    catch (e) {
        console.log("This is OK")
    }
    await createUser()
})()