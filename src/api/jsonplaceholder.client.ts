import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface User {
  id: number; name: string; username: string; email: string;
  address: { street: string; suite: string; city: string; zipcode: string; geo: { lat: string; lng: string } };
  phone: string; website: string; company: { name: string; catchPhrase: string; bs: string };
}
export interface NewPost { userId: number; title: string; body: string }
export interface Post extends NewPost { id: number }
export interface ApiResult<T> { status: number; body: T }
export class JsonPlaceholderClient {
  constructor(private readonly request: APIRequestContext) {}
  private async result<T>(response: APIResponse): Promise<ApiResult<T>> {
    try { return { status: response.status(), body: await response.json() as T }; }
    finally { await response.dispose(); }
  }
  async getUser(id: number): Promise<ApiResult<User>> {
    return this.result<User>(await this.request.get(`/users/${id}`));
  }
  async createPost(post: NewPost): Promise<ApiResult<Post>> {
    return this.result<Post>(await this.request.post('/posts', { data: post }));
  }
  async getPost(id: number): Promise<ApiResult<Post | Record<string, never>>> {
    return this.result<Post | Record<string, never>>(await this.request.get(`/posts/${id}`));
  }
}
