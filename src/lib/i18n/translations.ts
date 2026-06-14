export type Language = 'en' | 'hi' | 'hinglish';

type Translations = {
  [key in Language]: {
    nav: {
      home: string;
      squad: string;
      dashboard: string;
    };
    hero: {
      title: string;
      subtitle: string;
      ctaChat: string;
      ctaVolunteer: string;
    };
    squad: {
      title: string;
      subtitle: string;
    };
    stats: {
      peopleHelped: string;
      status: string;
    };
    chat: {
      placeholder: string;
      send: string;
    };
    onboarding: {
      title: string;
      nameLabel: string;
      emailLabel: string;
      skillsLabel: string;
      interestsLabel: string;
      submit: string;
    };
  };
};

export const t: Translations = {
  en: {
    nav: { home: "Home", squad: "Pankh Squad", dashboard: "Dashboard" },
    hero: {
      title: "Giving Wings to Underprivileged Communities",
      subtitle: "Join NayePankh Foundation in our mission to bring hope through food, education, and care.",
      ctaChat: "Talk to the Pankh Squad",
      ctaVolunteer: "Become a Volunteer"
    },
    squad: {
      title: "Meet the Pankh Squad",
      subtitle: "Our specialized AI agents are here to help you make an impact."
    },
    stats: {
      peopleHelped: "2,00,000+ People Helped",
      status: "80G & 12A Certified"
    },
    chat: {
      placeholder: "Type a message...",
      send: "Send"
    },
    onboarding: {
      title: "Join NayePankh as a Volunteer",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      skillsLabel: "Your Skills",
      interestsLabel: "Areas of Interest",
      submit: "Register"
    }
  },
  hi: {
    nav: { home: "होम", squad: "पंख स्क्वाड", dashboard: "डैशबोर्ड" },
    hero: {
      title: "वंचित समुदायों को नई उड़ान देना",
      subtitle: "भोजन, शिक्षा और देखभाल के माध्यम से आशा लाने के हमारे मिशन में नयेपंख फाउंडेशन से जुड़ें।",
      ctaChat: "पंख स्क्वाड से बात करें",
      ctaVolunteer: "स्वयंसेवक बनें"
    },
    squad: {
      title: "पंख स्क्वाड से मिलें",
      subtitle: "हमारे विशेष एआई एजेंट प्रभाव डालने में आपकी मदद करने के लिए यहाँ हैं।"
    },
    stats: {
      peopleHelped: "2,00,000+ लोगों की मदद की",
      status: "80G और 12A प्रमाणित"
    },
    chat: {
      placeholder: "एक संदेश टाइप करें...",
      send: "भेजें"
    },
    onboarding: {
      title: "नयेपंख में स्वयंसेवक के रूप में जुड़ें",
      nameLabel: "पूरा नाम",
      emailLabel: "ईमेल पता",
      skillsLabel: "आपके कौशल",
      interestsLabel: "रुचि के क्षेत्र",
      submit: "रजिस्टर करें"
    }
  },
  hinglish: {
    nav: { home: "Home", squad: "Pankh Squad", dashboard: "Dashboard" },
    hero: {
      title: "Giving Nai Udaan to Underprivileged Communities",
      subtitle: "Join NayePankh Foundation in our mission to bring hope through food, education, aur care.",
      ctaChat: "Talk to Pankh Squad",
      ctaVolunteer: "Volunteer Bano"
    },
    squad: {
      title: "Meet the Pankh Squad",
      subtitle: "Hamare specialized AI agents impact create karne mein aapki madad karenge."
    },
    stats: {
      peopleHelped: "2 Lakh+ People Helped",
      status: "80G & 12A Certified NGO"
    },
    chat: {
      placeholder: "Message likho...",
      send: "Bhejo"
    },
    onboarding: {
      title: "NayePankh as Volunteer Join Karein",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      skillsLabel: "Aapke Skills",
      interestsLabel: "Areas of Interest",
      submit: "Register Karo"
    }
  }
};
