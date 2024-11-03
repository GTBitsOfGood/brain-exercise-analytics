# Brain Exercise Initative 🧠

## About

Brain Exercise Initative is a nonprofit focused on preventing memory loss through brain exercise. Through innovative research in Japan, it was found that doing simple math and reading exercises aloud caused improvements in cognitive function. Brain Exercise Initiative builds off of this research, holding brain exercise programs at retirement homes.

## Getting Started

### Dependencies

Make sure you have yarn installed. Follow this [link](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) if needed.

Secondly, install all necessary dependencies:

```bash
yarn install
```

### MongoDB

Install [MongoDB Community Server](https://www.mongodb.com/docs/manual/administration/install-community/) to host a local instance of MongoDB. It may also be helpful to download [MongoDB Compass](https://www.mongodb.com/try/download/compass#compass) to view the state of your database.

### Environment Variables

In the root directory, run one of these commands based on your OS:

```sh
npm run secrets:linux # mac / linux
npm run secrets:windows # windows
```

You should be prompted for a master password. Ask your Engineering leadership to continue. Once the password has been verified, your `.env.development.local` file should have been created automatically for you.

### Development

To start the Next.js dev server, run:

```sh
yarn dev
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Run With Docker

1. Install [Docker](https://docs.docker.com/engine/install/)
2. Obtain the Bitwarden password from your EM. Create a `bitwarden.env` file and fill it in with the following contents:
   ```
   BW_PASSWORD=<your bitwarden password>
   ```
   This only needs to be done on your first run. After that, you should delete the file from your repository to avoid pushing it to Github.
3. Start the application with Docker Compose: `docker compose up`

If you make any changes to the packages, you may need to rebuild the images. To do this, append --build to the above docker compose up command.

The Dockerized application will have live-reloading of changes made on the host machine.

Note: On linux-based operating systems, if you come across an entrypoint permission error (i.e. `process: exec: "./entrypoint.sh": permission denied: unknown`), run `chmod +x ./entrypoint.sh` to make the shell file an executable.

Windows Users: If you come across this error `exec ./entrypoint.sh: no such file or directory` when running the docker compose command, please follow this [Stackoverflow thread](https://stackoverflow.com/questions/40452508/docker-error-on-an-entrypoint-script-no-such-file-or-directory) to fix it.
