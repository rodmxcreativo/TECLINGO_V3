# Security Specification for Tecnolingo AI

## Data Invariants
1. A user profile can only be created or modified by the user themselves (Identity integrity), or a SuperAdmin.
2. Users (Teachers/Students) MUST have a valid `institutionId` from an ACTIVE institution to access most features.
3. Users cannot modify their own `id`, `email`, or `curp` after creation (Immutability).
4. `hasAcceptedTerms` must be logged with timestamp and IP.
5. `ActivationCodes` are the gateway for Directors to register institutions.
6. The "Hidden SuperAdmin" has God-mode but is managed via a dedicated `/admins/` lookup.

## The "Dirty Dozen" Payloads (Attack Vectors)
1. **Identity Theft:** Attempting to update `users/target_user_id` as `request.auth.uid = attacker_id`.
2. **License Bypass:** Attempting to register an institution without a valid `ActivationCode`.
3. **Institutional Leak:** Student trying to access another school's private data.
4. **Denial of Wallet:** Rapid mass-creation of institutions to exhaust storage/DB.
5. **PII Leak:** Unauthenticated user attempting to list all user emails.
6. **Immutable Break:** Attempting to change the `curp` after it's been set.
7. **Bypassing Terms:** Attempting to write to protected routes without `hasAcceptedTerms: true`.
8. **Ghost Admin Spoof:** Attempting to set `isSuperAdmin: true` on a profile.
9. **Expiration Breach:** Registering with a valid but expired `Institutional_ID`.
10. **Shadow Registration:** Using a used/expired `ActivationCode`.
11. **Malicious Regex:** Providing a name that is 1MB long to break string processing.
12. **Recursive Cost Attack:** Querying with a complex filter that forces deep index scans.

## The Test Runner (Plan)
We will verify that:
- `allow read: if isOwner(userId) || isSuperAdmin()`
- `allow write: if (isOwner(userId) && isValidProfile(incoming())) || isSuperAdmin()`
- `allow list: if isSuperAdmin()`
- `Institutions` require valid `directorId` and active status.
- `ActivationCodes` are READ-ONLY for anyone except SuperAdmin.
