# 🚀 Angular Boilerplates

> This project provides a simple and extensible authentication layer built in Angular (or similar framework), featuring:

> - `auth.service.ts`: Handles login, logout, token storage, and access control.
> - `globals.config.ts`: Centralized configuration values for API endpoints, keys, and environment toggles.

> Ideal for use as a foundation in Single Page Applications with token-based auth (e.g., JWT + OAuth), role-based UI rendering, and flexible environment switching.

![License](https://img.shields.io/badge/license-Apache--2.0-red.svg)
![.Angular](https://img.shields.io/badge/Angular-19.0-8A2BE2)
![Typescript](https://img.shields.io/badge/Typescript-5.6-blue)

## 📚 Concepts Applied

This project applies essential frontend architecture and design patterns for scalable and maintainable authentication workflows in modern web applications.

### 1. 🌍 Centralized Configuration Management
- Uses a `globals.config.ts` file to store environment-specific values (e.g., API endpoints, auth keys).
- Promotes separation of concerns and makes it easy to switch configurations per environment (dev, staging, prod).
- 📖 [Learn more](https://angular.io/guide/build#configure-environment-specific-settings)

### 2. 🔐 Token-Based Authentication
- AuthService handles login, logout, and token persistence (likely using localStorage or sessionStorage).
- Ensures secure, stateless communication with backend APIs using bearer tokens.
- 📖 [Learn more](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- 📖 [Token Auth Overview](https://jwt.io/introduction)

### 3. 📦 Service-Oriented Architecture
- Encapsulates authentication logic inside an injectable service (`auth.service.ts`) for reuse and testability.
- Follows Angular best practices for modular and single-responsibility components.
- 📖 [Learn more](https://angular.io/guide/singleton-services)

### 4. ♻️ Dependency Injection (DI)
- AuthService is registered as a provider and injected into components that need it.
- Promotes loose coupling and easier unit testing.
- 📖 [Learn more](https://angular.io/guide/dependency-injection)

### 5. 🧪 Testability
- By isolating config and auth logic into separate files/services, the application becomes easier to unit test.
- Supports mocking configuration and services in test environments.
- 📖 [Learn more](https://angular.io/guide/testing-services)

