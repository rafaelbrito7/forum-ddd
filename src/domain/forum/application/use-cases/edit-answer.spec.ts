import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from '../../enterprise/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from './errors/unauthorized-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from '../../enterprise/factories/make-answer-attachments'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should be able to edit an answer', async () => {
    const answer = makeAnswer(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(answer)

    makeAnswerAttachment({
      answerId: answer.id,
      attachmentId: new UniqueEntityID('1'),
    })

    makeAnswerAttachment({
      answerId: answer.id,
      attachmentId: new UniqueEntityID('2'),
    })

    const result = await sut.execute({
      answerId: answer.id.toValue(),
      authorId: 'author-1',
      content: 'Conteúdo teste',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toEqual(true)
    expect(result.isLeft()).toEqual(false)
    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Conteúdo teste',
    })
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
      ],
    )
    if (result.isRight()) {
      expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
    }
  })

  it('should not be able to edit an answer that does not exist', async () => {
    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
      content: 'Conteúdo teste',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.isRight()).toEqual(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit another users answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-2',
      content: 'Conteúdo teste',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.isRight()).toEqual(false)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
