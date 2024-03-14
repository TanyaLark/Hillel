const map = new Map();

export default class UserRepository {
  save(user) {
    map.set(user.userId, user);
  }

  get(userId) {
    return map.get(userId);
  }

  getAll() {
    return map.values();
  }

  getByNameAndPassword(name, password) {
    for (const user of map.values()) {
      if (user.name === name && user.password === password) {
        return user;
      }
    }
    return null;
  }
}
