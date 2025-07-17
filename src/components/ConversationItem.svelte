<script>
    export let title = "";
    export let selected = false;
</script>

<div class="sidebar__conversation" role="listitem">
    <div
        class="sidebar__conversation-button-wrapper {selected
            ? 'sidebar__conversation-button-wrapper--selected'
            : ''}"
        role="presentation"
    >
        <button
            class="sidebar__conversation-button {selected
                ? 'sidebar__conversation-button--selected'
                : ''}"
            aria-current={selected ? "true" : undefined}
            aria-label={"Conversation: " +
                title +
                (selected ? " (sélectionnée)" : "")}
        >
            {title}
        </button>
        <button
            class="sidebar__conversation-delete"
            aria-label={"Supprimer la conversation " + title}
            title={"Supprimer la conversation " + title}
        >
            ✕
        </button>
    </div>
</div>

<style>
    .sidebar__conversation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    /* Wrapper du bouton + delete */
    .sidebar__conversation-button-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        margin-bottom: 0.5rem;
        border-radius: 0.3rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    /* Fond au survol */
    .sidebar__conversation-button-wrapper:hover {
        background-color: var(--color-bg-sidebar-item-hover);
    }

    /* Fond si sélectionné */
    .sidebar__conversation-button-wrapper--selected {
        background-color: var(--color-bg-sidebar-item-selected);
    }

    /* Le bouton de titre */
    .sidebar__conversation-button {
        flex-grow: 1;
        text-align: left;
        padding: 0.5rem 1rem;
        background: none;
        border: none;
        color: inherit;
    }

    /* Titre en gras si sélectionné */
    .sidebar__conversation-button--selected {
        font-weight: bold;
    }

    /* Le bouton de suppression */
    .sidebar__conversation-delete {
        padding: 0 0.4rem 0 0.3rem;
        background: none;
        border: none;
        cursor: pointer;
        border-radius: 0.2rem;
        margin-right: 0.5rem;
        transition: background-color 0.2s;
    }

    /* Hover */
    .sidebar__conversation-delete:hover {
        background: var(--color-bg-cancel-hover);
    }

    /* Active (clic en cours) */
    .sidebar__conversation-delete:active {
        background: var(--color-bg-cancel-active);
    }
</style>
