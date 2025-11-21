const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    let errorMessage = text;

    try {
      const json = JSON.parse(text);
      errorMessage = json.message || JSON.stringify(json);
    } catch {
      // leave text as-is
    }

    throw new Error(errorMessage || 'Request failed');
  }

  return res.json() as Promise<T>;
}
