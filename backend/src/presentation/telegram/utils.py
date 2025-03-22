async def start_mailing(text, telegram_ids: list[int], image_url=None):
    from backend.src.presentation.telegram.__main__ import get_telegram_bot
    bot = get_telegram_bot()
    for user_id in telegram_ids:
        try:
            if image_url:
                await bot.send_photo(chat_id=user_id, photo=image_url, caption=text, parse_mode='MarkdownV2')
            else:
                await bot.send_message(user_id, text, parse_mode='MarkdownV2')
        except Exception as e:
            pass 
