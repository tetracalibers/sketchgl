export const keys = <T extends { [key: string]: unknown }>(obj: T): (keyof T)[] => {
  return Object.keys(obj)
}

export type ValueOf<T> = T[keyof T]
