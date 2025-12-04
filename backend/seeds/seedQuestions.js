import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';

dotenv.config();

const questionsData = [
  // Itinerary Questions
  {
    category: 'itinerary',
    categoryLabel: 'Yatrika (Itinerary)',
    question: 'Plan a 7-day North India itinerary starting from Delhi',
    questionHi: 'दिल्ली से शुरू करते हुए 7 दिन की उत्तर भारत की यात्रा योजना बनाएं',
    answer: 'Day 1: Delhi - Visit Red Fort, India Gate, Raj Ghat. Day 2-3: Agra - Taj Mahal, Agra Fort. Day 4-5: Jaipur - City Palace, Jantar Mantar, Hawa Mahal. Day 6-7: Back to Delhi with optional Mathura/Vrindavan visit.',
    answerHi: 'दिन 1: दिल्ली - लाल किला, इंडिया गेट, राज घाट। दिन 2-3: आगरा - ताज महल, आगरा किला। दिन 4-5: जयपुर - सिटी पैलेस, जंतर मंतर, हवा महल। दिन 6-7: दिल्ली वापसी अनिवार्य मथुरा/वृंदावन भ्रमण के साथ।',
    tags: ['north-india', '7-days', 'budget', 'cultural']
  },
  {
    category: 'itinerary',
    categoryLabel: 'Yatrika (Itinerary)',
    question: 'Best South India tour route covering Kerala, Tamil Nadu, and Goa',
    questionHi: 'केरल, तमिलनाडु और गोवा को कवर करने वाली दक्षिण भारत की सर्वोत्तम यात्रा मार्ग',
    answer: 'Start in Kerala (Kochi, Munnar, Backwaters), move to Tamil Nadu (Madurai, Ooty, Coonoor), end in Goa (beaches, Portuguese architecture). 10-12 days recommended.',
    answerHi: 'केरल (कोच्चि, मुन्नार, बैकवाटर्स) से शुरू करें, तमिलनाडु (मदुरै, ऊटी, कूनूर) में जाएं, गोवा (समुद्र तट, पुर्तगाली वास्तुकला) में समाप्त करें। 10-12 दिन अनुशंसित।',
    tags: ['south-india', 'beaches', 'culture', 'nature']
  },
  {
    category: 'itinerary',
    categoryLabel: 'Yatrika (Itinerary)',
    question: 'How many days should I spend in each destination?',
    questionHi: 'प्रत्येक गंतव्य पर कितने दिन बिताने चाहिए?',
    answer: 'Major cities (Delhi, Mumbai, Bangalore): 2-3 days. Heritage sites (Agra, Varanasi): 2 days. Hill stations: 2-3 days. Beaches (Goa, Kerala): 3-4 days. Remote areas: 1-2 days.',
    answerHi: 'बड़े शहर (दिल्ली, मुंबई, बेंगलुरु): 2-3 दिन। विरासत स्थल (आगरा, वाराणसी): 2 दिन। पहाड़ी स्टेशन: 2-3 दिन। समुद्र तट (गोवा, केरल): 3-4 दिन। दूरस्थ क्षेत्र: 1-2 दिन।',
    tags: ['planning', 'duration', 'optimization']
  },
  {
    category: 'itinerary',
    categoryLabel: 'Yatrika (Itinerary)',
    question: 'Best time to visit Rajasthan?',
    questionHi: 'राजस्थान घूमने का सर्वोत्तम समय कौन सा है?',
    answer: 'October to March is the best time. Avoid May-September due to extreme heat. Winter (December-January) is ideal for comfort. Holi festival season (March) offers vibrant experiences.',
    answerHi: 'अक्टूबर से मार्च सबसे अच्छा समय है। मई-सितंबर से बचें क्योंकि गर्मी तीव्र होती है। सर्दी (दिसंबर-जनवरी) आराम के लिए आदर्श है। होली त्यौहार का मौसम (मार्च) जीवंत अनुभव प्रदान करता है।',
    tags: ['best-time', 'weather', 'rajasthan', 'festivals']
  },
  {
    category: 'itinerary',
    categoryLabel: 'Yatrika (Itinerary)',
    question: 'Budget itinerary for a 5-day trip to India',
    questionHi: 'भारत के 5 दिन की यात्रा के लिए बजट यात्रा योजना',
    answer: 'Budget: $500-800 per person. Stay in hostels/budget hotels ($10-20/night). Eat street food ($1-3 per meal). Use trains ($20-50 per journey). Visit free/cheap attractions (parks, temples).',
    answerHi: 'बजट: प्रति व्यक्ति $500-800। हॉस्टल/बजट होटल में रहें ($10-20/रात)। स्ट्रीट फूड खाएं ($1-3 प्रति भोजन)। ट्रेन का उपयोग करें ($20-50 प्रति यात्रा)। मुफ्त/सस्ते आकर्षण (पार्क, मंदिर) देखें।',
    tags: ['budget', 'economy', 'planning', '5-days']
  },

  // Safety Questions
  {
    category: 'safety',
    categoryLabel: 'Safety & Security',
    question: 'Safety tips for solo travelers in India',
    questionHi: 'भारत में एकल यात्रियों के लिए सुरक्षा सुझाव',
    answer: 'Share your itinerary with friends/family. Avoid traveling alone at night. Use registered taxis/Uber. Keep valuables secure. Stay in reputable hotels. Trust your instincts. Keep important documents copies.',
    answerHi: 'अपनी यात्रा कार्यक्रम दोस्तों/परिवार के साथ साझा करें। रात में अकेले यात्रा न करें। पंजीकृत टैक्सी/उबर का उपयोग करें। कीमती सामान सुरक्षित रखें। प्रतिष्ठित होटलों में रहें। अपनी प्रवृत्ति पर विश्वास करें। महत्वपूर्ण दस्तावेजों की प्रतियां रखें।',
    tags: ['safety', 'solo-travel', 'precautions']
  },
  {
    category: 'safety',
    categoryLabel: 'Safety & Security',
    question: 'Is it safe to travel at night in Indian cities?',
    questionHi: 'भारतीय शहरों में रात को यात्रा करना सुरक्षित है?',
    answer: 'Generally not recommended for solo travelers. Use pre-booked taxis/Uber. Avoid empty roads. Major cities are relatively safer. Women should take extra precautions. Travel in groups when possible.',
    answerHi: 'एकल यात्रियों के लिए आम तौर पर अनुशंसित नहीं। पहले से बुक की गई टैक्सी/उबर का उपयोग करें। खाली सड़कों से बचें। बड़े शहर अपेक्षाकृत सुरक्षित हैं। महिलाओं को अतिरिक्त सावधानी बरतनी चाहिए। जब संभव हो समूह में यात्रा करें।',
    tags: ['safety', 'night-travel', 'security']
  },
  {
    category: 'safety',
    categoryLabel: 'Safety & Security',
    question: 'Areas to avoid in major Indian cities',
    questionHi: 'भारतीय शहरों में किन क्षेत्रों से बचना चाहिए?',
    answer: 'Avoid isolated areas, red-light districts, and poorly lit neighborhoods. Be cautious near railway stations, bus terminals at night. Avoid flaunting expensive items. Stick to tourist areas after dark.',
    answerHi: 'अलग-थलग क्षेत्रों, रेड-लाइट जिलों और खराब रोशनी वाले पड़ोस से बचें। रेलवे स्टेशन के पास सावधान रहें, रात में बस टर्मिनल। महंगी वस्तुओं को प्रदर्शित करने से बचें। रात के बाद पर्यटक क्षेत्रों में रहें।',
    tags: ['safety', 'areas', 'crime-prevention']
  },
  {
    category: 'safety',
    categoryLabel: 'Safety & Security',
    question: 'How to stay safe while using public transport?',
    questionHi: 'सार्वजनिक परिवहन का उपयोग करते समय सुरक्षित कैसे रहें?',
    answer: 'Use AC buses for long journeys. Avoid crowded routes late at night. Keep bags secure and close. Don\'t accept food/drinks from strangers. Sit near the driver or conductor. Trust your instincts.',
    answerHi: 'लंबी यात्रा के लिए AC बस का उपयोग करें। रात में भीड़ भरे रास्तों से बचें। बैग को सुरक्षित और करीब रखें। अजनबियों से खाना/पेय न लें। ड्राइवर या कंडक्टर के पास बैठें। अपनी प्रवृत्ति पर विश्वास करें।',
    tags: ['public-transport', 'safety', 'buses', 'trains']
  },
  {
    category: 'safety',
    categoryLabel: 'Safety & Security',
    question: 'Emergency precautions and health tips',
    questionHi: 'आपातकालीन सावधानियां और स्वास्थ्य सुझाव',
    answer: 'Carry travel insurance. Keep medications in original bottles. Drink only bottled water. Get vaccinated before travel. Have emergency contacts. Visit medical clinics if needed. Avoid street food if sensitive.',
    answerHi: 'यात्रा बीमा ले जाएं। दवाएं मूल बोतलों में रखें। केवल बोतलबंद पानी पिएं। यात्रा से पहले टीका लगवाएं। आपातकालीन संपर्क रखें। आवश्यक होने पर चिकित्सा क्लीनिकों का दौरा करें। संवेदनशील होने पर स्ट्रीट फूड से बचें।',
    tags: ['health', 'emergency', 'precautions', 'medical']
  },

  // Emergency Questions
  {
    category: 'emergency',
    categoryLabel: 'Emergency Numbers',
    question: 'Emergency numbers in India',
    questionHi: 'भारत में आपातकालीन नंबर',
    answer: 'Police: 100, Ambulance: 102, Fire: 101, Tourist Helpline: 1363 (Delhi). Traffic Police: 103. Woman helpline: 181. All from any phone, even without balance.',
    answerHi: 'पुलिस: 100, एम्बुलेंस: 102, अग्निशमन: 101, पर्यटक हेल्पलाइन: 1363 (दिल्ली)। ट्रैफिक पुलिस: 103। महिला हेल्पलाइन: 181। किसी भी फोन से, यहां तक कि संतुलन के बिना।',
    tags: ['emergency', 'helpline', 'numbers', 'critical']
  },
  {
    category: 'emergency',
    categoryLabel: 'Emergency Numbers',
    question: 'How to contact the police in India',
    questionHi: 'भारत में पुलिस से संपर्क कैसे करें?',
    answer: 'Dial 100 for police emergency. Go to nearest police station if not urgent. File FIR for theft/crime. Contact tourist police if tourist-related issue. Keep a copy of FIR number.',
    answerHi: '100 डायल करें पुलिस आपातकाल के लिए। आपातकालीन नहीं होने तो निकटतम थाने जाएं। चोरी/अपराध के लिए FIR दर्ज करें। यदि पर्यटक से संबंधित समस्या हो तो पर्यटन पुलिस से संपर्क करें। FIR नंबर की प्रति रखें।',
    tags: ['police', 'emergency', 'fir', 'contact']
  },
  {
    category: 'emergency',
    categoryLabel: 'Emergency Numbers',
    question: 'Emergency medical services and hospitals',
    questionHi: 'आपातकालीन चिकित्सा सेवा और अस्पताल',
    answer: 'Dial 102 for ambulance. Major hospitals: Apollo, Fortis, Max, AIIMS. Private hospitals are better for tourists. Travel insurance covers hospital bills. Always keep insurance documents.',
    answerHi: 'एम्बुलेंस के लिए 102 डायल करें। प्रमुख अस्पताल: अपोलो, फोर्टिस, मैक्स, AIIMS। निजी अस्पताल पर्यटकों के लिए बेहतर हैं। यात्रा बीमा अस्पताल के बिल को कवर करता है। हमेशा बीमा दस्तावेज रखें।',
    tags: ['medical', 'hospitals', 'emergency', 'ambulance']
  },
  {
    category: 'emergency',
    categoryLabel: 'Emergency Numbers',
    question: 'Tourist helpline numbers by state',
    questionHi: 'राज्य द्वारा पर्यटक हेल्पलाइन नंबर',
    answer: 'Delhi: 1363, Mumbai: 1364, Goa: 1-800-223-3737, Rajasthan: 1-414-233-0100. Check local tourist offices for current numbers.',
    answerHi: 'दिल्ली: 1363, मुंबई: 1364, गोवा: 1-800-223-3737, राजस्थान: 1-414-233-0100। वर्तमान नंबर के लिए स्थानीय पर्यटन कार्यालय से संपर्क करें।',
    tags: ['helpline', 'tourist', 'state', 'contact']
  },
  {
    category: 'emergency',
    categoryLabel: 'Emergency Numbers',
    question: 'How to report a crime or incident',
    questionHi: 'अपराध या घटना की रिपोर्ट कैसे करें?',
    answer: 'Call police (100), visit nearest station, file FIR. Get written copy. Contact embassy if foreigner. Keep all evidence/documentation. Report to tourist police if needed.',
    answerHi: 'पुलिस को कॉल करें (100), निकटतम थाने जाएं, FIR दर्ज करें। लिखित प्रति प्राप्त करें। यदि विदेशी हो तो दूतावास से संपर्क करें। सभी साक्ष्य/दस्तावेज रखें। आवश्यक हो तो पर्यटन पुलिस को रिपोर्ट करें।',
    tags: ['crime', 'report', 'fir', 'police']
  },

  // Culture & Language Questions
  {
    category: 'culture',
    categoryLabel: 'Culture & Language',
    question: 'Essential Hindi phrases for travelers',
    questionHi: 'यात्रियों के लिए आवश्यक हिंदी वाक्यांश',
    answer: 'Namaste (hello), Shukriya (thank you), Haan (yes), Nahi (no), Kitna kharcha (how much), Bathroom kahan hai (where is bathroom), Madad karo (help), Bahut pyara (very nice).',
    answerHi: 'नमस्ते (नमस्कार), शुक्रिया (धन्यवाद), हाँ (हां), नहीं (नहीं), कितना खर्चा (कितना), बाथरूम कहाँ है (कहाँ), मदद करो (मदद), बहुत प्यारा (बहुत अच्छा)।',
    tags: ['hindi', 'language', 'phrases', 'communication']
  },
  {
    category: 'culture',
    categoryLabel: 'Culture & Language',
    question: 'Major festivals and celebrations in India',
    questionHi: 'भारत में प्रमुख त्यौहार और समारोह',
    answer: 'Diwali (lights), Holi (colors), Eid (Muslims), Christmas, Navratri (9 nights), Durga Puja, Onam (Kerala). Best experienced with locals. Book accommodations in advance.',
    answerHi: 'दिवाली (रोशनी), होली (रंग), ईद (मुस्लिम), क्रिसमस, नवरात्रि (9 रातें), दुर्गा पूजा, ओणम (केरल)। स्थानीय लोगों के साथ सबसे अच्छे से अनुभव किया जाता है। आवास पहले से बुक करें।',
    tags: ['festivals', 'culture', 'celebrations', 'traditions']
  },
  {
    category: 'culture',
    categoryLabel: 'Culture & Language',
    question: 'Indian dining etiquette and customs',
    questionHi: 'भारतीय भोजन शिष्टाचार और रीति-रिवाज',
    answer: 'Eat with right hand. Remove shoes before entering home. Say "thank you" to host. Try all dishes. Don\'t refuse food. Accept tea/water as courtesy. Compliment the cook.',
    answerHi: 'दाहिने हाथ से खाएं। घर में प्रवेश से पहले जूते उतारें। मेजबान को "धन्यवाद" कहें। सभी व्यंजन आजमाएं। खाना न देने से इनकार न करें। चाय/पानी स्वीकार करें। रसोइये की तारीफ करें।',
    tags: ['etiquette', 'dining', 'customs', 'culture']
  },
  {
    category: 'culture',
    categoryLabel: 'Culture & Language',
    question: 'Important religious sites and their significance',
    questionHi: 'महत्वपूर्ण धार्मिक स्थल और उनका महत्व',
    answer: 'Varanasi: Hindu pilgrimage, Ganges rituals. Taj Mahal: Islamic architecture. Ajanta/Ellora: Buddhist caves. Bodhgaya: Buddhist center. Amritsar: Sikh shrine. Respect customs, remove shoes, dress modestly.',
    answerHi: 'वाराणसी: हिंदू तीर्थ, गंगा के अनुष्ठान। ताज महल: इस्लामिक वास्तुकला। अजंता/एलोरा: बौद्ध गुफाएं। बोधगया: बौद्ध केंद्र। अमृतसर: सिख मंदिर। रीति-रिवाजों का सम्मान करें, जूते उतारें, विनम्रता से पहनें।',
    tags: ['religion', 'sacred-sites', 'spirituality', 'temples']
  },
  {
    category: 'culture',
    categoryLabel: 'Culture & Language',
    question: 'Regional Indian cuisines and specialties',
    questionHi: 'क्षेत्रीय भारतीय व्यंजन और विशेषताएं',
    answer: 'North: Butter chicken, Tandoori, Samosas. South: Dosa, Idli, Sambar. West: Dhokla, Thepla. East: Hilsa fish, Rasgulla. Street food: Chaat, Pakoras. Try local restaurants.',
    answerHi: 'उत्तर: मक्खन चिकन, तंदूरी, समोसे। दक्षिण: डोसा, इडली, सांभार। पश्चिम: ढोकला, थेपला। पूर्व: हिलसा मछली, रसगुल्ले। स्ट्रीट फूड: चाट, पकौड़े। स्थानीय रेस्तरां में जाएं।',
    tags: ['cuisine', 'food', 'regional', 'specialties']
  },

  // Experience Questions
  {
    category: 'experience',
    categoryLabel: 'Experiences & Activities',
    question: 'Best adventure activities in India',
    questionHi: 'भारत में सर्वोत्तम रोमांच गतिविधियां',
    answer: 'Paragliding (Himachal), Rafting (Rishikesh), Trekking (Himalayas), Diving (Andaman), Rock climbing, Zip-lining, Skiing in winter. Book with certified operators.',
    answerHi: 'पैराग्लाइडिंग (हिमाचल), राफ्टिंग (ऋषिकेश), ट्रेकिंग (हिमालय), गोताखोरी (अंडमान), रॉक क्लाइंबिंग, ज़िप-लाइनिंग, सर्दियों में स्कीइंग। प्रमाणित ऑपरेटरों के साथ बुक करें।',
    tags: ['adventure', 'activities', 'sports', 'adrenaline']
  },
  {
    category: 'experience',
    categoryLabel: 'Experiences & Activities',
    question: 'Top 10 must-visit destinations in India',
    questionHi: 'भारत में देखने के लिए शीर्ष 10 गंतव्य',
    answer: '1. Taj Mahal, 2. Kerala Backwaters, 3. Goa beaches, 4. Jaipur City Palace, 5. Varanasi ghats, 6. Himalayas, 7. Udaipur lakes, 8. Hampi ruins, 9. Munnar tea gardens, 10. Andaman Islands.',
    answerHi: '1. ताज महल, 2. केरल बैकवाटर्स, 3. गोवा समुद्र तट, 4. जयपुर सिटी पैलेस, 5. वाराणसी घाट, 6. हिमालय, 7. उदयपुर झीलें, 8. हम्पी खंडहर, 9. मुन्नार चाय बागान, 10. अंडमान द्वीप।',
    tags: ['destinations', 'must-visit', 'landmarks', 'tourism']
  },
  {
    category: 'experience',
    categoryLabel: 'Experiences & Activities',
    question: 'Best trekking routes in the Himalayas',
    questionHi: 'हिमालय में सर्वोत्तम ट्रेकिंग मार्ग',
    answer: 'Kedarkantha (5 days), Chopta (3 days), Triund (6-7 hours), Pangarchulla (4 days), Valley of Flowers (5-6 days). Best season: May-June and September-October.',
    answerHi: 'केदारकांठा (5 दिन), चोप्ता (3 दिन), ट्रिंड (6-7 घंटे), पांगरचुल्ला (4 दिन), फूलों की घाटी (5-6 दिन)। सर्वोत्तम मौसम: मई-जून और सितंबर-अक्टूबर।',
    tags: ['trekking', 'hiking', 'mountains', 'adventure']
  },
  {
    category: 'experience',
    categoryLabel: 'Experiences & Activities',
    question: 'Water sports and beach activities',
    questionHi: 'जल क्रीड़ा और समुद्र तट गतिविधियां',
    answer: 'Surfing (Goa), Scuba diving (Andaman), Snorkeling (Maldives islands), Jet skiing, Parasailing, Kayaking, Swimming. Wear life jackets. Use certified instructors.',
    answerHi: 'सर्फिंग (गोवा), स्कूबा डाइविंग (अंडमान), स्नॉर्कलिंग (मालदीव द्वीप), जेट स्की, पैरासेलिंग, कयाकिंग, तैराकी। लाइफ जैकेट पहनें। प्रमाणित प्रशिक्षकों का उपयोग करें।',
    tags: ['water-sports', 'beach', 'swimming', 'recreation']
  },
  {
    category: 'experience',
    categoryLabel: 'Experiences & Activities',
    question: 'Cultural experiences and homestays',
    questionHi: 'सांस्कृतिक अनुभव और होमस्टे',
    answer: 'Stay with local families in homestays (Airbnb, platforms). Learn cooking, local crafts, farming. Participate in festivals. Visit artisan workshops. Best cultural immersion. Much cheaper than hotels.',
    answerHi: 'होमस्टे में स्थानीय परिवारों के साथ रहें (Airbnb, प्लेटफॉर्म)। खाना पकाना, स्थानीय शिल्प, खेती सीखें। त्योहारों में भाग लें। कारीगर कार्यशाला देखें। सर्वोत्तम सांस्कृतिक विसर्जन। होटलों से बहुत सस्ता।',
    tags: ['culture', 'homestay', 'immersion', 'local-experience']
  }
];

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/darshana-travel';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    // Insert new data
    const result = await Question.insertMany(questionsData);
    console.log(`✅ Seeded ${result.length} questions`);

    console.log(`
╔════════════════════════════════════════╗
║  ✅ DATABASE SEEDING COMPLETE!         ║
║  Total Questions: ${result.length}                    
║  Categories: 6                         
║  Languages: English + Hindi            
╚════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
