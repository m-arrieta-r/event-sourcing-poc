export type CustomerInfo = {
  id: string;
  name: string;
  cpf: string;
  monthlyIncome: number;
};

export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type LoanProposal = {
  id: string;
  customer: CustomerInfo;
  requestedAmount: number;
  installments: number;
  status: LoanStatus;
  createdAt: Date;
  version: number;
};
