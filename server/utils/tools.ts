export type Either<T, U> = ["left", T] | ["right", U]

export type Maybe<T> = T | undefined

export const asafely = async <T>(cb: () => Promise<T>): Promise<Either<Error, T>> => {
  try {
    return ["right", await cb()]
  } catch (error) {
    return ["left", error]
  }
}

export const asafelyOptional = async <T>(cb: () => Promise<T>): Promise<Maybe<T>> => {
  const result = await asafely(cb)
  return result[0] === "right" ? result[1] : undefined
}

export const safely = <T>(cb: () => T): Either<Error, T> => {
  try {
    return ["right", cb()]
  } catch (error) {
    return ["left", error]
  }
}

export const safelyOptional = <T>(cb: () => T): Maybe<T> => {
  const result = safely(cb)
  return result[0] === "right" ? result[1] : undefined
}

export const withLogging = <T>(result: T, toLog: unknown): T => {
  console.log(toLog)
  return result
}
