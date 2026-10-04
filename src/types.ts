export interface BrandInfo {
  name: string;
  fullName: string;
  branchName: string;
  slogan: string;
  logoPath: string;
  remoteLogo: string;
  hotline: string;
  advisor: {
    name: string;
    title: string;
    phone: string;
    phoneDisplay: string;
  };
}

export interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
}

export interface FaqStep {
  step: number;
  title: string;
  content: string;
  image: string;
  remoteImage: string;
}

export interface FaqTopic {
  id: string;
  title: string;
  summary: string;
  youtubeUrl: string;
  steps: FaqStep[];
}

export interface ProductItem {
  id: string;
  category: string;
  name: string;
  badge: string;
  summary: string;
  posterImage: string;
  remoteImage: string;
  highlights: string[];
}

export interface BranchItem {
  stt: number;
  name: string;
  room: string;
  address: string;
  image: string;
  remoteImage: string;
  mapUrl: string;
  phone: string;
  hotline: string;
  isHeadquarter: boolean;
}

export interface SavingsTerm {
  months: number;
  label: string;
  rate: number;
}

export interface LoanRepaymentRow {
  period: number;
  paymentDate: string;
  beginningBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
}

export interface VoucherRecord {
  id: string;
  code: string;
  game: 'flappy' | 'snake';
  reward: string;
  score: number;
  date: string;
}
