import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from '../../enterprise/factories/make-answer-comment'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a comment on answer', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      authorId: 'author-1',
      answerCommentId: answerComment.id.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
    expect(result.isRight()).toEqual(true)
  })

  it('should not be able to delete a another users comment on answer', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      authorId: 'author-2',
      answerCommentId: answerComment.id.toString(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1)
  })
})
