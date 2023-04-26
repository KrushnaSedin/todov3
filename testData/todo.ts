import { BASE_URL, TODO_RESOURCE } from "../config"
import { AuthenticatedRequest } from "../fixtures/authenticatedRequest"

export type TodoResponseBody = {
    id:number,
    title:string,
    status:string,
    createdAt:string,
    updatedAt:string
  }
  export async function getAllTodos(authenticatedRequest:AuthenticatedRequest){
    const allTodos = await authenticatedRequest.get(BASE_URL+TODO_RESOURCE)
      const body:TodoResponseBody[] = await allTodos.json()
      return {status:allTodos.status(),body}
  }