// Fichas de la constelación. Las 14 herramientas son las de la landing actual; las descripciones son generales y las tareas, ejemplos ilustrativos.

export const GRUPOS = {
  asistentes: 'Asistentes para pensar y escribir',
  conocimiento: 'Conocimiento y reuniones',
  automatizacion: 'Automatización',
  codigo: 'Código',
  creacion: 'Imagen, voz y video',
};

export const HERRAMIENTAS = {
  chatgpt: { que: 'Asistente conversacional de OpenAI para redactar, analizar, resumir y crear asistentes propios.', tarea: 'Convertir las notas de una visita comercial en una propuesta lista para enviar.' },
  claude: { que: 'Asistente de Anthropic que trabaja bien con documentos largos, redacción cuidada y análisis.', tarea: 'Revisar un contrato de 40 páginas y listar las cláusulas que requieren atención.' },
  gemini: { que: 'Asistente de Google integrado con Gmail, Docs, Sheets y Drive.', tarea: 'Resumir el hilo de correos de un cliente y redactar la respuesta desde Gmail.' },
  mscopilot: { que: 'Asistente de Microsoft dentro de Word, Excel, Outlook y Teams.', tarea: 'Pedirle a Excel un análisis de las ventas del trimestre por ciudad.' },
  perplexity: { que: 'Buscador con IA que responde citando sus fuentes.', tarea: 'Investigar la competencia de tu sector en Santander con enlaces para verificar.' },
  notebooklm: { que: 'Cuaderno de Google que responde solo a partir de los documentos que le das.', tarea: 'Cargar los manuales internos y responder las dudas de quien acaba de entrar.' },
  notion: { que: 'IA dentro de Notion para escribir, resumir y organizar wikis, notas y tareas.', tarea: 'Convertir el acta de una reunión en tareas con responsable y fecha.' },
  readai: { que: 'Asistente que transcribe y resume reuniones con sus acuerdos.', tarea: 'Recibir al terminar cada comité un resumen con decisiones y pendientes.' },
  make: { que: 'Plataforma visual para conectar aplicaciones y automatizar flujos sin escribir código.', tarea: 'Pasar cada registro del formulario web a una hoja de cálculo y avisar al equipo comercial.' },
  zapier: { que: 'Conecta miles de aplicaciones con disparadores y acciones automáticas.', tarea: 'Crear una tarea en el gestor del equipo cada vez que llega un correo de un cliente clave.' },
  ghcopilot: { que: 'Asistente de programación que sugiere, explica y revisa código.', tarea: 'Escribir el script que limpia y une los reportes que hoy se copian a mano.' },
  midjourney: { que: 'Genera imágenes a partir de una descripción en texto.', tarea: 'Explorar en minutos diez conceptos visuales para una campaña antes de pasarla a diseño.' },
  elevenlabs: { que: 'Genera voces y locuciones realistas a partir de texto.', tarea: 'Locutar un video de inducción sin reservar estudio de grabación.' },
  heygen: { que: 'Crea videos con avatares que presentan un guion.', tarea: 'Producir una cápsula de capacitación en varios idiomas a partir de un solo guion.' },
};
