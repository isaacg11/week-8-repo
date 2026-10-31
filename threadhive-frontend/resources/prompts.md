**Section 2.1 : Custom Instructions update**

```
#### State Management (Redux Toolkit)

1. All global state is managed with Redux Toolkit. The store is configured in `src/store/store.js`.
2. Each feature has its own slice in `src/reducers/` (e.g., `authSlice.js`, `threadListSlice.js`).
3. Use `useSelector` to read state and `useDispatch` to dispatch actions. Never import the store directly in components.
4. For API calls, use `createAsyncThunk`. Each thunk calls a function from `src/services/`.
5. Handle loading, success, and error states in `extraReducers` using the builder pattern:
   - `.addCase(thunk.pending, ...)` → set loading true, clear error
   - `.addCase(thunk.fulfilled, ...)` → update state with payload, set loading false
   - `.addCase(thunk.rejected, ...)` → set loading false, store error from payload
6. Never access `localStorage` directly in components — always use Redux actions (`loginUser`, `logout`, `setUser`).
7. Use `handleApiError` from `src/utils/handleApiError.js` in thunk catch blocks for consistent error handling.
```

---

**Section 2.2 : Generate Redux Slices with Agent Mode**

```
Implement the commentSlice in #file:src/reducers/commentSlice.js following the same pattern.

Implement the following components in the slice:
1. Initial state:
  - comments (array),
  - loading (boolean),
  - error (null)
2. Async thunks:
  - fetchComments
  - addComment
  - upvoteCommentThunk
  - downvoteCommentThunk
3. Synchronous reducer:
  - clearComments — resets state to initialState
4. extraReducers: add pending/fulfilled/rejected cases for all async thunks
```

---

**Section 2.3 : Plan Mode + Background Agents**

Integration test plan:
```
Plan a complete integration testing setup for this React + Redux Toolkit frontend project.

I need a plan that covers:
1. Which testing libraries and tools to install (test runner, mocking, assertions)
2. Configuration changes needed (vite.config.js, setup files)
3. Mock data structure (what entities to mock, what fields they need)
4. API mock handlers (which endpoints to intercept, success and error cases)
5. Integration test suites to create:
   - Thread flow: fetch threads, create thread, upvote/downvote, fetch by ID, handle not found
   - Comment flow: fetch comments for a thread, add comment, upvote/downvote comment

Do not generate code — only produce a detailed plan with file paths and specifications.
```

Accessibility Audit and Fixes:
```
Perform an accessibility audit and apply fixes across all React components in this project.
Audit and fix typical accessibility issues, including semantic HTML, ARIA attributes, keyboard navigation, image alt text, and color contrast.

Constraints:
- Do NOT change component logic, state management, or API calls
- Do NOT restructure the file/folder layout
- Keep all existing class names and styling intact — only add or adjust, never remove
```

---

**Section 2.4 : Refactor Codebase**

```markdown
## Overview

Refactor the ThreadHive frontend as follows:
1. Replace all Context API state management with Redux Toolkit slices and store configuration
2. Replace all `fetch()` calls in the codebase with Axios, using a centralized Axios instance with interceptors for auth tokens

## Constraints

- Do NOT change the UI or component structure — only the state management and HTTP layers
- Maintain the same API response handling (the backend returns data in a `data` property)
- Ensure localStorage persistence still works for auth state
- All existing routes and navigation should work unchanged
```