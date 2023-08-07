const btnsOpenModal = document.querySelectorAll(".show-modal");
let btnCloseModal = document.querySelector(".close-modal");
const modalView = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

for (const openModal of btnsOpenModal) {
    openModal.addEventListener("click", () => {
            modalView.classList.remove("hidden");
            overlay.classList.remove("hidden");
        }
    )
}

const closeModal = () => {
    modalView.classList.add("hidden");
    overlay.classList.add("hidden");
};
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
    console.log(event.key);
    if (event.key === "Escape" && !modalView.classList.contains("hidden")) {
        closeModal();
    }
})