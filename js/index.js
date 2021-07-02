'use strict';

const options = {
    results: 12,
    seed: "abc",
    page: 1,
}

loadUsers(options);

const [btnFirst, btnPrev, btnNext, btnNumPage] = document.querySelectorAll('button');
btnFirst.addEventListener('click', btnFirstHandler);
btnPrev.addEventListener('click', btnPrevHandler);
btnNext.addEventListener('click', btnNextHandler);
//кнопка перехода по номеру страницы
btnNumPage.addEventListener('click', btnNumPageHandler);

function btnFirstHandler (e) {
    options.page = 1;
    loadUsers(options);
}

function btnPrevHandler (e) {
    if (options.page >= 1) {
        options.page--;
        loadUsers(options);
    }    
}

function btnNextHandler (e) {
    options.page++;
    loadUsers(options);
}

function btnNumPageHandler (e) {
    options.page = document.getElementById('selectPage').value;
    loadUsers(options);
}

function loadUsers ({results, seed, page}) {
    fetch(`https://randomuser.me/api/?results=${results}&seed=${seed}&page=${page}`)
    .then(response => response.json())
    .then(({results}) => renderUsers(results));
}

function renderUsers(users) {
    console.dir(users);
    const userList = document.querySelector('.userList');
    if (userList) {
        userList.remove();
    }
    
    const newUserList = document.createElement('ul');
    newUserList.classList.add('userList');
    //document.getElementById('root').prepend(newUserList);
    document.querySelector('.divSelectedNames').after(newUserList);

    const liUserCollection = users.map(user => createUserListItem(user));
    
    newUserList.append(...liUserCollection);
}

function createUserListItem ({ 
    gender,
    name: {first: firstName, last: lastName}, 
    location: {city, state},
    email,
    picture: {large: userImageSrc},
    dob: {age: userAge},
}) {

    const userListItem = document.createElement('li');
    userListItem.classList.add('userListItem');    
    
    userListItem.append(createUserImage(userImageSrc));   
    //добавляем дополнительно стилизацию в зависимости от пола пользователя 
    //меняется цвет текста для полного имени    
    userListItem.append(createUserFullName(firstName, lastName, gender));
    userListItem.append(createUserAge(userAge));
    //добавляем дополнительно email пользователя и его город
    userListItem.append(createUserLocation(city, state));
    userListItem.append(createUserEmail(email));
    //userListItem.onclick = ({currentTarget}) => {currentTarget.classList.toggle('userListItemHighlight');};
    userListItem.addEventListener('click', userListItemClickHendler);

    return userListItem;
}

function createUserImage(userImageSrc) {
    // const imgContainer = document.createElement('div');
    // imgContainer.classList.add('userListItemTop');
    const img = new Image();
    img.src = userImageSrc;
    img.alt = 'user profile image';    
    // imgContainer.appendChild(img);
    // return imgContainer;
    return img;
}

function createUserFullName(firstName, lastName, gender) {
    const div = document.createElement('div');
    div.textContent = `${firstName} ${lastName}`;
    div.classList.add('userFullName');
    div.classList.add(gender === 'male' ? 'maleListItem' : 'femaleListItem');

    return div;
}

function createUserAge(age) {
    const div = document.createElement('div');
    div.textContent = `Age: ${age}`;

    return div;
}

function createUserLocation(city, state) {
    const div = document.createElement('div');
    div.textContent = `${city}, ${state}`;
    div.classList.add('userLocation');

    return div;
}

function createUserEmail(email) {
    const div = document.createElement('div');
    div.textContent = email;
    div.classList.add('userEmail');

    return div;
}

//массив хранит выбранных пользователей
const selectedUsernames = [];

function userListItemClickHendler ({currentTarget}) {
    currentTarget.classList.toggle('userListItemHighlight');
    //добавляем надпись в строку
    const userSelectedFullName = currentTarget.querySelector('.userFullName').innerText;
    //console.log(`userSelectedFullName`, userSelectedFullName);
    currentTarget.classList.contains('userListItemHighlight')  
        ? addSelectedFullNames(userSelectedFullName)
        : removeUnselectedFullNames(userSelectedFullName);
    displaySelectedUsers(selectedUsernames);
}

function addSelectedFullNames(selectedName) {
    //проверяем есть ли уже такое имя в массиве и добавляем в див если нет    
    if (!selectedUsernames.includes(selectedName)) {
        selectedUsernames.push(selectedName);
    }         
}

function removeUnselectedFullNames(unselectedName) {       
    const delIndex = selectedUsernames.indexOf(unselectedName);
    if (delIndex > -1) {
        selectedUsernames.splice(delIndex, 1);
    }    
}

function displaySelectedUsers (selectedUsernames) {
    const divSelectedNames = document.querySelector('.divSelectedNames'); 
    divSelectedNames.textContent = `Selected persons: ${selectedUsernames.join(', ')}`;
}