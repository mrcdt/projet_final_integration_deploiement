# Projet Final Intégration & Déploiement

Application web, avec petit backend et patit frontend, déployée automatiquement sur une VM Azure via un pipeline CI/CD GitHub Actions et orchestrée avec Kubernetes (K3s).

---

## Architecture

```
GitHub Actions (CI/CD)
       │
       ├─ Tests automatisés (Jest)
       ├─ Build & Push Docker → DockerHub
       └─ Déploiement SSH → VM Azure (K3s)

Stack applicative :
  Frontend (HTML/JS)  ←→  Backend (Node.js/Express)  ←→  PostgreSQL
       Port 30001               Port 30000                  Port 5432
```

---

## Structure du projet

```
.
├── .github/
│   └── workflows/
│       └── main.yml          # Pipeline CI/CD
├── backend/
│   ├── index.js              # Serveur Express
│   ├── index.test.js         # Tests Jest
│   ├── Dockerfile            # Image Docker multi-stage
│   └── package.json
├── frontend/
│   ├── index.html            # Interface utilisateur
│   └── Dockerfile
├── k8s/
│   ├── deployment.yml        # Deployments Backend + PostgreSQL
│   ├── frontend.yml          # Deployment + Service Frontend
│   ├── service.yml           # Services Backend + DB
│   └── secret.yml            # Secrets Kubernetes (DB credentials)
└── docker-compose.yml        # Environnement de développement local
```

---

## Pipeline CI/CD

Le pipeline se déclenche automatiquement à chaque `push` sur la branche `main` et s'exécute en 3 étapes séquentielles :

### 1. Tests
- Installation des dépendances Node.js
- Exécution des tests unitaires avec Jest (`npm test`)

### 2. Build & Push Docker
- Connexion à DockerHub
- Build et push de l'image **backend** → `marinecdt/backend:latest`
- Build et push de l'image **frontend** → `marinecdt/frontend:latest`

### 3. Déploiement sur Azure VM (K3s)
- Connexion SSH à la VM Azure
- `git pull` pour récupérer les derniers manifestes K8s
- Application des manifestes Kubernetes (`kubectl apply`)
- Redémarrage des déploiements (`kubectl rollout restart`)

---

## Lancement en local (Docker Compose)

```bash
# Cloner le projet
git clone https://github.com/<votre-username>/projet_final_integration_deploiement.git
cd projet_final_integration_deploiement

# Démarrer tous les services
docker compose up --build

# Accès
# Frontend : http://localhost:8081
# Backend  : http://localhost:3000
```

---

## Déploiement Kubernetes (K3s)

Les manifestes Kubernetes sont dans le dossier `k8s/`. En production, ils sont appliqués automatiquement par le pipeline.

Pour un déploiement manuel :

```bash
kubectl apply -f k8s/secret.yml
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml
kubectl apply -f k8s/frontend.yml
```

### Ports exposés (NodePort)

| Service  | Port interne | NodePort |
|----------|-------------|----------|
| Backend  | 3000        | 30000    |
| Frontend | 3000        | 30001    |

---

## 🔌 Endpoints API

| Méthode | Route        | Description                        |
|---------|--------------|------------------------------------|
| GET     | `/health`    | Statut du serveur                  |
| GET     | `/db-health` | Statut de la connexion PostgreSQL  |

---

## Tests

```bash
cd backend
npm install
npm test
```

Le test vérifie que `GET /health` retourne un statut 200 avec `{ status: 'ok' }`.

---

## Secrets GitHub Actions requis

Configurer les secrets suivants dans **Settings > Secrets and variables > Actions** du dépôt GitHub :

| Secret               | Description                        |
|----------------------|------------------------------------|
| `DOCKERHUB_USERNAME` | Nom d'utilisateur DockerHub        |
| `DOCKERHUB_TOKEN`    | Token d'accès DockerHub            |
| `VM_IP`              | Adresse IP de la VM Azure          |
| `VM_USER`            | Utilisateur SSH de la VM           |
| `VM_PASSWORD`        | Mot de passe SSH de la VM          |

---

## Technologies utilisées

- **Backend** : Node.js, Express, PostgreSQL (`pg`)
- **Frontend** : HTML, CSS, JavaScript vanilla
- **Conteneurisation** : Docker (multi-stage builds)
- **Orchestration** : Kubernetes / K3s
- **CI/CD** : GitHub Actions
- **Registry** : DockerHub
- **Cloud** : Azure VM
