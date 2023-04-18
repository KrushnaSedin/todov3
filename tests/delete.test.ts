import { expect, request } from '@playwright/test';
import { test } from '../fixtures/user.fixture'
import { BASE_URL, TODO_RESOURCE } from '../config';


test.describe("Delete Request positive scenarios", () => {

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post(BASE_URL+TODO_RESOURCE, { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
        console.log(body.id)
    })

    test("Deletion of todo should work if todo exists", async ({ authenticatedRequest },testInfo) => {
       const id=testInfo['id']
        const resp = await authenticatedRequest.delete(`http://144.24.105.148:8081/v3/todo/${id}`)
        expect(resp.status()).toBe(200)
        // const body=await resp.json()
        // console.log(body.id)
   
    })
})

test("Deletion of non existing todo should give 404 ", async ({ authenticatedRequest },testInfo) => {
    const id=25000
     const resp = await authenticatedRequest.delete(`http://144.24.105.148:8081/v3/todo/${id}`)
     expect(resp.status()).toBe(404)
     // const body=await resp.json()
     // console.log(body.id)

 })