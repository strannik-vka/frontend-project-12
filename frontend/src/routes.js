const apiPath = 'api/v1';

const apiPaths = {
  origin: () => apiPath,
  signup: () => [apiPath, 'signup'].join('/'),
  login: () => [apiPath, 'login'].join('/'),
  messages: () => [apiPath, 'messages'].join('/'),
  channels: () => [apiPath, 'channels'].join('/'),
};

const appPaths = {
  home: () => '/',
  login: () => '/login',
  signup: () => '/signup',
  notFound: () => '/not-found',
};

export { apiPaths, appPaths };
