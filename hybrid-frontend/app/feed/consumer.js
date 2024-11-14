// src/consumer.js
import { createConsumer } from '@rails/actioncable';
import { REACT_APP_API_WL } from '@env';
const apiWl = REACT_APP_API_WL;
// Aquí debes ajustar la URL a tu servidor backend (Rails)
const consumer = createConsumer(`${apiWl}/cable`);

export default consumer;
