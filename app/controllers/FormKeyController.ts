import { FormActions } from '@chat/constants/FormActions';
import { InvalidFormActionException } from '@chat/errors/http/form-action/InvalidFormActionException';
import { FormKeyService } from '@chat/services/access/FormKeyService';
import { Controller, Get, PathParams, Status } from '@tsed/common';

@Controller('formKeys')
export class FormKeyController {
	constructor(private formKeyService: FormKeyService) {}

	@Get('generate/:action')
	@Status(201)
	public async generateFormKey(@PathParams('action') action: string) {
		if (action in FormActions) {
			const key = await this.formKeyService.createNewFormKeyForOneDay(
				action as FormActions
			);
			return { formKey: key };
		}
		throw new InvalidFormActionException();
	}
}
