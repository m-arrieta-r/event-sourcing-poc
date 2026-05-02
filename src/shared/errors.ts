export class VersionConflictError extends Error {
  constructor(aggregateId: string) {
    super(`Version conflict for aggregate "${aggregateId}": a concurrent write has occurred`);
    this.name = 'VersionConflictError';
  }
}
