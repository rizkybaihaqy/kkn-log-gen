export const getDateByDay = (day: number) => {
  const oneDay = 1000 * 60 * 60 * 24
  const start = new Date(
    'Wed Jan 05 2022 09:00:00 GMT+0700 (Western Indonesia Time)'
  ).getTime()

  return new Date((day - 1) * oneDay + start)
}
