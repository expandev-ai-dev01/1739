// Shared test helper functions
// This file contains reusable helper functions for all test files

import { Request } from 'express';

export function createMockRequest(overrides?: Partial<Request>): Partial<Request> {
  return {
    headers: {
      'x-account-id': '1',
      'x-user-id': '1',
    },
    params: {},
    query: {},
    body: {},
    ...overrides,
  };
}

export function createMockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}
