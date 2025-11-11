export type ERC20TokenAmount = {
	amount: string;
	asset: {
		address: `0x${string}`;
		decimals: number;
		eip712: {
			name: string;
			version: string;
		};
	};
};

export type Price = ERC20TokenAmount;
