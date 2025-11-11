import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionTypes,
  NodeOutput,
} from 'n8n-workflow';
import { x402Version } from '../../common/constants';
import { decodePaymentHeader } from '../../common/helpers/decode-payment-header';
import { x402FacilitatorVerify } from '../../common/helpers/x402-facilitator-verify';
import { CommonProperties, X402Properties } from '../../common/properties';
import { X402NodeOutputError } from '../../common/types/x402-node-output.type';

export class X402Verify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'X402 Verify',
		name: 'x402Verify',
		icon: { light: 'file:x402-verify.svg', dark: 'file:x402-verify.dark.svg' },
		group: ['transform'],
		version: 1,
		description: 'Node that verifies the payment header',
		defaults: {
			name: 'X402 Verify',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [
			{
				type: NodeConnectionTypes.Main,
				displayName: 'Success',
			},
			{
				type: NodeConnectionTypes.Main,
				displayName: 'Failure',
				category: 'error',
			},
		],
		usableAsTool: true,
		properties: [...CommonProperties, ...X402Properties],
	};

	async execute(this: IExecuteFunctions): Promise<NodeOutput> {
		const items = this.getInputData();
		const returnDataSuccess = <INodeExecutionData[]>[];
		const returnDataFailure = <INodeExecutionData[]>[];

		for (let i = 0; i < items.length; i++) {
			try {
				const { decodedPayment, paymentRequirements, selectedPaymentRequirements } =
					await decodePaymentHeader(this, i);

				const facilitatorUrl = this.getNodeParameter('facilitatorUrl', i) as string;

				const verification = await x402FacilitatorVerify(
					this,
					facilitatorUrl,
					decodedPayment,
					selectedPaymentRequirements,
				);

				if (verification.isValid) {
					returnDataSuccess.push({
						json: {
							httpCode: 200,
							data: verification,
						},
						pairedItem: { item: i },
					});
				} else {
					returnDataFailure.push({
						json: {
							data: {
								error: verification.invalidReason,
								accepts: paymentRequirements,
								payer: verification.payer,
								x402Version,
							},
							httpCode: 402,
						},
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (error instanceof X402NodeOutputError) {
					returnDataFailure.push({
						json: error.output,
						pairedItem: { item: i },
					});
				} else {
					throw error;
				}
			}
		}

		return [returnDataSuccess, returnDataFailure];
	}
}
