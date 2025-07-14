import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';

// faire le lien entre un emplacement dans le DOM et le composant principal contenu dans le fichier App.svelte, pour que le contenu HTML soit généré dans cet emplacement
const app = mount(App, {
    target: document.getElementById('app'),
});

export default app;