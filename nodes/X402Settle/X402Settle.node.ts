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
import { x402FacilitatorSettle } from '../../common/helpers/x402-facilitator-settle';
import { CommonProperties, X402Properties } from '../../common/properties';
import { X402NodeOutputError } from '../../common/types/x402-node-output.type';

export class X402Settle implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'X402 Settle',
		name: 'x402Settle',
		icon: { light: 'file:x402-settle.svg', dark: 'file:x402-settle.dark.svg' },
		group: ['transform'],
		version: 1,
		description: 'Node that settles the payment header',
		defaults: {
			name: 'X402 Settle',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [
			{
				type: 'main',
				displayName: 'Success',
			},
			{
				type: 'main',
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

				const settlement = await x402FacilitatorSettle(
					this,
					facilitatorUrl,
					decodedPayment,
					selectedPaymentRequirements,
				);

				if (settlement.success) {
					returnDataSuccess.push({
						json: {
							data: settlement,
							httpCode: 200,
						},
						pairedItem: { item: i },
					});
				} else {
					returnDataFailure.push({
						json: {
							data: {
								error: settlement.errorReason,
								accepts: paymentRequirements,
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
