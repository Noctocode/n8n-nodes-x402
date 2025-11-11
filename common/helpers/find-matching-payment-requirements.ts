import { PaymentPayload } from '../types/payment-payload.type';
import { PaymentRequirements } from '../types/payment-requirements.type';

export const findMatchingPaymentRequirements = (
	paymentRequirements: PaymentRequirements[],
	payment: PaymentPayload,
) =>
	paymentRequirements.find((pr) => pr.scheme === payment.scheme && pr.network === payment.network);
