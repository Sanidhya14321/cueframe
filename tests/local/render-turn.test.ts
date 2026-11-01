import { expect, test as it } from 'bun:test';
import { renderTurn } from '@/local/render-turn';

it('renders run one at a time and survive a failure', async () => {
  const order: string[] = [];
  const first = renderTurn(async () => {
    order.push('a-start');
    await Promise.resolve();
    order.push('a-end');
    throw new Error('failed');
  });
  const second = renderTurn(() => {
    order.push('b');
    return Promise.resolve(2);
  });
  await expect(first).rejects.toThrow('failed');
  expect(await second).toBe(2);
  expect(order).toEqual(['a-start', 'a-end', 'b']);
});
