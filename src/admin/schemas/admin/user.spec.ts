import { User } from './admin.schema';

describe('User', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });
});
