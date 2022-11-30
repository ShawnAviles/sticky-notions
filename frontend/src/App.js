import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid'
import NotesList from './components/NotesList';
import Search from './components/Search'
import Header from './components/Header'
// import { Routes, Route, Link } from "react-router-dom";
// import { Settings } from './components/Settings';
import { pageCreate, createNoteListObject, updatePageDelete } from './components/NotionCalls'

const App = () => {
	const [notes, setNotes] = useState([
			{
				id: "",
				header: "Header",
				text: "text",
				date: "00/00/0000"
			}
		]
	);
	const [searchText, setSearchText] = useState('');
	const [darkMode, setDarkMode] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false)

	useEffect(() => {
		const init = async () => {
			const initialList = await createNoteListObject('f0bbda566ba84f03ac8f404939bc35e1')
			if (initialList) {
    			setNotes(initialList);
				setLoading(false);
				setError(false);
			}
		}
		init().catch(() => setError(true));
	}, [])

	const addNote = (text, header) => {
		const date = new Date();
		let newNote = {
			id: '',
			header: header,
			text: text,
			date: date.toLocaleString()
		}
		
		//create notion page in database - 
		pageCreate(newNote.header, newNote.text, date.toISOString())
		.then((idValue) => newNote.id = idValue)
		.then(() => {
			const newNotes = [...notes, newNote];
			setNotes(newNotes);
		})
		.catch((err) => console.log('Failed to Add note',err));
	}

	const deleteNote = (id) => {
		const newNote = notes.filter((note) => note.id !== id);

		// update notion page from 'Live' to 'Archived'
		updatePageDelete(id)
		.then(() => setNotes(newNote))
		.catch(err => console.log('Unable to Archive Item\n',err));
	}

	// App.js
	// function Home() {
	// 	return (
	// 		<>
	// 			<main>
	// 				<h2>Welcome to the homepage!</h2>
	// 				<p>You can do this, I believe in you.</p>
	// 			</main>
	// 			<nav>
	// 				<Link to="/about">About</Link>
	// 			</nav>
	// 		</>
	// 	);
	// }

	// function About() {
	// 	return (
	// 		<>
	// 			<main>
	// 				<h2>Who are we?</h2>
	// 				<p>
	// 					That feels like an existential question, don't you
	// 					think?
	// 				</p>
	// 			</main>
	// 			<nav>
	// 				<Link to="/">Home</Link>
	// 			</nav>
	// 		</>
	// 	);
	// }

	return  (
		<div className={`${darkMode && 'dark-mode'}`}>
			<div className = 'container'>
				<Header handleToggleDarkMode = {setDarkMode}/>
				{/* <Routes>
					<Route path="/" element={<App />} />
					<Route path="about" element={<About />} />
				</Routes> */}
				<Search handleSearchNote = {setSearchText}/>
				<NotesList
					loadingStatus = {loading}
					errorStatus = {error}
					keyValue = {nanoid()} // kind of just doing this to ignore the error 
					notes = {
						notes.filter(note => {
							return note.text.toLowerCase().includes(searchText.toLowerCase()) || note.header.toLowerCase().includes(searchText.toLowerCase())
						})
					}  // search
					handleAddNote = {addNote}
					handleDeleteNote = {deleteNote}
				/>
			</div>
		</div>
	)
};

export default App;
