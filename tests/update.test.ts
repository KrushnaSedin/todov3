import { expect, request } from '@playwright/test'
import { test } from '../../todov3/fixtures/user.fixture'
import { BASE_URL, TODO_RESOURCE } from '../config'
import { randomUUID } from 'crypto'
import { createUser, deleteUser, login } from '../testData/user';

test.describe("Patch request ", () => {

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
        console.log(body.id)
    })

    test("Updating only title of todo via patch endpoint should work", async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.patch(`${BASE_URL}${TODO_RESOURCE}/${id}`, { title: 'Bring Tiger' })
        const body = await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.title).toBe("Bring Tiger")
        expect(body.title).not.toBe(null)
        expect(body.id).toBe(id)
    })

    test("Updating only status of todo via patch endpoint should work", async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.patch(`${BASE_URL}${TODO_RESOURCE}/${id}`, { status: 'DONE' })
        const body = await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.title).not.toBe(null)
        expect(body.id).toBe(id)
        expect(body.status).toBe('DONE')

    })

    test("Updation of status todo should give 400 when status is not either of ACTIVE or DONE", async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.patch(`${BASE_URL}${TODO_RESOURCE}/${id}`, { status: 'INACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(400)
        expect(body.title).not.toBe(null)

    })

    test("Updation of both status and title should work via patch endpoint", async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.patch(`${BASE_URL}${TODO_RESOURCE}/${id}`, { title: "Hello World", status: 'DONE' })
        const body = await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.title).not.toBe(null)
        expect(body.title).toBe("Hello World")
        expect(body.status).toBe('DONE')
        expect(body.id).toBe(id)

    })

    test("Updation of both title and status of todo should give 400 when status is not either of ACTIVE or DONE in patch", async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.patch(`${BASE_URL}${TODO_RESOURCE}/${id}`, { title: 'Hello Sedin', status: 'INACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(400)

    })

    test("Updation of non existing todo should give 400 via patch endpoint", async ({ authenticatedRequest }, testInfo) => {
        const id = 0
        const resp = await authenticatedRequest.patch(`${BASE_URL}${TODO_RESOURCE}/${id}`, { title: 'Hello Sedin', status: 'INACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(400)

    })
    test("Updation of Todo Via Patch endpoint should not work if Authentication details are not passed",async ({request},testInfo)=>{
        const id = testInfo['id']
        const resp = await request.patch(`${BASE_URL}${TODO_RESOURCE}/${id}`, { title: 'Hello Sedin', status: 'DONE' })
        const body = await resp.json()
        expect(resp.status()).toBe(403)
    })
    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.delete(`${BASE_URL}${TODO_RESOURCE}/${id}`)
        expect(resp.status()).toBe(200)
    })
})

test.describe("Unauthorized User Patch request", () => {

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {

        const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { title: 'New User', status: 'ACTIVE' })
        const body = await resp.json()
        testInfo['id'] = body.id
        const unique = randomUUID()
        await createUser(unique, unique)
        const token = await login(unique, unique)
        testInfo['token'] = token

    })
    test('One user should not be able to Get other Users Todo', async ({ request }, testInfo) => {

        const id = testInfo['id']
        const token = testInfo['token']
        const resp = await request.patch(`${BASE_URL}${TODO_RESOURCE}/${id}`, {
            data:{ title: 'Unauthorized User', status: 'ACTIVE'},
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        expect(resp.status()).toBe(404)
    })

    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const token = testInfo['token']
        const resp = await authenticatedRequest.delete(`${BASE_URL}${TODO_RESOURCE}/${id}`)
        await deleteUser(token)

    })
})

test.describe("Put request",()=>{

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
        console.log(body.id)
    })
    test("Updation of both status and title should work via PUT endpoint", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.put(`${BASE_URL}${TODO_RESOURCE}/${id}`,{title:"Hello World",status:'DONE'})
        const body= await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.title).not.toBe(null)
        expect(body.title).toBe("Hello World")
        expect(body.status).toBe('DONE')
        expect(body.id).toBe(id)
        
    })
    test("Updation of both title and status of todo should give 400 when status is not either of ACTIVE or DONE in put", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.put(`${BASE_URL}${TODO_RESOURCE}/${id}`,{title:'Hello Sedin',status:'INACTIVE'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
       
    })

    test("Updation of only title should give 400 in put", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.put(`${BASE_URL}${TODO_RESOURCE}/${id}`,{title:'Bring Tiger'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
               
    })
    test("Updation of only status should give 400 in put", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.put(`${BASE_URL}${TODO_RESOURCE}/${id}`,{status:'DONE'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
               
    })

    test("Updation of non existing todo should give 400 via put endpoint", async ({authenticatedRequest},testInfo)=>{
        const id= 0
        const resp= await authenticatedRequest.put(`${BASE_URL}${TODO_RESOURCE}/${id}`,{title:'Hello Sedin',status:'INACTIVE'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
        
    })
    test("Updation of Todo Via Put endpoint should not work if Authentication details are not passed",async ({request},testInfo)=>{
        const id = testInfo['id']
        const resp = await request.put(`${BASE_URL}${TODO_RESOURCE}/${id}`, { title: 'Hello Sedin', status: 'DONE' })
        const body = await resp.json()
        expect(resp.status()).toBe(403)
    })
    
    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.delete(`${BASE_URL}${TODO_RESOURCE}/${id}`)
        expect(resp.status()).toBe(200)
    })
})

test.describe("Unauthorized User Put request", () => {

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {

        const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { title: 'New User', status: 'ACTIVE' })
        const body = await resp.json()
        testInfo['id'] = body.id
        const unique = randomUUID()
        await createUser(unique, unique)
        const token = await login(unique, unique)
        testInfo['token'] = token

    })
    test('One user should not be able to Get other Users Todo', async ({ request }, testInfo) => {

        const id = testInfo['id']
        const token = testInfo['token']
        const resp = await request.put(`${BASE_URL}${TODO_RESOURCE}/${id}`, {
            data:{ title: 'Unauthorized User', status: 'ACTIVE'},
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        expect(resp.status()).toBe(404)
    })

    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const token = testInfo['token']
        const resp = await authenticatedRequest.delete(`${BASE_URL}${TODO_RESOURCE}/${id}`)
        await deleteUser(token)

    })
})