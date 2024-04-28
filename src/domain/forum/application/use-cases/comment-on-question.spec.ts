import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestion } from '../../enterprise/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

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

    await sut.execute({
      authorId: 'author-1',
      questionId: question.id.toString(),
      content: 'Comentário Teste',
    })

    expect(inMemoryQuestionCommentsRepository.items[0].questionId).toEqual(
      question.id,
    )
    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Comentário Teste',
    )
  })
})
