// mappers/cartMapper.ts
import IOrders from "../interfaces/IOrders";

export const mapDishDTOToDish = (dto: IOrders): IOrders => ({
  id: dto.id,
  name: dto.name,
  type: dto.type,
  description: dto.description,
  allIngredients: dto.all_ingredients,
  mainIngredients: dto.main_ingredients,
  imageUrl: dto.img_link,
  price: dto.cost,
  weight: dto.weight,
  cuisine: dto.cuisine
});

export const mapCartItemDTOToCartItem = (dto: CartItemDTO): CartItem => ({
  dish: mapDishDTOToDish(dto.dish),
  quantity: dto.count
});

export const mapCartDTOToCart = (dto: CartDTO): Cart => ({
  id: dto.id,
  items: dto.dishes.map(mapCartItemDTOToCartItem),
  date: new Date(dto.date),
  status: dto.status
});

// Для массива корзин
export const mapCartListDTOToCartList = (dtos: CartDTO[]): Cart[] => 
  dtos.map(mapCartDTOToCart);