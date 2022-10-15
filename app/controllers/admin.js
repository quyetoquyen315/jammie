import { Product } from "../models/productModel.js";
import { ValidatorSV } from "../models/validateModel.js";

let ProductList = [];
let validatorSV = new ValidatorSV();
const BASE_URL =
  "https://6271e18325fed8fcb5ec0cfb.mockapi.io/shop";

const turnOnLoading = function () {
  document.getElementById("loading").style.display = "flex";
};
const turnOffLoading = function () {
  document.getElementById("loading").style.display = "none";
};
const handleResetForm = function () {
  document.getElementById("this.name").value = "";
  document.getElementById("this.price").value = "";
  document.getElementById("this.chatLieu").value = "";
  document.getElementById("this.mauSac").value = "";
  document.getElementById("this.kieuDang").value = "";
  document.getElementById("this.img").value = "";
};

const getProductList = async () => {
  // turnOnLoading();
  let result = await axios.get(BASE_URL);
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

const handleDeleteProduct = async (id) => {
  turnOnLoading();
  try {
    const resp = await axios.delete(`${BASE_URL}/${id}`);
    // console.log(resp.data);
    turnOffLoading();
    await mapProductList();
    renderProductList(ProductList);
  } catch (err) {
    console.error(err);
    turnOffLoading();
  }
};
window.handleDeleteProduct = handleDeleteProduct;

const renderInforToForm = (data) => {
  document.getElementById("name").value = data.name;
  document.getElementById("price").value = data.price;
  document.getElementById("chatLieu").value = data.chatLieu;
  document.getElementById("mauSac").value = data.mauSac;
  document.getElementById("kieuDang").value = data.kieuDang;
  document.getElementById("img").value = data.img;
};

const getInfoProduct = async (id) => {
  turnOnLoading();
  try {
    const resp = await axios.get(`${BASE_URL}/${id}`);
    // console.log(resp.data);
    document.getElementById("idSP").style.display = "block";
    document.querySelector("#idSP span").innerHTML = resp.data.id;
    document.getElementById("btn-add").style.display = "none";
    document.getElementById("btn-update").style.display = "block";
    turnOffLoading();
    renderInforToForm(resp.data);
  } catch (err) {
    console.error(err);
    turnOffLoading();
  }
};
window.getInfoProduct = getInfoProduct;

const handleUpdateProduct = async () => {
  turnOnLoading();
  let productUpdate = getInforFromForm();
  try {
    let idSP = document.querySelector("#idSP span").innerHTML;
    const resp = await axios.put(`${BASE_URL}/${idSP}`, productUpdate);
    // console.log(resp.data);
    $("#modalAddProduct").modal("hide");
    turnOffLoading();
    await mapProductList();
    renderProductList(ProductList);
    handleResetForm();
  } catch (err) {
    console.error(err);
    turnOffLoading();
  }
};
window.handleUpdateProduct = handleUpdateProduct;

const renderProductList = (list) => {
  let contentHMTL = ``;
  list.forEach((product) => {
    let productTr = `
      <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.img}</td>
        <td>${product.chatLieu}</td>
        <td>${product.mauSac}</td>
        <td>${product.kieuDang}</td>
        <td>
          <button
            data-toggle="modal"
            data-target="#modalAddProduct"
            onclick="getInfoProduct(${product.id})"
            class="btn btn-success"
          >
            Edit
          </button>
          <button
            onclick="handleDeleteProduct(${product.id})"
            class="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    `;
    contentHMTL += productTr;
  });
  document.getElementById("table-body").innerHTML = contentHMTL;
};
renderProductList(ProductList);

const getInforFromForm = () => {
  //   let id = document.getElementById("id").value;
  let id = 0;
  let name = document.getElementById("name").value;
  let price = document.getElementById("price").value;
  let img = document.getElementById("img").value;
  let chatLieu = document.getElementById("chatLieu").value;
  let mauSac = document.getElementById("mauSac").value;
  let kieuDang = document.getElementById("kieuDang").value;
  return new Product(
    id,
    name,
    price,
    chatLieu,
    mauSac,
    kieuDang,
    img,
  );
};

document.getElementById("btn-add-product").onclick = function () {
  document.getElementById("btn-add").style.display = "block";
  document.getElementById("btn-update").style.display = "none";
  document.getElementById("idSP").style.display = "none";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("img").value = "";
  document.getElementById("chatLieu").value = "";
  document.getElementById("mauSac").value = "";
  document.getElementById("kieuDang").value = "";
};

const handleAddProduct = async () => {
  let isValid = true;

  // let isValidName = validatorSV.checkEmpty(
  //   "name",
  //   "span-name",
  //   "Name cannot be empty"
  // );

  // let isValidPrice =
  //   validatorSV.checkEmpty("price", "span-price", "Price cannot be empty") &&
  //   validatorSV.checkPrice("price", "span-price");

  // let isValidScreen = validatorSV.checkEmpty(
  //   "screen",
  //   "span-screen",
  //   "Screen cannot be empty"
  // );

  // let isValidBackCamera = validatorSV.checkEmpty(
  //   "backCamera",
  //   "span-backCamera",
  //   "Back Camera cannot be empty"
  // );

  // let isValidFrontCamera = validatorSV.checkEmpty(
  //   "frontCamera",
  //   "span-frontCamera",
  //   "Front Camera cannot be empty"
  // );

  // let isValidImg =
  //   validatorSV.checkEmpty("img", "span-img", "Img cannot be empty") &&
  //   validatorSV.checkImgLink("img", "span-img");

  // let isValidDesc = validatorSV.checkEmpty(
  //   "desc",
  //   "span-desc",
  //   "Description cannot be empty"
  // );

  // let isValidType = validatorSV.checkEmpty(
  //   "type",
  //   "span-type",
  //   "Type cannot be empty"
  // );

  // isValid =
  //   isValidName &&
  //   isValidPrice &&
  //   isValidScreen &&
  //   isValidBackCamera &&
  //   isValidFrontCamera &&
  //   isValidImg &&
  //   isValidDesc &&
  //   isValidType;

  if (isValid) {
    turnOnLoading();
    let newSP = getInforFromForm();
    console.log(newSP);
    try {
      const resp = await axios.post(BASE_URL, newSP);
      $("#modalAddProduct").modal("hide");
      // console.log(resp.data);
      // document.querySelector("body").classList.remove("modal-open");
      // document.querySelector("#modalAddProduct").classList.remove("show");
      // document.querySelector("#modalAddProduct").style.display = "none";
      turnOffLoading();
      await mapProductList();
      renderProductList(ProductList);
      handleResetForm();
    } catch (err) {
      console.error(err);
      turnOffLoading();
    }
  } else {
  }
};
window.handleAddProduct = handleAddProduct;
