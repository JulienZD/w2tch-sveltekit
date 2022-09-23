/* eslint-disable @typescript-eslint/no-explicit-any */

type UnboxPromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export type ResolvedReturnType<T extends (...args: any) => Promise<any>> = UnboxPromise<ReturnType<T>>;
