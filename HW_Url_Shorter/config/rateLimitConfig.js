import UrlRepository from '../repository/UrlRepositoryKnex.js';

const urlRepository = new UrlRepository();

export const rateLimitConfig = {
  rateLimit1: {
    reqLimit: 3,
    windowSec: 60,
    keyGenerator: function (req) {
      const urlCode = req.params.code;
      const userId = urlRepository.getUrlByCode(urlCode)?.userId;
      return userId;
    },
  },
  rateLimit2: {
    reqLimit: 2,
    windowSec: 60,
    keyGenerator: function (req) {
      return req.params?.code;
    },
  },
};
