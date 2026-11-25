import { test, expect } from '../../src/fixtures/test';
import { userSchema, postSchema } from '../../src/api/schemas';
import { expectSchema } from '../../src/utils/schema';

test('GET user satisfies the user contract', async ({ api }) => {
  const response = await api.getUser(1);
  expect(response.status).toBe(200);
  expectSchema(userSchema, response.body);
  expect(response.body.id).toBe(1);
});

test('POST creates a response but read-back reflects non-persistence', async ({ api }) => {
  const payload = { userId: 1, title: 'Limestone QA contract test', body: 'An isolated fake-resource creation.' };
  const created = await api.createPost(payload);
  expect(created.status).toBe(201);
  expectSchema(postSchema, created.body);
  expect(created.body).toMatchObject(payload);
  const readBack = await api.getPost(created.body.id);
  expect(readBack.status, 'JSONPlaceholder fakes writes and does not persist the new post').toBe(404);
  expect(readBack.body).toEqual({});
});
