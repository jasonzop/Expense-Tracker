export async function uploadReceiptDev(file: File) {
  const base = (import.meta.env.VITE_UPLOAD_BASE as string | undefined) || 'http://localhost:4000';
  const token = (import.meta.env.VITE_DEV_TOKEN as string | undefined) || 'local-dev-12345';

  const fd = new FormData();
  fd.append('receipt', file);

  const res = await fetch(`${base}/api/upload-receipt`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}): ${text || res.statusText}`);
  }
  return (await res.json()) as { success: true; url: string; key: string };
}
