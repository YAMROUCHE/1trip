import { useState, useRef, useEffect } from 'react';

const API_URL = 'https://tripflow-api.youssef-amrouche.workers.dev';

export function ChatWidget({ destinations, onAddDestination, onRemoveDestination }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Bonjour ! Je suis votre assistant FatiFly.\n\nDites-moi ce que vous cherchez :\n🏖️ Plages\n🛕 Temples\n🌿 Nature\n👨‍👩‍👦 Activités enfants",
      destinations: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Vérifier si une destination est dans le voyage
  const isInTrip = (destId) => {
    return destinations?.some(d => d.id === destId);
  };

  // Toggle destination (ajouter ou supprimer)
  const toggleDestination = (dest) => {
    if (isInTrip(dest.id)) {
      onRemoveDestination(dest.id);
    } else {
      onAddDestination(dest.id);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, destinations: [] }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "❌ Erreur. Réessayez !",
          destinations: []
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response,
          destinations: data.destinations_mentioned || []
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "❌ Erreur de connexion.",
        destinations: []
      }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Formater le contenu
  const formatContent = (content, msgDestinations) => {
    let formatted = content;
    
    msgDestinations.forEach(dest => {
      const regex = new RegExp(`\\[${dest.id}\\]`, 'g');
      formatted = formatted.replace(regex, '');
    });

    formatted = formatted
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

    return formatted;
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';
    const formatted = formatContent(msg.content, msg.destinations);

    return (
      <div
        key={index}
        style={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginBottom: '12px'
        }}
      >
        <div
          style={{
            maxWidth: '85%',
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: isUser ? '#6366f1' : '#f3f4f6',
            color: isUser ? 'white' : '#111827',
            fontSize: '13px',
            lineHeight: '1.4'
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: formatted }} />

          {/* Boutons destinations */}
          {!isUser && msg.destinations.length > 0 && (
            <div style={{ 
              marginTop: '10px', 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px'
            }}>
              {msg.destinations.map(dest => {
                const inTrip = isInTrip(dest.id);
                return (
                  <button
                    key={dest.id}
                    onClick={() => toggleDestination(dest)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      backgroundColor: inTrip ? '#dcfce7' : '#f0fdf4',
                      color: inTrip ? '#166534' : '#166534',
                      border: inTrip ? '2px solid #22c55e' : '1px solid #bbf7d0',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: inTrip ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {inTrip ? '✓' : '+'} {dest.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          cursor: 'pointer',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'transform 0.2s'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: '360px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ 
            padding: '14px 16px', 
            backgroundColor: '#6366f1', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>Assistant FatiFly</div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                {destinations?.length || 0} destination(s) sélectionnée(s)
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ 
            flex: 1, 
            overflow: 'auto', 
            padding: '16px',
            backgroundColor: '#fafafa'
          }}>
            {messages.map((msg, index) => renderMessage(msg, index))}
            
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  fontSize: '13px'
                }}>
                  ✨ Je réfléchis...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ 
            padding: '12px', 
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  padding: '10px 16px',
                  backgroundColor: loading || !input.trim() ? '#e5e7eb' : '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '13px',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
