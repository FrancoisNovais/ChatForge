<script>
    // Import des composants et librairies
    import ConversationItem from "./components/ConversationItem.svelte";
    import Button from "./components/Button.svelte";
    import { marked } from "marked";
    import PocketBase from 'pocketbase';
    import { onMount } from "svelte";

    // États réactifs : messages du chat, message en cours, saisie du token, et token stocké (localStorage)
    let messages = $state([]);
    let userMessage = $state("");
    let token = $state("");
    let mistralToken = $state(localStorage.getItem("mistralToken"));

    const pocketBase = new PocketBase('http://127.0.0.1:8090');

    // Options marked : GFM activé, retours à la ligne simples autorisés
    marked.setOptions({
        gfm: true,
        breaks: true,
    });

    // Au montage du composant : récupération des messages existants depuis PocketBase
    onMount(async () => {
        try {
            // Charge l'historique des messages dans l'ordre chronologique
            const records = await pocketBase.collection('message').getFullList({
                sort: 'created',
            });
            messages = records.map(record => ({
                role: record.role,
                content: record.content,
                date: new Date(record.created).toLocaleTimeString().slice(0, 5),
            }));
            console.log("[onMount] messages chargés depuis PocketBase :", $state.snapshot(messages));
        } catch (err) {
            console.error("[onMount] erreur chargement PocketBase :", err);
        }
    });



    // Fonction : enregistre le token Mistral dans localStorage
    function saveToken(event) {
        event.preventDefault();
        console.log("[saveToken] formulaire soumis");

        token = token.trim();
        console.log("[saveToken] token saisi (après trim):", token);

        if (token) {
            localStorage.setItem("mistralToken", token);
            mistralToken = token;
            console.log("[saveToken] token enregistré dans localStorage");
        } else {
            console.warn("[saveToken] token vide ou invalide");
            alert("Veuillez entrer une clé Mistral valide.");
        }
    }

    // Fonction : sauvegarde un message dans PocketBase puis l'ajoute localement
    async function saveMessageToPocketBase(role, content) {
        try {
            console.log(`[PocketBase] Envoi du message ${role} vers PocketBase`);
            const record = await pocketBase.collection('message').create({ role, content });
            console.log(`[PocketBase] Message ${role} sauvegardé :`, record);
            messages.push({
                role: record.role,
                content: record.content,
                date: new Date(record.created).toLocaleTimeString().slice(0, 5),
            });
        } catch (err) {
            console.error(`[PocketBase] Erreur sauvegarde message ${role} :`, err);
        }
    }

    // Fonction : Envoie toute la conversation à l'API Mistral
    async function fetchMistralResponse(conversation) {
        console.log("[fetchMistralResponse] conversation:", conversation);

        const body = {
            model: "mistral-tiny",
            messages: conversation,
        };

        const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${mistralToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        console.log("[fetchMistralResponse] response data:", data);
        if (data && data.usage) {
            const { prompt_tokens, completion_tokens, total_tokens } = data.usage;
            // Affiche l'utilisation des tokens pour suivi/debug (prompt + completion + total)
            console.log(`[TOKENS] prompt: ${prompt_tokens}, completion: ${completion_tokens}, total: ${total_tokens}`);
        }

        return data.choices?.[0]?.message?.content ?? "(pas de réponse)";
    }

    // Fonction : gérer l'envoi complet
    async function sendMessage(event) {
        event.preventDefault();
        console.log("[sendMessage] start");

        const prompt = userMessage.trim();
        if (!prompt) {
            console.log("[sendMessage] message vide, sortie");
            return;
        }

        // On sauvegarde d'abord dans PocketBase, puis on met à jour localement via saveMessageToPocketBase()
        await saveMessageToPocketBase("user", prompt);

        // Construire la conversation complète dans le format attendu par l'API
        const conversationForApi = messages.map(m => ({
            role: m.role,
            content: m.content,
        }));

        try {
            // Envoie toute la conversation, pas seulement le dernier message
            const response = await fetchMistralResponse(conversationForApi);
            await saveMessageToPocketBase("assistant", response);
        } catch (err) {
            console.error("Erreur Mistral :", err);
            const errorMsg = "Erreur de connexion à l’API.";
            await saveMessageToPocketBase("assistant", errorMsg);
        }

        userMessage = "";
        console.log("[sendMessage] fin");
    }
</script>

<div class="app">
    {#if !mistralToken}
        <form class="token__form" onsubmit={saveToken}>
            <input
                type="text"
                name="token"
                placeholder="Entrez votre clé Mistral"
                class="token__input"
                bind:value={token}
            />
            <Button type="submit" text="Enregistrer" />
        </form>
    {:else}
        <aside class="app__sidebar sidebar">
            <nav class="sidebar__nav">
                <header class="sidebar__header">
                    <img
                        src="/logo.png"
                        alt=""
                        class="sidebar__logo"
                        aria-hidden="true"
                    />
                    <h1 class="sidebar__title">ChatForge</h1>
                </header>

                <div class="sidebar__conversations">
                    <h2 class="sidebar__conversations-title">Conversations</h2>

                    <ConversationItem title="Conversation 1" selected={true} />
                    <ConversationItem title="Conversation 2" />
                </div>
            </nav>
            <form class="sidebar__form">
                <input
                    type="text"
                    name="title"
                    placeholder="Nouvelle conversation"
                    class="sidebar__input"
                />
                <Button type="submit" text="Créer" />
            </form>
        </aside>

        <main class="app__chat chat">
            <div class="chat__container">
                <ul class="chat__messages">
                {#each messages as message}
                    <li class="chat__message chat__message--{message.role === 'user' ? 'user' : 'ai'}">
                    {#if message.role === 'assistant'}
                        <div class="chat__bubble">{@html marked(message.content)}</div>


                    {:else}
                        <div class="chat__bubble">{message.content}</div>
                    {/if}
                    <span class="chat__date">{message.date}</span>
                    </li>
                {/each}
                </ul>


                <form class="chat__form" onsubmit={sendMessage}>
                    <textarea
                        name="message"
                        placeholder="Envoyer un message"
                        rows="1"
                        class="chat__input"
                        bind:value={userMessage}
                    ></textarea>
                    <Button type="submit" text="Envoyer" />
                </form>
            </div>
        </main>
    {/if}
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        background: var( --color-bg-main);
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        position: relative;
        height: 100vh;
    }

    .app__sidebar {
        background: var(--color-bg-sidebar);
        color: var(--color-text-light);
        padding: 1rem;
        flex-shrink: 0;
    }

    .app__chat {
        flex: 1;
        flex-grow: 1;
        min-width: 0;
        background: var(--color-bg-main);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    /* Sidebar */
    .sidebar {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .sidebar__header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .sidebar__logo {
        width: 2rem;
        line-height: 1;
    }

    .sidebar__title {
        font-size: 1.6rem;
        font-weight: bold;
    }

    .sidebar__conversations-title {
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .sidebar__form {
        margin: 1rem 0;
        display: flex;
        gap: 0.5rem;
    }

    .sidebar__input,
    .chat__input,
    .token__form input {
        width: 100%;
        padding: 0.5rem 1rem;
        border: 1.5px solid var(--color-border-input, #ccc);
        border-radius: 0.3rem;
        font-size: 1rem;
        color: var(--color-text-main, #333);
        transition: border-color 0.2s ease;
        outline-offset: 2px;
    }

    .sidebar__input:focus,
    .chat__input:focus,
    .token__form input:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
    }

    .sidebar__input::placeholder,
    .chat__input::placeholder,
    .token__form input::placeholder  {
        color: var(--color-text-placeholder, #999);
    }

    /* Chat */
    .chat__container {
        max-width: 50rem;
        width: 100%;
        margin: 0 auto;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .chat__messages {
        flex-grow: 1;
        overflow-y: auto;
        padding: 1rem;
        margin: 0 0 1rem 0;
        list-style: none;
        display: flex;
        flex-direction: column;
    }

    .chat__message {
        max-width: 70%;
        display: flex;
        flex-direction: column;
    }

    .chat__bubble {
        padding: 0.5rem 1rem;
        border-radius: 0.8rem;
    }

    .chat__message--user {
        align-self: flex-end;
    }
    .chat__message--user .chat__bubble {
        background: var(--color-bg-user);
        border-bottom-right-radius: 0;
        text-align: right;
    }
    .chat__message--user .chat__date {
        text-align: right;
    }

    .chat__message--ai {
        align-self: flex-start;
    }
    .chat__message--ai .chat__bubble {
        background: var(--color-bg-assistant);
        border-bottom-left-radius: 0;
        text-align: left;
    }
    .chat__message--ai .chat__date {
        text-align: left;
    }

    .chat__date {
        font-size: 0.75rem;
        margin-top: 0.2rem;
        background: none;
        padding: 0;
        display: block;
    }

    .chat__form {
        display: flex;
        gap: 0.5rem;
        background-color: var(--color-bg-sidebar);
        padding: 1rem;
    }

    /* Token */
    .token__form {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-bg-user);
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 90%;
        max-width: 400px;
        z-index: 100;
    }



    /* Responsive */
    @media (min-width: 48rem) {
        .app {
            flex-direction: row;
        }

        .app__sidebar {
            height: 100vh;
            overflow-y: auto;
        }

        .app__chat {
            height: 100vh;
        }
        .chat__form {
            margin: 0;
            border-radius: none;
        }
        .chat__form {
            margin: 1rem;
            border-radius: 0.8rem;
        }
    }
</style>