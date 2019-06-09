import { FormActions } from '@chat/constants/FormActions';
import { Enum, Property, Required } from '@tsed/common';
import { Indexed, Model } from '@tsed/mongoose';

@Model()
export class FormKey {
	public _id: string;
	@Required()
	@Property()
	@Indexed()
	public key: string;
	@Required()
	@Enum(FormActions)
	public action: FormActions;
	@Required()
	@Property()
	public createdAt: number;
	@Required()
	@Property()
	public expiredAt: number;
}
