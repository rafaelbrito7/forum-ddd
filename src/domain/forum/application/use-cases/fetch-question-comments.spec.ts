import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from '../../enterprise/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Get Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch comments on a question', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
    )

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
    )

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
    )

    const { questionComments } = await sut.execute({
      page: 1,
      questionId: 'question-1',
    })

    expect(questionComments).toHaveLength(3)
    expect(questionComments[0]).toEqual(
      expect.objectContaining({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
  })

  it('should be able to fetch paginated comments on a question', async () => {
    for (let i = 1; i <= 30; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
      )
    }

    const { questionComments: pageOne } = await sut.execute({
      page: 1,
      questionId: 'question-1',
    })
    const { questionComments: pageTwo } = await sut.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(pageOne).toHaveLength(20)
    expect(pageTwo).toHaveLength(10)
  })
})
