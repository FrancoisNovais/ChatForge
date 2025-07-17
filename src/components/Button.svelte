<script>
    export let type;
    export let text;
</script>

<button {type} aria-label={text}>
    {text}
</button>

<style>
    button {
        background-color: var(--color-bg-button);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-size: 1rem;
        border-radius: 0.3rem;
        transition: background-color 0.3s ease;
    }
    button:hover,
    button:focus {
        background-color: var(--color-bg-button-hover);
        outline: none;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
    }
    button:active {
        background-color: var(--color-bg-button-active);
    }
</style>
