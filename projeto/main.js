const cart = new Map();
const cartList = document.querySelector("#cart-list");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const cartEmpty = document.querySelector("#cart-empty");
const checkoutForm = document.querySelector("#checkout-form");
const paymentMethod = document.querySelector("#payment-method");
const cashChangeGroup = document.querySelector("#cash-change-group");
const cashChange = document.querySelector("#cash-change");

const formatPrice = (cents) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
}).format(cents / 100);

function renderCart() {
    cartList.replaceChildren();

    let itemCount = 0;
    let total = 0;

    for (const [name, item] of cart) {
        itemCount += item.quantity;
        total += item.price * item.quantity;

        const row = document.createElement("li");
        row.className = "cart-item";

        const description = document.createElement("span");
        description.className = "cart-item-description";
        description.textContent = `${name} — ${formatPrice(item.price * item.quantity)}`;

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.textContent = "−";
        decrease.setAttribute("aria-label", `Diminuir quantidade de ${name}`);
        decrease.dataset.cartAction = "decrease";
        decrease.dataset.product = name;

        const quantity = document.createElement("span");
        quantity.textContent = String(item.quantity);
        quantity.setAttribute("aria-label", `Quantidade: ${item.quantity}`);

        const increase = document.createElement("button");
        increase.type = "button";
        increase.textContent = "+";
        increase.setAttribute("aria-label", `Aumentar quantidade de ${name}`);
        increase.dataset.cartAction = "increase";
        increase.dataset.product = name;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-item";
        remove.textContent = "Remover";
        remove.setAttribute("aria-label", `Remover ${name} do carrinho`);
        remove.dataset.cartAction = "remove";
        remove.dataset.product = name;

        controls.append(decrease, quantity, increase, remove);
        row.append(description, controls);
        cartList.append(row);
    }

    cartCount.textContent = String(itemCount);
    cartTotal.textContent = formatPrice(total);
    cartEmpty.hidden = itemCount > 0;
    checkoutForm.querySelector('button[type="submit"]').disabled = itemCount === 0;
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
        const { product, price } = button.dataset;
        const cents = Number(price);

        if (!product || !Number.isSafeInteger(cents) || cents < 0) {
            console.error("Produto inválido no cardápio.", button);
            return;
        }

        const existing = cart.get(product);
        cart.set(product, {
            price: cents,
            quantity: existing ? existing.quantity + 1 : 1
        });
        renderCart();
    });
});

cartList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-cart-action]");
    if (!button) return;

    const item = cart.get(button.dataset.product);
    if (!item) return;

    if (button.dataset.cartAction === "increase") {
        item.quantity += 1;
    } else if (button.dataset.cartAction === "decrease") {
        item.quantity -= 1;
        if (item.quantity <= 0) cart.delete(button.dataset.product);
    } else if (button.dataset.cartAction === "remove") {
        cart.delete(button.dataset.product);
    }

    renderCart();
});

paymentMethod.addEventListener("change", () => {
    const needsChange = paymentMethod.value === "Dinheiro";
    cashChangeGroup.hidden = !needsChange;
    cashChange.required = false;
    if (!needsChange) cashChange.value = "";
});

checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (cart.size === 0) return;

    const formData = new FormData(checkoutForm);
    const lines = [...cart].map(([name, item]) =>
        `• ${item.quantity}x ${name} — ${formatPrice(item.price * item.quantity)}`
    );
    const total = [...cart.values()].reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const changeText = formData.get("payment") === "Dinheiro" && formData.get("change")
        ? `\nTroco para: ${formatPrice(Math.round(Number(formData.get("change")) * 100))}`
        : "";
    const notes = String(formData.get("notes") || "").trim();
    const message = [
        "Olá! Gostaria de fazer este pedido:",
        "",
        ...lines,
        `\nTotal: ${formatPrice(total)}`,
        `Nome: ${formData.get("name")}`,
        `Endereço: ${formData.get("address")}`,
        `Pagamento: ${formData.get("payment")}${changeText}`,
        ...(notes ? [`Observações: ${notes}`] : [])
    ].join("\n");

    window.open(
        `https://wa.me/5583994138238?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer"
    );
});

renderCart();