import { AnswersRepository } from '../repositories/answers.repositories'

interface DeleteAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

interface DeleteAnswerUseCaseResponse {}

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) throw new Error('Answer not found')

    if (authorId !== answer.authorId.toString()) throw new Error('Unauthorized')

    await this.answersRepository.delete(answer)

    return {}
  }
}
