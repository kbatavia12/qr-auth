import io from 'socket.io-client';

let socket = io('http://192.168.1.2:1192/');

export const externalSocket = {
    'socket': socket
}