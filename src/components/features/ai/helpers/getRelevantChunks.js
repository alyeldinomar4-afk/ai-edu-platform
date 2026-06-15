export function getRelevantChunks(
  chunks,
  currentTime,
  {
    initialContext = 0,
    minChunks = 10,
    maxContext = 180,
    step = 15,
  } = {}
) {
  let context = initialContext;
  let result = [];

  while (context <= maxContext) {
    const start = Math.max(0, currentTime - context);
    const end = currentTime + context;

    result = chunks.filter(
      (chunk) =>
        chunk.end_seconds >= start &&
        chunk.start_seconds <= end
    );

    if (result.length >= minChunks) {
      break;
    }

    context += step;
  }

  return result;
}