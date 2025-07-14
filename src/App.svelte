<script>
    import ConversationItem from "./components/ConversationItem.svelte";
</script>

<div class="app">
    <aside class="app__sidebar sidebar">
        <nav class="sidebar__nav">
            <h1 class="sidebar__title">ChatForge</h1>
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
            <button type="submit" class="sidebar__create-button">Créer</button>
        </form>
    </aside>

    <main class="app__chat chat">
        <ul class="chat__messages">
            <li class="chat__message chat__message--user">
                <div class="chat__bubble">
                    Bonjour, peux-tu m'expliquer le CSS ?
                </div>
                <span class="chat__date">10:15</span>
            </li>
            <li class="chat__message chat__message--ai">
                <div class="chat__bubble">
                    Bien sûr ! CSS (Cascading Style Sheets) est un langage
                    utilisé pour décrire le style d'un document HTML...
                </div>
                <span class="chat__date">10:16</span>
            </li>
        </ul>
        <form class="chat__form">
            <textarea
                name="message"
                placeholder="Envoyer un message"
                rows="1"
                class="chat__input"
            ></textarea>
            <button type="submit" class="chat__send-button">Envoyer</button>
        </form>
    </main>
</div>

<style>
    html,
    body {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
    .app {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        position: relative;
        height: 100vh;
    }

    .app__sidebar {
        background: var(--color-bg-sidebar);
        color: var(--color-text-sidebar);
        padding: 1rem;
        flex-shrink: 0;
    }

    .app__chat {
        flex: 1;
        flex-grow: 1;
        min-width: 0;
        background: var(--color-bg-main);
        padding: 1rem;
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

    .sidebar__title {
        font-size: 1.6rem;
        margin-bottom: 1rem;
    }

    .sidebar__conversations-title {
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .sidebar__form {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
    }

    .sidebar__input {
        flex: 1;
        padding: 0.5rem;
    }

    .sidebar__create-button {
        padding: 0.5rem 1rem;
        background: var(--color-bg-button);
        color: white;
        border: none;
        cursor: pointer;
    }

    .sidebar__create-button:hover {
        background: var(--color-bg-button-hover);
    }

    .sidebar__create-button:active {
        background: var(--color-bg-button-active);
    }

    /* Chat */
    .chat__messages {
        flex-grow: 1;
        overflow-y: auto;
        padding: 0;
        margin: 0 0 1rem 0;
        list-style: none;
        display: flex;
        flex-direction: column;
    }

    .chat__message {
        max-width: 70%;
        margin: 0.5rem 1rem;
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
    }

    .chat__input {
        flex: 1;
        resize: none;
        padding: 0.5rem;
    }

    .chat__send-button {
        padding: 0.5rem 1rem;
        background: var(--color-bg-button);
        color: white;
        border: none;
        cursor: pointer;
    }

    .chat__send-button:hover {
        background: var(--color-bg-button-hover);
    }

    .chat__send-button:active {
        background: var(--color-bg-button-active);
    }

    /* Responsive */
    @media (min-width: 768px) {
        .app {
            flex-direction: row;
        }

        .app__sidebar {
            width: 300px;
            height: 100vh;
            overflow-y: auto;
        }

        .app__chat {
            height: 100vh;
        }
    }
</style>
