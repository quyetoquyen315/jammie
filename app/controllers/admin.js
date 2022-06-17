import { Product } from "../models/productModel.js";
import { ValidatorSV } from "../models/validateModel.js";

let ProductList = [];
let validatorSV = new ValidatorSV();
const BASE_URL =
  "https://6271e18325fed8fcb5ec0cfb.mockapi.io/capstonejsproducts";

const turnOnLoading = function () {
  document.getElementById("loading").style.display = "flex";
};
const turnOffLoading = function () {
  document.getElementById("loading").style.display = "none";
};
const handleResetForm = function () {
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("screen").value = "";
  document.getElementById("backCamera").value = "";
  document.getElementById("frontCamera").value = "";
  document.getElementById("img").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("type").value = "";
};

const getProductList = async () => {
  turnOnLoading();
  let result = await axios.get(BASE_URL);
  console.log("getProductList:", result.data);
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
      product.screen,
      product.backCamera,
      product.frontCamera,
      product.img,
      product.desc,
      product.type
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
  document.getElementById("screen").value = data.screen;
  document.getElementById("backCamera").value = data.backCamera;
  document.getElementById("frontCamera").value = data.frontCamera;
  document.getElementById("img").value = data.img;
  document.getElementById("desc").value = data.desc;
  document.getElementById("type").value = data.type;
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
        <td>${product.type}</td>
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
  let screen = document.getElementById("screen").value;
  let backCamera = document.getElementById("backCamera").value;
  let frontCamera = document.getElementById("frontCamera").value;
  let img = document.getElementById("img").value;
  let desc = document.getElementById("desc").value;
  let type = document.getElementById("type").value;
  return new Product(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
};

document.getElementById("btn-add-product").onclick = function () {
  document.getElementById("btn-add").style.display = "block";
  document.getElementById("btn-update").style.display = "none";
  document.getElementById("idSP").style.display = "none";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("screen").value = "";
  document.getElementById("backCamera").value = "";
  document.getElementById("frontCamera").value = "";
  document.getElementById("img").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("type").value = "";
};

const handleAddProduct = async () => {
  let isValid = true;

  let isValidName = validatorSV.checkEmpty(
    "name",
    "span-name",
    "Name cannot be empty"
  );

  let isValidPrice =
    validatorSV.checkEmpty("price", "span-price", "Price cannot be empty") &&
    validatorSV.checkPrice("price", "span-price");

  let isValidScreen = validatorSV.checkEmpty(
    "screen",
    "span-screen",
    "Screen cannot be empty"
  );

  let isValidBackCamera = validatorSV.checkEmpty(
    "backCamera",
    "span-backCamera",
    "Back Camera cannot be empty"
  );

  let isValidFrontCamera = validatorSV.checkEmpty(
    "frontCamera",
    "span-frontCamera",
    "Front Camera cannot be empty"
  );

  let isValidImg =
    validatorSV.checkEmpty("img", "span-img", "Img cannot be empty") &&
    validatorSV.checkImgLink("img", "span-img");

  let isValidDesc = validatorSV.checkEmpty(
    "desc",
    "span-desc",
    "Description cannot be empty"
  );

  let isValidType = validatorSV.checkEmpty(
    "type",
    "span-type",
    "Type cannot be empty"
  );

  isValid =
    isValidName &&
    isValidPrice &&
    isValidScreen &&
    isValidBackCamera &&
    isValidFrontCamera &&
    isValidImg &&
    isValidDesc &&
    isValidType;

  if (isValid) {
    turnOnLoading();
    let newSP = getInforFromForm();
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
