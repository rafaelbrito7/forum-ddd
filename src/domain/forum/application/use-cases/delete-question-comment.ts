import { QuestionCommentsRepository } from '../repositories/question-comments.repositories'

interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: string
  authorId: string
}

interface DeleteQuestionCommentUseCaseResponse {}

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) throw new Error('Question comment not found')

    if (authorId !== questionComment.authorId.toString())
      throw new Error('Unauthorized')

    await this.questionCommentsRepository.delete(questionComment)

    return {}
  }
}
