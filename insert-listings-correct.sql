-- Script SQL pour insérer 80 annonces avec les BONNES catégories
-- Généré le 03/12/2025 19:30
-- Catégories corrigées selon types.ts

-- Désactiver temporairement RLS
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;

-- 15 annonces Immobilier
INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Appartement 3 pièces à louer', 'Magnifique appartement lumineux de 75m² au cœur de Haifa. 2 chambres, salon spacieux, cuisine équipée, balcon avec vue. Proche de toutes commodités. Disponible immédiatement.', 'Immobilier', 'OFFRE', 4500, 'Haifa', '2025-10-15T09:35:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Studio meublé centre-ville', 'Charmant studio de 35m² entièrement meublé et équipé à Netanya. Idéal pour étudiant ou jeune actif. Charges comprises. Parking disponible.', 'Immobilier', 'OFFRE', 2800, 'Netanya', '2025-11-18T22:14:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Studio meublé centre-ville', 'Charmant studio de 35m² entièrement meublé et équipé à Netanya. Idéal pour étudiant ou jeune actif. Charges comprises. Parking disponible.', 'Immobilier', 'OFFRE', 2800, 'Netanya', '2025-10-22T21:39:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Studio meublé centre-ville', 'Charmant studio de 35m² entièrement meublé et équipé à Ashdod. Idéal pour étudiant ou jeune actif. Charges comprises. Parking disponible.', 'Immobilier', 'OFFRE', 2800, 'Ashdod', '2025-10-10T13:43:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Studio meublé centre-ville', 'Charmant studio de 35m² entièrement meublé et équipé à Ashdod. Idéal pour étudiant ou jeune actif. Charges comprises. Parking disponible.', 'Immobilier', 'OFFRE', 2800, 'Ashdod', '2025-10-02T13:49:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Colocation chambre disponible', 'Chambre meublée dans appartement partagé à Ashdod. Ambiance conviviale, proche transports. Toutes charges incluses. Disponible le 1er du mois.', 'Immobilier', 'OFFRE', 1800, 'Ashdod', '2025-10-31T17:27:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Villa avec jardin à vendre', 'Superbe villa de 180m² avec jardin de 200m² à Tel Aviv. 4 chambres, 2 salles de bain, grande terrasse. Quartier calme et résidentiel.', 'Immobilier', 'OFFRE', 2500000, 'Tel Aviv', '2025-11-02T17:23:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Villa avec jardin à vendre', 'Superbe villa de 180m² avec jardin de 200m² à Jérusalem. 4 chambres, 2 salles de bain, grande terrasse. Quartier calme et résidentiel.', 'Immobilier', 'OFFRE', 2500000, 'Jérusalem', '2025-11-14T08:49:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Bureau professionnel à louer', 'Espace de bureau moderne de 45m² à Jérusalem. Climatisation, internet haut débit, parking. Idéal pour profession libérale ou startup.', 'Immobilier', 'OFFRE', 3200, 'Jérusalem', '2025-10-02T14:23:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Recherche appartement 2-3 pièces', 'Couple français recherche appartement de 60-80m² à Ashdod. Budget max 5000 ILS/mois. Secteur calme souhaité. Disponibilité immédiate.', 'Immobilier', 'DEMANDE', 5000, 'Ashdod', '2025-10-02T11:39:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Famille cherche maison avec jardin', 'Famille avec 2 enfants cherche maison ou grande villa à Tel Aviv. Minimum 3 chambres. Jardin obligatoire. Budget flexible.', 'Immobilier', 'DEMANDE', 7000, 'Tel Aviv', '2025-11-10T19:04:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Cherche colocation sur Tel Aviv', 'Jeune professionnelle cherche colocation sympa à Haifa. Budget 2000 ILS max. Non-fumeur, propre et respectueux.', 'Immobilier', 'DEMANDE', 2000, 'Haifa', '2025-11-13T12:03:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Cherche colocation sur Tel Aviv', 'Jeune professionnelle cherche colocation sympa à Ashdod. Budget 2000 ILS max. Non-fumeur, propre et respectueux.', 'Immobilier', 'DEMANDE', 2000, 'Ashdod', '2025-10-05T08:41:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Cherche colocation sur Tel Aviv', 'Jeune professionnelle cherche colocation sympa à Haifa. Budget 2000 ILS max. Non-fumeur, propre et respectueux.', 'Immobilier', 'DEMANDE', 2000, 'Haifa', '2025-11-14T18:59:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Recherche appartement 2-3 pièces', 'Couple français recherche appartement de 60-80m² à Jérusalem. Budget max 5000 ILS/mois. Secteur calme souhaité. Disponibilité immédiate.', 'Immobilier', 'DEMANDE', 5000, 'Jérusalem', '2025-10-27T13:39:00.000Z');

-- 15 annonces Recrutement / Emploi
INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Professeur de français recherché', 'École internationale à Jérusalem cherche professeur de français natif. Classes de tous niveaux. CDI 30h/semaine. Expérience pédagogique souhaitée.', 'Recrutement / Emploi', 'OFFRE', 12000, 'Jérusalem', '2025-10-02T21:56:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Serveur/Serveuse restaurant français', 'Restaurant gastronomique à Jérusalem recrute serveur/serveuse francophone. Expérience en restauration demandée. Ambiance familiale et pourboires généreux.', 'Recrutement / Emploi', 'OFFRE', 8000, 'Jérusalem', '2025-10-15T07:05:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Serveur/Serveuse restaurant français', 'Restaurant gastronomique à Jérusalem recrute serveur/serveuse francophone. Expérience en restauration demandée. Ambiance familiale et pourboires généreux.', 'Recrutement / Emploi', 'OFFRE', 8000, 'Jérusalem', '2025-10-25T14:03:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Baby-sitter francophone', 'Famille française à Netanya cherche baby-sitter francophone pour 3 enfants (2, 5, 8 ans). 20h/semaine. Expérience avec enfants requise.', 'Recrutement / Emploi', 'OFFRE', 60, 'Netanya', '2025-11-24T19:36:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Professeur de français recherché', 'École internationale à Haifa cherche professeur de français natif. Classes de tous niveaux. CDI 30h/semaine. Expérience pédagogique souhaitée.', 'Recrutement / Emploi', 'OFFRE', 12000, 'Haifa', '2025-10-10T11:01:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Serveur/Serveuse restaurant français', 'Restaurant gastronomique à Ashdod recrute serveur/serveuse francophone. Expérience en restauration demandée. Ambiance familiale et pourboires généreux.', 'Recrutement / Emploi', 'OFFRE', 8000, 'Ashdod', '2025-11-29T18:19:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Professeur de français recherché', 'École internationale à Tel Aviv cherche professeur de français natif. Classes de tous niveaux. CDI 30h/semaine. Expérience pédagogique souhaitée.', 'Recrutement / Emploi', 'OFFRE', 12000, 'Tel Aviv', '2025-11-06T08:13:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Graphiste freelance missions régulières', 'Agence de communication à Haifa cherche graphiste freelance pour missions régulières. Maîtrise Adobe Suite obligatoire. Portfolio à fournir.', 'Recrutement / Emploi', 'OFFRE', 150, 'Haifa', '2025-10-25T19:55:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Graphiste freelance missions régulières', 'Agence de communication à Haifa cherche graphiste freelance pour missions régulières. Maîtrise Adobe Suite obligatoire. Portfolio à fournir.', 'Recrutement / Emploi', 'OFFRE', 150, 'Haifa', '2025-10-31T10:23:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Recherche développeur web React', 'Startup en croissance à Haifa recrute développeur React/Node.js expérimenté. Minimum 2 ans d''expérience. Télétravail partiel possible. Package attractif.', 'Recrutement / Emploi', 'OFFRE', 18000, 'Haifa', '2025-10-03T18:08:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Recherche stage marketing digital', 'Étudiant en Master Marketing cherche stage 6 mois à Tel Aviv. Compétences SEO, réseaux sociaux, Google Ads. Motivé et créatif.', 'Recrutement / Emploi', 'DEMANDE', 5000, 'Tel Aviv', '2025-10-13T15:13:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Chef cuisinier cherche restaurant', 'Chef cuisinier français avec 10 ans d''expérience cherche poste à Haifa. Spécialités françaises et méditerranéennes. Références disponibles.', 'Recrutement / Emploi', 'DEMANDE', 16000, 'Haifa', '2025-10-21T08:44:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Cherche emploi comptabilité', 'Comptable diplômé avec 5 ans d''expérience cherche poste à Ashdod. Maîtrise logiciels comptables et bilingue FR/HE. Disponible immédiatement.', 'Recrutement / Emploi', 'DEMANDE', 15000, 'Ashdod', '2025-10-12T15:21:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Cherche emploi comptabilité', 'Comptable diplômé avec 5 ans d''expérience cherche poste à Tel Aviv. Maîtrise logiciels comptables et bilingue FR/HE. Disponible immédiatement.', 'Recrutement / Emploi', 'DEMANDE', 15000, 'Tel Aviv', '2025-10-13T19:39:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Chef cuisinier cherche restaurant', 'Chef cuisinier français avec 10 ans d''expérience cherche poste à Netanya. Spécialités françaises et méditerranéennes. Références disponibles.', 'Recrutement / Emploi', 'DEMANDE', 16000, 'Netanya', '2025-10-13T14:55:00.000Z');

-- 15 annonces Vêtements / Mode
INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Chaussures Nike Air Max 42', 'Paire de Nike Air Max taille 42 portées 3 fois. État neuf, boîte d''origine. Modèle très recherché. Remise en main propre Ashdod.', 'Vêtements / Mode', 'OFFRE', 350, 'Ashdod', '2025-10-01T15:53:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Manteau d''hiver femme The North Face', 'Manteau The North Face taille S, noir, très chaud. Parfait pour l''hiver israélien en montagne. Comme neuf. Jérusalem.', 'Vêtements / Mode', 'OFFRE', 450, 'Jérusalem', '2025-10-28T09:42:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Robe de soirée Zara taille M', 'Magnifique robe de soirée Zara portée une seule fois. Taille M, couleur bleu nuit. Parfait état. Achetée 450 ILS. À récupérer à Ashdod.', 'Vêtements / Mode', 'OFFRE', 180, 'Ashdod', '2025-11-25T21:56:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Manteau d''hiver femme The North Face', 'Manteau The North Face taille S, noir, très chaud. Parfait pour l''hiver israélien en montagne. Comme neuf. Jérusalem.', 'Vêtements / Mode', 'OFFRE', 450, 'Jérusalem', '2025-11-29T14:11:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Costume homme Hugo Boss', 'Costume 2 pièces Hugo Boss taille 50, gris anthracite. Excellent état, nettoyage pressing. Idéal mariage ou événement. Netanya.', 'Vêtements / Mode', 'OFFRE', 800, 'Netanya', '2025-11-22T16:55:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Costume homme Hugo Boss', 'Costume 2 pièces Hugo Boss taille 50, gris anthracite. Excellent état, nettoyage pressing. Idéal mariage ou événement. Netanya.', 'Vêtements / Mode', 'OFFRE', 800, 'Netanya', '2025-10-09T11:27:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Lot vêtements bébé 0-6 mois', 'Lot de 25 pièces (bodies, pyjamas, robes) pour bébé fille 0-6 mois. Marques diverses, excellent état. Jérusalem.', 'Vêtements / Mode', 'OFFRE', 200, 'Jérusalem', '2025-10-03T19:28:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Robe de soirée Zara taille M', 'Magnifique robe de soirée Zara portée une seule fois. Taille M, couleur bleu nuit. Parfait état. Achetée 450 ILS. À récupérer à Netanya.', 'Vêtements / Mode', 'OFFRE', 180, 'Netanya', '2025-10-06T11:31:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Manteau d''hiver femme The North Face', 'Manteau The North Face taille S, noir, très chaud. Parfait pour l''hiver israélien en montagne. Comme neuf. Tel Aviv.', 'Vêtements / Mode', 'OFFRE', 450, 'Tel Aviv', '2025-11-16T15:58:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Manteau d''hiver femme The North Face', 'Manteau The North Face taille S, noir, très chaud. Parfait pour l''hiver israélien en montagne. Comme neuf. Tel Aviv.', 'Vêtements / Mode', 'OFFRE', 450, 'Tel Aviv', '2025-11-05T07:27:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Lot vêtements bébé 0-6 mois', 'Lot de 25 pièces (bodies, pyjamas, robes) pour bébé fille 0-6 mois. Marques diverses, excellent état. Jérusalem.', 'Vêtements / Mode', 'OFFRE', 200, 'Jérusalem', '2025-10-20T14:25:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Manteau d''hiver femme The North Face', 'Manteau The North Face taille S, noir, très chaud. Parfait pour l''hiver israélien en montagne. Comme neuf. Ashdod.', 'Vêtements / Mode', 'OFFRE', 450, 'Ashdod', '2025-10-17T08:24:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Cherche vêtements garçon 4-5 ans', 'Maman cherche vêtements pour garçon de 4-5 ans. Toutes saisons. Bon état souhaité. Budget flexible. Tel Aviv.', 'Vêtements / Mode', 'DEMANDE', 300, 'Tel Aviv', '2025-11-11T08:09:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Recherche costume homme mariage', 'Homme taille 48 cherche costume élégant pour mariage. Couleur sobre. Location ou achat. Budget 1000 ILS max. Netanya.', 'Vêtements / Mode', 'DEMANDE', 1000, 'Netanya', '2025-10-09T12:29:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Cherche vêtements garçon 4-5 ans', 'Maman cherche vêtements pour garçon de 4-5 ans. Toutes saisons. Bon état souhaité. Budget flexible. Netanya.', 'Vêtements / Mode', 'DEMANDE', 300, 'Netanya', '2025-10-24T06:55:00.000Z');

-- 20 annonces Maison / Décoration
INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Réfrigérateur Samsung 400L', 'Réfrigérateur Samsung 400L, 2 ans, parfait état de marche. Classe énergétique A++. Cause déménagement. Jérusalem.', 'Maison / Décoration', 'OFFRE', 1800, 'Jérusalem', '2025-10-08T20:47:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Table à manger + 6 chaises', 'Belle table en bois massif avec 6 chaises assorties. Parfait état. Idéal pour famille. Dimensions: 180x90cm. Haifa.', 'Maison / Décoration', 'OFFRE', 2200, 'Haifa', '2025-11-09T15:37:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Réfrigérateur Samsung 400L', 'Réfrigérateur Samsung 400L, 2 ans, parfait état de marche. Classe énergétique A++. Cause déménagement. Ashdod.', 'Maison / Décoration', 'OFFRE', 1800, 'Ashdod', '2025-11-21T12:14:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Table à manger + 6 chaises', 'Belle table en bois massif avec 6 chaises assorties. Parfait état. Idéal pour famille. Dimensions: 180x90cm. Haifa.', 'Maison / Décoration', 'OFFRE', 2200, 'Haifa', '2025-11-26T11:09:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Ensemble vaisselle 24 pièces', 'Service de vaisselle complet Ikea pour 6 personnes. Porcelaine blanche. Jamais servi, encore dans cartons. Tel Aviv.', 'Maison / Décoration', 'OFFRE', 280, 'Tel Aviv', '2025-10-14T15:35:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Réfrigérateur Samsung 400L', 'Réfrigérateur Samsung 400L, 2 ans, parfait état de marche. Classe énergétique A++. Cause déménagement. Netanya.', 'Maison / Décoration', 'OFFRE', 1800, 'Netanya', '2025-10-16T18:29:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Table à manger + 6 chaises', 'Belle table en bois massif avec 6 chaises assorties. Parfait état. Idéal pour famille. Dimensions: 180x90cm. Netanya.', 'Maison / Décoration', 'OFFRE', 2200, 'Netanya', '2025-10-02T08:21:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Lit double avec matelas', 'Lit double (160x200) avec sommier et matelas Ikea récent (1 an). Très bon état. Possibilité de livraison sur Netanya.', 'Maison / Décoration', 'OFFRE', 900, 'Netanya', '2025-10-29T14:23:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Canapé 3 places beige', 'Canapé 3 places très confortable en tissu beige. Excellent état, non fumeur, pas d''animaux. L 210cm. À venir chercher à Tel Aviv.', 'Maison / Décoration', 'OFFRE', 1500, 'Tel Aviv', '2025-10-12T17:41:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Miroir mural design 120x80', 'Grand miroir mural design avec cadre doré. Dimensions 120x80cm. État neuf, acheté chez Zara Home. Ashdod.', 'Maison / Décoration', 'OFFRE', 350, 'Ashdod', '2025-11-16T15:58:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Ensemble vaisselle 24 pièces', 'Service de vaisselle complet Ikea pour 6 personnes. Porcelaine blanche. Jamais servi, encore dans cartons. Netanya.', 'Maison / Décoration', 'OFFRE', 280, 'Netanya', '2025-11-12T20:28:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Miroir mural design 120x80', 'Grand miroir mural design avec cadre doré. Dimensions 120x80cm. État neuf, acheté chez Zara Home. Haifa.', 'Maison / Décoration', 'OFFRE', 350, 'Haifa', '2025-10-31T14:18:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Lit double avec matelas', 'Lit double (160x200) avec sommier et matelas Ikea récent (1 an). Très bon état. Possibilité de livraison sur Jérusalem.', 'Maison / Décoration', 'OFFRE', 900, 'Jérusalem', '2025-10-16T17:23:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Recherche canapé-lit confortable', 'Cherche canapé convertible en bon état pour studio. Budget max 2000 ILS. Mécanisme facile et matelas confortable. Ashdod.', 'Maison / Décoration', 'DEMANDE', 2000, 'Ashdod', '2025-11-08T13:59:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Recherche canapé-lit confortable', 'Cherche canapé convertible en bon état pour studio. Budget max 2000 ILS. Mécanisme facile et matelas confortable. Haifa.', 'Maison / Décoration', 'DEMANDE', 2000, 'Haifa', '2025-11-08T14:43:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Cherche meubles complets appartement', 'Jeune couple emménage à Haifa, cherche meubles complets : salon, chambre, cuisine. Budget 10000 ILS. Lot complet souhaité.', 'Maison / Décoration', 'DEMANDE', 10000, 'Haifa', '2025-10-08T20:52:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Cherche meubles complets appartement', 'Jeune couple emménage à Ashdod, cherche meubles complets : salon, chambre, cuisine. Budget 10000 ILS. Lot complet souhaité.', 'Maison / Décoration', 'DEMANDE', 10000, 'Ashdod', '2025-10-27T11:59:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Recherche canapé-lit confortable', 'Cherche canapé convertible en bon état pour studio. Budget max 2000 ILS. Mécanisme facile et matelas confortable. Haifa.', 'Maison / Décoration', 'DEMANDE', 2000, 'Haifa', '2025-11-18T13:53:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Recherche canapé-lit confortable', 'Cherche canapé convertible en bon état pour studio. Budget max 2000 ILS. Mécanisme facile et matelas confortable. Tel Aviv.', 'Maison / Décoration', 'DEMANDE', 2000, 'Tel Aviv', '2025-10-08T14:52:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Recherche canapé-lit confortable', 'Cherche canapé convertible en bon état pour studio. Budget max 2000 ILS. Mécanisme facile et matelas confortable. Tel Aviv.', 'Maison / Décoration', 'DEMANDE', 2000, 'Tel Aviv', '2025-10-04T09:14:00.000Z');

-- 15 annonces Services
INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Aide ménagère sérieuse', 'Dame sérieuse et expérimentée propose services ménage/repassage à Jérusalem. Références disponibles. Produits fournis. Paiement facture.', 'Services', 'OFFRE', 60, 'Jérusalem', '2025-10-21T11:32:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Déménagement petit volume', 'Service de déménagement pour petits volumes à Ashdod. Van équipé, aide au portage. Tarif à l''heure. Disponible week-ends.', 'Services', 'OFFRE', 150, 'Ashdod', '2025-11-01T18:00:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Cours de français tous niveaux', 'Professeure diplômée donne cours de français à Haifa. Tous niveaux, conversation, préparation examens. À domicile ou en ligne. Expérience 10 ans.', 'Services', 'OFFRE', 120, 'Haifa', '2025-10-19T18:53:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Aide ménagère sérieuse', 'Dame sérieuse et expérimentée propose services ménage/repassage à Ashdod. Références disponibles. Produits fournis. Paiement facture.', 'Services', 'OFFRE', 60, 'Ashdod', '2025-10-25T07:45:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Déménagement petit volume', 'Service de déménagement pour petits volumes à Ashdod. Van équipé, aide au portage. Tarif à l''heure. Disponible week-ends.', 'Services', 'OFFRE', 150, 'Ashdod', '2025-11-01T11:24:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Aide ménagère sérieuse', 'Dame sérieuse et expérimentée propose services ménage/repassage à Haifa. Références disponibles. Produits fournis. Paiement facture.', 'Services', 'OFFRE', 60, 'Haifa', '2025-11-06T10:50:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Cherche traducteur FR-HE professionnel', 'Besoin traducteur professionnel français-hébreu pour documents officiels. Traduction assermentée. Urgent. Ashdod.', 'Services', 'DEMANDE', 500, 'Ashdod', '2025-11-24T17:18:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Recherche coach sportif personnel', 'Cherche coach sportif pour remise en forme à Tel Aviv. 2-3 séances/semaine. Programme personnalisé. Diplômé souhaité.', 'Services', 'DEMANDE', 200, 'Tel Aviv', '2025-11-12T19:48:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Recherche coach sportif personnel', 'Cherche coach sportif pour remise en forme à Ashdod. 2-3 séances/semaine. Programme personnalisé. Diplômé souhaité.', 'Services', 'DEMANDE', 200, 'Ashdod', '2025-10-09T15:23:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Cherche électricien urgent', 'Problème électrique urgent à résoudre à Haifa. Plusieurs prises qui ne fonctionnent plus. Intervention rapide souhaitée.', 'Services', 'DEMANDE', 300, 'Haifa', '2025-10-10T13:51:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Cherche électricien urgent', 'Problème électrique urgent à résoudre à Netanya. Plusieurs prises qui ne fonctionnent plus. Intervention rapide souhaitée.', 'Services', 'DEMANDE', 300, 'Netanya', '2025-11-18T14:27:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('992776de-0cb6-4ad4-8608-870e9c95e2b2', 'Cherche traducteur FR-HE professionnel', 'Besoin traducteur professionnel français-hébreu pour documents officiels. Traduction assermentée. Urgent. Netanya.', 'Services', 'DEMANDE', 500, 'Netanya', '2025-10-03T10:00:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('b8b7c8c8-faf3-4aff-91a5-0d3cda969524', 'Recherche coach sportif personnel', 'Cherche coach sportif pour remise en forme à Jérusalem. 2-3 séances/semaine. Programme personnalisé. Diplômé souhaité.', 'Services', 'DEMANDE', 200, 'Jérusalem', '2025-11-30T18:32:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('189251a6-beb3-4641-a3db-126d3132a1da', 'Recherche coach sportif personnel', 'Cherche coach sportif pour remise en forme à Ashdod. 2-3 séances/semaine. Programme personnalisé. Diplômé souhaité.', 'Services', 'DEMANDE', 200, 'Ashdod', '2025-10-19T10:44:00.000Z');

INSERT INTO listings (user_id, title, description, category, type, price, city, created_at)
VALUES ('5b9bed83-5e24-4cef-9cb7-a58719afb4c7', 'Recherche coach sportif personnel', 'Cherche coach sportif pour remise en forme à Jérusalem. 2-3 séances/semaine. Programme personnalisé. Diplômé souhaité.', 'Services', 'DEMANDE', 200, 'Jérusalem', '2025-10-22T16:06:00.000Z');

-- Réactiver RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Vérifications
SELECT COUNT(*) as total_listings FROM listings;
SELECT category, COUNT(*) as count FROM listings GROUP BY category ORDER BY category;
SELECT type, COUNT(*) as count FROM listings GROUP BY type;
