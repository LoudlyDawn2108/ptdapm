// Augment types so the TypeScript compiler does not error when it follows
// import chains into backend source files that use Bun-specific APIs.
// These declarations are not used in frontend code at runtime.

interface ImportMeta {
  dir: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Bun: any;
