import { UseCaseError } from '@/core/errors/useCaseError'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found')
  }
}
