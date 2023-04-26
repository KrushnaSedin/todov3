import { BASE_URL, NEWPASSWORD, NEWUSERNAME, PASSWORD, TODO_RESOURCE, USERNAME, USER_LOGIN_RESOURCE, USER_RESOURCE } from "../config";
import { randomUUID } from 'crypto'

export async function createUser(){
    const resp=await fetch(BASE_URL + USER_RESOURCE,{
        method:'POST',
        body: JSON.stringify({
            username:USERNAME,
            password:PASSWORD
        }),
        headers:{
            'Content-Type':'application/json'
        }
    })
    if(resp.status != 201)
    {
        throw Error("User not created")
    }
}
export async function deleteUser(token:string){
    const resp=await fetch(BASE_URL + USER_RESOURCE,{
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })
    if(resp.status != 200)
    {
        throw Error("User not Deleted")
    }
}

export async function login(){
    const resp=await fetch(BASE_URL + USER_LOGIN_RESOURCE,{
        method:'POST',
        body: JSON.stringify({
            username:USERNAME,
            password:PASSWORD
        }),
        headers:{
            'Content-Type':'application/json'
        }
    })
    if(resp.status != 200)
    {
        throw Error("User login failed")
    }
    return (await resp.json()).token
}

export async function newLogin(username:string,password:string){
    const resp=await fetch(BASE_URL + USER_LOGIN_RESOURCE,{
        method:'POST',
        body: JSON.stringify({
            username:username,
            password:password
        }),
        headers:{
            'Content-Type':'application/json'
        }
    })
    if(resp.status != 200)
    {
        throw Error("User login failed")
    }
    return (await resp.json()).token
}

export async function createNewUser(username:string,password:string){
    const resp=await fetch(BASE_URL + USER_RESOURCE,{
        method:'POST',
        body: JSON.stringify({
            username:username,
            password:password
        }),
        headers:{
            'Content-Type':'application/json'
        }
    })
    if(resp.status != 201)
    {
        throw Error("User not created")
    }
}