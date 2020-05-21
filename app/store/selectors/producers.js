import { createSelector } from 'reselect'

export const getState = state => state.producers

export const producers = createSelector(
  getState,
  state =>
    state.map(producer => ({
      ...producer,
      value: producer.id.toString(),
      label: producer.businessName,
      extendedLabel: producer.businessName,
      properties: producer.properties.map(property => ({
        ...property,
        value: property.id,
        label: property.name,
        extendedLabel: property.name,
      })),
    })),
)
