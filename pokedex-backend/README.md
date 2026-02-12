# 🧠 Pokédex Backend (NestJS)

A scalable Pokédex API built with **NestJS** that fetches Pokémon data from PokéAPI, caches it in memory, and provides search, filter, and pagination support.

---

## 🚀 Tech Stack

- NestJS
- TypeScript
- Axios (HTTP Module)
- Class Validator
- In-memory caching

---

## 📁 Project Structure

src/
│
├── main.ts
├── app.module.ts
│
└── pokemon/
    ├── pokemon.controller.ts
    ├── pokemon.service.ts
    ├── dto/
    │   └── query.dto.ts
    └── interfaces/
        └── pokemon.interface.ts

---

## ⚙️ Features

- Fetches Pokémon data from PokéAPI
- Controlled concurrency (batch fetching to avoid rate limits)
- In-memory caching for performance
- Pagination support
- Search by name
- Filter by type
- Clean API structure using DTO validation

---

## 🛠 Installation

```bash
npm install
