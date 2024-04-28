import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestion } from '../../enterprise/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CommentOnQuestionUseCase

describe('Create Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: question.id.toString(),
      content: 'Comentário Teste',
    })

    expect(result.isRight()).toEqual(true)
    expect(result.isLeft()).toEqual(false)

    if (result.isRight())
      expect(inMemoryQuestionCommentsRepository.items[0]).toEqual(
        result.value?.questionComment,
      )
  })

  it('should not be able to comment on question that does not exist', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      content: 'Comentário Teste',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.isRight()).toEqual(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
