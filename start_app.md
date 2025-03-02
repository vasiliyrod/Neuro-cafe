## Для запуска моей части

из папки репозитория

### C Docker

```
docker-compose up --build
```

### Without docker

Открываем сразу 2 терминала в одном проекте

#### В первом вбиваем

```
cd bacckend
pip install -r requirements.txt # если запуск первый раз
uvicorn main:app --reload --port 8001      
```

#### Во втором вбиваем

```
cd frontend
npm install # если запуск первый раз
nmp start      
```

### Переходим по ссылке 2 терминала
# Ура! все работает!