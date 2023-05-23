import { APIRequestContext } from "@playwright/test";

export class AuthenticatedRequest {
    constructor(private request: APIRequestContext, private token: string) { }
    async post<T>(url: string, body: T) {
        return await this.request.post(url, {
            data: body,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
    }
    async delete<T>(url: string) {
        return await this.request.delete(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })


    }
    async get<T>(url: string) {
        return await this.request.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })

    }

    async patch<T>(url: string, body: T) {
        return await this.request.patch(url, {
            data: body,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
    }

    async put<T>(url: string, body: T) {
        return await this.request.put(url, {
            data: body,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
    }



}