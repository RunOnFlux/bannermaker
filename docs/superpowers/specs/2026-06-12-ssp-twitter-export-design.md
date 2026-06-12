# SSP Twitter Export Design

## Goal

Add an SSP-video-only export option that produces X-compatible videos below 5 MB without shipping a transcoder to the browser.

## User Experience

When an SSP video is selected, the editor shows an additional `Twitter Export (<5 MB)` button. The button sends the selected video, headline, description, and logo-overlay setting to the application server. The returned file downloads as MP4. SSP image selections do not show this control.

Existing PNG, WebP, background-only, and WebM exports remain unchanged.

## Server Architecture

A Node.js Next.js route handles `POST /api/ssp/twitter-export`. It accepts JSON, validates that the requested background is one of the configured SSP backgrounds, and rejects other products or filesystem paths.

The server creates a transparent PNG overlay from an SVG representation of the banner copy and optional SSP logo. FFmpeg scales the source to 1280x720, composites the overlay, removes audio, and encodes H.264 MP4. The bitrate is calculated from the source duration and a 4.8 MiB budget. If container overhead causes the first result to exceed the target, the server retries with a proportionally lower bitrate.

Temporary files live in an operating-system temporary directory and are removed after every request.

## Error Handling

The route returns JSON errors for invalid inputs, unavailable backgrounds, missing FFmpeg, and failed media processing. The editor displays the error next to the export controls and restores the button state.

## Testing

Unit tests cover SSP background validation, filename generation, video bitrate calculation, and text wrapping. An integration test calls the media processor against one real SSP image and one real SSP video, then verifies file type and the 5 MB ceiling when FFmpeg is available.

Local verification also runs lint and a production Next.js build.
