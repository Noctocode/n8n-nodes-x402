import { IExecuteFunctions } from 'n8n-workflow';
import { x402Version } from '../constants';
import { findMatchingPaymentRequirements } from '../helpers/find-matching-payment-requirements';
import { x402DecodePayment } from '../helpers/x402-decode-payment';
import { x402GetPaymentRequirements } from '../helpers/x402-get-payment-requirements';
import { Network } from '../types/network.type';
import { PaymentPayload } from '../types/payment-payload.type';
import { Price } from '../types/price.type';
import { X402NodeOutputError } from '../types/x402-node-output.type';

export const decodePaymentHeader = async (
	context: IExecuteFunctions,
	itemIndex: number,
) => {
	const resourceUrl = context.getNodeParameter('resourceUrl', itemIndex) as string;
  const payTo = context.getNodeParameter('payTo', itemIndex) as `0x${string}`;
  const network = context.getNodeParameter('network', itemIndex) as Network;
  const priceString = context.getNodeParameter('price', itemIndex) as string;
  const price = JSON.parse(priceString) as Price;
	const xPaymentHeader = context.getNodeParameter('xPaymentHeader', itemIndex) as string;

	const paymentRequirements = x402GetPaymentRequirements(context, payTo, price, network, resourceUrl);

	if (!xPaymentHeader) {
		throw new X402NodeOutputError({
			data: {
				error: 'X-PAYMENT header is required',
				accepts: paymentRequirements,
				x402Version,
			},
			httpCode: 402,
		});
	}

	let decodedPayment: PaymentPayload;
	try {
		decodedPayment = x402DecodePayment(xPaymentHeader);
	} catch (error) {
		throw new X402NodeOutputError({
			data: {
				error: error instanceof Error ? error.message : 'Invalid or malformed payment header',
				accepts: paymentRequirements,
				x402Version,
			},
			httpCode: 402,
		});
	}

	const selectedPaymentRequirements = findMatchingPaymentRequirements(
		paymentRequirements,
		decodedPayment,
	);

	if (!selectedPaymentRequirements) {
		throw new X402NodeOutputError({
			data: {
				error: 'Unable to find matching payment requirements',
				accepts: paymentRequirements,
				x402Version,
			},
			httpCode: 402,
		});
	}

	return {
		decodedPayment,
		paymentRequirements,
		selectedPaymentRequirements,
	};
};
