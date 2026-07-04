import { test } from '@japa/runner'

test.group('Health Check', () => {
  test('returns 200 and healthy status when DB and Redis are up', async ({ client }) => {
    const response = await client.get('/health')
    
    response.assertStatus(200)
    response.assertBodyContains({
      status: 'ok',
      services: {
        database: 'ok',
        redis: 'ok'
      }
    })
  })
})
