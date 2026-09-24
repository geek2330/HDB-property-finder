export interface MortgageCalcParams {
  purchasePrice: number;
  monthlyHouseholdIncome: number;
  isFirstTimer: boolean;
  buyerType: 'couple' | 'family' | 'single';
  liveNearParents: boolean;
  loanType: 'hdb' | 'bank';
  loanTenureYears: number;
  flatType: string;
}

export interface MortgageCalcResult {
  purchasePrice: number;
  eligibleGrants: {
    ehg: number;
    familyGrant: number;
    proximityGrant: number;
    totalGrants: number;
  };
  netPurchasePrice: number;
  maxLtvPercentage: number;
  maxLoanAmount: number;
  minimumDownpayment: number;
  minimumCashDownpayment: number;
  cpfOrCashDownpayment: number;
  buyersStampDuty: number;
  interestRateAnnual: number;
  monthlyInstallment: number;
  monthlyIncomeRequired: number; // Based on 30% MSR
  msrPercentage: number;
}

export function calculateBSD(price: number): number {
  let bsd = 0;
  if (price <= 180000) {
    bsd += price * 0.01;
  } else {
    bsd += 180000 * 0.01;
    if (price <= 360000) {
      bsd += (price - 180000) * 0.02;
    } else {
      bsd += 180000 * 0.02;
      if (price <= 1000000) {
        bsd += (price - 360000) * 0.03;
      } else {
        bsd += 640000 * 0.03;
        if (price <= 1500000) {
          bsd += (price - 1000000) * 0.04;
        } else {
          bsd += 500000 * 0.04;
          bsd += (price - 1500000) * 0.05;
        }
      }
    }
  }
  return Math.round(bsd);
}

export function calculateHDBFinances(params: MortgageCalcParams): MortgageCalcResult {
  const {
    purchasePrice,
    monthlyHouseholdIncome,
    isFirstTimer,
    buyerType,
    liveNearParents,
    loanType,
    loanTenureYears,
    flatType
  } = params;

  // 1. Calculate CPF Grants
  let ehg = 0;
  let familyGrant = 0;
  let proximityGrant = 0;

  if (isFirstTimer) {
    // EHG calculation (Enhanced CPF Housing Grant)
    // Up to $80k for couples (income <= $9000), up to $40k for singles (income <= $4500)
    if (buyerType === 'couple' || buyerType === 'family') {
      if (monthlyHouseholdIncome <= 1500) ehg = 80000;
      else if (monthlyHouseholdIncome <= 3000) ehg = 65000;
      else if (monthlyHouseholdIncome <= 5000) ehg = 45000;
      else if (monthlyHouseholdIncome <= 7000) ehg = 25000;
      else if (monthlyHouseholdIncome <= 9000) ehg = 10000;
      else ehg = 0;

      // CPF Family Grant: $80,000 for 2- to 4-room, $50,000 for 5-room or bigger
      if (monthlyHouseholdIncome <= 14000) {
        familyGrant = ['2-Room', '3-Room', '4-Room'].includes(flatType) ? 80000 : 50000;
      }
    } else {
      // Singles Grant
      if (monthlyHouseholdIncome <= 1500) ehg = 40000;
      else if (monthlyHouseholdIncome <= 3000) ehg = 25000;
      else if (monthlyHouseholdIncome <= 4500) ehg = 10000;
      else ehg = 0;

      if (monthlyHouseholdIncome <= 7000) {
        familyGrant = ['2-Room', '3-Room', '4-Room'].includes(flatType) ? 40000 : 25000;
      }
    }

    // Proximity Housing Grant
    if (liveNearParents) {
      proximityGrant = buyerType === 'single' ? 15000 : 30000;
    }
  }

  const totalGrants = ehg + familyGrant + proximityGrant;
  const netPurchasePrice = Math.max(0, purchasePrice - totalGrants);

  // 2. Loan details
  // HDB Loan: 80% LTV, 2.6% interest rate, max 25 yrs
  // Bank Loan: 75% LTV (min 5% cash), 2.9% interest rate
  const maxLtvPercentage = loanType === 'hdb' ? 0.80 : 0.75;
  const interestRateAnnual = loanType === 'hdb' ? 0.026 : 0.029;
  const maxLoanAmount = Math.round(purchasePrice * maxLtvPercentage);

  const minimumDownpayment = purchasePrice - maxLoanAmount;
  // If bank loan, min 5% must be cash; if HDB loan, 0% cash required (can all be CPF)
  const minimumCashDownpayment = loanType === 'hdb' ? 0 : Math.round(purchasePrice * 0.05);
  const cpfOrCashDownpayment = minimumDownpayment - minimumCashDownpayment;

  // 3. Monthly instalment calculation using amortization formula
  const monthlyRate = interestRateAnnual / 12;
  const numberOfMonths = loanTenureYears * 12;
  const monthlyInstallment = Math.round(
    (maxLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths))) /
    (Math.pow(1 + monthlyRate, numberOfMonths) - 1)
  );

  // 4. Mortgage Servicing Ratio (MSR capped at 30% for HDB loans/flats)
  const msrPercentage = monthlyHouseholdIncome > 0
    ? Math.round((monthlyInstallment / monthlyHouseholdIncome) * 100)
    : 0;
  const monthlyIncomeRequired = Math.round(monthlyInstallment / 0.30);

  const buyersStampDuty = calculateBSD(purchasePrice);

  return {
    purchasePrice,
    eligibleGrants: {
      ehg,
      familyGrant,
      proximityGrant,
      totalGrants
    },
    netPurchasePrice,
    maxLtvPercentage,
    maxLoanAmount,
    minimumDownpayment,
    minimumCashDownpayment,
    cpfOrCashDownpayment,
    buyersStampDuty,
    interestRateAnnual,
    monthlyInstallment,
    monthlyIncomeRequired,
    msrPercentage
  };
}
