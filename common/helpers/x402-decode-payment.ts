import { x402Version } from '../constants';
import { SupportedEVMNetworks } from '../types/network.type';
import { PaymentPayload } from '../types/payment-payload.type';

export const x402DecodePayment = (payment: string): PaymentPayload => {
	const decoded = Buffer.from(payment, 'base64').toString('utf8');
	const parsed = JSON.parse(decoded);

	const obj = {
		...parsed,
		payload: parsed.payload,
	};

	if (obj.x402Version !== x402Version) {
		throw new Error('invalid_x402_version');
	}

	if (obj.scheme !== 'exact') {
		throw new Error('invalid_scheme');
	}

	if (!SupportedEVMNetworks.includes(obj.network)) {
		throw new Error('invalid_network');
	}

	if (!obj.payload.signature || !obj.payload.authorization) {
		throw new Error('invalid_payload');
	}

	return obj;
};
