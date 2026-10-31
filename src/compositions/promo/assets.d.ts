declare module '*.jpg' {
  const value: string | { src: string };
  export default value;
}

declare module '*.png' {
  const value: string | { src: string };
  export default value;
}
