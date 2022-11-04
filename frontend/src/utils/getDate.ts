/**
 *
 * @param date
 * @returns 'YYYY-mm-dd'
 */
export const getDate = (date: Date) =>
  `${date.getFullYear().toString().padStart(4, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

/**
 *
 * @param startDate
 * @param endDate
 * @returns startDate가 endDate보다 날짜 넘으면 false, 같거나 적으면 true 리턴
 *
 */
export const cmpDate = (startDate: string, endDate: string) =>
  new Date(startDate) > new Date(endDate) ||
  new Date(startDate).getTime() / 1000 / 60 / 60 / 24 <
    Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24);
