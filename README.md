# PokemonTest

## Getting Started: Full Stack Workflow

Follow these steps to run the full stack application:

1. **Start PostgreSQL with Docker Compose:**
   ```sh
   docker compose up -d
   ```

2. **Push Prisma schema to the database:**
   ```sh
   npx prisma db push
   ```

3. **Start the backend using Nx:**
   ```sh
   npx nx run back-end:serve
   ```

4. **Generate/update the front-end using OpenAI (optional):**
   Use your preferred OpenAI tool or prompt to generate/update front-end code as needed.

5. **Update API service configuration in the front-end:**
   - Change the API base URL or environment variables in your front-end config to match your backend (see `front-end/src/environments/` and `front-end/src/app/api/api-configuration.ts`).

6. **Start the front-end using Nx:**
   ```sh
   npx nx run front-end:serve
   ```

---

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
