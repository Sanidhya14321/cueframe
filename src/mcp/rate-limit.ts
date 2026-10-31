let minute = 0;
let calls = 0;
export const allowToolCall = () => {
  const current = Math.floor(Date.now() / 60000);
  if (current !== minute) {
    minute = current;
    calls = 0;
  }
  calls += 1;
  return calls <= 100;
};
