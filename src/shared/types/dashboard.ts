export type BankAccount = {
  id: string;
  /** Slug банка для иконок (sber, tbank, alfa, …) */
  bankKey: string;
  label: string;
  suffix: string;
  color: string;
};

export type ForecastPoint = {
  month: string;
  balance: number;
  spend: number;
};

