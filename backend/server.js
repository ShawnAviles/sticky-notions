import { pageCreate, createNoteListObject, updatePageDelete } from './NotionFunctions.js';
import bodyParser  from 'body-parser';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());	// decode json encoded bodies that are received from post requests

app.get('/', (req, res) => {
	res.send("GET got");
})

app.post('/pageCreate', (req, res) => { 
	const { header, text, date } = req.body;
	pageCreate(header, text, date)
		.then(newPageID => res.send(newPageID))
		.catch(err => console.log(err));
});

app.post('/updatePageDelete', (req, res) => { 
	const { pageID } = req.body;
	updatePageDelete(pageID)
		.then(arrayID => res.send(arrayID))
		.catch(err => console.log(err));
});

app.post('/createNoteListObject', (req, res) => {
	const { databaseID } = req.body;
	createNoteListObject(databaseID)
		.then(listObjects => res.send(listObjects))
		.catch(err => console.log(err));
});

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); 
