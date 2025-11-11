import {
  IDataObject,
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  NodeConnectionTypes,
  NodeOutput,
} from 'n8n-workflow';
import { CommonProperties } from '../../common/properties';

export class X402Config implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'X402 Config',
		name: 'x402Config',
		icon: { light: 'file:x402-config.svg', dark: 'file:x402-config.dark.svg' },
		group: ['transform'],
		version: 1,
		description: 'Node to configure the x402 flow in one place',
		defaults: {
			name: 'X402 Config',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: CommonProperties,
	};

	async execute(this: IExecuteFunctions): Promise<NodeOutput> {
		return [
			this.getInputData().map((item, i) => ({
				json: CommonProperties.reduce((json, property) => {
					json[property.name] = this.getNodeParameter(property.name, i);

					return json;
				}, {} as IDataObject),
				pairedItem: { item: i },
			})),
		];
	}
}
