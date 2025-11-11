import { Network } from './network.type';

export type PaymentRequirements = {
	scheme: 'exact';
	network: Network;
	maxAmountRequired: string;
	resource: string;
	description: string;
	mimeType: string;
	outputSchema?: {
		input: {
			type: string;
			method: string;
			discoverable: boolean;
		};
	};
	payTo: string;
	maxTimeoutSeconds: number;
	asset: string;
	extra?: {
		name: string;
		version: string;
	};
};
