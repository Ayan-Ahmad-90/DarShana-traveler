import { Loader2, MessageCircle, Send, Shield, X } from 'lucide-react';
import { useState } from 'react';
import { yatraShayakApi } from '../services/api';
import { StyledCard } from './StyledCard';

interface YatraShayakProps {
  onSafetyClick?: () => void;
}

const YatraShayak = ({ onSafetyClick }: YatraShayakProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{ type: 'user' | 'bot'; text: string }[]>([
    { type: 'bot', text: 'Namaste! I am Sarthi. How can I help you?' },
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
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {!isOpen && (
        <div className="flex flex-col items-end animate-float">
          <StyledCard
            variant="glass"
            className="py-3 px-4 text-sm border-white/15 mb-3 shadow-lg backdrop-blur-xl"
          >
            <p className="font-semibold text-white">Need help? Ask Sarthi 👋</p>
            <p className="text-xs text-white/80">Routes, safety, bookings, culture</p>
          </StyledCard>

          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-amber-400 text-slate-900 p-4 rounded-full shadow-[0_12px_30px_-10px_rgba(255,140,0,0.8)] hover:translate-y-[-2px] transition-transform"
            aria-label="Open Yatra Sahayak"
            title="Sarthi AI"
          >
            <MessageCircle size={28} />
          </button>
        </div>
      )}

      {!isOpen && onSafetyClick && (
        <button
          onClick={onSafetyClick}
          className="bg-gradient-to-r from-red-500 to-rose-500 text-white p-4 rounded-full shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center group"
          title="Emergency Safety Dashboard"
        >
          <Shield className="w-6 h-6" />
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Safety SOS
          </span>
        </button>
      )}

      {isOpen && (
        <div className="bg-gradient-to-b from-[#0d141f] via-[#0f1c28] to-[#0d141f] p-[1px] rounded-3xl shadow-2xl w-80 sm:w-96 h-[520px] border border-white/10 mb-20 sm:mb-0">
          <div className="h-full bg-white/5 backdrop-blur-xl rounded-[28px] overflow-hidden flex flex-col border border-white/10">
            <div className="bg-gradient-to-r from-orange-500 to-amber-400 text-slate-900 p-4 flex justify-between items-center shadow-lg">
              <div className="font-semibold flex items-center gap-2">
                <span className="h-9 w-9 rounded-2xl bg-white text-orange-600 flex items-center justify-center shadow-sm">👨‍✈️</span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-900/80">Yatra Sahayak</p>
                  <p className="text-sm">Sarthi • Travel help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/30 p-1.5 rounded-lg"
                aria-label="Close Sarthi chat"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-white/90 bg-gradient-to-b from-white/5 via-white/0 to-white/5">
              {history.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm shadow ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-900 rounded-tr-none'
                        : 'bg-white/10 border border-white/15 text-white rounded-tl-none backdrop-blur'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/15 px-4 py-3 rounded-2xl rounded-tl-none shadow text-white flex items-center gap-2">
                    <Loader2 className="animate-spin text-amber-200" size={16} />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/10 border-t border-white/10">
              <div className="flex gap-2 bg-white/5 border border-white/15 rounded-2xl px-3 py-2 items-center focus-within:ring-2 focus-within:ring-orange-400/70 transition">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about safety, bookings..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-slate-900 font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Send message"
                  title="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YatraShayak;
