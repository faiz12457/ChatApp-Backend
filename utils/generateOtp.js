export function generateOtp() {
  let number = "";

  for (let i = 1; i <= 4; i++) {
    const randomNum = Math.floor(Math.random() * 10);
    number += randomNum;
  }

  return number.toString();
}