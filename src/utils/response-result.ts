export async function result<T>(
  data: T,
  pagination?: IPagination,
): Promise<IResult<T>> {
  return {
    data,
    pagination,
  };
}
