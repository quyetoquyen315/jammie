// {
//     "name": "iphoneX",
//     "price": "1000",
//     "screen": "screen 68",
//     "backCamera": "2 camera 12 MP",
//     "frontCamera": "7 MP",
//     "img": "https://cdn.tgdd.vn/Products/Images/42/114115/iphone-x-64gb-hh-600x600.jpg",
//     "desc": "Thiết kế mang tính đột phá",
//     "type": "iphone"
//     }

export const Product = function (
  _id,
  _name,
  _price,
  _screen,
  _backCamera,
  _frontCamera,
  _img,
  _desc,
  _type
) {
  this.id = _id;
  this.name = _name;
  this.price = _price;
  this.screen = _screen;
  this.backCamera = _backCamera;
  this.frontCamera = _frontCamera;
  this.img = _img;
  this.desc = _desc;
  this.type = _type;
};

export const CartItem = function (_product, _quantity) {
  this.product = _product;
  this.quantity = _quantity;
};
