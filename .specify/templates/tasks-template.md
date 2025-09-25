# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
 - [ ] T004 [P] Contract test GET /api/pokemon in tests/contract/test_pokemon_list_contract.py — asserts response schema for list, pagination, and filter params
 - [ ] T005 [P] Contract test GET /api/pokemon/{id} in tests/contract/test_pokemon_detail_contract.py — asserts response schema for detail, sprites, types, stats, and evolution references
 - [ ] T006 [P] Integration test API: pokemon list + filters in tests/integration/test_api_pokemon_list.py — uses mocked PokéAPI responses to assert filtering, pagination, and lazy-load behavior (must fail)
 - [ ] T007 [P] Integration test API: pokemon detail & evolution chain in tests/integration/test_api_pokemon_detail.py — uses mocked adapter to assert aggregation of species, evolution chain, and moveset (must fail)

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T008 [P] User model in src/models/user.py
- [ ] T009 [P] UserService CRUD in src/services/user_service.py
- [ ] T010 [P] CLI --create-user in src/cli/user_commands.py
- [ ] T011 POST /api/users endpoint
- [ ] T012 GET /api/users/{id} endpoint
- [ ] T013 Input validation
- [ ] T014 Error handling and logging

## Phase 3.3: Core Implementation (ONLY after tests are failing) — Pokémon Database
- [ ] T008 [P] Create Pokémon model in src/models/pokemon.py — fields: name, national_id, regional_forms, types, base_stats, abilities, height_m, weight_kg, category, flavor_texts, gender_ratio, base_experience, ev_yield, sprites, evolution_refs
- [ ] T009 [P] Create Moveset, Ability, Evolution models in separate files:
   - src/models/moveset.py — level_up, tm_tr_hm, egg_moves, tutor_moves
   - src/models/ability.py — name, description, is_hidden
   - src/models/evolution.py — from_id, to_id, conditions
- [ ] T010 [P] Implement PokéAPI adapter service in src/services/pokeapi_adapter.py — functions to fetch Pokémon list, Pokémon detail, species, evolution chain, moves, and batch endpoints for caching
- [ ] T011 [P] Implement PokemonService in src/services/pokemon_service.py — transforms adapter responses into internal models, calculates BST, unit conversions (m↔ft, kg↔lbs), aggregates flavor text and sprites for UI
- [ ] T012 [P] Implement Search & Filter service in src/services/search_service.py — name/ID search, type/generation/evolution-stage/stat-threshold/color/egg-group filtering, server-side pagination and lazy-load hooks
- [ ] T013 [P] Create API routes for core features (exact file paths must be used):
   - src/api/pokemon_routes.py — GET /api/pokemon (list + filters), GET /api/pokemon/{id}
   - src/api/search_routes.py — GET /api/search (autocomplete)
   - src/api/favorites_routes.py — POST /api/favorites, GET /api/favorites, DELETE /api/favorites/{id}
   - src/api/teams_routes.py — POST/GET/PUT/DELETE /api/teams (validate max 6 Pokémon)
- [ ] T014 [P] Implement frontend core components and pages (separate files):
   - src/frontend/components/PokemonCard.tsx — compact card with sprite + quick stats
   - src/frontend/pages/PokemonList.tsx — infinite scroll list + filter bar
   - src/frontend/pages/PokemonDetail.tsx — artwork, interactive stat chart, type effectiveness, evolution tree, tabs (Moves, Stats, Flavor, Locations)
   - src/frontend/components/FiltersBar.tsx — type/gen/stat toggles and sliders
- [ ] T015 [P] Implement Comparison and Favorites UI components (frontend):
   - src/frontend/components/ComparisonPanel.tsx — compare up to 3 Pokémon side-by-side
   - src/frontend/components/FavoritesPanel.tsx — save/recall teams (6 slots), persist to localStorage and via API
- [ ] T016 [P] Implement input validation and DTOs for API in src/validation/:
   - src/validation/pokemon_queries.py — validate filter params, pagination, and stat-threshold formats
   - src/validation/team_payload.py — validate team composition (max 6, valid IDs)
- [ ] T017 Error handling and logging (shared files):
   - src/middleware/error_handler.py — consistent error responses for API routes
   - src/logging/config.py — structured logging for service failures and adapter errors
- [ ] T018 [P] Implement Offline Cache service and caching strategy:
   - src/services/cache_service.py — server-side caching and invalidation hooks
   - src/frontend/services/offline_cache.ts — client-side caching of Pokémon data and assets, sync strategy
- [ ] T019 [P] Implement basic Battle Calculator service stub (optional advanced) and experimental route:
   - src/services/battle_calculator.py — damage calc stub and validation
   - src/api/battle_routes.py — POST /api/battle (experimental, returns explanatory stub)
- [ ] T020 [P] Create unit/integration test skeletons for core implementation (must fail before implementation):
   - tests/unit/test_models_pokemon.py
   - tests/unit/test_services_pokemon_service.py
   - tests/integration/test_api_pokemon_list.py
   - tests/integration/test_api_pokemon_detail.py
   - tests/integration/test_favorites_crud.py

## Phase 3.4: Integration
- [ ] T015 Connect UserService to DB
- [ ] T016 Auth middleware
- [ ] T017 Request/response logging
- [ ] T018 CORS and security headers

## Phase 3.5: Polish
- [ ] T019 [P] Unit tests for validation in tests/unit/test_validation.py
- [ ] T020 Performance tests (<200ms)
- [ ] T021 [P] Update docs/api.md
- [ ] T022 Remove duplication
- [ ] T023 Run manual-testing.md

## Dependencies
- Tests (T004-T007) before implementation (T008-T014)
- T008 blocks T009, T015
- T016 blocks T018
- Implementation before polish (T019-T023)

## Parallel Example
```
# Launch T004-T007 together:
Task: "Contract test POST /api/users in tests/contract/test_users_post.py"
Task: "Contract test GET /api/users/{id} in tests/contract/test_users_get.py"
Task: "Integration test registration in tests/integration/test_registration.py"
Task: "Integration test auth in tests/integration/test_auth.py"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task