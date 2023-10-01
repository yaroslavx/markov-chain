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

function predictNext(chain, transitions) {
  const lastState = chain.at(-1);
  const nextWords = transitions[lastState] ?? [];
  return pickRandom(nextWords);
}

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const pickRandom = (list) => list[random(0, list.length - 1)];
