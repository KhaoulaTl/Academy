import { Event } from './event.schema';

describe('Event', () => {
  it('should be defined', () => {
    expect(new Event()).toBeDefined();
  });
});
