import {IO, Nsp, Socket, SocketService} from '@tsed/socketio';
import {Namespace, Server, Socket as SocketIO} from 'socket.io';
import {$log} from 'ts-log-debug';

@SocketService('/chat.io')
export class ChatService {
  @Nsp private nsp: Namespace;

  constructor(@IO private io: Server) {
  }

  public $onConnection(@Socket socket: SocketIO) {
    $log.info('connected');
  }
  public $onDisconnect(@Socket socket: SocketIO) {}
}
