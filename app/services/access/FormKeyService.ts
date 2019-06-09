import { FormActions } from '@chat/constants/FormActions';
import { FormKey } from '@chat/model/database/FormKey';
import { TimeStampService } from '@chat/services/crono/TimeStampService';
import { UUID_V4 } from '@chat/utils/UUID_V4';
import { Inject, Service } from '@tsed/di';
import { MongooseModel } from '@tsed/mongoose';

@Service()
export class FormKeyService {
	constructor(
		@Inject(FormKey) private formKeyModel: MongooseModel<FormKey>,
		private timestampService: TimeStampService
	) {}

	public async createNewFormKeyForOneDay(action: FormActions): Promise<string> {
		const uniqueKey = UUID_V4();
		const formKey = new FormKey();
		formKey.action = action;
		formKey.createdAt = new Date().getTime();
		formKey.expiredAt = this.timestampService.addOneDay(formKey.createdAt);
		formKey.key = uniqueKey;
		const model = new this.formKeyModel(formKey);
		await model.save();
		return uniqueKey;
	}

	// TODO create form key with custom timeout, timeout to be provided in enum constants
}
