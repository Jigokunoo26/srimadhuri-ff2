import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const { storeInfo } = useStore();
  const phone = storeInfo?.whatsapp_number || '918985291053';
  const text = encodeURIComponent('Hi Sri Madhuri, I would like to enquire about an appointment.');

  return (
    <a
      href={`https://wa.me/${phone}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-floating"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
};

export default WhatsAppButton;
