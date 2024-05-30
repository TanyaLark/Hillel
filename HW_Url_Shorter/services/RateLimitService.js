import { RateLimitRepository } from '../repository/RateLimitRepository.js';

export default class RateLimitService {
  constructor() {
    this.rateLimitRepository = new RateLimitRepository();
  }

  async getRateLimitsKeys() {
    const rateLimits = await this.rateLimitRepository.getAllKeys();
    return rateLimits;
  }

  async deleteRateLimit(key) {
    const result = await this.rateLimitRepository.deleteRateLimit(key);
    return result;
  }
}
