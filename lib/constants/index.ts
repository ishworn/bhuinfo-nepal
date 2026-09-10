// BhuInfo Nepal — Application Constants

export const PROVINCES = [
  'Koshi',
  'Madhesh',
  'Bagmati',
  'Gandaki',
  'Lumbini',
  'Karnali',
  'Sudurpashchim',
] as const;

export const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  Bagmati: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kavrepalanchok', 'Sindhupalchok', 'Nuwakot', 'Rasuwa', 'Dhading', 'Makwanpur', 'Chitwan', 'Ramechhap', 'Sindhuli', 'Dolakha'],
  Koshi: ['Sunsari', 'Morang', 'Jhapa', 'Ilam', 'Dhankuta', 'Bhojpur', 'Solukhumbu', 'Okhaldhunga', 'Khotang', 'Udayapur', 'Taplejung', 'Sankhuwasabha', 'Tehrathum'],
  Madhesh: ['Sarlahi', 'Mahottari', 'Dhanusha', 'Siraha', 'Saptari', 'Parsa', 'Bara', 'Rautahat'],
  Gandaki: ['Kaski', 'Syangja', 'Tanahun', 'Lamjung', 'Gorkha', 'Manang', 'Mustang', 'Myagdi', 'Parbat', 'Baglung', 'Nawalpur', 'Nawalparasi'],
  Lumbini: ['Rupandehi', 'Kapilvastu', 'Nawalparasi', 'Arghakhanchi', 'Gulmi', 'Palpa', 'Pyuthan', 'Rolpa', 'Rukum East', 'Dang', 'Bardiya', 'Banke'],
  Karnali: ['Surkhet', 'Dailekh', 'Jajarkot', 'Rukum West', 'Salyan', 'Dolpa', 'Humla', 'Jumla', 'Kalikot', 'Mugu'],
  Sudurpashchim: ['Kanchanpur', 'Kailali', 'Doti', 'Achham', 'Bajura', 'Bajhang', 'Darchula', 'Baitadi', 'Dadeldhura'],
};

export const MUNICIPALITIES_BY_DISTRICT: Record<string, string[]> = {
  Kathmandu: ['Kathmandu Metropolitan', 'Kirtipur', 'Chandragiri', 'Dakshinkali', 'Gokarneshwar', 'Kageshwori Manohara', 'Nagarjun', 'Shankharapur', 'Tarakeshwar', 'Tokha', 'Budhanilkantha'],
  Lalitpur: ['Lalitpur Metropolitan', 'Godawari', 'Mahalaxmi', 'Konjyosom', 'Bagmati'],
  Bhaktapur: ['Bhaktapur', 'Changunarayan', 'Madhyapur Thimi', 'Suryabinayak'],
  Kavrepalanchok: ['Banepa', 'Dhulikhel', 'Panauti', 'Panchkhal', 'Namobuddha', 'Mandanpur', 'Khanikhola', 'Temal', 'Bethanchok', 'Bhumlu', 'Chaurideurali', 'Mandandeupur'],
  Kaski: ['Pokhara Metropolitan', 'Machhapuchchhre', 'Annapurna', 'Madi'],
  Sunsari: ['Dharan', 'Itahari', 'Inaruwa', 'Barahkshetra', 'Koshi', 'Harinagar', 'Ramdhuni', 'Bhokraha Narsingh'],
  Morang: ['Biratnagar Metropolitan', 'Urlabari', 'Pathri Sankharasabha', 'Belbari', 'Letang Bhogateni', 'Ratuwamai', 'Sunbarshi', 'Budhiganga', 'Dhanpalthan', 'Gramthan', 'Jahada', 'Kanepokhari', 'Kerabari', 'Miklajung', 'Patahrishanishchare', 'Rangeli', 'Sunawarshi', 'Sundarharaicha'],
  Rupandehi: ['Butwal', 'Tilottama', 'Lumbini Sanskritik', 'Devdaha', 'Sainamaina', 'Marchawari', 'Mayadevi', 'Omsatiya', 'Rohini', 'Sammarimai', 'Kotahimai', 'Siyari', 'Sudhdhodhan', 'Banganga'],
  Chitwan: ['Bharatpur Metropolitan', 'Ratnanagar', 'Khairahani', 'Madi', 'Rapti'],
  Surkhet: ['Birendranagar', 'Panchapuri', 'Bheriganga', 'Chaukune', 'Gurbhakot', 'Lekbeshi', 'Simta'],
  Kailali: ['Dhangadhi', 'Tikapur', 'Ghodaghodi', 'Bhajani', 'Bardagoriya', 'Chure', 'Joshipur', 'Kailari', 'Mohanyal', 'Munuwar'],
};

export const LAND_USE_OPTIONS = ['Residential', 'Agricultural', 'Commercial', 'Industrial', 'Mixed', 'Forest', 'Riverbed', 'Public', 'Unknown'] as const;
export const OWNERSHIP_OPTIONS = ['Private', 'Guthi', 'Government', 'Institutional', 'Organization', 'Unknown'] as const;
export const FLOOD_RISK_OPTIONS = ['None', 'Low', 'Moderate', 'High', 'Very High'] as const;
export const ROAD_TYPE_OPTIONS = ['None', 'Trail', 'Gravel', 'Blacktopped', 'Highway'] as const;
export const AVAILABILITY_OPTIONS = ['For Sale', 'For Lease', 'Not Listed', 'Under Negotiation'] as const;

export const DATA_STATUS_CONFIG = {
  Sample: { label: 'Sample Data', color: 'yellow', icon: '🟡', description: 'Fictional/dummy data for demonstration purposes.' },
  Estimated: { label: 'Estimated', color: 'blue', icon: '🔵', description: 'Calculated using rule-based estimation engine.' },
  'Needs Verification': { label: 'Needs Verification', color: 'orange', icon: '🟠', description: 'Requires official or legal confirmation.' },
  Verified: { label: 'Verified', color: 'green', icon: '🟢', description: 'Confirmed by authorized sources.' },
} as const;

export const OWNERSHIP_WARNINGS: Record<string, { show: boolean; message: string; financingNote: string }> = {
  Guthi: {
    show: true,
    message: 'Guthi land requires legal verification of ownership and transfer conditions before any transaction. Consult appropriate legal and institutional sources.',
    financingNote: 'Bank financing may have restrictions for Guthi-owned land.',
  },
  Government: {
    show: true,
    message: 'Government-owned land requires verification of allocation, lease, or transfer status with the relevant government authority.',
    financingNote: 'Financing options may be limited for government land.',
  },
  Institutional: {
    show: true,
    message: 'Institutional land ownership and transfer conditions must be verified with the relevant institution before any transaction.',
    financingNote: 'Verify financing eligibility with your bank or financial institution.',
  },
  Organization: {
    show: true,
    message: 'Organization-owned land requires verification of authorization for any transfer or lease with the relevant organization.',
    financingNote: 'Check with your lender about financing options for organization-owned land.',
  },
  Unknown: {
    show: true,
    message: 'Ownership category is unknown or unverified. Exercise extreme caution. Full legal due diligence is strongly recommended before any transaction.',
    financingNote: 'Financing is unlikely to be available for land with unknown ownership.',
  },
  Private: {
    show: false,
    message: '',
    financingNote: '',
  },
};

export const NEPAL_CENTER: [number, number] = [28.3949, 84.124];
export const NEPAL_BOUNDS: [[number, number], [number, number]] = [[26.347, 80.058], [30.447, 88.201]];

// Nepal land unit conversions
export const AREA_CONVERSIONS = {
  // 1 Ropani = 16 Aana = 64 Paisa = 256 Daam
  // 1 Aana = 342.25 sq ft
  ropaniToAana: 16,
  ropaniToPaisa: 64,
  ropaniToDaam: 256,
  ropaniToSqft: 5476,
  ropaniToSqm: 508.72,
  ropaniToHectare: 0.050872,
  ropaniToAcre: 0.125702,
  aanaToSqft: 342.25,
  aanaToSqm: 31.795,
  // Bigha system (Terai)
  bighaToKattha: 20,
  bighaToSqft: 72900,
  bighaToSqm: 6772.63,
  katthaToSqft: 3645,
  katthaToSqm: 338.63,
} as const;
