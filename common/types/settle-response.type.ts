import { Network } from './network.type';

export type SettleResponse = {
	success: boolean;
	errorReason?: string;
	payer?: string;
	transaction: string;
	network: Network;
};
