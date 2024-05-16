import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '../entities/question-attachment'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const questionAttachment = QuestionAttachment.create({
    attachmentId: new UniqueEntityID(),
    questionId: new UniqueEntityID(),
    ...override,
  })

  return questionAttachment
}
