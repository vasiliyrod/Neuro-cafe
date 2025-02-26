from pydantic import BaseModel
from typing import List, Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Dish(BaseModel):
    id: int
    type: str
    name: str
    desc: str
    all_ingredients: str
    img_link: str
    cost: int
    weight: int
    cuisine: str


class Order(BaseModel):
    items: Dict[int, int]
# Словарь, где ключ — id блюда, значение — количество


class OrderItem(BaseModel):
    dish: Dish
    quantity: int   # Количество этого блюда в заказе


dishes = [
    Dish(
        id=1,
        type="hot",
        name="Курика",
        cost=600,
        all_ingredients="кукуруза! масло!",
        desc="Сочная курочка",
        weight=100,
        img_link="https://example.com/chicken.jpg",
        cuisine="русская"
    ),
    Dish(
        id=2,
        type="hot",
        name="Говядина",
        cost=800,
        all_ingredients="говядина! специи!",
        desc="Нежная говядина",
        weight=151,
        img_link="https://example.com/beef.jpg",
        cuisine="европейская"
    ),
    Dish(
        id=3,
        type="cold",
        name="Банан",
        cost=50,
        all_ingredients="банан!",
        desc="Сладкий банан",
        weight=15,
        img_link="https://example.com/banana.jpg",
        cuisine="фрукты"
    ),
    Dish(
        id=4,
        type="cold",
        name="Кукуруза",
        cost=100,
        all_ingredients="кукуруза! соль!",
        desc="Свежая кукуруза",
        weight=13,
        img_link="https://example.com/corn.jpg",
        cuisine="вегетарианская"
    ),
    Dish(
        id=5,
        type="hot",
        name="Нунуну",
        cost=300,
        all_ingredients="нунуну! специи!",
        desc="Необычное блюдо",
        weight=1,
        img_link="https://example.com/nununu.jpg",
        cuisine="экзотическая"
    ),
    Dish(
        id=6,
        type="hot",
        name="Булулу",
        cost=400,
        all_ingredients="булулу! масло!",
        desc="Сытное блюдо",
        weight=16,
        img_link="https://example.com/bululu.jpg",
        cuisine="азиатская"
    ),
]

# Эндпоинт для получения всех блюд
@app.get("/dishes", response_model=List[Dish])
def get_dishes():
    print(dishes)
    return dishes


# Эндпоинт для получения блюда по id
@app.get("/dishes/{dish_id}", response_model=Dish)
def get_dish(dish_id: int):
    dish = next((dish for dish in dishes if dish.id == dish_id), None)
    if dish:
        return dish
    print(dish_id)
    raise HTTPException(status_code=404, detail="Блюдо не найдено")




order = Order(items={})


# Эндпоинт для получения количества блюд в заказе
@app.get("/order/count", response_model=int)
def get_order_count():
    print(sum(order.items.values()))
    return sum(order.items.values())


# Эндпоинт для получения заказа
@app.get("/order", response_model=List[OrderItem])
def get_order():
    order_items = []
    for dish_id, quantity in order.items.items():
        dish = next((dish for dish in dishes if dish.id == dish_id), None)
        if dish:
            order_items.append(OrderItem(dish=dish, quantity=quantity))

    print(order_items)
    return order_items


# Эндпоинт для добавления блюда в заказ
@app.post("/order/add/{dish_id}")
def add_to_order(dish_id: int):
    if dish_id not in [dish.id for dish in dishes]:
        raise HTTPException(status_code=404, detail="Блюдо не найдено")

    if dish_id in order.items:
        order.items[dish_id] += 1
    else:
        order.items[dish_id] = 1

    print('Блюдо добавлено в заказ')
    print(order)

    return {"message": "Блюдо добавлено в заказ", "order": order}


# Эндпоинт для выполнения заказа и удаления информации о заказе
@app.post("/order/done")
def complete_order():
    if not order.items:
        raise HTTPException(status_code=400, detail="Заказ пуст")

    print(order)

    order.items.clear()
    return {"message": "Заказ выполнен и информация о заказе удалена"}




class OrderUpdate(BaseModel):
    quantity: int

# Эндпоинт для обновления количества блюд в заказе
@app.post("/order/update/{dish_id}")
def update_order(dish_id: int, order_update: OrderUpdate):
    if dish_id not in [dish.id for dish in dishes]:
        raise HTTPException(status_code=404, detail="Блюдо не найдено")

    if order_update.quantity <= 0:
        del order.items[dish_id]
    else:
        order.items[dish_id] = order_update.quantity

    print('Блюдо UPDATE')
    print(order)

    return {"message": "Количество обновлено", "order": order}


# Эндпоинт для удаления блюда из заказа
@app.delete("/order/remove/{dish_id}")
def remove_from_order(dish_id: int):
    if dish_id not in order.items:
        raise HTTPException(status_code=404, detail="Блюдо не найдено в заказе")

    del order.items[dish_id]

    print('Блюдо DELETE')
    print(order)
    return {"message": "Блюдо удалено из заказа", "order": order}



class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    message: str
    dishes: List[Dish]


# Эндпоинт для чата
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    user_message = request.message

    if "привет" in user_message.lower():
        bot_message = "Привет! Как я могу вам помочь?"
    else:
        bot_message = "Извините, я не понял ваш запрос."

    print( random.sample(dishes, 3))

    return {
        "message": bot_message,
        "dishes": random.sample(dishes, 3)
    }


class Organisation(BaseModel):
    name: str
    tg_link: str
    email: str
    phone: str
    longitude: float
    latitude: float
    address: str
    desc: str


organisation = Organisation(
    name='Neuro',
    tg_link="https://www.figma.com/design/dFS3vG8wqJGe6wURNWP0Qx/Untitled?node-id=70-13&t=dBfULkzVN0n3MbQS-0",
    email='ExampleeCafe@gmail.com',
    phone='+7 (999) 999-99-99',
    longitude=12.5,
    latitude=13.5,
    address='ул. Пушкина, д. Колотушкина',
    desc='учшее кафе!'
)

# Эндпоинт для получения данных о нашем кафе
@app.get("/infocafe", response_model=Organisation)
def get_info():
    return organisation