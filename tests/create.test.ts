import { expect, request } from '@playwright/test';
import { test } from '../fixtures/user.fixture'
import { BASE_URL, TODO_RESOURCE } from '../config';

test.describe("Create Request Positive scenario", () => {
  test('Creation of todo should work without passing status field', async ({ authenticatedRequest }, testInfo) => {
    const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { title: "Bring Milk" })
    const body = await resp.json()
    expect(resp.status()).toBe(201)
    testInfo['id'] = body.id
  });
  test("Creation of todo should work when passed status field", async ({ authenticatedRequest },testInfo) => {
    const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { title: "Bring Milk", status: "DONE" })
    const body = await resp.json()
    expect(resp.status()).toBe(201)
    expect(body.status).toBe("DONE")
    testInfo['id'] = body.id
  })
  test.afterEach(async ({ authenticatedRequest }, testInfo) => {
    const id = testInfo['id']
    const resp = await authenticatedRequest.delete(`${BASE_URL}${TODO_RESOURCE}/${id}`)
    expect(resp.status()).toBe(200)
  })

})
test("Creation of Todo should give 400 when title field is not passed", async ({ authenticatedRequest }) => {
  const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { status: "DONE" })
  expect(resp.status()).toBe(400)
})
test("Creation of todo should give 400 when status value is not either ACTIVE or DONE", async ({ authenticatedRequest }) => {
  const resp = await authenticatedRequest.post(BASE_URL + TODO_RESOURCE, { title: "Bring Milk", status: "INACTIVE" })
  expect(resp.status()).toBe(400)
})
test("Creation of Todo should not work if Authentication details are not passed", async ({ request }) => {
  const resp = await request.post(BASE_URL + TODO_RESOURCE)
  const body = await resp.json()
  expect(resp.status()).toBe(403)
})
