import UrlRepository from '../repository/UrlRepositoryKnex.js';
import { RateLimitRepository } from '../repository/RateLimitRepository.js';

export async function getUserUrlsRateLimits(userId) {
  const urlRepository = new UrlRepository();
  const rateLimitRepository = new RateLimitRepository();

  const allUrlByUserId = await urlRepository.getAllUrlByUserId(userId);
  const rateLimits = [];
  for (const url of allUrlByUserId) {
    const key = `urlCode:${url.code}`;
    const rateLimit = await rateLimitRepository.getRateLimit(key);
    if (!rateLimit) {
      continue;
    }
    rateLimit.code = url.code;
    rateLimits.push(rateLimit);
  }
  return rateLimits;
}
