import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from '../../enterprise/factories/make-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Get Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch answers of a question', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )

    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )

    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )

    const { answers } = await sut.execute({
      page: 1,
      questionId: 'question-1',
    })

    expect(answers).toHaveLength(3)
    expect(answers[0]).toEqual(
      expect.objectContaining({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
  })

  it('should be able to fetch a paginated answers of a question', async () => {
    for (let i = 1; i <= 30; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('question-1') }),
      )
    }

    const { answers: pageOne } = await sut.execute({
      page: 1,
      questionId: 'question-1',
    })
    const { answers: pageTwo } = await sut.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(pageOne).toHaveLength(20)
    expect(pageTwo).toHaveLength(10)
  })
})
