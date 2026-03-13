# Step 1 – Sign in with Zenodo

## Why Zenodo OAuth?

The uploader never stores your Zenodo password. Instead it uses the standard
**OAuth 2.0 Authorization Code** flow: Zenodo issues a short-lived access token
that is kept only in your browser session cookie and discarded when you log out.

## How to sign in

1. Click **Sign in with Zenodo** on the landing page or in the top navigation bar.
2. You are redirected to `zenodo.org` (or `sandbox.zenodo.org` in sandbox mode).
3. If you are not already logged in to Zenodo, enter your Zenodo credentials there.
4. Click **Authorize** to grant the uploader the `deposit:write` and `deposit:actions` scopes.
5. You are redirected back to the uploader and the wizard opens automatically.

!!! note "Required scopes"
    The application requests only the minimum scopes needed:

    | Scope | Purpose |
    |-------|---------|
    | `deposit:write` | Create draft depositions and upload files |
    | `deposit:actions` | Publish depositions |

## Signing out

Click **Sign out** in the top-right corner at any time. Your session cookie is
cleared immediately and no data remains on the server.

## Troubleshooting

**"Invalid OAuth state" error** — This usually means your session cookie expired
between clicking *Sign in* and returning from Zenodo. Simply try again.

**Redirected to a blank page** — Make sure `FRONTEND_URL` in your `.env` matches
the URL you are using to access the app (e.g. `http://localhost:3000`).
