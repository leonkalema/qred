import { testConnection } from '../config/database';

describe('Db Connection', () => {
  it('should connect to the db successfully', async () => {
    await expect(testConnection()).resolves.not.toThrow();
  });
});