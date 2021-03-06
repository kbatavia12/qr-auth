import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode.react';
import styles from './App.module.css'
import socketIOClient from 'socket.io-client'


const socket = socketIOClient('http://192.168.1.2:1192');
function App() {

	const [QRData, setQRData] = useState('');
	const [displayQrCode, setDisplayQrCode] = useState(false);

	useEffect(() => {
		socket.emit('get-cookie', async data => {
			const token = await data;
			setQRData(token);
			setDisplayQrCode(true);
		});

		socket.emit('get-token', async data => {
			const token = await data;
			console.log(token);
		})
		return () => {
			socket.disconnect();
		}
	}, [])


	useEffect(() => {
		socket.on('userlogin', async data => {
			const res = await data;
			console.log(res);
		}) 	
	}, [])


	useEffect(() => {
		
	}, [])

	return (
		<div className="App">
			<h1>Whatsapp-like QR Code Authentication</h1>
			<div className={styles.qrContainer} >
				{displayQrCode ? <QRCode size={250} value={QRData} /> : null}
			</div>
		</div>
	);
}

export default App;
