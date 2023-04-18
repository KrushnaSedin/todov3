import { expect, request } from '@playwright/test'
import { test } from '../../todov3/fixtures/user.fixture'
import { BASE_URL, TODO_RESOURCE } from '../config'

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
        const resp = await authenticatedRequest.patch(`http://144.24.105.148:8081/v3/todo/${id}`, { title: 'Bring Tiger' })
        const body = await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.title).not.toBe(null)
        expect(body.id).toBe(id)
    })

    test("Updating only status of todo via patch endpoint should work", async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.patch(`http://144.24.105.148:8081/v3/todo/${id}`, { status: 'DONE' })
        const body = await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.title).not.toBe(null)
        expect(body.id).toBe(id)
        expect(body.status).toBe('DONE')

    })

    test("Updation of status todo should give 400 when status is not either of ACTIVE or DONE", async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.patch(`http://144.24.105.148:8081/v3/todo/${id}`, { status: 'INACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(400)
        expect(body.title).not.toBe(null)
        expect(body.status).not.toBe('DONE')

    })

    test("Updation of both status and title should work via patch endpoint", async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.patch(`http://144.24.105.148:8081/v3/todo/${id}`, { title: "Hello World", status: 'DONE' })
        const body = await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.title).not.toBe(null)
        expect(body.status).toBe('DONE')
        expect(body.id).toBe(id)

    })

    test("Updation of both title and status of todo should give 400 when status is not either of ACTIVE or DONE in patch", async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.patch(`http://144.24.105.148:8081/v3/todo/${id}`, { title: 'Hello Sedin', status: 'INACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(400)
        expect(body.title).not.toBe(null)
        expect(body.status).not.toBe('DONE')

    })

    test("Updation of non existing todo should give 400 via patch endpoint", async ({ authenticatedRequest }, testInfo) => {
        const id = 2500
        const resp = await authenticatedRequest.patch(`http://144.24.105.148:8081/v3/todo/${id}`, { title: 'Hello Sedin', status: 'INACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(400)

    })
    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.delete(`http://144.24.105.148:8081/v3/todo/${id}`)
        expect(resp.status()).toBe(200)
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
        const resp= await authenticatedRequest.put(`http://144.24.105.148:8081/v3/todo/${id}`,{title:"Hello World",status:'DONE'})
        const body= await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.title).not.toBe(null)
        expect(body.status).toBe('DONE')
        expect(body.id).toBe(id)
        
    })
    test("Updation of both title and status of todo should give 400 when status is not either of ACTIVE or DONE in put", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.put(`http://144.24.105.148:8081/v3/todo/${id}`,{title:'Hello Sedin',status:'INACTIVE'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
        expect(body.title).not.toBe(null)
        expect(body.status).not.toBe('DONE')
        
    })

    test("Updation of only title should give 400 in put", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.put(`http://144.24.105.148:8081/v3/todo/${id}`,{title:'Bring Tiger'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
               
    })
    test("Updation of only status should give 400 in put", async ({authenticatedRequest},testInfo)=>{
        const id= testInfo['id']
        const resp= await authenticatedRequest.put(`http://144.24.105.148:8081/v3/todo/${id}`,{status:'DONE'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
               
    })

    test("Updation of non existing todo should give 400 via put endpoint", async ({authenticatedRequest},testInfo)=>{
        const id= 2500
        const resp= await authenticatedRequest.put(`http://144.24.105.148:8081/v3/todo/${id}`,{title:'Hello Sedin',status:'INACTIVE'})
        const body= await resp.json()
        expect(resp.status()).toBe(400)
        
    })
    
    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.delete(`http://144.24.105.148:8081/v3/todo/${id}`)
        expect(resp.status()).toBe(200)
    })
})