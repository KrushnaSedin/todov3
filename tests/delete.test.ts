import { expect, request } from '@playwright/test';
import { test } from '../fixtures/user.fixture'
import { BASE_URL, TODO_RESOURCE } from '../config';
import {  createUser, deleteUser, login} from '../testData/user';
import { randomUUID } from 'crypto'


test.describe("Delete Request positive scenarios", () => {

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
        console.log(body.id)
    })

    test("Deletion of todo should work if todo exists", async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.delete(`${BASE_URL}${TODO_RESOURCE}/${id}`)
        expect(resp.status()).toBe(200)
    })
})

test("Deletion of non existing todo should give 404 ", async ({ authenticatedRequest }, testInfo) => {
    const id = 0
    const resp = await authenticatedRequest.delete(`${BASE_URL}${TODO_RESOURCE}/${id}`)
    expect(resp.status()).toBe(404)
})
test.describe("Delete request negative scenario", () => {
    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
        console.log(body.id)
    })

    test("Deletion of Todo should not work if Authentication Details are not passed", async ({ authenticatedRequest, request }, testInfo) => {
        const id = testInfo['id']
        const resp = await request.delete(`${BASE_URL}${TODO_RESOURCE}/${id}`)
        expect(resp.status()).toBe(403)
    })


    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.delete(`${BASE_URL}${TODO_RESOURCE}/${id}`)
        expect(resp.status()).toBe(200)
    })
})

test.describe("Unauthorized User", () => {

    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {

        const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { title: 'New User', status: 'ACTIVE' })
        const body = await resp.json()
        testInfo['id'] = body.id
        const unique = randomUUID()
        await createUser(unique, unique)
        const token = await login(unique, unique)
        testInfo['token'] = token

    })
    test('One user should not be able to Delete other Users Todo', async ({ request }, testInfo) => {

        const id = testInfo['id']
        const token = testInfo['token']
        const resp = await request.delete(`${BASE_URL}${TODO_RESOURCE}/${id}`, {
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
