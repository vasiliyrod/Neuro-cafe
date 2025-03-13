from pydantic import BaseModel
from typing import List, Dict
from fastapi import FastAPI, HTTPException
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import random
from typing import Optional

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
    main_ingredients: str
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
        main_ingredients="Сочная, курочк, рмивари, ркиасгик, а саискиа, киа иас, иарки аркиа, саи аик асвиа ",
        desc="Сочная курочк рмивари ркиасгик а саискиа киа иас иарки аркиа саи аик асвиа "
             "иа аки агиаг  иаркикарквиа виававо ааовивиа вси ика"
             "акакнпа пквм анпма нмам акгпа иави аив а пв иависпврс рпварвкарвиа авпа а рап ма враварва рви арвиави"
             "а гвисалвваваи ваии гвраура п аркип кат рооип рвип шивочивьп ват пвип огарва вовои рваи"
             " вааровиоавиориа паври арвиа рви авмгаи нгукщагнмагунка гнука гиаивауауауракриарив аи кварвиаквриа",
        weight=100,
        img_link="https://i.postimg.cc/8PZ55dVy/3.webp",
        cuisine="русская"
    ),
    Dish(
        id=2,
        type="hot",
        name="Говядина",
        cost=800,
        all_ingredients="говядина! специи!",
        main_ingredients="кукуруза! масло! gtcjr cf[fh cjkm",
        desc="Нежная говядина",
        weight=151,
        img_link="https://i.postimg.cc/9QSQPW0Z/2.png",
        cuisine="европейская"
    ),
    Dish(
        id=3,
        type="cold",
        name="Банан",
        cost=50,
        all_ingredients="банан!",
        main_ingredients="кукуруза! масло! gtcjr cf[fh cjkm",
        desc="Сладкий банан",
        weight=15,
        img_link="https://i.postimg.cc/52jtFH4f/1.webp",
        cuisine="фрукты"
    ),
    Dish(
        id=4,
        type="cold",
        name="Кукуруза",
        cost=100,
        all_ingredients="кукуруза! соль!",
        main_ingredients="кукуруза! масло! gtcjr cf[fh cjkm",
        desc="Свежая кукуруза",
        weight=13,
        img_link="https://i.postimg.cc/52jtFH4f/1.webp",
        cuisine="вегетарианская"
    ),
    Dish(
        id=5,
        type="hot",
        name="Нунуну lknyyjt djfbshjdfbsjzcxn ducd scvd",
        cost=300,
        main_ingredients="кукуруза! масло! gtcjr cf[fh cjkm",
        all_ingredients="нунуну! специи!",
        desc="Необычное блюдо",
        weight=1,
        img_link="https://i.postimg.cc/8PZ55dVy/3.webp",
        cuisine="экзотическая"
    ),
    Dish(
        id=6,
        type="hot",
        name="Булулу",
        cost=400,
        main_ingredients="кукуруза! масло! gtcjr cf[fh cjkm",
        all_ingredients="булулу! масло!",
        desc="Сытное блюдо",
        weight=16,
        img_link="https://i.postimg.cc/8PZ55dVy/3.webp",
        cuisine="азиатская"
    ),
    Dish(
        id=7,
        type="hot",
        name="Курика",
        cost=600,
        all_ingredients="кукуруза! масло!",
        main_ingredients="кукуруза! масло! gtcjr cf[fh cjkm",
        desc="Сочная курочка",
        weight=100,
        img_link="https://i.postimg.cc/8PZ55dVy/3.webp",
        cuisine="русская"
    ),
    Dish(
        id=8,
        type="hot",
        name="Говядина",
        cost=800,
        all_ingredients="говядина! специи!",
        main_ingredients="кукуруза! масло! gtcjr cf[fh cjkm",
        desc="Нежная говядина",
        weight=151,
        img_link="https://i.postimg.cc/9QSQPW0Z/2.png",
        cuisine="европейская"
    ),
    Dish(
        id=9,
        type="cold",
        name="Банан",
        cost=50,
        all_ingredients="банан!",
        main_ingredients="кукуруза! масло! gtcjr cf[fh cjkm",
        desc="Сладкий банан",
        weight=15,
        img_link="https://i.postimg.cc/52jtFH4f/1.webp",
        cuisine="фрукты"
    ),
    Dish(
        id=10,
        type="tasty",
        name="Кукуруза",
        cost=100,
        all_ingredients="кукуруза! соль!",
        main_ingredients="кукуруза! масло! gtcjr cf[fh cjkm",
        desc="Свежая кукуруза",
        weight=13,
        img_link="https://i.postimg.cc/52jtFH4f/1.webp",
        cuisine="вегетарианская"
    ),
    Dish(
        id=11,
        type="sweet",
        name="Нунуну lknyyjt djfbshjdfbsjzcxn ducd scvd",
        cost=300,
        main_ingredients="кукуруза! масло! gtcjr cf[fh cjkm",
        all_ingredients="нунуну! специи!",
        desc="Необычное блюдо",
        weight=1,
        img_link="https://i.postimg.cc/8PZ55dVy/3.webp",
        cuisine="экзотическая"
    ),
    Dish(
        id=12,
        type="sweet",
        name="Булулу",
        cost=400,
        main_ingredients="кукуруза! масло! gtcjr cf[fh cjkm",
        all_ingredients="булулу! масло!",
        desc="Сытное блюдо",
        weight=16,
        img_link="https://i.postimg.cc/8PZ55dVy/3.webp",
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



from typing import List, Dict

class ChatHistory:
    def __init__(self):
        self.history: List[Dict] = []

    def add_message(self, sender: bool, message: str, dishes: List[Dict] = None):
        self.history.append({
            "isUser": sender,
            "text": message,
            "dishes": dishes if dishes else []
        })

    def get_history(self):
        return self.history

chat_history = ChatHistory()



class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    message: str
    dishes: List[Dish]


# Эндпоинт для чата
@app.post("/chat", response_model=ChatResponse)
async def chat(request_1: Request, request: ChatRequest):
    headers = request_1.headers
    print(headers["X-Auth-Token"])
    print(headers['X-UID'])

    user_message = request.message

    chat_history.add_message(sender=True, message=user_message)

    if "привет" in user_message.lower():
        bot_message = "Привет! Как я могу вам помочь?"
    else:
        bot_message = "Извините, я не понял ваш запрос."

    recommended_dishes = random.sample(dishes, 3) if "t" in user_message.lower() else []

    chat_history.add_message(sender=False, message=bot_message, dishes=recommended_dishes)

    return {
        "message": bot_message,
        "dishes": recommended_dishes
    }

class ChatHistoryResponse(BaseModel):
    messages: List[Dict]

# Эндпоинт для получения истории сообщений
@app.get("/history", response_model=ChatHistoryResponse)
async def get_history(request: Request):
    headers = request.headers
    print(headers["X-Auth-Token"])
    print(headers['X-UID'])
    print(chat_history.get_history())
    return {"messages": chat_history.get_history()}


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
    longitude=91.422759,
    latitude=53.714688,
    address='ул. Пушкина, д. Колотушкина',
    desc='учшее кафе!'
)

# Эндпоинт для получения данных о нашем кафе
@app.get("/infocafe", response_model=Organisation)
def get_info():
    return organisation


class Feedback(BaseModel):
    overallRating: int
    aiRating: int
    atmosphereRating: int
    staffRating: int
    foodRating: int
    comment: str
    recommend: Optional[bool]


# Эндпоинт для приема отзывов
@app.post("/feedback")
async def get_history(request: Request):
    headers = request.headers
    print(headers["X-Auth-Token"])
    print(headers['X-UID'])
    try:
        print("Получен отзыв:", feedback.dict())
        return {"message": "Отзыв успешно получен!", "data": feedback.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class Image(BaseModel):
    id: int
    link: str


images = [
    Image(
        id=1,
        link="https://i.postimg.cc/QCLh4SC0/cafe-1.jpg"
    ),
    Image(
        id=2,
        link="https://i.postimg.cc/NF1YWTrY/cafe-3.jpg"
    ),
    Image(
        id=3,
        link="https://i.postimg.cc/2jvzbp9J/cafe-garderob.jpg"
    ),
    Image(
        id=25,
        link="https://i.postimg.cc/SNhmcZwK/cafe-garderod-2.jpg"
    ),
]


# Эндпоинт для получения всех картинок
@app.get("/images", response_model=List[Image])
def get_images():
    return images




class Person(BaseModel):
    id: int
    name: str
    status: str
    experience_years: int
    achievements: str
    photo_link: str


staff = [
    Person(
        id=1,
        name="Красивый Крабс",
        status="Шеф-повар",
        experience_years=10,
        achievements="Повар мира 2025, Главный повар мира 2024",
        photo_link="https://i.postimg.cc/XqsckqLk/image.jpg"
    ),
    Person(
        id=2,
        name="Прекрасный Боб",
        status="Су-шеф",
        experience_years=12,
        achievements="Су-Повар мира 2025, Главный су-повар мира 2024",
        photo_link="https://i.postimg.cc/FRgx1DJq/image-4.jpg"
    ),
    Person(
        id=3,
        name="Лейла Кулинарова",
        status="Повар-кондитер",
        experience_years=8,
        achievements="Лучший повар вегетарианской кухни 2023, Награда за инновации в кулинарии 2024",
        photo_link="https://i.postimg.cc/XNL8b1WB/image-1.jpg"
    ),
    Person(
        id=4,
        name="Анна Гастрономова",
        status="Консультант по питанию",
        experience_years=9,
        achievements="Эксперт в области здорового питания 2025, Лауреат премии за лучший кулинарный блог 2024",
        photo_link="https://i.postimg.cc/9MjpWvzZ/image-3.jpg"
    ),
    Person(
        id=5,
        name="Иван Степанов",
        status="Кулинарный блогер",
        experience_years=5,
        achievements="Лучший кулинарный блогер 2024, Награда за лучший видеоблог о еде 2025",
        photo_link="https://i.postimg.cc/cCxB3wRJ/image-2.jpg"
    )
]


# Эндпоинт для получения поваров
@app.get("/staff", response_model=List[Person])
def get_staff():
    return staff


class Review(BaseModel):
    id: int
    username: str
    ave_mark: float
    text: str


reviews = [
    Review(
        id=1,
        username="Dahsa_dys",
        ave_mark=4.3,
        text="Ну такой фронтенд! Прям такой! ну красота какая! А поваров вообще видели? красавчикик!"
             " А если добавить возможность бронирования столика - это вообще бомба!"
             "Ну такой фронтенд! Прям такой! ну красота какая! А поваров вообще видели? красавчикик!"
             " А если добавить возможность бронирования столика - это вообще бомба!"
             "Ну такой фронтенд! Прям такой! ну красота какая! А поваров вообще видели? красавчикик!"
             " А если добавить возможность бронирования столика - это вообще бомба!"
    ),
    Review(
        id=2,
        username="Fedya_newlife",
        ave_mark=4.14,
        text="А блюд то моих галактических еще нет!!!! Но мне нравится! Счастья в ваш дом!"
    ),
    Review(
        id=3,
        username="Nikoly",
        ave_mark=3.3,
        text="Я доволен, что у нас работают красивые девочки поварами! А телефончик можно у них взять?)"
    ),
    Review(
        id=4,
        username="Vasek",
        ave_mark=2.1,
        text="Да, максимум 5, а я вот 6 поставил. И кто запретит? БАНААААН! два БАНАНАААА! БОЛЬШЕ бананов! ну все, скип.."
    ),
    Review(
        id=5,
        username="Yandex_mop",
        ave_mark=1.3,
        text="Yandex! Yandex! Yandex! Yandex! Я mop. Я mop. Я mop."
    ),
    Review(
        id=6,
        username="Georgeee",
        ave_mark=4.9,
        text="Не понятно! А Roblox удалили что-ли? МАААААААААМ! ну ладно, ладно, я честно не играю в него!"
    ),
]


# Эндпоинт для получения комментариев
@app.get("/reviews", response_model=List[Review])
def get_reviews():
    return reviews







class Dishssss(BaseModel):
    name: str
    quantity: int
    cost: int

class Orderssss(BaseModel):
    id: int
    date: str
    status: str
    dishes: List[Dishssss]

history = [
    {
        "id": 1,
        "date": "12:15 13.03",
        "status": "В работе",
        "dishes": [
            {"name": "Пицца Маргарита", "quantity": 2, 'cost': 3},
            {"name": "Салат Цезарь", "quantity": 1, 'cost': 3},
        ],
    },
    {
        "id": 2,
        "date": "12:10 13.03",
        "status": "Завершен",
        "dishes": [
            {"name": "Паста Карбонара", "quantity": 1, 'cost': 3},
            {"name": "Тирамису", "quantity": 1, 'cost': 3},
        ],
    },
      {
            "id": 3,
            "date": "12:05 13.03",
            "status": "Завершен",
            "dishes": [
                {"name": "Стейк из лосося", "quantity": 1, 'cost': 3},
                {"name": "Картофель фри", "quantity": 2, 'cost': 3},
            ],
        },
    {
        "id": 4,
        "date": "12:05 13.03",
        "status": "Завершен",
        "dishes": [
            {"name": "Стейк из лосося", "quantity": 1, 'cost': 3},
            {"name": "Картофель фри", "quantity": 2, 'cost': 3},
        ],
    },
    {
            "id": 5,
            "date": "12:05 13.03",
            "status": "Завершен",
            "dishes": [
                {"name": "Стейк из лосося", "quantity": 1, 'cost': 3},
                {"name": "Картофель фри", "quantity": 2, 'cost': 3},
            ],
        },
]

# Эндпоинт для получения списка заказов
@app.get("/order_history", response_model=List[Orderssss])
async def get_history(request: Request):
    headers = request.headers
    print(headers["X-Auth-Token"])
    print(headers['X-UID'])

    return history