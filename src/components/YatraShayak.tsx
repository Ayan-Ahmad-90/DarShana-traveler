import { useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { yatraShayakApi } from '../services/api';

const YatraShayak = () => {
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
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition transform hover:scale-110"
          aria-label="Open AI Assistant"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="bg-neutral-50 rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col h-[500px] border border-neutral-200">
          <div className="bg-primary-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="font-bold flex items-center gap-2">
              <span>🤖</span> Yatra Shayak
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
