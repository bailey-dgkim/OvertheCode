const API_URL = import.meta.env.VITE_API_URL;

export async function fetchChapters() {
  const response = await fetch(`${API_URL}/chapters`);

  if (!response.ok) {
    throw new Error("챕터 목록을 불러오지 못했습니다.");
  }

  return response.json();
}