var actions = ['plus', 'minus', 'multiply'];
var actionsSelect, form, expected, actual, check, error;
const ACCEPTED_CLASS = 'text-success';
const WRONG_CLASS = 'text-danger';
const HIDDEN_ATTRIBUTE = 'hidden';
const ACTIONS = new Map([
  ['plus', (a,b) => a + b],
  ['minus', (a,b) => a - b],
  ['multiply', (a,b) => a * b],
  ['isBigger', (a,b) => a > b],
  ['isLess', (a,b) => a < b],
  ['isEqual', (a,b) => a === b]
]);
const FIELDS = ['first', 'second', 'action'];

document.addEventListener('DOMContentLoaded', () => {
  actionsSelect = document.getElementById('action');
  form = document.getElementById('count-form');
  expected = document.getElementById('expected');
  actual = document.getElementById('actual');
  check = document.getElementById('check');
  error = document.getElementById('error');
  Array.from(ACTIONS.keys()).forEach(a => createOption(a));
  form.onsubmit = handleForm;
});

function createOption(name) {
  const option = document.createElement('option');
  option.innerText = name;
  option.value = name;
  actionsSelect.appendChild(option);
}

function handleForm(e) {
  e.preventDefault();
  const elements = e.target.elements;
  runAction(...FIELDS.map(x => elements[x].value));
}

function runAction(first, second, action) {
  const f = BigInt(first);
  const s = BigInt(second);
  const expectedResult = ACTIONS.get(action)(f, s).toString().replace('n', '');
  expected.innerText = expectedResult;
  const actualResult = new BigNum(first)[action](new BigNum(second)).toString();
  actual.innerText = actualResult;
  const isMatch = expectedResult === actualResult;
  clearResults();
  isMatch ? successResult() : errorResult();
}

function successResult() {
  expected.classList.add(ACCEPTED_CLASS);
  actual.classList.add(ACCEPTED_CLASS);
  check.removeAttribute(HIDDEN_ATTRIBUTE);
  error.setAttribute(HIDDEN_ATTRIBUTE, true);
}

function errorResult() {
  expected.classList = '';
  actual.classList.add(WRONG_CLASS);
  check.setAttribute(HIDDEN_ATTRIBUTE, true);
  error.removeAttribute(HIDDEN_ATTRIBUTE);
}

function clearResults() {
  expected.classList = '';
  actual.classList = '';
  check.setAttribute(HIDDEN_ATTRIBUTE, true);
  error.setAttribute(HIDDEN_ATTRIBUTE, true);
}

