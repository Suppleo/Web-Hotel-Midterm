import { gql } from '@apollo/client';

export const GET_TOURS = gql`
  query GetTours(
    $page: Int = 1
    $limit: Int = 10
    $sortBy: String = "createdAt"
    $sortOrder: String = "desc"
    $minPrice: Float
    $maxPrice: Float
    $searchTerm: String
  ) {
    tours(
      page: $page
      limit: $limit
      sortBy: $sortBy
      sortOrder: $sortOrder
      minPrice: $minPrice
      maxPrice: $maxPrice
      searchTerm: $searchTerm
    ) {
      tours {
        id
        name
        price
        description
        imageFilename
        createdAt
        isActive
      }
      totalCount
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
      imageFilename
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
      imageFilename
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
      imageFilename
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

// Added for photo feature
export const UPLOAD_FILE = gql`
  mutation UploadFile($file: File!) {
    upload(file: $file)
  }
`;
