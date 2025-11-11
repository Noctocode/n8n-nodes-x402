export type VerifyResponse = {
	isValid: boolean;
	invalidReason?: string;
	payer?: string;
};
