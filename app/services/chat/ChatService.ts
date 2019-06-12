import { Conversation } from '@chat/model/database/Conversation';
import { Message } from '@chat/model/database/Message';
import { User } from '@chat/model/database/User';
import { Inject, Service } from '@tsed/di';
import { MongooseModel } from '@tsed/mongoose';

@Service()
export class ChatService {
	constructor(
		@Inject(Conversation)
		private conversationModel: MongooseModel<Conversation>,
		@Inject(Message) private messageModel: MongooseModel<Message>
	) {}

	public async createNewConversation(user: User) {
		const conversation = new Conversation();
		conversation.markAsNew(user);
		const model = new this.conversationModel(conversation);
		await model.save();
		return model;
	}

	public getConversationById(conversationId: string) {
		return this.conversationModel.findById(conversationId);
	}

	public async processMessage(
		data: { content: string; sentOn: number },
		user: User,
		conversation: Conversation,
		requestHistory: boolean
	) {
		let messageModels: Message[] = [];
		if (requestHistory) {
			messageModels = (await this.fetchHistory(conversation)) || [];
		}
		const { content, sentOn } = data;
		if (content) {
			const message = new Message(conversation, user, content, sentOn);
			const model = new this.messageModel(message);
			messageModels.push(await model.save());
		}
		return messageModels;
	}

	private fetchHistory(conversation: Conversation) {
		return this.messageModel.find({ conversation });
	}
}
