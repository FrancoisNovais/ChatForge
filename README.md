# ChatForge

**ChatForge** est un projet front-end développé avec **Svelte**.  
Il permet de mettre en application les compétences de développeur front-end en réalisant une interface utilisateur qui interagit avec l'API du LLM Mistral.

---

## Fonctionnalités principales

### Gestion des Messages
- **Affichage des messages sous forme de discussion (utilisateur vs IA).**
- ~~Envoi d'un message utilisateur et stockage en base de données locale.~~
- ~~Envoi du message à une API externe d'IA et récupération de la réponse.~~
- ~~Affichage de la réponse de l'IA et stockage en base de données locale.~~

### Gestion du Token d'Authentification
- ~~Saisie et enregistrement d'un token API dans le stockage local.~~
- ~~Vérification de la présence du token avant d'envoyer une requête à l'API d'IA.~~

### Gestion des Conversations
- ~~Affichage des conversations existantes récupérées depuis une API locale.~~
- ~~Sélection d'une conversation pour afficher les messages associés.~~
- ~~Création d'une nouvelle conversation avec un titre personnalisé.~~
- ~~Suppression d'une conversation avec mise à jour de l'interface utilisateur.~~

---

## Technologies utilisées

- **Framework Frontend** : Svelte  
- ~~Bibliothèques :~~  
  - ~~`svelte-exmarkdown` pour l'affichage des messages en Markdown~~  
- ~~Backend API : PocketBase pour stocker les messages et conversations~~  
- ~~API IA : Service externe (ex : Mistral AI)~~  
- ~~Stockage : LocalStorage pour la gestion du token API~~  

---

## Architecture de l'application

### Composants principaux
- **Interface de gestion des conversations** : liste des conversations disponibles avec possibilité de sélection.  
- **Zone de chat** : affichage des messages avec distinction entre utilisateur et IA.  
- **Zone de saisie : champ pour entrer un message et bouton d'envoi.**
- ~~Système de gestion des tokens : formulaire de saisie pour l'authentification de l'utilisateur auprès de l'API IA.~~  

---

## Échanges API

### API locale (PocketBase)
- ~~Récupération des conversations : `GET /collections/conversations/records`~~  
- ~~Création d'une conversation : `POST /collections/conversations/records`~~  
- ~~Suppression d'une conversation : `DELETE /collections/conversations/records/{id}`~~  
- ~~Récupération des messages : `GET /collections/messages/records?filter=conversation_id`~~  
- ~~Envoi d'un message : `POST /collections/messages/records`~~  

### API IA (Mistral AI)
- ~~Envoi d'un message et récupération de la réponse :~~  
  `POST https://api.mistral.ai/v1/chat/completions`  

---

## Contraintes et spécifications techniques

- **L'application doit être responsive et utilisable sur desktop et mobile.**  
- **Utilisation de classes CSS spécifiques pour différencier les messages utilisateur et IA.**  
- ~~Gestion des erreurs lors des appels API (ex : problème de connexion, réponse invalide).~~  

---
