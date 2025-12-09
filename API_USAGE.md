# API Client Documentation

This project uses a robust, pre-configured Axios client located in `@/lib/api.ts`. This client handles common tasks such as setting the base URL, attaching headers, logging in development, and standardizing error responses.

## Setup

1. **Environment Variable**: Ensure you have a `.env.local` (or `.env`) file in your project root.
2. **Define Base URL**: Add the `NEXT_PUBLIC_API_URL` variable.

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
# Or for production:
# NEXT_PUBLIC_API_URL=https://api.example.com
```

## Basic Usage

We provide type-safe helper functions for common HTTP methods: `get`, `post`, `put`, `patch`, and `del`.

### Importing

```typescript
import { get, post, put, del } from "@/lib/api";
```

### Making Requests

**1. GET Request**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// typed response
const user = await get<User>("/users/1");
console.log(user.name);
```

**2. POST Request**

```typescript
interface CreateUserResponse {
  id: number;
  status: string;
}

const payload = {
  name: "Jane Doe",
  email: "jane@example.com",
};

const response = await post<CreateUserResponse>("/users", payload);
```

**3. DELETE Request**

```typescript
await del("/users/1");
```

## Advanced Features

### Interceptors

The client is configured with interceptors in `lib/api.ts`:

- **Request Interceptor**: Logs outgoing requests in development mode. Use this spot to inject Authentication tokens (e.g., from generic storage or cookies).
- **Response Interceptor**: Logs incoming responses in development mode.

### Error Handling

Errors are standardized. The response interceptor automatically catches HTTP errors.

- **401 Unauthorized**: Currently logs a warning. You can uncomment the logic in `lib/api.ts` to redirect to a login page.
- **Timeouts**: The default timeout is 15 seconds. Timeout errors reject with a specific "Request timed out" message.
- **Standardized Error Object**: API errors return a promise rejection with a consistent structure:
  ```typescript
  {
    ...originalError,
    message: "Server provided error message" || "Something went wrong"
  }
  ```

### Custom Configuration

If you need to pass specific Axios config options (headers, etc.) to a single request, you can pass them as the last argument:

```typescript
await get("/protected-route", {
  headers: {
    "X-Custom-Header": "value",
  },
});
```
