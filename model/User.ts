import {Model} from '@tsed/mongoose';

@Model()
export class User {
  public _id: string;
  public email: string;
  public password: string;
  public firstName: string;
  public lastName: string;
  public picture: string;
  public createdDate: number;
}
