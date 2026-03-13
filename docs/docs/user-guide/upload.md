# Step 3 – Uploading Files

## Limits

| Limit | Value | Source |
|-------|-------|--------|
| Max files per deposit | **100** | Zenodo policy |
| Max total deposit size | **50 GB** | Zenodo policy |
| Single file size | No hard limit | Subject to total |

## How to add files

1. **Drag and drop** files onto the upload area, **or** click the area to open a file browser.
2. Files appear in the list immediately with their name and size.
3. The running total (files / size) is shown in the counter bar.
4. Click the **✕** next to any file to remove it before uploading.

## Uploading

Click **Upload N files** to begin. Files are uploaded **sequentially** —
each one is streamed directly from your browser to Zenodo's storage via the backend.

!!! info "No server-side storage"
    The backend acts as a transparent proxy. File bytes pass through memory only
    and are never written to disk on the server.

### Progress indicators

- A **progress bar** appears under each filename while uploading.
- A **green tick** (✓) confirms successful upload.
- A **red warning** icon shows the error message if a file fails — you can retry
  by clicking **Upload N files** again (already-uploaded files are skipped).

## After uploading

Once all files show a green tick, click **Review & Publish** to proceed.

!!! warning "Large files"
    Files over a few hundred MB may take several minutes depending on your connection.
    Keep the browser tab open during upload. The session will not time out mid-transfer.
