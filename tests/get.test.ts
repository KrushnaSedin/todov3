import { expect, request } from '@playwright/test'
import { test } from '../../todov3/fixtures/user.fixture'
import { BASE_URL, TODO_RESOURCE } from '../config'


test.describe("Get Request positive scenario", () => {
    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { title: 'Delete Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
        console.log(body.id)
    })

    test("Getting existing todo should work", async ({ authenticatedRequest }, testInfo) => {

        const id = testInfo['id']
        const resp = await authenticatedRequest.get(`http://144.24.105.148:8081/v3/todo/${id}`)
        const body = await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.id).toBe(id)
        expect(body).not.toBe(null)
    })
    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.delete(`http://144.24.105.148:8081/v3/todo/${id}`)
        expect(resp.status()).toBe(200)
      })
})

test("Getting nonexisting todo should give 404", async ({ authenticatedRequest }) => {

    const id = 2000
    const resp = await authenticatedRequest.get(`http://144.24.105.148:8081/v3/todo/${id}`)
    expect(resp.status()).toBe(404)
})