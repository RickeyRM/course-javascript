import './cookie.html';

const homeworkContainer = document.querySelector('#app');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

const cookiesMap = getCookies();

function getCookies() {
  return document.cookie
    .split('; ')
    .filter(Boolean)
    .map((cookie) => {
      return cookie.match(/^([^=]+)=(.+)/);
    })
    .reduce((obj, [, name, value]) => {
      obj.set(name, value);

      return obj;
    }, new Map());
}

const updateTable = (payload) => {
  const fragment = document.createDocumentFragment();

  payload.forEach((value, key) => {
    const tr = document.createElement('tr');
    const nameTD = document.createElement('td');
    const valueTD = document.createElement('td');
    const removeTD = document.createElement('td');
    const removeBtn = document.createElement('button');

    nameTD.textContent = key;
    valueTD.textContent = value;
    valueTD.classList.add('value');
    removeBtn.textContent = 'Delete';
    removeBtn.dataset.role = 'remove-cookie';

    removeTD.append(removeBtn);
    tr.append(nameTD, valueTD, removeTD);
    fragment.append(tr);
  });

  listTable.innerHTML = '';
  listTable.append(fragment);
};

updateTable(cookiesMap);

const addCookie = () => {
  document.cookie = `${addNameInput.value.trim()}=${addValueInput.value.trim()}`;

  addNameInput.value = '';
  addValueInput.value = '';
};

addButton.addEventListener('click', () => {
  addCookie();
  updateTable(getCookies());
});

const removeCookie = (e) => {
  const currentRow = e.target.closest('tr');
  const nameTd = currentRow.querySelector('td');

  document.cookie = `${nameTd.textContent}=;max-age=0`;
};

listTable.addEventListener('click', (e) => {
  const { target } = e;
  if (target.dataset.role && target.dataset.role === 'remove-cookie') {
    removeCookie(e);
    updateTable(getCookies());
  }
});

function getFilterCookie(e) {
  const cookies = getCookies();
  const { value } = e.target;
  return new Map([...cookies].filter(([key]) => key.includes(value)));
}

filterNameInput.addEventListener('input', (e) => {
  updateTable(getFilterCookie(e));
});
