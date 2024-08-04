let reviewList = [];

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
        localStorage.setItem("review", JSON.stringify(reviewList));

        getReview();

        document.getElementById("user").value = "";
        document.getElementById("password").value = "";
        document.getElementById("review").value = "";
    }
}

// 리뷰 수정하기
function updateReview(index) {
    const updateTemp = prompt("리뷰를 수정해주세요.", reviewList[index]["review"]);
    reviewList[index]["review"] = updateTemp;
    localStorage.setItem("review", JSON.stringify(reviewList));

    getReview();
}

// 리뷰 삭제하기
function deleteReview(index) {
    const deleteTemp = confirm("정말 삭제하시겠습니까?");
    if (deleteTemp) {
        reviewList.splice(index, 1);
        localStorage.setItem("review", JSON.stringify(reviewList));

        getReview();
    }
}

window.onload = () => {
    getReview();
};
