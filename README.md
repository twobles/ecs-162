# ECS 162 HW2
## How to run:
The program requires docker-compose.dev.yml, docker-compose.prod.yml, Dockerfile.prod, .env, .env.dev, & .env.prod provided in the project description.

To test your program in a development environment run:
`docker-compose -f docker-compose.dev.yml up --build`
You will be able to access the webpage from localhost:5173, this is because Vite+Svelte will be serving it.

To build and start the container in prod mode run the command:
`docker-compose -f docker-compose.prod.yml up --build`
