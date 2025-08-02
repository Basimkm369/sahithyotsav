export default class AppResponse {
  msg!: string;

  status!: number;

  data!: object;

  constructor(msg: string, data: object = {}, { status = 200 }: { status?: number } = {}) {
    this.msg = msg;
    this.status = status;
    this.data = data;
  }
}
