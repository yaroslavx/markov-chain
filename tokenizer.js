const NEWLINE_PLACEHOLDER = '§';
const newLinesRegex = /\ns*/g;

const punctuation = `[](){}!?.,:;'"/*&^%$_+-–—=<>@|~`.split('').join('\\');
const ellipsis = '\\.{3}';

const words = '[a-zA-Zа-яА-ЯёЁ]+';
const compounds = `${words}-${words}`;

const tokenizeRegex = new RegExp(
  `(${ellipsis}|${compounds}|${words}|[${punctuation}])`
);

export function tokenize(text) {
  return text
    .replaceAll(newLinesRegex, NEWLINE_PLACEHOLDER)
    .split(tokenizeRegex)
    .filter(exists);
}

function exists(entity) {
  return !!entity;
}
