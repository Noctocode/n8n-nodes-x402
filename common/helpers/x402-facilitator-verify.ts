import { IExecuteFunctions } from 'n8n-workflow';
import { PaymentPayload } from '../types/payment-payload.type';
import { PaymentRequirements } from '../types/payment-requirements.type';
import { VerifyResponse } from '../types/verify-response.type';

export const x402FacilitatorVerify = async (
	context: IExecuteFunctions,
	facilitatorUrl: string,
	payload: PaymentPayload,
	paymentRequirements: PaymentRequirements,
) => {
	const response = await context.helpers.httpRequest({
		method: 'POST',
		url: `/verify`,
		headers: {
			'Content-Type': 'application/json',
		},
		body: {
			x402Version: payload.x402Version,
			paymentPayload: payload,
			paymentRequirements: paymentRequirements,
		},
		json: true,
		baseURL: facilitatorUrl,
	});

	return response as VerifyResponse;
};
