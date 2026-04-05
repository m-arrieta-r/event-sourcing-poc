import { Result, success, failure } from '../../../shared/result';
import { CustomerInfo } from '../types';

/**
 * Smart constructor for CustomerInfo.
 * Enforces domain invariants on raw (untrusted) input before it's promoted
 * to a domain type and allowed into a command payload.
 */
export const parseCustomerInfo = (raw: unknown): Result<CustomerInfo, string> => {
  if (typeof raw !== 'object' || raw === null) {
    return failure('customer must be an object');
  }

  const r = raw as Record<string, unknown>;

  if (typeof r.id !== 'string' || r.id.trim() === '') {
    return failure('customer.id must be a non-empty string');
  }
  if (typeof r.name !== 'string' || r.name.trim() === '') {
    return failure('customer.name must be a non-empty string');
  }
  // Accepts formatted (e.g. "123.456.789-09") or raw 11-digit CPFs
  if (typeof r.cpf !== 'string' || !/^\d{11}$/.test(r.cpf.replace(/\D/g, ''))) {
    return failure('customer.cpf must be a valid 11-digit CPF');
  }
  if (typeof r.monthlyIncome !== 'number' || r.monthlyIncome <= 0) {
    return failure('customer.monthlyIncome must be a positive number');
  }

  return success({
    id: r.id.trim(),
    name: r.name.trim(),
    cpf: r.cpf,
    monthlyIncome: r.monthlyIncome,
  });
};
