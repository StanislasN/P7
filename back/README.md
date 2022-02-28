- Créer une base de donnée MySQL sur un serveur dédié
- Créer un fichier .env à la racine de l'application contenant les éléments suivants :

        # Base MySQL, à adapter selon l'environnement cible 
        DB_HOST=localhost
        DB_USERNAME=nunez
        DB_PASSWORD=monmotdepasse
        DB_DATABASE=nunez_groupomania
        ADMIN_PWD=root
        
        # Clé et algo pour crypter les données
        # Laisser l'algo sur aes128, la clé doit faire 16 charactères
        CRYPTO_KEY=azertyuiopqsdfgh
        CRYPTO_ALGO=aes128

        # Route api, laisser tel quel
        BASE_API=/api
        BASE_USERS=/users
        BASE_POSTS=/posts
        BASE_COMMENTS=/comments
        BASE_AUTH = /login
        BASE_UPLOAD=/upload

        TOKEN_SECRET = pdgojopfbvjndsm
        PORT=3000

- Lancer les commandes suivantes pour installer et lancer l'application :

        npm install
        npm run start
