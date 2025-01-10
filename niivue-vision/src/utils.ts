import { Dictionary } from './types';

/**
 * Parses the query parameters from the current window's URL and returns them as a dictionary.
 *
 * @returns {Dictionary<string>} A dictionary where the keys are the query parameter names and the values are the query parameter values.
 */
export function parseQueryParams(): Dictionary<string> {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    let dict: Dictionary<string> = {};

    for (const [key, value] of params.entries()) {
        dict[key] = value;
    }

    return dict;
}
