-- ============================================
-- SYSTÈME DE GESTION DE RENDEZ-VOUS
-- Base de données MySQL - XAMPP
-- ============================================

CREATE DATABASE IF NOT EXISTS rdv_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rdv_system;

-- Table des rendez-vous
CREATE TABLE IF NOT EXISTS appointments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    sexe ENUM('homme', 'femme', 'autre') NOT NULL,
    objet VARCHAR(255) NOT NULL,
    description TEXT NULL,
    date_rdv DATE NOT NULL,
    heure_rdv TIME NOT NULL,
    urgence ENUM('normal', 'faible', 'moyen', 'urgent', 'critique') NOT NULL DEFAULT 'normal',
    statut ENUM('en_attente', 'accepte', 'refuse', 'refuse_explique', 'reporte') NOT NULL DEFAULT 'en_attente',
    motif_refus TEXT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date_rdv (date_rdv),
    INDEX idx_statut (statut),
    INDEX idx_urgence (urgence),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table admin
CREATE TABLE IF NOT EXISTS admins (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin par défaut (mot de passe: password)
INSERT IGNORE INTO admins (nom, email, password) VALUES
('Administrateur', 'admin@rdvsystem.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Quelques rendez-vous de test
INSERT INTO appointments (nom, prenom, email, telephone, sexe, objet, description, date_rdv, heure_rdv, urgence, statut, token) VALUES
('Dupont', 'Jean', 'jean.dupont@email.fr', '0612345678', 'homme', 'Consultation médicale', 'Douleur chronique au dos depuis 3 semaines', '2025-08-15', '09:00:00', 'urgent', 'en_attente', SHA2(CONCAT('jean.dupont', NOW(), RAND()), 256)),
('Martin', 'Sophie', 'sophie.martin@email.fr', '0698765432', 'femme', 'Bilan annuel', 'Contrôle de routine', '2025-08-16', '10:30:00', 'normal', 'accepte', SHA2(CONCAT('sophie.martin', NOW(), RAND()), 256)),
('Bernard', 'Marc', 'marc.bernard@email.fr', '0677889900', 'homme', 'Urgence cardiaque', 'Palpitations fréquentes', '2025-08-15', '14:00:00', 'critique', 'en_attente', SHA2(CONCAT('marc.bernard', NOW(), RAND()), 256));
