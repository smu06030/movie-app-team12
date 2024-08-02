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
                <button>수정</button>
                <button>삭제</button>
            </div>
            <hr>
        `;
        reviewBox.innerHTML += tempHtml;
    }
}

window.onload = () => {
    getReview();
};
