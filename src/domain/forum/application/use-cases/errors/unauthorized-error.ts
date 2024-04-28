import { UseCaseError } from '@/core/errors/useCaseError'

export class UnauthorizedError extends Error implements UseCaseError {
  constructor() {
    super('Unauthorized')
  }
}
