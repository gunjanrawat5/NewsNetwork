# Wealthier - News

A static canvas app with 2D and 3D San Francisco views and localized company signals.

After editing JavaScript or CSS, run `node scripts/bundle.cjs` before previewing or publishing. The page loads one content-versioned bundle, so cached view and rendering scripts cannot get out of sync. Source modules remain in `dist/` for development.

Run `node checks/view-switch-check.cjs`, `node checks/company-check.cjs`, `node checks/render-check.cjs`, and `node checks/map-coverage.cjs` for regression checks. The view-switch check exercises the actual button handlers.

Serve `dist/` using a static HTTP server. Company data and methodology are available in `dist/companies.json`. Positions are demo locations, not company addresses.
