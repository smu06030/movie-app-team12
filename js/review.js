const PUBLIC_KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SECRET_KEY = "ZYXWVUTSRQPONMLKJIHGFEDCBA";

let reviewList = [];

const urlParams = new URLSearchParams(window.location.search); // URL query parameter 가져오기
const movieId = urlParams.get("id"); // 매개변수 id 값 가져오기

const reviewId = "review" + movieId;

// 암호화
function encrypt(values) {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(PUBLIC_KEY);

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(values), SECRET_KEY);
  return encrypted.toString();
}

// 복호화
function decrypt(encryptedData) {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return decrypted.toString(CryptoJS.enc.Utf8).replaceAll('"', "");
}

// 리뷰 가져오기
function getReview() {
  if (JSON.parse(localStorage.getItem(reviewId)) !== null) {
    reviewList = [...JSON.parse(localStorage.getItem(reviewId))];
  }

  const reviewBox = document.querySelector(".reviewBox");
  reviewBox.innerHTML = "";
  for (let i = 0; i < reviewList.length; i++) {
    let tempHtml = `
<div class="reviewItem">
                <div class="reviewAuthor">${reviewList[i]["user"]}</div>
                <div class="reviewContent">${reviewList[i]["review"]}</div>
                <div class="reviewActions">
                    <button onclick="updateReview(${i})" class="btn update">수정</button>
                    <button onclick="deleteReview(${i})" class="btn delete">삭제</button>
                </div>
            </div>
            <hr>
        `;
    // <div>
    //     <div>${reviewList[i]["user"]}</div>
    //     <div>${reviewList[i]["review"]}</div>
    //     <button onclick="updateReview(${i})">수정</button>
    //     <button onclick="deleteReview(${i})">삭제</button>
    // </div>
    // <hr>

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

  const person = { user, password: encrypt(password), review };

  if (user === "") {
    alert("작성자를 입력해주세요.");
    return;
  } else if (user.length < 2) {
    alert("작성자는 최소 2글자 이상 입력해야 합니다.");
    return;
  } else if (password === "") {
    alert("비밀번호를 입력해주세요.");
    return;
  } else if (password.length < 4) {
    alert("비밀번호는 최소 4글자 이상 입력해야 합니다.");
    return;
  } else if (review === "") {
    alert("리뷰를 입력해주세요.");
    return;
  } else if (review.length < 10) {
    alert("리뷰는 최소 10글자 이상 입력해야 합니다.");
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

  if (checkPassword === decrypt(reviewList[index]["password"])) {
    const updateTemp = prompt(
      "리뷰를 수정해주세요.",
      reviewList[index]["review"]
    );
    reviewList[index]["review"] =
      updateTemp === null ? reviewList[index]["review"] : updateTemp;
    reviewSetItem();
  } else if (checkPassword !== null) {
    alert("잘못된 비밀번호 입니다. 정확한 비밀번호를 입력해주세요.");
    return;
  }
}

// 리뷰 삭제하기
function deleteReview(index) {
  const checkPassword = prompt("비밀번호를 입력해주세요");

  if (checkPassword === decrypt(reviewList[index]["password"])) {
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

// 추가된부분 css적용 위한 class선언
document.addEventListener("DOMContentLoaded", () => {
  // input 요소와 button 요소를 선택
  const input = document.querySelector("#review");
  const button = document.querySelector(".inputValue button");

  // 요소가 존재하는지 확인한 후 클래스를 추가
  if (input && button) {
    input.classList.add("reviewInput");
    button.classList.add("reviewButton");
  }
});

window.onload = () => {
  getReview();
};
