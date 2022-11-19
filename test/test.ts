import { MessageApiError } from '@/index'

describe('smoke tests', () => {
  test('can create error', () => {
    new MessageApiError({})
  })
})
