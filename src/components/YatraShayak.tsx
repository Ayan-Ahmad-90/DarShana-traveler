import { useState } from 'react';
import { MessageCircle, X, Send, Loader2, Shield } from 'lucide-react';
import { yatraShayakApi } from '../services/api';

interface YatraShayakProps {
  onSafetyClick?: () => void;
}

const YatraShayak = ({ onSafetyClick }: YatraShayakProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{ type: 'user' | 'bot'; text: string }[]>([
    { type: 'bot', text: 'Namaste! I am Yatra Shayak. How can I help you?' },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMsg = message;
    setHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setMessage('');
    setLoading(true);

    try {
      const res = await yatraShayakApi.chat(userMsg);
      if (res.success && res.data) {
        const data = res.data as { response: string };
        setHistory(prev => [...prev, { type: 'bot', text: data.response }]);
      }
    } catch (error) {
      setHistory(prev => [...prev, { type: 'bot', text: 'Sorry, I am having trouble connecting.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-6">
      {/* Chatbot Group (Hint + Button) */}
      {!isOpen && (
        <div className="flex flex-col items-end animate-float">
          {/* Popup Hint */}
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-primary-100 origin-bottom-right mb-2 relative mr-2">
            <p className="text-sm font-medium text-primary-800">Need help? Ask me! 👋</p>
            <div className="absolute -bottom-1 right-6 w-3 h-3 bg-white border-b border-r border-primary-100 transform rotate-45"></div>
          </div>

          {/* Chatbot Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition transform hover:scale-110"
            aria-label="Open AI Assistant"
            title="Yatra Sahayak AI"
          >
            <MessageCircle size={28} />
          </button>
        </div>
      )}

      {/* Safety SOS Button */}
      {!isOpen && onSafetyClick && (
        <button
          onClick={onSafetyClick}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center group animate-pulse"
          title="Emergency Safety Dashboard"
        >
          <Shield className="w-7 h-7" />
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Safety SOS
          </span>
        </button>
      )}

      {isOpen && (
        <div className="bg-neutral-50 rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col h-[500px] border border-neutral-200 mb-20 sm:mb-0">
          <div className="bg-primary-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="font-bold flex items-center gap-2">
              <span>👨‍✈️</span> Saarthi
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-600 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
            {history.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    msg.type === 'user'
                      ? 'bg-primary-500 text-white rounded-br-none'
                      : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 p-3 rounded-xl rounded-bl-none shadow-sm">
                  <Loader2 className="animate-spin text-primary-500" size={16} />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-neutral-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about safety, bookings..."
                className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YatraShayak;
