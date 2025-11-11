export const SupportedEVMNetworks = [
	'base-sepolia',
	'base',
	'avalanche-fuji',
	'avalanche',
	'iotex',
	'sei',
	'sei-testnet',
	'polygon',
	'polygon-amoy',
	'peaq',
] as const;

export type Network = (typeof SupportedEVMNetworks)[number];
