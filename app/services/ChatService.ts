import { Inject } from '@tsed/di';
import { MongooseModel } from '@tsed/mongoose';
import { Args, Input, Socket, SocketService } from '@tsed/socketio';
import { Socket as SocketIO } from 'socket.io';
import { ChatEvents } from '../constants/chat-events';
import { Conversation } from '../model/database/Conversation';
import { Message } from '../model/database/Message';
import { User } from '../model/database/User';

@SocketService('/chat.io')
export class ChatService {
	constructor(
		@Inject(User) private userModel: MongooseModel<User>,
		@Inject(Conversation)
		private conversationModel: MongooseModel<Conversation>,
		@Inject(Message) private messageModel: MongooseModel<Message>
	) {}

	public $onConnection(@Socket socket: SocketIO) {}
	public $onDisconnect(@Socket socket: SocketIO) {}

	@Input(ChatEvents.RECEIVE_MESSAGE)
	public async inComingMessage(
		@Args(0)
		session: {
			userId: string;
			requestHistory: boolean;
			conversationId: string;
		},
		@Args(1) data: { content: string; sentOn: number },
		@Socket socket: SocketIO
	) {
		let user: User | null = null;
		if (session.userId) {
			user = await this.userModel.findById(session.userId);
		}
		if (user === null) {
			user = await this.createNewAnonymousUser();
			socket.emit(ChatEvents.USER_REGISTERED, user);
		}
		let conversation: Conversation | null = null;
		if (session.conversationId) {
			conversation = await this.conversationModel.findById(
				session.conversationId
			);
		}
		if (conversation === null) {
			conversation = await this.createNewConversation(user);
			socket.emit(ChatEvents.CONVERSATION_CREATED, conversation);
		}
		socket.emit(
			ChatEvents.SEND_MESSAGE,
			await this.processMessage(
				data,
				user,
				conversation,
				session.requestHistory
			)
		);
	}

	@Input(ChatEvents.USER_TYPING)
	public userTyping() {}

	private async createNewAnonymousUser() {
		const user = new User(new Date().getTime());
		const model = new this.userModel(user);
		await model.save();
		return model;
	}

	private async processMessage(
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

	private async fetchHistory(conversation: Conversation) {
		return this.messageModel.find({ conversation });
	}

	private async createNewConversation(user: User) {
		const conversation = new Conversation();
		conversation.markAsNew(user);
		const model = new this.conversationModel(conversation);
		await model.save();
		return model;
	}

	private async joinRoom(socket: SocketIO, conversationId: string) {
		socket.join(conversationId);
	}
}
