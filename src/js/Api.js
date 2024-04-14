import config from "../../config.js";

export class Api {
    url = config.API_URL;

    /**
     * Envoi un touit a l'api pour l'enregistrer
     * @param {string} name
     * @param {string} message
     */
    async sendTouit(name, message) {
        if (name.length < 4 || name.length > 16) {
            window.alert("pseudo trop court ou trop long");
        } else if (message.length < 4 || message.length > 254) {
            window.alert("touit trop cours ou trop long");
        } else {
            // Données à envoyer (à encoder en URL)
            const data = {
                name: name,
                message: message,
            };

            // Construction de la chaîne de requête URL encodée
            const params = new URLSearchParams(data);
            try {
                const reponse = await fetch(this.url + "send", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: params,
                });

                const resultat = await reponse.json();
                console.log("Réussite :", resultat);
                window.alert("touit envoyé");
            } catch (erreur) {
                console.error("Erreur :", erreur);
            }
        }
    }

    /**
     * Ajoute un like sur un touit
     * @param {number} messageId // id du message
     */
    async addLike(messageId) {
        try {
            const reponse = await fetch(this.url + "likes/send", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `message_id=${messageId}`,
            });

            const resultat = await reponse.json();
            console.log("Réussite :", resultat);
        } catch (erreur) {
            console.error("Erreur :", erreur);
        }
    }

    /**
     * Ajoute un like sur un touit
     * @param {number} messageId // id du message
     */
    async removeLike(messageId) {
        try {
            const data = new URLSearchParams();
            data.append("message_id", messageId);

            const reponse = await fetch(this.url + "likes/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: data,
            });

            const resultat = await reponse.json();
            console.log("Réussite :", resultat);
        } catch (erreur) {
            console.error("Erreur :", erreur);
        }
    }

    /**
     * Ajoute une emote sur un touit
     * @param {number} messageId // id du message
     * @param {string} emote // emote à ajouter
     */
    async addEmote(messageId, emote) {
        try {
            const data = new URLSearchParams();
            data.append("message_id", messageId);
            data.append("symbol", emote.toString());

            const reponse = await fetch(this.url + "reactions/add", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: data,
            });

            const resultat = await reponse.json();
            console.log("Réussite :", resultat);
        } catch (erreur) {
            console.error("Erreur :", erreur);
        }
    }

    /**
     * Supprime une emote sur un touit
     * @param {number} messageId // id du message
     * @param {string} emote // emote à ajouter
     */
    async removeEmote(messageId, emote) {
        try {
            const data = new URLSearchParams();
            data.append("message_id", messageId);
            data.append("symbol", emote.toString());

            const reponse = await fetch(this.url + "reactions/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: data,
            });

            const resultat = await reponse.json();
            console.log("Réussite :", resultat);
        } catch (erreur) {
            console.error("Erreur :", erreur);
        }
    }

    /**
     * Recupere les touits depuis un timestamp
     * @param {number} time
     */
    async getTouitSince(time) {
        const touits = await fetch(this.url + "list" + "?ts=" + time)
            .then((response) => response.json())
            .catch((e) => console.error(e));

        return touits;
    }

    /**
     * Recupere un touit depuis son Id
     * @param {number} id
     */
    async getTouitById(id) {
        const touit = await fetch(this.url + "get" + "?id=" + id)
            .then((response) => response.json())
            .catch((e) => console.error(e));

        return touit.data;
    }

    /**
     * Recupere un avatar depuis son username
     * @param {string} username
     */
    // async getAvatarByName(username) {
    //     const img = await fetch(this.url + "avatar/get?username=" + username).catch(e=>console.error(e));
    //     return img.url;
    // }

    /**
     * Recupere les commentaires depuis l'id d'un touit
     * @param {number} id
     */
    async getCommentById(id) {
        const comment = await fetch(this.url + "comments/list?message_id=" + id)
            .then((response) => response.json())
            .catch((e) => console.error(e));
        return comment.comments;
    }

    /**
     * Envoi le commentaire d'un touit a l'api pour l'enregistrer
     * @param {number} touitId
     * @param {string} name
     * @param {string} comment
     */
    async addComment(touitId, name, comment) {
        if (name.length < 4 || name.length > 16) {
            window.alert("pseudo trop court ou trop long");
        } else if (comment.length < 4 || comment.length > 254) {
            window.alert("commentaire trop cours ou trop long");
        } else {
            // Données à envoyer (à encoder en URL)
            const data = {
                message_id: touitId,
                name: name,
                comment: comment,
            };

            // Construction de la chaîne de requête URL encodée
            const params = new URLSearchParams(data);
            try {
                const reponse = await fetch(this.url + "comments/send", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: params,
                });

                const resultat = await reponse.json();
                console.log("Réussite :", resultat);
                window.alert("commentaire envoyé");
            } catch (erreur) {
                console.error("Erreur :", erreur);
            }
        }
    }
}
