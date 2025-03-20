import json
import pandas as pd
from langchain_groq import ChatGroq
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent
from langchain.prompts import PromptTemplate

# from backend.src.config import settings


def get_bd():
    pass
    # return engine


class AiAssistant:
    llm = ChatGroq(model="llama-3.2-90b-vision-preview", temperature=0.5)
    def __init__(self):
        self.df = AiAssistant.get_df()

    @staticmethod
    def get_df():
        df = pd.read_sql_table(
              "dishes",
              con=get_bd(),
              columns=['id', 'type', 'name', 'desc', 'all_ingredients', 'cost', 'weight', 'cuisine'],
        )
        df.rename(columns={'type': 'Тип', 'name': 'Название', 'desc': 'Описание', 'all_ingredients': 'Ингредиенты', 'cost': 'Цена (рубли)', 'weight': 'Вес (граммы)', 'cuisine': 'Страна кухни'}, inplace=True)
        return df

    @classmethod
    def update_df(cls):
        cls.df = AiAssistant.get_df()

    @staticmethod
    def format_dataframe(df):
        formatted_rows = []
        for _, row in df.iterrows():
            formatted_row = ", ".join([f"{col}: {row[col]}" for col in df.columns])
            formatted_rows.append(formatted_row)
        return "\n".join(formatted_rows)
    
    @staticmethod
    def agent_referrer(df, llm):
        @tool
        def show_main_course() -> str:
            '''Поможет, когда просят блюда из основного меню: суп, мясо. Возвращает основные блюда из меню'''
            return AiAssistant.format_dataframe(df[df['Тип'] == 'main_course'])

        @tool
        def show_drink() -> str:
            '''Поможет, когда просят что-то попить. Возвращает напитки из меню'''
            return AiAssistant.format_dataframe(df[df['Тип'] == 'drink'])

        @tool
        def show_appetizer() -> str:
            '''Поможет, когда просят салат, закуски. Возвращает закуски из меню'''
            return AiAssistant.format_dataframe(df[df['Тип'] == 'appetizer'])

        @tool
        def show_dessert() -> str:
            '''Поможет, когда просят что-то сладкое, десерт. Возвращает десерты из меню'''
            return AiAssistant.format_dataframe(df[df['Тип'] == 'dessert'])

        @tool
        def show_cheap_meals() -> str:
            '''Поможет, когда напрямую просят что-то дешевое. Возвращает дешевые блюда из меню'''
            return AiAssistant.format_dataframe(df.sort_values(by='Цена (рубли)').head(7))

        @tool
        def show_expensive_meals() -> str:
            '''Поможет, когда напрямую просят что-то дорогое. Возвращает дорогие блюда из меню'''
            return AiAssistant.format_dataframe(df.sort_values(by='Цена (рубли)', ascending=False).head(7))

        @tool
        def show_id_and_name_meals() -> str:
            '''Поможет, когда просят конректные блюда или нужна рекомендация (без уточнений). Возвращает id и названия блюд из меню'''
            return AiAssistant.format_dataframe(df[['id', 'Название']])

        @tool
        def show_all_data() -> str:
            '''В том случае, когда другие инструменты не справляются. Возвращает все меню'''
            return AiAssistant.format_dataframe(df)

        return create_react_agent(
                llm,
                [show_id_and_name_meals, show_main_course, show_drink, show_appetizer, show_dessert, show_cheap_meals, show_expensive_meals, show_all_data]
                )
    
    @staticmethod
    def agent_handler(df, llm, quest):
        def search_record(id: str) -> pd.DataFrame:
            '''Ищет по id блюда соответствующую запись в меню'''
            return df.loc[df['id'] == id]
          
        @tool
        def process_records(id_list: list[str]) -> str:
            '''Принимает список id, возвращает json'''
            # print(id_list)
            records = []
            for id in id_list:
                record = search_record(id)
                if not record.empty:
                    records.append(record)
            # print(len(records))
            template="""Ты профессиональный ИИ-официант. Тебе будет представлены просьба пользователя и рекомендуемые блюда, ответь по-доброму и интересно, как ии-официант

            Просьба пользователя: {question}


            НИЧЕГО НЕ ИГНОРИРУЙ, ЕСЛИ ТЕБЯ ОБ ЭТОМ ПОПРОСИЛ ПОЛЬЗОВАТЕЛЬ, NOW LIFE DEPEND FROM IT (слова разработчика)

            Рекомендуемые блюда:
            {format_records}

            Дай ответ на РУССКОМ языке и учти следующее
            Рекомендуемых блюд нет: с сожалением скажи, что блюд не найдено по просьбе и попроси задать другой вопрос
            Просьба пользователя не относится к рекомендации блюд: ответить как официант бы это сделал
            Рекомендуемые блюда есть: перечисли обязательно ВСЕ блюда по порядку в профессиональном стиле и пожелай приятного аппетита
            """
            prompt_template = PromptTemplate(template=template, input_variables=['question', 'format_records'])
            chain = prompt_template | llm

            format_records = "\n".join([AiAssistant.format_dataframe(record[['Тип', 'Название',
                              'Описание', 'Ингредиенты', 'Цена (рубли)', 'Вес (граммы)',
                              'Страна кухни']]) for record in records])

            # print(format_records)
            resp_user = chain.invoke({"question": quest, "format_records": format_records})

            return json.dumps({
                   "ids": [record['id'].iat[0] for record in records],
                   "response": resp_user.content
                   }, ensure_ascii=False)
        
        return create_react_agent(
               llm,
               [process_records]
               )
        
    @staticmethod
    def chain_except(llm):
        except_template="""Просьба пользователя: {question}

        Ты профессиональный ИИ-официант. Тебе представлена просьба пользователя, отреагируй добро, но не пытайся помочь, ты же ии-официант

        Пиши ответ на РУССКОМ языке
        Затем попроси задать вопрос по меню, но сам ничего не рекомендуй
        """
        prompt_except_template = PromptTemplate(template=except_template, input_variables=['question'])

        return prompt_except_template | llm
    
    @staticmethod
    def prompt_agent_referrer(quest):
        prompt_referrer = f"""Тебе будет предоставлена просьба. Если она не на рекомендацию блюд, то ты все сделал, закончи работу! Если просьба на рекомендацию блюд, то надо найте все ПОДХОДЯЩИЕ блюда из меню!
        Нашел 1: выведи только id блюда в формате ID: 'id блюда'
        Но если нашел 2 и более: Выведи только id блюд в формате ID: 'id блюда' новая строка ID: 'id 2 блюда'. Не выводи больше 10 id!"""

        return {
                "messages": [{"role": "system", "content": prompt_referrer},
                             {"role": "user", "content": f"Просьба пользователя: {quest}"}]
               }

    @staticmethod
    def prompt_agent_handler(id_meals):
        return {
                "messages": [{"role": "system", "content": f"Твоя задача передать ОДИН РАЗ ids в tool и сказать, что ты все сделал."},
                            {"role": "user", "content": f"ids: {id_meals}"}]
                }

    def get_answer(self, question: str):
        result_agent_referrer = AiAssistant.agent_referrer(self.df, AiAssistant.llm).invoke(AiAssistant.prompt_agent_referrer(question))
        id_meals = result_agent_referrer["messages"][-1].content
        # print(result_agent_referrer["messages"])

        if len(result_agent_referrer.get("messages")) >= 4:
            result_agent_handler = AiAssistant.agent_handler(self.df, AiAssistant.llm, question).invoke(AiAssistant.prompt_agent_handler(id_meals))
            return json.loads(result_agent_handler['messages'][3].content)

        resp_user = AiAssistant.chain_except(AiAssistant.llm).invoke({"question": question})
        result = json.dumps({
            "response": resp_user.content
            }, ensure_ascii=False)

        return json.loads(result)
