import { IExecuteFunctions } from 'n8n-workflow';
import { PaymentPayload } from '../types/payment-payload.type';
import { PaymentRequirements } from '../types/payment-requirements.type';
import { SettleResponse } from '../types/settle-response.type';


export const x402FacilitatorSettle = async (
	context: IExecuteFunctions,
	facilitatorUrl: string,
	payload: PaymentPayload,
	paymentRequirements: PaymentRequirements,
) => {
	const response = await context.helpers.httpRequest({
		method: 'POST',
		url: `/settle`,
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

	return response as SettleResponse;
};
