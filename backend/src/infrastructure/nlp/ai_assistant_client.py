import pandas as pd
from langchain.schema import Document
from langchain_huggingface import HuggingFaceEmbeddings
import httpx
from langchain.vectorstores import Chroma
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from langchain_core.tools import Tool
from langchain_experimental.utilities import PythonREPL
from langgraph.prebuilt import create_react_agent
from typing import Literal
from typing_extensions import TypedDict
from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.types import Command
# import torch
# from langgraph.checkpoint.memory import MemorySaver

from backend.src.infrastructure.database.unit_of_work import get_unit_of_work
from backend.src.config import settings
from backend.src.core.domain.message import MessageDTO
# from backend.src import retrieve_user_order

class AiAssistant:
    def __init__(self):
        self.llm = ChatGroq(
            model="llama-3.2-90b-vision-preview",
            temperature=0.5,
            http_client=httpx.Client(proxy=settings.app.proxy_url)
        )

    async def refresh_df(self):
        async for uow in get_unit_of_work():
            df = pd.DataFrame([d.model_dump() for d in (await uow.dish.list())])
            df = df[['id', 'type', 'name', 'description', 'all_ingredients', 'cost', 'weight', 'cuisine']]
            self.df = df

            list_type_meals = list(df['type'].unique())
            self.list_type_meals = list_type_meals

            type_meals_cost = {
                "max_dessert": max(df[df['type'] == 'Десерты']['cost']),
                "min_dessert": min(df[df['type'] == 'Десерты']['cost']),
                "max_main_menu": max(df[df['type'] == 'Основные блюда']['cost']),
                "min_main_menu": min(df[df['type'] == 'Основные блюда']['cost']),
                "max_snack" : max(df[df['type'] == 'Закуски']['cost']),
                "min_snack" : min(df[df['type'] == 'Закуски']['cost']),
                "max_soup": max(df[df['type'] == 'Супы']['cost']),
                "min_soup": min(df[df['type'] == 'Супы']['cost']),
                "max_drink": max(df[df['type'] == 'Напитки']['cost']),
                "min_drink": min(df[df['type'] == 'Напитки']['cost']),
                "max_salad": max(df[df['type'] == 'Салаты']['cost']),
                "min_salad": min(df[df['type'] == 'Салаты']['cost']),
            }
            self.type_meals_cost = type_meals_cost

            type_meals_weight = {
                "max_dessert": int(max(df[df['type'] == 'Десерты']['weight']).split()[0]),
                "min_dessert": int(min(df[df['type'] == 'Десерты']['weight']).split()[0]),
                "max_main_menu": int(max(df[df['type'] == 'Основные блюда']['weight']).split()[0]),
                "min_main_menu": int(min(df[df['type'] == 'Основные блюда']['weight']).split()[0]),
                "max_snack" : int(max(df[df['type'] == 'Закуски']['weight']).split()[0]),
                "min_snack" : int(min(df[df['type'] == 'Закуски']['weight']).split()[0]),
                "max_soup": int(max(df[df['type'] == 'Супы']['weight']).split()[0]),
                "min_soup": int(min(df[df['type'] == 'Супы']['weight']).split()[0]),
                "max_drink": int(max(df[df['type'] == 'Напитки']['weight']).split()[0]),
                "min_drink": int(min(df[df['type'] == 'Напитки']['weight']).split()[0]),
                "max_salad": int(max(df[df['type'] == 'Салаты']['weight']).split()[0]),
                "min_salad": int(min(df[df['type'] == 'Салаты']['weight']).split()[0]),
            }
            self.type_meals_cost = type_meals_cost

            len_type_meals = {
                "main_menu": len(df[df["type"] == "Основные блюда"]),
                "soup": len(df[df["type"] == "Супы"]),
                "salad": len(df[df["type"] == "Салаты"]),
                "snack": len(df[df["type"] == "Закуски"]),
                "dessert": len(df[df["type"] == "Десерты"]),
                "drink": len(df[df["type"] == "Напитки"])
            }
            self.len_type_meals = len_type_meals

            docs = [
                Document(
                    page_content=f"{row['type']}. {row['name']}. {row['description']} {row['all_ingredients']}. {row['cuisine']}.",
                    metadata={
                        "cost": row["cost"],
                        "weight": int(row["weight"].split(" ")[0]),
                        "category": row["type"],
                        "id": row["id"]
                    },
                    id=row["id"]
                )
                for _, row in df.iterrows()
            ]

            # device = "cuda" if torch.cuda.is_available() else "cpu"
            device = "cpu"
            emb_model = HuggingFaceEmbeddings(
                model_name='intfloat/multilingual-e5-base',
                model_kwargs={"device": device}
            )

            try:
                self.vector_store.delete_collection()
            except:
                pass
            vector_store = Chroma.from_documents(docs, emb_model)
            self.vector_store = vector_store
            retriever = vector_store.as_retriever()
            self.retriever = retriever

    @property
    def chain_type_request(self):
        template_type_request = "Ты рекомендатель блюд и напитков на сайте. " + \
        "Твоя задача проанализировать просьбу гостя и вывести одну из цифр\n" + \
        "1 - если гость хочет пить или есть, заказать, рекомендацию блюд\n" + \
        "2 - если просьба гостя относится к корзине, счету (раздел заказа, счета)\n" + \
        "0 - в противном случае"

        prompt_type_request = ChatPromptTemplate(
            [("system", template_type_request), ("user", "Просьба: {text}")]
        )
        return prompt_type_request | self.llm

    @property
    def chain_type_meals(self):
        template_type_meals = "Ты рекомендатель блюд и напитков на сайте. " + \
        "Твоя задача проанализировать типы блюд (напитки входят в их число), просьбу и вывести кратко те типы блюд, которые подходят\n" + \
        f"Типы блюд: {', '.join(self.list_type_meals)} \n" + \
        "В конце обязательно кратко напиши, упоминается ли явно цена и размер"

        prompt_type_meals = ChatPromptTemplate(
            [("system", template_type_meals), ("user", "Просьба: {text}")]
        )

        class Classification(BaseModel):
            need_soup: bool = Field(
                description="True, когда нужно порекомендовать суп",
                enum=[True, False]
            )
            need_main_menu: bool = Field(
                description="True, когда нужно порекомендовать основные блюда",
                enum=[True, False]
            )
            need_dessert: bool = Field(
                description="True, когда нужно порекомендовать десерт",
                enum=[True, False]
            )
            need_salad: bool = Field(
                description="True, когда нужно порекомендовать салат",
                enum=[True, False]
            )
            need_snack: bool = Field(
                description="True, когда нужно порекомендовать закуски",
                enum=[True, False]
            )
            need_drink: bool = Field(
                description="True, когда нужно порекомендовать напиток",
                enum=[True, False]
            )
            cost_is_mentioned: bool = Field(
                description="True, когда упоминается цена",
                enum=[True, False]
            )
            weight_is_mentioned: bool = Field(
                description="True, когда упоминается размер",
                enum=[True, False]
            )

        tagging_prompt = ChatPromptTemplate.from_template(
        """
        Extract the desired information from the following passage.

        Only extract the properties mentioned in the 'Classification' function.

        Passage:
        {input}
        """
        )

        meals_classification = ChatGroq(
            temperature=0.5,
            model='llama-3.2-90b-vision-preview',
            http_client=httpx.Client(proxy=settings.app.proxy_url)).with_structured_output(
            Classification
        )

        return (prompt_type_meals | self.llm) | (tagging_prompt | meals_classification)

    @property
    def chain_food_recommendations(self):
        template_food_recommendations = "Ты рекомендуешь блюда из предоставленного меню." + \
        "Твоя задача - учесть просьбу и вывести до 6 id блюд ЧЕРЕЗ ОДИН пробел, которые пользователь хотел бы видеть" + \
        "Подойди очень ответсвенного к этому, ведь у людей может быть аллергия! Лучше не бери блюдо, если сомневаешься" + \
        "Выведи только ДО 6 id ЧЕРЕЗ ОДИН пробел БЕЗ ЛИШНИХ слов в начале и конце, либо напиши, что их нет" + \
        "Предоставленное меню: \n" + \
        "{menu}"

        prompt_food_recommendations = ChatPromptTemplate(
            [("system", template_food_recommendations), ("user", "Просьба: {text}")]
        )
        return (prompt_food_recommendations | self.llm)

    @property
    def chain_foods_found(self):
        template_foods_found = "Ты русский рекомендатель блюд на сайте" + \
        "Твоя задача рассказать очень вкратце про каждое блюдо (напиток) из меню. Отвечай на просьбу только на основе предоставленных данных! Не указывай цену и вес, если не нужно в просьбе. " + \
        "Делай итоговый расчет по блюдам, если в просьбе надо учесть стоимость." + \
        "Предоставленное меню: \n" + \
        "{menu}" + \
        "В конце можешь только пожелать приятного аппетита" + \
        "{need_clarification}"

        prompt_foods_found = ChatPromptTemplate(
            [("system", template_foods_found), ("user", "Просьба: {text}")]
        )
        return (prompt_foods_found | self.llm)

    @property
    def chain_foods_not_found(self):
        template_foods_not_found = "Ты нейросеть на сайте. " + \
        "Проанализируй просьбу гостя и ответь вежливо, что блюд (напитков) не найдено. Больше ничего не говори"
        # "Если просьба нестандартная, то ответь, что не знаешь. "

        prompt_foods_not_found = ChatPromptTemplate(
            [("system", template_foods_not_found), ("user", "Просьба: {text}")]
        )
        return (prompt_foods_not_found | self.llm)

    def format_dataframe(df_curr):
        formatted_rows = []
        for _, row in df_curr.iterrows():
            formatted_row = ", ".join([f"{col}: {row[col]}" for col in df_curr.columns])
            formatted_rows.append(formatted_row)
        return "\n".join(formatted_rows)

    def get_menu_by_id(self, ids):
        return "\n".join([self.format_dataframe(self.df[self.df['id'] == id][['type', 'name', 'description',
                'all_ingredients', 'cost', 'weight', 'cuisine']]) for id in ids])

    @property
    def chain_basket(self):
        template_basket = "Тебе будет представлена корзина и просьба" + \
        "Проанализируй корзину и помоги с просьбой" + \
        "Корзина:\n" + \
        "{basket_meals}"

        prompt_basket = ChatPromptTemplate(
            [("system", template_basket), ("user", "Просьба: {text}")]
        )
        return (prompt_basket | self.llm)

    @property
    def agent_basket(self):
        python_repl = PythonREPL()

        repl_tool = Tool(
            name="python_repl",
            description="A Python shell. Use this to execute python commands. Input should be a valid python command. If you want to see the output of a value, you should print it out with `print(...)`.",
            func=python_repl.run,
        )

        system_message_basket = "Help with task about basket. Give answer in russia"
        query = "Раздели счет на четверых"

        return create_react_agent(self.llm, [repl_tool], prompt=system_message_basket)


    async def get_answer(self, request: str, user_id: int) -> MessageDTO:
        if self.df is None:
            await self.refresh_df()
        class InputState(MessagesState):
            question: str

        class OutputState(TypedDict):
            ids: list[int]
            answer: str

        class State(TypedDict):
            question: str
            ids: list[int]
            need_clarification: str

        class FilterState(TypedDict):
            question: str
            need_soup: bool
            need_main_menu: bool
            need_dessert: bool
            need_snack: bool
            need_salad: bool
            need_drink: bool
            cost_is_mentioned: bool
            weight_is_mentioned: bool
            cost_types: dict
            weight_types: dict

        class RetrieveState(TypedDict):
            question: str
            soup: str
            main_menu: str
            dessert: str
            snack: str
            salad: str
            drink: str

        class OverallState(TypedDict):
            question: str
            ids: list[int]
            answer: str
            need_soup: bool
            need_main_menu: bool
            need_dessert: bool
            need_snack: bool
            need_salad: bool
            need_drink: bool
            cost_is_mentioned: bool
            weight_is_mentioned: bool
            cost_types: dict
            weight_types: dict
            soup: str
            main_menu: str
            dessert: str
            snack: str
            salad: str
            drink: str

        def type_request(state: InputState) -> Command[Literal["food_recommendations", "basket", "nonstandard"]]:
            text = state['messages'][0].content
            # text = [i.content for i in state['messages']]
            # text = f"Старые контекст: {', '.join(text[:-1])} \nНовый запрос: {text[-1]}"
            response_type = self.chain_type_request.invoke({"text": text}).content
            goto = "nonstandard"
            if "1" in response_type:
                goto = "food_recommendations"
            elif "2" in response_type:
                goto = "basket"
            return Command(goto=goto, update={"question": text})

        def nonstandard(state: InputState):
            return {"answer": "Уважаемый гость, я помогаю с выбором блюд или с работой по корзине"}

        def basket(state: InputState):
            # res = self.chain_basket.invoke({"text": state["question"], "basket_meals": "пицца 300 рублей, шаурма 200 рублей, напиток 123 руб"}).content
            res = self.agent_basket.invoke({"messages": [("system", retrieve_user_order(user_id)), ("user", state["question"])]}).get("messages")[-1].content
            return {"answer": res}

        def food_recommendations(state: InputState):
            return

        def need_type_meals_cost_weight(state: FilterState):
            response_type = self.chain_type_meals.invoke({"text": state.get("question")})
            return dict(response_type)

        def get_cost_filter(state: FilterState):
            if not state.get("cost_is_mentioned"):
                return self.type_meals_cost
            return

        def get_weight_filter(state: FilterState):
            if not state.get("weight_is_mentioned"):
                return self.type_meals_weight
            return

        def rag(state: FilterState):
            if any([state.get("need_dessert"), state.get("need_salad"),
                  state.get("need_soup"), state.get("need_main_menu"),
                  state.get("need_snack"), state.get("need_drink")
            ]):
                return
            return {"need_dessert": True, "need_salad": True, "need_soup": True,
                    "need_main_menu": True, "need_snack": True, "need_drink": True}

        def retrieve_dessert(state: FilterState):
            if not state.get("need_dessert"):
                return
            res = self.retriever.get_relevant_documents(state["question"],
            k = self.len_type_meals.get("dessert"),
            filter={
                "$and": [
                    {"category": "Десерты"},
                    {"weight": {"$gte": self.type_meals_weight.get("min_dessert")}},
                    {"weight": {"$lte": self.type_meals_weight.get("max_dessert")}},
                    {"cost": {"$gte": self.type_meals_cost.get("min_dessert")}},
                    {"cost": {"$lte": self.type_meals_cost.get("max_dessert")}}
                ]
            })
            retr = set()
            for i in res[:3] + res[-3:]:
                retr.add(f"id: {i.metadata.get('id')}. {i.page_content} Цена {i.metadata.get('cost')} руб. Вес {i.metadata.get('weight')} грамм/мл")
            return {"dessert": "\n".join(retr)+"\n"}

        def retrieve_salad(state: FilterState):
            if not state.get("need_salad"):
                return
            res = self.retriever.get_relevant_documents(state["question"],
            k = self.len_type_meals.get("salad"),
            filter={
                "$and": [
                    {"category": "Салаты"},
                    {"weight": {"$gte": self.type_meals_weight.get("min_salad")}},
                    {"weight": {"$lte": self.type_meals_weight.get("max_salad")}},
                    {"cost": {"$gte": self.type_meals_cost.get("min_salad")}},
                    {"cost": {"$lte": self.type_meals_cost.get("max_salad")}}
                ]
            })
            retr = set()
            for i in res[:3] + res[-3:]:
                retr.add(f"id: {i.metadata.get('id')}. {i.page_content} Цена {i.metadata.get('cost')} руб. Вес {i.metadata.get('weight')} грамм/мл")
            return {"salad": "\n".join(retr)+"\n"}

        def retrieve_soup(state: FilterState):
            if not state.get("need_soup"):
                return
            res = self.retriever.get_relevant_documents(state["question"],
            k = self.len_type_meals.get("soup"),
            filter={
                "$and": [
                    {"category": "Супы"},
                    {"weight": {"$gte": self.type_meals_weight.get("min_soup")}},
                    {"weight": {"$lte": self.type_meals_weight.get("max_soup")}},
                    {"cost": {"$gte": self.type_meals_cost.get("min_soup")}},
                    {"cost": {"$lte": self.type_meals_cost.get("max_soup")}}
                ]
            })
            retr = set()
            for i in res[:3] + res[-3:]:
                retr.add(f"id: {i.metadata.get('id')}. {i.page_content} Цена {i.metadata.get('cost')} руб. Вес {i.metadata.get('weight')} грамм/мл")
            return {"soup": "\n".join(retr)+"\n"}

        def retrieve_main_menu(state: FilterState):
            if not state.get("need_main_menu"):
                return
            res = self.retriever.get_relevant_documents(state["question"],
            k = self.len_type_meals.get("main_menu"),
            filter={
                "$and": [
                    {"category": "Основные блюда"},
                    {"weight": {"$gte": self.type_meals_weight.get("min_main_menu")}},
                    {"weight": {"$lte": self.type_meals_weight.get("max_main_menu")}},
                    {"cost": {"$gte": self.type_meals_cost.get("min_main_menu")}},
                    {"cost": {"$lte": self.type_meals_cost.get("max_main_menu")}}
                ]
            })
            retr = set()
            for i in res[:5] + res[-5:]:
                retr.add(f"id: {i.metadata.get('id')}. {i.page_content} Цена {i.metadata.get('cost')} руб. Вес {i.metadata.get('weight')} грамм/мл")
            return {"main_menu": "\n".join(retr)+"\n"}

        def retrieve_snack(state: FilterState):
            if not state.get("need_snack"):
                return
            res = self.retriever.get_relevant_documents(state["question"],
            k = self.len_type_meals.get("snack"),
            filter={
                "$and": [
                    {"category": "Закуски"},
                    {"weight": {"$gte": self.type_meals_weight.get("min_snack")}},
                    {"weight": {"$lte": self.type_meals_weight.get("max_snack")}},
                    {"cost": {"$gte": self.type_meals_cost.get("min_snack")}},
                    {"cost": {"$lte": self.type_meals_cost.get("max_snack")}}
                ]
            })
            retr = set()
            for i in res[:3] + res[-3:]:
                retr.add(f"id: {i.metadata.get('id')}. {i.page_content} Цена {i.metadata.get('cost')} руб. Вес {i.metadata.get('weight')} грамм/мл")
            return {"snack": "\n".join(retr)+"\n"}

        def retrieve_drink(state: FilterState):
            if not state.get("need_drink"):
                return
            res = self.retriever.get_relevant_documents(state["question"],
            k = self.len_type_meals.get("drink"),
            filter={
                "$and": [
                    {"category": "Напитки"},
                    {"weight": {"$gte": self.type_meals_weight.get("min_drink")}},
                    {"weight": {"$lte": self.type_meals_weight.get("max_drink")}},
                    {"cost": {"$gte": self.type_meals_cost.get("min_drink")}},
                    {"cost": {"$lte": self.type_meals_cost.get("max_drink")}}
                ]
            })
            retr = set()
            for i in res[:3] + res[-3:]:
                retr.add(f"id: {i.metadata.get('id')}. {i.page_content} Цена {i.metadata.get('cost')} руб. Вес {i.metadata.get('weight')} грамм/мл")
            return {"drink": "\n".join(retr)+"\n"}

        def ids_foods_reccomended(state: RetrieveState) -> Command[Literal["foods_found", "foods_not_found"]]:
            menu = state.get("soup", "") + state.get("main_menu", "") + \
                state.get("dessert", "") + state.get("snack", "") + \
                state.get("salad", "") + state.get("drink", "")
            print(menu)
            res = self.chain_food_recommendations.invoke({"text": state.get("question"), "menu": menu}).content
            records = set()
            print(res)
            for id in res.split():
                id = id.strip('.')
                if id.isdigit() and not self.df[self.df['id'] == int(id)].empty:
                    records.add(int(id))
            records = list(records)
            if records:
                need_clarification = ""
                if len(records) > 6:
                    records = records[:6]
                    need_clarification = " и попросить уточнить просьбу, так как найденно много блюд"
                return Command(goto="foods_found", update={"ids": records, "need_clarification": need_clarification})
            return Command(goto="foods_not_found")

        def foods_found(state: State):
            menu = self.get_menu_by_id(state.get('ids'))
            res = self.chain_foods_found.invoke({"text": state.get("question"), "menu": menu, "need_clarification": state.get('need_clarification')}).content
            return {"answer": res}

        def foods_not_found(state: State):
            res = self.chain_foods_not_found.invoke({"text": state.get("question")}).content
            return {"answer": res}


        graph_builder = StateGraph(OverallState, input=InputState, output=OutputState)
        graph_builder.add_node(type_request, "type_request")
        graph_builder.add_node(basket, "basket")
        graph_builder.add_node(nonstandard, "nonstandard")
        graph_builder.add_node(food_recommendations, "food_recommendations")
        graph_builder.add_node(need_type_meals_cost_weight, "need_type_meals_cost_weight")
        graph_builder.add_node(get_cost_filter, "get_cost_filter")
        graph_builder.add_node(get_weight_filter, "get_weight_filter")
        graph_builder.add_node(rag, "rag")
        graph_builder.add_node(retrieve_dessert, "retrieve_dessert")
        graph_builder.add_node(retrieve_salad, "retrieve_salad")
        graph_builder.add_node(retrieve_soup, "retrieve_soup")
        graph_builder.add_node(retrieve_main_menu, "retrieve_main_menu")
        graph_builder.add_node(retrieve_snack, "retrieve_snack")
        graph_builder.add_node(retrieve_drink, "retrieve_drink")
        graph_builder.add_node(ids_foods_reccomended, "ids_foods_reccomended")
        graph_builder.add_node(foods_found, "foods_found")
        graph_builder.add_node(foods_not_found, "foods_not_found")

        graph_builder.add_edge("food_recommendations", "need_type_meals_cost_weight")
        graph_builder.add_edge("rag", "retrieve_dessert")
        graph_builder.add_edge("rag", "retrieve_salad")
        graph_builder.add_edge("rag", "retrieve_soup")
        graph_builder.add_edge("rag", "retrieve_main_menu")
        graph_builder.add_edge("rag", "retrieve_snack")
        graph_builder.add_edge("rag", "retrieve_drink")
        graph_builder.add_edge(START, "type_request")
        graph_builder.add_edge("need_type_meals_cost_weight", "get_cost_filter")
        graph_builder.add_edge("need_type_meals_cost_weight", "get_weight_filter")
        graph_builder.add_edge("get_cost_filter", "rag")
        graph_builder.add_edge("get_weight_filter", "rag")
        graph_builder.add_edge("retrieve_dessert", "ids_foods_reccomended")
        graph_builder.add_edge("retrieve_salad", "ids_foods_reccomended")
        graph_builder.add_edge("retrieve_soup", "ids_foods_reccomended")
        graph_builder.add_edge("retrieve_main_menu", "ids_foods_reccomended")
        graph_builder.add_edge("retrieve_snack", "ids_foods_reccomended")
        graph_builder.add_edge("retrieve_drink", "ids_foods_reccomended")

        graph_builder.add_edge("foods_found", END)
        graph_builder.add_edge("foods_not_found", END)
        graph_builder.add_edge("basket", END)
        graph_builder.add_edge("nonstandard", END)

        # memory = MemorySaver()
        # graph = graph_builder.compile(checkpointer=memory)
        graph = graph_builder.compile()
        response = graph.invoke({
            "messages": [("user", request)]
        })
        return MessageDTO(
                text=response.get("answer"),
                dishes=response.get("ids", []),
                isUser=False
            )