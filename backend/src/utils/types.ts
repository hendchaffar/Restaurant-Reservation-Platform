export type QueryParams<T> = {
    [P in keyof T]?: string | number | boolean | Array<string | number | boolean>;
  };
  