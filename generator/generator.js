import { tokenize, textify } from './tokenizer.js';

function sliceCorpus(corpus, sampleSize) {
  return corpus
    .map((_, index) => corpus.slice(index, index + sampleSize))
    .filter((group) => group.length === sampleSize);
}

function collectTransition(samples) {
  return samples.reduce((transitions, sample) => {
    const lastIndex = sample.length - 1;
    const lastToken = sample[lastIndex];
    const restTokens = sample.slice(0, lastIndex);

    const state = fromTokens(restTokens);
    const next = lastToken;

    transitions[state] = transitions[state] ?? [];
    transitions[state].push(next);
    return transitions;
  }, {});
}

const escapeString = (token) => `_+${token}`;
const fromTokens = (tokens) => escapeString(tokens.join(''));

function predictNext(chain, transitions, sampleSize) {
  const lastState = fromTokens(chain.slice(-(sampleSize - 1)));
  const nextWords = transitions[lastState] ?? [];
  return pickRandom(nextWords);
}

const range = (count) => Array.from(Array(count).keys());
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = (list) => list[random(0, list.length - 1)];

function createChain(startText, transitions) {
  const head = startText ?? pickRandom(Object.keys(transitions));

  return tokenize(head);
}

function* generateChain(startText, transitions, sampleSize) {
  const chain = createChain(startText, transitions);

  while (true) {
    const state = predictNext(chain, transitions, sampleSize);
    yield state;

    if (state) chain.push(state);
    else chain.pop();
  }
}

export function generate({
  source,
  start = null,
  wordsCount = 100,
  sampleSize = 3,
} = {}) {
  if (!source) throw new Error('Не предоставлен ресурс для обучения');
  if (sampleSize < 2) throw new Error('Размер окна не должен быть меньше 2');

  const corpus = tokenize(String(source));
  const samples = sliceCorpus(corpus, sampleSize);
  const transitions = collectTransition(samples);

  const generator = generateChain(start, transitions, sampleSize);
  const chain = range(wordsCount).map((_) => generator.next().value);

  return textify(chain);
}
