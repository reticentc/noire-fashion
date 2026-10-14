
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

import { onAuthStateChanged } from
    "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import { auth, db } from "./firebase.js";

let currentUser = null;
let cartReady = false;
let saveQueue = Promise.resolve();

function getCartReference(userId) {
    return doc(db, "users", userId, "cart", "current");
}

window.addEventListener("noire-cart-updated", () => {
    if (!currentUser || !cartReady) return;

    const userId = currentUser.uid;

    const items = window.noireCart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
    }));

    saveQueue = saveQueue
        .catch(() => {})
        .then(() => {
            // Do not save to an account that has since signed out.
            if (!currentUser || currentUser.uid !== userId) return;

            return setDoc(getCartReference(userId), {
                items,
                updatedAt: serverTimestamp()
            });
        })
        .catch(error => {
            console.error("NOIRÉ cart save failed:", error);
        });
});

onAuthStateChanged(auth, async user => {
    currentUser = user;
    cartReady = false;

    if (!user) {
        window.noireCart.splice(0);
        window.renderNoireCart();
        return;
    }

    try {
        const snapshot = await getDoc(getCartReference(user.uid));

        // Ignore a response if the customer changed accounts while loading.
        if (!currentUser || currentUser.uid !== user.uid) return;

        const savedItems = snapshot.exists()
            ? snapshot.data().items
            : [];

        const restoredCart = [];

        if (Array.isArray(savedItems)) {
            for (const saved of savedItems) {
                const product = window.noireProducts.find(
                    item => item.id === Number(saved.productId)
                );

                const quantity = Number(saved.quantity);

                if (
                    product &&
                    Number.isSafeInteger(quantity) &&
                    quantity > 0 &&
                    quantity <= 99
                ) {
                    restoredCart.push({ product, quantity });
                }
            }
        }

        window.noireCart.splice(
            0,
            window.noireCart.length,
            ...restoredCart
        );

        cartReady = true;
        window.renderNoireCart();
    } catch (error) {
        console.error("NOIRÉ cart restore failed:", error);
        console.error(
            "Check your Firestore database and security rules."
        );
    }
});
