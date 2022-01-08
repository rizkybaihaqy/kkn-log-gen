// export const getDayAuto = () => {
//   const oneDay = 1000 * 60 * 60 * 24

//   const now = new Date()
//   const start = new Date(
//     'Wed Jan 05 2022 00:00:00 GMT+0700 (Western Indonesia Time)'
//   )
//   const diff =
//     now -
//     start +
//     (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000

//   const day = Math.floor(diff / oneDay)

//   return day + 1
// }

export const getDateByDay = (day: number) => {
  const oneDay = 1000 * 60 * 60 * 24
  const start = new Date(
    'Wed Jan 05 2022 09:00:00 GMT+0700 (Western Indonesia Time)'
  ).getTime()

  return new Date((day - 1) * oneDay + start)
}
