import { Nsp, Socket, SocketService, Input, Args } from '@tsed/socketio';
import { Namespace, Socket as SocketIO } from 'socket.io';
import { $log } from 'ts-log-debug';
import { User } from '@chat/model/User';
import { Inject } from '@tsed/di';
import { MongooseModel } from '@tsed/mongoose';
import { ChatEvents } from '@chat/constants/chat-events';
import { Message } from '@chat/model/Message';
import { Conversation } from '@chat/model/Conversation';

@SocketService('/chat.io')
export class ChatService {
	@Nsp private nsp: Namespace;

	constructor(
		@Inject(User) private userModel: MongooseModel<User>,
		@Inject(Conversation)
		private conversationModel: MongooseModel<Conversation>,
		@Inject(Message) private messageModel: MongooseModel<Message>
	) {}

	public $onConnection(@Socket socket: SocketIO) {
	}
	public $onDisconnect(@Socket socket: SocketIO) {}

	@Input(ChatEvents.RECEIVE_MESSAGE)
	public async inComingMessage(
		@Args(0)
		session: {
			userId: string;
			requestHistory: boolean;
			conversationId: string;
		},
		@Args(1) data: [{ content: string; sentOn: number }],
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
		}
		this.processMessage(data, user, conversation, session.requestHistory);
	}

	@Input(ChatEvents.USER_TYPING)
	public userTyping() {
		console.log('typing');
	}

	private async createNewAnonymousUser() {
		const user = new User(new Date().getTime());
		const model = new this.userModel(user);
		await model.save();
		return model;
	}

	private processMessage(
		data: [{ content: string; sentOn: number }],
		user: User,
		conversation: Conversation,
		requestHistory: boolean
	) {
		data.forEach(msg => {
			const message = new Message(conversation, user, msg.content, msg.sentOn);
		});
	}

	private async createNewConversation(user: User) {
		const conversation = new Conversation();
		conversation.markAsNew(user);
		const model = new this.conversationModel(conversation);
		await model.save();
		return model;
	}
}
