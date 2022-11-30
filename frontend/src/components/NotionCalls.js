import axios from "axios";

const pageCreate = async (header, text, date) => {
  const data = {
    header: header,
    text: text,
    date: date
  };
  const res = await axios.post("http://localhost:3001/pageCreate", data);
  return res.data;
}

const updatePageDelete = async (pageID) => {
  const data = {
    pageID: pageID
  };
  const res = await axios.post("http://localhost:3001/updatePageDelete", data);
  return res.data;
}

const createNoteListObject = async (databaseID) => {
  const data = {
    databaseID: databaseID
  };
  const res = await axios.post("http://localhost:3001/createNoteListObject", data);
  console.log(res);
  return res.data;
}

export { pageCreate, updatePageDelete, createNoteListObject}
