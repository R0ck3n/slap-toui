import { emoteList } from "./toolbox.js";
import { Api } from "./Api.js";
export class Touit {
    /**
     *
     * @param {number} id
     * @param {number} tms
     * @param {string} name
     * @param {number} likes
     * @param {string} message
     * @param {Object.<string, number>} reactions
     * @param {number} commentsCount
     * @param {boolean} isUserAuthenticated
     */
    constructor(
        id,
        tms,
        name,
        likes,
        message,
        reactions,
        commentsCount,
        isUserAuthenticated
    ) {
        this.id = id;
        this.tms = tms;
        this.name = name;
        this.likes = likes;
        this.message = message;
        this.reactions = reactions;
        this.commentsCount = commentsCount;
        this.isUserAuthenticated = isUserAuthenticated;
    }
    api = new Api();

    displayTouits() {
        const touitContainer = document.querySelector("#touit-container");
        const templateTouit = document.querySelector("#touit-template");
        const contenuTemplate = document.importNode(
            templateTouit.content,
            true
        );
        // container global du touit
        const touit = contenuTemplate.querySelector(".touit");
        touit.id='t-'+this.id
        
        //  avatar
        const avatarPic= contenuTemplate.querySelector(".touit-avatar-pic")
            // this.api.getAvatarByName(this.name).then((url)=>{
            //     avatarPic.src = url
            //     avatarPic.alt = "avatar de l'utilisateur " + this.name
            // })

        // pseudo
        contenuTemplate.querySelector(".touit-autor-pseudo").textContent =
            this.name;

        // lien du pseudo
        contenuTemplate.querySelector(".touit-autor-pseudo-link").textContent =
            "@" + this.name;

        // date et heure du tweet
        const date = new Date(this.tms);
        contenuTemplate.querySelector(".touit-date").textContent =
            `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`.slice(
                0,
                16
            );

        // touit content
        contenuTemplate.querySelector(".touit-text-content").textContent =
            this.message;

        //conteneur des emoticons
        contenuTemplate.querySelector(".react-container").dataset.id = this.id

        // nombre de commentaire
        contenuTemplate.querySelector(".commentary-count").textContent =
            this.commentsCount;

        // ajoute des slaps
        const slapCount = contenuTemplate.querySelector(".slap-count")
        contenuTemplate.querySelector(".slap-action").addEventListener('click',()=>{
            slapCount.textContent = (parseInt(slapCount.textContent) + 1 ).toString()
        })

        // Btn comment
        const btnComment = contenuTemplate.querySelector(".comment-btn");
        // container comment
        const commentGlobalContainer = contenuTemplate.querySelector(".touit-comment");
        // container messages comment
        const commentContainer = contenuTemplate.querySelector(".comment-container");

        // elems a faire apparaitres
        const formComment = contenuTemplate.querySelector(".send-comment-form");
        const closeCommentBtn = contenuTemplate.querySelector(".close-comment-zone");
        // Btn like
        const tumbsContainer = contenuTemplate.querySelector(".add-tumbs");
        const closeTumbsContainer = contenuTemplate.querySelector(".thumbs-cross");
        const tumbsUpBtn = contenuTemplate.querySelector(".thumbs-up-pic");
        const tumbsDownBtn = contenuTemplate.querySelector(".thumbs-down-pic");
        const popUplike = contenuTemplate.querySelector(".like-actions")
        //  nombre de like
        const likeCount = contenuTemplate.querySelector(".like-count")
        likeCount.textContent = this.likes;
        
        // btn des emotes
        const emoteBtn = contenuTemplate.querySelector(".addEmote");
        emoteBtn.dataset.id = this.id;

        // En dehors de l'événement "click"
        const divPanel = document.createElement("div");
        divPanel.classList.add("emote-panel-container");
        const closeDiv = document.createElement("div");
        closeDiv.textContent = "x";
        closeDiv.classList.add("close-cross");
        divPanel.appendChild(closeDiv);

        // ajoute les emoticons si il y en a
        if (Object.keys(this.reactions).length !== 0) {
            for (const key in this.reactions) {
                // div qui contient l'emote
                const singleEmoteContainer = document.createElement("button");
                singleEmoteContainer.classList.add("single-emote-container");
                contenuTemplate
                    .querySelector(".react-container")
                    .appendChild(singleEmoteContainer);

                // l'emote
                const pEmote = document.createElement("p");
                pEmote.classList.add("single-emote-pic");
                pEmote.dataset.id = this.id;
                pEmote.textContent = key;

                // le conteur de l'emote
                const pCount = document.createElement("p");
                pCount.classList.add("single-emote-count");
                pCount.textContent = this.reactions[key];

                // ajoute l'emote et son conteur dans son conteneur
                singleEmoteContainer.append(pEmote, pCount);

                // Supprime l'emote si on clic dessus
                pEmote.addEventListener("click", () => {
                    this.api.removeEmote(
                        parseInt(pEmote.dataset.id),
                        pEmote.textContent
                    ).then(()=>this.api.getTouitById(this.id).then((touitRefresh)=>{
                        this.name = touitRefresh.name;
                        this.reactions = touitRefresh.reactions
                        this.likes = touitRefresh.likes
                        this.message = touitRefresh.message
                        this.commentsCount = touitRefresh.comments_count
                    }).then(()=>{
                        this.refreshTouit(touit)
                    }))
                });
            }
        }

        // insere le touit
        touitContainer.prepend(contenuTemplate);

        popUplike.addEventListener("click", () => {
                tumbsContainer.classList.add("active");
            });

        closeTumbsContainer.addEventListener("click", () => {
            setTimeout(() => {
                tumbsContainer.classList.remove("active");
            }, 100);
        });
        
        tumbsUpBtn.addEventListener("click", () => {
            this.api.addLike(this.id).then(()=>this.api.getTouitById(this.id).then((touitRefresh)=>{
                this.name = touitRefresh.name;
                this.reactions = touitRefresh.reactions
                this.likes = touitRefresh.likes
                this.message = touitRefresh.message
                this.commentsCount = touitRefresh.comments_count
            }).then(()=>{
                this.refreshTouit(touit)
            }))
        });

        tumbsDownBtn.addEventListener("click", () => {
            this.api.removeLike(this.id).then(()=>this.api.getTouitById(this.id).then((touitRefresh)=>{
                this.name = touitRefresh.name;
                this.reactions = touitRefresh.reactions
                this.likes = touitRefresh.likes
                this.message = touitRefresh.message
                this.commentsCount = touitRefresh.comments_count
            }).then(()=>{
                this.refreshTouit(touit)
            }))
        });

        emoteBtn.addEventListener("click", (e) => {
            if (!emoteBtn.contains(divPanel)) {
                emoteBtn.appendChild(divPanel);
                divPanel.classList.add("active-panel");

                const flexDiv = document.createElement("div");
                flexDiv.classList.add("emote-container");

                divPanel.appendChild(flexDiv);

                emoteList.forEach((el) => {
                    const newBtn = document.createElement("button");
                    newBtn.classList.add("addEmote-btn");
                    newBtn.textContent = el;

                    newBtn.addEventListener("click", () => {
                        this.api.addEmote(
                            parseInt(emoteBtn.dataset.id),
                            newBtn.textContent
                        ).then(()=>this.api.getTouitById(this.id).then((touitRefresh)=>{
                            this.name = touitRefresh.name;
                            this.reactions = touitRefresh.reactions
                            this.likes = touitRefresh.likes
                            this.message = touitRefresh.message
                            this.commentsCount = touitRefresh.comments_count
                        }).then(()=>{
                            this.refreshTouit(touit)
                        }))
                    });
                    flexDiv.append(newBtn);
                });
            }
        });

        closeDiv.addEventListener("click", (e) => {
            divPanel.classList.remove("active-panel");
            setTimeout(() => {
                divPanel.querySelector(".emote-container").remove();
                divPanel.remove();
            }, 300);
        });

        btnComment.addEventListener("click",(e) =>{
            this.displayComment(commentContainer,formComment,closeCommentBtn, commentGlobalContainer)
        })

        closeCommentBtn.addEventListener('click',()=>{
            commentContainer.innerHTML=""
            commentGlobalContainer.classList.remove('touit-comment-active');
            closeCommentBtn.classList.remove('accordeon-active');
            commentContainer.classList.remove('accordeon-active');
            formComment.classList.remove('accordeon-active');
        })
        
        formComment.addEventListener('submit',(ev)=>{
            ev.preventDefault();
            this.api.addComment(this.id,formComment["pseudo-comment"].value,formComment["touit-comment"].value).then(()=>{
                formComment["touit-comment"].value = "";
                commentContainer.innerHTML=""
            }).then(()=>this.displayComment(commentContainer,formComment, closeCommentBtn, commentGlobalContainer))
        })



    }

    /**
     * Rafraichi un touit
     * @param {number} id 
     */
    refreshTouit(touit){
        touit.querySelector(".like-count").textContent = this.likes
        touit.querySelector(".commentary-count").textContent = this.commentsCount
        touit.querySelector(".react-container").innerHTML="";
        // ajoute les emoticons si il y en a
        if (Object.keys(this.reactions).length !== 0) {
            for (const key in this.reactions) {
                // div qui contient l'emote
                const singleEmoteContainer = document.createElement("button");
                singleEmoteContainer.classList.add("single-emote-container");
                touit
                    .querySelector(".react-container")
                    .appendChild(singleEmoteContainer);

                // l'emote
                const pEmote = document.createElement("p");
                pEmote.classList.add("single-emote-pic");
                pEmote.dataset.id = this.id;
                pEmote.textContent = key;

                // le conteur de l'emote
                const pCount = document.createElement("p");
                pCount.classList.add("single-emote-count");
                pCount.textContent = this.reactions[key];

                // ajoute l'emote et son conteur dans son conteneur
                singleEmoteContainer.append(pEmote, pCount);

                // Supprime l'emote si on clic dessus
                pEmote.addEventListener("click", () => {
                    this.api.removeEmote(
                        parseInt(pEmote.dataset.id),
                        pEmote.textContent
                    ).then(()=>this.api.getTouitById(this.id).then((touitRefresh)=>{
                        this.name = touitRefresh.name;
                        this.reactions = touitRefresh.reactions
                        this.likes = touitRefresh.likes
                        this.message = touitRefresh.message
                        this.commentsCount = touitRefresh.comments_count
                    }).then(()=>{
                        this.refreshTouit(touit)
                    }))
                });
            }

        }
    }

    displayEmotePanel(btn) {
        closeDiv.addEventListener("click", (e) => {
            btn.classList.toggle("active-panel");
        });
    }

    displayComment(commentContainer,form, closeCommentBtn, commentGlobalContainer){
        this.api.getCommentById(this.id).then(comments=>{
            commentGlobalContainer.classList.add('touit-comment-active');
            closeCommentBtn.classList.add('accordeon-active');
            commentContainer.classList.add('accordeon-active');
            form.classList.add('accordeon-active');

            comments.forEach(comment=>{
                const singleCommentContainer = document.createElement('div');
                singleCommentContainer.className ="single-comment";
                
                const singleCommentMessage = document.createElement('p');
                singleCommentMessage.className = 'singleCommentMessage'
                singleCommentMessage.textContent = comment.comment

                const singleCommentAutor = document.createElement('p');
                singleCommentAutor.className = 'singleCommentAutor'
                singleCommentAutor.textContent = comment.name

                commentContainer.prepend(singleCommentContainer);
                singleCommentContainer.append(singleCommentMessage,singleCommentAutor)

            })

        })


    }
}
