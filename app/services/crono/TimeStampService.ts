import { Service } from '@tsed/di';

const ONE_DAY = 8.64e7;

@Service()
export class TimeStampService {
	public addOneDay(timestamp: number): number {
		return timestamp + ONE_DAY;
	}

	public addMilliSeconds(timestamp: number, toAdd: number): number {
		return timestamp + toAdd;
	}
}
