"use server";

export async function scrape(url: string) {
  const response = await fetch(
    `http://localhost:3000/api/scrape?url=${encodeURIComponent(url)}`
  );

  if (!response.ok) {
    const { error } = await response.json();
    console.log(error);
    throw new Error(error);
  }

  const data = await response.json();

  return data;
}
