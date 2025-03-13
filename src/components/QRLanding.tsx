import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Instagram, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';

const QRLanding = () => {
  const [showSocial, setShowSocial] = useState(false);
  const currentURL = window.location.href;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSocial(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-6 h-6" />,
      url: 'https://wa.me/919909166990',
      color: 'hover:text-green-500'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      url: 'https://instagram.com/talwarperfume',
      color: 'hover:text-pink-500'
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-6 h-6" />,
      url: 'https://facebook.com/talwarperfume',
      color: 'hover:text-blue-600'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-6 h-6" />,
      url: 'https://twitter.com/talwarperfume',
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-6 h-6" />,
      url: 'https://linkedin.com/company/talwarperfume',
      color: 'hover:text-blue-700'
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-rose-50 to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-slate-800 dark:text-white mb-8">Connect With Us</h1>
          
          {/* QR Code Section */}
          <div className="relative inline-block">
            <a
              href={currentURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transform hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg">
                <QRCodeSVG
                  value={currentURL}
                  size={240}
                  level="H"
                  includeMargin={true}
                  className="rounded-xl dark:bg-white"
                />
              </div>
            </a>
          </div>
          
          <p className="mt-6 text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Scan the QR code to save our contact information or click on it to visit our digital business card.
          </p>
        </div>

        {/* Social Media Pop-up */}
        {showSocial && (
          <div className="fixed bottom-8 right-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 animate-slide-up z-50 max-w-sm w-full sm:w-auto">
            <button
              onClick={() => setShowSocial(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Close social media panel"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-serif text-slate-800 dark:text-white mb-4">Follow Us</h2>
            
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${social.color}`}
                  aria-label={`Visit our ${social.name} profile`}
                >
                  {social.icon}
                  <span className="text-xs mt-1 text-slate-600 dark:text-slate-400">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRLanding;