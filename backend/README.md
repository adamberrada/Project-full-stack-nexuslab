# E-Store Backend (Spring Boot + JPA + MongoDB)

Conforme au cahier des charges **Cahier_des_charges_EStore_SpringBoot_JPA.pdf**.

## Prérequis
- Java 21+
- Maven 3.9+

## Lancer le backend
Depuis le dossier `backend/` :

```bash
mvn spring-boot:run
```

Le backend démarre sur `http://localhost:8080`.

### Bases de données
- Relationnel: H2 en fichier local (`./data/estore`) pour garder les commandes entre redémarrages
- Reviews (MongoDB): désactivé par défaut pour éviter des erreurs de connexion au démarrage.

Pour activer le module reviews, il faut un MongoDB local (ou distant) et lancer l'application avec le profil `mongo` :

Exemple (Docker) :

```bash
docker run -d --name estore-mongo -p 27017:27017 mongo:7
```

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mongo
```

Par défaut, le profil `mongo` utilise `mongodb://localhost:27017/estore`.

## Endpoints (minimaux)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/categories`
- `GET /api/cart/{userId}`
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove/{itemId}`
- `POST /api/orders`
- `GET /api/orders/user/{userId}`
- (profil `mongo`) `POST /api/reviews`
- (profil `mongo`) `GET /api/reviews/product/{productId}`

## Comptes de test
- Email: `test@estore.com`
- Mot de passe: `password`


## mangoDB

- Working on React app `smartMatchSport` with Spring Boot backend `fullStackProject`.
- MongoDB is used only for reviews; orders/users/cart use JPA/H2.
- Review UI is in `src/components/ProductReviews.tsx`; orders UI is in `src/components/OrdersPage.tsx`.
- Frontend uses `localStorage.userId` for logged-in user context.
- Parallax homepage in `src/App.tsx` can make standalone pages feel static.

- docker run -d --name estore-mongo -p 27017:27017 mongo:7

- cd "c:\Users\berra\OneDrive\Documents\VC      - - -   projects\React\fullStackProject\backend"
- mvn spring-boot:run -Dspring-boot.run.profiles=mongo

- docker exec -it estore-mongo mongosh

- use estore
- db.reviews.find().pretty()


# Change data entrys

### to refresh and inserte a new data initialzer we need to detete the file the exsite in backend/data/estore.mv.db
### so the h2 will be rest and create a fresh emty database file and datainitializer will repopulate again
