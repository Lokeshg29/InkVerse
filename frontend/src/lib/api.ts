import { Tattoo } from "./types";

export type TattooQueryParams = {
  style?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type TattooApiItem = Tattoo & {
  _id?: string;
  artist: {
    id?: string;
    name: string;
    [key: string]: any;
  };
};

export type TattoosResponse = {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: TattooApiItem[];
};

export async function getTattoos(query: TattooQueryParams) {
  const params = new URLSearchParams();

  if (query.style && query.style !== "All") {
    params.append("style", query.style);
  }

  if (query.search) {
    params.append("search", query.search);
  }

  params.append("page", String(query.page ?? 1));
  params.append("limit", String(query.limit ?? 8));

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const response = await fetch(
  `${API_BASE_URL}/api/tattoos?${params.toString()}`
);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to load tattoos: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as TattoosResponse;
  return data;
}
