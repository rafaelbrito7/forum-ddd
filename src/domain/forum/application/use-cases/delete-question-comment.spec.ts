import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from '../../enterprise/factories/make-question-comment'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { UnauthorizedError } from './errors/unauthorized-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a comment on question', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryQuestionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      authorId: 'author-1',
      questionCommentId: questionComment.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.isLeft()).toEqual(false)
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a comment on question that does not exist', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      questionCommentId: 'question-comment-1',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.isRight()).toEqual(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete another users comment on question', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryQuestionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: questionComment.id.toString(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.isRight()).toEqual(false)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1)
  })
})
