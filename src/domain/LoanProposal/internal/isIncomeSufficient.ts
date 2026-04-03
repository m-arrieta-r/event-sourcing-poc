export const isIncomeSufficient = (income: number, amount: number, installments: number): boolean => {
  const monthlyInstallmentAmount = amount / installments;
  // Rule: Monthly installment shouldn't exceed 30% of income
  return monthlyInstallmentAmount <= income * 0.3;
};
