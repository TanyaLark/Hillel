import UrlRepository from '../repository/UrlRepositoryKnex.js';

export const rateLimitConfig = {
  forUserAllUrls: {
    reqLimit: 6,
    windowSec: 60,
    keyGenerator: async function (req) {
      const urlRepository = new UrlRepository();
      const urlCode = req.params.code;
      const url = await urlRepository.getUrlByCode(urlCode);
      const userId = url.user_id;
      return `userId:${userId}`;
    },
  },
  forUrl: {
    reqLimit: 8,
    windowSec: 60,
    keyGenerator: async function (req) {
      return `urlCode:${req.params?.code}`;
    },
  },
  forIpAddress: {
    reqLimit: 10,
    windowSec: 60,
    keyGenerator: async function (req) {
      const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      return `ip:${ip}`;
    },
  },
};
