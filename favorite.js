(function () {
  const HOST_URL = "https://lighthouse-user-api.herokuapp.com/";
  const DATA_URL = `${HOST_URL}api/v1/users/`;
  const userData = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const users = document.querySelector('.users')
  const userName = document.querySelector(".modal-title");
  const userAvatar = document.querySelector("#user-avatar");
  const userInfo = document.querySelector("#user-info");

  renderUsers(userData)

  //呼叫所有使用者
  function renderUsers(userData) {
    if (userData.length === 0) {
      users.innerHTML = `<div class="col-12 d-flex justify-content-center"><h1>尚未收藏使用者!!</h1></div>`
    } else {
      let htmlContent = ''
      userData.forEach(user => {
        htmlContent += `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
    <div class="card shadow mb-4 text-center">
      <div class="hovereffect">
        <img class="card-img-top user-avatar" src="${user.avatar}" data-id="${user.id}" data-toggle="modal" data-target="#exampleModalCenter">
        <div class="card-body text-primary">
          <p class="card-text text-center text-wrap font-weight-bolder" style="font-size:16px;">${user.name} ${user.surname}<span style="color: gray;"><i class="fas fa-trash-alt ml-1" id="delete" data-id="${user.id}"></i></span></p>
        </div>
        </div>
    </div>
  </div>
    `;
        users.innerHTML = htmlContent
      });
    }
  }

  //照片觸發事件
  users.addEventListener("click", () => {
    if (event.target.matches(".user-avatar")) {
      // console.log(event.target)
      //清空上一張的圖片
      userAvatar.src = "";
      // console.log(event.target.dataset.id);
      showSingleUser(event.target.dataset.id);
    } else if (event.target.matches("#delete")) {
      removeFavoriteItem(event.target.dataset.id)
    }
  });

  //呼叫單一使用者API
  function showSingleUser(userId) {
    axios
      .get(`${DATA_URL}${userId}`)
      .then(res => {
        // console.log(res.data);
        userName.innerHTML = `${res.data.name} ${res.data.surname}`;
        userAvatar.src = res.data.avatar;
        userInfo.innerHTML = `
          <div id="user-age"><i class="fas fa-user-circle mr-3"></i>${res.data.age} years old</div>
          <div id="user-region"><i class="fas fa-flag mr-3"></i>${res.data.region}</div>
          <div id="user-birth"><i class="fas fa-baby mr-3"></i>${res.data.birthday}</div>
          <div id="user-email"><i class="fas fa-envelope mr-3"></i>${res.data.email}</div>
          <br><small id="created" class="text-muted">Created:${res.data.created_at}</small>
        `;
      })
      .catch(err => console.log(err));
  }

  //刪除收藏用戶
  function removeFavoriteItem(id) {
    const index = userData.findIndex(user => user.id === Number(id))
    if (index === -1) return
    userData.splice(index, 1)
    localStorage.setItem('favoriteUsers', JSON.stringify(userData))
    renderUsers(userData)
  }
})()