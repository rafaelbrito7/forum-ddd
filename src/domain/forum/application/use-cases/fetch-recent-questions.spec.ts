import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from '../../enterprise/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Get Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch a list of recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) }),
    )

    const { questions } = await sut.execute({ page: 1 })

    expect(questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2022, 0, 23),
      }),

      expect.objectContaining({
        createdAt: new Date(2022, 0, 20),
      }),

      expect.objectContaining({
        createdAt: new Date(2022, 0, 18),
      }),
    ])
  })

  it('should be able to fetch a paginated list of recent questions', async () => {
    for (let i = 1; i <= 30; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const { questions: pageOne } = await sut.execute({ page: 1 })
    const { questions: pageTwo } = await sut.execute({ page: 2 })

    expect(pageOne).toHaveLength(20)
    expect(pageTwo).toHaveLength(10)
  })
})
