// 25/5: setup 2hours
// 26/5: html/css 3hours + 1hoursFilter + 1hoursCart
// 4/6: 5hoursCart

import { Product, CartItem } from "../models/productModel.js";

let ProductList = [];
let cart = [];
const CART_LOCALSTORAGE = "CART_LOCALSTORAGE";
const BASE_URL =
  "https://6271e18325fed8fcb5ec0cfb.mockapi.io/shop";

const turnOnLoading = function () {
  document.getElementById("loading").style.display = "flex";
};
const turnOffLoading = function () {
  document.getElementById("loading").style.display = "none";
};

const saveLocalStorage = () => {
  let cartJson = JSON.stringify(cart);
  localStorage.setItem(CART_LOCALSTORAGE, cartJson);
};

//Lay du lieu tu localStorage khi user reload trang
let cartJson = localStorage.getItem(CART_LOCALSTORAGE);
//gán dữ liệu cho array gốc và render lại giao diện
if (cartJson) {
  cart = JSON.parse(cartJson);
  // console.log("cart: ", cart);
}

if (cart.length) {
  document.getElementById("cart-quantity").style.display = "block";
  document.getElementById("cart-quantity").innerHTML = cart.length;
} else {
  document.getElementById("cart-quantity").style.display = "none";
}

const getProductList = async () => {
  turnOnLoading();
  let result = await axios.get(BASE_URL);
  // console.log("getProductList:", result.data);
  turnOffLoading();
  return result.data;
};

const mapProductList = async () => {
  let ProductListRaw = await getProductList();
  // map lại dữ liệu từ api
  ProductList = ProductListRaw.map((product) => {
    return new Product(
      product.id,
      product.name,
      product.price,
      product.chatLieu,
      product.mauSac,
      product.kieuDang,
      product.img,
    );
  });
};
await mapProductList();

const renderProductList = (list) => {
  let contentHMTL = ``;
  list.forEach((product) => {
    let productDiv = `
      <div class="card">
        <div class="card__top">
          <i class="fa fa-award"></i>
          <span class="stock">Còn hàng</span>
        </div>
        <div class="card__img">
          <img
            class="product-img"
            src="${product.img}"
            alt="img"
          />
        </div>
        <div class="card__details">
          <h6 class="product-name">${product.name}</h6>
          <div class="product-description">
            <p>Chất liệu: ${product.chatLieu}</p>
            <p>Màu sắc: ${product.mauSac}</p>
            <p>kiểu dáng: ${product.kieuDang}</p>
          </div>
          <div class="purchase">
            <span class="product-price">${product.price} vnd</span>
            <button onclick="addtoCart(${product.id})" class="btn btn-success">Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    `;
    contentHMTL += productDiv;
  });
  document.getElementById("cardList").innerHTML = contentHMTL;
};
renderProductList(ProductList);

const handleDeleteProduct = (id) => {
  let index = cart.findIndex((item) => {
    return item.product.id == id;
  });
  cart.splice(index, 1);
  if (cart.length) {
    document.getElementById("cart-quantity").style.display = "block";
    document.getElementById("cart-quantity").innerHTML = cart.length;
  } else {
    document.getElementById("cart-quantity").style.display = "none";
  }
  saveLocalStorage();
  renderCartList(cart);
  renderPurchaseList(cart);
};
window.handleDeleteProduct = handleDeleteProduct;

const handleChangeQuantity = (id, quantity) => {
  let index = cart.findIndex((item) => {
    return item.product.id == id;
  });
  if (index !== -1) {
    cart[index].quantity = cart[index].quantity * 1 + quantity;
  }
  if (cart[index].quantity == 0) {
    cart.splice(index, 1);
  }
  saveLocalStorage();
  renderCartList(cart);
  renderPurchaseList(cart);
};
window.handleChangeQuantity = handleChangeQuantity;

const renderCartList = (list) => {
  let contentHMTL = ``;
  let totalPrice = list.reduce((totalPrice, item) => {
    return (totalPrice += item.product.price * item.quantity);
  }, 0);
  list.forEach((product) => {
    let productTr = `
      <tr>
        <td>
          <img width="130" height="100" style="object-fit: cover" src=${product.product.img} alt="img" />
        </td>
        <td>${product.product.name}</td>
        <td>
          <button onclick="handleChangeQuantity('${product.product.id}', -1)" class="mx-2 btn btn-danger">-</button>
          ${product.quantity}
          <button onclick="handleChangeQuantity('${product.product.id}', 1)" class="mx-2 btn btn-success">+</button>
        </td>
        <td>${product.product.price} vnd</td>
        <td>
          <button onclick="handleDeleteProduct('${product.product.id}')" class="btn btn-danger">Xóa khỏi giỏ hàng</button>
        </td>
      </tr>
    `;
    contentHMTL += productTr;
  });
  if (list.length) {
    document.querySelector("#cart__modal-body").style.display = "block";
    document.querySelector("#totalPrice").innerHTML = totalPrice;
    document.querySelector("#cart__modal-body tbody").innerHTML = contentHMTL;
    document.querySelector("#noneProduct").style.display = "none";
    document
      .querySelector("#btn-purchase")
      .removeAttribute("disabled", "disabled");
    document
      .querySelector("#btn-clearcart")
      .removeAttribute("disabled", "disabled");
  } else {
    document.querySelector("#noneProduct").style.display = "block";
    document.querySelector("#cart__modal-body").style.display = "none";
    document.querySelector("#totalPrice").innerHTML = 0;
    document
      .querySelector("#btn-purchase")
      .setAttribute("disabled", "disabled");
    document
      .querySelector("#btn-clearcart")
      .setAttribute("disabled", "disabled");
  }
};
renderCartList(cart);

const renderPurchaseList = (list) => {
  let contentHMTL = ``;
  let totalPrice = list.reduce((totalPrice, item) => {
    return (totalPrice += item.product.price * item.quantity);
  }, 0);
  list.forEach((product) => {
    let productTr = `
      <div class="d-flex justify-content-between display-5 m-3">
        <div>
          ${product.quantity} x ${product.product.name}
        </div>
        <div>${product.product.price * product.quantity} vnd</div>
      </div>
    `;
    contentHMTL += productTr;
  });
  document.querySelector("#purchase__total").innerHTML = totalPrice;
  document.querySelector(".purchase__modal-body-content").innerHTML =
    contentHMTL;
};
renderPurchaseList(cart);

const selectType = () => {
  let filterArray = [];
  let value = document.getElementById("selectType").value;
  if (value === "iphone") {
    for (let i = 0; i < ProductList.length; i++) {
      if (
        ProductList[i].type === "iphone" ||
        ProductList[i].type === "Iphone"
      ) {
        filterArray.push(ProductList[i]);
      }
    }
  } else if (value === "samsung") {
    for (let i = 0; i < ProductList.length; i++) {
      if (
        ProductList[i].type === "samsung" ||
        ProductList[i].type === "Samsung"
      ) {
        filterArray.push(ProductList[i]);
      }
    }
  } else if (value === "all") {
    filterArray = ProductList;
  }
  renderProductList(filterArray);
};
window.selectType = selectType;

const addtoCart = (id) => {
  let index = ProductList.findIndex((product) => {
    return product.id == id;
  });
  let newcartItem = new CartItem(ProductList[index], 1);
  let checkItemIndex = cart.findIndex((item) => {
    return item.product.id == newcartItem.product.id;
  });
  if (checkItemIndex == -1) {
    cart.push(newcartItem);
    // console.log(checkItemIndex, cart);
  } else {
    cart[checkItemIndex].quantity = cart[checkItemIndex].quantity * 1 + 1;
    // console.log(cart[checkItemIndex].quantity);
  }
  saveLocalStorage();
  renderCartList(cart);
  renderPurchaseList(cart);
  if (cart.length) {
    document.getElementById("cart-quantity").style.display = "block";
    document.getElementById("cart-quantity").innerHTML = cart.length;
  } else {
    document.getElementById("cart-quantity").style.display = "none";
  }
};
window.addtoCart = addtoCart;

const handleClearCart = () => {
  cart = [];
  saveLocalStorage();
  renderCartList(cart);
  renderPurchaseList(cart);
  if (cart.length) {
    document.getElementById("cart-quantity").style.display = "block";
    document.getElementById("cart-quantity").innerHTML = cart.length;
  } else {
    document.getElementById("cart-quantity").style.display = "none";
  }
};
window.handleClearCart = handleClearCart;

const handleOrder = () => {
  document.querySelector("#done__id").innerHTML = Math.floor(
    Math.random() * 100000
  );
  cart = [];
  saveLocalStorage();
  renderCartList(cart);
  renderPurchaseList(cart);
  if (cart.length) {
    document.getElementById("cart-quantity").style.display = "block";
    document.getElementById("cart-quantity").innerHTML = cart.length;
  } else {
    document.getElementById("cart-quantity").style.display = "none";
  }
};
window.handleOrder = handleOrder;
