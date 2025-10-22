import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock, Calendar, Trash2 } from 'lucide-react';

export default function AdvancedChatbot() {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm an advanced AI assistant. I can help you with various tasks, answer questions, and have conversations. How can I assist you today?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [userName, setUserName] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const intents = {
    greeting: {
      patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
      responses: [
        "Hello! How can I assist you today?",
        "Hi there! What can I help you with?",
        "Hey! Great to chat with you. What's on your mind?"
      ]
    },
    name_query: {
      patterns: ['your name', 'who are you', 'what are you', 'introduce yourself'],
      responses: [
        "I'm an AI chatbot designed to assist you with various tasks and conversations. You can call me ChatBot!",
        "I'm ChatBot, an artificial intelligence assistant here to help you."
      ]
    },
    user_name: {
      patterns: ['my name is', 'i am', "i'm", 'call me'],
      responses: [
        "Nice to meet you, {name}!",
        "Great to know you, {name}!",
        "Pleasure to meet you, {name}!"
      ]
    },
    time: {
      patterns: ['time', 'what time is it', 'current time'],
      responses: []
    },
    date: {
      patterns: ['date', 'what day', 'today', "what's the date"],
      responses: []
    },
    weather: {
      patterns: ['weather', 'temperature', 'forecast', 'climate'],
      responses: [
        "I don't have access to real-time weather data, but you can check weather.com or your local weather service!",
        "I can't check the weather right now, but I recommend using a weather app for accurate forecasts."
      ]
    },
    help: {
      patterns: ['help', 'what can you do', 'your capabilities', 'features', 'assist me'],
      responses: [
        "I can help you with: answering questions, providing information, casual conversation, telling time/date, math calculations, jokes, and much more. Just ask!",
        "I'm here to assist with information, answer your questions, have conversations, and help solve problems. What do you need?"
      ]
    },
    thanks: {
      patterns: ['thank', 'thanks', 'appreciate', 'grateful'],
      responses: [
        "You're welcome! Happy to help!",
        "Anytime! Feel free to ask if you need anything else.",
        "My pleasure! Let me know if there's anything else I can do."
      ]
    },
    goodbye: {
      patterns: ['bye', 'goodbye', 'see you', 'take care', 'farewell'],
      responses: [
        "Goodbye! Have a wonderful day!",
        "Take care! Feel free to come back anytime.",
        "See you later! It was nice chatting with you."
      ]
    },
    joke: {
      patterns: ['joke', 'make me laugh', 'funny', 'humor'],
      responses: [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the programmer quit his job? Because he didn't get arrays!",
        "What do you call a bear with no teeth? A gummy bear!",
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "What's a computer's favorite snack? Microchips!"
      ]
    },
    compliment: {
      patterns: ['you are great', 'you are awesome', 'you are good', 'smart', 'intelligent', 'helpful'],
      responses: [
        "Thank you! That's very kind of you to say.",
        "I appreciate the compliment! I'm here to help whenever you need.",
        "Thanks! I do my best to be helpful."
      ]
    },
    feeling: {
      patterns: ['how are you', 'how do you feel', 'are you okay', 'your mood'],
      responses: [
        "I'm functioning well and ready to help! How are you doing?",
        "I'm doing great, thanks for asking! How about you?",
        "I'm here and ready to assist! How are things with you?"
      ]
    },
    age: {
      patterns: ['how old', 'your age', 'when were you born', 'when created'],
      responses: [
        "I'm a digital assistant, so I don't age like humans do. But I'm constantly learning and improving!",
        "Age is just a number, especially for AI! I exist to help you regardless of time."
      ]
    }
  };

  const sentimentWords = {
    positive: ['happy', 'great', 'good', 'excellent', 'awesome', 'wonderful', 'love', 'like', 'enjoy'],
    negative: ['sad', 'bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'frustrated', 'upset']
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const extractName = (userInput) => {
    const patterns = [
      /my name is (\w+)/i,
      /i am (\w+)/i,
      /i'm (\w+)/i,
      /call me (\w+)/i
    ];
    
    for (const pattern of patterns) {
      const match = userInput.match(pattern);
      if (match) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      }
    }
    return null;
  };

  const detectSentiment = (userInput) => {
    const msg = userInput.toLowerCase();
    const positiveCount = sentimentWords.positive.filter(word => msg.includes(word)).length;
    const negativeCount = sentimentWords.negative.filter(word => msg.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const calculate = (userInput) => {
    try {
      const numbers = userInput.match(/\d+\.?\d*/g);
      if (numbers && numbers.length >= 2) {
        const num1 = parseFloat(numbers[0]);
        const num2 = parseFloat(numbers[1]);
        const msg = userInput.toLowerCase();
        
        if (msg.includes('plus') || msg.includes('+') || msg.includes('add')) {
          return `The result is ${num1 + num2}`;
        } else if (msg.includes('minus') || msg.includes('-') || msg.includes('subtract')) {
          return `The result is ${num1 - num2}`;
        } else if (msg.includes('multiply') || msg.includes('*') || msg.includes('times')) {
          return `The result is ${num1 * num2}`;
        } else if (msg.includes('divide') || msg.includes('/')) {
          if (num2 !== 0) {
            return `The result is ${(num1 / num2).toFixed(2)}`;
          } else {
            return "I can't divide by zero!";
          }
        }
      }
    } catch (e) {
      return "I couldn't understand that calculation. Try something like '5 plus 3' or '10 divided by 2'";
    }
    return "I couldn't understand that calculation. Try something like '5 plus 3' or '10 divided by 2'";
  };

  const matchIntent = (userInput) => {
    const msg = userInput.toLowerCase();
    
    // Check for calculation
    if (/\d+/.test(msg) && (msg.includes('plus') || msg.includes('minus') || msg.includes('multiply') || 
        msg.includes('divide') || msg.includes('+') || msg.includes('-') || msg.includes('*') || msg.includes('/'))) {
      return { intent: 'calculation', response: calculate(userInput) };
    }
    
    // Check for name introduction
    const name = extractName(userInput);
    if (name) {
      setUserName(name);
      const responses = intents.user_name.responses;
      return { 
        intent: 'user_name', 
        response: responses[Math.floor(Math.random() * responses.length)].replace('{name}', name) 
      };
    }
    
    // Match other intents
    for (const [intent, data] of Object.entries(intents)) {
      for (const pattern of data.patterns) {
        if (msg.includes(pattern)) {
          let response;
          
          if (intent === 'time') {
            const now = new Date();
            response = `The current time is ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
          } else if (intent === 'date') {
            const now = new Date();
            response = `Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
          } else {
            response = data.responses[Math.floor(Math.random() * data.responses.length)];
          }
          
          // Personalize if name is known
          if (userName && (intent === 'greeting' || intent === 'goodbye')) {
            response = response.replace('!', `, ${userName}!`);
          }
          
          return { intent, response };
        }
      }
    }
    
    return { intent: 'unknown', response: null };
  };

  const generateResponse = (userInput) => {
    const sentiment = detectSentiment(userInput);
    const { intent, response } = matchIntent(userInput);
    
    if (response) return response;
    
    // Sentiment-aware responses for unknown intents
    const responses = {
      positive: [
        "That's great to hear! Tell me more.",
        "I'm glad you're feeling positive! How can I help you today?",
        "Wonderful! What would you like to talk about?"
      ],
      negative: [
        "I'm sorry to hear that. Is there anything I can help you with?",
        "I understand. How can I assist you to make things better?",
        "I'm here to help. What's troubling you?"
      ],
      neutral: [
        "That's interesting! Could you tell me more?",
        "I'm not sure I fully understand. Could you elaborate?",
        "I'm here to help! What specifically would you like to know?",
        "I'm still learning. Could you rephrase that?",
        "Hmm, I don't have information about that right now. What else can I help with?"
      ]
    };
    
    return responses[sentiment][Math.floor(Math.random() * responses[sentiment].length)];
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { 
      text: input, 
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(input);
      const botMessage = { 
        text: response, 
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        text: "Chat cleared! How can I help you?", 
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setUserName(null);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
              <Bot className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Advanced AI Chatbot</h1>
              <p className="text-sm text-gray-500">Always here to help</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            <Trash2 size={18} />
            <span className="text-sm font-medium">Clear</span>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}>
                {message.sender === 'user' ? (
                  <User className="text-white" size={20} />
                ) : (
                  <Bot className="text-white" size={20} />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col max-w-xs md:max-w-md ${
                message.sender === 'user' ? 'items-end' : 'items-start'
              }`}>
                <div
                  className={`px-4 py-3 rounded-2xl shadow-md ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1 px-2">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Bot className="text-white" size={20} />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full bg-transparent resize-none focus:outline-none text-gray-800 placeholder-gray-500"
                style={{ maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-3 rounded-2xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>Press Enter to send</span>
            </div>
            {userName && (
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>Chatting as {userName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}