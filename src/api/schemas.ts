const nonEmptyString = { type: 'string', minLength: 1, pattern: '\\S' };
export const userSchema = {
  type: 'object', required: ['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company'],
  properties: {
    id: { type: 'integer', minimum: 1 }, name: nonEmptyString, username: nonEmptyString,
    email: { type: 'string', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
    phone: nonEmptyString, website: nonEmptyString,
    address: { type: 'object', required: ['street', 'suite', 'city', 'zipcode', 'geo'], properties: {
      street: nonEmptyString, suite: nonEmptyString, city: nonEmptyString, zipcode: nonEmptyString,
      geo: { type: 'object', required: ['lat', 'lng'], properties: { lat: nonEmptyString, lng: nonEmptyString } },
    } },
    company: { type: 'object', required: ['name', 'catchPhrase', 'bs'], properties: {
      name: nonEmptyString, catchPhrase: nonEmptyString, bs: nonEmptyString,
    } },
  },
};
export const postSchema = {
  type: 'object', required: ['id', 'userId', 'title', 'body'], properties: {
    id: { type: 'integer', minimum: 1 }, userId: { type: 'integer', minimum: 1 },
    title: nonEmptyString, body: nonEmptyString,
  },
};
