// document.addEventListener("DOMContentLoaded", function () {
//   fetch("items/arrivals.json")
//     .then((response) => response.json())
//     .then((data) => {
//       const container = document.querySelector(".centered.ravi");
//       container.innerHTML = "";

//       data.forEach((item) => {
//         const productDiv = document.createElement("div");
//         productDiv.classList.add("product");

//         const formattedName = item.name.replace(/(Graphite)/, "<br>$1");

//         productDiv.innerHTML = `
//                     <img src="./asserts/Favorite_duotone.svg" alt="Favorite">
//                     <img src="${item.image}" alt="${item.name}">
//                     <p id="desc">${formattedName}</p>
//                     <p id="price">${item.price}</p>
//                     <button id="buy-now">Buy Now</button>
//                 `;

//         container.appendChild(productDiv);
//       });
//     })
//     .catch((error) => console.error("Error loading arrivals.json:", error));
// });

// fetch("items/discounts.json")
//   .then((response) => response.json())
//   .then((products) => {
//     const productContainer = document.getElementById("product-container");

//     products.forEach((product) => {
//       const productElement = document.createElement("div");
//       productElement.classList.add("product");

//       productElement.innerHTML = `
//         <img class="favorite-icon" src="./asserts/Favorite_duotone.svg" alt="favorite" />
//         <img src="${product.image}" alt="${product.name}" />
//         <p id="desc">${product.name}</p>
//         <p id="price">${product.price}</p>
//         <button class="buy-now" data-product-id="${product.id}">Buy Now</button>
//       `;

//       productContainer.appendChild(productElement);
//     });

//     const favoriteIcons = document.querySelectorAll(".favorite-icon");
//     favoriteIcons.forEach((icon) => {
//       icon.addEventListener("click", () => {
//         icon.classList.toggle("favorite");
//       });
//     });

//     const buyNowButtons = document.querySelectorAll(".buy-now");
//     buyNowButtons.forEach((button) => {
//       button.addEventListener("click", (e) => {
//         const productId = e.target.getAttribute("data-product-id");
//         const product = products.find((p) => p.id === parseInt(productId));

//         let cart = JSON.parse(localStorage.getItem("cart")) || [];
//         cart.push(product);
//         localStorage.setItem("cart", JSON.stringify(cart));

//         window.location.href = "cart.html";
//       });
//     });
//   })
//   .catch((error) => {
//     console.error("Error loading JSON data:", error);
//   });
