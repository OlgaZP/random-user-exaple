'use strict';

const options = {
    results: 10,
    seed: "abc",
    page: 3,
}

fetch(`https://randomuser.me/api/?results=${options.results}&seed=${options.seed}&page=${options.page}`)
.then(response => response.json())
.then(({results}) => renderUsers(results));

function renderUsers(users) {
    console.dir(users);
    const liUserCollection = users.map(user => createUserListItem);
    const userList = document.getElementById("userList");
    userList.append();
}