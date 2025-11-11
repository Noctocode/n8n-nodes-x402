import { IExecuteFunctions, NodeApiError } from 'n8n-workflow';
import { Network, SupportedEVMNetworks } from '../types/network.type';
import { PaymentRequirements } from '../types/payment-requirements.type';
import { ERC20TokenAmount, Price } from '../types/price.type';

export const x402GetPaymentRequirements = (
	context: IExecuteFunctions,
	payTo: `0x${string}`,
	price: Price,
	network: Network,
	resourceUrl: string,
): PaymentRequirements[] => {
	if (!SupportedEVMNetworks.includes(network)) {
		throw new NodeApiError(context.getNode(), { error: `Unsupported network: ${network}` });
	}

	return [
		{
			scheme: 'exact',
			network,
			maxAmountRequired: price.amount,
			resource: resourceUrl,
			description: '',
			mimeType: 'application/json',
			payTo,
			maxTimeoutSeconds: 300,
			asset: price.asset.address,
			outputSchema: {
				input: {
					type: 'http',
					method: 'GET',
					discoverable: true,
				},
			},
			extra: (price.asset as ERC20TokenAmount['asset']).eip712,
		},
	];
};
