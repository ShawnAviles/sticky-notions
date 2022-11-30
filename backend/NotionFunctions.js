import axios from "axios";
import rateLimit from 'axios-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

/* ADD PAGE TO BOARD DATABASE */
const pageCreate = async (header, text, date) => {
  const token = process.env.NOTION_TOKEN;
  const options = {
    method: 'POST',
    url: 'https://api.notion.com/v1/pages',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
      'Content-Type': 'application/json'
    },
    data: {
      parent: {
        database_id: process.env.DATABASE_ID_BOARD,
      },
      properties: {
        'Name': {
          title: [
            {
              type: 'text',
              text: {
                content: `${header}`,
              },
            },
          ],
        },
        Status: {
          select : {
            name : "Live"
          }
        },
        Created: {
          date: {
            start: `${date}`,
          }
        }
      },
      children : [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `${text}`
                },
              },
            ],
          },
        },
      ],
    }
  };
  const res = await axios.request(options);
  return res.data.id;
}

const updatePageDelete = async (id) => {
  const token = process.env.NOTION_TOKEN;
  const options = {
    method: 'PATCH',
    url: `https://api.notion.com/v1/pages/${id}`,
    headers: { 
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'Accept-Encoding': null
    },
    data: {archived: true}
  };
  await axios.request(options);
}

/* QUERYING DATA */
const retrieveDatabaseID = async (id) => {
  const limit = rateLimit(axios.create(), {maxRequests: 3, perMilliseconds: 1000});
  const token = process.env.NOTION_TOKEN;
  let arrayID = [];
  const options = {
    method: 'POST',
    url: `https://api.notion.com/v1/databases/${id}/query`,
    headers: {
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'Accept-Encoding': null
    }
  };
  const response = await limit.request(options);

  response.data.results.forEach(element => arrayID.push(element.id));
  return arrayID;
}

const retrieveTitles = async (id) => {
  const limit = rateLimit(axios.create(), {maxRequests: 3, perMilliseconds: 1200});
  const token = process.env.NOTION_TOKEN;
  let arrayTitles = [];
  const options = {
    method: 'POST',
    url: `https://api.notion.com/v1/databases/${id}/query`,
    headers: {
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'Accept-Encoding': null
    }
  };
  const response = await limit.request(options);
  response.data.results.forEach(element => arrayTitles.push(element.properties.Name.title[0].plain_text));
  return arrayTitles;
}

const retrieveDates = async (id) => {
  const token = process.env.NOTION_TOKEN;
  let arrayDates = [];
  const options = {
    method: 'POST',
    url: `https://api.notion.com/v1/databases/${id}/query`,
    headers: {
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'Accept-Encoding': null
    },
  };
  const response = await axios.request(options);
  response.data.results.forEach(element => arrayDates.push(element.properties.Created.date.start));
  return arrayDates;
}

const retrieveBlock = async (id) => {
  const limit = rateLimit(axios.create(), {maxRequests: 3, perMilliseconds: 1200});
  const token = process.env.NOTION_TOKEN;
  const options = {
    method: 'GET',
    url: `https://api.notion.com/v1/blocks/${id}/children`,
    params: {page_size: '100'},
    headers: {
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'Accept-Encoding': null
    }
  };
  const response = await limit.request(options);
  return response.data.results[0].paragraph.rich_text[0].plain_text;
}

const createNoteListObject = async (databaseID) => {
  let listObjects = [];
  const arrayID = await retrieveDatabaseID(databaseID);
  const arrayTitles = await retrieveTitles(databaseID);
  const arrayDates = await retrieveDates(databaseID);
  for (let i = 0; i < arrayID.length; i++) {
    let note = {
      id: '',
      header: '',
      text: '',
      date: '',
    }
    note.id = arrayID[i];
    const blockText = await retrieveBlock(arrayID[i]);
    note.header = arrayTitles[i];
    note.text = blockText;
    const localDate = new Date(arrayDates[i]);
    note.date = localDate.toLocaleString();
    listObjects.push(note);
  }
  return listObjects;
}

export { pageCreate, updatePageDelete, createNoteListObject };
