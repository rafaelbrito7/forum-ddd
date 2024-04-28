import { AnswerCommentsRepository } from '../repositories/answer-comments.repositories'

interface DeleteAnswerCommentUseCaseRequest {
  answerCommentId: string
  authorId: string
}

interface DeleteAnswerCommentUseCaseResponse {}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) throw new Error('Answer comment not found')

    if (authorId !== answerComment.authorId.toString())
      throw new Error('Unauthorized')

    await this.answerCommentsRepository.delete(answerComment)

    return {}
  }
}
