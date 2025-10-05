// Simple API client prepared for a Java backend
// Uses fetch under the hood and reads baseURL from env

const BASE_URL = process.env.REACT_APP_API_URL || "";

function buildUrl(path) {
  if (!path) return BASE_URL;
  if (path.startsWith("http")) return path;
  const slash = BASE_URL.endsWith("/") ? "" : "/";
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}${slash}${p}`;
}

async function request(path, { method = "GET", headers = {}, body, token, ...rest } = {}) {
  const url = buildUrl(path);
  const finalHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
  const opts = {
    method,
    headers: finalHeaders,
    ...(body !== undefined ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
    ...rest,
  };

  const res = await fetch(url, opts);
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
  buildUrl,
};

export default api;
