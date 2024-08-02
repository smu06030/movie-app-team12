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
