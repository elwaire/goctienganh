type DeepObject = Record<string, unknown>;

function isObject(item: unknown): item is DeepObject {
  return Boolean(item && typeof item === "object" && !Array.isArray(item));
}

/**
 * Deep merge hai object lại với nhau.
 * Nếu cả hai value đều là object thì merge đệ quy,
 * ngược lại value của source sẽ ghi đè target.
 */
export default function deepmerge(
  target: DeepObject,
  source: DeepObject
): DeepObject {
  const output = { ...target };

  for (const key of Object.keys(source)) {
    if (isObject(source[key]) && isObject(target[key])) {
      output[key] = deepmerge(
        target[key] as DeepObject,
        source[key] as DeepObject
      );
    } else {
      output[key] = source[key];
    }
  }

  return output;
}
