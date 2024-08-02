let reviewList = [];

// 리뷰 저장
function setReview() {
    const person = {
        user: document.getElementById("user").value,
        password: document.getElementById("password").value,
        review: document.getElementById("review").value,
    };

    reviewList = [...reviewList, person];
    localStorage.setItem("review", JSON.stringify(reviewList));

    getReview();
}

// 리뷰 가져오기
function getReview() {
    if (localStorage.length > 0) {
        reviewList = [...JSON.parse(localStorage.getItem("review"))];
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

// 리뷰 삭제하기
function deleteReview(index) {
    reviewList.splice(index, 1);
    localStorage.setItem("review", JSON.stringify(reviewList));

    getReview();
}

window.onload = () => {
    getReview();
};
