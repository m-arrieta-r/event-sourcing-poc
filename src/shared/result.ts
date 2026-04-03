/**
 * A lightweight functional Result monad implementation to avoid throwing errors.
 */
export type Success<T> = { isSuccess: true; value: T };
export type Failure<E> = { isSuccess: false; error: E };
export type Result<T, E> = Success<T> | Failure<E>;

export const success = <T>(value: T): Result<T, never> => ({ isSuccess: true, value });
export const failure = <E>(error: E): Result<never, E> => ({ isSuccess: false, error });
