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
    document.getElementById('root').prepend(newUserList);

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
    //userListItem.classList.add(gender === 'male' ? 'maleListItem' : 'femaleListItem');  
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

function userListItemClickHendler ({currentTarget}) {
    currentTarget.classList.toggle('userListItemHighlight');
    //добавляем надпись в строку
    const userSelectedFullName = currentTarget.querySelector('.userFullName').innerText;
    //console.log(`userSelectedFullName`, userSelectedFullName);
    if (currentTarget.classList.contains('userListItemHighlight')) {
        addSelectedFullNames(userSelectedFullName);
    } 
    else {
        removeUnselectedFullNames(userSelectedFullName);
    }
    
}

function addSelectedFullNames(selectedName) {
    //ищем див для имен, если уже он есть - добывляем текст, если нет - создаем
    let divSelectedNames = document.querySelector('.divSelectedNames');
    if (divSelectedNames) {
        divSelectedNames.textContent += ` ${selectedName},`;
    } 
    else {
       divSelectedNames = document.createElement('div');
       divSelectedNames.classList.add('divSelectedNames');
       divSelectedNames.textContent = `Selected persons: ${selectedName},`;
       const divRoot = document.querySelector('#root');
       divRoot.prepend(divSelectedNames);
    }
}

function removeUnselectedFullNames(unselectedName) {
    const divSelectedNames = document.querySelector('.divSelectedNames');
    const strNames = divSelectedNames.textContent;
    //console.log(`strNames`, strNames);
    divSelectedNames.textContent = strNames.replace(`${unselectedName},`,'');
}