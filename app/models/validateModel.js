export const ValidatorSV = function () {
  this.checkEmpty = function (idTarget, idError, messageError) {
    var valueTartget = document.getElementById(idTarget).value.trim();
    if (valueTartget == "") {
      document.getElementById(idError).innerText = messageError;
      return false;
    } else {
      document.getElementById(idError).innerText = "";
      return true;
    }
  };
  this.checkID = function (newSinhVien, danhSachSinhVien) {
    var index = danhSachSinhVien.findIndex(function (item) {
      return item.maSv == newSinhVien.maSv;
    });
    if (index == -1) {
      document.getElementById("spanMaSV").innerHTML = "";
      return true;
    } else {
      document.getElementById("spanMaSV").innerHTML = "Mã sinh viên đã tồn tại";
      return false;
    }
  };
  this.checkPrice = function (idTarger, idError) {
    let pattern = /^[0-9]+$/;
    let valueInput = document.getElementById(idTarger).value;
    if (pattern.test(valueInput)) {
      document.getElementById(idError).innerText = "";
      return true;
    } else {
      document.getElementById(idError).innerText = "Please enter the number";
      return false;
    }
  };
  this.checkImgLink = function (idTarger, idError) {
    let pattern = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
    let valueInput = document.getElementById(idTarger).value;
    if (pattern.test(valueInput)) {
      document.getElementById(idError).innerText = "";
      return true;
    } else {
      document.getElementById(idError).innerText = "Please enter an image URL";
      return false;
    }
  };
  this.checkEmail = function (idTarger, idError) {
    let pattern = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
    let valueInput = document.getElementById(idTarger).value;
    if (pattern.test(valueInput)) {
      document.getElementById(idError).innerText = "";
      return true;
    } else {
      document.getElementById(idError).innerText = "Email không hợp lệ";
      return false;
    }
  };
};
