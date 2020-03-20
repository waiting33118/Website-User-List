(function () {
  const HOST_URL = "https://lighthouse-user-api.herokuapp.com/";
  const DATA_URL = `${HOST_URL}api/v1/users/`;
  const userData = [];
  let paginationData = []
  let maleData = []
  let femaleData = []
  const users = document.querySelector(".users");
  const userName = document.querySelector(".modal-title");
  const userAvatar = document.querySelector("#user-avatar");
  const userInfo = document.querySelector("#user-info");
  const pagination = document.querySelector('#pagination')
  const genderFilter = document.querySelector('#gender-filter')
  const USER_PER_PAGE = 12
  let pageNum = 1
  let paginationFirstNum = 1
  let paginationLastNum = 5
  let genderStatus = 'all'

  //渲染頁面架構
  axios
    .get(DATA_URL)
    .then(res => {
      userData.push(...res.data.results);
      console.log(userData);
      maleData = userData.filter(user => user.gender === 'male')
      femaleData = userData.filter(user => user.gender === 'female')
      getTotalPage(paginationFirstNum, paginationLastNum)
      getPageData(pageNum, userData)

    })
    .catch(err => {
      console.log(err);
    });

  //照片觸發事件
  users.addEventListener("click", () => {
    if (event.target.matches(".user-avatar")) {
      // console.log(event.target)
      //清空上一張的圖片
      userAvatar.src = "";
      console.log(event.target.dataset.id);
      const userId = event.target.dataset.id;
      showSingleUser(userId);
    }
  });

  //頁碼切換事件監聽
  pagination.addEventListener('click', () => {
    if (event.target.matches('#Previous')) {
      // Pagination減
      if (genderStatus === 'male') {
        let maxPages = Math.ceil(maleData.length / USER_PER_PAGE)
        let maxPageNum = maxPages - 4
        console.log({ maxPages, maxPageNum })
        pagePrevious()
      } else if (genderStatus === 'female') {
        let maxPages = Math.ceil(femaleData.length / USER_PER_PAGE)
        let maxPageNum = maxPages - 4
        console.log({ maxPages, maxPageNum })
        pagePrevious()
      } else {
        let maxPages = Math.ceil(userData.length / USER_PER_PAGE)
        let maxPageNum = maxPages - 4
        console.log({ maxPages, maxPageNum })
        pagePrevious()
      }
    } else if (event.target.matches('#Next')) {
      // Pagination加
      if (genderStatus === 'male') {
        let maxPages = Math.ceil(maleData.length / USER_PER_PAGE)
        let maxPageNum = maxPages - 4
        console.log({ maxPages, maxPageNum })
        pageNext(maxPageNum)
      } else if (genderStatus === 'female') {
        let maxPages = Math.ceil(femaleData.length / USER_PER_PAGE)
        let maxPageNum = maxPages - 4
        console.log({ maxPages, maxPageNum })
        pageNext(maxPageNum)
      } else {
        let maxPages = Math.ceil(userData.length / USER_PER_PAGE)
        let maxPageNum = maxPages - 4
        console.log({ maxPages, maxPageNum })
        pageNext(maxPageNum)
      }
    } else if (event.target.tagName === 'A') {
      pageNum = event.target.dataset.page
      if (genderStatus === 'male') {
        getPageData(pageNum, maleData)
      } else if (genderStatus === 'female') {
        getPageData(pageNum, femaleData)
      } else {
        getPageData(pageNum, userData)
      }
    }
  })

  //性別篩選事件監聽
  genderFilter.addEventListener('click', () => {
    if (event.target.dataset.gender === 'male') {
      genderStatus = event.target.dataset.gender
      pageNum = 1
      paginationFirstNum = 1
      paginationLastNum = 5
      getTotalPage(paginationFirstNum, paginationLastNum)
      getPageData(pageNum, maleData)
    } else if (event.target.dataset.gender === 'female') {
      genderStatus = event.target.dataset.gender
      pageNum = 1
      paginationFirstNum = 1
      paginationLastNum = 5
      getTotalPage(paginationFirstNum, paginationLastNum)
      getPageData(pageNum, femaleData)
    } else {
      genderStatus = event.target.dataset.gender
      pageNum = 1
      paginationFirstNum = 1
      paginationLastNum = 5
      getTotalPage(paginationFirstNum, paginationLastNum)
      getPageData(pageNum, userData)
    }
  })

  //呼叫所有使用者API
  function renderUsers(userData) {
    let htmlContent = ''
    userData.forEach(user => {
      htmlContent += `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
    <div class="card shadow mb-4 text-center">
      <div class="hovereffect">
        <img class="card-img-top user-avatar" src="${user.avatar}" data-id="${user.id}" data-toggle="modal" data-target="#exampleModalCenter">
        <div class="card-body text-primary">
          <p class="card-text text-center text-wrap font-weight-bolder" style="font-size:16px;">${user.name} ${user.surname}</p>
        </div>
        </div>
    </div>
  </div>
    `;
      users.innerHTML = htmlContent
    });
  }

  //呼叫單一使用者API
  function showSingleUser(userId) {
    axios
      .get(`${DATA_URL}${userId}`)
      .then(res => {
        console.log(res.data);
        userName.innerHTML = `${res.data.name} ${res.data.surname}`;
        userAvatar.src = res.data.avatar;
        userInfo.innerHTML = `
          <div id="user-age" >Age:${res.data.age} </div >
          <div id="user-region">Region:${res.data.region} </div>
          <div id="user-birth">Birthday:${res.data.birthday} </div>
          <div id="user-email">Email:${res.data.email} </div>
          <br><small id="created" class="text-muted">Created:${res.data.created_at}</small>
        `;
      })
      .catch(err => console.log(err));
  }

  //產生Pagination頁碼
  function getTotalPage(paginationFirstNum, paginationLastNum) {
    let htmlContent = ''
    htmlContent += `
    <li class="page-item">
      <a class="page-link" id="Previous" href="javascript:;" aria-label="Previous">
        <span id="Previous" aria-hidden="true">&laquo;</span>
      </a>
    </li>`
    for (let i = paginationFirstNum; i <= paginationLastNum; i++) {
      htmlContent += `
      <li class="page-item"><a class="page-link" data-page="${i}" href="JavaScript:;">${i}</a></li>
    `
    }
    htmlContent += `
    <li class="page-item">
      <a class="page-link" id="Next" href="javascript:;" aria-label="Next">
        <span id="Next" aria-hidden="true">&raquo;</span>
      </a>
    </li>`
    pagination.innerHTML = htmlContent
  }
  // 獲取當前頁面使用者Card
  function getPageData(pageNum, userData) {
    paginationData = userData
    // console.log(paginationData)
    let offset = (pageNum - 1) * USER_PER_PAGE
    let pageData = paginationData.slice(offset, offset + USER_PER_PAGE)
    // console.log(pageData)
    renderUsers(pageData)
  }

  function pagePrevious() {
    if (paginationFirstNum === 1) {
      return
    } else {
      paginationFirstNum--
      paginationLastNum--
      getTotalPage(paginationFirstNum, paginationLastNum)
    }
  }

  function pageNext(maxPageNum) {
    if (paginationFirstNum === maxPageNum) {
      return
    } else {
      paginationFirstNum++
      paginationLastNum++
      getTotalPage(paginationFirstNum, paginationLastNum)
    }
  }

})();
