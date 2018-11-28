import { IndicatorType } from './IndicatorType'

function httpErrorUndefined(error) {
  return isNullOrUndefined(error.response) || isNullOrUndefined(error.response.status);
}

function isNetworkError(error) {
  return error.toString().indexOf('Network Error') !== -1;
}

function httpErrorCodeToString(error) {
  return httpErrorUndefined(error) ? error.toString() : error.response.status.toString();
}

export function isNullOrUndefined(obj) {
  return obj === undefined || obj === null;
}

export function httpErrorToErrorMessage(error) {
  if (isNetworkError(error)) {
    return "It appears that you don't have internet. Could not update server."
  } else {
    return `Could perform operation, an error occurred: ${httpErrorCodeToString(error)}`;
  }
}

export function httpErrorToIndicatorType(error) {
  if (httpErrorUndefined(error)) {
    if (isNetworkError(error)) {
      return IndicatorType.warning;
    }
  }

  return IndicatorType.error;
}
