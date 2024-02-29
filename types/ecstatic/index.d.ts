declare module 'ecstatic' {
  import HTTP from 'http';

  function ecstatic(root: string): typeof HTTP;

  export = ecstatic;
}
