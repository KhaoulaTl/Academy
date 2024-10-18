import { Transaction } from './transaction.schema';

describe('Transaction', () => {
  it('should be defined', () => {
    expect(new Transaction()).toBeDefined();
  });
});
