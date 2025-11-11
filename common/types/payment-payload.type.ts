import { Network } from './network.type';

export type PaymentPayload = {
	x402Version: number;
	scheme: 'exact';
	network: Network;
	payload: {
		signature: string;
		authorization: {
			from: string;
			to: string;
			value: string;
			validAfter: string;
			validBefore: string;
			nonce: string;
		};
	};
};
