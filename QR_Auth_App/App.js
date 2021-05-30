import React, { useEffect } from 'react';
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { externalSocket } from './Socket';
// import io from 'socket.io-client'

const socket = externalSocket.socket;


class App extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			message: ''
		}	

	}


	componentDidMount() {

		socket.on('connect', () => console.log('Hello, world'));

	}

	onQRSuccess = (e) => {
		socket.emit('authenticate-user', {
			data: `${e.data}`,
			flag: 'Its coming from qrauthsystem'
		})
	}


	render() {
		return (
			<SafeAreaView>
				<QRCodeScanner onRead = {this.onQRSuccess} />
			</SafeAreaView>
		);
	}

}



export default App;
