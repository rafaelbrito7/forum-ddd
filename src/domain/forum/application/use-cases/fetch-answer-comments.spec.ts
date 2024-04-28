import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from '../../enterprise/factories/make-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Get Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch comments on a answer', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )

    const { answerComments } = await sut.execute({
      page: 1,
      answerId: 'answer-1',
    })

    expect(answerComments).toHaveLength(3)
    expect(answerComments[0]).toEqual(
      expect.objectContaining({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
  })

  it('should be able to fetch paginated comments on a answer', async () => {
    for (let i = 1; i <= 30; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
      )
    }

    const { answerComments: pageOne } = await sut.execute({
      page: 1,
      answerId: 'answer-1',
    })
    const { answerComments: pageTwo } = await sut.execute({
      page: 2,
      answerId: 'answer-1',
    })

    expect(pageOne).toHaveLength(20)
    expect(pageTwo).toHaveLength(10)
  })
})
