const textInput = document.getElementById("text-input");
const checkBtn = document.getElementById("check-btn");
const textResult = document.getElementById("result");

function cleanInputString() {
  const regex = /[a-z0-9]/gi;
  return textInput.value
    .replace(/\s+/, "")
    .toLowerCase()
    .match(regex)
    .toString();
}

function palindromeChecker() {
  let reversedInput = cleanInputString().split("").reverse().join("");
  let isPalindrome = cleanInputString() === reversedInput;
  return isPalindrome;
}

function update() {
  if (textInput.value === "") {
    alert("Please input a value");
    textResult.classList.add("hidden");
  } else {
    const result = palindromeChecker()
      ? " is a palindrome."
      : " is not a palindrome.";
    if (palindromeChecker()) {
      textResult.classList.remove("hidden");
      textResult.innerHTML = `<p class="user-input"><strong>${textInput.value}</strong>${result}</p>`;
      result;
    } else {
      textResult.classList.remove("hidden");
      textResult.innerHTML = `<p class="user-input"><strong>${textInput.value}</strong>${result}</p>`;
    }
  }
}

checkBtn.addEventListener("click", () => {
  update();
  textInput.value = "";
});

textInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    update();
    textInput.value = "";
  }
});
