export type NotArray<T> = T extends Array<unknown> ? never : T

// Get array element type.
export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;