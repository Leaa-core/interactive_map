export type StateTheme = {
  state: string
  place: string
  localLabel: string
  artwork: string
  position: [number, number]
}

// Coordinates are hand-checked against the actual SVG state paths, not carried over
// from the former 3D scene. Small/overlapping UTs use a nearby labelled anchor.
export const stateThemes: StateTheme[] = [
  { state: 'Andaman and Nicobar Islands', place: 'Car Nicobar', localLabel: 'कार निकोबार', artwork: 'Nicobarese pandanus & wood craft', position: [522, 600] },
  { state: 'Andhra Pradesh', place: 'Machilipatnam', localLabel: 'మచిలీపట్నం', artwork: 'Kalamkari painted cotton', position: [292, 518] },
  { state: 'Arunachal Pradesh', place: 'Tawang', localLabel: 'तवांग', artwork: 'Monpa thangka painting', position: [556, 223] },
  { state: 'Assam', place: 'Majuli', localLabel: 'মাজুলী', artwork: 'Sattriya masks & manuscript painting', position: [505, 257] },
  { state: 'Bihar', place: 'Madhubani', localLabel: 'मधुबनी', artwork: 'Mithila painting', position: [381, 258] },
  { state: 'Chandigarh', place: 'Chandigarh', localLabel: 'ਚੰਡੀਗੜ੍ਹ', artwork: 'Nek Chand’s Rock Garden', position: [180, 156] },
  { state: 'Chhattisgarh', place: 'Kondagaon', localLabel: 'कोंडागांव', artwork: 'Bastar Dhokra metalwork', position: [293, 369] },
  { state: 'Dadra and Nagar Haveli', place: 'Silvassa', localLabel: 'सिलवासा', artwork: 'Warli wall painting', position: [103, 402] },
  { state: 'Daman and Diu', place: 'Daman', localLabel: 'દમણ', artwork: 'Coastal church art & tilework', position: [55, 387] },
  { state: 'Delhi', place: 'Delhi', localLabel: 'दिल्ली', artwork: 'Mughal album painting', position: [186, 210] },
  { state: 'Goa', place: 'Old Goa', localLabel: 'गोवा', artwork: 'Goan azulejo tile painting', position: [122, 511] },
  { state: 'Gujarat', place: 'Patan', localLabel: 'પાટણ', artwork: 'Patola double-ikat weaving', position: [85, 354] },
  { state: 'Haryana', place: 'Kurukshetra', localLabel: 'कुरुक्षेत्र', artwork: 'Phulkari embroidery', position: [164, 199] },
  { state: 'Himachal Pradesh', place: 'Kangra', localLabel: 'कांगड़ा', artwork: 'Kangra miniature painting', position: [188, 135] },
  { state: 'Jammu and Kashmir', place: 'Srinagar', localLabel: 'سِرینگر', artwork: 'Kashmir papier-mâché & manuscript art', position: [178, 74] },
  { state: 'Jharkhand', place: 'Hazaribagh', localLabel: 'हजारीबाग', artwork: 'Sohrai and Khovar painting', position: [368, 330] },
  { state: 'Karnataka', place: 'Mysuru', localLabel: 'ಮೈಸೂರು', artwork: 'Mysore painting', position: [169, 562] },
  { state: 'Kerala', place: 'Kochi', localLabel: 'കൊച്ചി', artwork: 'Kerala mural painting', position: [163, 625] },
  { state: 'Lakshadweep', place: 'Kavaratti', localLabel: 'കവരത്തി', artwork: 'Coconut coir craft', position: [99, 621] },
  { state: 'Madhya Pradesh', place: 'Bhimbetka', localLabel: 'भीमबेटका', artwork: 'Bhimbetka rock painting', position: [210, 355] },
  { state: 'Maharashtra', place: 'Ajanta', localLabel: 'अजिंठा', artwork: 'Ajanta cave murals', position: [187, 411] },
  { state: 'Manipur', place: 'Imphal', localLabel: 'ইম্ফল', artwork: 'Meitei textile & Kauna craft', position: [539, 301] },
  { state: 'Meghalaya', place: 'Shillong', localLabel: 'শিলং', artwork: 'Garo handwoven textiles', position: [481, 283] },
  { state: 'Mizoram', place: 'Aizawl', localLabel: 'Aizawl', artwork: 'Puan ceremonial weaving', position: [517, 335] },
  { state: 'Nagaland', place: 'Kohima', localLabel: 'Kohima', artwork: 'Naga shawl weaving & woodcarving', position: [546, 267] },
  { state: 'Odisha', place: 'Puri', localLabel: 'ପୁରୀ', artwork: 'Pattachitra painting', position: [357, 430] },
  { state: 'Punjab', place: 'Amritsar', localLabel: 'ਅੰਮ੍ਰਿਤਸਰ', artwork: 'Sikh manuscript art & phulkari', position: [136, 153] },
  { state: 'Rajasthan', place: 'Udaipur', localLabel: 'उदयपुर', artwork: 'Mewar miniature painting', position: [105, 303] },
  { state: 'Sikkim', place: 'Gangtok', localLabel: 'गंगटोक', artwork: 'Himalayan thangka painting', position: [425, 237] },
  { state: 'Tamil Nadu', place: 'Thanjavur', localLabel: 'தஞ்சாவூர்', artwork: 'Thanjavur gold-leaf painting', position: [220, 622] },
  { state: 'Telangana', place: 'Hyderabad', localLabel: 'హైదరాబాద్', artwork: 'Deccani miniature painting', position: [244, 457] },
  { state: 'Tripura', place: 'Agartala', localLabel: 'আগরতলা', artwork: 'Risa handwoven textile', position: [493, 327] },
  { state: 'Uttar Pradesh', place: 'Varanasi', localLabel: 'वाराणसी', artwork: 'Banarasi brocade and devotional print', position: [307, 286] },
  { state: 'Uttarakhand', place: 'Almora', localLabel: 'अल्मोड़ा', artwork: 'Aipan ritual floor art', position: [236, 177] },
  { state: 'West Bengal', place: 'Kolkata', localLabel: 'কলকাতা', artwork: 'Kalighat painting & Bengal School', position: [409, 356] },
]
