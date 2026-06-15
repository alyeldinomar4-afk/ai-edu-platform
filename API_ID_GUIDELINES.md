# API ID Handling - Current Situation & Guidelines

Currently, there is an inconsistency in how the Backend returns IDs and how the Frontend consumes them.

## The Backend Issue
The Backend endpoints are directly returning MongoDB's native `_id` field in the response payloads.

## The Frontend Workaround
Because the backend returns `_id`, the Frontend code (e.g., `VideoPlayerPage.jsx`) is forced to constantly check for both `id` and `_id` to prevent crashes.

Example from the frontend code:
```javascript
const currentId = lecture.id || lecture._id;
```

## What Backend Developers Need to Do (The Solution)
**Keep returning `_id`.**

Since it's not feasible for the backend to convert all `_id` fields to `id` globally, **the Backend team should continue returning the native `_id` in all new and existing endpoints as they have been doing.**

It is the **Frontend team's responsibility** to handle this mismatch. The Frontend handles this primarily through **Adapters** located in the `api.js` file. 

Since all frontend components depend on `api.js` to fetch data, these adapters intercept the backend responses and automatically map MongoDB's `_id` to a standard `id` before passing the data to the UI components. In some older or edge cases (like `VideoPlayerPage`), there might still be fallback checks (`id || _id`), but the primary strategy is to rely on the `api.js` adapters to solve the issue.
