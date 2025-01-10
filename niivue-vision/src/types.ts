/**
 * A generic interface representing a dictionary where keys are strings and values are of type T.
 *
 * @template T - The type of the values in the dictionary.
 */
interface Dictionary<T> {
    [Key: string]: T;
}

export type { Dictionary };