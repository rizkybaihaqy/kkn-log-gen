export type Activities = {
  name: string
  time: string
  detail: string
  documentation: string
}

export type Log = {
  dayCount: string
  day: string
  date: string
  activities: Activities[]
  name: string
  city: string
  signature: string
}

export type Inputs = {
  dayCount: string
  activities: {
    name: string
    timeStart: string
    timeEnd: string
    detail: string
    documentation: string
  }[]
  name: string
  city: string
  signature: string
}
