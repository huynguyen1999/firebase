export const calculatePagination = (pageNumber: number, pageSize: number) => {
  const offset = (pageNumber - 1) * pageSize;
  return { offset, limit: pageSize };
};
