# Flaconi coding challenge: RESTful categories
A solution for Flaconi's RESTful categories code challenge

https://github.com/Flaconi/coding-challenges/blob/master/senior-fullstack-engineer/restful-api-categories.md

## How to use

### Using docker
1. Install docker and docker compose: https://docs.docker.com/compose/install/
2. Clone this repository
3. Change directory to `flaconi-restful-categories-challenge`
4. Execute `docker-compose up`
5. Make requests against `localhost:3000`

### Without docker
1. Install MongoDB 3.4: http://docs.mongodb.com/manual/installation
2. Install node 6.4: https://nodejs.org/en/download/ or use NVM https://github.com/creationix/nvm#install-script
3. Clone this repository
4. Change directory to `flaconi-restful-categories-challenge`
5. Execute npm install
6. To run tests, execute `env PORT=[PORT_NUMBER] MONGO_URL://[MONGO_HOST]:[MONGO_PORT]/[TEST_DATABASE_NAME] npm test` (e.g. `env PORT=3000 MONGO_URL://localhost:27017/flaconi-test npm test`)
7. To run the app, execute `env PORT=[PORT_NUMBER] MONGO_URL://[MONGO_HOST]:[MONGO_PORT]/[TEST_DATABASE_NAME] npm start`

## API:
- Prefix: `/api/v1`

### Create category:
- Action: `POST`
- Path: `/categories`
- Body
    - `name`: String, Category name (required)
    - `parentCategory`: String, Parent category id (Optional)
    - `isVisible`: Boolean, Category visibility (Required)
- Response
    - Status:
        - Success: 201
        - Dublicate name: 409
        - Bad parameters: 400
        - Server error: 500
    - Body:
    ```json
        {
            "id": "uuid",
            "name": "category name",
            "slug": "category-name",
            "parentCategory": "uuid" or null,
            "isVisible": boolean
        }
    ```
### Get category by id:
- Action: `GET`
- Path: `/categories/[category-id]` or `/categories/[category-slug]`
- Query:
    - `children`: Boolean, if true, the category object will include a tree of children
- Response:
    - Status:
        - Success: 200
        - Not found: 404
        - Bad parameters: 400
        - Server error: 500
    - Body
    ```json
        {
            "id": "uuid",
            "name": "category name",
            "slug": "category-name",
            "parentCategory": "uuid" or null,
            "isVisible": boolean,
            // Only if query parameter children is set to true
            "children": [
                {
                    "id": "uuid2",
                    "name": "category name 2",
                    "slug": "category-name-2",
                    "parentCategory": "uuid",
                    "isVisible": boolean,
                    "children": []
                }]
        }
    ```
### Get all categories
- Action: `GET`
- Path: `/categories`
- Query:
    - `isVisible`: Boolean, get only visible or invisible categories
    - `children`: Boolean, if true, each category will include a tree of children
- Response:
    - Status:
        - Success: 200
        - Bad parameters: 400
        - Server error: 500
    - Body
    ```json
        [
            {
                "id": "uuid",
                "name": "category name",
                "slug": "category-name",
                "parentCategory": "uuid" or null,
                "isVisible": boolean,
                // Only if query parameter children is set to true
                "children": [
                    {
                        "id": "uuid2",
                        "name": "category name 2",
                        "slug": "category-name-2",
                        "parentCategory": "uuid",
                        "isVisible": boolean,
                        "children": []
                    }]
            }
        ]
    ```
### Set visibility:
- Action: `PATCH`,
- Path: `/categories/[category-id]/set-visibility` or `/categories/[category-slug]/set-visibility`
- Body:
    - `isVisible`: Boolean, sets category visibility
- Response:
    - Status:
        - Success: 200
        - Not found: 404
        - Bad parameters: 400
        - Server error: 500
    - Body
    ```json
        {
            "id": "uuid",
            "name": "category name",
            "slug": "category-name",
            "parentCategory": "uuid" or null,
            "isVisible": boolean,
        }
    ```

## Notes
- `GET /categories` is not paginated as there are not supposed to be many categories to require pagination
- In Set visibility, the path `/set-visibility` was used despite not comforming with REST to indicate that this request changes only the visibility of the category

## TODO
- Document API using swagger
- Implement user authentication and authorization using JWT tokens and scopes `category.read` & `category.write`
- Implement caching using Redis and utilize cache and ETag headers
