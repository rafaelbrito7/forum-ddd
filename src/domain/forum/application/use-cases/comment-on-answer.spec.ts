import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswer } from '../../enterprise/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: CommentOnAnswerUseCase

describe('Create Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      authorId: 'author-1',
      answerId: answer.id.toString(),
      content: 'Comentário Teste',
    })

    expect(inMemoryAnswerCommentsRepository.items[0].answerId).toEqual(
      answer.id,
    )
    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'Comentário Teste',
    )
  })
})
