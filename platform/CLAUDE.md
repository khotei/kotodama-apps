# platform — `@kotodama/platform`

The agnostic base leaves (`@kotodama/platform/{api-client,config}`). Everything about them — leaf
status, injected `createApiClient`, the `gen:api` Biome exemption, and env access — is already owned
by `frontend-layering.md`, `frontend-state.md`, `nextjs.md`, and `tooling.md`. No package-local
constraint to add here.
