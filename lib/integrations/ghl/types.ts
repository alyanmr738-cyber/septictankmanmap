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
  contactName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  address?: string;
  address1?: string;
  address2?: string;
  customFields?: Array<Record<string, unknown>>;
  lastActivity?: string;
  dateAdded?: string;
  email?: string;
  phone?: string;
};

export type GhlSearchContactsResponse = {
  contacts?: GhlApiContact[];
  total?: number;
};
