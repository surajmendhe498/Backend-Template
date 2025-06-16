import {config} from 'dotenv';
config();

import app from './app.js';

const port= process.env.PORT || 6000

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});

