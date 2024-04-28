import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from '../../enterprise/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from './errors/unauthorized-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-1',
      content: 'Conteúdo teste',
      title: 'Pergunta teste',
    })

    expect(result.isRight()).toEqual(true)
    expect(result.isLeft()).toEqual(false)
    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      content: 'Conteúdo teste',
      title: 'Pergunta teste',
    })
  })

  it('should not be able to edit a question that does not exist', async () => {
    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
      content: 'Conteúdo teste',
      title: 'Pergunta teste',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.isRight()).toEqual(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a another users question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
      content: 'Conteúdo teste',
      title: 'Pergunta teste',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.isRight()).toEqual(false)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
