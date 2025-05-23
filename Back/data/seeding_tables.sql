BEGIN;

-- Pour aider les Windows Users ;-) 
SET client_encoding TO 'UTF8';

-- Utilisateurs
INSERT INTO "user" ("id", "email", "pseudo", "password", "role") VALUES
(1, 'alice@example.com', 'Alice', '$argon2id$v=19$m=65536,t=3,p=4$SmQqgs7cPZeqknrXUAYEEw$VheJAhIYqyBMucUGjjeyDGXWqiY1FTBeIgBGbHdBqq0', 'member'),
(2, 'admin@example.com', 'admin', '$argon2id$v=19$m=65536,t=3,p=4$NslWcwdf0kf54TXHF88WAg$e+moYlURJl0HcWVEWM2QPETRtR5I+6A7WNrobeULuVM', 'admin');

-- Catégories de plats
INSERT INTO "dish_category" ("id", "name") VALUES
(1, 'Entrée'),
(2, 'Plat principal'),
(3, 'Dessert'),
(4, 'Apéritif'),
(5, 'Boisson'),
(6, 'Petit-déjeuner'),
(7, 'Pâtisserie');

-- Difficultés
INSERT INTO "difficulty" ("id", "name") VALUES
(1, 'Très facile'),
(2, 'Facile'),
(3, 'Moyen'),
(4, 'Difficile'),
(5, 'Très Difficile');

-- Formats
INSERT INTO "motion_format" ("id", "name") VALUES
(1, 'Film'),
(2, 'Série'),
(3, 'Documentaire'),
(4, 'Court-métrage'),
(5, 'Film d''animation'),
(6, 'Web-série'),
(7, 'Téléfilm'),
(8, 'Mini-série'),
(9, 'Spécial TV'),
(10, 'Clip musical'),
(11, 'Stand-up'),
(12, 'Série animée');

-- Motions
INSERT INTO "motion" (
  "id", "title", "picture", "release_date", "director", "catchphrase", "description", "motion_format_id"
) VALUES
(1, 'Naruto', '/uploads/movies/1.webp', '03/10/2002', 'Hayato Date', 'Le ninja le plus déterminé', 'L''aventure d''un jeune ninja qui rêve de devenir le plus grand Hokage.',12),
(2, 'Pulp Fiction', '/uploads/movies/2.webp', '14/10/1994', 'Quentin Tarantino', 'It’s the little differences.', 'Un film culte entre histoires entrecroisées de violence, humour noir et rédemption.',1),
(3, 'La Belle et le Clochard', '/uploads/movies/3.webp', '22/06/1955', 'Clyde Geronimi', 'Un amour digne d''un conte de fées.', 'L''histoire d''un chien de salon et d''un chien de ruelle qui vivent une romance inoubliable.', 5),
(4, 'Ratatouille', '/uploads/movies/4.webp', '29/06/2007', 'Brad Bird', 'Anyone can cook!', 'Un rat rêve de devenir chef dans un restaurant parisien et affronte de nombreux défis.', 5),
(5, 'Le Voyage de Chihiro', '/uploads/movies/5.webp', '20/07/2001', 'Hayao Miyazaki', 'Là où les rêves et les fantômes se rencontrent.', 'Une jeune fille se retrouve piégée dans un monde spirituel et doit sauver ses parents.', 5),
(6, 'Le Père Noël est une ordure', '/uploads/movies/6.webp', '20/12/1982', 'Jean-Marie Poiré', 'C’est pas Noël tous les jours !', 'Un groupe de bénévoles d’une association accueille un Père Noël un peu particulier.', 1),
(7, 'Le Château Ambulant', '/uploads/movies/7.webp', '20/11/2004', 'Hayao Miyazaki', 'La magie et l''amour sont des armes puissantes.', 'Une jeune fille est transformée en vieille dame et cherche à briser la malédiction avec l’aide d’un château ambulant magique.',5);

-- Genres
INSERT INTO "motion_genre" ("id", "name") VALUES
(1, 'Animation'),
(2, 'Action'),
(3, 'Aventure'),
(4, 'Comédie'),
(5, 'Drame'),
(6, 'Fantasy'),
(7, 'Science-Fiction'),
(8, 'Romance'),
(9, 'Animation Japonaise'),
(10, 'Comédie noire'),
(11, 'Animation pour enfants'),
(12, 'Classique');


INSERT INTO "motion_genre_has_motion" ("motion_genre_id", "motion_id") VALUES
(1, 1),  -- Naruto -> Animation
(2, 1),  -- Naruto -> Action
(3, 1),  -- Naruto -> Aventure
(4, 2),  -- Pulp Fiction -> Comédie
(5, 2),  -- Pulp Fiction -> Drame
(10, 2), -- Pulp Fiction -> Comédie noire
(1, 3),  -- La Belle et le Clochard -> Animation
(8, 3),  -- La Belle et le Clochard -> Romance
(11, 3), -- La Belle et le Clochard -> Animation pour enfants
(1, 4),  -- Ratatouille -> Animation
(4, 4),  -- Ratatouille -> Comédie
(3, 4),  -- Ratatouille -> Aventure
(1, 5),  -- Le Voyage de Chihiro -> Animation
(6, 5),  -- Le Voyage de Chihiro -> Fantasy
(5, 5),  -- Le Voyage de Chihiro -> Drame
(4, 6),  -- Le Père Noël est une ordure -> Comédie
(1, 7),  -- Le Château Ambulant -> Animation
(6, 7),  -- Le Château Ambulant -> Fantasy
(3, 7);  -- Le Château Ambulant -> Aventure

-- Ingrédients
INSERT INTO "ingredient" ("id", "name") VALUES
(1, 'Nouilles ramen'),
(2, 'Narutomaki'),
(3, 'Porc braisé'),
(4, 'Œufs'),
(5, 'Pain burger'),
(6, 'Steak haché'),
(7, 'Fromage cheddar'),
(8, 'Salade'),
(9, 'Oignons'),
(10, 'Spaghetti'),
(11, 'Viande hachée'),
(12, 'Herbes de Provence'),
(13, 'Aubergines'),
(14, 'Courgettes'),
(15, 'Poivrons'),
(16, 'Sauce chili'),
(17, 'Tomates'),
(18, 'Farce de porc'),
(19, 'Chou chinois'),
(20, 'Sauce soja'),
(21, 'Bacon'),
(22, 'Pain de campagne'),
(23, 'Chocolat noir'),
(24, 'Fruits confits'),
(25, 'Cacahuètes'),
(26, 'Chapelure'),
(27, 'Pâte miso'),
(28, 'Mirin'),
(29, 'Algue kombu'),
(30, 'Bonite séchée'),
(31, 'Oignons verts'),
(32, 'Sel'),
(33, 'Poivre'),
(34, 'Beurre'),
(35, 'Frites'),
(36, 'Ail'),
(37, 'Huile d''olive'),
(38, 'Parmesan râpé'),
(39, 'Sauce soja douce'),
(40, 'Cacahuètes grillées'),
(41, 'Crème fraîche'),
(42, 'Lait'),
(43, 'Farine'),
(44, 'Riz'),
(45, 'Œufs de caille'),
(46, 'Pomme de terre'),
(47, 'Pâtes'),
(48, 'Poivron rouge'),
(49, 'Carottes'),
(50, 'Ciboulette'),
(51, 'Chou frisé'),
(52, 'Haricots verts'),
(53, 'Cresson'),
(54, 'Citron'),
(55, 'Gingembre'),
(56, 'Curry'),
(57, 'Vinaigre balsamique'),
(58, 'Moutarde'),
(59, 'Huile de sésame'),
(60, 'Coco râpé'),
(61, 'Amandes'),
(62, 'Raisins secs'),
(63, 'Pistaches'),
(64, 'Basilic'),
(65, 'Thym'),
(66, 'Romarin'),
(67, 'Laurier'),
(68, 'Chocolat au lait'),
(69, 'Crème liquide'),
(70, 'Café'),
(71, 'Cacao en poudre'),
(72, 'Noix de muscade'),
(73, 'Lentilles'),
(74, 'Pois chiches'),
(75, 'Sésame'),
(76, 'Maïs'),
(77, 'Courge'),
(78, 'Épinards'),
(79, 'Lait de coco'),
(80, 'Sel de mer'),
(81, 'Huile de tournesol'),
(82, 'Vinaigre de cidre'),
(83, 'Sucre brun'),
(84, 'Miel'),
(85, 'Bouillon de légumes'),
(86, 'Bouillon de volaille'),
(87, 'Piment de Cayenne'),
(88, 'Basilic frais'),
(89, 'Échalotes'),
(90, 'Sucre glace'),
(91, 'Menthe'),
(92, 'Moutarde de Dijon'),
(93, 'Sauce tomate'),
(94, 'Noix de pécan'),
(95, 'Poudre d’amande'),
(96, 'Chaufferie'),
(97, 'Curry jaune'),
(98, 'Gousse de vanille'),
(99, 'Gingembre frais'),
(100, 'Tomates séchées'),
(101, 'Câpres'),
(102, 'Gousses d’ail'),
(103, 'Vinaigre balsamique'),
(104, 'Huile d’olive vierge'),
(105, 'Paprika doux'),
(106, 'Romarin frais'),
(107, 'Thym frais'),
(108, 'Laurier frais'),
(109, 'Aneth'),
(110, 'Ciboulette fraîche'),
(111, 'Raisins secs'),
(112, 'Pistaches non salées'),
(113, 'Amandes effilées'),
(114, 'Cacao amer'),
(115, 'Chocolat blanc'),
(116, 'Crème de marrons'),
(117, 'Fruits rouges'),
(118, 'Pêches au sirop'),
(119, 'Abricots secs'),
(120, 'Fruits de la passion'),
(121, 'Mangue fraîche'),
(122, 'Papaye'),
(123, 'Kiwi'),
(124, 'Framboises fraîches'),
(125, 'Myrtilles'),
(126, 'Pâte feuilletée'),
(127, 'Crème pâtissière'),
(128, 'Gélatine'),
(129, 'Sucre vanillé'),
(130, 'Fruits frais'),
(131, 'Pâte à tartiner'),
(132, 'Caramel au beurre salé'),
(133, 'Crème anglaise'),
(134, 'Meringue'),
(135, 'Chantilly'); 

-- Recettes
INSERT INTO "recipe" (
  "id", "title", "picture", "description", "instruction", "anecdote", "completion_time",
  "user_id", "dish_category_id", "motion_id", "difficulty_id"
) VALUES
(1,'Miso Ramen de Naruto','/uploads/recipes/1.webp','Un bol de ramen chaud et nourrissant, tel que Naruto les aime chez Ichiraku.',
'
Préparer un dashi en faisant frémir 500ml d''eau avec un morceau d''algue kombu pendant 10 minutes. Retirer le kombu et ajouter 10g de bonite séchée. Laisser infuser 5 minutes, puis filtrer.
Mélanger le dashi avec 2 c. à soupe de pâte miso, 1 c. à soupe de sauce soja et 1 c. à café de mirin. Chauffer doucement sans faire bouillir.
Cuire les nouilles ramen dans une grande casserole d''eau bouillante pendant 3-4 minutes, puis égoutter.
Préparer l''œuf mollet : cuire un œuf pendant 6 minutes, le plonger dans l''eau glacée, puis l''écaler.
Réchauffer le porc braisé (chashu) en tranches fines.
Dans un bol, disposer les nouilles, verser le bouillon chaud, ajouter l''œuf coupé en deux, quelques tranches de chashu, du narutomaki et des oignons verts émincés. Servir immédiatement.'
, 'C''est le plat préféré de Naruto – il en mange dès qu''il en a l''occasion.', 40, 1, 2, 1, 2),


(2,'Royale with Cheese','/uploads/recipes/2.webp','Un burger juteux à la française, clin d’œil à une scène culte du film.',
'
Assaisonner le steak haché avec sel et poivre, puis le former en palet de 125 g.
Cuire le steak dans une poêle chaude 2-3 minutes de chaque côté selon la cuisson désirée.
Griller les pains à burger au grille-pain ou à la poêle avec un peu de beurre.
Monter le burger : base de pain, steak, cheddar fondu, oignons émincés, feuilles de salade.
Ajouter le chapeau du pain et servir bien chaud avec des frites.'
,'Comme dirait Vincent Vega : "You know what they call a Quarter Pounder with Cheese in Paris?"',25,1,2,2,1),


(3, 'Spaghetti à la Lady & Tramp', '/uploads/recipes/3.webp',
'Des spaghetti fondants aux boulettes, comme lors du dîner romantique derrière le resto italien.',
'
Cuire les spaghetti dans une grande casserole d''eau bouillante salée jusqu''à ce qu''elles soient al dente (environ 8 à 10 min). Égoutter et réserver.
Préparer la sauce tomate : dans une poêle, faire chauffer de l''huile d''olive, ajouter de l''ail émincé et des tomates concassées, puis assaisonner avec du sel, du poivre et des herbes de Provence.
Former des boulettes avec la viande hachée, ajouter de l''oignon, de l''ail, du sel, du poivre et de l''œuf. Cuire les boulettes dans une poêle jusqu''à ce qu''elles soient dorées de tous côtés.
Mélanger les spaghetti, la sauce tomate et les boulettes dans la poêle. Laisser mijoter 5 minutes.
Servir les spaghetti et les boulettes chaudes, garnis de parmesan râpé.'
,'Inspiré du plus romantique des dîners canins.',
35, 1, 2, 3, 1),


(4, 'Ratatouille confite à la Rémy', '/uploads/recipes/4.webp',
'Des légumes du soleil joliment dressés à la manière du petit chef.',
'
Préchauffer le four à 180°C (350°F).
Laver et couper en fines tranches les légumes : aubergines, courgettes, poivrons et tomates.
Disposer les tranches de légumes en rosace dans un plat allant au four.
Dans un petit bol, mélanger de l''huile d''olive, du sel, du poivre et des herbes de Provence.
Verser cette préparation sur les légumes pour bien les enrober.
Couvrir le plat avec du papier aluminium et cuire au four pendant 45 minutes.
Retirer le papier aluminium et continuer la cuisson pendant 15 minutes supplémentaires pour laisser les légumes légèrement dorer.
Servir chaud, accompagné d''une garniture ou d''un plat de votre choix.'
,'Ce plat touche même le critique le plus dur : Anton Ego.',
60, 1, 2, 4, 2),


(5, 'Boulettes vapeur de Yubaba', '/uploads/recipes/5.webp',
'Des bouchées fondantes à base de porc et de légumes, comme dans le banquet des esprits.',
'
Dans un grand bol, mélanger la viande hachée de porc, la farce de porc, le chou chinois râpé, la sauce soja et une pincée de sel.
Pétrir la mixture jusqu''à ce que tout soit bien amalgamé.
Former des boulettes de la taille d''une noix.
Faire chauffer de l''eau dans un panier vapeur et y placer les boulettes en veillant à ce qu''elles ne se touchent pas.
Couvrir et cuire à la vapeur pendant 20-25 minutes jusqu''à ce que les boulettes soient bien cuites.
Servir les boulettes chaudes avec un peu de sauce soja douce ou de la sauce chili sucrée selon vos préférences.'
,'Inspirées du festin mystique qui a transformé les parents de Chihiro.',
50, 1, 2, 5, 3),


(6, 'Pain aux œufs de Howl', '/uploads/recipes/6.webp',
'Petit-déj rustique cuit sur la flamme magique de Calcifer : pain grillé, œufs au plat, bacon.',
'
Faire chauffer une poêle à feu moyen et y faire griller les tranches de pain jusqu''à ce qu''elles soient bien dorées et croquantes.
Dans une autre poêle, faire cuire les œufs au plat avec un peu de beurre, en veillant à ce que le jaune reste intact.
Dans la même poêle, cuire le bacon jusqu''à ce qu''il soit croustillant et doré.
Une fois le pain grillé, disposer les tranches sur une assiette.
Déposer délicatement les œufs sur les tranches de pain grillé.
Ajouter les tranches de bacon croustillant sur le dessus.
Servir chaud avec un peu de poivre ou de sauce si désiré.'
,'Une scène simple, mais ultra chaleureuse, avec Calcifer au feu.',
15, 1, 6, 7, 1),


(7, 'Doubitchou maison de M. Preskovitch', '/uploads/recipes/7.webp',
'Petites bouchées feuilletées au chocolat et aux fruits confits, à déguster avec méfiance.',
'
Faire fondre le chocolat noir dans une petite casserole à feu doux en remuant régulièrement pour éviter qu''il ne brûle.
Incorporer les fruits confits hachés et les cacahuètes grillées au chocolat fondu.
Ajouter la chapelure pour lier la préparation et donner de la texture.
Former des petites boules avec la préparation à l''aide de deux cuillères à soupe ou avec les mains.
Rouler chaque bouchée dans la chapelure pour l''enrober complètement.
Laisser reposer les bouchées au frais pendant au moins 30 minutes pour qu''elles se raffermissent.
Servir froid et dégustez avec méfiance.'
,'Une recette ancestrale venue de Slovaquie… ou peut-être d’ailleurs. On ne sait pas. Mais attention : ça se mange... ou pas.',
60, 1, 7, 6, 3);


-- Lien recette <-> ingrédients
INSERT INTO "recipe_has_ingredient" (
  "ingredient_id", "recipe_id", "quantity", "unit"
) VALUES
(1, 1, 120, 'g'),     -- Nouilles ramen
(2, 1, 3, 'pcs'),     -- Narutomaki
(3, 1, 80, 'g'),      -- Porc braisé
(4, 1, 1, 'pcs'),     -- Œufs
(27, 1, 30, 'g'),     -- Pâte miso
(20, 1, 15, 'ml'),    -- Sauce soja
(28, 1, 5, 'ml'),     -- Mirin
(29, 1, 1, 'pcs'),    -- Algue kombu
(30, 1, 10, 'g'),     -- Bonite séchée
(31, 1, 10, 'g'),     -- Oignons verts

-- Recette 2 : Royale with Cheese
(5, 2, 2, 'pcs'),       -- Pain burger
(6, 2, 125, 'g'),       -- Steak haché
(7, 2, 2, 'slices'),    -- Fromage cheddar
(8, 2, 20, 'g'),        -- Salade
(9, 2, 30, 'g'),        -- Oignons
(32, 2, 1, 'tsp'),      -- Sel
(33, 2, 0.5, 'tsp'),    -- Poivre
(34, 2, 10, 'g'),       -- Beurre
(35, 2, 150, 'g'),      -- Frites

-- Recette 3 : Spaghetti à la Lady & Tramp
(10, 3, 200, 'g'),     -- Spaghetti
(17, 3, 300, 'g'),     -- Tomates (pour sauce tomate maison)
(11, 3, 150, 'g'),     -- Viande hachée
(36, 3, 2, 'g'),       -- Ail
(37, 3, 2, 'tbsp'),    -- Huile d'olive
(12, 3, 1, 'tsp'),     -- Herbes de Provence
(38, 3, 20, 'g'),      -- Parmesan râpé

-- Recette 4 : Ratatouille confite à la Rémy
(12, 4, 1, 'tsp'),     -- Herbes de Provence
(13, 4, 1, 'pcs'),     -- Aubergines
(14, 4, 1, 'pcs'),     -- Courgettes
(15, 4, 1, 'pcs'),     -- Poivrons
(17, 4, 2, 'pcs'),     -- Tomates
(37, 4, 3, 'tbsp'),    -- Huile d'olive
(32, 4, 1, 'tsp'),     -- Sel
(33, 4, 1, 'tsp'),     -- Poivre

-- Recette 5 : Boulettes vapeur de Yubaba
(11, 5, 100, 'g'),     -- Viande hachée
(18, 5, 100, 'g'),     -- Farce de porc
(19, 5, 60, 'g'),      -- Chou chinois
(39, 5, 2, 'tbsp'),    -- Sauce soja douce

-- Recette 6 : Pain aux œufs de Howl
(4, 6, 2, 'pcs'),      -- Œufs
(21, 6, 3, 'slices'),  -- Bacon
(22, 6, 2, 'slices'),  -- Pain de campagne
(34, 6, 10, 'g'),      -- Beurre
(33, 6, 1, 'pinch'),   -- Poivre

-- Recette 7 : Doubitchou maison de M. Preskovitch
(23, 7, 150, 'g'),     -- Chocolat noir
(24, 7, 80, 'g'),      -- Fruits confits
(40, 7, 50, 'g'),      -- Cacahuètes grillées
(26, 7, 60, 'g');      -- Chapelure

SELECT setval(pg_get_serial_sequence('recipe', 'id'), max(id)) FROM "recipe";
SELECT setval(pg_get_serial_sequence('user', 'id'), max(id)) FROM "user";
SELECT setval(pg_get_serial_sequence('motion', 'id'), max(id)) FROM "motion";
SELECT setval(pg_get_serial_sequence('ingredient', 'id'), max(id)) FROM "ingredient";

COMMIT;

