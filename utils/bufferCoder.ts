export const encode = (utf8String: string) =>
  Buffer.from(utf8String, 'utf8').toString('base64');

export const decode = (base64String: string) =>
  Buffer.from(base64String, 'base64').toString('utf8');
