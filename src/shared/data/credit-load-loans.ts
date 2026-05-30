export type CreditLoadLoanDetail = {
  id: string;
  title: string;
  bankLogo: string;
  bankLogoWidth: number;
  bankLogoHeight: number;
  paidPercent: number;
  monthlyPayment: number;
  remainingBalance: number;
  annualRate: string;
  remainingDuration: string;
};

export const creditLoadLoanDetails: Record<string, CreditLoadLoanDetail> = {
  mortgage: {
    id: "mortgage",
    title: "Ипотека",
    bankLogo: "/credit-load/sberbank-logo.png",
    bankLogoWidth: 180,
    bankLogoHeight: 28,
    paidPercent: 29,
    monthlyPayment: 60100,
    remainingBalance: 3200000,
    annualRate: "8,5%",
    remainingDuration: "5 лет и 7 месяцев",
  },
  consumer: {
    id: "consumer",
    title: "Потребительский кредит",
    bankLogo: "/credit-load/tbank.png",
    bankLogoWidth: 120,
    bankLogoHeight: 28,
    paidPercent: 47,
    monthlyPayment: 18200,
    remainingBalance: 640000,
    annualRate: "8,5%",
    remainingDuration: "2 года и 4 месяца",
  },
  auto: {
    id: "auto",
    title: "Автокредит",
    bankLogo: "/credit-load/alfa.png",
    bankLogoWidth: 120,
    bankLogoHeight: 28,
    paidPercent: 87,
    monthlyPayment: 27000,
    remainingBalance: 124500,
    annualRate: "12%",
    remainingDuration: "4 месяца",
  },
};

export const creditLoadLoanIds = Object.keys(creditLoadLoanDetails);
