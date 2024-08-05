let reviewList = [];

const urlParams = new URLSearchParams(window.location.search); // URL query parameter 가져오기
const movieId = urlParams.get("id"); // 매개변수 id 값 가져오기

const reviewId = "review" + movieId;

// 리뷰 가져오기
function getReview() {
    if (JSON.parse(localStorage.getItem(reviewId)) !== null) {
        reviewList = [...JSON.parse(localStorage.getItem(reviewId))];
    }

    const reviewBox = document.querySelector(".reviewBox");
    reviewBox.innerHTML = "";
    for (let i = 0; i < reviewList.length; i++) {
        let tempHtml = `
            <div>
                <div>${reviewList[i]["user"]}</div>
                <div>${reviewList[i]["review"]}</div>
                <button onclick="updateReview(${i})">수정</button>
                <button onclick="deleteReview(${i})">삭제</button>
            </div>
            <hr>
        `;
        reviewBox.innerHTML += tempHtml;
    }
}

// 리뷰 setItem 공통함수
function reviewSetItem() {
    if (movieId !== null) {
        localStorage.setItem(reviewId, JSON.stringify(reviewList));

        getReview();
    }
}

// 리뷰 저장
function setReview() {
    let user = document.getElementById("user").value;
    let password = document.getElementById("password").value;
    let review = document.getElementById("review").value;

    const person = { user, password, review };

    if (user === "") {
        alert("작성자를 입력해주세요.");
        return;
    } else if (password === "") {
        alert("비밀번호를 입력해주세요.");
        return;
    } else if (review === "") {
        alert("리뷰를 입력해주세요.");
        return;
    } else {
        reviewList = [...reviewList, person];
        reviewSetItem();

        document.getElementById("user").value = "";
        document.getElementById("password").value = "";
        document.getElementById("review").value = "";
    }
}

// 리뷰 수정하기
function updateReview(index) {
    const checkPassword = prompt("비밀번호를 입력해주세요");

    console.log(checkPassword);
    if (checkPassword === reviewList[index]["password"]) {
        const updateTemp = prompt("리뷰를 수정해주세요.", reviewList[index]["review"]);
        reviewList[index]["review"] = updateTemp;
        reviewSetItem();
    } else if (checkPassword !== null) {
        alert("잘못된 비밀번호 입니다. 정확한 비밀번호를 입력해주세요.");
        return;
    }
}

// 리뷰 삭제하기
function deleteReview(index) {
    const checkPassword = prompt("비밀번호를 입력해주세요");

    if (checkPassword === reviewList[index]["password"]) {
        const deleteTemp = confirm("정말 삭제하시겠습니까?");
        if (deleteTemp) {
            reviewList.splice(index, 1);
            reviewSetItem();
        }
    } else if (checkPassword !== null) {
        alert("잘못된 비밀번호 입니다. 정확한 비밀번호를 입력해주세요.");
        return;
    }
}

window.onload = () => {
    getReview();
};
