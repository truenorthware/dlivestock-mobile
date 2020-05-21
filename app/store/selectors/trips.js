import { createSelector } from 'reselect'

export const getState = state => state.trips

export const trips = createSelector(
  getState,
  state =>
    state.map(trip => ({
      ...trip,
      nvds: trip.nvds.map((nvd, index) => ({
        ...nvd,
        id: nvd.id ? nvd.id : index,
      })),
    })),
)

export const activeTrips = createSelector(
  getState,
  state =>
    state
      .filter(({ status }) => status === 'In Progress')
      .map(trip => ({
        ...trip,
        nvds: trip.nvds.map((nvd, index) => ({
          ...nvd,
          id: nvd.id ? nvd.id : index,
        })),
      })),
)

export const pendingActiveTrips = createSelector(
  trips,
  state =>
    state
      .filter(
        ({ status }) => status !== 'Completed' && status !== 'Cancelled' && status !== 'Aborted',
      )
      .map(trip => ({
        ...trip,
        nvds: trip.nvds.map((nvd, index) => ({
          ...nvd,
          id: nvd.id ? nvd.id : index,
        })),
      })),
)

export const completedTrips = createSelector(
  getState,
  state =>
    state
      .filter(
        ({ status }) => status === 'Completed' || status === 'Cancelled' || status === 'Aborted',
      )
      .map(trip => ({
        ...trip,
        nvds: trip.nvds.map((nvd, index) => ({
          ...nvd,
          id: nvd.id ? nvd.id : index,
        })),
      })),
)
