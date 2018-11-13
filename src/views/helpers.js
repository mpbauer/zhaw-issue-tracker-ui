export function isNullOrUndefined(obj) {
  return obj === undefined || obj === null;
}

export function httpErrorToString(error) {
  return isNullOrUndefined(error.response) || isNullOrUndefined(error.response.status) ? error : error.response.status;
}