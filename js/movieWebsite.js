//各種搜尋範例：https://www.themoviedb.org/documentation/api/discover
//教學影片連結：https://www.youtube.com/watch?v=9Bvt6BFf6_U
//設定最基本的api base url
const baseUrl = "https://api.themoviedb.org/3";
//篩選電影條件，DOC內寫discover
const discoverMovie = "/discover/movie?";
//設定語言顯示
const lang = "&language=zh-TW"; //繁體中文

//設定一個api的變數，api數字前最前面加上 api_key=
const apiKey = "api_key=" + "124c4f1a8fabc44751c9147c8739d2da";
//篩選條件，可從官網的try it獲得
const filterMovie =
    "&sort_by=revenue.desc&include_adult=ture&include_video=false&with_watch_monetization_types=flatrate";
//官網每次僅能run一頁20筆資料，故頁碼使用for迴圈取得
const moviePage = "&page=";

//海報縮圖設定
const posterBaseUrl = "https://image.tmdb.org/t/p/w500";
// const posterPath = "";




//先列出前5頁的api，因為設定為票房最好的前100部電影，TMDB的1頁是20筆，且第1頁排序為1，故設定5頁
for (let i = 1; i <= 5; i++) {
    //組裝apiUrl
    const apiUrl =
        baseUrl + discoverMovie + apiKey + lang + filterMovie + moviePage + i;
    // console.log(apiUrl);//先確認每一個url都有抓到
    //取得api內容
    const xhr = new XMLHttpRequest();
    //get為取得資料，true為非同步
    xhr.open("get", apiUrl, true);
    xhr.send(null);

    //load時同時執行
    xhr.onload = function () {
        //第1筆資料排序為0，總共20筆
        for (let a = 0; a < 20; a++) {
            // 資料格式轉換：JSON.parse將字串轉換成物件
            const responseTextResults = JSON.parse(xhr.responseText).results[a];
            // console.log(responseTextResults); //確認資料格式轉換成功

            // 撈資料部分
            // 撈出電影名稱(title)
            const textResultsTitles = responseTextResults.title;
            // console.log(textResultsTitles);//確認撈取成功
            // 撈出電影評分
            const movieScore = responseTextResults.vote_average;
            // console.log(movieScore)//確認撈取成功
            // 撈出電影介紹
            const movieOverview = responseTextResults.overview;
            // console.log(movieOverview);//確認撈取成功
            // 撈出海報
            const posterPath = posterBaseUrl + responseTextResults.poster_path;
            // console.log(posterPath);//確認撈取成功


            // 將資料放入指定位置
            // HTML有設置一個class為movieList的UL
            const movieList = document.querySelector(".movieList");

            // 新增element標籤為LI
            let listItem = document.createElement("li");
            // 在LI內塞入剛剛撈取出來的電影名稱
            listItem.innerHTML = `
      <p>${textResultsTitles}</p>
      <span>${movieScore}</span>
      `;

            // 父節點.appendChild(子節點)
            movieList.appendChild(listItem);
        }
    };
}

//設定海報變數
const imgUrl = "https://image.tmdb.org/t/p/w500/";
//設定搜尋api
const searchUrl = baseUrl + "/search/movie?" + apiKey;
const searchPerson = baseUrl + "/search/person?" + apiKey;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

function showMovies(data) {
    main.innerHTML = "";

    data.forEach((movie) => {
        //創建一張電影資訊卡
        const { title, poster_path, vote_average, overview } = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
        <img class="movie-img"
                src="${imgUrl + poster_path}"
                alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">
                <h3 class="fz16">概述</h3>
                <p class="fz12">${overview}</p>
                
            </div>
        
        `;

        main.appendChild(movieEl);
    });
}

function getColor(vote) {
    if (vote >= 7) {
        return "highscore";
    } else if (7 > vote >= 4) {
        return "midscore";
    } else {
        return "lowscore";
    }
}

//搜尋功能
//TMDB提供的搜尋規則：https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=想要搜尋的內容

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {
        // &query= 是搜尋功能
        getMovies(searchUrl + "&query=" + searchTerm);
    } else {
        getMovies(apiUrl);
    }
});
