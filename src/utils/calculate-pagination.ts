export function calculatePagination(
  total: number,
  page: number,
  limit: number,
) {
  const totalPages = Math.ceil(total / limit);
  return {
    totalData: total,
    page,
    limit,
    totalPages,
  };
}
