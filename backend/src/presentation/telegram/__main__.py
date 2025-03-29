from aiogram import Bot, Dispatcher, Router, types
from aiogram.types import BotCommand, BotCommandScopeDefault
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.filters import Command
import asyncio
from backend.src.config import settings


bot = Bot(token=settings.bot.api_token)

def get_telegram_bot() -> Bot:
    return bot

storage = MemoryStorage()
dp = Dispatcher(storage=storage)
router = Router()


@router.message(Command("start"))
async def cmd_start(message: types.Message):
    welcome_text = "Добро пожаловать в бота NEURO Cafe\! ☕✨\n\n" \
                "Перейдите по ссылке ниже, чтобы окунуться в мир удивительных вкусов и ароматов\. " \
                "Здесь вы найдете самые вкусные напитки и закуски, которые подарят вам заряд энергии и радости\!\n\n" \
                "Мы рады видеть Вас\! 🌟"

    link_button = InlineKeyboardButton(text="Перейти на сайт", url=f"https://cafe-neuro.ru/?UID={message.from_user.id}")
    keyboard = InlineKeyboardMarkup(inline_keyboard=[[link_button]])

    await message.answer(welcome_text, reply_markup=keyboard, parse_mode="MarkdownV2")

async def set_base_commands():
    commands = [
        BotCommand( 
            command="start", 
            description="Начать"
        )
    ]
    await bot.set_my_commands(commands, BotCommandScopeDefault())


async def startup_bot():
    dp.include_router(router)
    dp.startup.register(set_base_commands)
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)
