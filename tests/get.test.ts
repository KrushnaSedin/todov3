import { expect, request } from '@playwright/test'
import { test } from '../../todov3/fixtures/user.fixture'
import { BASE_URL, TODO_RESOURCE } from '../config'
import { randomUUID } from 'crypto'
import { createUser, deleteUser, login } from '../testData/user';
import { TodoResponseBody, getAllTodos } from '../testData/todo';


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
        const resp = await authenticatedRequest.get(`${BASE_URL}${TODO_RESOURCE}/${id}`)
        const body = await resp.json()
        expect(resp.status()).toBe(200)
        expect(body.id).toBe(id)
        expect(body.title).toBe("Delete Todo data")
        expect(body.status).toBe('ACTIVE')
        expect(body).not.toBe(null)
    })
    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const id = testInfo['id']
        const resp = await authenticatedRequest.delete(`${BASE_URL}${TODO_RESOURCE}/${id}`)
        expect(resp.status()).toBe(200)
    })
})

test("Getting nonexisting todo should give 404", async ({ authenticatedRequest }) => {

    const id = 0
    const resp = await authenticatedRequest.get(`${BASE_URL}${TODO_RESOURCE}/${id}`)
    expect(resp.status()).toBe(404)
})

test.describe("Get request negative scenario", () => {
    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { title: 'Get Todo data', status: 'ACTIVE' })
        const body = await resp.json()
        expect(resp.status()).toBe(201)
        testInfo['id'] = body.id
        console.log(body.id)
    })

    test("Getting Single Todo should not work if authentication details are not passed", async ({ authenticatedRequest, request }, testInfo) => {
        const id = testInfo['id']
        const resp = await request.get(`${BASE_URL}${TODO_RESOURCE}/${id}`)
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
    test('One user should not be able to Get other Users Todo', async ({ request }, testInfo) => {

        const id = testInfo['id']
        const token = testInfo['token']
        const resp = await request.get(`${BASE_URL}${TODO_RESOURCE}/${id}`, {
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

test.describe('Get All', () => {
    test.beforeEach(async ({ authenticatedRequest }, testInfo) => {
        const todos = ['Bring Milk', 'Bring Vegitables']
        const createdTodos: TodoResponseBody[] = []
        for (const todo in todos) {
            const resp = await authenticatedRequest.post(BASE_URL+TODO_RESOURCE, { title: todo })
            const body = await resp.json()
            createdTodos.push(body)
        }
        testInfo['todos'] = createdTodos
    })
    test('Getting All Todo should give list of all todos created recently', async ({ authenticatedRequest }, testInfo) => {
        const createdTodos: TodoResponseBody[] = testInfo['todos']
        const { status, body } = await getAllTodos(authenticatedRequest)
        expect(status).toBe(200)
        for (const createdTodo of createdTodos) {
            const foundTodo = body.find(returnedTodo => returnedTodo.id == createdTodo.id)
            expect(foundTodo?.id).toBe(createdTodo.id)
            expect(foundTodo?.title).toBe(createdTodo.title)
        }
    });

    test("Getting all Todo should should not work if Authentication Details are not passed", async ({ request }) => {

        const resp = await request.get(BASE_URL+TODO_RESOURCE)
        expect(resp.status()).toBe(403)
    
    })

    test.afterEach(async ({ authenticatedRequest }, testInfo) => {
        const createdTodos: TodoResponseBody[] = testInfo['todos']

        for (const createdTodo of createdTodos) {
            const id = createdTodo.id
            const resp = await authenticatedRequest.delete(`${BASE_URL}${TODO_RESOURCE}/${id}`)
            expect(resp.status()).toBe(200)
        }
    })
})