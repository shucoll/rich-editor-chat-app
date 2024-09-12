import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Loader from '../Loader/Loader';

import './Chat.css';

const ENDPOINT = process.env.REACT_APP_BACKEND_URL;

let socket;

const Chat = () => {
  const location = useLocation();
  const [name_s, setName] = useState('');
  const [room_s, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [sidebarShow, sidebarToggle] = useState(true);

  // Fix for delay in server starting. Loading bar displayed while server initalizes. For free api deployment where server shuts down after a certain amount of time. Set loading when first user attempts to join a room.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

  }, [location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on('roomData', ({ users }) => {
      // Fix for delay in server starting. When user joins it is know that server has started and running.
      setLoading(false);

      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  const sidebarToggleHandler = () => {
    sidebarToggle(!sidebarShow);
    console.log('clicked');
  };

  return (
    <div className='outerContainer'>
      <div className='container'>
        {loading ? (
          <div className='context-loader-container'>
            <Loader size='60px' center />
            <h4 style={{width: '70%', textAlign: 'center', margin: 'auto'}}>
              Connecting to chat. This may take a few minutes if the server
              hasn't already been initialized.
            </h4>
          </div>
        ) : (
          <>
            <Sidebar room={room_s} users={users} sidebarShow={sidebarShow} />
            <div className='chat_container'>
              <InfoBar sidebarToggle={sidebarToggleHandler} />
              <Messages messages={messages} name={name_s} />
              <Input
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
