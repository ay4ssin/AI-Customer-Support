import { useState } from 'react';
import { Box } from '@mui/material';
import TypingIndicator from './TypingIndicator';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatComponent = () => {
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const sendMessage = async (message) => {
    setIsBotTyping(true);
    
    try {
      const response = await fetchBotResponse(message);
      setMessages([...messages, { text: message, isUser: true }, { text: response, isUser: false }]);
      setIsBotTyping(false);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setIsBotTyping(false);
    }
  };

  return (
    <Box>
      <MessageList messages={messages} />
      {isBotTyping && <TypingIndicator />}
      <MessageInput onSendMessage={sendMessage} />
    </Box>
  );
};

export default ChatComponent;