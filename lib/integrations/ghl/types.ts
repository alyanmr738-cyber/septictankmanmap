export type GhlSearchContactsRequest = {
  locationId: string;
  page?: number;
  pageLimit?: number;
  query?: string;
  filters?: Array<Record<string, unknown>>;
};

export type GhlApiContact = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  address1?: string;
  lastActivity?: string;
  dateAdded?: string;
  email?: string;
  phone?: string;
};

export type GhlSearchContactsResponse = {
  contacts?: GhlApiContact[];
  total?: number;
};
