function sliceCorpus(corpus) {
  const sampleSize = 2;

  return corpus
    .map((_, index) => corpus.slice(index, index + sampleSize))
    .filter((group) => group.length === sampleSize);
}

function collectTransition(samples) {
  return samples.reduce((transitions, sample) => {
    const [state, next] = sample;

    transitions[state] = transitions[state] ?? [];
    transitions[state].push(next);
    return transitions;
  }, {});
}
