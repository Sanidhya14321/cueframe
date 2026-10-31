export const useRouter = () => ({
  push: (path: string) => {
    window.top?.location.assign(path);
  },
  replace: (path: string) => {
    window.location.replace(path);
  },
});
