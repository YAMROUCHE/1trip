import { useState, useRef, useEffect } from 'react';

const API_URL = 'https://tripflow-api.youssef-amrouche.workers.dev';

export function ChatBotView({ onAddDestination }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Bonjour ! Je suis votre assistant FatiFly.\n\nJe connais toutes les destinations d'Asie du Sud-Est pour votre voyage en famille.\n\n**Dites-moi ce que vous cherchez :**\n- 🏖️ Plages et détente\n- 🛕 Culture et temples\n- 🌿 Nature et aventure\n- 👨‍👩‍👦 Activités pour enfants",
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
          content: "❌ Désolé, une erreur s'est produite. Réessayez !",
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
        content: "❌ Erreur de connexion. Vérifiez votre internet.",
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

  const handleAddDestination = (dest) => {
    if (onAddDestination) {
      onAddDestination(dest.id);
    }
  };

  // Formater le contenu avec les IDs cliquables
  const formatContent = (content, destinations) => {
    let formatted = content;
    
    // Remplacer les [destination-id] par des boutons
    destinations.forEach(dest => {
      const regex = new RegExp(`\\[${dest.id}\\]`, 'g');
      formatted = formatted.replace(regex, `{{DEST:${dest.id}:${dest.name}}}`);
    });

    // Convertir le markdown basique
    formatted = formatted
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

    return formatted;
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';
    const formatted = formatContent(msg.content, msg.destinations);

    // Parser les destinations dans le texte
    const parts = formatted.split(/(\{\{DEST:[\w-]+:[^}]+\}\})/g);

    return (
      <div
        key={index}
        style={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginBottom: '16px'
        }}
      >
        <div
          style={{
            maxWidth: '80%',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: isUser ? '#6366f1' : 'white',
            color: isUser ? 'white' : '#111827',
            border: isUser ? 'none' : '1px solid #e5e7eb',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          {parts.map((part, i) => {
            const match = part.match(/\{\{DEST:([\w-]+):([^}]+)\}\}/);
            if (match) {
              const [, destId, destName] = match;
              return (
                <button
                  key={i}
                  onClick={() => handleAddDestination({ id: destId, name: destName })}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    margin: '0 2px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                  title={`Ajouter ${destName} au voyage`}
                >
                  + {destName}
                </button>
              );
            }
            return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
          })}

          {/* Boutons d'ajout sous le message */}
          {!isUser && msg.destinations.length > 0 && (
            <div style={{ 
              marginTop: '12px', 
              paddingTop: '12px', 
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span style={{ fontSize: '12px', color: '#6b7280', width: '100%' }}>
                Ajouter à mon voyage :
              </span>
              {msg.destinations.map(dest => (
                <button
                  key={dest.id}
                  onClick={() => handleAddDestination(dest)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    backgroundColor: '#f0fdf4',
                    color: '#166534',
                    border: '1px solid #bbf7d0',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  + {dest.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f9fafb'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px 24px', 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#6366f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          🤖
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>
            Assistant FatiFly
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
            Je vous aide à découvrir l'Asie du Sud-Est
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        padding: '24px',
      }}>
        {messages.map((msg, index) => renderMessage(msg, index))}
        
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              color: '#6b7280'
            }}>
              <span style={{ animation: 'pulse 1.5s infinite' }}>✨ Je réfléchis...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ 
        padding: '16px 24px', 
        backgroundColor: 'white', 
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question... (ex: plages familiales, temples à visiter...)"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 24px',
              backgroundColor: loading || !input.trim() ? '#d1d5db' : '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBotView;
