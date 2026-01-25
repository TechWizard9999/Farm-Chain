export const MY_PRODUCTS_QUERY = `
    query MyProducts {
        myProducts {
            id
            title
            description
            category
            pricePerKg
            availableQty
            minOrderQty
            photos
            isOrganic
            qrCode
            qrImage
            status
            createdAt
            batch {
                id
                cropName
                cropCategory
                variety
                seedSource
                sowingDate
                expectedHarvestDate
                currentState
            }
        }
    }
`;

export const CREATE_PRODUCT_MUTATION = `
    mutation CreateProduct(
        $batchId: ID!
        $title: String!
        $description: String
        $category: String!
        $pricePerKg: Float!
        $availableQty: Float!
        $minOrderQty: Float
        $photos: [String!]
        $isOrganic: Boolean
    ) {
        createProduct(
            batchId: $batchId
            title: $title
            description: $description
            category: $category
            pricePerKg: $pricePerKg
            availableQty: $availableQty
            minOrderQty: $minOrderQty
            photos: $photos
            isOrganic: $isOrganic
        ) {
            id
            title
            category
            status
        }
    }
`;

export const UPDATE_PRODUCT_MUTATION = `
    mutation UpdateProduct(
        $id: ID!
        $title: String
        $description: String
        $pricePerKg: Float
        $availableQty: Float
        $minOrderQty: Float
        $photos: [String!]
        $status: String
    ) {
        updateProduct(
            id: $id
            title: $title
            description: $description
            pricePerKg: $pricePerKg
            availableQty: $availableQty
            minOrderQty: $minOrderQty
            photos: $photos
            status: $status
        ) {
            id
            title
            status
        }
    }
`;

export const DELETE_PRODUCT_MUTATION = `
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id) {
            id
        }
    }
`;

export const PUBLISH_PRODUCT_MUTATION = `
    mutation PublishProduct($id: ID!) {
        publishProduct(id: $id) {
            id
            status
            qrCode
            qrImage
        }
    }
`;
