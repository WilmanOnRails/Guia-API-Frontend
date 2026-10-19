# ✦ AnimeVerse

**Explora tu próximo anime favorito.**

AnimeVerse es un portal web interactivo que permite buscar y descubrir series y películas de anime mediante el consumo de una API REST. Presenta la información en una interfaz moderna, con tarjetas visuales, portadas, puntuaciones, géneros y detalles de cada título.

El proyecto está desarrollado con HTML5, CSS3 y JavaScript, utilizando `fetch()` y `async/await` para realizar solicitudes HTTP y procesar las respuestas de la API.

## ✨ Características

- **Búsqueda de anime:** encuentra títulos por nombre.
- **Catálogo visual:** muestra portadas, títulos, puntuaciones y otros datos relevantes.
- **Información detallada:** consulta sinopsis, géneros, estudios de animación, estado de emisión y temporada.
- **Filtros:** permite filtrar los resultados por formato y género.
- **Ordenamiento:** organiza los resultados por puntuación, popularidad o título.
- **Paginación:** navega entre diferentes páginas de resultados.
- **Diseño adaptable:** interfaz responsive para computadoras, tablets y dispositivos móviles.
- **Manejo de errores:** informa sobre errores de conexión, respuestas HTTP no satisfactorias y búsquedas sin resultados.
- **Consultas asíncronas:** utiliza `async/await` para facilitar la comunicación con la API.

## 🛠️ Tecnologías utilizadas

| Tecnología | Descripción |
|---|---|
| HTML5 | Estructura de la aplicación web. |
| CSS3 | Diseño visual, estilos, animaciones y adaptación a distintos dispositivos. |
| JavaScript | Lógica de búsqueda, filtros, paginación y renderizado dinámico. |
| Fetch API | Realización de solicitudes HTTP. |
| Async/await | Gestión de operaciones asíncronas. |
| JSON | Formato de intercambio de datos con la API. |
| Tenrai API | Servicio externo para consultar información sobre anime. |

## 🌐 API utilizada

El proyecto utiliza Tenrai API como fuente externa de información.

- **URL base:** `https://api.tenrai.org/v1`
- **Documentación:** https://api.tenrai.org/documentation

Entre los endpoints contemplados en la implementación se encuentran:

| Endpoint | Función |
|---|---|
| `/anime` | Buscar y consultar anime. |
| `/top/anime` | Obtener listados de anime destacados. |
| `/anime/{id}/full` | Consultar información detallada de un anime. |
| `/genres/anime` | Obtener géneros disponibles. |

La disponibilidad y los parámetros de estos endpoints dependen de la versión y el estado del servicio. Se recomienda consultar su documentación antes de realizar modificaciones.

## 🚀 Instalación y ejecución

### Requisitos

- Un navegador web moderno.
- Conexión a Internet.
- Visual Studio Code (recomendado).
- La extensión Live Server, opcional pero recomendada.

### Pasos para ejecutar el proyecto

1. Descarga o clona el repositorio.
2. Abre la carpeta del proyecto en Visual Studio Code.
3. Localiza el archivo `animeverse.html`.
4. Ejecuta el archivo mediante Live Server o ábrelo directamente en tu navegador.
5. Utiliza el buscador para consultar títulos de anime.

**Importante:** el portal necesita conexión a Internet para obtener información de Tenrai API y cargar las imágenes externas.

## 📁 Estructura del proyecto

La versión inicial está implementada en un único archivo HTML que contiene la estructura, los estilos y el código JavaScript.

```text
AnimeVerse/
└── animeverse.html
```

En una futura versión, el proyecto podría organizarse en archivos separados:

```text
AnimeVerse/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── README.md
```

Esta segunda estructura es una propuesta de organización para facilitar el mantenimiento y la ampliación del proyecto; no representa necesariamente la estructura actual.

## ⚙️ Funcionamiento general

1. El usuario introduce un título o selecciona los filtros disponibles.
2. JavaScript construye la solicitud con los parámetros correspondientes.
3. `fetch()` realiza la petición HTTP al endpoint de Tenrai API.
4. `async/await` permite esperar la respuesta y procesar los datos.
5. La respuesta JSON se transforma en información utilizable por JavaScript.
6. Los resultados se muestran dinámicamente mediante tarjetas y ventanas de detalles.

## ⚠️ Limitaciones conocidas

- La aplicación depende de la disponibilidad de Tenrai API.
- Las solicitudes pueden fallar por problemas de conexión o límites de uso.
- Algunos títulos pueden no tener puntuación, imagen o información completa.
- Los resultados dependen de los datos proporcionados por el servicio externo.
- La compatibilidad de filtros y endpoints debe verificarse con la documentación vigente.

## 🔮 Mejoras futuras

- Sistema de favoritos.
- Historial de búsquedas.
- Recomendaciones personalizadas.
- Filtros adicionales por temporada, año y estado de emisión.
- Modo claro y modo oscuro.
- Páginas individuales para cada anime.
- Separación del frontend en módulos.
- Integración con un backend y una base de datos para guardar preferencias.

## 📚 Referencias

- Tenrai API. Documentación oficial: https://api.tenrai.org/documentation
- MDN Web Docs. Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- MDN Web Docs. Async functions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

Desarrollado como proyecto de práctica de consumo de API REST.
