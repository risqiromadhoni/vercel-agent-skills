// SOURCE: skills/react-best-practices/rules/bundle-barrel-imports.md
// HASH: f5d97326f1985ea8981aa0caec71ce36717b107e7d9fb0aa8e7be322c462a2d0
// @ts-expect-error -- the fixture has no @acme/ui package; the barrel import is the anti-pattern under review
import { Button, TextField } from '@acme/ui'
// Loads every re-export of the barrel, even the ones unused here.
// Illustration of scale from icon barrels (lucide-react loads 1,583 modules and takes ~2.8s extra in dev;
// @mui/material loads 2,225 modules and takes ~4.2s extra in dev) (measured on Next.js 13.5, 2024)
