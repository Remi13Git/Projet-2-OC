# Projet-2-OC - OlympicGames

## Description

Ce projet est une application Angular qui permet d'afficher des informations sur les pays participants aux Jeux Olympiques. L'application affiche ces informations sous forme de statistiques ainsi qu'un graphique interactif pour visualiser les performances des pays au fil des années.

## Fonctionnalités principales

- **Page d'accueil** : Affiche une vue d'ensemble des statistiques globales des Jeux Olympiques, y compris le nombre total de médailles, le nombre de pays et les éditions des JO.
- **Page de détail** : Permet de consulter les informations détaillées d'un pays, avec des graphiques montrant le nombre de médailles obtenues au fil des années.
- **Graphiques interactifs** : Les graphiques sont créés avec `ng2-charts` et `ngx-charts` pour permettre de visualiser l'évolution des performances des pays.
- **Navigation** : Utilisation de la navigation Angular pour déplacer l'utilisateur entre les différentes pages.

## Prérequis

- Node.js (version 14 ou supérieure)
- Angular CLI (version 13 ou supérieure)

## Installation

1. Clonez le repository du projet.

    ```bash
    git clone https://github.com/Remi13Git/Projet-2-OC.git
    ```

2. Installez les dépendances du projet.

    Dans le terminal, accédez au dossier du projet et exécutez la commande suivante :

    ```bash
    cd Projet-2-OC
    npm install
    ```

## Lancer l'application

Une fois les dépendances installées, vous pouvez démarrer l'application avec la commande suivante :

```bash
ng serve
```