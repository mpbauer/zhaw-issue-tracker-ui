export function httpErrorToString(error) {
  return (error.response === undefined || error.response.status === undefined) ? 'unknown error' : error.response.status;
}