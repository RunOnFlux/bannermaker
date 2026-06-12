# SSP Twitter Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an SSP-video-only server-side export that downloads an X-compatible MP4 below 5 MB.

**Architecture:** A Next.js route validates SSP video backgrounds and invokes a focused Node media module. Sharp generates the visual overlay; native FFmpeg composites and encodes H.264 MP4 video within a 4.8 MiB target. The editor calls this endpoint only when an SSP video is selected.

**Tech Stack:** Next.js App Router, TypeScript, Sharp, native FFmpeg/ffprobe, Vitest, React

---

### Task 1: Export Policy

**Files:**
- Create: `lib/twitter-export/policy.ts`
- Test: `lib/twitter-export/policy.test.ts`

- [ ] Write failing tests for SSP path validation, output names, text wrapping, and bitrate calculation.
- [ ] Run `npm test -- lib/twitter-export/policy.test.ts` and confirm the tests fail because the module is missing.
- [ ] Implement the minimal pure policy helpers.
- [ ] Re-run the focused tests and confirm they pass.

### Task 2: Server Media Processor

**Files:**
- Create: `lib/twitter-export/media.ts`
- Test: `lib/twitter-export/media.test.ts`

- [ ] Write an integration test that exports one real SSP video.
- [ ] Run the integration tests and confirm they fail because the processor is missing.
- [ ] Implement SVG overlay generation and FFmpeg MP4 encoding.
- [ ] Re-run the integration test and verify the output is at most 5 MB.

### Task 3: API Route

**Files:**
- Create: `app/api/ssp/twitter-export/route.ts`

- [ ] Add request parsing and strict SSP background validation.
- [ ] Return the generated file with attachment and content-type headers.
- [ ] Return concise JSON errors for invalid input and processing failures.

### Task 4: Editor Button

**Files:**
- Modify: `components/banner/BannerEditor.tsx`

- [ ] Add an SSP-video-only `Twitter Export (<5 MB)` button.
- [ ] Post selected content to the API and download the response filename.
- [ ] Display processing errors and retain all existing export behavior.

### Task 5: Runtime and Verification

**Files:**
- Modify: `Dockerfile`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `README.md`

- [ ] Install FFmpeg in the production Docker stage.
- [ ] Add Sharp and Vitest dependencies and test scripts.
- [ ] Document the server-side FFmpeg requirement.
- [ ] Run the full test suite.
- [ ] Run lint.
- [ ] Run a production build.
- [ ] Start the app locally and exercise image and video exports through the API.
