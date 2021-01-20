import { Message as PersistenceMessage } from '@prisma/client'

import { Message } from '../domain/message/message'
import { Subject } from '../domain/message/subject'
import { Body } from '../domain/message/body'

export class MessageMapper {
  static toDomain(raw: PersistenceMessage): Message {
    const subjectOrError = Subject.create(raw.subject)
    const bodyOrError = Body.create(raw.body)

    if (subjectOrError.isLeft()) {
      throw new Error('Subject value is invalid.')
    }

    if (bodyOrError.isLeft()) {
      throw new Error('Body value is invalid.')
    }

    const messageOrError = Message.create(
      {
        subject: subjectOrError.value,
        body: bodyOrError.value,
        templateId: raw.template_id,
        sentAt: raw.sent_at,
      },
      raw.id
    )

    if (messageOrError.isRight()) {
      return messageOrError.value
    }

    return null
  }

  static toPersistence(message: Message) {
    return {
      id: message.id,
      subject: message.subject.value,
      body: message.body.value,
      template_id: message.templateId,
      sent_at: message.sentAt,
    }
  }
}
