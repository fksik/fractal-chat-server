import { ChatEvents } from '@chat/constants/chat-events';
import { Conversation } from '@chat/model/database/Conversation';
import { Message } from '@chat/model/database/Message';
import { User } from '@chat/model/database/User';
import { ChatService } from '@chat/services/chat/ChatService';
import { UserService } from '@chat/services/UserService';
import { Args, Input, Socket, SocketService } from '@tsed/socketio';
import { Socket as SocketIO } from 'socket.io';

@SocketService('/chat.io')
export class ChatAdapter {
	constructor(
		private userService: UserService,
		private chatService: ChatService
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
			user = await this.userService.getUserById(session.userId);
		}
		if (user === null) {
			user = await this.userService.createNewAnonymousUser();
			socket.emit(ChatEvents.USER_REGISTERED, user);
		}
		let conversation: Conversation | null = null;
		if (session.conversationId) {
			conversation = await this.chatService.getConversationById(
				session.conversationId
			);
		}
		if (conversation === null) {
			conversation = await this.chatService.createNewConversation(user);
			socket.emit(ChatEvents.CONVERSATION_CREATED, conversation);
		}
		socket.emit(
			ChatEvents.SEND_MESSAGE,
			await this.chatService.processMessage(
				data,
				user,
				conversation,
				session.requestHistory
			)
		);
	}

	@Input(ChatEvents.USER_TYPING)
	public userTyping() {}

	private async joinRoom(socket: SocketIO, conversationId: string) {
		socket.join(conversationId);
	}
}
