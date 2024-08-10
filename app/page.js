'use client'

import Image from "next/image";
import { Box, Button, Divider, Stack, TextField, Typography, Modal, Accordion, AccordionDetails, AccordionSummary, Rating } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { firestore, auth } from "./src/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import Theme from "./theme";
import TypingIndicator from './components/TypingIndicator';


import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

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
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

class RatingSystem {
  constructor(setRatingVisible, setSelectedRating, submitRatingToFirebase) {
    this.setRatingVisible = setRatingVisible;
    this.setSelectedRating = setSelectedRating;
    this.submitRatingToFirebase = submitRatingToFirebase;
  }

  show() {
    this.setRatingVisible(true);
  }

  hide() {
    this.setRatingVisible(false);
  }

  setRating(rating) {
    this.setSelectedRating(rating);
  }

  submitRating(rating, feedback) {
    console.log(`Rating: ${rating}, Feedback: ${feedback}`);
    this.submitRatingToFirebase(rating, feedback);
    this.hide();
  }
}

class ConversationManager {
  constructor(ratingSystem) {
    this.isEnded = false;
    this.ratingSystem = ratingSystem;
    this.onConversationEnd = null;
  }

  processMessage(message) {
    if (this.isEnded) return;

    if (message.toLowerCase() === '/end') {
      this.endConversation();
      return;
    }

    console.log('Processing message:', message);
  }

  endConversation() {
    if (this.isEnded) return;
    
    this.isEnded = true;
    console.log('Conversation ended');
    this.ratingSystem.show();
    if (this.onConversationEnd) {
      this.onConversationEnd();
    }
  }
}

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [expanded, setExpanded] = useState(false);
  const [ratingVisible, setRatingVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedback, setFeedback] = useState('');


  const submitRatingToFirebase = async (rating, feedback) => {
      const ratingData = {
        rating: rating,
        feedback: feedback,
        timestamp: serverTimestamp()
      };

      const docRef = await addDoc(collection(firestore, "ratings"), ratingData);
      console.log("Rating submitted with ID: ", docRef.id);
  };

  const [conversationManager] = useState(() => new ConversationManager(new RatingSystem(setRatingVisible, setSelectedRating, submitRatingToFirebase)));


  const [history, setHistory] = useState([
    {
      role: "user",
      parts: [{ text: "" }]
    },
    {
      role: "model",
      parts: [{ text: "Meow! I'm your PawsitiveCare virtual assistant, here to pounce on any questions you have. How can I help you today? Please note: to end the conversation with our virtual assistant, please type the /end command." }]
    }
  ]);

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const onSubmit = async (e) => {
    e.preventDefault()
    await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
    })
  }

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
    })
  }

  const handleLogout = () => {               
    signOut(auth).then(() => {
        console.log("Signed out successfully")
    }).catch((error) => {
      console.log("An error happened during sign out:", error)
    });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user){
        const uid = user.uid;
        console.log("uid", uid)
      } else{
        console.log("user is logged out")
      }
    })
  }, [])

  const [isBotTyping, setIsBotTyping] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    if (message.toLowerCase() === '/end') {
      conversationManager.endConversation();
      setIsLoading(true);
      return;
    }
    
    conversationManager.processMessage(message);

    setIsLoading(true);
    setIsBotTyping(true);

    try {
      //add user to history
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
  
      //adding bot response to history
      setHistory((history) => [...history, { role: "model", parts: [{ text: data.text }] }]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
    } finally {
      setIsLoading(false);
      setIsBotTyping(false);
    }
    
    /*setHistory((history) => [...history, { role: "user", parts: [{ text: message }] }]);
    setMessage('');

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify([...history, { role: "user", parts: [{ text: message }] }])
    });

    const data = await response.json();

    setHistory((history) => [...history, { role: "model", parts: [{ text: data.text }] }]);*/
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

  const handleRatingSubmit = () => {
    conversationManager.ratingSystem.submitRating(selectedRating, feedback);
    setIsLoading(false);
    setRatingVisible(false);
    setSelectedRating(0);
    setFeedback('');
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      sx={{bgcolor:'background.default'}}
    >
      <Box fullWidth sx={{ 
        display:'flex',
        flexDirection:'column',
        bgcolor:'primary.highlight', 
        mr: 5,
        width:300,
        height:'auto',
        borderRadius: 5,
        border:"1px solid white", 
        p:3,
        borderColor:'primary.border'
      }}>
        <Accordion 
          variant="contained" 
          fullWidth 
          expanded={expanded === 'panel1'} 
          onChange={handleChange('panel1')}
          sx={{mb:2, bgcolor:'primary.main', boxShadow:1, borderRadius:2, '&:before': {display: 'none'}}}
        >
          <AccordionSummary 
            id="panel-header" 
            aria-controls="panel-content"
            sx={{justifyContent:"center", color:'primary.highlight'}}
          >
            Sign In
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <TextField
                sx={{mb:2, background: '#fff2f4', borderRadius:1}}
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                sx={{mb:2, background: '#fff2f4', borderRadius:1}}
                label="Password"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                variant="contained" 
                fullWidth 
                sx={{height:'40px', mb:3, bgcolor:'primary.highlight'}}
                onClick={onLogin}
              >
                Sign In
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          variant="contained" 
          fullWidth 
          expanded={expanded === 'panel2'} 
          onChange={handleChange('panel2')}
          sx={{ mb:2, bgcolor:'primary.main', boxShadow:1, borderRadius:2, '&:before': {display: 'none'}}}
        >
          <AccordionSummary 
            id="panel-header" 
            aria-controls="panel-content"
            sx={{justifyContent:"center", color:'primary.highlight'}}
          >
            Sign Up
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <TextField
                sx={{mb:2,background: '#fff2f4', borderRadius:1}}
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                sx={{mb:2, background: '#fff2f4', borderRadius:1}}
                label="Password"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                variant="contained" 
                fullWidth 
                sx={{height:'40px', mb:3, bgcolor:'primary.highlight'}} 
                onClick={onSubmit}
              >
                Sign Up!
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      
        <Button 
          variant="contained" 
          fullWidth 
          sx={{height:'40px', mb:3, color:'white', mt:2}} 
          onClick={handleLogout}
        >
          Log out
        </Button>
      </Box>
      
      <Stack
        direction={"column"}
        width="500px"
        height="700px"
        borderRadius={5}
        p={2}
        spacing={3}
        sx={{bgcolor: 'primary.highlight', border:"1px solid white", borderColor:'primary.border'}}
      >
        <Box
          fullwidth
          display='flex'
          flexDirection='column'
          justifyContent="center"
          alignItems="center"
        >
          <Box 
            component="img"
            src="https://i.pinimg.com/564x/b8/51/78/b85178bffa0f26892173b37fe22fec1b.jpg"
            sx={{
              borderRadius: '50px',
              justifyContent:"center",
              alignItems: 'center',
              height: 80,
              width: 80,
              mt:1
            }}
          />
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
              justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}
            >
              <Box
                bgcolor={message.role === 'model' ? 'primary.main' : 'secondary.main'}
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.parts[0].text}
              </Box>
            </Box>
          ))}
          {isBotTyping && (
            <>
            <TypingIndicator />
          </>
          )}
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
            disabled={isLoading}
            sx={{bgcolor: 'secondary.main'}}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
      
      {/* Rating Modal */}
      <Modal
        open={ratingVisible}
        onClose={() => setRatingVisible(false)}
        aria-labelledby="rating-modal-title"
        aria-describedby="rating-modal-description"
      >
        <Box sx={style}>
          <Typography id="rating-modal-title" variant="h6" component="h2">
            How would you rate this conversation?
          </Typography>
          <Rating
            name="simple-controlled"
            value={selectedRating}
            onChange={(event, newValue) => {
              setSelectedRating(newValue);
            }}
          />
          <TextField
            label="Feedback"
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button onClick={handleRatingSubmit} variant="contained">
            Submit Rating
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
