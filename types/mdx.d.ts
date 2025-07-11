// types/mdx.d.ts
declare module '*.mdx' {
  import { ComponentType } from 'react';
  const MDXComponent: ComponentType<any>;
  export default MDXComponent;
}

// Also add support for content imports
declare module '*/content/*.mdx' {
  import { ComponentType } from 'react';
  const MDXComponent: ComponentType<any>;
  export default MDXComponent;
}

// If you have nested content folders
declare module '*/content/**/*.mdx' {
  import { ComponentType } from 'react';
  const MDXComponent: ComponentType<any>;
  export default MDXComponent;
}