import { INodeProperties } from 'n8n-workflow';
import { SupportedEVMNetworks } from '../types/network.type';

export const X402Properties: INodeProperties[] = [
	{
		displayName: 'Resource Url',
		name: 'resourceUrl',
		type: 'string',
		required: true,
		default: '',
	},
	{
		displayName: 'X-PAYMENT Header',
		name: 'xPaymentHeader',
		type: 'string',
		required: true,
		default: '',
	},
];

export const CommonProperties: INodeProperties[] = [
	{
		displayName: 'Pay To',
		name: 'payTo',
		type: 'string',
		placeholder: '0x...',
		required: true,
		default: '',
	},
	{
		displayName: 'Facilitator Url',
		name: 'facilitatorUrl',
		type: 'string',
		required: true,
		default: 'https://x402.org/facilitator',
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'json',
		required: true,
		default: JSON.stringify(
			{
				amount: '10000',
				asset: {
					address: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`,
					decimals: 6,
					eip712: {
						name: 'USDC',
						version: '2',
					},
				},
			},
			null,
			2,
		),
	},
	{
		displayName: 'Network',
		name: 'network',
		type: 'options',
		default: SupportedEVMNetworks[0],
		required: true,
		options: SupportedEVMNetworks.map((network) => ({
			name: network,
			value: network,
		})),
	},
];
