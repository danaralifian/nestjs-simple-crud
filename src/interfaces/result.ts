interface IError {
  message: string;
  error?: number;
  statusCode?: number;
}

interface IResult<T> {
  data?: T;
  error?: IError;
  pagination?: IPagination;
}
