import { displayConsoleTitle, emoteList } from "./toolbox.js";
import { Api } from "./Api.js";
import { Touit } from "./Touit.js";

// touit form
const sendTouitForm = document.querySelector("#form-send-touit");
const sendTouitBtn = document.querySelector("#home-send-touit");
// smiley btn under send touit form
const smileyBtn = document.querySelector("#add-emote-touit-input");
const touitAutor = document.querySelector("#pseudo");
const touitContent = document.querySelector("#touit");
let tmsLastMsg = 0;

// Gestion des requetes api
const api = new Api();

// Affiche les différents touits et rafraichi la page
function refresh() {
    api.getTouitSince(tmsLastMsg)
        .then((msgs) => {
            msgs.messages.forEach((msg) => {
                const lastIndex = msgs.messages.length;
                tmsLastMsg = msgs.messages[lastIndex - 1].ts;

                const touit = new Touit(
                    msg.id,
                    msg.ts,
                    msg.name,
                    msg.likes,
                    msg.message,
                    msg.reactions,
                    msg.comments_count,
                    msg.is_user_authenticated
                );
                touit.displayTouits();
            });
        })
        .catch((e) => console.error(e));
    document.querySelector(".touit-container p").textContent = "";
    setTimeout(refresh, 5000);
}

refresh();

// fait apparaite une pop-up de choi de smiley et ajoute le smiley desiré a la suite du texte du touit.
const divPanel = document.createElement("div");
divPanel.classList.add("send-touit-emote-panel-container");
const closeDiv = document.createElement("div");
closeDiv.textContent = "x";
closeDiv.classList.add("close-cross");

smileyBtn.appendChild(divPanel);
divPanel.appendChild(closeDiv);

const flexDiv = document.createElement("div");
flexDiv.classList.add("emote-container");

divPanel.appendChild(flexDiv);

emoteList.forEach((el) => {
    const newBtn = document.createElement("div");
    newBtn.classList.add("addEmote-btn");
    newBtn.textContent = el;

    newBtn.addEventListener("click", () => {
        touitContent.value = touitContent.value + newBtn.textContent;
        setTimeout(() => divPanel.classList.remove("active-input-panel"), 50);
    });
    flexDiv.append(newBtn);
});

smileyBtn.addEventListener("click", () => {
    divPanel.classList.add("active-input-panel");
    closeDiv.addEventListener("click", (e) => {
        setTimeout(() => divPanel.classList.remove("active-input-panel"), 50);
    });
});

// Evenement sur le formulaire pour envoyer un touit
sendTouitForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    api.sendTouit(touitAutor.value, touitContent.value)
        .then(() => {
            sendTouitBtn.disabled = true;
        })
        .then(
            api
                .getTouitSince(tmsLastMsg)
                .then((msgs) => {
                    const lastIndex = msgs.messages.length;
                    tmsLastMsg = msgs.messages[lastIndex - 1].ts;
                    msgs.messages.forEach((msg) => {
                        const touit = new Touit(
                            msg.id,
                            msg.ts,
                            msg.name,
                            msg.likes,
                            msg.message,
                            msg.reactions,
                            msg.comments_count,
                            msg.is_user_authenticated
                        );
                        touit.displayTouits();
                    });
                })
                .then(() => {
                    setTimeout(() => (sendTouitBtn.disabled = false), 3000);
                })
                .catch((e) => console.error(e))
        );

    touitContent.value = "";
});

// burger menu
const burgerBtn = document.querySelector(".burger");
const burgerContainer = document.querySelector(".link-bloc");

burgerBtn.addEventListener("click", () => {
    burgerBtn.classList.toggle("active-burger-btn");
    burgerContainer.classList.toggle("active-burger");
});

// Affiche le titre du site dans la console
displayConsoleTitle();
