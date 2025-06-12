"use server";

import { Article } from "./types";

export async function scrape(url: string) {
  const response = await fetch(
    `http://localhost:3000/api/scrape?url=${encodeURIComponent(url)}`
  );

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data: Article[] = await response.json();

  return data;
}
