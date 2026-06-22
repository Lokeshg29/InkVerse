import { Tattoo } from "./types";

export type TattooQueryParams = {
  style?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type ArtistApiItem = {
  _id?: string;
} & {
  id?: string;
  name: string;
  bio: string;
  photoUrl: string;
  location: string;
  rating: number;
  specialties: string[];
  experienceYears: number;
};

export type ArtistsResponse = {
  success: boolean;
  count: number;
  data: ArtistApiItem[];
};

export type ArtistResponse = {
  success: boolean;
  data: ArtistApiItem;
};

export type TattooApiItem = Tattoo & {
  _id?: string;
  artist: {
    _id?: string;
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

export async function getArtists() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/api/artists`);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to load artists: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as ArtistsResponse;
  return data;
}

export async function getArtistById(id: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/api/artists/${id}`);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to load artist: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as ArtistResponse;
  return data;
}

export type AuthResponse = {
  success: boolean;
  token: string;
  data: { id: string; name: string; email: string };
};

export async function login(email: string, password: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to login: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as AuthResponse;
  return data;
}

export async function register(name: string, email: string, password: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to register: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as AuthResponse;
  return data;
}

export async function getMe(token: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to fetch user: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as { success: boolean; data: any };
  return data;
}

export type TattooResponse = {
  success: boolean;
  data: TattooApiItem;
};

export type FavoritesResponse = {
  success: boolean;
  count: number;
  data: TattooApiItem[];
};

export type FavoriteIdsResponse = {
  success: boolean;
  message: string;
  data: string[];
};

function createAuthHeaders(token?: string): HeadersInit | undefined {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export async function getTattooById(id: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/api/tattoos/${id}`);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to load tattoo: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as TattooResponse;
  return data;
}

export async function getFavorites(token: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/api/favorites`, {
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to load favorites: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as FavoritesResponse;
  return data;
}

export async function addFavorite(tattooId: string, token: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/api/favorites/${tattooId}`, {
    method: "POST",
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to add favorite: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as FavoriteIdsResponse;
  return data;
}

export async function removeFavorite(tattooId: string, token: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/api/favorites/${tattooId}`, {
    method: "DELETE",
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to remove favorite: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as FavoriteIdsResponse;
  return data;
}

export type BookingRequest = {
  tattoo: string;
  artist: string;
  date: string;
  timeSlot: string;
  notes?: string;
};

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type MyBookingItem = {
  _id: string;
  status: BookingStatus;
  date: string;
  timeSlot: string;
  tattoo: {
    title: string;
    imageUrl: string;
  };
  artist: {
    name: string;
  };
};

export type MyBookingsResponse = {
  success: boolean;
  data: MyBookingItem[];
};

export type BookingResponse = {
  success: boolean;
  data: any;
};

export async function createBooking(body: BookingRequest, token: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...createAuthHeaders(token),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to create booking: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as BookingResponse;
  return data;
}

export async function getMyBookings(token: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_BASE_URL}/api/bookings/my`, {
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to load bookings: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as MyBookingsResponse;
  return data;
}

export type AiMatchResult = {
  style: string;
  complexity: string;
  colorType: string;
  elements: string[];
  recommendedTattoos: Array<{
    _id: string;
    title: string;
    imageUrl: string;
    style: string;
    price?: number;
  }>;
  recommendedArtists: Array<{
    _id: string;
    name: string;
    specialties: string[];
    photoUrl: string;
    location: string;
    rating: number;
  }>;
};

export type AiMatchResponse = {
  success: boolean;
  data: AiMatchResult;
};

export async function matchAiTattoo(imageFile: File) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_BASE_URL}/api/ai/match`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to analyze image: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as AiMatchResponse;
  return data;
}

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
