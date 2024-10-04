import { User } from './admin.model';

describe('User', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });
});
