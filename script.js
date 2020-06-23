var actions = ['sum', 'subtract', 'multiply'];
var actionsSelect, form, expected, actual;
const ACCEPTED_CLASS = 'text-success';
const WRONG_CLASS = 'text-danger';
const EXPECTED_ACTIONS = new Map([
  ['sum', (a,b) => a + b],
  ['subtract', (a,b) => a - b],
  ['multiply', (a,b) => a * b],
]);
const FIELDS = ['first', 'second', 'action'];

document.addEventListener('DOMContentLoaded', () => {
  actionsSelect = document.getElementById('action');
  form = document.getElementById('count-form');
  expected = document.getElementById('expected');
  actual = document.getElementById('actual');
  actions.forEach(a => createOption(a));
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
  const expectedResult = EXPECTED_ACTIONS.get(action)(f, s);
  expected.innerText = expectedResult.toString().replace('n', '');
  const actualResult = new BigNum(first)[action](new BigNum(second)).toString();
  actual.innerText = actualResult;
  const isMatch = expectedResult === BigInt(actualResult);
  clearResults();
  if (isMatch) {
    expected.classList.add(ACCEPTED_CLASS);
    actual.classList.add(ACCEPTED_CLASS);
  } else {
    expected.classList = '';
    actual.classList.add(WRONG_CLASS);
  }
}

function clearResults() {
  expected.classList = '';
  actual.classList = '';
}

