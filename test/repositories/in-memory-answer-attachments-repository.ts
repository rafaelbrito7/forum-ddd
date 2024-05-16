import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repositories'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string) {
    return this.items.filter((item) => item.answerId.toString() === answerId)
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )
  }
}
