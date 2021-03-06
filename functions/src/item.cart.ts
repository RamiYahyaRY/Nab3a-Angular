export interface ItemCart
{
    status: string;
    objectID: string;
    id: string;
    cartID: string;
    name: string;
    type: string;

    businessName: string;
    businessID: string;

    customerName: string;
    customerID: string;

    price: number;
    currency: string;
    image: any;
    category: string;
    stock: number;
    barcode: string;
    inventory_productID: string;
    finalPrice: number;
    quantity: number;

    city: string;
    locationDescription: string;

    orderID: string;
}
