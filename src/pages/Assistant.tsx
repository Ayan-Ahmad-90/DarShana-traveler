import { onAuthStateChanged, type User } from 'firebase/auth';
import { AlertCircle, Bot, Compass, Heart, Languages, MapPin, MessageSquare, Mic, Send, Shield, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config.ts';
import { fetchQuestionsFromDB, saveChatToDB, saveFeedback } from '../services/databaseService';
import { getChatResponse } from '../services/geminiService';

interface Message {
  id: number;
  role: 'user' | 'model';
  text: string;
  liked?: boolean;
  disliked?: boolean;
  mapLocation?: string;
}

interface QuickCategory {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  questions: string[];
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'model', text: 'नमस्ते! मैं यात्रा सहायक हूँ, आपका AI यात्रा साथी। 🙏\n\nHello! I\'m Yatra Sahayak, your AI travel companion. 🙏\n\nPlease select a category below or ask me anything about traveling in India!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [listening, setListening] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [categories, setCategories] = useState<QuickCategory[]>([
    {
      id: 'itinerary',
      label: 'Yatrika (Itinerary)',
      icon: Compass,
      color: 'orange',
      questions: [
        'Plan a 7-day North India itinerary',
        'Best South India tour route',
        'How many days per destination?',
        'Best time to visit Rajasthan?',
        'Budget itinerary for 5 days'
      ]
    },
    {
      id: 'safety',
      label: 'Safety & Security',
      icon: Shield,
      color: 'red',
      questions: [
        'Safety tips for solo travelers',
        'Is it safe to travel at night?',
        'Areas to avoid in major cities',
        'Stay safe using public transport',
        'Emergency precautions'
      ]
    },
    {
      id: 'emergency',
      label: 'Emergency Numbers',
      icon: AlertCircle,
      color: 'rose',
      questions: [
        'Emergency numbers in India',
        'How to contact the police',
        'Medical emergency services',
        'Tourist helpline numbers',
        'Report a crime or incident'
      ]
    },
    {
      id: 'culture',
      label: 'Culture & Language',
      icon: Languages,
      color: 'purple',
      questions: [
        'Essential Hindi phrases',
        'Major festivals in India',
        'Indian dining etiquette',
        'Religious sites significance',
        'Regional Indian cuisines'
      ]
    },
    {
      id: 'experience',
      label: 'Experiences',
      icon: Heart,
      color: 'pink',
      questions: [
        'Best adventure activities',
        'Top 10 must-visit destinations',
        'Best trekking routes',
        'Water sports and beaches',
        'Cultural experiences'
      ]
    },
    {
      id: 'practical',
      label: 'Practical Info',
      icon: MessageSquare,
      color: 'cyan',
      questions: [
        'Required travel documents',
        'Train vs Bus vs Flight',
        'Currency and payment methods',
        'Accommodation options',
        'Visa requirements'
      ]
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsDemoMode(false);
      }
    });
    return unsubscribe;
  }, []);

  // Load questions from backend when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      const questions = await fetchQuestionsFromDB();
      if (questions.length > 0) {
        // Update categories with DB questions
        setCategories(prevCats =>
          prevCats.map(cat => ({
            ...cat,
            questions: questions
              .filter((q: any) => q.category === cat.id)
              .slice(0, 5)
              .map((q: any) => q.question)
          }))
        );
      }
    };
    loadQuestions();
  }, []);

  const allowAccess = user || isDemoMode;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    setListening(!listening);
    if (!listening) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInput(transcript);
          setListening(false);
        };
        recognition.onerror = () => {
          setListening(false);
        };
        recognition.start();
      }
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyForModel = [...messages, userMsg];
      const responseText = await getChatResponse(historyForModel, text);
      
      let aiMsg: Message = { 
        id: Date.now() + 1, 
        role: 'model', 
        text: responseText || 'Sorry, I encountered an error. Please try again.' 
      };

      const locationMatch = responseText.match(/(?:in|at|near|visit|place)\s+([A-Za-z\s]+?)(?:\.|,|\?|$)/i);
      if (locationMatch && locationMatch[1]) {
        aiMsg.mapLocation = locationMatch[1].trim();
      }

      setMessages(prev => [...prev, aiMsg]);

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(responseText);
        utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }

      // Save to database
      if (user) {
        const updatedMessages = [...messages, userMsg, aiMsg];
        await saveChatToDB(user.uid, updatedMessages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 2, 
        role: 'model', 
        text: 'क्षमा करें, त्रुटि हुई। कृपया पुनः प्रयास करें। / Sorry, an error occurred. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (id: number, type: 'like' | 'dislike') => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === id) {
          return {
            ...msg,
            liked: type === 'like' ? !msg.liked : false,
            disliked: type === 'dislike' ? !msg.disliked : false
          };
        }
        return msg;
      })
    );

    // Save feedback to database
    if (user) {
      saveFeedback(user.uid, {
        liked: type === 'like',
        disliked: type === 'dislike'
      });
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      red: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
      rose: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
      purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      pink: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
      cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100'
    };
    return colorMap[color] || colorMap.orange;
  };

  const getIconColor = (color: string) => {
    const iconMap: { [key: string]: string } = {
      orange: 'text-orange-600',
      red: 'text-red-600',
      rose: 'text-rose-600',
      purple: 'text-purple-600',
      pink: 'text-pink-600',
      cyan: 'text-cyan-600'
    };
    return iconMap[color] || iconMap.orange;
  };

  if (!allowAccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center border border-stone-200">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot size={40} className="text-orange-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Yatra Sahayak</h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full mb-4"></div>
          <p className="text-stone-600 mb-8 text-base">{t('Please login to use the chatbot.')}</p>
          <button
            onClick={() => navigate('/register')}
            className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition shadow-md"
          >
            {t('Login')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 min-h-[calc(100vh-100px)] flex flex-col bg-stone-50">
      <div className="flex-1 bg-white rounded-2xl shadow-md border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-teal-900 p-5 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={28} />
            </div>
            <div>
              <h2 className="font-bold text-lg">{t('Yatra Sahayak')}</h2>
              <p className="text-xs text-teal-100">{t('Your Travel Companion')}</p>
            </div>
          </div>
          <button
            onClick={() => {
              const newLang = i18n.language === 'en' ? 'hi' : 'en';
              i18n.changeLanguage(newLang);
              localStorage.setItem('language', newLang);
            }}
            className="px-3 py-2 bg-teal-800 hover:bg-teal-700 rounded-lg text-sm font-medium transition"
            title="Toggle Language"
          >
            {i18n.language === 'en' ? 'हिन्दी' : 'English'}
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50">
          {messages.map((msg, idx) => {
            const isAi = msg.role === 'model';
            return (
              <div key={idx} className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                    isAi
                      ? 'bg-white text-stone-800 border border-stone-200 rounded-tl-none shadow-sm'
                      : 'bg-orange-600 text-white rounded-tr-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                  {msg.mapLocation && (
                    <div className="mt-3 flex items-center gap-2 text-orange-600 font-medium text-sm">
                      <MapPin size={16} />
                      <span>{msg.mapLocation}</span>
                    </div>
                  )}
                  {isAi && (
                    <div className="mt-3 flex gap-4">
                      <button
                        aria-label="Like"
                        onClick={() => handleFeedback(msg.id, 'like')}
                        className={`transition ${msg.liked ? 'text-orange-600' : 'text-stone-400 hover:text-stone-600'}`}
                      >
                        <ThumbsUp size={16} />
                      </button>
                      <button
                        aria-label="Dislike"
                        onClick={() => handleFeedback(msg.id, 'dislike')}
                        className={`transition ${msg.disliked ? 'text-stone-600' : 'text-stone-400 hover:text-stone-600'}`}
                      >
                        <ThumbsDown size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-stone-200 shadow-sm flex gap-2">
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Categories */}
        {messages.length < 6 && (
          <div className="px-6 py-4 bg-white border-t border-stone-200 space-y-3">
            <p className="text-xs text-stone-600 font-semibold uppercase">Quick Categories</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map(category => (
                <div key={category.id} className={`p-3 rounded-lg border-2 ${getColorClasses(category.color)} cursor-pointer transition`}>
                  <div className="flex items-center gap-2 mb-2">
                    <category.icon size={16} className={getIconColor(category.color)} />
                    <span className="font-semibold text-xs">{category.label}</span>
                  </div>
                  <div className="space-y-1">
                    {category.questions.slice(0, 2).map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-xs text-left hover:underline line-clamp-1 opacity-75 hover:opacity-100 transition"
                      >
                        • {q.substring(0, 25)}...
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-stone-200">
          <div className="flex items-center gap-3 bg-stone-100 rounded-xl px-5 py-3 focus-within:ring-2 focus-within:ring-orange-500 transition ring-offset-1">
            <button
              onClick={toggleListening}
              className={`p-2 rounded-lg transition ${listening ? 'bg-orange-600 text-white' : 'bg-stone-300 text-stone-700 hover:bg-stone-400'}`}
              aria-label={listening ? 'Stop listening' : 'Start listening'}
              title="Voice Input"
            >
              <Mic size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('Ask about destinations, food, or culture...')}
              className="flex-1 bg-transparent border-none focus:outline-none text-stone-800 placeholder-stone-500 text-base"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition shadow-sm"
              title="Send Message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
