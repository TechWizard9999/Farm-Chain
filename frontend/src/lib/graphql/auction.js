export const AUCTIONS_QUERY = `
  query GetOpenAuctions {
    openAuctions {
      id
      product {
        title
      }
      minPricePerKg
      quantity
      highestBid
      deadline
      status
    }
  }
`;

export const MY_AUCTIONS_QUERY = `
  query GetMyAuctions {
    myAuctions {
        id
        product {
            id
            title
        }
        minPricePerKg
        quantity
        highestBid
        deadline
        status
        createdAt
    }
}
`;

export const CREATE_AUCTION_MUTATION = `
  mutation CreateAuction($productId: ID!, $batchId: ID!, $minPricePerKg: Float!, $quantity: Float!, $deadline: String!) {
    createAuction(productId: $productId, batchId: $batchId, minPricePerKg: $minPricePerKg, quantity: $quantity, deadline: $deadline) {
      id
      deadline
      minPricePerKg
      status
      quantity
      highestBid
    }
  }
`;

export const PLACE_BID_MUTATION = `
  mutation PlaceBid($auctionId: ID!, $pricePerKg: Float!) {
    placeBid(auctionId: $auctionId, pricePerKg: $pricePerKg) {
      id
      highestBid
      highestBidder {
        id
      }
    }
  }
`;

export const CLOSE_AUCTION_MUTATION = `
  mutation CloseAuction($auctionId: ID!) {
    closeAuction(auctionId: $auctionId) {
      id
      status
      highestBid
    }
  }
`;

export const MY_BIDS_QUERY = `
  query GetMyBids {
    myBids {
      id
      pricePerKg
      bidAmount
      status
      createdAt
      auction {
        id
        status
        highestBid
        quantity
        deadline
        product {
          title
        }
      }
    }
  }
`;
