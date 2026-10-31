# Brix: Hands-On DevOps Project
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/dev1joe/brix/badge)](https://scorecard.dev/viewer/?uri=github.com/dev1joe/brix)

## Implementation
### Project Initialization
```bash
npm init -y
npm i express
npm i -D typescript tsx @types/node @types/express
npx tsc --init
```

testing libraries
```bash
npm i -D vitest supertest @types/supertest msw
```

installing mogan middleware for request logging
```bash
npm i morgan
npm i -D @types/morgan
```

tsconfig
- either use `NodeNext` for module and module resolution with no bundler
- or use a bundler (like `esbuild` or `tsup`) and set module to `ESNext` and module resolution to `bundler`
- using a bundler will allow you to use relative imports without file extensions but will add an extra build step

### API Details
- app structure:
  - routers (route groups)
  - morgan (logging middleware)
  - 404 not found middleware
  - Error-Handler

## testing
- run `npm run test`

# Learning notes
### Phase 1: API App & Dockerization
##### API
- built a simple API using Express.js

##### multi-stage dockerfiles

### Phase 2: Continuous Integration (CI)
##### Unit testing & linting
- learned how to create unit tests using vitest and supertest
- explored multiple linting tools and fixed linting problems

##### CI & GitHub Actions
- wrote my first GitHub Workflow
- learned that a workflow consists of jobs and each job can have multiple steps
- read [what is continuous integration | Atlassian](https://www.atlassian.com/continuous-delivery/continuous-integration)

### Phase 3: Expanding
##### Integration Testing
- learned that integration tests can be between my API and a Database, message queue, or another API
- in this case, my API uses the OpenSenseMap (OSEM) API
- so I should test how my API behaves given different behaviors from OSEM API
- used [Mock Service Worker (msw)](https://mswjs.io/) to mock OSEM API
- wrote integration tests using vitest and supertest
- wrote a smoke test: which tests my application behavior with the real OSEM API not a mocked one

##### Kubernetes
- installed kind
- created an ingress-ready configuration with 80/443 ports mapped
- apply Ingress-Nignx using `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml`
- wait until the controller is ready using this command:
```bash
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```

##### CI expantion
- read [Best practices when adopting continuous integration](https://github.com/resources/articles/continuous-integration#best-practices-when-adopting-continuous-integration)
- read [GitHub actions secure use](https://docs.github.com/en/actions/reference/security/secure-use#using-third-party-actions) to know how to use third-party actions securely
- learned about CI/CD pipeline security measurements
- learned about code coverage, SonarQube, and static code verification
- learned not to use npx in CI pipeline and replace it with npm scripts for security reasons

##### Continuous Deployment (CD)
- learned about container registries


# ScratchPad
fix: other updates to Vitest, SonarQube configs, and CI workflows
