# Keyboard Shortcuts (Current Blade/Alpine State)

## Scope
This document reflects the current implementation in the Blade + Alpine stack.

## Implemented Shortcuts

### Global Search Focus
- **Shortcut:** `Ctrl + K` (Windows/Linux) or `Cmd + K` (macOS)
- **Behavior:** Focuses the search input and opens search results panel.
- **Source:** `resources/js/components/searchBar.js`

### Search Close
- **Shortcut:** `Esc`
- **Behavior:** Closes the search results dropdown and clears current query.
- **Source:** `resources/js/components/searchBar.js`

## Where It Is Wired
- Alpine component registration: `resources/js/app.js`
- Desktop feed search usage: `resources/views/feed.blade.php`
- Mobile top-bar search usage: `resources/views/layouts/navigation.blade.php`

## Notes
- Previous docs referenced React/Inertia hooks/components (`*.jsx`) that are not present in the current codebase.
- Additional app-wide keyboard shortcuts are **not** implemented at this time.

## Suggested Next Enhancements (Optional)
- Add global `?` shortcut for a shortcuts help modal.
- Add quote-card action shortcuts (`L`, `B`, `S`) with focus management.
- Add route-level shortcuts (`H`, `N`, `P`) with auth-aware guards.
