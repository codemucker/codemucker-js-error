import { AppError } from '@/index'

describe('smoke tests', () => {
  test('can create error', () => {
    new AppError({})
  })
})
