import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswer } from '../../enterprise/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: CommentOnAnswerUseCase

describe('Create Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      authorId: 'author-1',
      answerId: answer.id.toString(),
      content: 'Comentário Teste',
    })

    expect(result.isRight()).toEqual(true)
    expect(result.isLeft()).toEqual(false)
    if (result.isRight())
      expect(inMemoryAnswerCommentsRepository.items[0]).toEqual(
        result.value?.answerComment,
      )
  })

  it('should not be able to comment on answer that does not exist', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'Comentário Teste',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.isRight()).toEqual(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
