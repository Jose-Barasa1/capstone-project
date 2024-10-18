let cart = [];
let menuData = [];

// Fetching menu data
fetch("db.json")
  .then(response => response.json())
  .then(data => {
    menuData = data;
    displayMenu(menuData);
  })
  .catch(error => console.error('Error fetching menu:', error));

// Function to display the menu
function displayMenu(menuData) {
  const menuDiv = document.getElementById("menu");
  menuDiv.innerHTML = '';
  menuData.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "menu-item";
    itemDiv.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="food-img" />
      <span>${item.name} - Ksh ${item.price.toFixed(2)}</span>
      <input type="number" min="1" value="1" id="quantity-${item.id}" />
      <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
    `;
    menuDiv.appendChild(itemDiv);
  });

  // Add event listeners for the "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
      const itemId = parseInt(event.target.getAttribute('data-id'));
      addToCart(itemId);
    });
  });
}

// Function to filter the menu based on the search input
function filterMenu() {
  const searchInput = document.getElementById("search").value.toLowerCase();
  const filteredMenu = menuData.filter(item =>
    item.name.toLowerCase().includes(searchInput)
  );
  displayMenu(filteredMenu);
}

// Add event listener for the search input
document.getElementById("search").addEventListener('input', filterMenu);

// Function to add an item to the cart
function addToCart(itemId) {
  const quantity = parseInt(document.getElementById(`quantity-${itemId}`).value);
  const item = menuData.find(i => i.id === itemId);
  if (item) {
    const cartItem = cart.find(i => i.item.id === itemId);
    if (cartItem) {
      cartItem.quantity += quantity; // Update quantity if item already in cart
    } else {
      cart.push({ item: item, quantity: quantity }); // Add new item to cart
    }
    displayCart();
  }
}

// Function to display the cart
function displayCart() {
  const cartList = document.getElementById("cart");
  const totalPriceElem = document.getElementById("totalPrice");
  cartList.innerHTML = "";
  let totalPrice = 0;
  cart.forEach(cartItem => {
    const orderItem = document.createElement("li");
    const itemTotal = cartItem.item.price * cartItem.quantity;
    totalPrice += itemTotal;
    orderItem.innerHTML = `
      ${cartItem.quantity} x ${cartItem.item.name} - Ksh ${itemTotal.toFixed(2)}
      <button onclick="removeFromCart(${cartItem.item.id})">Remove</button>
    `;
    cartList.appendChild(orderItem);
  });
  totalPriceElem.textContent = totalPrice.toFixed(2);
}

// Function to remove an item from the cart
function removeFromCart(itemId) {
  const cartItemIndex = cart.findIndex(i => i.item.id === itemId);
  if (cartItemIndex !== -1) {
    cart[cartItemIndex].quantity -= 1;
    if (cart[cartItemIndex].quantity === 0) {
      cart.splice(cartItemIndex, 1); // Remove item from cart if quantity is zero
    }
  }
  displayCart();
}

// Function to confirm the order
function confirmOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before confirming the order.");
    return;
  }
  // Clear the cart
  cart = [];
  displayCart();
  // Show success message
  const successMessage = document.getElementById("successMessage");
  successMessage.textContent = "Your order has been successfully submitted!";
  successMessage.style.display = "block";
  // Optionally hide the message after a few seconds
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 5000);
}

// Add event listener for the confirm order button
document.getElementById("confirmOrderButton").addEventListener('click', confirmOrder);

// Add event listener for the clear cart button
document.getElementById("clearCartButton").addEventListener('click', () => {
  cart = [];
  displayCart();
});

// Initial call to display the menu
displayMenu(menuData);