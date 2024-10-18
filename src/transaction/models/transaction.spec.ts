import { Transaction } from './transaction.model';

describe('Transaction', () => {
  it('should be defined', () => {
    expect(new Transaction()).toBeDefined();
  });
});
