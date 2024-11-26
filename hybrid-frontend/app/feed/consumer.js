import { createConsumer } from '@rails/actioncable';
import { REACT_APP_API_WL } from '@env';

const consumer = createConsumer(`${REACT_APP_API_WL}/cable`);

export default consumer;
