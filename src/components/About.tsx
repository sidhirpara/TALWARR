import React from 'react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';

const About = () => {
  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Mobile",
      value: "+91 9909166990",
      href: "tel:+919909166990"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "talwarperfume@gmail.com",
      href: "mailto:talwarperfume@gmail.com"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "Website",
      value: "talwarperfume.com",
      href: "https://talwarperfume.com"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Address",
      value: "F-16, Balaji Centre, Gurukul Road, Nilmani Society, Memnagar, Ahmedabad, Gujarat 380052",
      href: "https://maps.google.com/?q=F-16,+Balaji+Centre,+Gurukul+Road,+Nilmani+Society,+Memnagar,+Ahmedabad,+Gujarat+380052"
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-rose-50 to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-slate-800 mb-4">About Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            At TALWAR, we craft exceptional fragrances that capture the essence of luxury and sophistication. 
            Our commitment to quality and artistry has made us a trusted name in the world of perfumery.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-8">
              <h2 className="text-2xl font-serif text-slate-800 mb-6">Our Story</h2>
              <p className="text-slate-600 mb-4">
                Founded with a passion for creating unique and memorable fragrances, TALWAR has evolved into 
                a distinguished name in the perfume industry. Our journey is marked by an unwavering dedication 
                to craftsmanship and innovation.
              </p>
              <p className="text-slate-600">
                Each fragrance in our collection is carefully curated, combining traditional expertise with 
                contemporary sophistication to create scents that resonate with the modern individual.
              </p>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-serif text-slate-800 mb-6">Contact Us</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.href}
                    className="flex items-start gap-4 group hover:bg-slate-50 p-2 rounded-lg transition-colors duration-200"
                    target={info.label === "Address" || info.label === "Website" ? "_blank" : undefined}
                    rel={info.label === "Address" || info.label === "Website" ? "noopener noreferrer" : undefined}
                  >
                    <div className="text-slate-400 group-hover:text-slate-600 transition-colors duration-200 mt-1">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">{info.label}</p>
                      <p className="text-slate-700 group-hover:text-slate-900 transition-colors duration-200">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;