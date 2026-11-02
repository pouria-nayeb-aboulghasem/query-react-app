# Project

Create weather application by using react along with reducer and query hooks.

## React app

```js
  npm create vite@latest
```

## Tailwind

- vite.config.ts

```js
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

```css
@import "tailwindcss";
```

## Alias path

- vite.config.ts

```js
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
```

- tsconfig.json

```json
"compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
```

- tsconfig.app.json

```json
"extends": "./tsconfig.json",
```

## Tanstack query

```js
  npm i @tanstack/react-query @tanstack/react-query-devtools
```
