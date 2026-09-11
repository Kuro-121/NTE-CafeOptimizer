# Cafe by Origen — Roster Optimizer

Acess website at https://kuro-121.github.io/NTE-CafeOptimizer/

A web-based optimizer for Cafe by Origen. Finds the best dish menu and character team to maximize Fons/hr income.

## Features
- Full optimizer engine (Traffic Flat/Multiply, Price Flat/Multiply)
- Trend bonuses applied automatically
- Manage dishes, characters, ingredients via UI
- Data persists in browser (localStorage)
- English and Simplified Chinese interface
- Default data loaded from `data.json` on first visit

## Skill Format

Each character skill has:
- **Level** — minimum character level to unlock
- **Value** — the buff amount
- **Req** — how many matching menu tags are needed to activate
- **Type** — `Price_Flat`, `Traffic_Flat`, `Price_Multiply`, `Traffic_Multiply`
- **Tag** — which dish type to count (`None`, `Any`, or a specific type like `Beverages`)

## How Multipliers Work

- `Traffic_Multiply` is applied **after** all flat traffic buffs
- `Price_Multiply` multiplies the **final dish price** (base + all flat buffs) by a percentage
- Both multipliers scale with the number of matching menu tags
