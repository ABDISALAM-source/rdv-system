# 📅 Système de Gestion de Rendez-vous
## Interface futuriste | React + Laravel + MySQL (XAMPP)

---

## 🚀 INSTALLATION RAPIDE

### Prérequis
- **XAMPP** (PHP 8.1+, MySQL, Apache)
- **Node.js** 18+ avec npm
- **Composer** (PHP package manager)

---

## ÉTAPE 1 — Base de données MySQL

1. Démarrez **XAMPP** → Activez **Apache** et **MySQL**
2. Ouvrez **phpMyAdmin** → `http://localhost/phpmyadmin`
3. Cliquez sur **"Nouvelle base de données"** → Nommez-la `rdv_system` → Créer
4. Sélectionnez `rdv_system` → onglet **SQL** → Collez et exécutez le contenu de :
   ```
   backend/database/migrations/create_appointments_table.sql
   ```

---

## ÉTAPE 2 — Backend Laravel

Ouvrez un terminal dans le dossier `backend/` :

```bash
# 1. Installer les dépendances PHP
composer install

# 2. Configurer l'environnement
cp .env .env.backup
# Vérifiez que dans .env :
# DB_HOST=127.0.0.1
# DB_DATABASE=rdv_system
# DB_USERNAME=root
# DB_PASSWORD=       (vide par défaut sous XAMPP)

# 3. Générer la clé d'application
php artisan key:generate

# 4. Installer Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# 5. Lancer le serveur Laravel (port 8000)
php artisan serve
```

✅ Le backend tourne sur `http://localhost:8000`

---

## ÉTAPE 3 — Frontend React

Ouvrez un **nouveau terminal** dans le dossier `frontend/` :

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

✅ Le frontend tourne sur `http://localhost:5173`

---

## 🌐 ACCÈS À L'APPLICATION

| Page | URL |
|------|-----|
| 🏠 Page d'accueil (visiteur) | `http://localhost:5173` |
| 🔐 Connexion Admin | `http://localhost:5173/admin` |
| 📊 Tableau de bord Admin | `http://localhost:5173/admin/dashboard` |

---

## 🔐 IDENTIFIANTS ADMIN PAR DÉFAUT

```
Email    : admin@rdvsystem.fr
Password : password
```

> ⚠️ Changez ces identifiants en production !

---

## 📧 CONFIGURATION EMAIL (Optionnel)

Pour recevoir de vrais emails, configurez dans `backend/.env` :

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre@email.com
MAIL_PASSWORD=votre_mot_de_passe_app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=votre@email.com
MAIL_FROM_NAME="Système RDV"
```

**Pour Gmail :** Activez la 2FA → Créez un "Mot de passe d'application"

**Pour tester sans serveur mail :** Utilisez [Mailtrap](https://mailtrap.io) (gratuit).

---

## 🎯 FONCTIONNALITÉS

### 👥 Interface Visiteur
- ✨ Page d'accueil futuriste avec animations de particules
- 📅 Formulaire de prise de RDV en 4 étapes :
  1. Informations personnelles (nom, prénom, email, tél, sexe, objet)
  2. Calendrier interactif avec créneaux indisponibles en rouge
  3. Sélection du niveau d'urgence (Normal → Critique avec couleurs)
  4. Récapitulatif + confirmation
- 📧 Email de confirmation automatique

### 🛡️ Interface Admin
- 📊 Tableau de bord avec statistiques en temps réel
- ⏳ Onglet "En Attente" avec 3 actions :
  - ✅ **Accepter** → Email de confirmation au client
  - 💬 **Refuser avec explication** → Email avec motif
  - ✗ **Refuser directement** → Email de refus simple
- ✅ Onglet "Acceptés" → Liste des RDV confirmés
- ❌ Onglet "Refusés" → Historique avec motifs
- 🖨️ Impression des tableaux par catégorie
- 🔄 Actualisation automatique toutes les 30 secondes

---

## 🏗️ STRUCTURE DU PROJET

```
rdv-system/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/   # AppointmentController, AdminController, AuthController
│   │   ├── Mail/               # Templates d'emails
│   │   ├── Models/             # Appointment, Admin
│   │   └── Http/Middleware/    # AdminMiddleware
│   ├── database/migrations/    # Script SQL
│   ├── resources/views/emails/ # Templates email HTML
│   ├── routes/api.php          # Routes API
│   └── .env                    # Configuration
│
└── frontend/                   # React + Vite
    └── src/
        ├── pages/
        │   ├── HomePage.jsx     # Landing page futuriste
        │   ├── AdminLogin.jsx   # Connexion admin
        │   └── AdminDashboard.jsx # Tableau de bord
        ├── components/
        │   ├── AppointmentModal.jsx # Formulaire RDV (4 étapes)
        │   ├── Calendar.jsx    # Calendrier interactif
        │   ├── AppointmentTable.jsx # Tableau admin
        │   ├── RefuseModal.jsx # Modal refus avec explication
        │   ├── PrintTable.jsx  # Impression des tableaux
        │   └── ParticleField.jsx # Animation Canvas
        ├── context/AuthContext.jsx # Gestion auth
        ├── utils/api.js        # Axios configuré
        └── index.css           # Design system futuriste
```

---

## 🎨 DESIGN SYSTEM

- **Police Display :** Orbitron (titres, données clés)
- **Police Corps :** Rajdhani (texte courant)  
- **Police Mono :** Space Mono (dates, codes, IDs)
- **Couleurs Urgence :**
  - 🟢 Normal : `#00E676`
  - 🟡 Faible : `#FFD700`
  - 🟠 Moyen : `#FF8C00`
  - 🔴 Urgent : `#FF4500`
  - 🔴 Critique : `#FF0040` (avec animation pulsante)

---

## 🔧 BUILD DE PRODUCTION

```bash
# Frontend
cd frontend && npm run build
# Les fichiers sont dans frontend/dist/

# Servir le frontend depuis Laravel (optionnel)
# Copiez dist/ dans public/ de Laravel
```

---

## 📞 Support

En cas de problème :
1. Vérifiez que XAMPP (Apache + MySQL) est bien démarré
2. Vérifiez que `php artisan serve` tourne sur le port 8000
3. Vérifiez que `npm run dev` tourne sur le port 5173
4. Consultez les logs : `backend/storage/logs/laravel.log`
