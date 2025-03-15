import { gql } from '@apollo/client';

export const GET_TOURS = gql`
  query GetTours {
    tours {
      id
      name
      price
      description
      createdAt
      isActive
    }
  }
`;

export const GET_TOUR = gql`
  query GetTour($id: ID!) {
    tour(id: $id) {
      id
      name
      price
      description
      createdAt
      isActive
    }
  }
`;

export const SEARCH_TOURS = gql`
  query SearchTours($criteria: TourSearchInput) {
    searchTours(criteria: $criteria) {
      id
      name
      price
      description
      createdAt
      isActive
    }
  }
`;

export const CREATE_TOUR = gql`
  mutation CreateTour($tourInput: TourInput!) {
    createTour(tourInput: $tourInput) {
      id
      name
      price
      description
      createdAt
      isActive
    }
  }
`;

export const UPDATE_TOUR = gql`
  mutation UpdateTour($id: ID!, $tourInput: TourUpdateInput!) {
    updateTour(id: $id, tourInput: $tourInput) {
      id
      name
      price
      description
      createdAt
      isActive
    }
  }
`;

export const DELETE_TOUR = gql`
  mutation DeleteTour($id: ID!) {
    deleteTour(id: $id)
  }
`;
