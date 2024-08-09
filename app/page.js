'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import theme from "./theme";
import { transform } from "next/dist/build/swc";
//import { firestore } from "./src/firebase";



// style for sign up and sign in modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p:4,
  display: 'flex',
  flexDirection: 'column',
  gap:3,
};



export default function Home() {

  // SIGN IN / SIGN UP

  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()


  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)



  // MESSAGING

  const [history, setHistory] = useState([
    {
      role: "user",
      parts: [{ text: "" }]
    },
    {
      role: "model",
      parts: [{ text: "Meow! I'm your PawsitiveCare virtual assistant, here to pounce on any questions you have. How can I help you today?" }]
    }

  ]);

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    
    setHistory((history) => [...history, { role: "user", parts: [{ text: message }] }]);
    setMessage('');

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify([...history, { role: "user", parts: [{ text: message }] }])
    });

    const data = await response.json();

    setHistory((history) => [...history, { role: "model", parts: [{ text: data.text }] }]);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  // DISPLAY

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      
      <Stack
        direction={"column"}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Box
        fullwidth
        display='flex'
        flexDirection='column'
        justifyContent="center"
        alignItems="center"
        >
        <Box component="img"
        src="https://i.pinimg.com/564x/b8/51/78/b85178bffa0f26892173b37fe22fec1b.jpg"
        sx={{borderRadius: '50px',
          justifyContent:"center",
          alignItems: 'center',
          height: 80,
          width: 80,
          mt:1
        }}/>
        <Typography sx={{mt:1, mb:-1}}>Kitty</Typography>
        </Box>

        <Divider 
        fullwidth
        orientation="horizontal"
        sx={{my:0}}
        />
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {history.slice(1).map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'user' ? 'flex-end' : 'flex-start'
              }
            >
              <Box
                bgcolor={
                  message.role === 'model'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.parts[0].text}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>

        <Stack
          direction={'row'}
          spacing={2}
        >
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            variant='contained'
            onClick={sendMessage}
            disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
